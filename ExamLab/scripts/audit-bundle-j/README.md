# Audit Bundle J — DragDrop-Bild-Fragen

## Voraussetzungen

- Node 20+
- Apps-Script-URL der aktuellen Bereitstellung (`VITE_APPS_SCRIPT_URL` aus `ExamLab/.env.local` ist die heutige Prod-/Staging-URL)
- Admin-LP-E-Mail (Endpoint `holeAlleFragenFuerMigration` validiert via `istZugelasseneLP` + `rolle='admin'`)

## Setup (einmalig)

```bash
cd ExamLab/scripts/audit-bundle-j
npm install
```

## Ausführung

```bash
export APPS_SCRIPT_URL='https://script.google.com/macros/s/.../exec'
export MIGRATION_EMAIL='admin-lp@gymhofwil.ch'
cd ExamLab/scripts/audit-bundle-j
node zaehleDragDropFragen.mjs
```

## Output

- Total dragdrop_bild-Fragen
- Multi-Zone-Bug-Kandidaten (LP-Re-Edit nach Migration)
- Distraktor-Statistik
- IDs der betroffenen Fragen (zur LP-Kommunikation)

## Manueller Zusatz-Check

Aktive Üben-Sessions + Antworten in laufenden Prüfungen müssen manuell im
Apps Script Editor geprüft werden (Sheets `Übungssessions`, `Antworten`).
Dies bestimmt den optimalen Migrations-Zeitpunkt (Sektion 10.3 der Spec).
