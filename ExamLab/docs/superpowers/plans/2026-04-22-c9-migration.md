# C9 Phase 4 — Teilerklärungs-Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ~2400 bestehende Fragen mit einheitlich KI-generierten Musterlösungen + pro-Sub-Element-Teilerklärungen ausstatten, sicher und sorgfältig, über ~24 Claude-Code-Sessions.

**Architecture:** Node-Skript-Pipeline (dump → bearbeiten → upload) mit Apps-Script-Admin-Endpoints. Zwischen dump und upload bearbeitet **Claude Code selbst** (dieses Tool) die Fragen in Batches à 100, generiert strukturierte JSON-Updates. State-Datei für Resume zwischen Sessions. Partial-Update-Semantik im Backend (nur `musterlosung` + `typDaten.<feld>[i].erklaerung` + Meta-Flags werden angerührt, alles andere bleibt unangetastet).

**Tech Stack:** Node 20+ (ohne externe Dependencies), Apps-Script V8, JSONL-Datenformat, SHA-less State-Datei.

**Spec:** `ExamLab/docs/superpowers/specs/2026-04-22-c9-migration-design.md`

---

## Phase 0 — Cleanup + Setup (30 Min)

### Task 0.1: Bestehendes SDK-basiertes Skript entfernen

**Files:**
- Delete: `ExamLab/scripts/migrate-teilerklaerungen/migrate.mjs`
- Delete: `ExamLab/scripts/migrate-teilerklaerungen/prompts.mjs`

Das bisherige `migrate.mjs` (von Commit `1ec47f0`) ruft Anthropic-SDK → wird durch dump/upload + Claude-Code-Bearbeitung ersetzt. `prompts.mjs` enthielt Apps-Script-Prompt-Mirror für SDK-Calls — mit dem neuen Ansatz generiere ich (Claude Code) die Teilerklärungen direkt, keine Prompt-Datei nötig.

- [ ] **Step 0.1.1: Löschen**

```bash
rm ExamLab/scripts/migrate-teilerklaerungen/migrate.mjs
rm ExamLab/scripts/migrate-teilerklaerungen/prompts.mjs
```

- [ ] **Step 0.1.2: package.json bereinigen — SDK-Dependency raus**

Ersetze `ExamLab/scripts/migrate-teilerklaerungen/package.json` komplett:

```json
{
  "name": "migrate-teilerklaerungen",
  "version": "2.0.0",
  "description": "C9 Phase 4 — Backfill-Migration via Claude Code (keine SDK-Dependency)",
  "type": "module",
  "private": true,
  "scripts": {
    "dump": "node dump.mjs",
    "review": "node review-generator.mjs",
    "upload": "node upload.mjs"
  },
  "engines": {
    "node": ">=20.11"
  }
}
```

- [ ] **Step 0.1.3: .gitignore aktualisieren**

```
node_modules/
fragen-input.jsonl
fragen-updates.jsonl
state.json
stichprobe-review.md
stichprobe-ids.json
upload.log
.env
*.log
```

- [ ] **Step 0.1.4: Commit**

```bash
cd "10 Github/GYM-WR-DUY"
git add ExamLab/scripts/migrate-teilerklaerungen/
git commit -m "C9 Phase 4: Migrate.mjs + Anthropic-SDK entfernt (ersetzt durch Claude-Code-Pipeline)"
```

### Task 0.2: SESSION-PROTOCOL.md erstellen

**Files:**
- Create: `ExamLab/scripts/migrate-teilerklaerungen/SESSION-PROTOCOL.md`

Dokumentation wie Claude Code pro Session arbeitet. Nicht für Automation, sondern als Leitfaden falls eine andere Claude-Instanz oder späterer Ich den Lauf fortsetzt.

- [ ] **Step 0.2.1: Write file**

```markdown
# Claude-Code Session Protocol

## Pro Session

### 1. State laden
Read `state.json`. Bestimme:
- `verarbeitet` — wie viele Fragen schon done
- `fragen` — Map von frage-ID → status

### 2. Next Batch auswählen
Read `fragen-input.jsonl`, iteriere alle Fragen.
Filter: `state.fragen[id]?.status !== 'done'` UND nicht in skip-Liste.
Nimm erste `BATCH_SIZE=100` (oder was übrig ist).

### 3. Pro Frage generieren
Für jede Frage im Batch:
1. Parse Frage-Objekt
2. Generiere Musterlösung (2-4 Sätze) + Teilerklärungen nach Spec §5
3. Validiere Output-Shape (alle IDs aus korrekten Sub-Array, feld-Name korrekt)
4. Append als JSON-Zeile an `fragen-updates.jsonl`
5. Update state: `fragen[id] = {status:'done', zeitpunkt:ISO, teile:N}`

### 4. State speichern + Summary
Nach allen 100 Fragen:
- Write state.json (kompletter State, nicht nur Delta)
- Print Summary: "Batch N done. Total: X/2400 (Y%)."

### 5. Git-Commit
```bash
git add ExamLab/scripts/migrate-teilerklaerungen/state.json \
        ExamLab/scripts/migrate-teilerklaerungen/fragen-updates.jsonl
git commit -m "C9 Migration Session N: 100 Fragen verarbeitet (X/2400 total)"
git push
```

## Qualitäts-Baseline (aus Spec §5)

Vor jeder Generierung mental durchgehen:
1. 1-2 Sätze, max 30 Wörter pro Teilerklärung
2. Schweizer Hochdeutsch (ss, Franken, Schweizer Institutionen)
3. Bei Distraktor: Denkfehler benennen, nicht nur "falsch"
4. Recht-Artikel nur wenn SICHER (siehe Whitelist in Spec §5)
5. Keine Füllwörter
6. Neutrale 3. Person
7. Plain-Text (kein Markdown)

## Fehlerbehandlung

Falls Frage nicht bearbeitbar (kaputte Daten, Unklarheit, Unsicherheit):
- `state.fragen[id] = {status:'skip', grund:'...', zeitpunkt:ISO}`
- NICHT an `fragen-updates.jsonl` appenden
- Weiter mit nächster Frage

Am Session-Ende: Liste der Skip-Fragen im Summary. User kann manuell nacharbeiten.
```

- [ ] **Step 0.2.2: Commit**

```bash
git add ExamLab/scripts/migrate-teilerklaerungen/SESSION-PROTOCOL.md
git commit -m "C9 Phase 4: SESSION-PROTOCOL.md fuer Claude-Code-Sessions"
```

---

## Phase 1 — Node-Skripte (45 Min)

### Task 1.1: `dump.mjs`

**Files:**
- Create: `ExamLab/scripts/migrate-teilerklaerungen/dump.mjs`

