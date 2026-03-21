# Prüfungs-Workflow Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Monitoring-Tab um vollständigen Prüfungs-Workflow erweitern: Teilnehmer-Auswahl aus Klassenlisten, Bereitschafts-Lobby, nahtloser Start + Live-Monitoring + Beenden.

**Architecture:** State-Machine mit 4 deterministisch abgeleiteten Phasen (vorbereitung → lobby → aktiv → beendet). MonitoringDashboard rendert pro Phase eine eigene Sub-Komponente. Teilnehmer werden aus bestehendem Klassenlisten-Sheet geladen und im Prüfungs-Config als JSON-Array gespeichert. SuS-Lobby nutzt bestehendes Heartbeat-/Polling-System.

**Tech Stack:** React 19 + TypeScript + Zustand + Tailwind CSS v4 + Google Apps Script Backend

**Spec:** `Pruefung/docs/superpowers/specs/2026-03-21-pruefungs-workflow-design.md`

---

## File Structure

| Datei | Aktion | Verantwortung |
|-------|--------|---------------|
| `src/types/pruefung.ts` | Modify | `Teilnehmer` Interface, `teilnehmer[]` + `beendetUm` Felder |
| `src/types/monitoring.ts` | Modify | `aktuelleFrage` in SchuelerStatus, `PruefungsPhase` Type |
| `src/utils/phase.ts` | Create | `bestimmePhase()` Funktion + `letzteAktivitaet()` Helper |
| `src/services/apiService.ts` | Modify | 3 neue Endpunkte: `ladeKlassenlisten`, `sendeEinladungen`, `setzeTeilnehmer` |
| `apps-script-code.js` | Modify | 3 neue Cases in doGet/doPost + Heartbeat aktuelleFrage |
| `src/components/lp/MonitoringDashboard.tsx` | Modify | Phase-Router: rendert Sub-Komponente basierend auf Phase |
| `src/components/lp/PhaseHeader.tsx` | Create | Status-Badge, Timer, Phase-Anzeige |
| `src/components/lp/VorbereitungPhase.tsx` | Create | Teilnehmer-Auswahl UI |
| `src/components/lp/KlassenAuswahl.tsx` | Create | Klassen-Checkboxen mit SuS-Zähler |
| `src/components/lp/TeilnehmerListe.tsx` | Create | Individuelle SuS-Checkboxen + Manuell-Eingabe |
| `src/components/lp/LobbyPhase.tsx` | Create | Bereitschafts-Anzeige, Freischalten-Button |
| `src/components/lp/AktivPhase.tsx` | Create | Live-Monitoring Tabelle + Filter/Sort |
| `src/components/lp/ZusammenfassungsLeiste.tsx` | Create | Kompakte Zahlen: aktiv / abgegeben / ausstehend |
| `src/components/lp/SusDetailPanel.tsx` | Create | Slide-in Panel mit Fragen-Status pro SuS |
| `src/components/lp/BeendetPhase.tsx` | Create | Zusammenfassung + Export/Korrektur-Links |
| `src/components/lp/BeendenDialog.tsx` | Existing | Wird in AktivPhase importiert — Props verifizieren |
| `src/components/Startbildschirm.tsx` | Modify | Lobby-Wartebildschirm wenn freigeschaltet=false |
| `src/hooks/usePruefungsMonitoring.ts` | Modify | `aktuelleFrage` im Heartbeat mitsenden |

---

### Task 1: Types & Phase-Logik

**Files:**
- Modify: `src/types/pruefung.ts`
- Modify: `src/types/monitoring.ts`
- Create: `src/utils/phase.ts`

- [ ] **Step 1: Teilnehmer-Interface und Felder in PruefungsConfig**

In `src/types/pruefung.ts` vor dem `export interface PruefungsConfig` ein neues Interface einfügen, und in PruefungsConfig zwei Felder hinzufügen:

```typescript
// Nach den bestehenden Imports/Interfaces, vor PruefungsConfig:
export interface Teilnehmer {
  email: string
  name: string
  vorname: string
  klasse: string
  quelle: 'klassenliste' | 'manuell'
  einladungGesendet?: boolean
}

// In PruefungsConfig, nach dem Feld `freigeschaltet: boolean` (Zeile 37):
  // Teilnehmer (Workflow)
  teilnehmer?: Teilnehmer[];
  beendetUm?: string; // ISO-Zeitstempel
```

- [ ] **Step 2: aktuelleFrage in SchuelerStatus + PruefungsPhase Type**

In `src/types/monitoring.ts`:

```typescript
// In SchuelerStatus, nach `klasse?: string` (Zeile 7):
  /** Aktuelle Frage (0-basierter Index), null wenn unbekannt */
  aktuelleFrage: number | null

// Am Ende der Datei:
/** Phasen des Prüfungs-Workflows */
export type PruefungsPhase = 'vorbereitung' | 'lobby' | 'aktiv' | 'beendet'
```

- [ ] **Step 3: Phase-Utility erstellen**

Erstelle `src/utils/phase.ts`:

```typescript
import type { PruefungsConfig } from '../types/pruefung'
import type { SchuelerStatus, PruefungsPhase } from '../types/monitoring'

/**
 * Bestimmt die aktuelle Prüfungsphase deterministisch aus dem Zustand.
 * Evaluationsreihenfolge (höchste Priorität zuerst):
 * 1. beendetUm gesetzt → beendet
 * 2. freigeschaltet → aktiv
 * 3. teilnehmer gesetzt + mind. 1 SuS eingeloggt → lobby
 * 4. sonst → vorbereitung
 */
export function bestimmePhase(
  config: PruefungsConfig,
  schuelerStatus: SchuelerStatus[],
): PruefungsPhase {
  if (config.beendetUm) return 'beendet'
  if (config.freigeschaltet) return 'aktiv'
  if (
    config.teilnehmer &&
    config.teilnehmer.length > 0 &&
    schuelerStatus.some((s) => s.status !== 'nicht-gestartet')
  ) {
    return 'lobby'
  }
  return 'vorbereitung'
}

/**
 * Berechnet den Zeitpunkt der letzten Aktivität eines SuS.
 * Abgeleitet aus max(letzterHeartbeat, letzterSave).
 * Gibt 0 zurück wenn keine Aktivität vorhanden.
 */
export function letzteAktivitaet(schueler: SchuelerStatus): number {
  return Math.max(
    new Date(schueler.letzterHeartbeat ?? 0).getTime(),
    new Date(schueler.letzterSave ?? 0).getTime(),
  )
}

/**
 * Bestimmt die Inaktivitäts-Stufe anhand der letzten Aktivität.
 * Gibt null zurück wenn SuS nicht aktiv (abgegeben, nicht gestartet).
 */
export function inaktivitaetsStufe(
  schueler: SchuelerStatus,
): 'gelb' | 'orange' | 'rot' | null {
  if (schueler.status !== 'aktiv') return null
  const letzte = letzteAktivitaet(schueler)
  if (letzte === 0) return null
  const diff = (Date.now() - letzte) / 1000 / 60 // Minuten
  if (diff > 5) return 'rot'
  if (diff > 3) return 'orange'
  if (diff > 1) return 'gelb'
  return null
}
```

- [ ] **Step 4: TypeScript-Kompilierung prüfen**

Run: `cd Pruefung && npx tsc --noEmit 2>&1 | head -30`
Expected: Eventuell Fehler weil `aktuelleFrage` in bestehenden Stellen fehlt — diese werden in späteren Tasks behoben. Die neuen Dateien selbst sollten fehlerfrei sein.

- [ ] **Step 5: Commit**

```bash
git add src/types/pruefung.ts src/types/monitoring.ts src/utils/phase.ts
git commit -m "Pruefung: Types + Phase-Logik für Prüfungs-Workflow"
```

---

### Task 2: Apps Script Backend — Klassenlisten + Teilnehmer + Heartbeat

**Files:**
- Modify: `apps-script-code.js`

Kontext: `apps-script-code.js` hat einen `doGet(e)` mit switch auf `action` Parameter und einen `doPost(e)` mit switch auf `body.action`. Die Konstante `KLASSENLISTEN_ID` ist bereits definiert. Die `findOrCreateAntwortenSheet()` Funktion erstellt/findet Antworten-Sheets.

