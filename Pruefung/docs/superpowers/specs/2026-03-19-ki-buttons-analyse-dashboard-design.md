# Design: KI-Buttons vereinheitlichen + Prüfungs-Analyse-Dashboard

**Datum:** 2026-03-19
**Status:** Review bestanden
**Betroffene Dateien:** Pruefung/src/

---

## Übersicht

Zwei zusammenhängende Features:
1. **KI-Buttons für alle Fragetypen** — Zuordnung, R/F, Lückentext, Berechnung erhalten typ-spezifische Generieren/Prüfen-Buttons
2. **Prüfungs-Analyse-Dashboard** — Neuer 4. Tab im Composer mit lokalen Metriken + KI-Analyse
3. **Zeitbedarf-Feld** — Neues Feld `zeitbedarf` in FrageBase, vorausgefüllt aber editierbar

---

## Feature 1: KI-Buttons vereinheitlichen

### Ist-Zustand

`KIAssistentPanel.tsx` enthält:
- `useKIAssistent()` Hook — verwaltet API-Aufrufe, Lade-/Ergebnisstatus
- `KIFragetextButtons` — "Generieren" + "Verbessern" (für alle Typen)
- `KIMusterlosungButton` — "Prüfen" (für alle Typen)
- `KIMCOptionenButton` — "Optionen generieren" (nur MC)
- `InlineAktionButton` + `ErgebnisAnzeige` — gemeinsame UI-Bausteine

`AktionKey` Typ: `'generiereFragetext' | 'verbessereFragetext' | 'pruefeMusterloesung' | 'generiereOptionen'`

### Neue Aktionen

| AktionKey | Fragetyp | Button-Label | Input | Output |
|-----------|----------|-------------|-------|--------|
| `generierePaare` | Zuordnung | "Paare generieren" | `{ fragetext, fachbereich, thema }` | `{ paare: { links, rechts }[] }` |
| `pruefePaare` | Zuordnung | "Paare prüfen" | `{ fragetext, paare }` | `{ bewertung, verbesserungen }` |
| `generiereAussagen` | R/F | "Aussagen generieren" | `{ fragetext, fachbereich, thema }` | `{ aussagen: { text, korrekt, erklaerung }[] }` |
| `pruefeAussagen` | R/F | "Aussagen prüfen" | `{ fragetext, aussagen }` | `{ bewertung, verbesserungen }` |
| `generiereLuecken` | Lückentext | "Lücken vorschlagen" | `{ fragetext, textMitLuecken }` | `{ textMitLuecken, luecken }` |
| `pruefeLueckenAntworten` | Lückentext | "Antworten prüfen" | `{ textMitLuecken, luecken }` | `{ bewertung, ergaenzteAntworten }` |
| `berechneErgebnis` | Berechnung | "Ergebnis berechnen" | `{ fragetext }` | `{ ergebnisse: { label, korrekt, toleranz, einheit }[] }` |
| `pruefeToleranz` | Berechnung | "Toleranz prüfen" | `{ fragetext, ergebnisse }` | `{ bewertung, empfohleneToleranz }` |

| `analysierePruefung` | Analyse-Tab | "KI-Analyse starten" | `{ titel, klasse, fachbereiche, fragen: { fragetext, typ, bloom, thema, punkte }[] }` | `{ themenAbdeckung, schwierigkeitsBalance, verbesserungen[], gesamtBewertung }` |

> **Hinweis Payload-Grösse:** Bei `analysierePruefung` werden nur die relevanten Felder pro Frage gesendet (fragetext, typ, bloom, thema, punkte) — keine `verwendungen`, `anhaenge` oder `bewertungsraster`, um die Payload kompakt zu halten.

### Dateistruktur-Refactoring (Voraussetzung)

**Problem:** `KIAssistentPanel.tsx` (327 Zeilen) würde mit 4 neuen Komponenten auf ~500+ Zeilen wachsen. `PruefungsComposer.tsx` ist mit 904 Zeilen bereits über dem 800-Zeilen-Limit.

**Lösung — vor den neuen Features:**

1. **`KIAssistentPanel.tsx` aufteilen:**
   - `src/components/lp/frageneditor/useKIAssistent.ts` — Hook + `AktionKey`-Type + `AktionErgebnis`-Interface (Zeilen 1-53)
   - `src/components/lp/frageneditor/KIBausteine.tsx` — `InlineAktionButton` + `ErgebnisAnzeige` (Zeilen 232-327)
   - `src/components/lp/frageneditor/KIAssistentPanel.tsx` — Bestehende 3 Button-Komponenten (re-exportiert Hook)
   - `src/components/lp/frageneditor/KITypButtons.tsx` — 4 neue Button-Komponenten (Zuordnung, R/F, Lückentext, Berechnung)