Lädt alle Fragen via Apps-Script, schreibt als JSONL. Kein Anthropic-SDK, nur `fetch`.

- [ ] **Step 1.1.1: Skript schreiben**

```javascript
#!/usr/bin/env node
/**
 * C9 Phase 4 dump — Laedt ALLE Fragen aus Apps-Script und schreibt sie als JSONL.
 *
 * Usage:
 *   export APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
 *   export MIGRATION_EMAIL=admin@gymhofwil.ch
 *   node dump.mjs
 *
 * Output: fragen-input.jsonl (eine Frage pro Zeile)
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL
const MIGRATION_EMAIL = process.env.MIGRATION_EMAIL

if (!APPS_SCRIPT_URL) { console.error('FEHLER: APPS_SCRIPT_URL env nicht gesetzt'); process.exit(1) }
if (!MIGRATION_EMAIL) { console.error('FEHLER: MIGRATION_EMAIL env nicht gesetzt'); process.exit(1) }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT = path.join(__dirname, 'fragen-input.jsonl')

async function main() {
  console.log(`[dump] Lade Fragen von ${APPS_SCRIPT_URL.slice(0, 60)}...`)
  const r = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'holeAlleFragenFuerMigration',
      email: MIGRATION_EMAIL,
    }),
    redirect: 'follow',
  })
  if (!r.ok) throw new Error(`Apps-Script HTTP ${r.status}`)
  const json = await r.json()
  if (json.error) throw new Error(`Apps-Script: ${json.error}`)
  const fragen = json.data || []
  if (!Array.isArray(fragen)) throw new Error('Response data ist kein Array')

  // Pro Fachbereich zaehlen fuer Sanity-Check
  const counts = {}
  for (const f of fragen) {
    counts[f.fachbereich || 'unbekannt'] = (counts[f.fachbereich || 'unbekannt'] || 0) + 1
  }

  // JSONL schreiben
  const lines = fragen.map((f) => JSON.stringify(f)).join('\n') + '\n'
  await fs.writeFile(OUTPUT, lines)

  console.log(`[dump] ${fragen.length} Fragen geschrieben nach ${OUTPUT}`)
  console.log(`[dump] Pro Fachbereich:`, counts)
}

main().catch((e) => { console.error('[dump] Abbruch:', e.message); process.exit(1) })
```

- [ ] **Step 1.1.2: Commit**

```bash
git add ExamLab/scripts/migrate-teilerklaerungen/dump.mjs
git commit -m "C9 Phase 4: dump.mjs - Fragen via Apps-Script laden"
```

### Task 1.2: `review-generator.mjs`

**Files:**
- Create: `ExamLab/scripts/migrate-teilerklaerungen/review-generator.mjs`

Generiert `stichprobe-review.md` aus Input + Updates + gewählten 30 Stichproben-IDs.

- [ ] **Step 1.2.1: Skript schreiben**

```javascript
#!/usr/bin/env node
/**
 * C9 Phase 4 review-generator — MD-Report fuer Stichproben-Review.
 *
 * Liest: fragen-input.jsonl, fragen-updates.jsonl, stichprobe-ids.json
 * Schreibt: stichprobe-review.md (mit alter vs. neuer Musterloesung,
 *           pro-Option Teilerklaerung, Fach/Bloom/Typ im Header)
 *
 * Usage: node review-generator.mjs
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const INPUT = path.join(__dirname, 'fragen-input.jsonl')
const UPDATES = path.join(__dirname, 'fragen-updates.jsonl')
const IDS = path.join(__dirname, 'stichprobe-ids.json')
const OUTPUT = path.join(__dirname, 'stichprobe-review.md')

async function loadJSONL(file) {
  const text = await fs.readFile(file, 'utf8')
  return text.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l))
}

function subArrayFuerTyp(frage) {
  switch (frage.typ) {
    case 'mc': return { arr: frage.optionen, feld: 'optionen' }
    case 'richtigfalsch': return { arr: frage.aussagen, feld: 'aussagen' }
    case 'lueckentext': return { arr: frage.luecken, feld: 'luecken' }
    case 'hotspot': return { arr: frage.bereiche, feld: 'bereiche' }
    case 'dragdrop_bild': return { arr: frage.zielzonen, feld: 'zielzonen' }
    case 'bildbeschriftung': return { arr: frage.beschriftungen, feld: 'beschriftungen' }
    case 'kontenbestimmung': return { arr: frage.aufgaben, feld: 'aufgaben' }
    case 'buchungssatz': return { arr: frage.buchungen, feld: 'buchungen' }
    case 'bilanzstruktur': return { arr: frage.kontenMitSaldi, feld: 'kontenMitSaldi' }
    default: return { arr: null, feld: '' }
  }
}

function elementLabel(el, feld, i) {
  if (feld === 'optionen' || feld === 'aussagen') return el.text || '(leer)'
  if (feld === 'kontenMitSaldi') return `${el.kontonummer} ${el.name || ''}`
  if (feld === 'buchungen') return `${el.sollKonto} an ${el.habenKonto} CHF ${el.betrag}`
  if (feld === 'luecken') return el.korrekteAntworten?.[0] || '(leer)'
  if (feld === 'bereiche') return el.label || `Bereich ${i + 1}`
  if (feld === 'zielzonen') return el.korrektesLabel || `Zone ${i + 1}`
  if (feld === 'beschriftungen') return el.korrekt?.[0] || `Stelle ${i + 1}`
  if (feld === 'aufgaben') return el.text || `Aufgabe ${i + 1}`
  return `#${i + 1}`
}

function elementId(el, feld) {
  return feld === 'kontenMitSaldi' ? el.kontonummer : el.id
}

