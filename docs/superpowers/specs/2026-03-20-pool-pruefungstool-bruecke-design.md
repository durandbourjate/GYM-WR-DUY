# Design: Pool-Prüfungstool-Brücke

> Synchronisation von Übungspool-Fragen und Lernzielen ins Prüfungstool.
> Erstellt: 20.03.2026

## Kontext

Die Übungspools (27 statische JS-Configs, ~23k LOC, 7 Fragetypen) und das Prüfungstool (React/TS, Google Sheets Backend, 6 Fragetypen) sind zwei separate Systeme. Beide verwenden ähnliche Frageformate und decken dieselben Fachbereiche ab (VWL, BWL, Recht). Die Pools enthalten KI-generierte Fragen mit strukturierten Lernzielen — eine wertvolle Ressource für die Prüfungserstellung.

**Ziel:** Kontrollierte Synchronisation der Pool-Fragen und Lernziele ins Prüfungstool, mit klarer Trennung zwischen ungeprüften und abgesegneten Fragen.

**Entscheid:** Keine Fusion der beiden Systeme. Stattdessen eine Brücke via Sync-Mechanismus. Die Übungspools bleiben eigenständig (Vanilla JS, kein Build, GitHub Pages).

## 1. Datenmodell

### 1.1 Erweiterungen an `FrageBase` (types/fragen.ts)

Neue Felder auf dem bestehenden `FrageBase`-Typ. Das bestehende `quelle`-Feld (`'pool' | 'papier' | 'manuell' | 'ki-generiert'`) wird beibehalten — Pool-Fragen verwenden den bereits vorhandenen Wert `'pool'`.

```typescript
// Bestehend (unverändert):
quelle?: 'pool' | 'papier' | 'manuell' | 'ki-generiert'
quellReferenz?: string

// NEU — Pool-Sync-Felder:
poolId?: string                     // Compound-Key: '{poolId}:{frageId}', z.B. 'vwl_bip:d01'
                                    // Garantiert eindeutig, da Pool-IDs + Frage-IDs innerhalb
                                    // eines Pools eindeutig sind

// Review-Status (zwei unabhängige Flags)
poolGeprueft?: boolean              // In der Pool-Quelle als reviewed markiert
pruefungstauglich?: boolean         // Im Prüfungstool separat abgesegnet

// Sync-Tracking
poolContentHash?: string            // SHA-256 über Frage-Inhalt (siehe 3.3)
poolUpdateVerfuegbar?: boolean      // true wenn Pool-Version neuer als lokale
poolVersion?: PoolFrageSnapshot     // Zwischengespeicherte aktuelle Pool-Version

// Lernziel-Verknüpfung
lernzielIds?: string[]              // Referenzen auf Lernziel-Einträge im Lernziele-Sheet
```

### 1.2 Neuer Typ `PoolFrageSnapshot`

Typisierter Snapshot der Pool-Version einer Frage (statt `object`):

```typescript
interface PoolFrageSnapshot {
  fragetext: string
  typ: string
  optionen?: unknown[]      // MC-Optionen, Aussagen, etc. — je nach Typ
  korrekt?: unknown         // Korrekte Antwort(en)
  erklaerung?: string       // explain-Text aus dem Pool
  musterlosung?: string     // sample bei open-Typ
  spezifisch?: unknown      // Typ-spezifische Daten (blanks, rows, categories+items)
}
```

### 1.3 Neues Google Sheet "Lernziele"

Spalten:

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `id` | string | Eindeutig, z.B. `vwl_bip_definition_0` |
| `fach` | string | VWL / BWL / Recht |
| `poolId` | string | Quell-Pool, z.B. `vwl_bip` |
| `thema` | string | Topic-Key aus dem Pool |
| `text` | string | Lernziel-Text |
| `bloom` | string | Bloom-Stufe (K1–K6), extrahiert aus Klammer am Ende des Textes |
| `aktiv` | boolean | Ob das Lernziel aktiv verwendet wird |

Befüllung beim Sync aus `POOL_META.lernziele` + `TOPICS[x].lernziele`. Deduplizierung via `id`.