2. **`PruefungsComposer.tsx` aufteilen:**
   - `src/components/lp/composer/ConfigTab.tsx` — Einstellungen-Tab (Zeilen 328-590)
   - `src/components/lp/composer/AbschnitteTab.tsx` — Sektionen-Tab (Zeilen 592-756)
   - `src/components/lp/composer/VorschauTab.tsx` — Vorschau-Tab (Zeilen 758-834)
   - `src/components/lp/composer/ComposerUI.tsx` — Section, Field, Toggle, MiniCard (Zeilen 847-905)
   - `src/components/lp/composer/AnalyseTab.tsx` — Neuer Analyse-Tab
   - `src/components/lp/PruefungsComposer.tsx` — Nur noch Shell mit Tabs, State, Header (~150 Zeilen)

### Neue Komponenten

4 neue Button-Komponenten in `KITypButtons.tsx`, analog zu `KIMCOptionenButton`:

```
KIZuordnungButtons    → generierePaare + pruefePaare
KIRichtigFalschButtons → generiereAussagen + pruefeAussagen
KILueckentextButtons  → generiereLuecken + pruefeLueckenAntworten
KIBerechnungButtons   → berechneErgebnis + pruefeToleranz
```

Jede Komponente folgt dem bestehenden Pattern:
- Props: `ki`, `fragetext`, typ-spezifische Daten, `onSet*`-Callback
- Guard: `if (!ki.verfuegbar) return null`
- 1-2 `InlineAktionButton`s + `ErgebnisAnzeige` mit `renderVorschau` für typ-spezifische Vorschau
- **Wichtig:** Immer `renderVorschau` verwenden, nie auf den Standard-Fallback von `ErgebnisAnzeige` verlassen (der nur `string`/`boolean` kann)

### Änderungen an bestehenden Dateien

**`useKIAssistent.ts` (extrahiert aus KIAssistentPanel.tsx):**
- `AktionKey` erweitern um 9 neue Werte (8 Typ-Buttons + `analysierePruefung`)

**`FragenEditor.tsx`:**
- Import der 4 neuen Komponenten
- Platzierung: Jeweils nach dem typ-spezifischen Editor (analog MC → `KIMCOptionenButton`)

```tsx
{typ === 'zuordnung' && (
  <>
    <ZuordnungEditor ... />
    <KIZuordnungButtons ki={ki} fragetext={fragetext} paare={paare} onSetPaare={setPaare} />
  </>
)}
```

**`apiService.ts`:**
- Keine Änderung nötig — `kiAssistent()` ist bereits generisch (nimmt `aktion: string` + `daten: Record`)

**Backend (Apps Script):**
- 8 neue Claude-Prompts für die neuen Aktionen
- Gleiche Struktur wie bestehende `kiAssistent`-Handler

### Vorschau-Rendering pro Typ

**Zuordnung (Paare):**
```
Links          →  Rechts
Angebot        →  Steigt bei höherem Preis
Nachfrage      →  Sinkt bei höherem Preis
```

**R/F (Aussagen):**
```
✓ Die SNB ist eine Aktiengesellschaft. (richtig)
✗ Der Bundesrat ernennt die SNB-Direktion. (falsch)
```

**Lückentext:**
Vorschau des Texts mit markierten Lücken und akzeptierten Antworten.

**Berechnung:**
```
Gleichgewichtspreis: 12.50 CHF (±0.5)
Gleichgewichtsmenge: 200 Stk. (±10)
```

---

## Feature 2: Zeitbedarf-Feld

### Neues Feld in `FrageBase`

```typescript
// In src/types/fragen.ts
export interface FrageBase {
  // ... bestehende Felder ...
  /** Geschätzter Zeitbedarf in Minuten (vorausgefüllt, editierbar) */
  zeitbedarf?: number;
}
```

### Auto-Berechnung (Richtwerte)

Neue Utility-Funktion in `src/utils/zeitbedarf.ts`:

```typescript
function berechneZeitbedarf(typ: FrageTyp, bloom: BloomStufe, extras?: { laenge?: 'kurz' | 'mittel' | 'lang' }): number
```

**Richtwert-Tabelle (Minuten):**

| Typ | K1 | K2 | K3 | K4 | K5 | K6 |
|-----|----|----|----|----|----|----|
| MC | 1 | 1.5 | 2 | 2.5 | 3 | 3 |
| Freitext kurz | 2 | 3 | 4 | 5 | 6 | 7 |
| Freitext mittel | 3 | 4 | 6 | 8 | 10 | 12 |
| Freitext lang | 5 | 7 | 9 | 12 | 15 | 18 |
| Lückentext | 1 | 1.5 | 2 | 2.5 | 3 | 3 |
| Zuordnung | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 |
| R/F | 1 | 1.5 | 2 | 2.5 | 3 | 3 |
| Berechnung | 2 | 3 | 4 | 5 | 7 | 8 |

