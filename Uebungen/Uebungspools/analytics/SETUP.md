# Analytics Setup – Übungspools

## Schritt 1: Google Sheet + Apps Script erstellen

1. **Neues Google Sheet** erstellen (z.B. «Übungspool Analytics»)
2. **Extensions → Apps Script** öffnen
3. Den Inhalt von `apps_script_code.js` einfügen
4. **Einmal `setupSheet`** ausführen (Menü: Ausführen → Funktion auswählen → setupSheet → ▶️)
   → Erstellt die Tabellenblätter «Events» und «Sessions» mit Spaltenüberschriften
5. **Deploy → Neue Bereitstellung**:
   - Typ: Web-App
   - Ausführen als: Ich
   - Zugriff: **Jeder, auch anonym**
   - → URL kopieren (sieht aus wie `https://script.google.com/macros/s/AKfy.../exec`)

## Schritt 2: URL in pool.html eintragen

In `pool.html` die Zeile finden:

```javascript
const TRACKING_CONFIG={
  endpoint:'',   // ← HIER die Apps-Script-URL eintragen
```

Die kopierte URL als `endpoint` eintragen. Ohne URL ist das Tracking inaktiv.
Das Tracking ist komplett anonym — es werden keine persönlichen Daten erfasst.

## Schritt 3: Dashboard konfigurieren

1. Im Google Sheet: **Datei → Im Web veröffentlichen**
   - Format: CSV
   - Tabellenblatt: «Events» → Link kopieren
   - Tabellenblatt: «Sessions» → Link kopieren
2. Dashboard öffnen: `analytics/dashboard.html` (lokal oder via GitHub Pages)
3. Die beiden CSV-URLs eintragen und «Laden» klicken
4. URLs werden im Browser gespeichert (localStorage)

## Funktionsweise

### Was wird getrackt?

| Event | Wann | Daten |
|-------|------|-------|
| `answer` | Nach jeder Antwort | Frage-ID, Topic, Typ, Diff, richtig/falsch, gewählte Antwort, Antwortzeit |
| `skip` | Frage übersprungen | Frage-ID, Topic, Typ, Diff |
| `session_end` | Quiz beendet | Score, Dauer, Anzahl Fragen, Topics |

### Datenschutz

- **Komplett anonym** — keine Identifikation der SuS, keine Klassen, keine Namen
- **Session-IDs sind zufällig** und nicht rückverfolgbar
- **Kein Tracking ohne konfigurierte URL** — Endpoint muss explizit eingetragen werden

## Dashboard-Auswertungen

1. **Fehlerquote pro Frage** — Sortiert nach Fehlerquote, mit häufigster Falschantwort
2. **Übersprungene Fragen** — Welche Fragen werden gemieden?
3. **Topics nach Nutzung** — Welche Themen werden am meisten geübt?
4. **Nutzung nach Schwierigkeit** — Richtig/Falsch-Verteilung pro Schwierigkeitsgrad
5. **Antwortzeit nach Schwierigkeit** — Durchschnittliche Antwortzeit pro Stufe
6. **Zeitverlauf** — Nutzung über Tage (z.B. Spitzen vor Prüfungen)
7. **Distraktorenanalyse** — Welche MC-Optionen werden am häufigsten falsch gewählt?