async function main() {
  const [fragen, updates, idsData] = await Promise.all([
    loadJSONL(INPUT),
    loadJSONL(UPDATES),
    fs.readFile(IDS, 'utf8').then(JSON.parse),
  ])
  const fragenById = new Map(fragen.map((f) => [f.id, f]))
  const updatesById = new Map(updates.map((u) => [u.id, u]))
  const stichproben = idsData.ids.map((id) => fragenById.get(id)).filter(Boolean)

  const md = ['# Stichproben-Review (30 Fragen)\n']
  md.push(`Generiert: ${new Date().toISOString()}\n`)
  md.push(`Seed: ${idsData.seed}\n`)
  md.push(`\n---\n\n`)

  for (const frage of stichproben) {
    const update = updatesById.get(frage.id)
    if (!update) {
      md.push(`## [SKIP] ${frage.id} — noch nicht verarbeitet\n\n---\n\n`)
      continue
    }
    const header = `${frage.fachbereich} · ${frage.bloom} · ${frage.typ.toUpperCase()}`
    md.push(`## [${header}] Frage ${frage.id}\n`)
    md.push(`**Fragetext:** ${frage.fragetext}\n\n`)

    const { arr, feld } = subArrayFuerTyp(frage)
    if (arr && arr.length > 0) {
      md.push(`### Sub-Elemente (${feld})\n`)
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i]
        const korrektMarker = el.korrekt === true ? ' (korrekt)' : ''
        md.push(`- ${i + 1}. ${elementLabel(el, feld, i)}${korrektMarker}`)
      }
      md.push('')
    }

    md.push(`### Alte Musterlösung (aus DB)\n> ${(frage.musterlosung || '(leer)').replace(/\n/g, '\n> ')}\n\n`)
    md.push(`### NEUE Musterlösung (Claude Code)\n> ${update.musterlosung.replace(/\n/g, '\n> ')}\n\n`)

    if (update.teilerklaerungen && update.teilerklaerungen.length > 0) {
      md.push(`### NEUE Teilerklärungen (Claude Code)\n`)
      for (const t of update.teilerklaerungen) {
        const idx = arr?.findIndex((el) => elementId(el, feld) === t.id) ?? -1
        const label = idx >= 0 ? elementLabel(arr[idx], feld, idx) : t.id
        md.push(`- **${label}:** ${t.text}`)
      }
      md.push('')
    } else if (arr && arr.length > 0) {
      md.push(`### NEUE Teilerklärungen: _(keine — Fragetyp hat keine Teilerklärungs-Struktur)_\n\n`)
    }

    md.push('---\n\n')
  }

  await fs.writeFile(OUTPUT, md.join('\n'))
  console.log(`[review] ${stichproben.length} Fragen nach ${OUTPUT} geschrieben`)
}

