# C9 — Detaillierte Lösungen pro Teilantwort (Design-Spec)

**Datum:** 2026-04-21
**Scope:** ExamLab (Frontend + Apps-Script-Backend + einmaliges Migrations-Skript)
**Fragetypen:** MC, R/F, Zuordnung, Lückentext, Hotspot, Bildbeschriftung, DragDrop-Bild, Freitext/Berechnung/Buchungssatz/… (alle 20)
**Status:** Design — wartet auf Plan
**Referenz-Mockup:** `.superpowers/brainstorm/c9-loesungen/fragetypen-mockup-v6.html`
**Memory-Ursprung:** `project_detaillierte_loesungen.md` (gemeldet S125, 2026-04-19)

---

## 1. Motivation

Im selbstständigen Üben zeigt ExamLab nach „Antwort prüfen" bisher nur einen generischen Musterlösungs-Text — SuS erfahren nicht, *welche ihrer Teilantworten* konkret falsch war und *warum*. Beispiel Zuordnung mit 4 Paaren: Rückmeldung ist nur „die Elemente können Gründe sein" statt paar-für-paar „deine Antwort → korrekte Antwort + Begründung". Für ein Übungstool ist das der Kern-Lernwert: Konkretes Feedback pro Fehlgriff.

Ziel: Pro Fragetyp wird die SuS-Antwort auf Teil-Ebene visuell markiert (grün richtig, rot falsch), bei Fehlern wird die korrekte Alternative angezeigt, und eine optionale didaktische Mikro-Erklärung pro Teilantwort erklärt den Zusammenhang.

Derselbe Renderer wird auch in der LP-Prüfungs-Korrektur-Ansicht eingesetzt — LP sieht die Auto-Korrektur-Ergebnisse visuell statt rein textuell, ohne Duplikation.

## 2. Scope

