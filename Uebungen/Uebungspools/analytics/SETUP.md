# Analytics Setup – Übungspools

## Ausgangslage

Das Analytics-Tracking nutzt das **bestehende Google Sheet** (bisher für Problemmeldungen), ergänzt um zwei neue Tabellenblätter. Das Apps Script verarbeitet über denselben Endpoint sowohl Problemmeldungen als auch Analytics-Events.

- **Google Sheet:** `uebungspool_analyse` (ehemals «Problemmeldungen Übungspools»)
- **Bestehendes Blatt:** «Problemmeldungen» (Problemmeldungen, bleibt unverändert)
- **Neue Blätter:** «Events» und «Sessions» (Analytics)

## Schritt 1: Apps Script aktualisieren

1. Das bestehende Google Sheet öffnen
2. **Extensions → Apps Script** öffnen
3. Den bestehenden Code **komplett ersetzen** mit dem Inhalt von `apps_script_code.js`
4. **Einmal `setupAnalyticsSheets`** ausführen (Menü: Ausführen → Funktion auswählen → `setupAnalyticsSheets` → ▶️)
   → Erstellt die Tabellenblätter «Events» und «Sessions» mit Spaltenüberschriften
   → Das bestehende Blatt «Problemmeldungen» wird **nicht** verändert
5. **Deploy → Bereitstellungen verwalten → Bearbeiten (Stift-Icon) → Neue Version**
   → Die bestehende URL bleibt gleich, es braucht keine neue Bereitstellung

## Schritt 2: Endpoint-URL prüfen

In `pool.html` ist die Tracking-URL bereits eingetragen (gleiche URL wie für Problemmeldungen):

```javascript
const TRACKING_CONFIG={
  endpoint:'https://script.google.com/macros/s/AKfycbw46sH_lj9uH9f1C6olplv2PMhTUHU9i1LELin2GDO4a2N8S5adX4CzUyATO0jQW4Yuvw/exec'
};
```

Falls die URL sich nach dem Redeployment ändert, hier anpassen. Ohne URL ist das Tracking inaktiv.

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
| `session_end` | Quiz beendet | Score, Dauer, Anzahl Fragen |

### Dispatch-Logik im Apps Script

Das Script unterscheidet die Request-Typen anhand der URL-Parameter:
- Parameter `event` vorhanden → Analytics (answer/skip/session_end)
- Parameter `pool` + `qid` + `cat` vorhanden → Problemmeldung (bestehendes Verhalten)

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