### UI im FragenEditor

Neues Feld im Grunddaten-Abschnitt (Sektion "Zuordnung" im Editor), Grid neben Punkte:

```
Punkte *: [1]     Zeitbedarf (Min.): [3] ← vorausgefüllt, editierbar
```

- Vorausfüllung: Wenn leer, `berechneZeitbedarf()` aufrufen bei Typ/Bloom/Länge-Änderung
- Editierbar: Lehrperson kann überschreiben
- Hinweis-Text: "Geschätzt basierend auf Typ und Taxonomie"
- **`extras.laenge`** ist nur für Freitext relevant — bei allen anderen Typen wird nur `typ` + `bloom` verwendet
- **`visualisierung`-Typ:** Wird im aktuellen Editor nicht unterstützt (`editorUtils.ts` schliesst ihn aus). `berechneZeitbedarf()` liefert einen Fallback-Wert von 5 Min. falls je ein solcher Typ in einer Prüfung vorkommt.

### Integration in handleSpeichern

Wenn `zeitbedarf` nicht manuell gesetzt: Wert aus Auto-Berechnung verwenden.

---

## Feature 3: Prüfungs-Analyse-Dashboard

### Position

Neuer 4. Tab im `PruefungsComposer`:
- Tab-Typ: `ComposerTab = 'config' | 'abschnitte' | 'vorschau' | 'analyse'`
- Tab-Label: `Analyse`
- Nur klickbar wenn `gesamtFragen > 0` (sonst ausgegraut)

### Neue Datei

`src/components/lp/AnalyseTab.tsx` — eigenständige Komponente (~300-400 Zeilen)

### Props

```typescript
interface AnalyseTabProps {
  pruefung: PruefungsConfig
  fragenMap: Record<string, Frage>
  fragenGeladen: boolean  // true sobald fragenMap vollständig geladen
}
```

### Ladezustand

Solange `fragenGeladen === false`: Spinner mit "Fragen werden geladen..." anzeigen.
Die `fragenMap` wird in `PruefungsComposer` asynchron geladen — der Analyse-Tab muss darauf warten.

### Lokale Metriken (sofort berechnet)

Alle Berechnungen in einer neuen Utility: `src/utils/analyseUtils.ts`

#### 1. Taxonomie-Verteilung (K1-K6)
- Balkendiagramm (CSS-only: `div` mit `width: X%`)
- Zeigt Anzahl und Prozent pro Stufe
- Warnhinweis wenn K1+K2 > 60% oder K5+K6 = 0%

#### 2. Fragetypen-Mix
- Kompakte Übersicht: Typ → Anzahl
- Hinweis wenn nur ein Typ verwendet wird

#### 3. Punkteverteilung
- Pro Abschnitt: Summe der Punkte
- Vergleich mit `pruefung.gesamtpunkte` (Abweichung warnen)

#### 4. Zeitbedarf-Analyse
- Summe aller `zeitbedarf`-Werte der enthaltenen Fragen
- Vergleich mit `pruefung.dauerMinuten`
- Ampel: Grün (80-100%), Amber (60-80% oder 100-120%), Rot (<60% oder >120%)
- Detailtabelle: Pro Frage die geschätzte Zeit

#### 5. Themen-Abdeckung
- Gruppierung nach `thema` → Anzahl Fragen pro Thema
- Einfache Textliste

#### 6. Fachbereich-Verteilung
- Vergleich: konfigurierte Fachbereiche vs. tatsächlich abgedeckte
- Warnung wenn ein konfigurierter Fachbereich keine Fragen hat

### KI-Analyse (per Button)

Ein Button "KI-Analyse starten" am Ende des Tabs:
- Sendet alle Fragen-Daten an Backend
- Neue Aktion: `analysierePruefung`
- Input: `{ pruefung: PruefungsConfig, fragen: Frage[] }`
- Output:
  ```typescript
  {
    themenAbdeckung: string      // Bewertung der Themenabdeckung
    schwierigkeitsBalance: string // Bewertung des Schwierigkeitsgrads
    verbesserungen: string[]     // Konkrete Vorschläge
    gesamtBewertung: string      // Zusammenfassung
  }
  ```

**UI der KI-Analyse:**
- Loading-State: Spinner + "Wird analysiert..."
- Ergebnis: Karten mit den 4 Bereichen
- Verwerfen-Button zum Zurücksetzen
- **Demo-Modus:** Mock-Antwort mit Beispiel-Analyse zurückgeben (kein API-Call)