main().catch((e) => { console.error('[review] Abbruch:', e.message); process.exit(1) })
```

- [ ] **Step 1.2.2: Commit**

```bash
git add ExamLab/scripts/migrate-teilerklaerungen/review-generator.mjs
git commit -m "C9 Phase 4: review-generator.mjs - MD-Report fuer Stichprobe"
```

### Task 1.3: `upload.mjs`

**Files:**
- Create: `ExamLab/scripts/migrate-teilerklaerungen/upload.mjs`

Gruppiert `fragen-updates.jsonl` nach Fachbereich, ruft `batchUpdateFragenMigration` pro Fachbereich einmal auf.

- [ ] **Step 1.3.1: Skript schreiben**

```javascript
#!/usr/bin/env node
/**
 * C9 Phase 4 upload — Schreibt Migration-Updates via Apps-Script-Batch-Endpoint.
 *
 * Liest fragen-updates.jsonl, gruppiert nach fachbereich, ruft pro Fachbereich
 * einmal batchUpdateFragenMigration auf (~800 Updates pro Call).
 *
 * Bei Apps-Script-Timeout (5 min): split Call in Haelften + retry.
 *
 * Usage:
 *   export APPS_SCRIPT_URL=...
 *   export MIGRATION_EMAIL=...
 *   node upload.mjs [--dry-run] [--fachbereich=VWL]
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL
const MIGRATION_EMAIL = process.env.MIGRATION_EMAIL

if (!APPS_SCRIPT_URL) { console.error('FEHLER: APPS_SCRIPT_URL env nicht gesetzt'); process.exit(1) }
if (!MIGRATION_EMAIL) { console.error('FEHLER: MIGRATION_EMAIL env nicht gesetzt'); process.exit(1) }

const DRY_RUN = process.argv.includes('--dry-run')
const FACHBEREICH_FILTER = (() => {
  const arg = process.argv.find((a) => a.startsWith('--fachbereich='))
  return arg ? arg.split('=')[1] : null
})()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPDATES = path.join(__dirname, 'fragen-updates.jsonl')
const LOG = path.join(__dirname, 'upload.log')

async function appendLog(line) {
  await fs.appendFile(LOG, `[${new Date().toISOString()}] ${line}\n`)
}

async function appsScriptCall(fachbereich, updates) {
  const r = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'batchUpdateFragenMigration',
      email: MIGRATION_EMAIL,
      fachbereich,
      updates,
    }),
    redirect: 'follow',
  })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

async function uploadFachbereich(fachbereich, updates) {
  console.log(`[upload] ${fachbereich}: ${updates.length} Updates...`)
  await appendLog(`${fachbereich}: starte mit ${updates.length} Updates`)
  if (DRY_RUN) {
    console.log(`[upload] DRY-RUN: skip Apps-Script-Call`)
    return { success: true, aktualisiert: updates.length, nichtGefunden: [] }
  }
  try {
    const res = await appsScriptCall(fachbereich, updates)
    await appendLog(`${fachbereich}: response ${JSON.stringify(res)}`)
    if (res.error) throw new Error(`Apps-Script: ${res.error}`)
    return res
  } catch (e) {
    // Bei Timeout: Haelfte
    if (e.message.includes('timeout') || e.message.includes('exceeded') || updates.length > 50) {
      console.warn(`[upload] ${fachbereich} Fehler (${e.message}) — split in Haelften`)
      const mid = Math.floor(updates.length / 2)
      const r1 = await uploadFachbereich(fachbereich, updates.slice(0, mid))
      const r2 = await uploadFachbereich(fachbereich, updates.slice(mid))
      return {
        success: r1.success && r2.success,
        aktualisiert: r1.aktualisiert + r2.aktualisiert,
        nichtGefunden: [...(r1.nichtGefunden || []), ...(r2.nichtGefunden || [])],
      }
    }
    throw e
  }
}

async function main() {
  const text = await fs.readFile(UPDATES, 'utf8')
  const alle = text.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l))
  console.log(`[upload] ${alle.length} Updates in ${UPDATES}`)

  // Gruppiere nach fachbereich
  const proFach = {}
  for (const u of alle) {
    const fb = u.fachbereich
    if (FACHBEREICH_FILTER && fb !== FACHBEREICH_FILTER) continue
    if (!proFach[fb]) proFach[fb] = []
    proFach[fb].push({
      id: u.id,
      musterlosung: u.musterlosung,
      teilerklaerungen: u.teilerklaerungen || [],
    })
  }

  const results = {}
  for (const fachbereich of Object.keys(proFach).sort()) {
    results[fachbereich] = await uploadFachbereich(fachbereich, proFach[fachbereich])
  }

  console.log('\n[upload] === ZUSAMMENFASSUNG ===')
  for (const [fb, r] of Object.entries(results)) {
    console.log(`  ${fb}: aktualisiert=${r.aktualisiert}, nichtGefunden=${r.nichtGefunden?.length || 0}`)
    if (r.nichtGefunden?.length) {
      console.log(`    IDs: ${r.nichtGefunden.join(', ')}`)
    }
  }
  await appendLog(`FERTIG: ${JSON.stringify(results)}`)
}

main().catch((e) => { console.error('[upload] Abbruch:', e.message); process.exit(1) })
```

- [ ] **Step 1.3.2: Commit**

```bash
git add ExamLab/scripts/migrate-teilerklaerungen/upload.mjs
git commit -m "C9 Phase 4: upload.mjs - batch-update via Apps-Script"
```

### Task 1.4: README.md aktualisieren

**Files:**
- Modify: `ExamLab/scripts/migrate-teilerklaerungen/README.md`

- [ ] **Step 1.4.1: Komplett neu schreiben**

```markdown
# C9 Phase 4 — Teilerklärungs-Migration

Einmalige Migration: ~2400 bestehende ExamLab-Fragen bekommen einheitlich KI-generierte
Musterlösungen + pro-Sub-Element-Teilerklärungen. Bearbeitet von **Claude Code** (keine
externe SDK-Dependency, nutzt Subscription des Users).

**Spec:** `../../docs/superpowers/specs/2026-04-22-c9-migration-design.md`
**Plan:** `../../docs/superpowers/plans/2026-04-22-c9-migration.md`

## Voraussetzungen

- **Node >= 20.11**
- **Apps-Script-URL** der Produktions-Bereitstellung (nach Deploy des Batch-Endpoints)
- **LP-E-Mail mit `rolle=admin`**
- **Google-Sheets-Backup der Fragenbank** (Pflicht vor Migration!)

## Workflow (6 Phasen)

### Phase A: Setup

1. Google-Sheets-Backup: Drive → Fragenbank → Datei → **Kopie erstellen** → `ExamLab_Fragenbank_Backup_YYYY-MM-DD`
2. Apps-Script neu deployen (mit `batchUpdateFragenMigration` + `holeAlleFragenFuerMigration` aktiviert)
3. Produktions-Pause: keine Frage-Bearbeitung während Migration läuft
4. Env-Variablen setzen:
   ```bash
   export APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
   export MIGRATION_EMAIL=admin@gymhofwil.ch
   ```

### Phase B: Dump (einmalig)

```bash
cd ExamLab/scripts/migrate-teilerklaerungen
node dump.mjs
```

Output: `fragen-input.jsonl` (~2400 Zeilen). Plausibilitäts-Check:

```bash
wc -l fragen-input.jsonl    # ~2400
```

### Phase C: Stichprobe (Claude-Code Session 1)

Claude Code bearbeitet 30 Stichproben-Fragen (seed=42, alle 9 Teilerklärungs-Typen abgedeckt).
Nach Abschluss der Stichprobe:

```bash
node review-generator.mjs
```

Output: `stichprobe-review.md` — User reviewt, gibt Freigabe oder Änderungs-Feedback.

### Phase D: Full-Run (Claude-Code Sessions 2-24)

Pro Session: 100 Fragen, Resume via `state.json`. Updates appended an `fragen-updates.jsonl`.

Siehe `SESSION-PROTOCOL.md` für den genauen Ablauf pro Session.

### Phase E: Upload

Nach allen ~2400 Fragen in `fragen-updates.jsonl`:

```bash
# Optional: Dry-Run zum Prüfen
node upload.mjs --dry-run

# Echter Upload
node upload.mjs
```

Output: 3 Apps-Script-Calls (VWL, BWL, Recht — Informatik ausgelassen). Log in `upload.log`.

Verifikation:
- `aktualisiert`-Count pro Fachbereich == erwartete Count aus `fragen-updates.jsonl`?
- `nichtGefunden`-Liste leer (keine ID nicht gematcht)?
- 5 Fragen pro Fachbereich manuell im SuS-Üben-Modus prüfen → Teilerklärungen sichtbar?

### Phase F: Nachbereitung

Nach Migration sind **alle Fragen `pruefungstauglich=false`**. Das ist beabsichtigt. User
geht im Editor pro Frage durch + setzt `pruefungstauglich=true` nach Review. Nicht Teil
dieses Skripts.

## Dateien

| Datei | Rolle |
|---|---|
| `dump.mjs` | Lädt alle Fragen via Apps-Script, schreibt `fragen-input.jsonl` |
| `review-generator.mjs` | Baut `stichprobe-review.md` aus Input + Updates + IDs |
| `upload.mjs` | Schreibt Updates via Apps-Script pro Fachbereich |
| `SESSION-PROTOCOL.md` | Leitfaden für Claude-Code-Session |
| `state.json` | Resume-State — NIE committet, lokal |
| `fragen-input.jsonl` | Dump-Output — NIE committet, lokal |
| `fragen-updates.jsonl` | Claude-Code-Output — NIE committet, lokal |
| `stichprobe-ids.json` | 30 Stichproben-IDs (seed=42) — NIE committet, lokal |
| `upload.log` | Upload-History — NIE committet, lokal |

## Rollback

Bei Problemen:
1. Drive öffnen → Backup-Kopie umbenennen → Live-Fragenbank ersetzen
2. Apps-Script Cache via neuem Deploy invalidieren

Kein Frontend-Deploy nötig.

## Kosten

Keine (Claude-Code-Subscription + Apps-Script-Quoten reichen aus).
```

- [ ] **Step 1.4.2: Commit**

```bash
git add ExamLab/scripts/migrate-teilerklaerungen/README.md
git commit -m "C9 Phase 4: README.md auf Claude-Code-Pipeline umgestellt"
```

---

## Phase 2 — Apps-Script `batchUpdateFragenMigration` (1 Std)

### Task 2.1: Endpoint + Helper implementieren

**Files:**
- Modify: `ExamLab/apps-script-code.js`

- [ ] **Step 2.1.1: Dispatcher-Case ergänzen**

Im `doPost`-Switch (Zeile ~892 in der Nähe von `speichereFrage`) einen Case hinzufügen.

Finde:
```js
    case 'holeAlleFragenFuerMigration':
      return holeAlleFragenFuerMigrationEndpoint(body);
```

Ersetze durch:
```js
    case 'holeAlleFragenFuerMigration':
      return holeAlleFragenFuerMigrationEndpoint(body);
    case 'batchUpdateFragenMigration':
      return batchUpdateFragenMigrationEndpoint(body);
```

- [ ] **Step 2.1.2: Endpoint-Funktion implementieren**

Füge nach `holeAlleFragenFuerMigrationEndpoint` (suche diesen Namen im File) neue Funktion ein:

```js
/**
 * C9 Phase 4 Task 2 — Batch-Update-Endpoint fuer Migration.
 *
 * Partial-Update-Semantik (Spec §8): NUR musterlosung, typDaten (nur die
 * erklaerung-Subfelder), pruefungstauglich, geaendertAm, poolContentHash werden
 * ueberschrieben. Alles andere (fragetext, Optionen-Text, korrekt-Flags, tags,
 * punkte, thema, bloom, autor etc.) bleibt 1:1 wie es war.
 *
 * Request-Body: {
 *   action: 'batchUpdateFragenMigration',
 *   email: '<admin-lp>',
 *   fachbereich: 'VWL'|'BWL'|'Recht'|'Informatik',
 *   updates: [
 *     { id: '<frage-id>', musterlosung: '<text>',
 *       teilerklaerungen: [{ feld: 'optionen', id: 'opt-a', text: '...' }, ...] }
 *   ]
 * }
 *
 * Response: {
 *   success: true, aktualisiert: N, nichtGefunden: [ids]
 * }
 */