- [ ] **Step 1: ladeKlassenlisten in doGet**

Im `doGet` switch-case nach dem letzten `case` und vor `default`:

```javascript
case 'ladeKlassenlisten': {
  // Nur LP darf Klassenlisten laden
  const email = e.parameter.email
  if (!email || !email.endsWith('@gymhofwil.ch')) {
    return jsonResponse({ error: 'Nur LP kann Klassenlisten laden' })
  }
  try {
    const ss = SpreadsheetApp.openById(KLASSENLISTEN_ID)
    const sheets = ss.getSheets()
    const result = []
    for (const sheet of sheets) {
      const sheetName = sheet.getName()
      // Überspringe Meta-Sheets
      if (sheetName.startsWith('_') || sheetName === 'Template') continue
      const data = sheet.getDataRange().getValues()
      if (data.length < 2) continue // Nur Header, keine Daten
      // Format: A=Klasse, B=Nachname, C=Vorname, D=E-Mail (Zeile 1 = Header)
      for (let i = 1; i < data.length; i++) {
        const row = data[i]
        if (!row[3]) continue // Kein E-Mail → überspringe
        result.push({
          klasse: String(row[0] || sheetName).trim(),
          name: String(row[1] || '').trim(),
          vorname: String(row[2] || '').trim(),
          email: String(row[3]).trim().toLowerCase(),
        })
      }
    }
    return jsonResponse({ success: true, klassenlisten: result })
  } catch (err) {
    return jsonResponse({ error: 'Klassenlisten nicht ladbar: ' + String(err) })
  }
}
```

- [ ] **Step 2: setzeTeilnehmer in doPost**

Im `doPost` switch-case:

```javascript
case 'setzeTeilnehmer': {
  const email = body.email
  if (!email || !email.endsWith('@gymhofwil.ch')) {
    return jsonResponse({ error: 'Nur LP darf Teilnehmer setzen' })
  }
  const pruefungId = body.pruefungId
  const teilnehmer = body.teilnehmer // Array<Teilnehmer>
  if (!pruefungId || !Array.isArray(teilnehmer)) {
    return jsonResponse({ error: 'pruefungId und teilnehmer[] erforderlich' })
  }
  try {
    const ss = SpreadsheetApp.openById(CONFIGS_ID)
    const sheet = ss.getSheetByName('Configs')
    if (!sheet) return jsonResponse({ error: 'Configs-Sheet nicht gefunden' })
    const data = getSheetData(sheet)
    const rowIndex = data.findIndex(r => r.id === pruefungId)
    if (rowIndex < 0) return jsonResponse({ error: 'Prüfung nicht gefunden' })

    // Teilnehmer-Spalte finden oder erstellen
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    let teilnehmerCol = headers.indexOf('teilnehmer')
    if (teilnehmerCol < 0) {
      teilnehmerCol = headers.length
      sheet.getRange(1, teilnehmerCol + 1).setValue('teilnehmer')
    }

    // Teilnehmer als JSON speichern
    sheet.getRange(rowIndex + 2, teilnehmerCol + 1).setValue(JSON.stringify(teilnehmer))

    // erlaubteEmails synchronisieren
    const emailsCol = headers.indexOf('erlaubteEmails')
    if (emailsCol >= 0) {
      const emails = teilnehmer.map(t => t.email)
      sheet.getRange(rowIndex + 2, emailsCol + 1).setValue(JSON.stringify(emails))
    }

    // erlaubteKlasse synchronisieren
    const klasseCol = headers.indexOf('erlaubteKlasse')
    if (klasseCol >= 0) {
      const klassen = [...new Set(teilnehmer.map(t => t.klasse))]
      sheet.getRange(rowIndex + 2, klasseCol + 1).setValue(klassen.length === 1 ? klassen[0] : '')
    }

    return jsonResponse({ success: true })
  } catch (err) {
    return jsonResponse({ error: 'Teilnehmer setzen fehlgeschlagen: ' + String(err) })
  }
}
```

- [ ] **Step 3: sendeEinladungen in doPost**

```javascript
case 'sendeEinladungen': {
  const email = body.email
  if (!email || !email.endsWith('@gymhofwil.ch')) {
    return jsonResponse({ error: 'Nur LP darf Einladungen senden' })
  }
  const { pruefungId, pruefungTitel, pruefungUrl, empfaenger } = body
  // empfaenger: Array<{ email: string, name: string, vorname: string }>
  if (!pruefungId || !pruefungTitel || !pruefungUrl || !Array.isArray(empfaenger)) {
    return jsonResponse({ error: 'Pflichtfelder fehlen' })
  }
  const ergebnisse = []
  for (const emp of empfaenger) {
    try {
      MailApp.sendEmail({
        to: emp.email,
        subject: `Prüfung: ${pruefungTitel}`,
        htmlBody: `
          <p>Hallo ${emp.vorname},</p>
          <p>Du wurdest zur folgenden Prüfung eingeladen:</p>
          <p><strong>${pruefungTitel}</strong></p>
          <p>Öffne diesen Link wenn die Lehrperson die Prüfung freigibt:</p>
          <p><a href="${pruefungUrl}">${pruefungUrl}</a></p>
          <p>Viel Erfolg!</p>
        `,
      })
      ergebnisse.push({ email: emp.email, erfolg: true })
    } catch (err) {
      ergebnisse.push({ email: emp.email, erfolg: false, fehler: String(err) })
    }
  }
  return jsonResponse({ success: true, ergebnisse })
}
```

- [ ] **Step 4: Heartbeat erweitern um aktuelleFrage**

In der bestehenden Heartbeat-Verarbeitung (im `case 'heartbeat'` in doPost), nach dem Update von `letzterHeartbeat` und `heartbeats`:

Finde die Stelle wo der Heartbeat die Antworten-Zeile aktualisiert. Füge hinzu:

```javascript
// aktuelleFrage-Spalte aktualisieren (falls vom Client mitgesendet)
if (body.aktuelleFrage !== undefined) {
  // Spalte 'aktuelleFrage' finden oder erstellen in Antworten-Sheet
  const antwortenHeaders = antwortenSheet.getRange(1, 1, 1, antwortenSheet.getLastColumn()).getValues()[0]
  let aktFrageCol = antwortenHeaders.indexOf('aktuelleFrage')
  if (aktFrageCol < 0) {
    aktFrageCol = antwortenHeaders.length
    antwortenSheet.getRange(1, aktFrageCol + 1).setValue('aktuelleFrage')
  }
  antwortenSheet.getRange(susRowIndex + 2, aktFrageCol + 1).setValue(body.aktuelleFrage)
}
```

- [ ] **Step 5: ladePruefung Config-Mapping erweitern**

In der Funktion die Config aus dem Sheet liest und als JSON zurückgibt (vermutlich in `ladePruefung` oder `ladeConfig`), sicherstellen dass `teilnehmer` und `beendetUm` gemappt werden:

```javascript
// Im Config-Mapping, nach den bestehenden Feldern:
teilnehmer: row.teilnehmer ? JSON.parse(row.teilnehmer) : [],
beendetUm: row.beendetUm || undefined,
```

- [ ] **Step 6: Monitoring-Endpoint aktuelleFrage mappen**

In der `monitoring`/`ladeMonitoring` Funktion in doGet, wo `SchuelerStatus` Objekte aus dem Antworten-Sheet erstellt werden, `aktuelleFrage` hinzufügen:

```javascript
// Im SchuelerStatus-Mapping:
aktuelleFrage: row.aktuelleFrage !== undefined && row.aktuelleFrage !== ''
  ? Number(row.aktuelleFrage)
  : null,
```

- [ ] **Step 7: Commit**

```bash
git add apps-script-code.js
git commit -m "Pruefung: Backend-Aktionen für Klassenlisten, Teilnehmer, Einladungen, aktuelleFrage"
```

**Reminder:** User muss nach diesem Task den Code in Apps Script Editor kopieren + neue Bereitstellung erstellen.

---

### Task 3: API Service Frontend-Anbindung

**Files:**
- Modify: `src/services/apiService.ts`

- [ ] **Step 1: Klassenlisten-Type + API-Methode**

