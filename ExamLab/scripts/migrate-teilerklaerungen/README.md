# C9 Phase 4 — Teilerklärungs-Migration

Einmalige Migration: ~2400 bestehende ExamLab-Fragen bekommen einheitlich KI-generierte
Musterlösungen + pro-Sub-Element-Teilerklärungen. Bearbeitet von **Claude Code** (keine
externe SDK-Dependency, nutzt Subscription des Users).

**Spec:** `../../docs/superpowers/specs/2026-04-22-c9-migration-design.md`
**Plan:** `../../docs/superpowers/plans/2026-04-22-c9-migration.md`
**Session-Protokoll:** [SESSION-PROTOCOL.md](SESSION-PROTOCOL.md)

## Voraussetzungen

- **Node >= 20.11**
- **Apps-Script-URL** der Produktions-Bereitstellung (nach Deploy des Batch-Endpoints)
- **LP-E-Mail mit `rolle=admin`**
- **Google-Sheets-Backup der Fragenbank** (Pflicht vor Migration!)

## Workflow (6 Phasen)

### Phase A: Setup

1. Google-Sheets-Backup: Drive → Fragenbank → Datei → **Kopie erstellen** → `ExamLab_Fragenbank_Backup_YYYY-MM-DD`
2. Apps-Script neu deployen (mit `batchUpdateFragenMigration` + `holeAlleFragenFuerMigration` aktiviert)
3. `testC9BatchUpdateFragenMigration` im GAS-Editor laufen lassen → erwartet `✓ C9 batchUpdateFragenMigration-Test bestanden.`
4. Produktions-Pause: keine Frage-Bearbeitung während Migration läuft
5. Env-Variablen setzen:
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

Siehe [SESSION-PROTOCOL.md](SESSION-PROTOCOL.md) für den genauen Ablauf pro Session.

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

| Datei | Rolle | Im Repo? |
|---|---|---|
| `dump.mjs` | Lädt alle Fragen via Apps-Script | ✓ |
| `review-generator.mjs` | Baut `stichprobe-review.md` aus Input + Updates + IDs | ✓ |
| `upload.mjs` | Schreibt Updates via Apps-Script pro Fachbereich | ✓ |
| `SESSION-PROTOCOL.md` | Leitfaden für Claude-Code-Session | ✓ |
| `package.json` | Node-Konfiguration (keine Dependencies) | ✓ |
| `.gitignore` | Ignoriert lokale Migrations-Dateien | ✓ |
| `state.json` | Resume-State | — (lokal, gitignored) |
| `fragen-input.jsonl` | Dump-Output | — (lokal, gitignored) |
| `fragen-updates.jsonl` | Claude-Code-Output | — (lokal, gitignored) |
| `stichprobe-ids.json` | 30 Stichproben-IDs (seed=42) | — (lokal, gitignored) |
| `upload.log` | Upload-History | — (lokal, gitignored) |

## Rollback

Bei Problemen:
1. Drive öffnen → Backup-Kopie umbenennen → Live-Fragenbank ersetzen
2. Apps-Script Cache via neuem Deploy invalidieren

Kein Frontend-Deploy nötig.

## Kosten

Keine externen Kosten (Claude-Code-Subscription + Apps-Script-Quoten reichen aus).