**Lernziel-ID-Generierung:** `{poolId}_{themaKey}_{index}` — z.B. `vwl_bip_definition_0`. Bei Reihenfolgänderungen in den Lernziel-Arrays können IDs verwaisen. Akzeptables Risiko: Lernziele werden selten umsortiert, und verwaiste IDs werden beim nächsten Sync erkannt (ID existiert aber Text stimmt nicht mehr → Update).

### 1.4 Erweiterung Fragenbank Google Sheet

Neue Spalten im bestehenden Fragenbank-Sheet (am Ende, nach den bestehenden Spalten):

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `poolId` | string | Compound-Key `{pool}:{frage}`, leer bei manuellen Fragen |
| `poolGeprueft` | boolean | Review-Status in Pool-Quelle |
| `pruefungstauglich` | boolean | Review-Status im Prüfungstool |
| `poolContentHash` | string | SHA-256 Hash für Änderungserkennung |
| `poolUpdateVerfuegbar` | boolean | Flag für verfügbares Update |
| `poolVersion` | string | JSON-String des PoolFrageSnapshot |
| `lernzielIds` | string | Komma-separierte Lernziel-IDs |

Bestehende Spalten bleiben unverändert. `speichereFrage` und `ladeFragen` werden erweitert um die neuen Spalten zu lesen/schreiben.

### 1.5 Verknüpfung Fragen ↔ Lernziele

- Beim Import wird `lernzielIds` automatisch aus der Topic-Zugehörigkeit der Frage abgeleitet
- Im FragenEditor anzeigbar und editierbar (Chips mit Autocomplete)

## 2. Pool-Config-Erweiterungen

### 2.1 `reviewed`-Feld pro Frage

Alle 27 bestehenden JS-Configs erhalten ein `reviewed: boolean` pro Frage:

```javascript
{
  id: "d01",
  type: "mc",
  reviewed: false,  // NEU — Default für alle bestehenden Fragen
  // ... restliche Felder unverändert
}
```

Der Sync übernimmt `reviewed` als `poolGeprueft`.

### 2.2 Pool-Index-Datei (neu)

Neue Datei `Uebungen/Uebungspools/config/index.json`:

```json
[
  { "id": "vwl_bip", "file": "vwl_bip.js", "fach": "VWL", "title": "BIP" },
  { "id": "recht_or_at", "file": "recht_or_at.js", "fach": "Recht", "title": "OR AT" },
  ...
]
```

- Einstiegspunkt für den Sync (statt Dateinamen raten)
- Manuell gepflegt (bei neuem Pool: Eintrag ergänzen)
- Keine Änderungen an pool.html oder am Übungs-Rendering

## 3. Sync-Mechanismus

### 3.1 Trigger

Button "Pools synchronisieren" auf der LP-Startseite (neben "Neue Prüfung" und "Fragenbank").

### 3.2 Flow

```
1. Fetch config/index.json von GitHub Pages
2. Für jeden Pool: fetch JS-Config, parse POOL_META + TOPICS + QUESTIONS
3. Fetch aktuellen Fragenbank-Bestand aus Sheet (via ladeFragen)
4. Delta-Berechnung:
   - Neue Fragen:     poolId existiert nicht im Sheet → Import-Kandidat
   - Geänderte Fragen: poolId existiert, Content-Hash weicht ab → poolUpdateVerfuegbar = true
   - Unveränderte:     Hash stimmt → nichts tun
5. Vorschau-Dialog: "X neue Fragen, Y aktualisiert, Z unverändert"
6. User bestätigt → Batch an Apps Script (importierePoolFragen Endpoint)
7. Lernziele parallel ins Lernziele-Sheet (importiereLernziele Endpoint)
```

### 3.3 Content-Hash

Berechnet über alle inhaltlich relevanten Felder pro Fragetyp:

```typescript
function berechneContentHash(frage: PoolFrage): string {
  const inhalt = {
    q: frage.q,
    type: frage.type,
    explain: frage.explain,
    // Typ-spezifische Felder:
    options: frage.options,       // mc, multi
    correct: frage.correct,       // mc, multi, tf
    blanks: frage.blanks,         // fill
    rows: frage.rows,             // calc
    categories: frage.categories, // sort
    items: frage.items,           // sort
    sample: frage.sample,         // open
  }
  // undefined-Felder werden von JSON.stringify ignoriert
  return sha256(JSON.stringify(inhalt))
}
```

