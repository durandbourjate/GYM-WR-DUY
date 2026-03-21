# Open-End-Modus & LP-kontrolliertes Beenden

> Spec für Prüfungsplattform — Gymnasium Hofwil
> Datum: 2026-03-21

## Zusammenfassung

Zwei zusammenhängende Features für die Prüfungsdurchführung:

1. **Open-End-Modus:** Prüfung ohne feste Zeitbegrenzung. SuS sehen eine Stoppuhr (verstrichene Zeit), aber kein Limit. Die LP beendet manuell.
2. **LP-kontrolliertes Beenden:** LP kann eine laufende Prüfung beenden — sofort oder mit Restzeit. Funktioniert für alle SuS gleichzeitig oder einzeln. SuS mit Nachteilsausgleich (`zeitverlaengerungen`) erhalten ihre Zusatzminuten auf die Restzeit.

## 1. Config-Erweiterung

### Neues Feld in `PruefungsConfig`

```typescript
zeitModus: 'countdown' | 'open-end'  // Default: 'countdown'
```

- `countdown`: Wie bisher — `dauerMinuten` bestimmt die Dauer, Timer zählt runter, Auto-Abgabe bei 0.
- `open-end`: `dauerMinuten` bleibt im Config-Objekt (Wert egal, wird nicht verwendet). Timer zeigt verstrichene Zeit aufwärts. Keine automatische Abgabe — LP muss manuell beenden.

### Neue Felder im Configs-Sheet

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `zeitModus` | string | `'countdown'` oder `'open-end'` (Default: `'countdown'`) |
| `beendetUm` | string (ISO) | Zeitpunkt ab dem die Prüfung als beendet gilt (global) |
| `restzeitMinuten` | number | Restzeit in Minuten (nur bei Modus 'restzeit') |

### Neue Felder pro SuS im Antworten-Sheet

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `beendetUm` | string (ISO) | Individuelles Beenden durch LP (überschreibt globales) |
| `restzeitMinuten` | number | Individuelle Restzeit |

### Spalten-Migration

Die Endpoints `beendePruefung` und `heartbeat` müssen fehlende Spalten dynamisch hinzufügen (gleicher Ansatz wie bei `importierePoolFragen` — Spalten-Header prüfen, ggf. ergänzen). Für bestehende Prüfungen ohne diese Spalten: kein Problem, da leere Werte = kein Beenden.

## 2. Backend-Endpoint: `beendePruefung`

### Request

```typescript
{
  aktion: 'beendePruefung',
  pruefungId: string,
  email: string,           // LP-Email (Auth)
  modus: 'sofort' | 'restzeit',
  restzeitMinuten?: number, // Pflicht bei modus='restzeit'
  einzelneSuS?: string[]    // Optional: nur diese E-Mails beenden
}
```

### Logik

- **Auth:** Nur LP (`@gymhofwil.ch`) — jede LP kann jede Prüfung beenden (Single-Teacher-Setup, kein Multi-LP-Auth nötig)
- **Modus `sofort`:** `beendetUm = new Date().toISOString()`
- **Modus `restzeit`:** `beendetUm = new Date(Date.now() + restzeitMinuten * 60000).toISOString()`, `restzeitMinuten` gespeichert
- **Ohne `einzelneSuS`:** Schreibt in Configs-Sheet (global)
- **Mit `einzelneSuS`:** Schreibt in Antworten-Sheet pro SuS-Zeile
- **Override:** Ein zweiter Aufruf überschreibt den vorherigen `beendetUm`-Wert. LP kann z.B. erst Restzeit setzen, dann doch sofort beenden.

### Response

```typescript
// Erfolg:
{ success: true, beendetUm: string }

// Fehler:
{ success: false, error: string }
// Mögliche Fehler: 'nicht_autorisiert', 'pruefung_nicht_gefunden', 'keine_aktiven_sus'
```

## 3. Heartbeat-Erweiterung

### Neue TypeScript-Typen

```typescript
// In types/monitoring.ts
interface HeartbeatResponse {
  success: boolean
  beendetUm?: string        // ISO-Timestamp (global oder individuell)
  restzeitMinuten?: number   // Original-Restzeit (für Nachteilsausgleich-Berechnung)
}
```

### Aktuelle Heartbeat-Antwort

```typescript
{ success: true }
```

### Neue Heartbeat-Antwort

```typescript
{
  success: true,
  beendetUm?: string,
  restzeitMinuten?: number
}
```

### Backend-Logik im Heartbeat-Endpoint