function batchUpdateFragenMigrationEndpoint(body) {
  try {
    var email = body.email;
    if (!email || !istZugelasseneLP(email)) {
      return jsonResponse({ error: 'Nur für Lehrpersonen' });
    }
    var lpInfo = getLPInfo(email);
    if (!lpInfo || lpInfo.rolle !== 'admin') {
      return jsonResponse({ error: 'Nur für Admins' });
    }
    var fachbereich = body.fachbereich;
    if (['VWL','BWL','Recht','Informatik'].indexOf(fachbereich) < 0) {
      return jsonResponse({ error: 'Ungültiger fachbereich: ' + fachbereich });
    }
    var updates = body.updates;
    if (!Array.isArray(updates) || updates.length === 0) {
      return jsonResponse({ error: 'updates[] erwartet' });
    }

    var fragenbank = SpreadsheetApp.openById(FRAGENBANK_ID);
    var sheet = fragenbank.getSheetByName(fachbereich);
    if (!sheet) return jsonResponse({ error: 'Sheet ' + fachbereich + ' nicht gefunden' });

    // Gesamte Sheet-Daten lesen
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    if (lastRow < 2 || lastCol < 1) {
      return jsonResponse({ error: 'Sheet ist leer' });
    }
    var allData = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    var headers = allData[0].map(String);
    var idCol = headers.indexOf('id');
    var typCol = headers.indexOf('typ');
    var musterlosungCol = headers.indexOf('musterlosung');
    var typDatenCol = headers.indexOf('typDaten');
    var pruefungstauglichCol = headers.indexOf('pruefungstauglich');
    var geaendertAmCol = headers.indexOf('geaendertAm');
    var poolContentHashCol = headers.indexOf('poolContentHash');

    if (idCol < 0 || typCol < 0 || musterlosungCol < 0 || typDatenCol < 0) {
      return jsonResponse({ error: 'Pflicht-Spalten fehlen im Sheet (id/typ/musterlosung/typDaten)' });
    }

    // ID → rowIndex (1-based, inkl. Header-Offset)
    var idToRow = {};
    for (var r = 1; r < allData.length; r++) {
      var id = String(allData[r][idCol] || '');
      if (id) idToRow[id] = r; // rowIndex 0-basiert in allData, 1-basiert: r+1
    }

    var nichtGefunden = [];
    var aktualisiert = 0;
    var nowIso = new Date().toISOString();

    for (var u = 0; u < updates.length; u++) {
      var upd = updates[u];
      if (!upd || !upd.id) continue;
      var rowIdx = idToRow[upd.id];
      if (rowIdx === undefined) {
        nichtGefunden.push(upd.id);
        continue;
      }
      var row = allData[rowIdx];
      var typ = String(row[typCol] || '');
      var typDatenRaw = String(row[typDatenCol] || '{}');
      var typDaten;
      try { typDaten = JSON.parse(typDatenRaw); } catch (e) { typDaten = {}; }

      // Teilerklaerungen in typDaten einarbeiten
      if (Array.isArray(upd.teilerklaerungen)) {
        for (var t = 0; t < upd.teilerklaerungen.length; t++) {
          var te = upd.teilerklaerungen[t];
          if (!te || !te.feld || !te.id || !te.text) continue;
          var arr = typDaten[te.feld];
          if (!Array.isArray(arr)) continue;
          var idKey = te.feld === 'kontenMitSaldi' ? 'kontonummer' : 'id';
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] && String(arr[i][idKey] || '') === String(te.id)) {
              arr[i].erklaerung = te.text;
              break;
            }
          }
        }
      }

      // Row-Werte ueberschreiben
      row[musterlosungCol] = String(upd.musterlosung || '');
      row[typDatenCol] = JSON.stringify(typDaten);
      if (pruefungstauglichCol >= 0) row[pruefungstauglichCol] = ''; // false
      if (geaendertAmCol >= 0) row[geaendertAmCol] = nowIso;
      if (poolContentHashCol >= 0) row[poolContentHashCol] = ''; // neu berechnen beim naechsten Check

      aktualisiert++;
    }

    // Alle Daten zurueckschreiben (ein setValues-Call)
    sheet.getRange(1, 1, allData.length, headers.length).setValues(allData);

    // Cache invalidieren
    try { cacheInvalidieren_(); } catch (e) { /* ignore */ }

    return jsonResponse({
      success: true,
      fachbereich: fachbereich,
      aktualisiert: aktualisiert,
      nichtGefunden: nichtGefunden,
    });
  } catch (error) {
    return jsonResponse({ error: String(error && error.message || error) });
  }
}
```

- [ ] **Step 2.1.3: Test-Shim im Apps-Script**

Füge nach `testC9Privacy_` eine Test-Funktion ein, die den Endpoint offline testet:

```js
/**
 * C9 Phase 4 — Test-Shim fuer batchUpdateFragenMigrationEndpoint.
 *
 * Testet Partial-Update-Semantik + ID-Match + nichtGefunden-Handling.
 * Achtung: Schreibt IN DIE ECHTE FRAGENBANK wenn nicht vorsichtig! Der Test
 * waehlt nur 1 Frage aus dem BWL-Tab und ueberschreibt ihre musterlosung auf
 * einen Marker — User muss danach manuell die Frage wieder restaurieren oder
 * einfach ignorieren (Marker ist erkennbar).
 */
function testC9BatchUpdateFragenMigration() {
  return testC9BatchUpdateFragenMigration_();
}