So werden Änderungen an allen inhaltlichen Feldern erkannt, unabhängig vom Fragetyp.

### 3.4 Typ-Mapping Pool → Prüfungstool

| Pool-Typ | Prüfungs-Typ | Konvertierung |
|----------|-------------|---------------|
| `mc` | MC (einzeln) | Siehe 3.4.1 |
| `multi` | MC (mehrfach) | Siehe 3.4.2 |
| `tf` | Richtig/Falsch | Siehe 3.4.3 |
| `fill` | Lückentext | Siehe 3.4.4 |
| `calc` | Berechnung | Siehe 3.4.5 |
| `sort` | Zuordnung | Siehe 3.4.6 |
| `open` | Freitext | Siehe 3.4.7 |

#### 3.4.1 `mc` → MC (einzeln)

```
Pool:     { options: [{v:"A", t:"Text"}], correct: "B" }
Prüfung:  { typ: 'mc', mehrfachauswahl: false, zufallsreihenfolge: true,
            optionen: [{ id: 'A', text: 'Text', korrekt: v === correct }] }
```

#### 3.4.2 `multi` → MC (mehrfach)

```
Pool:     { options: [{v:"A", t:"Text"}], correct: ["A","C"] }
Prüfung:  { typ: 'mc', mehrfachauswahl: true, zufallsreihenfolge: true,
            optionen: [{ id: 'A', text: 'Text', korrekt: correct.includes(v) }] }
```

#### 3.4.3 `tf` → Richtig/Falsch

```
Pool:     { q: "Aussage...", correct: true }
Prüfung:  { typ: 'richtigfalsch',
            aussagen: [{ id: 'a1', text: q, korrekt: correct, erklaerung: explain }] }
```

Hinweis: Pool-tf hat eine einzelne Aussage, Prüfungstool unterstützt mehrere. Import erstellt ein Array mit einem Element.

#### 3.4.4 `fill` → Lückentext

```
Pool:     { q: "Das BIP misst die {0}...", blanks: [{answer:"Wertschöpfung", alts:["Wertschoepfung"]}] }
Prüfung:  { typ: 'lueckentext', textMitLuecken: q,
            luecken: [{ id: 'l0', korrekteAntworten: [answer, ...alts], caseSensitive: false }] }
```

`answer` + `alts` werden zu `korrekteAntworten` zusammengeführt. Es sind keine Regex-Patterns — nur einfache Strings mit alternativen Schreibweisen.

#### 3.4.5 `calc` → Berechnung

```
Pool:     { rows: [{label:"BIP", answer:150, tolerance:0, unit:"CHF"}] }
Prüfung:  { typ: 'berechnung', rechenwegErforderlich: false,
            ergebnisse: [{ id: 'e0', label: label, korrekt: answer, toleranz: tolerance, einheit: unit }] }
```

Feldnamen-Mapping: `answer` → `korrekt`, `tolerance` → `toleranz`, `unit` → `einheit`. `id` wird generiert als `'e' + index`.

#### 3.4.6 `sort` → Zuordnung

Pool-Format:
```javascript
{ categories: ["Arbeit", "Kapital", "Wissen"],
  items: [{t: "Lohn einer Verkäuferin", cat: 0}, {t: "Maschinen", cat: 2}] }
```

Konvertierungsalgorithmus:
```
Für jedes item:
  paare.push({ links: item.t, rechts: categories[item.cat] })
```

Ergebnis für Prüfungstool:
```typescript
{ typ: 'zuordnung', zufallsreihenfolge: true,
  paare: [
    { links: "Lohn einer Verkäuferin", rechts: "Arbeit" },
    { links: "Maschinen", rechts: "Kapital" }
  ] }
```

