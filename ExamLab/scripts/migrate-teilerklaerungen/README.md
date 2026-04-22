# C9 Phase 4 — Teilerklärungs-Migration

Lokales Node-Skript, das via Apps-Script-Admin-Endpoint + Anthropic-SDK für alle
bestehenden ExamLab-Fragen (~2400) pro Sub-Element (Option, Aussage, Lücke, etc.)
eine KI-Teilerklärung generiert und zurück in die Frage schreibt.

Analog zum Editor-Pfad (`ki.ausfuehren('generiereMusterloesung', ...)`), nur als
Batch-Job ohne UI — und pro Frage statt pro LP-Klick.

## Voraussetzung

- **Node ≥ 20.11** (für `fileURLToPath` und moderne `fetch`-API). Prüfe mit `node --version`.
- **Anthropic API Key** aus dem Anthropic-Dashboard. Kosten: Sonnet 4.6 liegt bei
  ca. $3 per 1M input tokens + $15 per 1M output tokens. Bei ~2400 Fragen à
  ~1500 Token Input + ~500 Token Output erwartet Gesamtkosten **~$25–35**.
- **Apps-Script-URL** der Produktions-Bereitstellung (Webapp-Exec-URL).
- **LP-E-Mail** mit Admin-Rechten (muss in der LP-Tabelle auf Spalte `adminRolle=true`).

Zusätzlich ist der **Admin-Endpoint `holeAlleFragenFuerMigration` im Apps-Script
nötig** — ist Teil desselben Phase-4-Commits. Nach dem Merge muss Apps-Script
als neue Bereitstellung deployed werden.

## Setup

```bash
cd ExamLab/scripts/migrate-teilerklaerungen
npm install

export ANTHROPIC_API_KEY=sk-ant-...
export APPS_SCRIPT_URL=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
export MIGRATION_EMAIL=admin@gymhofwil.ch   # Deine LP-E-Mail mit Admin-Rechten
```

## Workflow

### 1. Dry-Run (20 Fragen, schreibt NICHT zurück)

```bash
npm run dry-run
```

→ Lädt 20 Fragen, fragt KI, schreibt Output in `log.jsonl` + `state.json`,
aber **ruft `speichereFrage` NICHT auf**. Sheet bleibt unverändert.

Öffne `log.jsonl` und prüfe stichprobenartig 3–5 Fragen verschiedener Typen auf
fachliche Plausibilität. Bei Zweifeln: Modell wechseln
(`MIGRATION_MODEL=claude-haiku-4-5-20251001` für günstiger/schneller, oder
`claude-opus-4-7` für max. Qualität) und erneut `dry-run`.

### 2. Stichprobe (50 Fragen live, kleine Batch)

```bash
node migrate.mjs --limit=50
```

→ Schreibt 50 Fragen live ins Sheet. Prüfe im ExamLab-Üben-Modus die ersten
5–10 Fragen: Teilerklärungen pro Option sichtbar nach „Antwort prüfen"?

### 3. Full Run (alle ~2400 Fragen, läuft ~160 min)

```bash
nohup node migrate.mjs > migrate.log 2>&1 &
tail -f migrate.log
```

Bei Abbruch (Ctrl-C, Netz-Timeout, Anthropic-Rate-Limit): einfach erneut starten.
`state.json` stellt sicher, dass keine Frage doppelt verarbeitet wird.

## State-Datei (`state.json`)

```json
{
  "gestartet": "2026-04-22T10:00:00.000Z",
  "fragen": {
    "<frage-id>": {
      "status": "done" | "failed" | "giving-up" | "skipped",
      "teile": 4,
      "musterloesung": "Kurzvorschau (120 Zeichen)",
      "retries": 0,
      "zeitpunkt": "..."
    }
  }
}
```

**Status-Semantik:**
- `done` — Teilerklärungen erfolgreich geschrieben (oder Dry-Run loggiert).
- `skipped` — Frage hatte bereits `erklaerung`-Felder (Idempotenz).
- `failed` — Fehler beim Claude-Call oder Apps-Script-Save. Retry beim nächsten Lauf.
- `giving-up` — 3× gescheitert, manuell prüfen (z.B. via `grep giving-up log.jsonl`).

## Log-Datei (`log.jsonl`)

JSONL mit einer Zeile pro verarbeiteter Frage. Enthält Frage-ID, Typ, Status,
Anzahl Teilerklärungen, Musterlösungs-Preview und ggf. Fehlermeldung.

## Kosten senken

- **Prompt-Caching**: Der System-Prompt ist via `cache_control: ephemeral`
  gecacht — nach der ersten Frage werden Input-Tokens für das System nur noch
  mit ~10% des Preises abgerechnet. Cache-TTL: 5 Min, läuft während des Batches
  durchgehend warm.
- **Rate-Limit-Buffer**: 800 ms pro Frage (überschreibbar via
  `MIGRATION_RATE_LIMIT_MS`). Mit Tier-1 Anthropic-Rate-Limit (50 req/min)
  sind das 75% Auslastung.
- **Haiku-Option**: `MIGRATION_MODEL=claude-haiku-4-5-20251001` — ca. 10× günstiger
  als Sonnet, aber fachliche Qualität bei Schweizer Recht/VWL bitte vorher im
  Dry-Run prüfen.

## Nach erfolgreicher Migration

```bash
# State-Datei archivieren für spätere Referenz
cp state.json state-post-migration-$(date +%Y%m%d).json
git add -f state-post-migration-*.json
git commit -m "C9: Migration erfolgt — State archiviert"
```

Dann in ExamLab (Üben-Modus) stichprobenartig prüfen:
- MC-Frage → Antwort prüfen → Teilerklärungen pro Option sichtbar?
- Richtig/Falsch → pro Aussage Teilerklärung?
- Lückentext → pro Lücke?
- Hotspot/Bildbeschriftung/DragDrop → pro Zone?

Bei Auffälligkeiten: entsprechenden Frage-Typ in `state.json` resetten (`status` löschen),
Skript erneut laufen lassen — betroffene Fragen werden neu bereichert.

## Sicherheit

- **Kein API-Key im Repo**: `.env` ist git-ignored, State und Log-Files
  enthalten keine Keys.
- **Admin-Check im Apps-Script**: `holeAlleFragenFuerMigration` + `speichereFrage`
  prüfen `istAdmin_(email)` → nur LP mit `adminRolle=true` darf migrieren.
- **Idempotenz**: Fragen mit bestehenden `erklaerung`-Feldern werden übersprungen,
  sodass versehentliches Re-Running keine manuell gepflegten Texte überschreibt.