function testC9BatchUpdateFragenMigration_() {
  function assert_(cond, msg) { if (!cond) throw new Error('Assertion fehlgeschlagen: ' + msg); }
  var EMAIL = 'wr.test@gymhofwil.ch'; // ggf. anpassen

  // 1. Eine beliebige MC-Frage aus BWL laden
  var fragenbank = SpreadsheetApp.openById(FRAGENBANK_ID);
  var sheet = fragenbank.getSheetByName('BWL');
  var data = getSheetData(sheet);
  var mcFrage = null;
  for (var i = 0; i < data.length; i++) {
    if (data[i].typ === 'mc') { mcFrage = data[i]; break; }
  }
  assert_(mcFrage, 'Keine MC-Frage in BWL gefunden');
  var testId = mcFrage.id;
  var originalMusterlosung = mcFrage.musterlosung;
  Logger.log('Test-Frage: ' + testId + ' (original musterlosung: ' + String(originalMusterlosung).slice(0,40) + ')');

  // 2. Marker-Update senden
  var markerText = '[TEST-MARKER ' + new Date().toISOString() + '] Migration-Test ok';
  var body = {
    action: 'batchUpdateFragenMigration',
    email: EMAIL,
    fachbereich: 'BWL',
    updates: [
      { id: testId, musterlosung: markerText, teilerklaerungen: [] },
      { id: 'definitely-not-existing-id-xyz', musterlosung: 'should not apply', teilerklaerungen: [] }
    ]
  };
  var r = batchUpdateFragenMigrationEndpoint(body);
  var res = JSON.parse(r.getContent());
  Logger.log('Response: ' + JSON.stringify(res, null, 2));

  // 3. Assertions
  assert_(res.success === true, 'success=true erwartet');
  assert_(res.aktualisiert === 1, 'aktualisiert=1 erwartet (war: ' + res.aktualisiert + ')');
  assert_(Array.isArray(res.nichtGefunden) && res.nichtGefunden.length === 1, 'nichtGefunden-Array mit 1 Eintrag erwartet');
  assert_(res.nichtGefunden[0] === 'definitely-not-existing-id-xyz', 'nichtGefunden enthaelt non-existent ID');

  // 4. Verifikation im Sheet: musterlosung auf Marker, pruefungstauglich leer
  var dataNeu = getSheetData(sheet);
  var frageNeu = null;
  for (var j = 0; j < dataNeu.length; j++) {
    if (dataNeu[j].id === testId) { frageNeu = dataNeu[j]; break; }
  }
  assert_(frageNeu, 'Test-Frage nach Update nicht gefunden');
  assert_(frageNeu.musterlosung === markerText, 'musterlosung nicht auf Marker gesetzt');
  assert_(String(frageNeu.pruefungstauglich || '') === '', 'pruefungstauglich sollte leer sein');

  // 5. RESTORE: Original-Musterlosung zuruecksetzen
  body = {
    action: 'batchUpdateFragenMigration',
    email: EMAIL,
    fachbereich: 'BWL',
    updates: [{ id: testId, musterlosung: originalMusterlosung || '', teilerklaerungen: [] }],
  };
  batchUpdateFragenMigrationEndpoint(body);
  Logger.log('✓ Restore durchgefuehrt. Frage ' + testId + ' wieder auf Original-musterlosung.');
  Logger.log('⚠️ pruefungstauglich bleibt leer — falls sie vorher true war, manuell wiedersetzen.');

  Logger.log('✓ C9 batchUpdateFragenMigration-Test bestanden.');
}
```

- [ ] **Step 2.1.4: Commit**

```bash
git add ExamLab/apps-script-code.js
git commit -m "C9 Phase 4: Apps-Script batchUpdateFragenMigration-Endpoint + Test-Shim"
```

### Task 2.2: Apps-Script deployen + testen (User-Task)

- [ ] **Step 2.2.1: User deployt neue Bereitstellung**

User öffnet Apps-Script-Editor → Bereitstellen → Bereitstellungen verwalten → Version: Neue Version → Beschreibung „C9 Phase 4 Migration-Endpoints" → Bereitstellen.

- [ ] **Step 2.2.2: Test-Shim laufen lassen**

Im GAS-Editor: Funktion `testC9BatchUpdateFragenMigration` wählen → Run.

Erwartet: Log-Output
```
Test-Frage: <uuid> (original musterlosung: ...)
Response: { success: true, aktualisiert: 1, nichtGefunden: [...] }
✓ Restore durchgefuehrt. Frage <uuid> wieder auf Original-musterlosung.
✓ C9 batchUpdateFragenMigration-Test bestanden.
```

Bei Fehler: User meldet sich bei mir mit Log-Output.

- [ ] **Step 2.2.3: pruefungstauglich der Test-Frage wiederherstellen**

User prüft, ob die Test-Frage ursprünglich `pruefungstauglich=true` war und setzt sie via Editor wieder (Test-Shim setzt sie auf leer).

---

## Phase 3 — Dump (User + Claude Code, 10 Min)

### Task 3.1: User-Setup

- [ ] **Step 3.1.1: Google-Sheets-Backup erstellen**

Drive → ExamLab-Fragenbank-Datei → Datei → Kopie erstellen → `ExamLab_Fragenbank_Backup_2026-04-22`.

User bestätigt im Chat: "Backup erstellt."

- [ ] **Step 3.1.2: Env-Variablen im Terminal**

```bash
export APPS_SCRIPT_URL=<Prod-URL>
export MIGRATION_EMAIL=<admin-email>
```

User bestätigt: "Env gesetzt."

### Task 3.2: Claude Code führt Dump aus

- [ ] **Step 3.2.1: dump.mjs**

```bash
cd "10 Github/GYM-WR-DUY/ExamLab/scripts/migrate-teilerklaerungen"
node dump.mjs
```

Erwartet:
```
[dump] Lade Fragen von https://script.google.com/...
[dump] 2397 Fragen geschrieben nach .../fragen-input.jsonl
[dump] Pro Fachbereich: { VWL: 823, BWL: 745, Recht: 612, Informatik: 217 }
```

- [ ] **Step 3.2.2: Sanity-Check**

```bash
wc -l fragen-input.jsonl
head -1 fragen-input.jsonl | python3 -m json.tool | head -20
```

Erwartet: ~2400 Zeilen, erste Frage korrekt geparst, hat Felder id/typ/fachbereich/fragetext.

- [ ] **Step 3.2.3: state.json initialisieren**

```bash
cat > state.json <<'EOF'
{
  "migrationGestartet": "$(date -Iseconds)",
  "letzteSession": null,
  "totalFragen": 2397,
  "verarbeitet": 0,
  "fragen": {}
}
EOF
```

(`totalFragen`-Wert aus tatsächlicher Zeilen-Count einsetzen.)

---

## Phase 4 — Stichprobe (Session 1, Claude Code, 60 Min)

### Task 4.1: Stichproben-IDs auswählen

- [ ] **Step 4.1.1: Claude Code schreibt pick-stichprobe.mjs (temporär, nicht committed)**

Ein einmaliges Helper-Skript im /tmp oder im scripts-Ordner:

```javascript
#!/usr/bin/env node
import fs from 'node:fs/promises'
const INPUT = './fragen-input.jsonl'
const OUTPUT = './stichprobe-ids.json'