Die Gruppierungs-Semantik (mehrere Items pro Kategorie) geht im Paare-Modell nicht verloren — die Kategorie steht jeweils in `rechts` und erscheint mehrfach. Bei der Prüfungs-Darstellung werden die rechts-Werte als Dropdown-Optionen angeboten (dedupliziert).

#### 3.4.7 `open` → Freitext

```
Pool:     { q: "Erklären Sie...", sample: "Musterlösung..." }
Prüfung:  { typ: 'freitext', laenge: 'mittel',
            musterlosung: sample || explain }
```

### 3.5 JS-Parsing (Sicherheit)

Pool-Configs setzen `window.POOL_META`, `window.TOPICS`, `window.QUESTIONS`. Parsing-Ansatz:

```typescript
function parsePoolConfig(jsText: string): { meta, topics, questions } {
  const sandbox: Record<string, unknown> = {}
  const fn = new Function('window', jsText)
  fn(sandbox)
  return {
    meta: sandbox.POOL_META,
    topics: sandbox.TOPICS,
    questions: sandbox.QUESTIONS
  }
}
```

**Sicherheitsbewertung:** Akzeptabel, weil:
- Configs werden ausschliesslich von der eigenen GitHub Pages Domain gefetcht (kontrollierte Quelle)
- Das `window`-Objekt wird durch ein leeres Sandbox-Objekt ersetzt → kein Zugriff auf echtes DOM/Window
- Fehlerbehandlung: `try/catch` um den `Function()`-Aufruf; bei Parse-Fehler oder 404 (HTML statt JS) wird der Pool übersprungen mit Warnung

### 3.6 Fehlerbehandlung

- **Netzwerkfehler / 404:** Pool überspringen, Warnung in Sync-Dialog ("Pool X konnte nicht geladen werden")
- **Parse-Fehler:** Pool überspringen, Warnung anzeigen (z.B. wenn GitHub Pages eine HTML-Fehlerseite liefert statt JS)
- **Unbekannter Fragetyp:** Frage überspringen, Warnung anzeigen
- **Teilweise Fehler:** Sync fährt mit nächstem Pool fort; am Ende Zusammenfassung: "23/27 Pools erfolgreich, 4 mit Fehlern"

## 4. UI-Erweiterungen

### 4.1 FragenBrowser — Badges

Auf jeder Frage-Karte:

| Bedingung | Badge | Farbe |
|-----------|-------|-------|
| `quelle !== 'pool'` | (kein Pool-Badge) | — |
| `quelle === 'pool'`, beide Flags `false` | "Pool / ungeprüft" | grau + rot |
| `quelle === 'pool'`, `poolGeprueft: true` | "Pool ✓" | grau + gelb |
| `quelle === 'pool'`, `pruefungstauglich: true` | "Prüfungstauglich" | grün |
| `poolUpdateVerfuegbar: true` | "Update verfügbar" | blau (pulsierend) |

### 4.2 FragenBrowser — Neue Filter

- **Dropdown "Quelle":** Alle / Eigene / Pool
- **Dropdown "Status":** Alle / Ungeprüft / Pool geprüft / Prüfungstauglich / Update verfügbar
- Kombinierbar mit bestehenden Filtern (Fachbereich, Typ, Bloom, Freitext-Suche)

### 4.3 FragenEditor — Pool-Fragen

Bei Fragen mit `quelle === 'pool'`:

- **Info-Leiste oben:** "Importiert aus Pool: VWL — BIP (vwl_bip:d01)"
- **Button "Prüfungstauglich ✓":** Setzt `pruefungstauglich: true`, speichert
- **Lernziele:** Chips mit verknüpften Lernzielen, editierbar via Autocomplete

Bei `poolUpdateVerfuegbar: true` zusätzlich:

- **Aufklappbarer Vergleich:** Aktuelle Version vs. Pool-Version nebeneinander
- **Drei Aktions-Buttons:**
  - "Übernehmen" — Pool-Version ersetzt aktuelle, Hash wird aktualisiert
  - "Ignorieren" — `poolUpdateVerfuegbar: false`, Version bleibt
  - "Manuell anpassen" — Editor bleibt offen, Pool-Version als Referenz-Text darunter sichtbar

### 4.4 LP-Startseite — Sync-Button