**Im Scope:**
- Frontend-Komponenten aller 20 Fragetypen bekommen `modus='loesung'`-Verhalten
- 3 neue Shared UI-Primitives: `AntwortZeile`, `MusterloesungsBlock`, `ZoneLabel`
- Datenmodell-Erweiterung: 4 neue optionale `erklaerung`-Felder pro Fragetyp-Sub-Element (2 existieren bereits)
- Apps-Script `kiAssistentEndpoint.generiereMusterloesung` erweitert: liefert zusätzlich strukturierte Teilerklärungen
- Editor-UI: KI-Ausgabe zeigt Musterlösung + Teilerklärungen zur Review
- Einmaliges Migrations-Skript (lokal in diesem Session-Kontext, Node + Anthropic SDK) — Batch-Generierung für ~2400 bestehende Fragen via bestehenden Apps-Script-`speichereFrage`-Endpoint, mit Resume-Fähigkeit
- Einsatz in zwei Kontexten: Üben-Lösungs-Ansicht (SuS nach „Antwort prüfen") und Prüfungs-Korrektur-Ansicht (LP)

**Nicht im Scope:**
- Runtime-KI-Calls aus dem Frontend (kein `erklaereTeilantwort`-Endpoint, kein Lazy-Fill)
- KI-Erklärungen für nicht-auto-korrigierbare Typen (Zeichnen, Audio, Code, PDF-Annotation) — dort bleibt nur der Musterlösungs-Block
- Ansatz-3-Integration von S130 (Fachschafts-weite Kalibrierung) — separate Session
- SuS-Einsicht auf Lösung in Prüfen-Modus (heutige Regel bleibt: nur LP-Ansicht)

## 3. Visuelle Regel (aus Mockup v6)

**Grundprinzip:** Marker und Farbe sind **orthogonale Signale**.

| Signal | Bedeutung | Werte |
|---|---|---|
| **Marker vor Antwort** | Was hat SuS aktiv getan? | ✓ grün (Ja/angekreuzt) · ✗ rot (Nein) · leer (nicht aktiv) |
| **Rahmen + Fläche** | War das korrekt? | grün korrekt · rot falsch · neutral (keine Bewertung) |

**Daraus folgen alle Fragetyp-Varianten:**

| Fragetyp | SuS-Aktion | Wahrheit | Darstellung |
|---|---|---|---|
| MC | gewählt | korrekt | ✓ grün + grüner Rahmen/Fläche |
| MC | gewählt | falsch | ✓ grün + roter Rahmen/Fläche |
| MC | nicht gewählt | wäre korrekt | kein Marker + roter Rahmen/Fläche |
| MC | nicht gewählt | war falsch | kein Marker + neutral |
| R/F | sagte „Richtig" | korrekt | ✓ grün + grüner Rahmen |
| R/F | sagte „Richtig" | falsch | ✓ grün + roter Rahmen |
| R/F | sagte „Falsch" | korrekt | ✗ rot + grüner Rahmen |
| R/F | sagte „Falsch" | falsch | ✗ rot + roter Rahmen |
| Zuordnung | Paar zugeordnet | korrekt/falsch | kein Marker, nur Farbe. Bei falsch: korrekte Alternative als grüner Text darunter |
| Lückentext | Lücke eingegeben | korrekt | einzeiliger Pill, grüner Rahmen + Fläche |
| Lückentext | Lücke eingegeben | falsch | zweizeiliger Pill: korrekte Antwort oben grün, SuS-Antwort unten rot |
| Bildbeschriftung | Zone beschriftet | korrekt | grüne Zone + grünes Label |
| Bildbeschriftung | Zone beschriftet | falsch | rote Zone + zweizeiliges Label (korrekt oben grün, SuS-Antwort unten rot) |
| DragDrop-Bild | Label platziert | korrekt/falsch | analog Bildbeschriftung |
| Hotspot | Klick im Bereich | korrekt | grüner Klick-Marker, Bereich grün hinterlegt |
| Hotspot | Klick ausserhalb | falsch | roter Klick-Marker, Bereich trotzdem grün hinterlegt (Lösungs-Referenz) |
| Freitext/Berechnung | Antwort eingegeben | korrekt/falsch | ganze Antwort grün oder rot, keine Teilantwort-Ebene |

**Ausnahme Hotspot:** Der korrekte Bereich wird grün hinterlegt — das ist eine Lösungs-Referenz („hier wäre es gewesen"), nicht eine Aktions-Bewertung. Konsistent mit der Eigenart des Fragetyps (wo SuS klickt ist relativ zum Bereich, nicht binär).

**Musterlösungs-Block:** Immer unterhalb der Teilantworten. Rahmen + Tint-Fläche in grün (Frage insgesamt korrekt) oder rot (Frage insgesamt falsch). Inhalt: der existierende `musterlosung`-String.

## 4. Datenmodell

### 4.1 Neue optionale Felder

Alle Felder sind `optional string` und additiv — kein Breaking-Change für bestehende Daten.

```ts
// types/fragen.ts
export interface MCOption {
  id: string
  text: string
  korrekt: boolean
  erklaerung?: string  // ← existiert bereits
}

export interface RFAussage {
  id: string
  text: string
  korrekt: boolean
  erklaerung?: string  // ← existiert bereits
}

export interface ZuordnungPaar {
  id: string
  links: string
  rechts: string
  erklaerung?: string  // ← NEU
}

export interface Luecke {
  id: string
  korrekteAntworten: string[]
  erklaerung?: string  // ← NEU
}

export interface HotspotBereich {
  // … existierende Felder
  erklaerung?: string  // ← NEU
}

export interface DragDropBildZielzone {
  // … existierende Felder
  erklaerung?: string  // ← NEU
}
```

**Bildbeschriftung:** Jede Beschriftungs-Zone hat bereits eine `korrektesLabel`-Property; hier kommt `erklaerung?: string` auf jede Zone.

**Weitere Fragetypen** — analog, jeweils ein optionales `erklaerung?: string` am Sub-Element:
- `SortierungItem` (neues Feld)
- `KontenbestimmungKonto` (neues Feld)
- `Buchungssatz`, `TKonto` — `buchungen[]` mit Erklärungs-Feld (neu)
- `BilanzErPosten` (neues Feld)
- `BildbeschriftungZone` (neu)
- `FormelFrage` — heute atomar; `teilerklaerungen: []` bis Formel-Fragetyp sub-strukturiert wird (Out-of-Scope)

Pflege der `getTypDaten_`-Whitelist im Apps-Script pro Fragetyp erforderlich — siehe Risiko S125-Wiederholung in §11.2.

### 4.2 Persistierung in Apps-Script

Die Felder wandern mit dem bestehenden `typDaten`-JSON-Blob mit (keine neue Sheet-Spalte nötig). `parseFrage_` liest sie automatisch. `getTypDaten_` muss die neuen Feldnamen in die Whitelist aufnehmen — **Lesson S125**: wenn der Whitelist-Name nicht mit dem TS-Typ-Namen matcht, wird bei jedem Save die Erklärung stillschweigend zerstört.

## 5. Komponenten-Architektur

### 5.1 Neuer Modus-Prop auf bestehenden Fragetyp-Komponenten

Jede existierende Fragetyp-Komponente (`MCFrage`, `RFFrage`, `ZuordnungFrage`, …) bekommt:

```tsx
interface FragetypProps {
  frage: FrageTyp
  antwort?: AntwortTyp
  modus: 'aufgabe' | 'loesung'    // ← NEU, default 'aufgabe'
  korrektur?: KorrekturErgebnis   // nur relevant im Lösungs-Modus
  onChange?: (antwort: AntwortTyp) => void
}
```

Im Lösungs-Modus:
- `onChange` wird nicht aufgerufen (read-only)
- Die Komponente rendert pro Teilantwort den Farb-Rahmen + Marker aus `korrektur`
- Die Erklärungen aus der Frage selbst werden als KI-Erklärung-Slots gerendert

### 5.2 Drei neue Shared Primitives

**`AntwortZeile`** (in `shared/ui/AntwortZeile.tsx`)

```tsx
interface AntwortZeileProps {
  marker?: 'ja' | 'nein' | 'leer'       // ✓ grün / ✗ rot / kein Symbol
  variant?: 'korrekt' | 'falsch' | 'neutral'
  label: ReactNode
  erklaerung?: string                    // optional KI-Erklärung
  zusatz?: ReactNode                     // z.B. korrekte Alternative bei Zuordnung
}
```

Konsumiert von MC, R/F, Freitext/Berechnung (mono-row).

**`MusterloesungsBlock`** (in `shared/ui/MusterloesungsBlock.tsx`)

```tsx
interface MusterloesungsBlockProps {
  variant: 'korrekt' | 'falsch'
  label?: string                          // default: „Richtig beantwortet" / „Nicht ganz"
  children: ReactNode                     // Musterlösungs-Text
}
```

**`ZoneLabel`** (erweitert `ZonenOverlay` aus S128, in `shared/ui/ZoneLabel.tsx`)

```tsx
interface ZoneLabelProps {
  variant: 'korrekt' | 'falsch' | 'neutral'
  susAntwort?: string        // SuS-Eingabe (Lückentext, Bildbeschriftung)
  korrekteAntwort?: string   // bei variant='falsch' angezeigt
  placeholder?: string       // z.B. „leer gelassen"
}
```

Rendert ein- oder zweizeiliges Pill basierend auf `variant` und vorhandenen Antworten.

Keine weiteren Shared-Komponenten nötig — die restlichen Fragetypen (Zuordnung, Hotspot etc.) nutzen eigene Layouts, die ihre Teilantworten direkt einfärben.

## 6. KI-Integration

### 6.1 Erweiterung von `generiereMusterloesung` (statt neuer Action)

**Entscheidung Q2a:** Die bestehende KI-Action `generiereMusterloesung` im Apps-Script wird erweitert. Sie liefert heute nur einen Musterlösungs-String; ab jetzt liefert sie zusätzlich eine Liste strukturierter Teilerklärungen. Das vermeidet Duplikation (Teilerklärungen und Musterlösung brauchen denselben Kontext) und reduziert die Zahl der KI-Calls pro Frage von N+1 auf 1.

**Response-Schema neu:**
```ts
interface GeneriereMusterloesungResponse {
  success: true
  ergebnis: {
    musterloesung: string                 // didaktischer Gesamttext — wie heute
    teilerklaerungen: {
      feld: 'optionen' | 'aussagen' | 'paare' | 'luecken' | 'bereiche' | 'zielzonen' | 'beschriftungen'
      id: string                          // ID des Sub-Elements
      text: string                        // 1–3 Sätze, fachlich präzise
    }[]
  }
  feedbackId?: string                      // S130 KI-Kalibrierung, unverändert
}
```

Bei Fragetypen ohne Teilantworten (Freitext, Berechnung, Buchungssatz-Einzelbuchung, Zeichnen, Audio, Code, Formel, PDF-Annotation): `teilerklaerungen: []`.

**Rückwärtskompatibilität:** Während des Frontend/Backend-Roll-Outs kann ein Zustand entstehen, in dem das Frontend bereits aktualisiert ist, Apps-Script aber noch die alte Response ohne `teilerklaerungen`-Feld liefert (z.B. cachte Deployment). Der Frontend-Parser MUSS eine fehlende `teilerklaerungen` als leeres Array behandeln, nicht crashen oder Platzhalter zeigen.

**Prompt-Erweiterung:** Der System-Prompt erhält einen zusätzlichen Abschnitt, der das JSON-Output-Schema definiert und für jeden Fragetyp angibt, welche Elemente erklärt werden sollen. Bei MC/R/F ist die bestehende Erwartung (eine Option pro Zeile erklären) bereits im Prompt drin; für die neuen Typen kommen die Render-Regeln dazu.

**Privacy/Kalibrierung (S130):** Die Erweiterung bleibt im bestehenden KI-Kalibrierungs-Workflow — `feedbackId` wird zurückgegeben, LP-Korrekturen an der Response werden beim Frage-Speichern als Kalibrierungs-Signal erfasst (inkl. der neu hinzugekommenen `teilerklaerungen`-Korrekturen).

### 6.2 Editor-UI-Integration

**Bestehender Flow (heute):** LP klickt „KI-Musterlösung" → erhält Musterlösungs-Text → akzeptiert/editiert → wird beim Speichern persistiert.

**Neuer Flow:** LP klickt „KI-Musterlösung" → erhält Musterlösungs-Text **plus** Liste der Teilerklärungen in einem kombinierten Preview-Panel.

```
┌─ KI-Vorschlag ──────────────────────────────────┐
│                                                 │
│  📝 Musterlösung                                │
│  ┌─────────────────────────────────────────┐   │
│  │ Der Verschuldungsgrad ist das Verhältnis │   │
│  │ von FK zu EK …                           │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  💡 Teilerklärungen (pro Option/Aussage/Paar)   │
│  ┌─────────────────────────────────────────┐   │
│  │ Option 1: Current Ratio                  │   │
│  │ └─ Umlaufvermögen ÷ kurzfristiges FK…    │   │
│  │                                          │   │
│  │ Option 2: Eigenkapitalquote              │   │
│  │ └─ Misst Finanzierungsstruktur…          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [Übernehmen]   [Verwerfen]                     │
└─────────────────────────────────────────────────┘
```

LP kann die einzelnen Teilerklärungen im Panel editieren (Text-Inputs pro Element). „Übernehmen" schreibt alle Felder in die Frage — Musterlösung in `frage.musterlosung`, Teilerklärungen in `frage.optionen[i].erklaerung` etc.

**Pro-Element-Stern-Toggle (S130-Integration):** Bleibt wie heute am Musterlösungs-Block + pro Teilerklärung, LP kann Kalibrierungs-Signal explizit geben.

### 6.3 Fragen ohne KI-Nutzung

LP kann Fragen auch ohne KI-Hilfe erstellen oder die Erklärungen manuell entfernen. In dem Fall rendert die Lösungs-Ansicht **sauber zurück**: nur Farb-Rahmen + Musterlösungs-Block werden angezeigt, keine KI-Erklärungs-Slots unter den Teilantworten. Kein Platzhalter, kein Warnhinweis.

## 7. Migration bestehender Fragen

### 7.1 Anforderungen

- Für ~2400 bestehende Fragen (BWL/VWL/Recht) werden Teilerklärungen generiert
- Läuft einmalig lokal in einem dedizierten Script-Directory (nicht im Apps-Script, nicht im Frontend)
- Verwendet Anthropic API direkt mit dem gleichen System-Prompt, den `generiereMusterloesung` (erweitert) nutzt
- **Resumability (Q1-Anforderung):** Bei Abbruch/Fehler darf der nächste Run nicht von vorn starten. State-Datei mit Fortschritt.
- Schreibt via Apps-Script-`speichereFrage`-Endpoint (keine eigene Sheets-API-Integration, nutzt bestehende Validierung/Cleanup)

### 7.2 Architektur

```
ExamLab/scripts/migrate-teilerklaerungen/
├── migrate.mjs              # Main-Script
├── state.json               # Fortschritt (generated, updated live)
├── prompts.mjs              # Der erweiterte Prompt (single source of truth mit Apps-Script)
├── log.jsonl                # Pro-Frage Log mit Status/Fehler
└── README.md                # Setup + Run-Anleitung
```

**State-Datei-Schema (`state.json`):**
```json
{
  "gestartet": "2026-04-22T14:30:00Z",
  "fragen": {
    "vwl-0123": { "status": "done", "zeitpunkt": "..." },
    "vwl-0124": { "status": "failed", "fehler": "Rate limit", "zeitpunkt": "..." },
    "bwl-0001": { "status": "skipped", "grund": "already has erklaerungen" }
  }
}
```

**Flow pro Frage:**
1. Fetch aus Apps-Script (`getFragen`) → bestimme Fragetyp
2. Prüfe: hat die Frage schon `erklaerung`-Felder? → skip (idempotent)
3. Baue Prompt aus Frage + Fragetyp-spezifischem Schema
4. Anthropic API Call (claude-sonnet-4-6 oder haiku-4-5, je nach Qualitätsbedarf)
5. Parse Response → `{musterloesung?, teilerklaerungen[]}`
6. Wenn vorher keine Musterlösung existierte: übernehme auch die neu generierte. Wenn existierende Musterlösung: behalte existierende, nur Teilerklärungen werden geschrieben
7. Schreibe via `speichereFrage` → Apps-Script validiert und persistiert
8. Update `state.json`: `status = done`

**Resume-Logik:**
- Bei jedem Start liest das Script `state.json`
- Alle Fragen mit `status !== 'done'` werden erneut versucht
- `status = 'failed'` → Retry nach exponentiellem Backoff (3 Versuche, dann markiert als `giving-up`)

**Rate-Limiting:**
- Anthropic API: max 50 requests/min (Standard-Limit)
- Apps-Script `speichereFrage`: 2s Latenz → eher der Bottleneck. Parallelität: max 3 gleichzeitige Writes (Apps-Script ist nicht thread-safe, aber `LockService` im `speichereFrage` schützt Cross-Request-Konflikte)
- Gesamtlaufzeit-Schätzung: 2400 × 4s effektiv = ~160 min. Kann im Hintergrund laufen.

**Dry-Run-Modus:** `--dry-run` Flag → generiert alle KI-Calls, schreibt aber nicht in Apps-Script. Log-Datei zeigt was geschrieben würde. Für Qualitäts-Review der ersten 20 Fragen.

**Qualitäts-Kontrolle vor Schreib-Start:**
1. Run `--dry-run` für 20 zufällige Fragen aus verschiedenen Typen
2. Review des Outputs durch LP (stichprobenartig)
3. Wenn Qualität OK → Live-Run

### 7.3 Anthropic SDK lokal

**Abhängigkeit:** `@anthropic-ai/sdk` via npm (in `scripts/migrate-teilerklaerungen/package.json`)

**Auth:** API-Key aus `$ANTHROPIC_API_KEY`-Env (nicht committed, User setzt lokal).

**Cache-Nutzung:** Prompt-Caching für den System-Prompt-Teil (Kostenreduktion). Pro-Frage-User-Prompt ist dynamisch.

## 8. Einsatz-Kontexte

| Kontext | Was sieht wer | Komponente | Daten |
|---|---|---|---|
| Üben · nach „Antwort prüfen" | SuS sieht Lösung inline + KI-Erklärungen | `modus='loesung'` | `frage` (mit erklaerung-Feldern) + `korrektur` (aus `pruefeAntwort`) |
| Prüfen · SuS während | Keine Lösung | `modus='aufgabe'` | `frage` (bereinigt, ohne erklaerung-Felder) |
| Prüfen · SuS nach Abgabe | Keine Lösung (LP entscheidet über Einsicht) | `modus='aufgabe'` read-only | wie oben |
| Prüfen · LP-Korrektur-Ansicht | LP sieht SuS-Antwort + korrekte Antwort + KI-Erklärungen | `modus='loesung'` | `frage` (voll) + `korrektur` (aus Auto-Korrektur) |

**Privacy-Invariante:** Im Prüfen-Modus werden die `erklaerung`-Felder aus dem SuS-Response genauso bereinigt wie heute `korrekt` und `korrekteAntworten` (siehe `bereinigeFrageFuerSuS_`). `bereinigeFrageFuerSuSUeben_` (Übungsmodus) lässt sie drin.

## 9. Fragetypen im Detail

### Auto-korrigierbar (mit Teilantworten, bekommen `erklaerung`-Felder)

| Fragetyp | Teilantwort-Ebene | Rendering-Komponente |
|---|---|---|
| MC | `optionen[]` (existiert schon) | `MCFrage` → `AntwortZeile` pro Option |
| R/F | `aussagen[]` (existiert schon) | `RFFrage` → `AntwortZeile` pro Aussage |
| Zuordnung | `paare[]` (NEU) | `ZuordnungFrage` → Grid pro Paar, eigene Zeilen-Styles |
| Lückentext | `luecken[]` (NEU) | `LueckentextFrage` → inline `ZoneLabel`-artige Pills |
| Hotspot | `bereiche[]` (NEU) | `HotspotFrage` → `ZonenOverlay` + Label, Klick-Marker aus SuS |
| Bildbeschriftung | `beschriftungen[]` (NEU) | `BildbeschriftungFrage` → `ZonenOverlay` + `ZoneLabel` |
| DragDrop-Bild | `zielzonen[]` (NEU) | `DragDropBildFrage` → wie Bildbeschriftung |
| Sortierung | `items[]` (NEU) | `SortierungFrage` → Liste mit Korrekt-Position daneben |
| Kontenbestimmung | `konten[]` (NEU) | `KontenbestimmungFrage` → Zeile pro Konto, Korrekt-Kategorie daneben |
| Buchungssatz | `buchungen[]` (NEU) | `BuchungssatzFrage` → Zeile pro Buchung, bei falschem Soll/Haben korrekte Werte als `ZoneLabel`-artiges Pill |
| T-Konto | `buchungen[]` (NEU, gleich wie Buchungssatz) | `TKontoFrage` — analog |
| Bilanz/ER | `posten[]` (NEU) | `BilanzErFrage` → pro Posten Zeile |
| Formel | `formelTeile[]` (NEU, Teil-KaTeX) | `FormelFrage` → neuer Strukturvergleich, falls Formel mehrteilig |

**Neues `Sortierung`-Verhalten:** Pro Item zeigt die Lösungs-Ansicht „deine Position: 3 · korrekt: 5" inline. Farbe je nach Position richtig/falsch. Bei komplett richtiger Reihenfolge: alle grün.

### Nicht auto-korrigierbar (bekommen kein `erklaerung`-Feld, nur erweiterter Musterlösungs-Block)

| Fragetyp | Begründung |
|---|---|
| Zeichnen | Canvas-basiert, KI kann SuS-Zeichnung nicht zuverlässig bewerten. Nur Musterlösung. |
| Audio | Transkription + semantische Bewertung zu unsicher für automatischen Einsatz. Nur Musterlösung. |
| Code | Korrekt ist oft mehrdeutig (mehrere Lösungswege). KI-Auto-Bewertung unzuverlässig. Nur Musterlösung. |
| PDF-Annotation | Position + Text + Farbe schwer semantisch zu bewerten. Nur Musterlösung. |
| Freitext | Keine Teilantworten, also kein Strukturvergleich möglich. Musterlösung ist Hauptkanal (wird um Erklärungsfokus erweitert: Rechenweg statt nur Ergebnis). |
| Berechnung | Wie Freitext — atomar. Nur Musterlösung, aber mit Rechenweg. |

## 10. Testing

### 10.1 Unit-Tests
- `AntwortZeile`-Komponente: alle 6 Varianten (2 Marker × 3 Variants) × snapshot
- `MusterloesungsBlock`: korrekt + falsch Variants
- `ZoneLabel`: einzeilig korrekt, mehrzeilig falsch, neutral
- `generiereMusterloesung`-Response-Parser: Response-Schema-Validierung, fallback bei fehlendem `teilerklaerungen`-Feld (Kompatibilität mit Alt-Response)

### 10.2 Integration-Tests
- Pro Fragetyp ein Test: `modus='loesung'` rendert korrekt/falsch-Farben richtig aus `korrektur`-Daten
- `bereinigeFrageFuerSuS_`-Test: erklaerung-Felder werden bei Prüfen-SuS-Response entfernt, bei Üben-SuS-Response nicht
- `getTypDaten_`-Whitelist-Test: Runtrip Frage-speichern → Frage-laden erhält alle `erklaerung`-Felder (Referenz S125-Lektion)

### 10.3 Migrations-Skript-Tests
- Unit-Test: State-Datei-Parser + Resume-Logik
- Dry-Run-Modus liefert Log-Zeile pro Frage ohne Apps-Script-Call
- Error-Handling: 429-Rate-Limit → Backoff + Retry
- Idempotenz: zweiter Run über fertige State-Datei macht 0 Apps-Script-Calls

### 10.4 E2E (manuell)
- LP nutzt KI-Musterlösung im Editor → sieht Preview mit Teilerklärungen → übernimmt → Frage hat Felder
- SuS im Übungsmodus → beantwortet → „Antwort prüfen" → sieht v6-Rendering
- LP in Prüfen-Korrektur-Ansicht → sieht gleiche v6-Darstellung

## 11. Rollout & Risiken

### 11.1 Rollout

**Phase 1 — Frontend + Editor:**
1. Datenmodell-Erweiterung (TS-Types + Apps-Script-Whitelist)
2. Shared Primitives
3. Je Fragetyp-Komponente: `modus='loesung'` implementieren (reihenfolge: zuerst die 5 häufigsten Typen MC/RF/Zuordnung/Lückentext/Hotspot, dann Rest)
4. Apps-Script `generiereMusterloesung` erweitern
5. Editor-Preview-Panel

**Phase 2 — Migration:**
6. Migrations-Skript bauen + Dry-Run für 20 Stichproben
7. LP reviewt Output
8. Live-Run über alle Fragen
9. Manuelle Korrekturen an KI-Output wo LP unzufrieden ist (via Editor)

**Phase 3 — Prüfungs-Korrektur-Einsatz:**
10. `src/components/lp/korrektur/KorrekturFrageVollansicht.tsx` (und ggf. `KorrekturFrageZeile.tsx`) schalten auf `modus='loesung'` der Fragetyp-Komponente um, alter Korrektur-spezifischer Rendering-Code wird entfernt

**Feature-Flag:** Nicht nötig. Die Änderung ist rein additiv — alle `erklaerung`-Felder sind optional. Fragen ohne Erklärungen rendern sauber zurück. Editor-KI-Erweiterung ist rückwärtskompatibel via Response-Schema-Unions.

### 11.2 Risiken

| Risiko | Wahrscheinlichkeit | Mitigation |
|---|---|---|
| KI-Erklärungen fachlich falsch (Schweizer Recht-Spezialitäten) | Mittel | Dry-Run-Stichprobe + LP-Review vor Live-Migration. LP kann im Editor manuell korrigieren, Kalibrierungs-Signal (S130) verbessert über Zeit. |
| `getTypDaten_`-Whitelist fehlerhaft → erklaerung-Felder werden bei jedem Save zerstört (S125-Bug-Wiederholung) | Hoch (ohne Test) | Integration-Test Roundtrip: speichere Frage mit Erklärung → lade Frage → Erklärung muss erhalten sein. Pro Fragetyp getestet. |
| Migrations-Skript-Crash mitten drin → verloren-Zustand | Mittel | State-Datei-basierte Resumability. Jede fertige Frage sofort in State persistiert, nicht gebatcht. |
| Anthropic-Kosten der Migration | Niedrig | 2400 Fragen × ~500 Output-Token = 1.2M Token Output. Bei Sonnet 4.6 ~$15. Bei Haiku 4.5 ~$3. Entscheidung je nach Qualitätsbedarf. |
| Lückentext-Pills verschieben Textfluss (layout-regression) | Niedrig | v6-Mockup zeigt: `line-height: 2.2` reicht. Integration-Test prüft dass Text-Zeilen konstant bleiben. |
| Privacy-Leak: erklaerung-Felder im Prüfen-SuS-Response | Hoch (ohne Test) | `bereinigeFrageFuerSuS_` Integration-Test sperrt erklaerung-Feld explizit (wie `korrekteAntworten`). |

## 12. Out-of-Scope / Offene Punkte

- **Ansatz-3-Integration von S130** (Fachschafts-/Schulweite Kalibrierung) — wenn C9 produktiv stabil läuft, können Erklärungen auch im Sharing-Workflow kalibriert werden. Eigener Spec.
- **Manuelle LP-Korrekturen als „bevorzugte Version":** Wenn LP eine Erklärung editiert hat, soll `generiereMusterloesung` sie bei erneutem Klick *nicht überschreiben*. Heute-Verhalten (muss geprüft werden): KI-Response überschreibt alles. Muss in Phase-1-Umsetzung geklärt/getestet werden.
- **Periodischer Re-Run der Migration:** Für neu erstellte Fragen ohne KI-Nutzung könnten wir 1×/Quartal einen Migrations-Run fahren. Nicht Teil dieser Spec; wird nach Produktiv-Einsatz evaluiert.
- **Formel-Fragetyp Sub-Struktur:** Aktuell ist eine Formel ein einzelner KaTeX-String. Wenn sie mehrteilig wäre (z.B. „berechne und vereinfache"), könnten Teilantworten erklärt werden. Heute: `teilerklaerungen: []` für Formel. Bei Struktur-Refactor später aufnehmen.

---

## Konsolidierte Offene-Fragen-Antworten

| # | Frage | Antwort |
|---|---|---|
| Q1 | Migration-Transport | (a) via `speichereFrage`-Endpoint, mit Resume-Fähigkeit (State-Datei) |
| Q2 | Editor-KI-Erweiterung | (a) `generiereMusterloesung` liefert Musterlösung + Teilerklärungen in einem Call. Vermeidet Duplikation. |
| Q3 | Fragen ohne Erklärungen | (a) saubere Fallback-Darstellung, keine Platzhalter |
| Q4 | Scope LP-Korrektur | (a) Gleicher Renderer, vermeidet Duplikation |