function seededRandom(seed) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

const text = await fs.readFile(INPUT, 'utf8')
const fragen = text.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l))

// Gruppieren: fachbereich → typ → [fragen]
const gruppen = {}
for (const f of fragen) {
  if (!f.fachbereich || f.fachbereich === 'Informatik') continue
  if (!gruppen[f.fachbereich]) gruppen[f.fachbereich] = {}
  if (!gruppen[f.fachbereich][f.typ]) gruppen[f.fachbereich][f.typ] = []
  gruppen[f.fachbereich][f.typ].push(f)
}

const verteilung = {
  Recht: { mc: 3, richtigfalsch: 3, lueckentext: 2, zuordnung: 2 },
  VWL:   { mc: 2, richtigfalsch: 2, berechnung: 2, hotspot: 2, bildbeschriftung: 1, dragdrop_bild: 1 },
  BWL:   { mc: 2, buchungssatz: 2, kontenbestimmung: 2, tkonto: 1, bilanzstruktur: 2, dragdrop_bild: 1 },
}

const rand = seededRandom(42)
const ids = []
const fehltWarnings = []

for (const [fb, typenMap] of Object.entries(verteilung)) {
  for (const [typ, count] of Object.entries(typenMap)) {
    const pool = gruppen[fb]?.[typ] || []
    if (pool.length === 0) {
      fehltWarnings.push(`${fb} ${typ}: 0 Fragen in DB`)
      continue
    }
    // Shuffle
    const shuffled = [...pool].sort(() => rand() - 0.5)
    const picked = shuffled.slice(0, Math.min(count, pool.length))
    for (const f of picked) ids.push(f.id)
    if (picked.length < count) {
      fehltWarnings.push(`${fb} ${typ}: nur ${picked.length} von ${count} gewuenschten verfuegbar`)
    }
  }
}

await fs.writeFile(OUTPUT, JSON.stringify({ seed: 42, ids, fehltWarnings }, null, 2))
console.log(`${ids.length} Stichproben-IDs nach ${OUTPUT} geschrieben`)
if (fehltWarnings.length) console.log('Warnings:', fehltWarnings)
```

- [ ] **Step 4.1.2: Ausführen**

```bash
node pick-stichprobe.mjs
cat stichprobe-ids.json
```

Erwartet: ~30 IDs + ggf. fehltWarnings.

- [ ] **Step 4.1.3: Cleanup**

```bash
rm pick-stichprobe.mjs   # wird nicht committed, war einmalig
```

### Task 4.2: Claude Code bearbeitet die 30 Stichproben-Fragen

- [ ] **Step 4.2.1: Input-Fragen filtern**

Claude Code liest:
- `fragen-input.jsonl`
- `stichprobe-ids.json` → 30 IDs

Selektiert die 30 Fragen aus Input-JSONL.

- [ ] **Step 4.2.2: Pro Frage generieren**

Pro Frage (siehe Spec §5 + §13/Anhang B):
1. Parse Frage-Objekt
2. Generiere Musterlösung (2-4 Sätze, Schweizer Hochdeutsch, fachlich präzise)
3. Generiere Teilerklärungen pro Sub-Element nach Fragetyp-spezifischen Regeln
4. Baue JSON: `{ id, fachbereich, musterlosung, teilerklaerungen: [{feld, id, text}] }`
5. Append an `fragen-updates.jsonl`

Claude Code ruft zwischen Batches Schreib-Operationen mit `Write`/`Bash append` auf — KEINE Tool-Calls an externe APIs.

- [ ] **Step 4.2.3: state.json aktualisieren**

Nach allen 30: state-Datei schreiben mit den 30 done-IDs.

- [ ] **Step 4.2.4: Stichprobe commiten**

```bash
git add state.json fragen-updates.jsonl stichprobe-ids.json
# Achtung: Dateien sind in .gitignore — force-add
git add -f state.json fragen-updates.jsonl stichprobe-ids.json

# Wait: Eigentlich wollen wir das NICHT committen (sensitive data)
# Besser: lokaler Commit-Hook oder nur Session-State abgleichen via Chat
```

**Entscheidung:** Die Dateien werden NICHT committet (in .gitignore). Claude Code meldet im Chat: "Stichprobe 30/30 done. State + Updates-Datei lokal, nicht committed."

### Task 4.3: Review-MD generieren

- [ ] **Step 4.3.1:**

```bash
node review-generator.mjs
ls -la stichprobe-review.md
```

Erwartet: `stichprobe-review.md` mit 30 Fragen, jede mit Alte/Neue Musterlösung + Teilerklärungen pro Sub-Element.

### Task 4.4: User-Review

- [ ] **Step 4.4.1: User liest stichprobe-review.md**

User öffnet Datei, liest durch (~15 Min). Feedback:
- **OK** → weiter zu Phase 5
- **Nachbesserung** → User nennt konkrete Patterns die nicht passen (z.B. "alle Recht-Fragen zitieren zu viel OR", "zu lang")
- **Gravierend** → Neustart der Stichprobe mit angepassten Regeln

- [ ] **Step 4.4.2: Bei Nachbesserung**

Claude Code:
1. Spec §5 Qualitätskriterien entsprechend anpassen (Commit separat, damit Changelog transparent)
2. `fragen-updates.jsonl` + `state.json` leeren (`rm` beide)
3. Session 1 wiederholen mit den selben 30 IDs

Max 3 Iterationen — danach Human-Escalation.

- [ ] **Step 4.4.3: Bei Freigabe**

User schreibt explizit: "Stichprobe freigegeben, weiter zu Full-Run."

---

## Phase 5 — Full-Run (Sessions 2-24, Claude Code, je 60 Min)

### Task 5.x: Eine typische Session

Das gleiche Muster wie Task 4.2, aber 100 Fragen pro Session statt 30.

- [ ] **Step 5.x.1: Input-Fragen filtern**

Claude Code liest state.json, bestimmt die nächsten 100 noch-nicht-done-Fragen aus `fragen-input.jsonl`.

- [ ] **Step 5.x.2: Pro Frage generieren**

Identisch zu Task 4.2.2.

- [ ] **Step 5.x.3: state.json aktualisieren**

Nach 100 Fragen state-Datei schreiben.

- [ ] **Step 5.x.4: Session-End-Summary**

Claude Code meldet im Chat:
```
Session N fertig.
Verarbeitet diese Session: 100
Total verarbeitet: 130/2400 (5.4%)
Skipped diese Session: 0
Zeitbudget Session: 60 Min
```

- [ ] **Step 5.x.5: Commit**

Updates/State-Dateien bleiben lokal (NIE committed). Claude Code committed stattdessen nichts — der gesamte Migration-State lebt nur auf dem User-Rechner bis Phase 6 fertig ist.

### Task 5.99: Rollover-Kriterium

Nach 24 Sessions (oder wann immer alle 2397 Fragen in state.json als `done` markiert sind):

- [ ] **Step 5.99.1: Sanity-Check**

```bash
wc -l fragen-updates.jsonl   # sollte == totalFragen - skipped sein
cat state.json | python3 -c "import sys,json; s=json.load(sys.stdin); print(f\"done={sum(1 for f in s['fragen'].values() if f['status']=='done')}, skipped={sum(1 for f in s['fragen'].values() if f['status']=='skip')}, andere={sum(1 for f in s['fragen'].values() if f['status'] not in ('done','skip'))}\")"
```

Erwartet: done ~2397, skipped 0-wenige, andere 0.

---

## Phase 6 — Upload + Verifikation (Claude Code + User, 30 Min)

### Task 6.1: Dry-Run

- [ ] **Step 6.1.1: upload.mjs --dry-run**

```bash
node upload.mjs --dry-run
```

Erwartet:
```
[upload] 2397 Updates in fragen-updates.jsonl
[upload] BWL: 745 Updates...
[upload] DRY-RUN: skip Apps-Script-Call
[upload] Recht: 612 Updates...
...
```

Kein Fehler, alle Fachbereiche gruppiert korrekt.

### Task 6.2: Echter Upload

- [ ] **Step 6.2.1: upload.mjs**

```bash
node upload.mjs
```

Erwartet (dauert ~30-60 Sek pro Call wegen Apps-Script-Overhead):
```
[upload] BWL: 745 Updates...
[upload] Recht: 612 Updates...
[upload] VWL: 823 Updates...