Am Anfang der Datei (nach den bestehenden Imports) einen Type definieren, dann 3 neue Methoden in der `apiService` Klasse hinzufügen:

```typescript
// Type (am Anfang der Datei, nach Imports):
interface KlassenlistenEintrag {
  klasse: string
  email: string
  name: string
  vorname: string
}

// In der apiService-Klasse:

/** Lädt Klassenlisten vom Backend (LP-only) */
async ladeKlassenlisten(email: string): Promise<KlassenlistenEintrag[]> {
  const url = `${APPS_SCRIPT_URL}?action=ladeKlassenlisten&email=${encodeURIComponent(email)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Klassenlisten laden fehlgeschlagen (${res.status})`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.klassenlisten ?? []
}

/** Setzt Teilnehmer für eine Prüfung (LP-only) */
async setzeTeilnehmer(
  email: string,
  pruefungId: string,
  teilnehmer: Array<{ email: string; name: string; vorname: string; klasse: string; quelle: 'klassenliste' | 'manuell'; einladungGesendet?: boolean }>,
): Promise<boolean> {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'setzeTeilnehmer',
      email,
      pruefungId,
      teilnehmer,
    }),
  })
  if (!res.ok) return false
  const data = await res.json()
  return data.success === true
}

/** Sendet Einladungs-E-Mails an Teilnehmer (LP-only) */
async sendeEinladungen(
  email: string,
  pruefungId: string,
  pruefungTitel: string,
  pruefungUrl: string,
  empfaenger: Array<{ email: string; name: string; vorname: string }>,
): Promise<Array<{ email: string; erfolg: boolean; fehler?: string }>> {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'sendeEinladungen',
      email,
      pruefungId,
      pruefungTitel,
      pruefungUrl,
      empfaenger,
    }),
  })
  if (!res.ok) throw new Error('Einladungen senden fehlgeschlagen')
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.ergebnisse ?? []
}
```

- [ ] **Step 2: TypeScript-Kompilierung prüfen**

Run: `cd Pruefung && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/services/apiService.ts
git commit -m "Pruefung: API-Methoden für Klassenlisten, Teilnehmer, Einladungen"
```

---

### Task 4: Heartbeat um aktuelleFrage erweitern (SuS-Seite)

**Files:**
- Modify: `src/hooks/usePruefungsMonitoring.ts`

- [ ] **Step 1: aktuelleFrage im Heartbeat mitsenden**

In `usePruefungsMonitoring.ts`, finde die Heartbeat-Logik wo `apiService.heartbeat()` aufgerufen wird. Der Heartbeat sendet aktuell `{ pruefungId, email, timestamp }`. Erweitere den Payload:

```typescript
// Im Heartbeat-Intervall, vor dem apiService.heartbeat() Aufruf:
// aktuelleFrage aus dem Store lesen:
const aktuelleFrageIndex = usePruefungStore.getState().aktuelleFrageIndex

// Und im heartbeat-Aufruf den Index mitsenden.
// Falls heartbeat() aktuell nur pruefungId und email nimmt,
// muss die Signatur in apiService.ts um aktuelleFrage erweitert werden:
```

Konkret in `apiService.ts`, die `heartbeat()` Methode anpassen:

```typescript
async heartbeat(
  pruefungId: string,
  email: string,
  aktuelleFrage?: number,
): Promise<HeartbeatResponse> {
  // ... bestehender Code ...
  body: JSON.stringify({
    action: 'heartbeat',
    pruefungId,
    email,
    timestamp: new Date().toISOString(),
    aktuelleFrage, // NEU
  }),
  // ... rest bleibt gleich ...
}
```

Und im Hook den Aufruf anpassen:

```typescript
const response = await apiService.heartbeat(
  config.id,
  user.email,
  usePruefungStore.getState().aktuelleFrageIndex,
)
```

- [ ] **Step 2: Kompilierung prüfen**

Run: `cd Pruefung && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/hooks/usePruefungsMonitoring.ts src/services/apiService.ts
git commit -m "Pruefung: aktuelleFrage im Heartbeat an Backend senden"
```

---

### Task 5: PhaseHeader Komponente

**Files:**
- Create: `src/components/lp/PhaseHeader.tsx`

- [ ] **Step 1: PhaseHeader erstellen**

```typescript
import { useState, useEffect } from 'react'
import type { PruefungsConfig } from '../../types/pruefung'
import type { PruefungsPhase } from '../../types/monitoring'

const PHASE_CONFIG: Record<PruefungsPhase, { label: string; farbe: string; icon: string }> = {
  vorbereitung: { label: 'Vorbereitung', farbe: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200', icon: '⚙️' },
  lobby: { label: 'Lobby', farbe: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200', icon: '🟡' },
  aktiv: { label: 'Aktiv', farbe: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200', icon: '🟢' },
  beendet: { label: 'Beendet', farbe: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300', icon: '⏹' },
}

interface Props {
  config: PruefungsConfig
  phase: PruefungsPhase
}

export default function PhaseHeader({ config, phase }: Props) {
  const phaseInfo = PHASE_CONFIG[phase]
  const [dauer, setDauer] = useState('')

  // Timer: Laufzeit als Stoppuhr (nur in aktiv-Phase)
  const [startTimestamp] = useState(() => Date.now()) // Lokaler Start-Zeitpunkt
  useEffect(() => {
    if (phase !== 'aktiv') {
      setDauer('')
      return
    }
    const updateDauer = () => {
      const diff = Date.now() - startTimestamp
      setDauer(formatDauer(diff))
    }
    updateDauer()
    const interval = setInterval(updateDauer, 1000)
    return () => clearInterval(interval)
  }, [phase, startTimestamp])

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {config.titel}
        </h2>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${phaseInfo.farbe}`}>
          {phaseInfo.icon} {phaseInfo.label}
        </span>
      </div>

      {/* Timer in aktiver Phase */}
      {phase === 'aktiv' && dauer && (
        <span className="text-sm font-mono text-slate-600 dark:text-slate-300">
          ⏱ {dauer}
        </span>
      )}

      {/* Beendet: Zeitraum anzeigen */}
      {phase === 'beendet' && config.beendetUm && (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Beendet: {new Date(config.beendetUm).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  )
}

function formatDauer(ms: number): string {
  const totalSekunden = Math.floor(ms / 1000)
  const stunden = Math.floor(totalSekunden / 3600)
  const minuten = Math.floor((totalSekunden % 3600) / 60)
  const sekunden = totalSekunden % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return stunden > 0
    ? `${pad(stunden)}:${pad(minuten)}:${pad(sekunden)}`
    : `${pad(minuten)}:${pad(sekunden)}`
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/lp/PhaseHeader.tsx
git commit -m "Pruefung: PhaseHeader Komponente mit Status-Badge und Timer"
```

---

### Task 6: VorbereitungPhase — Teilnehmer-Auswahl

**Files:**
- Create: `src/components/lp/VorbereitungPhase.tsx`
- Create: `src/components/lp/KlassenAuswahl.tsx`
- Create: `src/components/lp/TeilnehmerListe.tsx`

- [ ] **Step 1: KlassenAuswahl erstellen**

```typescript
// src/components/lp/KlassenAuswahl.tsx

interface KlassenGruppe {
  klasse: string
  schueler: Array<{ email: string; name: string; vorname: string; klasse: string }>
}

interface Props {
  gruppen: KlassenGruppe[]
  ausgewaehlteKlassen: Set<string>
  onToggleKlasse: (klasse: string) => void
}

export default function KlassenAuswahl({ gruppen, ausgewaehlteKlassen, onToggleKlasse }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {gruppen.map((g) => (
        <button
          key={g.klasse}
          type="button"
          onClick={() => onToggleKlasse(g.klasse)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer
            ${ausgewaehlteKlassen.has(g.klasse)
              ? 'bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-200'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
        >
          <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs
            ${ausgewaehlteKlassen.has(g.klasse)
              ? 'bg-blue-500 border-blue-500 text-white'
              : 'border-slate-300 dark:border-slate-500'
            }`}>
            {ausgewaehlteKlassen.has(g.klasse) ? '✓' : ''}
          </span>
          <span className="font-medium">{g.klasse}</span>
          <span className="text-xs opacity-70">({g.schueler.length})</span>
        </button>
      ))}
    </div>
  )
}

export type { KlassenGruppe }
```

- [ ] **Step 2: TeilnehmerListe erstellen**

```typescript
// src/components/lp/TeilnehmerListe.tsx
import { useState } from 'react'
import type { Teilnehmer } from '../../types/pruefung'

interface Props {
  teilnehmer: Teilnehmer[]
  onToggle: (email: string) => void
  onManuellHinzufuegen: (email: string) => void
  abgewaehlte: Set<string> // Einzeln abgewählte E-Mails
}

export default function TeilnehmerListe({ teilnehmer, onToggle, onManuellHinzufuegen, abgewaehlte }: Props) {
  const [manuelleEmail, setManuelleEmail] = useState('')

  const handleHinzufuegen = () => {
    const email = manuelleEmail.trim().toLowerCase()
    if (!email || !email.includes('@')) return
    onManuellHinzufuegen(email)
    setManuelleEmail('')
  }

  return (
    <div className="space-y-3">
      {/* Zähler */}
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Ausgewählt: <strong>{teilnehmer.filter((t) => !abgewaehlte.has(t.email)).length}</strong> von {teilnehmer.length} SuS
      </p>

      {/* Liste */}
      <div className="max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-100 dark:divide-slate-700">
        {teilnehmer.map((t) => (
          <label
            key={t.email}
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={!abgewaehlte.has(t.email)}
              onChange={() => onToggle(t.email)}
              className="rounded border-slate-300 dark:border-slate-600"
            />
            <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">
              {t.name}, {t.vorname}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{t.klasse}</span>
            {t.einladungGesendet && (
              <span title="Einladung gesendet" className="text-xs">✉️</span>
            )}
            {t.quelle === 'manuell' && (
              <span className="text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500 dark:text-slate-400">manuell</span>
            )}
          </label>
        ))}
      </div>

      {/* Manuell hinzufügen */}
      <div className="flex gap-2">
        <input
          type="email"
          value={manuelleEmail}
          onChange={(e) => setManuelleEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleHinzufuegen()}
          placeholder="E-Mail manuell hinzufügen..."
          className="flex-1 text-sm px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400"
        />
        <button
          type="button"
          onClick={handleHinzufuegen}
          disabled={!manuelleEmail.trim() || !manuelleEmail.includes('@')}
          className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 cursor-pointer"
        >
          + Hinzufügen
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: VorbereitungPhase erstellen**

```typescript
// src/components/lp/VorbereitungPhase.tsx
import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../../store/authStore'
import { apiService } from '../../services/apiService'
import type { PruefungsConfig, Teilnehmer } from '../../types/pruefung'
import KlassenAuswahl from './KlassenAuswahl'
import type { KlassenGruppe } from './KlassenAuswahl'
import TeilnehmerListe from './TeilnehmerListe'

interface Props {
  config: PruefungsConfig
  onTeilnehmerGesetzt: (teilnehmer: Teilnehmer[]) => void
  onPruefungStarten: () => void
}

export default function VorbereitungPhase({ config, onTeilnehmerGesetzt, onPruefungStarten }: Props) {
  const user = useAuthStore((s) => s.user)
  const [gruppen, setGruppen] = useState<KlassenGruppe[]>([])
  const [ladeStatus, setLadeStatus] = useState<'idle' | 'laden' | 'fertig' | 'fehler'>('idle')
  const [fehler, setFehler] = useState('')
  const [ausgewaehlteKlassen, setAusgewaehlteKlassen] = useState<Set<string>>(new Set())
  const [abgewaehlte, setAbgewaehlte] = useState<Set<string>>(new Set())
  const [teilnehmer, setTeilnehmer] = useState<Teilnehmer[]>(config.teilnehmer ?? [])
  const [einladungStatus, setEinladungStatus] = useState<'idle' | 'senden' | 'fertig' | 'fehler'>('idle')
  const [einladungFehler, setEinladungFehler] = useState<string[]>([])

  // Klassenlisten laden
  const ladeKlassenlisten = useCallback(async () => {
    if (!user || !apiService.istKonfiguriert()) return
    setLadeStatus('laden')
    setFehler('')
    try {
      const daten = await apiService.ladeKlassenlisten(user.email)
      // Nach Klasse gruppieren
      const map = new Map<string, KlassenGruppe>()
      for (const eintrag of daten) {
        if (!map.has(eintrag.klasse)) {
          map.set(eintrag.klasse, { klasse: eintrag.klasse, schueler: [] })
        }
        map.get(eintrag.klasse)!.schueler.push(eintrag)
      }
      setGruppen(Array.from(map.values()).sort((a, b) => a.klasse.localeCompare(b.klasse)))
      setLadeStatus('fertig')
    } catch (err) {
      setFehler(String(err))
      setLadeStatus('fehler')
    }
  }, [user])

  useEffect(() => { ladeKlassenlisten() }, [ladeKlassenlisten])

  // Klasse togglen → Teilnehmer-Liste aktualisieren
  const handleToggleKlasse = (klasse: string) => {
    const neueAuswahl = new Set(ausgewaehlteKlassen)
    if (neueAuswahl.has(klasse)) {
      neueAuswahl.delete(klasse)
      // SuS dieser Klasse entfernen
      setTeilnehmer((prev) => prev.filter((t) => t.klasse !== klasse || t.quelle === 'manuell'))
    } else {
      neueAuswahl.add(klasse)
      // SuS dieser Klasse hinzufügen
      const gruppe = gruppen.find((g) => g.klasse === klasse)
      if (gruppe) {
        const neue: Teilnehmer[] = gruppe.schueler
          .filter((s) => !teilnehmer.some((t) => t.email === s.email))
          .map((s) => ({
            email: s.email,
            name: s.name,
            vorname: s.vorname,
            klasse: s.klasse,
            quelle: 'klassenliste' as const,
          }))
        setTeilnehmer((prev) => [...prev, ...neue])
      }
    }
    setAusgewaehlteKlassen(neueAuswahl)
  }

  // Einzelne SuS abwählen
  const handleToggleEinzelne = (email: string) => {
    const neues = new Set(abgewaehlte)
    if (neues.has(email)) neues.delete(email)
    else neues.add(email)
    setAbgewaehlte(neues)
  }

  // Manuell hinzufügen
  const handleManuellHinzufuegen = (email: string) => {
    if (teilnehmer.some((t) => t.email === email)) return
    setTeilnehmer((prev) => [...prev, {
      email,
      name: email.split('@')[0],
      vorname: '',
      klasse: '—',
      quelle: 'manuell' as const,
    }])
  }

  // Teilnehmer ans Backend senden
  const handleSpeichern = async () => {
    if (!user) return
    const effektiveTeilnehmer = teilnehmer.filter((t) => !abgewaehlte.has(t.email))
    const erfolg = await apiService.setzeTeilnehmer(user.email, config.id, effektiveTeilnehmer)
    if (erfolg) {
      onTeilnehmerGesetzt(effektiveTeilnehmer)
    }
  }

  // Einladungen versenden
  const handleEinladungen = async () => {
    if (!user) return
    setEinladungStatus('senden')
    setEinladungFehler([])
    const zuSenden = teilnehmer
      .filter((t) => !abgewaehlte.has(t.email) && !t.einladungGesendet)
    const pruefungUrl = `${window.location.origin}${window.location.pathname}?id=${config.id}`
    try {
      const ergebnisse = await apiService.sendeEinladungen(
        user.email,
        config.id,
        config.titel,
        pruefungUrl,
        zuSenden.map((t) => ({ email: t.email, name: t.name, vorname: t.vorname })),
      )
      // Erfolgreiche markieren
      const erfolgreich = new Set(ergebnisse.filter((e) => e.erfolg).map((e) => e.email))
      setTeilnehmer((prev) =>
        prev.map((t) => erfolgreich.has(t.email) ? { ...t, einladungGesendet: true } : t),
      )
      const fehler = ergebnisse.filter((e) => !e.erfolg)
      if (fehler.length > 0) {
        setEinladungFehler(fehler.map((f) => `${f.email}: ${f.fehler}`))
        setEinladungStatus('fehler')
      } else {
        setEinladungStatus('fertig')
      }
    } catch (err) {
      setEinladungFehler([String(err)])
      setEinladungStatus('fehler')
    }
  }

  // Link kopieren
  const handleLinkKopieren = () => {
    const url = `${window.location.origin}${window.location.pathname}?id=${config.id}`
    navigator.clipboard.writeText(url)
  }

  const effektiveTeilnehmer = teilnehmer.filter((t) => !abgewaehlte.has(t.email))

  return (
    <div className="space-y-6">
      {/* Klassenlisten */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Teilnehmer auswählen</h3>
          <button
            type="button"
            onClick={ladeKlassenlisten}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Neu laden
          </button>
        </div>

        {ladeStatus === 'laden' && (
          <p className="text-sm text-slate-500 dark:text-slate-400">Klassenlisten werden geladen...</p>
        )}
        {ladeStatus === 'fehler' && (
          <p className="text-sm text-red-600 dark:text-red-400">{fehler}</p>
        )}
        {ladeStatus === 'fertig' && (
          <KlassenAuswahl
            gruppen={gruppen}
            ausgewaehlteKlassen={ausgewaehlteKlassen}
            onToggleKlasse={handleToggleKlasse}
          />
        )}
      </div>

      {/* Teilnehmer-Liste */}
      {teilnehmer.length > 0 && (
        <TeilnehmerListe
          teilnehmer={teilnehmer}
          onToggle={handleToggleEinzelne}
          onManuellHinzufuegen={handleManuellHinzufuegen}
          abgewaehlte={abgewaehlte}
        />
      )}

      {/* Manuell hinzufügen (wenn noch keine Klasse gewählt) */}
      {teilnehmer.length === 0 && ladeStatus === 'fertig' && (
        <TeilnehmerListe
          teilnehmer={[]}
          onToggle={() => {}}
          onManuellHinzufuegen={handleManuellHinzufuegen}
          abgewaehlte={abgewaehlte}
        />
      )}

      {/* Prüfungs-Link */}
      <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <span className="text-xs text-slate-500 dark:text-slate-400 flex-1 font-mono truncate">
          {window.location.origin}{window.location.pathname}?id={config.id}
        </span>
        <button
          type="button"
          onClick={handleLinkKopieren}
          className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer"
          title="Link kopieren"
        >
          📋 Kopieren
        </button>
      </div>

      {/* Einladungs-Fehler */}
      {einladungFehler.length > 0 && (
        <div className="text-sm text-red-600 dark:text-red-400 space-y-1">
          {einladungFehler.map((f, i) => <p key={i}>❌ {f}</p>)}
        </div>
      )}

      {/* Aktionen */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={handleEinladungen}
          disabled={effektiveTeilnehmer.length === 0 || einladungStatus === 'senden'}
          className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 cursor-pointer"
        >
          {einladungStatus === 'senden' ? 'Sende...' : '✉️ Einladungen versenden'}
        </button>

        <button
          type="button"
          onClick={async () => { await handleSpeichern(); onPruefungStarten() }}
          disabled={effektiveTeilnehmer.length === 0}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer font-medium"
        >
          Prüfung starten →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Kompilierung prüfen**

Run: `cd Pruefung && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 5: Commit**

```bash
git add src/components/lp/VorbereitungPhase.tsx src/components/lp/KlassenAuswahl.tsx src/components/lp/TeilnehmerListe.tsx
git commit -m "Pruefung: VorbereitungPhase mit Klassenlisten-Auswahl und Einladungen"
```

---

### Task 7: LobbyPhase

**Files:**
- Create: `src/components/lp/LobbyPhase.tsx`

- [ ] **Step 1: LobbyPhase erstellen**

```typescript
// src/components/lp/LobbyPhase.tsx
import type { PruefungsConfig, Teilnehmer } from '../../types/pruefung'
import type { SchuelerStatus } from '../../types/monitoring'

interface Props {
  config: PruefungsConfig
  schuelerStatus: SchuelerStatus[]
  onFreischalten: () => void
  onZurueck: () => void
  onAkzeptieren: (email: string, name: string) => void
}

export default function LobbyPhase({ config, schuelerStatus, onFreischalten, onZurueck, onAkzeptieren }: Props) {
  const teilnehmer = config.teilnehmer ?? []
  const teilnehmerEmails = new Set(teilnehmer.map((t) => t.email))

  // Bereit = eingeloggt und in Teilnehmerliste
  const bereite = schuelerStatus.filter(
    (s) => s.status !== 'nicht-gestartet' && teilnehmerEmails.has(s.email),
  )
  // Unerwartete = eingeloggt aber nicht in Teilnehmerliste
  const unerwartete = schuelerStatus.filter(
    (s) => s.status !== 'nicht-gestartet' && !teilnehmerEmails.has(s.email),
  )
  // Ausstehend = in Teilnehmerliste aber nicht eingeloggt
  const ausstehende = teilnehmer.filter(
    (t) => !schuelerStatus.some((s) => s.email === t.email && s.status !== 'nicht-gestartet'),
  )

  const fortschritt = teilnehmer.length > 0
    ? Math.round((bereite.length / teilnehmer.length) * 100)
    : 0

  return (
    <div className="space-y-4">
      {/* Fortschrittsbalken */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-300">
            Bereit: <strong>{bereite.length}</strong> / {teilnehmer.length}
          </span>
          <span className="text-slate-500 dark:text-slate-400">{fortschritt}%</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${fortschritt}%` }}
          />
        </div>
      </div>

      {/* SuS-Liste */}
      <div className="max-h-80 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-100 dark:divide-slate-700">
        {/* Bereite SuS */}
        {bereite.map((s) => (
          <div key={s.email} className="flex items-center gap-3 px-3 py-2">
            <span className="text-green-500">🟢</span>
            <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">{s.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{s.klasse ?? '—'}</span>
            <span className="text-xs text-green-600 dark:text-green-400">bereit</span>
          </div>
        ))}

        {/* Ausstehende SuS */}
        {ausstehende.map((t) => (
          <div key={t.email} className="flex items-center gap-3 px-3 py-2 opacity-60">
            <span>⚪</span>
            <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">{t.name}, {t.vorname}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{t.klasse}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">ausstehend</span>
          </div>
        ))}

        {/* Unerwartete SuS */}
        {unerwartete.map((s) => (
          <div key={s.email} className="flex items-center gap-3 px-3 py-2 bg-amber-50 dark:bg-amber-900/10">
            <span>⚠️</span>
            <span className="flex-1 text-sm text-amber-800 dark:text-amber-200">{s.name || s.email}</span>
            <span className="text-xs text-amber-600 dark:text-amber-400">unerwartet</span>
            <button
              type="button"
              onClick={() => onAkzeptieren(s.email, s.name)}
              className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 cursor-pointer"
            >
              Akzeptieren
            </button>
          </div>
        ))}
      </div>

      {/* Aktionen */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onZurueck}
          className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer"
        >
          ← Zurück zur Vorbereitung
        </button>

        <button
          type="button"
          onClick={onFreischalten}
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer font-medium"
        >
          ▶ Freischalten
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/lp/LobbyPhase.tsx
git commit -m "Pruefung: LobbyPhase mit Bereitschafts-Anzeige und Freischalten"
```

---

### Task 8: AktivPhase + ZusammenfassungsLeiste + SusDetailPanel

**Files:**
- Create: `src/components/lp/AktivPhase.tsx`
- Create: `src/components/lp/ZusammenfassungsLeiste.tsx`
- Create: `src/components/lp/SusDetailPanel.tsx`

- [ ] **Step 1: ZusammenfassungsLeiste erstellen**

```typescript
// src/components/lp/ZusammenfassungsLeiste.tsx
import type { SchuelerStatus } from '../../types/monitoring'

interface Props {
  schueler: SchuelerStatus[]
  gesamtTeilnehmer: number
}

export default function ZusammenfassungsLeiste({ schueler, gesamtTeilnehmer }: Props) {
  const aktiv = schueler.filter((s) => s.status === 'aktiv').length
  const abgegeben = schueler.filter((s) => s.status === 'abgegeben').length
  const ausstehend = gesamtTeilnehmer - schueler.filter((s) => s.status !== 'nicht-gestartet').length

  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <span className="text-blue-600 dark:text-blue-400">
        🔵 {aktiv} aktiv
      </span>
      <span className="text-green-600 dark:text-green-400">
        ✅ {abgegeben} abgegeben
      </span>
      {ausstehend > 0 && (
        <span className="text-slate-500 dark:text-slate-400">
          ⚪ {ausstehend} ausstehend
        </span>
      )}
    </div>
  )
}
```

- [ ] **Step 2: SusDetailPanel erstellen**

```typescript
// src/components/lp/SusDetailPanel.tsx
import type { SchuelerStatus } from '../../types/monitoring'

interface Props {
  schueler: SchuelerStatus
  onSchliessen: () => void
}

export default function SusDetailPanel({ schueler, onSchliessen }: Props) {
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-lg z-30 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{schueler.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{schueler.email}</p>
          {schueler.klasse && (
            <p className="text-xs text-slate-500 dark:text-slate-400">Klasse: {schueler.klasse}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onSchliessen}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Status-Info */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">Status</span>
            <p className="font-medium text-slate-700 dark:text-slate-200">{statusLabel(schueler.status)}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">Login</span>
            <p className="font-medium text-slate-700 dark:text-slate-200">
              {schueler.startzeit
                ? new Date(schueler.startzeit).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
                : '—'}
            </p>
          </div>
        </div>

        {/* Fortschritt */}
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">Fortschritt</span>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: schueler.gesamtFragen > 0 ? `${(schueler.beantworteteFragen / schueler.gesamtFragen) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {schueler.beantworteteFragen}/{schueler.gesamtFragen}
            </span>
          </div>
        </div>

        {/* Aktuelle Frage */}
        {schueler.aktuelleFrage !== null && schueler.aktuelleFrage !== undefined && (
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">Aktuelle Frage</span>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Frage {schueler.aktuelleFrage + 1} von {schueler.gesamtFragen}
            </p>
          </div>
        )}

        {/* Fragen-Übersicht (vereinfacht: nimmt sequentielles Beantworten an.
            Für per-Frage Status wäre ein zusätzliches Datenfeld nötig → Folge-Feature) */}
        {/* Zeitverlauf (Spec: "chronologische Liste wann welche Frage besucht") → deferred,
            da aktuell keine per-Frage-Zeitstempel im Sheet gespeichert werden */}
        {schueler.gesamtFragen > 0 && (
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">Fragen</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {Array.from({ length: schueler.gesamtFragen }, (_, i) => {
                const istAktuell = schueler.aktuelleFrage === i
                const istBeantwortet = i < schueler.beantworteteFragen
                return (
                  <span
                    key={i}
                    className={`w-7 h-7 flex items-center justify-center text-xs rounded
                      ${istAktuell
                        ? 'bg-blue-500 text-white font-bold'
                        : istBeantwortet
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                      }`}
                  >
                    {i + 1}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Technische Details */}
        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Heartbeats</span>
            <span>{schueler.heartbeats}</span>
          </div>
          <div className="flex justify-between">
            <span>Auto-Saves</span>
            <span>{schueler.autoSaveCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Netzwerkfehler</span>
            <span className={schueler.netzwerkFehler > 0 ? 'text-red-500' : ''}>{schueler.netzwerkFehler}</span>
          </div>
          {schueler.unterbrechungen.length > 0 && (
            <div>
              <span>Unterbrechungen: {schueler.unterbrechungen.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function statusLabel(status: SchuelerStatus['status']): string {
  switch (status) {
    case 'aktiv': return '🔵 Aktiv'
    case 'inaktiv': return '⏸️ Inaktiv'
    case 'abgegeben': return '✅ Abgegeben'
    case 'nicht-gestartet': return '⚪ Nicht gestartet'
    case 'beendet-lp': return '⏹ Beendet (LP)'
    default: return status
  }
}
```

- [ ] **Step 3: AktivPhase erstellen**

```typescript
// src/components/lp/AktivPhase.tsx
import { useState, useMemo } from 'react'
import type { SchuelerStatus } from '../../types/monitoring'
import type { PruefungsConfig } from '../../types/pruefung'
import { inaktivitaetsStufe } from '../../utils/phase'
import ZusammenfassungsLeiste from './ZusammenfassungsLeiste'
import SusDetailPanel from './SusDetailPanel'
import BeendenDialog from './BeendenDialog'

type Sortierung = 'name' | 'klasse' | 'fortschritt' | 'status'
type QuickFilter = 'alle' | 'aktiv' | 'abgegeben' | 'nicht-erschienen'

interface Props {
  config: PruefungsConfig
  schuelerStatus: SchuelerStatus[]
  onBeenden: () => void
}

export default function AktivPhase({ config, schuelerStatus, onBeenden }: Props) {
  const [sortierung, setSortierung] = useState<Sortierung>('name')
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('alle')
  const [detailSus, setDetailSus] = useState<string | null>(null)
  const [zeigBeendenDialog, setZeigBeendenDialog] = useState(false)

  const gefilterteSchueler = useMemo(() => {
    let liste = [...schuelerStatus]

    // Filter
    switch (quickFilter) {
      case 'aktiv':
        liste = liste.filter((s) => s.status === 'aktiv' || s.status === 'inaktiv')
        break
      case 'abgegeben':
        liste = liste.filter((s) => s.status === 'abgegeben' || s.status === 'beendet-lp')
        break
      case 'nicht-erschienen':
        liste = liste.filter((s) => s.status === 'nicht-gestartet')
        break
    }

    // Sortierung
    liste.sort((a, b) => {
      switch (sortierung) {
        case 'name': return (a.name || a.email).localeCompare(b.name || b.email)
        case 'klasse': return (a.klasse ?? '').localeCompare(b.klasse ?? '')
        case 'fortschritt':
          return (b.gesamtFragen > 0 ? b.beantworteteFragen / b.gesamtFragen : 0)
            - (a.gesamtFragen > 0 ? a.beantworteteFragen / a.gesamtFragen : 0)
        case 'status': return statusReihenfolge(a.status) - statusReihenfolge(b.status)
        default: return 0
      }
    })
    return liste
  }, [schuelerStatus, sortierung, quickFilter])

  const detailSchueler = detailSus ? schuelerStatus.find((s) => s.email === detailSus) : null

  return (
    <div className="space-y-4">
      {/* Zusammenfassung */}
      <ZusammenfassungsLeiste
        schueler={schuelerStatus}
        gesamtTeilnehmer={config.teilnehmer?.length ?? schuelerStatus.length}
      />

      {/* Filter + Sort */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 text-xs">
          {(['alle', 'aktiv', 'abgegeben', 'nicht-erschienen'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setQuickFilter(f)}
              className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors
                ${quickFilter === f
                  ? 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
            >
              {filterLabel(f)}
            </button>
          ))}
        </div>

        <select
          value={sortierung}
          onChange={(e) => setSortierung(e.target.value as Sortierung)}
          className="text-xs px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          <option value="name">Name (A-Z)</option>
          <option value="klasse">Klasse</option>
          <option value="fortschritt">Fortschritt</option>
          <option value="status">Status</option>
        </select>
      </div>

      {/* Tabelle */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr className="text-left text-xs text-slate-500 dark:text-slate-400 uppercase">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Klasse</th>
              <th className="px-3 py-2">Frage</th>
              <th className="px-3 py-2">Fortschritt</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {gefilterteSchueler.map((s) => {
              const stufe = inaktivitaetsStufe(s)
              const fortschrittProzent = s.gesamtFragen > 0
                ? Math.round((s.beantworteteFragen / s.gesamtFragen) * 100)
                : 0
              return (
                <tr
                  key={s.email}
                  onClick={() => setDetailSus(s.email)}
                  className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors
                    ${stufe === 'rot' ? 'bg-red-50 dark:bg-red-900/10' : ''}
                    ${stufe === 'orange' ? 'bg-amber-50 dark:bg-amber-900/10' : ''}
                    ${stufe === 'gelb' ? 'bg-yellow-50 dark:bg-yellow-900/5' : ''}
                  `}
                >
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-200 font-medium">
                    {s.name || s.email}
                    {stufe && (
                      <span className="ml-1 text-xs" title={`Inaktiv seit >${{ gelb: '1', orange: '3', rot: '5' }[stufe]} Min.`}>
                        {{ gelb: '🟡', orange: '🟠', rot: '🔴' }[stufe]}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{s.klasse ?? '—'}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                    {s.aktuelleFrage !== null && s.aktuelleFrage !== undefined
                      ? `${s.aktuelleFrage + 1}/${s.gesamtFragen}`
                      : '—'}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-20">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${fortschrittProzent}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">{fortschrittProzent}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {statusBadge(s.status)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Abgabe-Zähler */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Abgegeben: {schuelerStatus.filter((s) => s.status === 'abgegeben').length} / {config.teilnehmer?.length ?? schuelerStatus.length}
      </p>

      {/* Beenden-Button */}
      <div className="flex justify-center pt-2 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setZeigBeendenDialog(true)}
          className="px-6 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer font-medium"
        >
          ⏹ Prüfung beenden
        </button>
      </div>

      {/* Detail-Panel */}
      {detailSchueler && (
        <SusDetailPanel
          schueler={detailSchueler}
          onSchliessen={() => setDetailSus(null)}
        />
      )}

      {/* Beenden-Dialog (bestehende Komponente — Props-Interface verifizieren!) */}
      {/* BeendenDialog.tsx akzeptiert aktuell: { pruefungId, schueler, onSchliessen, onBeendet }
          Falls Interface abweicht, Props anpassen oder BeendenDialog erweitern. */}
      {zeigBeendenDialog && (
        <BeendenDialog
          pruefungId={config.id}
          schueler={schuelerStatus}
          onSchliessen={() => setZeigBeendenDialog(false)}
          onBeendet={onBeenden}
        />
      )}
    </div>
  )
}

function statusReihenfolge(status: SchuelerStatus['status']): number {
  switch (status) {
    case 'aktiv': return 0
    case 'inaktiv': return 1
    case 'nicht-gestartet': return 2
    case 'abgegeben': return 3
    case 'beendet-lp': return 4
    default: return 5
  }
}

function filterLabel(f: QuickFilter): string {
  switch (f) {
    case 'alle': return 'Alle'
    case 'aktiv': return 'Aktiv'
    case 'abgegeben': return 'Abgegeben'
    case 'nicht-erschienen': return 'Nicht erschienen'
  }
}

function statusBadge(status: SchuelerStatus['status']): JSX.Element {
  switch (status) {
    case 'aktiv':
      return <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">🔵 Aktiv</span>
    case 'abgegeben':
      return <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">✅ Abgegeben</span>
    case 'nicht-gestartet':
      return <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full">⚪ Nicht da</span>
    case 'beendet-lp':
      return <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">⏹ Beendet</span>
    case 'inaktiv':
      return <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">⏸️ Inaktiv</span>
    default:
      return <span>{status}</span>
  }
}
```

- [ ] **Step 4: Kompilierung prüfen**

Run: `cd Pruefung && npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 5: Commit**

```bash
git add src/components/lp/AktivPhase.tsx src/components/lp/ZusammenfassungsLeiste.tsx src/components/lp/SusDetailPanel.tsx
git commit -m "Pruefung: AktivPhase mit Live-Monitoring, Inaktivitätswarnungen und Detail-Panel"
```

---

### Task 9: BeendetPhase

**Files:**
- Create: `src/components/lp/BeendetPhase.tsx`

- [ ] **Step 1: BeendetPhase erstellen**

```typescript
// src/components/lp/BeendetPhase.tsx
import type { PruefungsConfig } from '../../types/pruefung'
import type { SchuelerStatus } from '../../types/monitoring'

interface Props {
  config: PruefungsConfig
  schuelerStatus: SchuelerStatus[]
  onExportieren: () => void
  onKorrektur: () => void
}

export default function BeendetPhase({ config, schuelerStatus, onExportieren, onKorrektur }: Props) {
  const abgegeben = schuelerStatus.filter((s) => s.status === 'abgegeben')
  const erzwungen = schuelerStatus.filter((s) => s.status === 'beendet-lp')
  const nichtErschienen = schuelerStatus.filter((s) => s.status === 'nicht-gestartet')
  const gesamtTeilnehmer = config.teilnehmer?.length ?? schuelerStatus.length

  return (
    <div className="space-y-6">
      {/* Zusammenfassung */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Teilnehmer" wert={gesamtTeilnehmer} />
        <StatBox label="Abgegeben" wert={abgegeben.length} suffix={`(${Math.round((abgegeben.length / Math.max(gesamtTeilnehmer, 1)) * 100)}%)`} farbe="text-green-600 dark:text-green-400" />
        <StatBox label="Erzwungen" wert={erzwungen.length} farbe="text-amber-600 dark:text-amber-400" />
        <StatBox label="Nicht erschienen" wert={nichtErschienen.length} farbe="text-slate-500 dark:text-slate-400" />
      </div>

      {/* SuS-Liste */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr className="text-left text-xs text-slate-500 dark:text-slate-400 uppercase">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Abgabe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {schuelerStatus
              .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email))
              .map((s) => (
                <tr key={s.email}>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{s.name || s.email}</td>
                  <td className="px-3 py-2 text-xs">
                    {s.status === 'abgegeben' && <span className="text-green-600 dark:text-green-400">✅ Abgegeben</span>}
                    {s.status === 'beendet-lp' && <span className="text-amber-600 dark:text-amber-400">⚠️ Erzwungen</span>}
                    {s.status === 'nicht-gestartet' && <span className="text-slate-400">⚪ Nicht erschienen</span>}
                    {s.status === 'aktiv' && <span className="text-blue-600 dark:text-blue-400">🔵 Noch aktiv</span>}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                    {s.abgabezeit
                      ? new Date(s.abgabezeit).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Aktionen */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onExportieren}
          className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer"
        >
          Ergebnisse exportieren
        </button>
        <button
          type="button"
          onClick={onKorrektur}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium"
        >
          Zur Korrektur →
        </button>
      </div>
    </div>
  )
}

function StatBox({ label, wert, suffix, farbe }: {
  label: string
  wert: number
  suffix?: string
  farbe?: string
}) {
  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">{label}</p>
      <p className={`text-xl font-bold ${farbe ?? 'text-slate-800 dark:text-slate-100'}`}>
        {wert}
        {suffix && <span className="text-xs font-normal ml-1">{suffix}</span>}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/lp/BeendetPhase.tsx
git commit -m "Pruefung: BeendetPhase mit Zusammenfassung und Export/Korrektur-Links"
```

---

### Task 10: MonitoringDashboard Phase-Integration

**Files:**
- Modify: `src/components/lp/MonitoringDashboard.tsx`

Kontext: Die bestehende MonitoringDashboard.tsx (512 Zeilen) zeigt aktuell eine flache SuS-Liste mit Filter/Sort. Wir ersetzen die Haupt-Ansicht mit einem Phase-Router, behalten aber die bestehende Datenlade-Logik, Header, und Fragen-Browser.

- [ ] **Step 1: Neue Imports hinzufügen**

Am Anfang der Datei, nach den bestehenden Imports:

```typescript
import type { PruefungsConfig } from '../../types/pruefung'
import type { PruefungsPhase } from '../../types/monitoring'
import { bestimmePhase } from '../../utils/phase'
import PhaseHeader from './PhaseHeader'
import VorbereitungPhase from './VorbereitungPhase'
import LobbyPhase from './LobbyPhase'
import AktivPhase from './AktivPhase'
import BeendetPhase from './BeendetPhase'
```

- [ ] **Step 2: Config-State und Phase-Berechnung hinzufügen**

In der Komponente, nach den bestehenden State-Deklarationen:

```typescript
// Config der Prüfung (für Phasen-Bestimmung)
const [config, setConfig] = useState<PruefungsConfig | null>(null)

// Phase ableiten
const phase: PruefungsPhase = config && daten
  ? bestimmePhase(config, daten.schueler)
  : 'vorbereitung'
```

Die Config muss beim Laden der Monitoring-Daten mitgeladen werden. In der bestehenden `ladeDaten` Funktion oder einem separaten Effect die Config aus `apiService.ladeAlleConfigs()` holen und per `pruefungId` filtern.

- [ ] **Step 3: Phase-basiertes Rendering**

Im JSX-Return, den Bereich zwischen Header und der bestehenden SuS-Liste/Fragen-Ansicht durch einen Phase-Router ersetzen. Der bestehende Code für SuS-Zeilen wird in die AktivPhase verlagert (die Logik existiert jetzt in eigenen Komponenten).

```tsx
{/* Phase-Header (immer sichtbar) */}
{config && <PhaseHeader config={config} phase={phase} />}

{/* Phase-spezifische Ansicht */}
{config && phase === 'vorbereitung' && (
  <VorbereitungPhase
    config={config}
    onTeilnehmerGesetzt={(teilnehmer) => {
      setConfig({ ...config, teilnehmer })
    }}
    onPruefungStarten={async () => {
      // Prüfung freischalten (bestehende API)
      if (user) {
        await apiService.schaltePruefungFrei(config.id, user.email)
        setConfig({ ...config, freigeschaltet: true })
      }
    }}
  />
)}

{config && phase === 'lobby' && daten && (
  <LobbyPhase
    config={config}
    schuelerStatus={daten.schueler}
    onFreischalten={async () => {
      if (user) {
        await apiService.schaltePruefungFrei(config.id, user.email)
        setConfig({ ...config, freigeschaltet: true })
      }
    }}
    onZurueck={async () => {
      // Teilnehmer leeren → Phase fällt auf 'vorbereitung' zurück
      // SuS bleiben im Wartebildschirm (haben keinen Zugriff auf Fragen)
      if (user) {
        await apiService.setzeTeilnehmer(user.email, config.id, [])
        setConfig({ ...config, teilnehmer: [] })
      }
    }}
    onAkzeptieren={async (email, name) => {
      // Unerwarteten SuS zur Teilnehmerliste hinzufügen
      const neueTeilnehmer = [
        ...(config.teilnehmer ?? []),
        { email, name, vorname: '', klasse: '—', quelle: 'manuell' as const },
      ]
      if (user) {
        await apiService.setzeTeilnehmer(user.email, config.id, neueTeilnehmer)
        setConfig({ ...config, teilnehmer: neueTeilnehmer })
      }
    }}
  />
)}

{config && phase === 'aktiv' && daten && (
  <AktivPhase
    config={config}
    schuelerStatus={daten.schueler}
    onBeenden={() => ladeDaten()} // Refresh nach Beenden
  />
)}

{config && phase === 'beendet' && daten && (
  <BeendetPhase
    config={config}
    schuelerStatus={daten.schueler}
    onExportieren={() => { /* TODO: Batch-Export öffnen */ }}
    onKorrektur={() => { /* TODO: Navigation zu Korrektur */ }}
  />
)}
```

**Wichtig:** Die bestehende SuS-Zeilen-Ansicht (`ansicht === 'sus'`) kann als Fallback bestehen bleiben für den Fall, dass `config` nicht geladen werden konnte (Demo-Modus, Legacy). In dem Fall wird die bestehende Ansicht gerendert.

- [ ] **Step 4: Config laden**

In der bestehenden `ladeDaten` Callback-Funktion oder einem separaten useEffect: Die PruefungsConfig muss verfügbar sein. Mögliche Ansätze:
1. `daten` (MonitoringDaten) um `config` erweitern — erfordert Backend-Änderung
2. `apiService.ladeAlleConfigs()` aufrufen und per `pruefungId` filtern

Pragmatisch: Einen separaten `useEffect` für Config-Loading:

```typescript
useEffect(() => {
  if (!user || !pruefungId || istDemoModus) return
  const ladeConfig = async () => {
    try {
      const configs = await apiService.ladeAlleConfigs(user.email)
      const found = configs?.find((c) => c.id === pruefungId)
      if (found) setConfig(found)
    } catch { /* ignore */ }
  }
  ladeConfig()
  // Refresh Config alle 15s (für beendetUm, teilnehmer Updates)
  const interval = setInterval(ladeConfig, 15000)
  return () => clearInterval(interval)
}, [user, pruefungId, istDemoModus])
```

- [ ] **Step 5: Kompilierung prüfen**

Run: `cd Pruefung && npx tsc --noEmit 2>&1 | head -30`

Mögliche Fehler hier beheben (Import-Pfade, fehlende Props).

- [ ] **Step 6: Commit**

```bash
git add src/components/lp/MonitoringDashboard.tsx
git commit -m "Pruefung: MonitoringDashboard mit Phase-Router (vorbereitung/lobby/aktiv/beendet)"
```

---

### Task 11: SuS Lobby-Wartebildschirm

**Files:**
- Modify: `src/components/Startbildschirm.tsx`

Kontext: Der bestehende `Startbildschirm.tsx` (217 Zeilen) hat bereits einen Warteraum wenn `config.freigeschaltet === false`. Dieser pollt alle 3s `ladePruefung()`. Wir verbessern den Wartebildschirm mit einer Puls-Animation und klarerem Text.

- [ ] **Step 1: Lobby-Wartebildschirm verbessern**

In `Startbildschirm.tsx`, finde den Bereich der angezeigt wird wenn `!config.freigeschaltet` (vermutlich ein `if`-Block mit Lock-Icon und "Warten auf Freigabe" Text).

Ersetze/erweitere den Wartebereich:

```tsx
{/* Lobby-Wartebildschirm */}
{!config.freigeschaltet && (
  <div className="flex flex-col items-center justify-center gap-6 py-12">
    {/* Puls-Animation */}
    <div className="relative">
      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
        <span className="text-2xl">🔒</span>
      </div>
      <div className="absolute inset-0 rounded-full bg-blue-200 dark:bg-blue-800/20 animate-ping opacity-30" />
    </div>

    <div className="text-center space-y-2">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {config.titel}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Die Lehrperson hat die Prüfung noch nicht freigegeben.
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Die Seite aktualisiert sich automatisch.
      </p>
    </div>
  </div>
)}
```

- [ ] **Step 2: Kompilierung prüfen**

Run: `cd Pruefung && npx tsc --noEmit 2>&1 | head -10`

- [ ] **Step 3: Commit**

```bash
git add src/components/Startbildschirm.tsx
git commit -m "Pruefung: Lobby-Wartebildschirm mit Puls-Animation verbessert"
```

---

### Task 12: Manueller Integrationstest + Cleanup

- [ ] **Step 1: Dev-Server starten und testen**

Run: `cd Pruefung && npm run dev`

Manuell prüfen:
1. LP-Login → Monitoring öffnen → VorbereitungPhase wird angezeigt
2. Klassenlisten laden (wenn Backend konfiguriert)
3. Klasse auswählen → Teilnehmer erscheinen
4. "Prüfung starten" → Phase wechselt
5. SuS-Login → Lobby-Wartebildschirm mit Puls
6. LP: Freischalten → AktivPhase mit Monitoring-Tabelle
7. Inaktivitäts-Stufen visuell korrekt (gelb/orange/rot)
8. Klick auf SuS → Detail-Panel (Slide-in)
9. LP: Prüfung beenden → BeendetPhase mit Zusammenfassung

- [ ] **Step 2: TypeScript-Fehler beheben**

Run: `cd Pruefung && npx tsc --noEmit`

Alle Fehler beheben die aufgetreten sind.

- [ ] **Step 3: Build testen**

Run: `cd Pruefung && npm run build`

Expected: Build erfolgreich, keine Fehler.

- [ ] **Step 4: HANDOFF.md aktualisieren**

In `Pruefung/HANDOFF.md` den neuen Feature-Status dokumentieren:
- Prüfungs-Workflow (Teilnehmer-Auswahl, Lobby, Monitoring, Beenden) — implementiert
- Neue Apps-Script-Aktionen: ladeKlassenlisten, sendeEinladungen, setzeTeilnehmer

- [ ] **Step 5: Final Commit + Push**

```bash
git add -A
git commit -m "Pruefung: Prüfungs-Workflow komplett (Teilnehmer, Lobby, Monitoring, Beenden)"
git push
```

**Reminder an User:** apps-script-code.js muss im Apps Script Editor aktualisiert + neu bereitgestellt werden.