1. Prüfe individuelles `beendetUm` für diese SuS-Email im Antworten-Sheet
2. Falls nicht vorhanden: Prüfe globales `beendetUm` im Configs-Sheet
3. Falls vorhanden: Liefere `beendetUm` + `restzeitMinuten` mit
4. Falls nicht vorhanden: Liefere nur `{ success: true }` (kein Beenden aktiv)

### Client-Integration

1. **`apiService.heartbeat()`** wird erweitert: parst JSON-Response und gibt `HeartbeatResponse` zurück (aktuell gibt nur `boolean` zurück)
2. **`usePruefungsMonitoring`** Hook: prüft `response.beendetUm` nach jedem Heartbeat, ruft neue Store-Action `setBeendetUm(beendetUm, restzeitMinuten)` auf
3. **Guard:** Wenn `pruefungStore.abgegeben === true`, wird `beendetUm` aus Heartbeat ignoriert (Race-Condition-Schutz)

## 4. SuS-Client: Beenden-Flow

### Store-Erweiterung (`pruefungStore.ts`)

Neue persisted Felder:

```typescript
beendetUm: string | null        // ISO-Timestamp, gesetzt via Heartbeat
restzeitMinuten: number | null   // Original-Restzeit
```

Neue Action:

```typescript
setBeendetUm: (beendetUm: string, restzeitMinuten?: number) => void
```

`beendetUm` wird in der `partialize`-Liste für Persist aufgenommen, damit es bei Page-Reload erhalten bleibt. Beim ersten Heartbeat nach Reload wird der Wert ggf. aktualisiert.

### Erkennung (im bestehenden Heartbeat-Intervall, alle ~10s)

Wenn Heartbeat `beendetUm` zurückliefert:

1. **Nachteilsausgleich berechnen:**
   - `zusatzMinuten = config.zeitverlaengerungen[user.email] || 0`
   - Wenn `restzeitMinuten` vorhanden (= Restzeit-Modus): `effektivBeendetUm = beendetUm + zusatzMinuten * 60000`
   - Wenn kein `restzeitMinuten` (= Sofort-Modus): `effektivBeendetUm = beendetUm` — **kein Nachteilsausgleich bei Sofort-Beenden** (bewusste Entscheidung: Sofort heisst sofort für alle)

2. **Sofort-Beenden** (`effektivBeendetUm <= now`):
   - Auto-Abgabe (gleicher Flow wie Zeitablauf)
   - Banner: "Prüfung wurde von der Lehrperson beendet"
   - Phase → `abgegeben`

3. **Restzeit-Beenden** (`effektivBeendetUm > now`):
   - Timer wechselt dynamisch zu Countdown bis `effektivBeendetUm`
   - Warn-Banner oben: "LP hat die Prüfung beendet — noch X:XX"
   - Bei Ablauf → Auto-Abgabe wie bei normalem Zeitablauf
   - Timer-Warnstufen greifen normal (15 Min orange, 5 Min rot)

### Startzeit für Open-End Timer

Die verstrichene Zeit wird ab `pruefungStore.startzeit` berechnet (gesetzt wenn SuS "Prüfung starten" klickt). Jeder SuS hat seine eigene Startzeit.

### Edge Cases

- **SuS hat bereits abgegeben:** `beendetUm` wird ignoriert (Guard in Heartbeat-Auswertung)
- **Page-Reload während Restzeit:** `beendetUm` aus persisted Store verwendet, Timer rechnet Countdown korrekt
- **LP overrides Restzeit mit Sofort:** Nächster Heartbeat liefert neues `beendetUm`, Client reagiert sofort

## 5. Timer-Komponente

### Modi

| Situation | Anzeige | Auto-Abgabe |
|-----------|---------|-------------|
| `countdown`, kein Beenden | Countdown von `dauerMinuten` (+ Nachteilsausgleich) | Ja, bei 0 |
| `open-end`, kein Beenden | Stoppuhr aufwärts (MM:SS oder H:MM:SS) | Nein |
| LP beendet mit Restzeit | Countdown bis `effektivBeendetUm` | Ja, bei 0 |
| LP beendet sofort | — (sofortige Abgabe, kein Timer nötig) | Sofort |

### Anpassungen

- Neuer Prop: `zeitModus: 'countdown' | 'open-end'`
- Neuer Prop: `beendetUm?: string` (von Store, via Heartbeat gesetzt)
- Neuer Prop: `restzeitMinuten?: number`
- Bei `open-end` ohne Beenden: Neue Funktion `berechneVerstricheneZeit(startzeit): number` in `zeit.ts`
- Bei `open-end` + `beendetUm` mit Restzeit: Wechsel zu Countdown-Logik (berechnet Sekunden bis `effektivBeendetUm`)
- Timer-Farbe bei Open-End ohne Beenden: neutral (slate), keine Warnstufen
- **`dauerMinuten` bei Open-End:** Timer ignoriert `dauerMinuten` komplett — kein `berechneRestzeit()`-Aufruf. Bestehende Logik `effektiveDauer = config.dauerMinuten + zusatzMinuten` wird nur bei `zeitModus === 'countdown'` ausgeführt.