[upload] === ZUSAMMENFASSUNG ===
  BWL: aktualisiert=745, nichtGefunden=0
  Recht: aktualisiert=612, nichtGefunden=0
  VWL: aktualisiert=823, nichtGefunden=0
```

- [ ] **Step 6.2.2: Log prüfen**

```bash
tail -50 upload.log
```

Jede Response geloggt, keine Timeouts.

### Task 6.3: Browser-Verifikation (User)

- [ ] **Step 6.3.1: 5 Fragen pro Fachbereich im SuS-Üben-Modus**

User öffnet staging-URL im SuS-Tab, wählt jeweils für jeden Fachbereich ein Kurs/Thema, beantwortet 5 Fragen, prüft:
- Nach „Antwort prüfen": pro Option/Sub-Element eine Teilerklärung sichtbar?
- Musterlösungs-Block darunter?
- Text sprachlich korrekt?

- [ ] **Step 6.3.2: LP-Frontend-Editor**

User öffnet 3 beliebige Fragen im Editor, prüft:
- Alle Felder vorhanden (fragetext, Optionen, etc.)?
- `pruefungstauglich=false` (erwartet — ganzer Review-Batch wartet)
- `Erklärung (optional)`-Input pro Sub-Element ist gefüllt

- [ ] **Step 6.3.3: User bestätigt "Upload erfolgreich"**

### Task 6.4: Cleanup + Merge

- [ ] **Step 6.4.1: Lokale Migration-Dateien löschen**

```bash
rm fragen-input.jsonl fragen-updates.jsonl state.json stichprobe-ids.json stichprobe-review.md upload.log
```

Die Dateien sind in `.gitignore`, also kein Commit — aber lokal aufräumen um Rest-Kopien nicht rumliegen zu haben.

- [ ] **Step 6.4.2: Merge feature/c9-phase4-migration → main**

```bash
cd "10 Github/GYM-WR-DUY"
git checkout main
git pull
git merge --no-ff feature/c9-phase4-migration -m "Merge C9 Phase 4: Teilerklaerungs-Migration (~2400 Fragen bearbeitet)"
git push
git push --force-with-lease origin main:preview
git branch -d feature/c9-phase4-migration
git push origin --delete feature/c9-phase4-migration
```

- [ ] **Step 6.4.3: HANDOFF.md aktualisieren**

Claude Code editiert `ExamLab/HANDOFF.md`:
- Phase 4 als abgeschlossen markieren
- Kein Migration-State mehr offen
- Out-of-scope bleibt: User reviewt Fragen einzeln, setzt `pruefungstauglich=true`

- [ ] **Step 6.4.4: Commit + Push**

```bash
git add ExamLab/HANDOFF.md
git commit -m "C9 Phase 4 abgeschlossen: Migration von ~2400 Fragen erfolgreich"
git push
```

- [ ] **Step 6.4.5: MEMORY.md aktualisieren**

Claude Code editiert Memory-File mit:
- S136-Eintrag mit Ergebnis (~2400 Fragen migriert)
- Phase 4 als letzter Schritt von C9 abgeschlossen
- Follow-up: LP-Review-Runde (pruefungstauglich=true setzen) ist normale Pflege

---

## Lehren / Sorgfalts-Prinzipien

### Einmalige Migration: 1. Klasse Backup
Das Google-Sheets-Backup VOR allem anderen ist nicht optional. 5 Sekunden Aufwand, 100% Rollback-Garantie.

### Partial-Update > Full-Replace
Der Backend-Endpoint rührt nur 4 Felder an (`musterlosung`, `typDaten.<feld>[i].erklaerung`, `pruefungstauglich`, `geaendertAm`). Alles andere bleibt byte-identisch. Ein Bug in Claude-Code generierten Teilerklärungen kann maximal einen Text kaputt machen — nie die Frage-Struktur.

### State im Append-only-JSONL
`fragen-updates.jsonl` ist append-only. Ein unterbrochener Session-Lauf verliert keinen Fortschritt. State-Datei zeigt den exakten nächsten Frage-Index.

### Stichprobe ist das einzige Qualitäts-Gate
Bei Claude-Code-generierten Inhalten gibt es keine automatisierte Qualitätskontrolle. Die 30-Fragen-Stichprobe ist der einzige Moment, an dem systematische Pattern-Probleme erkennbar sind. Max 3 Iterationen dort; danach Human-Escalation.

### Pruefungstauglich=false ist Feature, nicht Bug
Nach Migration sind alle Fragen "ungeprüft" markiert. Das signalisiert dem LP: "Review mich". LP geht Frage-für-Frage durch, setzt pruefungstauglich=true. Alternative wäre automatische Freigabe aller 2400 — das würde den LP-Review-Workflow kurzschließen.