- Button "Pools synchronisieren" (neben bestehenden Aktionen)
- Öffnet Sync-Dialog mit Fortschrittsanzeige und Vorschau-Zusammenfassung
- Zusammenfassung zeigt pro Pool: Name, Anzahl neue/geänderte/unveränderte Fragen

## 5. Lernziel-Integration in KI-Assistent

### 5.1 Neuer Button im KI-Assistenten

"Frage zu Lernziel generieren" im bestehenden KI-Assistenten-Panel:

1. Dropdown mit verfügbaren Lernzielen (gefiltert nach aktuellem Fachbereich)
2. Lernziel auswählen → KI erhält als Prompt-Kontext:
   - Lernziel-Text
   - Bloom-Stufe
   - Themenkontext (Pool-Titel, Thema)
   - Gewünschter Fragetyp (vom User wählbar)
3. Ergebnis: generierte Frage mit vorausgefülltem Lernziel-Bezug

### 5.2 Apps Script — Neuer Endpoint

`generiereFrageZuLernziel`: Nimmt Lernziel-Kontext + Fragetyp entgegen, generiert via Claude API eine Prüfungsfrage.

## 6. Apps Script — Neue Endpoints

| Endpoint | Request-Format | Response-Format | Beschreibung |
|----------|---------------|-----------------|-------------|
| `importierePoolFragen` | `{ fragen: Frage[] }` — Array von konvertierten Fragen mit allen FrageBase-Feldern + typ-spezifischen Feldern | `{ erfolg: true, importiert: number, aktualisiert: number, fehler: string[] }` | Batch-Import: Neue Fragen einfügen, bei bestehender `poolId` nur `poolUpdateVerfuegbar` + `poolVersion` aktualisieren (nicht überschreiben) |
| `importiereLernziele` | `{ lernziele: Lernziel[] }` — Array mit id, fach, poolId, thema, text, bloom, aktiv | `{ erfolg: true, neu: number, aktualisiert: number }` | Upsert: Neue Lernziele einfügen, bestehende (by id) aktualisieren |
| `ladeLernziele` | `{ fach?: string }` — optionaler Fachbereich-Filter | `{ lernziele: Lernziel[] }` | Alle (oder gefilterte) Lernziele laden |
| `generiereFrageZuLernziel` | `{ lernziel: string, bloom: string, thema: string, fragetyp: string }` | `{ frage: object }` — generierte Frage im Prüfungstool-Format | KI-Generierung mit Lernziel-Kontext via Claude API |

## 7. Scope

### Phase 1 (diese Implementation)

- `reviewed`-Feld in allen 27 Pool-Configs
- `config/index.json` generieren
- Typ-Erweiterungen in `fragen.ts` (neue Felder + `PoolFrageSnapshot`)
- Neue Spalten im Fragenbank-Sheet
- Sync-Logik: Fetch → Parse → Delta → Batch-Import (neue Datei `services/poolSync.ts`)
- Konvertierungslogik: Pool-Typen → Prüfungs-Typen (neue Datei `utils/poolConverter.ts`)
- Apps Script: 4 neue Endpoints
- Lernziele-Sheet anlegen
- FragenBrowser: Badges + Filter (Quelle, Status)
- FragenEditor: Pool-Info-Leiste, Absegnen-Button, Update-Vergleich
- KI-Assistent: "Frage zu Lernziel generieren" Button + Backend-Endpoint
- Sync-Dialog-Komponente (`components/lp/PoolSyncDialog.tsx`)

### Nicht in Phase 1

- Lernziel-Abdeckung im Analyse-Tab (spätere Iteration)
- Automatische index.json-Generierung
- Rückschreiben vom Prüfungstool in die Pool-Configs
- Rollback-Mechanismus für fehlerhafte Imports

### Abhängigkeiten

- Bestehende Fragenbank-Infrastruktur (Google Sheets, Apps Script, FragenBrowser)
- GitHub Pages CORS (funktioniert bereits)
- KI-Assistent (vorhanden, wird erweitert)
- Bestehende Fragetyp-Komponenten (alle 6 Typen bereits implementiert)