## 6. LP-UI: MonitoringDashboard

### Globales Beenden

**Button "Prüfung beenden"** im Dashboard-Header (neben Freischaltung). Nur sichtbar wenn mindestens 1 SuS nicht abgegeben hat.

**Dialog `BeendenDialog` (neue Komponente):**
- Radio-Buttons: "Sofort beenden" / "Restzeit geben"
- Bei "Restzeit": Number-Input für Minuten (Default: 5, Min: 1)
- Hinweis bei Nachteilsausgleich: "X SuS mit Nachteilsausgleich erhalten zusätzliche Zeit"
- Bestätigungsdialog: "Prüfung für alle X aktiven SuS beenden?"
- Nach Bestätigung: API-Call `beendePruefung`, Dialog schliesst, Status-Badge aktualisiert

### Einzelne SuS beenden

**Button "Beenden" pro SuS** in `SchuelerZeile` (nur für Status `aktiv`/`inaktiv`).

Gleicher Sofort/Restzeit-Dialog, aber mit Name des SuS in Bestätigung: "Prüfung für [Name] beenden?"

### Status-Anzeige

Erweiterter Status-Union-Typ in `types/monitoring.ts`:

```typescript
type SchuelerPruefungsStatus = 'nicht-gestartet' | 'aktiv' | 'inaktiv' | 'abgegeben' | 'beendet-lp'
```

- `beendet-lp`: LP hat Beenden ausgelöst — Badge in Rot/Slate, unterscheidbar von grünem "abgegeben"
- Status wird im Backend-Monitoring-Endpoint abgeleitet: wenn `beendetUm` gesetzt (individuell oder global) UND `istAbgabe` noch nicht true → `beendet-lp`
- Sobald SuS-Client die Abgabe durchführt → wechselt zu `abgegeben`

## 7. Composer: ConfigTab

### Neuer Toggle "Zeitmodus"

Zwei Buttons (wie Privat/Schule-Toggle):
- **"Countdown"** → zeigt `dauerMinuten`-Input + `zeitanzeigeTyp`-Auswahl wie bisher
- **"Open-End"** → versteckt `dauerMinuten` + `zeitanzeigeTyp`, zeigt Hinweis: "Die Prüfung hat kein Zeitlimit. Beenden Sie die Prüfung manuell im Monitoring."

### Zeitanzeige bei Open-End

`zeitanzeigeTyp` wird automatisch auf `'verstricheneZeit'` gesetzt wenn `zeitModus` auf `'open-end'` wechselt. Das Dropdown wird nicht angezeigt.

## 8. Betroffene Dateien

| Datei | Änderung |
|-------|----------|
| `types/pruefung.ts` | `zeitModus` Feld in PruefungsConfig |
| `types/monitoring.ts` | `HeartbeatResponse` Interface, `beendet-lp` in Status-Union |
| `Timer.tsx` | Open-End Stoppuhr + dynamischer Countdown-Wechsel |
| `Layout.tsx` | Beenden-Banner ("LP hat beendet") |
| `pruefungStore.ts` | `beendetUm`, `restzeitMinuten` State + Action + Persist |
| `usePruefungsMonitoring.ts` | Heartbeat-Response parsen, `setBeendetUm` aufrufen |
| `MonitoringDashboard.tsx` | Beenden-Button + BeendenDialog |
| `SchuelerZeile.tsx` | Einzeln-Beenden-Button |
| `PruefungsComposer.tsx` (ConfigTab-Bereich) | Zeitmodus-Toggle |
| `apiService.ts` | `beendePruefung()` Funktion, `heartbeat()` erweitert (JSON-Response) |
| `apps-script-code.js` | `beendePruefung` Endpoint, Heartbeat-Erweiterung, `ladeConfig` mapping, Spalten-Migration |
| `Startbildschirm.tsx` | Open-End Info-Text (kein Zeitlimit) |
| `AbgabeDialog.tsx` | "Beendet durch LP" Text-Variante |
| `zeit.ts` | `berechneVerstricheneZeit()` Helper |

## 9. Nicht im Scope

- WebSocket/SSE für Echtzeit (Heartbeat-Polling reicht, max 10s Verzögerung)
- LP kann Beenden rückgängig machen (Override mit neuem Aufruf reicht)
- "Pause"-Funktion (Timer anhalten) — separates Feature