### Layout des Analyse-Tabs

```
┌─────────────────────────────────────┐
│  ÜBERSICHT                          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │ 12 │ │ 45 │ │ 40 │ │ 38 │       │
│  │Fragen│Pkt │Min.│ Est.│           │
│  └────┘ └────┘ └────┘ └────┘       │
│                                     │
│  ZEITBEDARF                         │
│  ██████████████████░░░ 38/45 Min.   │
│  ✓ Zeitbedarf passt zur Dauer       │
│                                     │
│  TAXONOMIE-VERTEILUNG               │
│  K1 ███████ 3 (25%)                 │
│  K2 █████████ 4 (33%)               │
│  K3 █████ 2 (17%)                   │
│  K4 ███ 1 (8%)                      │
│  K5 ███ 1 (8%)                      │
│  K6 ███ 1 (8%)                      │
│                                     │
│  FRAGETYPEN-MIX                     │
│  MC: 5  Freitext: 3  Zuordnung: 2  │
│  R/F: 1  Berechnung: 1             │
│                                     │
│  THEMEN                             │
│  Marktgleichgewicht: 4 Fragen       │
│  Vertragsrecht: 3 Fragen            │
│  Konjunktur: 3 Fragen              │
│  Preisbildung: 2 Fragen            │
│                                     │
│  PUNKTEVERTEILUNG                   │
│  Teil A: 15 Pkt. (33%)             │
│  Teil B: 20 Pkt. (44%)             │
│  Teil C: 10 Pkt. (22%)             │
│  Σ 45 = Gesamtpunkte ✓             │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  KI-Analyse starten         │    │
│  └─────────────────────────────┘    │
│                                     │
│  (KI-Ergebnis erscheint hier)       │
└─────────────────────────────────────┘
```

### Warnungen

Automatische Hinweise (gelb) bei:
- Zeitbedarf > 120% oder < 60% der Prüfungsdauer
- Nur ein Fragetyp verwendet
- K1+K2 > 60% (zu wenig anspruchsvoll)
- K5+K6 = 0% (keine anspruchsvollen Fragen)
- Konfigurierter Fachbereich ohne Fragen
- Summe Punkte ≠ konfigurierte Gesamtpunkte

---

## Dateien-Übersicht (Änderungen)

### Refactoring (Voraussetzung)

| Datei | Aktion | Beschreibung |
|-------|--------|-------------|
| `src/components/lp/frageneditor/useKIAssistent.ts` | Neu (Extract) | Hook + Types aus KIAssistentPanel.tsx |
| `src/components/lp/frageneditor/KIBausteine.tsx` | Neu (Extract) | InlineAktionButton + ErgebnisAnzeige |
| `src/components/lp/frageneditor/KIAssistentPanel.tsx` | Refactor | Nur noch 3 bestehende Button-Komponenten, Imports anpassen |
| `src/components/lp/composer/ConfigTab.tsx` | Neu (Extract) | Einstellungen aus PruefungsComposer |
| `src/components/lp/composer/AbschnitteTab.tsx` | Neu (Extract) | Sektionen-Tab aus PruefungsComposer |
| `src/components/lp/composer/VorschauTab.tsx` | Neu (Extract) | Vorschau aus PruefungsComposer |
| `src/components/lp/composer/ComposerUI.tsx` | Neu (Extract) | Section, Field, Toggle, MiniCard |
| `src/components/lp/PruefungsComposer.tsx` | Refactor | Shell mit Tabs/State/Header (~150 Z.) |

### Neue Features

| Datei | Aktion | Beschreibung |
|-------|--------|-------------|
| `src/types/fragen.ts` | Erweitern | `zeitbedarf?: number` in `FrageBase` |
| `src/utils/zeitbedarf.ts` | Neu | `berechneZeitbedarf()` Funktion |
| `src/utils/analyseUtils.ts` | Neu | Lokale Analyse-Berechnungen |
| `src/components/lp/frageneditor/KITypButtons.tsx` | Neu | 4 neue typ-spezifische KI-Button-Komponenten |
| `src/components/lp/frageneditor/FragenEditor.tsx` | Erweitern | KI-Buttons bei 4 Typen einbinden, Zeitbedarf-Feld |
| `src/components/lp/composer/AnalyseTab.tsx` | Neu | Analyse-Dashboard Komponente |
| `apps-script-code.js` | Erweitern | 9 neue KI-Aktionen (8 Typ-Buttons + analysierePruefung) |

---

## Nicht im Scope

- Chart-Libraries (d3, recharts) — CSS-only Balken reichen
- Historische Vergleiche zwischen Prüfungen
- Export der Analyse als PDF
- Automatische Fragen-Vorschläge basierend auf Lücken in der Analyse
