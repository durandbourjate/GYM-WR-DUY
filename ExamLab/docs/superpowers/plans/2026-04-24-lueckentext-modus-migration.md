# Lückentext-Modus (Freitext/Dropdown) + Antworten-Migration — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lückentext-Fragen bekommen einen per-Frage-Toggle (Freitext vs. Dropdown), KI-Batch befüllt für alle 253 Fragen `korrekteAntworten` (Synonyme) + `dropdownOptionen` (5 Stück), und die LP kann im Einstellungen-Tab „Fragensammlung" alle Lückentext-Fragen per Bulk-Toggle zwischen den Modi umschalten.

**Architecture:** Neues Feld `lueckentextModus: 'freitext' | 'dropdown'` pro Frage ersetzt die implizite Regel „dropdownOptionen non-empty → Dropdown". Renderer, Editor, Korrektur, Apps-Script-Normalizer und `bereinigeFrageFuerSuS_` werden an das neue Modell angepasst. One-shot Apps-Script-Migrator setzt den Modus-Wert für bestehende Fragen (rückwärts-kompatibel zum alten Contract). Danach KI-Batch-Migration analog C9 Phase 4 (Node-Scripts + User-gesteuerte Claude-Code-Batches + Apps-Script-Endpoint `batchUpdateLueckentextMigration`). Settings-Tab „Fragensammlung" als neue Infrastruktur mit Bulk-Toggle, vorbereitet für spätere Fragetyp/Metadaten-Settings.

**Tech Stack:** React 19 + TypeScript + Vite + Zustand + Tailwind CSS v4 · Google Apps Script (Backend) · Node.js ESM (Migration-Skripte) · Vitest (Tests).

---

## Voraussetzungen

- Branch: `fix/lueckentext-editor` (bereits aktiv, S142-Editor-Fix liegt dort)
- Alle Arbeiten gehen auf diesen Branch, Merge nach `main` erst nach vollständigem E2E-Test + LP-Freigabe (siehe `deployment-workflow.md` + `regression-prevention.md`)
- Google-Sheets-Backup der Fragenbank VOR Phase 4 (Apps-Script-Migrator) UND vor Phase 7 (KI-Batch-Upload)
- Apps-Script-Deploy-Fenster: Phase 4 + Phase 5 + Phase 6 deployen das Backend zusammen (1 Deploy am Ende jeder Phase, oder gebündelt am Schluss)
- Keine aktiven Prüfungen während Apps-Script-Deploys
- Alle Tests via `cd ExamLab && npx tsc -b && npx vitest run && npm run build` vor jedem Commit

---

## Phase 1 — Datenmodell

**Ziel:** Feld `lueckentextModus` im Type definieren, Tests für Default-Werte und Migrations-Helper schreiben.

**Files:**
- Modify: `ExamLab/src/types/fragen.ts` (`LueckentextFrage`-Interface)
- Modify: `ExamLab/src/utils/ueben/fragetypNormalizer.ts` (`normalisiereLueckentext`)
- Create: `ExamLab/src/utils/ueben/fragetypNormalizer.test.ts` (neue Tests, falls nicht vorhanden: erweitern)

### Task 1: Type-Feld ergänzen

**Files:**
- Modify: `ExamLab/src/types/fragen.ts:190-210` (Interface `LueckentextFrage`)

- [ ] **Step 1.1: Field `lueckentextModus` in Interface ergänzen**

```ts
export interface LueckentextFrage extends FrageBase {
  typ: 'lueckentext';
  fragetext: string;
  textMitLuecken: string;
  luecken: Luecke[];
  lueckentextModus?: 'freitext' | 'dropdown';  // NEU — default 'freitext' via Normalizer
}
```

Hinweis: optional (`?`) damit Legacy-Fragen ohne Feld nicht TS-Error werfen. Default-Setzung erfolgt im Normalizer (Task 2).

- [ ] **Step 1.2: Build prüfen**

Run: `cd ExamLab && npx tsc -b`
Expected: PASS

### Task 2: Normalizer-Default + Modus-Migration

**Files:**
- Modify: `ExamLab/src/utils/ueben/fragetypNormalizer.ts` (`normalisiereLueckentext`)
- Create/Modify: `ExamLab/src/utils/ueben/fragetypNormalizer.test.ts`

- [ ] **Step 2.1: Test zuerst — Default `'freitext'` bei Legacy-Fragen ohne Feld**

```ts
// fragetypNormalizer.test.ts
import { describe, it, expect } from 'vitest'
import { normalisiereLueckentext } from './fragetypNormalizer'

describe('normalisiereLueckentext — lueckentextModus', () => {
  it('setzt Default freitext wenn Feld fehlt UND keine dropdownOptionen', () => {
    const frage = {
      typ: 'lueckentext',
      luecken: [{ id: 'l0', korrekteAntworten: ['x'], caseSensitive: false }],
    }
    const normalisiert = normalisiereLueckentext(frage)
    expect(normalisiert.lueckentextModus).toBe('freitext')
  })

  it('setzt dropdown wenn Feld fehlt ABER dropdownOptionen non-empty (Legacy-Fragen)', () => {
    const frage = {
      typ: 'lueckentext',
      luecken: [{ id: 'l0', korrekteAntworten: ['x'], dropdownOptionen: ['x','y','z'], caseSensitive: false }],
    }
    const normalisiert = normalisiereLueckentext(frage)
    expect(normalisiert.lueckentextModus).toBe('dropdown')
  })

  it('respektiert expliziten Wert falls vorhanden', () => {
    const frage = {
      typ: 'lueckentext',
      lueckentextModus: 'dropdown',
      luecken: [{ id: 'l0', korrekteAntworten: ['x'], caseSensitive: false }],
    }
    const normalisiert = normalisiereLueckentext(frage)
    expect(normalisiert.lueckentextModus).toBe('dropdown')
  })
})
```

- [ ] **Step 2.2: Run tests to verify they fail**

Run: `cd ExamLab && npx vitest run src/utils/ueben/fragetypNormalizer.test.ts`
Expected: FAIL — `lueckentextModus` is undefined

- [ ] **Step 2.3: Normalizer erweitern**

In `normalisiereLueckentext` (nach der luecken-Normalisierung):

```ts
// Modus-Default: expliziter Wert > dropdownOptionen-Heuristik > 'freitext'
let lueckentextModus: 'freitext' | 'dropdown'
if (frage.lueckentextModus === 'freitext' || frage.lueckentextModus === 'dropdown') {
  lueckentextModus = frage.lueckentextModus
} else {
  const hatDropdowns = luecken.some((l: any) => Array.isArray(l.dropdownOptionen) && l.dropdownOptionen.length > 0)
  lueckentextModus = hatDropdowns ? 'dropdown' : 'freitext'
}
return { ...frage, luecken, lueckentextModus }
```

- [ ] **Step 2.4: Tests grün**

Run: `cd ExamLab && npx vitest run src/utils/ueben/fragetypNormalizer.test.ts`
Expected: PASS (3/3)

- [ ] **Step 2.5: Gesamte Test-Suite**

Run: `cd ExamLab && npx vitest run`
Expected: keine Regressionen

- [ ] **Step 2.6: Commit**

```bash
cd "/Users/durandbourjate/Documents/-Gym Hofwil/00 Automatisierung Unterricht/10 Github/GYM-WR-DUY"
git checkout fix/lueckentext-editor
git add ExamLab/src/types/fragen.ts ExamLab/src/utils/ueben/fragetypNormalizer.ts ExamLab/src/utils/ueben/fragetypNormalizer.test.ts
git commit -m "ExamLab: lueckentextModus-Feld + Normalizer-Default (Freitext/Dropdown)"
```

---

## Phase 2 — Renderer + Korrektur

**Ziel:** SuS-Renderer respektiert `lueckentextModus`. Korrektur-Logik unverändert (Matching gegen `korrekteAntworten` ist gleich in beiden Modi — Dropdown-Auswahl ist auch ein String-Match).

**Files:**
- Modify: `ExamLab/src/components/fragetypen/LueckentextFrage.tsx:45-53` + `:108-133`
- Create: `ExamLab/src/tests/LueckentextFrageModus.test.tsx`
- Read-only: `ExamLab/src/utils/ueben/korrektur.ts` — verifizieren, dass `case 'lueckentext'` keine Änderung braucht

### Task 3: Renderer — Modus-Lookup

**Files:**
- Modify: `ExamLab/src/components/fragetypen/LueckentextFrage.tsx:45-53`

- [ ] **Step 3.1: Test zuerst — Freitext-Frage mit dropdownOptionen zeigt Texteingabe**

```tsx
// ExamLab/src/tests/LueckentextFrageModus.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LueckentextFrage from '../components/fragetypen/LueckentextFrage'

const baseFrage = {
  id: 'f1',
  typ: 'lueckentext' as const,
  fachbereich: 'BWL',
  bloom: 'K1',
  punkte: 1,
  fragetext: 'Test',
  textMitLuecken: 'Hauptstadt = {{0}}',
  luecken: [{
    id: 'l0',
    korrekteAntworten: ['Bern'],
    dropdownOptionen: ['Bern', 'Zürich', 'Basel', 'Genf', 'Luzern'],
    caseSensitive: false,
  }],
}

describe('LueckentextFrage — lueckentextModus-Dispatch', () => {
  it('rendert Texteingabe wenn Modus freitext (trotz vorhandener dropdownOptionen)', () => {
    const frage = { ...baseFrage, lueckentextModus: 'freitext' as const }
    render(<LueckentextFrage frage={frage} modus="aufgabe" />)
    expect(document.querySelector('input[type="text"]')).not.toBeNull()
    expect(document.querySelector('select')).toBeNull()
  })

  it('rendert Dropdown wenn Modus dropdown', () => {
    const frage = { ...baseFrage, lueckentextModus: 'dropdown' as const }
    render(<LueckentextFrage frage={frage} modus="aufgabe" />)
    expect(document.querySelector('select')).not.toBeNull()
    expect(document.querySelector('input[type="text"]')).toBeNull()
  })

  it('Fallback: rendert Freitext wenn Modus dropdown aber dropdownOptionen leer', () => {
    const frage = {
      ...baseFrage,
      lueckentextModus: 'dropdown' as const,
      luecken: [{ ...baseFrage.luecken[0], dropdownOptionen: [] }],
    }
    render(<LueckentextFrage frage={frage} modus="aufgabe" />)
    expect(document.querySelector('input[type="text"]')).not.toBeNull()
    expect(document.querySelector('select')).toBeNull()
  })
})
```

- [ ] **Step 3.2: Run tests to verify they fail**

Run: `cd ExamLab && npx vitest run src/tests/LueckentextFrageModus.test.tsx`
Expected: FAIL — aktueller Renderer ignoriert `lueckentextModus`, rendert Dropdown sobald `dropdownOptionen` non-empty

- [ ] **Step 3.3: Renderer umstellen**

In `LueckentextFrage.tsx:45-53` — `gemischteOptionen` Memo anpassen:

```tsx
// Gemischte Dropdown-Optionen nur wenn Modus=dropdown
const gemischteOptionen = useMemo(() => {
  const result: Record<string, string[]> = {}
  if (frage.lueckentextModus !== 'dropdown') return result
  for (const luecke of (frage.luecken ?? [])) {
    if (luecke.dropdownOptionen && luecke.dropdownOptionen.length > 0) {
      result[luecke.id] = shuffleOptionen(luecke.dropdownOptionen, `${frage.id}-${luecke.id}`)
    }
  }
  return result
}, [frage.id, frage.luecken, frage.lueckentextModus])
```

Die nachfolgende Render-Logik (`if (dropdownOpts) {...}` vs. Freitext) bleibt unverändert — `gemischteOptionen[lueckenId]` ist jetzt genau dann truthy wenn Modus=dropdown UND Optionen vorhanden. Fallback (Modus=dropdown + leere Optionen) → Freitext.

- [ ] **Step 3.4: Run tests to verify they pass**

Run: `cd ExamLab && npx vitest run src/tests/LueckentextFrageModus.test.tsx`
Expected: PASS (3/3)

- [ ] **Step 3.5: Loesung-Modus verifizieren**

Read-only: `LueckentextFrage.tsx:183+` (`LueckentextLoesung`). Prüfen, dass Lösungs-Modus die gleiche Modus-Logik nutzen sollte (korrekte Antwort farbig markieren egal ob Texteingabe oder Dropdown). Falls der Lösungsmodus keine Dropdowns rendert, sondern nur Texte vergleicht → KEINE Änderung nötig. Falls er Dropdowns rendert → gleiche Modus-Guard einbauen.

**Wenn Loesung-Modus rendering anders: Test + Fix hier.** Sonst: Kommentar im Test, Commit weiter.

- [ ] **Step 3.6: Commit**

```bash
git add ExamLab/src/components/fragetypen/LueckentextFrage.tsx ExamLab/src/tests/LueckentextFrageModus.test.tsx
git commit -m "ExamLab: LueckentextFrage respektiert lueckentextModus im SuS-Renderer"
```

### Task 4: Korrektur-Logik verifizieren (read-only)

**Files:**
- Read-only: `ExamLab/src/utils/ueben/korrektur.ts` — Case `lueckentext`
- Read-only: `ExamLab/src/utils/ueben/korrektur.test.ts` — bestehende Tests

- [ ] **Step 4.1: Korrektur-Case lesen**

Sicherstellen, dass die Autokorrektur in beiden Modi funktioniert: Die SuS-Antwort ist ein String (entweder eingetippt oder Dropdown-Selektion), Match gegen `luecke.korrekteAntworten[]`. Keine Änderung am Code erwartet.

- [ ] **Step 4.2: Test hinzufügen — Dropdown-Auswahl wird korrekt ausgewertet**

In `korrektur.test.ts` einen Test-Fall für eine Lückentext-Frage mit `lueckentextModus: 'dropdown'`, SuS-Antwort = `{ l0: 'Bern' }`, `korrekteAntworten: ['Bern']` → erwartet: 1 Punkt. Zeigt, dass die Korrektur modus-agnostisch funktioniert.

- [ ] **Step 4.3: Run tests**

Run: `cd ExamLab && npx vitest run src/utils/ueben/korrektur.test.ts`
Expected: PASS

- [ ] **Step 4.4: Commit (falls Test hinzugefügt)**

```bash
git add ExamLab/src/utils/ueben/korrektur.test.ts
git commit -m "ExamLab: Test — Lückentext-Korrektur modus-agnostisch"
```

---

## Phase 3 — Editor + fragenFactory

**Ziel:** LP sieht pro Lückentext-Frage einen Toggle (Freitext/Dropdown), beide Felder (`korrekteAntworten` + `dropdownOptionen`) sind sichtbar, das inaktive ist gedimmt mit Label „(inaktiv im aktuellen Modus)". `fragenFactory` initialisiert neue Lückentext-Fragen mit `lueckentextModus='freitext'` und leerem `dropdownOptionen[]`.

**Files:**
- Modify: `packages/shared/src/editor/typen/LueckentextEditor.tsx` — Toggle-UI + Feld-Dimming
- Modify: `ExamLab/src/utils/fragenFactory.ts` — Default-Initialisierung
- Create: `ExamLab/src/tests/LueckentextEditorModus.test.tsx` — Toggle-UX

### Task 5: Editor-Toggle + Dimming

**Files:**
- Modify: `packages/shared/src/editor/typen/LueckentextEditor.tsx`
- Create: `ExamLab/src/tests/LueckentextEditorModus.test.tsx`

- [ ] **Step 5.1: Test zuerst — Toggle schaltet Modus + dimmt Felder**

```tsx
// ExamLab/src/tests/LueckentextEditorModus.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LueckentextEditor from '@shared/editor/typen/LueckentextEditor'
// EditorProvider-Setup je nach Shared-Context-API — Pattern aus bestehenden Editor-Tests übernehmen

describe('LueckentextEditor — Modus-Toggle', () => {
  it('zeigt Toggle Freitext/Dropdown oberhalb der Lücken-Liste', () => {
    // Render mit minimaler Frage (1 Lücke), modus freitext
    // Erwartung: Toggle-Button/-Switch vorhanden mit aktivem „Freitext"
  })

  it('wechselt lueckentextModus beim Toggle-Klick auf dropdown', () => {
    // Mock onChange-Handler
    // Klick auf „Dropdown" → erwartet onChange mit lueckentextModus='dropdown'
  })

  it('dimmt das inaktive Feld mit Label „(inaktiv im aktuellen Modus)"', () => {
    // modus=freitext → dropdownOptionen-Input hat Dimming-Klasse (opacity oder aria-disabled)
    // Label „inaktiv" sichtbar
  })
})
```

Hinweis: genaue Test-Setup-Details (EditorProvider) aus `LueckentextEditor.test.tsx` oder ähnlichem bestehenden Shared-Editor-Test übernehmen.

- [ ] **Step 5.2: Run tests to verify they fail**

Run: `cd ExamLab && npx vitest run src/tests/LueckentextEditorModus.test.tsx`
Expected: FAIL — Toggle existiert noch nicht

- [ ] **Step 5.3: Toggle-UI in Editor einbauen**

Im LueckentextEditor (oberhalb der Lücken-Liste):

```tsx
const modus = frage.lueckentextModus ?? 'freitext'

function setModus(next: 'freitext' | 'dropdown') {
  onChange({ ...frage, lueckentextModus: next })
}

<div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
  <span className="text-sm font-medium">Antwort-Modus:</span>
  <div className="inline-flex rounded-md border border-slate-300 dark:border-slate-600 overflow-hidden">
    <button
      type="button"
      onClick={() => setModus('freitext')}
      className={`px-3 py-1 text-sm ${modus === 'freitext' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'}`}
      aria-pressed={modus === 'freitext'}
    >
      Freitext
    </button>
    <button
      type="button"
      onClick={() => setModus('dropdown')}
      className={`px-3 py-1 text-sm ${modus === 'dropdown' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'}`}
      aria-pressed={modus === 'dropdown'}
    >
      Dropdown
    </button>
  </div>
  <span className="text-xs text-slate-500 dark:text-slate-400">
    {modus === 'freitext' ? 'SuS tippt Antwort ein' : 'SuS wählt aus 5 Optionen'}
  </span>
</div>
```

- [ ] **Step 5.4: Felder-Dimming**

Pro Lücke: beide Felder weiterhin rendern, aber das inaktive mit `opacity-50 pointer-events-none` UND Label:

```tsx
<div className={modus === 'dropdown' ? 'opacity-50' : ''}>
  <label className="text-xs text-slate-500">
    Akzeptierte Antworten (Freitext)
    {modus === 'dropdown' && <span className="italic ml-1">— inaktiv im Dropdown-Modus</span>}
  </label>
  {/* korrekteAntworten-Inputs */}
</div>

<div className={modus === 'freitext' ? 'opacity-50' : ''}>
  <label className="text-xs text-slate-500">
    Dropdown-Optionen (1 Korrekte + 4 Distraktoren)
    {modus === 'freitext' && <span className="italic ml-1">— inaktiv im Freitext-Modus</span>}
  </label>
  {/* dropdownOptionen-Inputs */}
</div>
```

**Wichtig:** `pointer-events-none` nicht setzen, weil LP trotzdem im inaktiven Feld editieren können soll (um Daten vorzubereiten). Nur optisch dimmen.

- [ ] **Step 5.5: Run tests to verify they pass**

Run: `cd ExamLab && npx vitest run src/tests/LueckentextEditorModus.test.tsx`
Expected: PASS (3/3)

- [ ] **Step 5.6: Regression-Check — bestehende Editor-Tests grün**

Run: `cd ExamLab && npx vitest run`
Expected: keine Regressionen

- [ ] **Step 5.7: Commit**

```bash
git add packages/shared/src/editor/typen/LueckentextEditor.tsx ExamLab/src/tests/LueckentextEditorModus.test.tsx
git commit -m "ExamLab: LueckentextEditor — Modus-Toggle + Felder-Dimming"
```

### Task 6: fragenFactory — Default-Werte für neue Fragen

**Files:**
- Modify: `ExamLab/src/utils/fragenFactory.ts`

- [ ] **Step 6.1: Test (falls noch nicht vorhanden) oder Read-Check**

Suche `case 'lueckentext'` in `fragenFactory.ts`. Verifiziere: `luecken: []` oder `luecken: [{ id, korrekteAntworten: [''], ... }]`. Feld `lueckentextModus` hinzufügen.

- [ ] **Step 6.2: Default setzen**

In `fragenFactory.ts` — im Lückentext-Case:

```ts
case 'lueckentext':
  return {
    ...basisFields,
    typ: 'lueckentext',
    textMitLuecken: '',
    luecken: [],
    lueckentextModus: 'freitext',  // NEU — Default
  }
```

Falls auch bei `dropdownOptionen`-Init eine Default-Array nötig: `dropdownOptionen: []` pro Lücke setzen beim Hinzufügen einer neuen Lücke im Editor.

- [ ] **Step 6.3: Tests + Build**

Run: `cd ExamLab && npx tsc -b && npx vitest run`
Expected: grün

- [ ] **Step 6.4: Commit**

```bash
git add ExamLab/src/utils/fragenFactory.ts
git commit -m "ExamLab: fragenFactory — lueckentextModus='freitext' default"
```

---

## Phase 4 — Apps-Script Backend

**Ziel:** `bereinigeFrageFuerSuS_` behält `lueckentextModus` (SuS braucht es zum Rendern), Apps-Script-Parser schreibt Feld in JSON, neuer Endpoint `batchUpdateLueckentextMigration` für KI-Batch-Upload, one-shot Migrator setzt den Modus für bestehende Fragen.

**Files:**
- Modify: `ExamLab/apps-script-code.js` — mehrere Stellen
- Create-Helper: neue Funktion `migriereLueckentextModus()` (manuell im GAS-Editor ausführbar)

### Task 7: `bereinigeFrageFuerSuS_` — Modus behalten

**Files:**
- Modify: `ExamLab/apps-script-code.js` (`bereinigeFrageFuerSuS_` um Zeile 2229–2280)

- [ ] **Step 7.1: Betroffene Stelle identifizieren**

`bereinigeFrageFuerSuS_` entfernt Lösungsfelder. Neue Überlegung: `lueckentextModus` ist Rendering-Metadata, KEIN Lösungsfeld. SuS muss es sehen, um richtigen Input zu rendern (Freitext vs. Dropdown).

Konkret prüfen in `ExamLab/apps-script-code.js`:

```bash
grep -n "LOESUNGS_FELDER_" ExamLab/apps-script-code.js
grep -n "function bereinigeFrageFuerSuS" ExamLab/apps-script-code.js
```

Laut Memory S135/S125 ist `LOESUNGS_FELDER_` eine **Blacklist** — nur explizit gelistete Felder werden entfernt (`musterlosung`, `bewertungsraster`, plus pro Fragetyp `korrekteAntworten`, `toleranz`, `zielZone`, etc.). Neue Felder wie `lueckentextModus` passen nicht auf die Blacklist → werden automatisch durchgereicht. Erwartung: keine Code-Änderung nötig, nur verifizieren per Test in Step 7.2.

Wenn der Test in Step 7.3 fehlschlägt (Feld doch entfernt): Blacklist-Eintrag identifizieren und Feld ausnehmen.

- [ ] **Step 7.2: GAS-Test-Shim schreiben**

```js
function testBereinigeLueckentextModus_() {
  var frage = {
    typ: 'lueckentext',
    lueckentextModus: 'dropdown',
    luecken: [{ id: 'l0', korrekteAntworten: ['x'], dropdownOptionen: ['x','y','z','a','b'], caseSensitive: false }],
    musterlosung: 'geheim'
  }
  var bereinigt = bereinigeFrageFuerSuS_(frage)
  assert_(bereinigt.lueckentextModus === 'dropdown', 'lueckentextModus muss erhalten bleiben')
  assert_(!bereinigt.musterlosung, 'musterlosung muss entfernt sein')
  assert_(!bereinigt.luecken[0].korrekteAntworten, 'korrekteAntworten muss entfernt sein')
  Logger.log('✓ bereinigeLueckentextModus_ OK')
}

function testBereinigeLueckentextModus() { testBereinigeLueckentextModus_() }

function assert_(cond, msg) { if (!cond) throw new Error('Assertion failed: ' + msg) }
```

(`assert_` nur hinzufügen wenn nicht schon vorhanden — prüfen mit `grep "function assert_"` in apps-script-code.js)

- [ ] **Step 7.3: Im GAS-Editor ausführen**

User kopiert die aktuelle `apps-script-code.js` ins GAS-Editor-Projekt (wie in dieser Session bereits geübt), führt `testBereinigeLueckentextModus` aus. Erwartet: `✓` in Logs.

- [ ] **Step 7.4: Falls Test fehlschlägt — Whitelist anpassen**

Falls `lueckentextModus` wegbereinigt wird: identifiziere die Entfernungs-Regel und ergänze die Ausnahme. Konkret in `bereinigeFrageFuerSuS_`: `if (frage.typ === 'lueckentext') { /* lueckentextModus erhalten */ }`.

- [ ] **Step 7.5: Commit (lokale apps-script-code.js)**

```bash
git add ExamLab/apps-script-code.js
git commit -m "ExamLab: bereinigeFrageFuerSuS_ behält lueckentextModus (Rendering-Metadata)"
```

### Task 8: Apps-Script Parser — Feld aus Sheet lesen + in JSON schreiben

**Files:**
- Modify: `ExamLab/apps-script-code.js` — Funktionen `parseFrage` + `fragenFuerSheet_` (oder wie der Write-Helper heisst)

- [ ] **Step 8.1: Parser — Feld beim Read lesen**

`parseFrage` in apps-script-code.js (Lückentext-Case) lesen und `lueckentextModus` als Feld aus `json` / `typDaten` extrahieren. Fallback-Logik: wenn Feld fehlt → Heuristik wie Frontend-Normalizer (`dropdownOptionen non-empty ? 'dropdown' : 'freitext'`).

```js
// Im Lückentext-Parse-Case:
var typDaten = JSON.parse(row.json || row.daten || '{}')
var modus = typDaten.lueckentextModus
if (modus !== 'freitext' && modus !== 'dropdown') {
  // Fallback aus Heuristik
  var hatDropdowns = Array.isArray(typDaten.luecken) && typDaten.luecken.some(function(l) {
    return Array.isArray(l.dropdownOptionen) && l.dropdownOptionen.length > 0
  })
  modus = hatDropdowns ? 'dropdown' : 'freitext'
}
frage.lueckentextModus = modus
```

- [ ] **Step 8.2: Write-Path — Feld beim Save schreiben**

Typ-spezifische Daten werden als `JSON.stringify(typDaten)` in die `json`-Spalte geschrieben. Sicherstellen, dass kein expliziter Field-Whitelist-Filter `lueckentextModus` wegwirft:

```bash
grep -n "function speichereFrage" ExamLab/apps-script-code.js
grep -n "function frageSpeichern" ExamLab/apps-script-code.js
grep -n "getTypDaten" ExamLab/apps-script-code.js
```

Die Schreibstelle identifizieren und verifizieren, dass das ganze `frage.typDaten`-Objekt (oder äquivalent) serialisiert wird. Falls explizite Whitelist (Form `{ luecken: frage.luecken, textMitLuecken: frage.textMitLuecken }`): `lueckentextModus: frage.lueckentextModus` ergänzen.

Memory S125 Lehre: `getTypDaten` speicherte mal Legacy-Feldnamen statt Frontend-Typnamen → jedes Save zerstörte Daten. Prüfen, dass `lueckentextModus` im Save-Pfad durchkommt, nicht nur im Read-Pfad.

- [ ] **Step 8.3: GAS-Smoke-Test**

Im GAS-Editor: eine bestehende Lückentext-Frage lesen, das Feld `lueckentextModus` muss im Response-JSON enthalten sein (via `Logger.log(JSON.stringify(frage))`).

- [ ] **Step 8.4: Commit**

```bash
git add ExamLab/apps-script-code.js
git commit -m "ExamLab: Apps-Script Parser liest+schreibt lueckentextModus mit Heuristik-Fallback"
```

### Task 9: One-shot Migrator für bestehende Fragen

**Files:**
- Modify: `ExamLab/apps-script-code.js` — neue Funktion `migriereLueckentextModus()`

- [ ] **Step 9.1: Migrator schreiben**

```js
/**
 * One-shot: setzt lueckentextModus bei allen bestehenden Lückentext-Fragen.
 * Heuristik: dropdownOptionen non-empty → 'dropdown', sonst 'freitext'.
 * Idempotent: explizit gesetzte Werte werden nicht überschrieben.
 * Manuell im GAS-Editor ausführen, NACH Google-Sheets-Backup.
 */
function migriereLueckentextModus() {
  var tabs = ['VWL', 'BWL', 'Recht', 'Informatik']
  var fragenbank = SpreadsheetApp.openById(FRAGENBANK_ID)
  var total = 0
  var gesetzt = 0
  var schonGesetzt = 0
  var errors = []

  for (var t = 0; t < tabs.length; t++) {
    var sheet = fragenbank.getSheetByName(tabs[t])
    if (!sheet) continue
    var data = getSheetData(sheet)
    var lastCol = sheet.getLastColumn()
    if (lastCol === 0) continue
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
    var jsonCol = headers.indexOf('json')
    if (jsonCol < 0) continue

    for (var r = 0; r < data.length; r++) {
      if (data[r].typ !== 'lueckentext') continue
      total++
      try {
        var typDaten = JSON.parse(data[r].json || '{}')
        if (typDaten.lueckentextModus === 'freitext' || typDaten.lueckentextModus === 'dropdown') {
          schonGesetzt++
          continue
        }
        var hatDropdowns = Array.isArray(typDaten.luecken) && typDaten.luecken.some(function(l) {
          return Array.isArray(l.dropdownOptionen) && l.dropdownOptionen.length > 0
        })
        typDaten.lueckentextModus = hatDropdowns ? 'dropdown' : 'freitext'
        var zeile = r + 2  // Header-Zeile + 0-indexed
        sheet.getRange(zeile, jsonCol + 1).setValue(JSON.stringify(typDaten))
        gesetzt++
      } catch (e) {
        errors.push({ tab: tabs[t], id: data[r].id, error: e.message })
      }
    }
  }

  Logger.log('=== Lückentext-Modus-Migration ===')
  Logger.log('Gesamt Lückentext-Fragen: ' + total)
  Logger.log('Neu gesetzt: ' + gesetzt)
  Logger.log('Bereits gesetzt (übersprungen): ' + schonGesetzt)
  if (errors.length > 0) {
    Logger.log('Fehler: ' + errors.length)
    errors.forEach(function(e) { Logger.log('  [' + e.tab + '] ' + e.id + ': ' + e.error) })
  }
  return { total: total, gesetzt: gesetzt, schonGesetzt: schonGesetzt, errors: errors }
}
```

- [ ] **Step 9.2: Vorher — Google-Sheets-Backup erstellen (manuell vom User)**

User: Sheet-Datei → Menü → „Datei → Eine Kopie erstellen" → Dateiname mit Datum, Original-Sheet als Original-Backup behalten.

- [ ] **Step 9.3: Trockenlauf auf 1 Tab (Informatik)**

Informatik hat laut Scan 0 Lückentext-Fragen → Trockenlauf-safe. Falls gewünscht: einen Test-Tab mit 1–2 Testfragen duplizieren oder auf Test-Sheet ausführen.

Alternativ: Migrator erweitern um `dryRun=true` Parameter, der nur loggt ohne zu schreiben.

- [ ] **Step 9.4: Volllauf auf allen Tabs**

Im GAS-Editor: `migriereLueckentextModus` ausführen. Erwartet: ~253 Fragen migriert, 0 Fehler.

- [ ] **Step 9.5: Verifizieren**

Zufalls-Stichprobe: eine migrierte Frage im GAS-Editor manuell lesen, JSON-Feld prüfen. Oder Frontend-Seitig: LP öffnet eine Lückentext-Frage im Editor, Toggle muss korrekt auf „Freitext" stehen (da bisher keine Frage Dropdowns hatte).

- [ ] **Step 9.6: Commit**

```bash
git add ExamLab/apps-script-code.js
git commit -m "ExamLab: One-shot-Migrator migriereLueckentextModus (setzt Modus aus Heuristik)"
```

---

## Phase 5 — Apps-Script Endpoint `batchUpdateLueckentextMigration`

**Ziel:** Neuer Admin-only Endpoint, den das Node-Upload-Skript der Phase 7 (KI-Batch) aufruft. Überschreibt pro Frage nur `luecken[].korrekteAntworten` + `luecken[].dropdownOptionen` + `pruefungstauglich=false`. Alle anderen Felder unangetastet.

**Files:**
- Modify: `ExamLab/apps-script-code.js` — neuer Endpoint-Case + Helper-Funktion + Test-Shim

### Task 10: Endpoint + Test-Shim

**Files:**
- Modify: `ExamLab/apps-script-code.js`

- [ ] **Step 10.1: Endpoint-Dispatch-Case ergänzen**

Im Apps-Script-Dispatcher (suche `case 'batchUpdateFragenMigration':`) analog ergänzen:

```js
case 'batchUpdateLueckentextMigration': {
  if (!istZugelasseneLP(body.email)) return jsonResponse({error:'Nicht autorisiert'})
  if (!istAdmin_(body.email)) return jsonResponse({error:'Admin-only'})
  return jsonResponse(batchUpdateLueckentextMigrationEndpoint(body))
}
```

- [ ] **Step 10.2: Helper-Funktion**

```js
/**
 * Partial-Update: überschreibt pro Frage NUR luecken[].korrekteAntworten
 * und luecken[].dropdownOptionen. Setzt pruefungstauglich=false.
 * Alle anderen Felder (fragetext, textMitLuecken, bloom, thema, ...) bleiben unangetastet.
 *
 * body.updates: Array<{id, fachbereich, luecken: Array<{id, korrekteAntworten, dropdownOptionen}>}>
 */
function batchUpdateLueckentextMigrationEndpoint(body) {
  var updates = Array.isArray(body.updates) ? body.updates : []
  if (updates.length === 0) return { success: false, error: 'Keine Updates' }
  var fragenbank = SpreadsheetApp.openById(FRAGENBANK_ID)
  var results = []

  // Gruppiere nach fachbereich (Sheet) für effizienten Lookup
  var nachSheet = {}
  updates.forEach(function(u) {
    if (!u.id || !u.fachbereich) { results.push({ id: u.id, error: 'Fehlende id oder fachbereich' }); return }
    if (!nachSheet[u.fachbereich]) nachSheet[u.fachbereich] = []
    nachSheet[u.fachbereich].push(u)
  })

  Object.keys(nachSheet).forEach(function(fach) {
    var sheet = fragenbank.getSheetByName(fach)
    if (!sheet) { nachSheet[fach].forEach(function(u) { results.push({ id: u.id, error: 'Sheet nicht gefunden' }) }); return }
    var lastCol = sheet.getLastColumn()
    var lastRow = sheet.getLastRow()
    if (lastCol === 0 || lastRow < 2) return
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
    var idCol = headers.indexOf('id')
    var jsonCol = headers.indexOf('json')
    var pruefungstauglichCol = headers.indexOf('pruefungstauglich')
    var geaendertCol = headers.indexOf('geaendertAm')
    if (idCol < 0 || jsonCol < 0) return
    var alleDaten = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues()
    var idToRow = {}
    alleDaten.forEach(function(r, i) { idToRow[r[idCol]] = i + 2 })

    nachSheet[fach].forEach(function(u) {
      var zeile = idToRow[u.id]
      if (!zeile) { results.push({ id: u.id, error: 'ID nicht gefunden' }); return }
      try {
        var jsonStr = sheet.getRange(zeile, jsonCol + 1).getValue()
        var typDaten = JSON.parse(jsonStr || '{}')
        if (!Array.isArray(typDaten.luecken)) { results.push({ id: u.id, error: 'Keine luecken im JSON' }); return }
        // Pro Lücke: korrekteAntworten + dropdownOptionen überschreiben
        var updateIds = {}
        u.luecken.forEach(function(lu) { updateIds[lu.id] = lu })
        typDaten.luecken = typDaten.luecken.map(function(l) {
          var upd = updateIds[l.id]
          if (!upd) return l  // Lücke nicht im Update → unangetastet
          return Object.assign({}, l, {
            korrekteAntworten: Array.isArray(upd.korrekteAntworten) ? upd.korrekteAntworten : l.korrekteAntworten,
            dropdownOptionen: Array.isArray(upd.dropdownOptionen) ? upd.dropdownOptionen : l.dropdownOptionen,
          })
        })
        sheet.getRange(zeile, jsonCol + 1).setValue(JSON.stringify(typDaten))
        if (pruefungstauglichCol >= 0) sheet.getRange(zeile, pruefungstauglichCol + 1).setValue(false)
        if (geaendertCol >= 0) sheet.getRange(zeile, geaendertCol + 1).setValue(new Date().toISOString())
        results.push({ id: u.id, success: true })
      } catch (e) {
        results.push({ id: u.id, error: e.message })
      }
    })
  })

  return { success: true, results: results }
}
```

- [ ] **Step 10.3: Test-Shim**

```js
function testC9BatchUpdateLueckentextMigration_() {
  var email = 'yannick.durand@gymhofwil.ch'
  // Erstelle 1 Test-Frage (oder nutze eine existierende mit bekannter ID)
  var testId = '5b8e11b4-afd9-4e98-bf8c-e1c55d0a63c6'  // BWL Beispiel aus S142
  var body = {
    email: email,
    updates: [{
      id: testId,
      fachbereich: 'BWL',
      luecken: [
        { id: 'luecke-0', korrekteAntworten: ['Output', 'Ausbringung'], dropdownOptionen: ['Output', 'Kosten', 'Umsatz', 'Wert', 'Einkommen'] },
        { id: 'luecke-1', korrekteAntworten: ['Input', 'Einsatz'], dropdownOptionen: ['Input', 'Ertrag', 'Gewinn', 'Umsatz', 'Wert'] },
      ]
    }]
  }
  var resp = batchUpdateLueckentextMigrationEndpoint(body)
  Logger.log(JSON.stringify(resp, null, 2))
  assert_(resp.success === true, 'Endpoint muss success=true liefern')
  assert_(resp.results[0].success === true, 'Update-Result muss success=true')
}

function testC9BatchUpdateLueckentextMigration() { testC9BatchUpdateLueckentextMigration_() }
```

- [ ] **Step 10.4: Apps-Script deployen (vom User)**

User: Apps-Script-Editor → Code pasten → Bereitstellung erstellen (NICHT HEAD). Neue Deployment-URL notieren (wird in Phase 7 gebraucht).

Wichtig laut `deployment-workflow.md`: kein Deploy während aktiver Prüfungen. Deploy-Fenster abends/Wochenende.

- [ ] **Step 10.5: Smoke-Test ausführen**

Im GAS-Editor: `testC9BatchUpdateLueckentextMigration` laufen lassen. Erwartet: Logs zeigen `success: true`, `results[0].success: true`.

**Nach Test:** Die veränderte Frage im Sheet manuell revertieren (via Ctrl-Z im Sheet oder Backup-Wiederherstellung), damit der Test-Lauf keine echten Daten hinterlässt.

- [ ] **Step 10.6: Commit**

```bash
git add ExamLab/apps-script-code.js
git commit -m "ExamLab: Apps-Script Endpoint batchUpdateLueckentextMigration + Test-Shim"
```

---

## Phase 6 — Settings-Tab „Fragensammlung" mit Bulk-Toggle

**Ziel:** Neuer Tab im Einstellungen-Panel. Erste Funktion: Bulk-Toggle „Alle Lückentext-Fragen auf Freitext" / „Alle auf Dropdown". Struktur vorbereitet für künftige Fragetyp/Metadaten-Settings.

**Files:**
- Modify: `ExamLab/src/components/settings/EinstellungenPanel.tsx` — neuer Tab-Eintrag
- Create: `ExamLab/src/components/settings/fragensammlung/FragensammlungTab.tsx` — neuer Tab
- Create: `ExamLab/src/components/settings/fragensammlung/LueckentextBulkToggle.tsx` — Toggle-UI
- Create: `ExamLab/src/services/fragensammlungApi.ts` — API-Wrapper
- Modify: `ExamLab/src/store/lpUIStore.ts` — `EinstellungenTab`-Typ erweitern
- Modify: `ExamLab/apps-script-code.js` — neuer Endpoint `bulkSetzeLueckentextModus`
- Create: `ExamLab/src/tests/FragensammlungTab.test.tsx`

### Task 11: EinstellungenTab-Typ erweitern

**Files:**
- Modify: `ExamLab/src/store/lpUIStore.ts`

- [ ] **Step 11.1: Tab-Typ erweitern**

Such nach `export type EinstellungenTab =`:

```ts
export type EinstellungenTab =
  | 'profil'
  | 'lernziele'
  | 'favoriten'
  | 'problemmeldungen'
  | 'uebungen'
  | 'admin'
  | 'kiKalibrierung'
  | 'fragensammlung'  // NEU
```

- [ ] **Step 11.2: Build grün**

Run: `cd ExamLab && npx tsc -b`
Expected: PASS (neue Variante noch nirgends genutzt, aber typ-safe)

### Task 12: FragensammlungTab-Komponente

**Files:**
- Create: `ExamLab/src/components/settings/fragensammlung/FragensammlungTab.tsx`

- [ ] **Step 12.1: Tab-Skelett**

```tsx
import { useState } from 'react'
import LueckentextBulkToggle from './LueckentextBulkToggle'

interface Props {
  email: string
  istAdmin: boolean
}

export default function FragensammlungTab({ email, istAdmin }: Props) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-2">Lückentext-Fragen</h2>
        <LueckentextBulkToggle email={email} istAdmin={istAdmin} />
      </section>

      {/* Platzhalter für künftige Sektionen:
          - Metadaten-Felder (Semester, Quartale, Anzahl Jahre, Gefässe)
          - Andere Fragetyp-Settings
      */}
    </div>
  )
}
```

- [ ] **Step 12.2: Tab in `EinstellungenPanel.tsx` registrieren**

In `EinstellungenPanel.tsx:55-63` Tab-Liste erweitern:

```tsx
{ key: 'fragensammlung', label: 'Fragensammlung', sichtbar: true },
```

Und im Render-Dispatch (`:94-113`):

```tsx
{tab === 'fragensammlung' && user?.email && (
  <FragensammlungTab email={user.email} istAdmin={admin} />
)}
```

Plus Import:

```tsx
import FragensammlungTab from './fragensammlung/FragensammlungTab'
```

### Task 13: LueckentextBulkToggle-Komponente

**Files:**
- Create: `ExamLab/src/components/settings/fragensammlung/LueckentextBulkToggle.tsx`
- Create: `ExamLab/src/services/fragensammlungApi.ts`

- [ ] **Step 13.1: API-Wrapper**

```ts
// ExamLab/src/services/fragensammlungApi.ts
import { postJson } from './apiClient'

async function unwrap<T>(result: { success?: boolean; data?: unknown } | null): Promise<T | null> {
  if (!result || typeof result !== 'object') return null
  if (result.success === false) return null
  if (result.data === undefined || result.data === null) return null
  return result.data as T
}

export interface LueckentextBulkResult {
  total: number
  geaendert: number
  alleBereits: boolean
}

export async function bulkSetzeLueckentextModus(
  email: string,
  modus: 'freitext' | 'dropdown'
): Promise<LueckentextBulkResult | null> {
  const r = await postJson<{ success: boolean; data?: LueckentextBulkResult }>(
    'bulkSetzeLueckentextModus',
    { email, modus }
  )
  return unwrap<LueckentextBulkResult>(r)
}
```

**Wichtig laut `code-quality.md`:** `postJson<FooType>` ist eine Lüge — immer `unwrap` nutzen, weil der Wrapper das ganze `{success, data}`-Objekt durchreicht.

- [ ] **Step 13.2: UI-Komponente**

```tsx
// ExamLab/src/components/settings/fragensammlung/LueckentextBulkToggle.tsx
import { useState } from 'react'
import { bulkSetzeLueckentextModus } from '../../../services/fragensammlungApi'

interface Props { email: string; istAdmin: boolean }

export default function LueckentextBulkToggle({ email, istAdmin }: Props) {
  const [loading, setLoading] = useState<'freitext' | 'dropdown' | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleBulk(modus: 'freitext' | 'dropdown') {
    const bestaetigung = window.confirm(
      `Alle Lückentext-Fragen auf „${modus === 'freitext' ? 'Freitext' : 'Dropdown'}"-Modus setzen?\n\nDies betrifft ALLE Fragen in der Fragensammlung (ca. 253). Aktion ist reversibel — du kannst jederzeit wieder umschalten.`
    )
    if (!bestaetigung) return

    setLoading(modus)
    setError(null)
    setResult(null)
    try {
      const r = await bulkSetzeLueckentextModus(email, modus)
      if (!r) throw new Error('Backend-Antwort ungültig')
      setResult(`${r.geaendert} von ${r.total} Fragen auf „${modus}" gesetzt${r.alleBereits ? ' (alle waren bereits im gewünschten Modus)' : ''}.`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(null)
    }
  }

  if (!istAdmin) {
    return <p className="text-sm text-slate-500">Diese Funktion ist nur für Admins verfügbar.</p>
  }

  return (
    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <p className="text-sm mb-3">
        Setzt den Antwort-Modus für <strong>alle</strong> Lückentext-Fragen. LP können pro Frage im Editor abweichen.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleBulk('freitext')}
          disabled={loading !== null}
          className="px-4 py-2 min-h-[44px] rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700"
        >
          {loading === 'freitext' ? 'Setze …' : 'Alle auf Freitext'}
        </button>
        <button
          type="button"
          onClick={() => handleBulk('dropdown')}
          disabled={loading !== null}
          className="px-4 py-2 min-h-[44px] rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700"
        >
          {loading === 'dropdown' ? 'Setze …' : 'Alle auf Dropdown'}
        </button>
      </div>
      {result && <p className="mt-3 text-sm text-green-700 dark:text-green-400">{result}</p>}
      {error && <p className="mt-3 text-sm text-red-700 dark:text-red-400">Fehler: {error}</p>}
    </div>
  )
}
```

- [ ] **Step 13.3: Test**

```tsx
// ExamLab/src/tests/FragensammlungTab.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LueckentextBulkToggle from '../components/settings/fragensammlung/LueckentextBulkToggle'
import * as api from '../services/fragensammlungApi'

describe('LueckentextBulkToggle', () => {
  beforeEach(() => { vi.restoreAllMocks() })

  it('zeigt Admin-Only-Hinweis wenn istAdmin=false', () => {
    render(<LueckentextBulkToggle email="x@y" istAdmin={false} />)
    expect(screen.getByText(/nur für Admins/i)).toBeInTheDocument()
  })

  it('ruft API mit modus=freitext auf nach Klick + Bestätigung', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const spy = vi.spyOn(api, 'bulkSetzeLueckentextModus').mockResolvedValue({ total: 253, geaendert: 253, alleBereits: false })
    render(<LueckentextBulkToggle email="admin@gym" istAdmin={true} />)
    fireEvent.click(screen.getByRole('button', { name: /Alle auf Freitext/i }))
    await waitFor(() => expect(spy).toHaveBeenCalledWith('admin@gym', 'freitext'))
    await waitFor(() => expect(screen.getByText(/253 von 253/)).toBeInTheDocument())
  })

  it('bricht ab wenn Bestätigung verneint', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const spy = vi.spyOn(api, 'bulkSetzeLueckentextModus')
    render(<LueckentextBulkToggle email="admin@gym" istAdmin={true} />)
    fireEvent.click(screen.getByRole('button', { name: /Alle auf Dropdown/i }))
    expect(spy).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 13.4: Tests grün**

Run: `cd ExamLab && npx vitest run src/tests/FragensammlungTab.test.tsx`
Expected: PASS (3/3)

### Task 14: Apps-Script Bulk-Endpoint

**Files:**
- Modify: `ExamLab/apps-script-code.js`

- [ ] **Step 14.1: Dispatcher-Case**

```js
case 'bulkSetzeLueckentextModus': {
  if (!istZugelasseneLP(body.email)) return jsonResponse({error:'Nicht autorisiert'})
  if (!istAdmin_(body.email)) return jsonResponse({error:'Admin-only'})
  return jsonResponse({ success: true, data: bulkSetzeLueckentextModus_(body) })
}
```

- [ ] **Step 14.2: Helper-Funktion**

```js
/**
 * Setzt lueckentextModus für ALLE Lückentext-Fragen in allen Tabs.
 * Idempotent — skippt Fragen die bereits im Ziel-Modus sind.
 * body.modus: 'freitext' | 'dropdown'
 */
function bulkSetzeLueckentextModus_(body) {
  var modus = body.modus
  if (modus !== 'freitext' && modus !== 'dropdown') throw new Error('Ungültiger Modus')
  var tabs = ['VWL', 'BWL', 'Recht', 'Informatik']
  var fragenbank = SpreadsheetApp.openById(FRAGENBANK_ID)
  var total = 0
  var geaendert = 0

  for (var t = 0; t < tabs.length; t++) {
    var sheet = fragenbank.getSheetByName(tabs[t])
    if (!sheet) continue
    var lastCol = sheet.getLastColumn()
    var lastRow = sheet.getLastRow()
    if (lastCol === 0 || lastRow < 2) continue
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
    var typCol = headers.indexOf('typ')
    var jsonCol = headers.indexOf('json')
    if (typCol < 0 || jsonCol < 0) continue
    var daten = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues()

    for (var i = 0; i < daten.length; i++) {
      if (daten[i][typCol] !== 'lueckentext') continue
      total++
      try {
        var typDaten = JSON.parse(daten[i][jsonCol] || '{}')
        if (typDaten.lueckentextModus === modus) continue  // schon im Ziel-Modus
        typDaten.lueckentextModus = modus
        sheet.getRange(i + 2, jsonCol + 1).setValue(JSON.stringify(typDaten))
        geaendert++
      } catch (e) { /* überspringen */ }
    }
  }
  return { total: total, geaendert: geaendert, alleBereits: geaendert === 0 }
}
```

- [ ] **Step 14.3: GAS-Test-Shim**

```js
function testBulkSetzeLueckentextModus_() {
  var r = bulkSetzeLueckentextModus_({ modus: 'freitext' })
  assert_(typeof r.total === 'number', 'Total muss Zahl sein')
  Logger.log('Bulk-Test: ' + JSON.stringify(r))
}
function testBulkSetzeLueckentextModus() { testBulkSetzeLueckentextModus_() }
```

- [ ] **Step 14.4: Deployen + Smoke-Test (vom User)**

Apps-Script-Editor → Code pasten (inkl. aller Endpoints aus Phase 4/5/6) → Bereitstellung erstellen → Test-Shim laufen lassen → Logs prüfen.

- [ ] **Step 14.5: Commit Frontend + Backend**

```bash
git add ExamLab/src/store/lpUIStore.ts \
  ExamLab/src/components/settings/EinstellungenPanel.tsx \
  ExamLab/src/components/settings/fragensammlung/ \
  ExamLab/src/services/fragensammlungApi.ts \
  ExamLab/src/tests/FragensammlungTab.test.tsx \
  ExamLab/apps-script-code.js
git commit -m "ExamLab: Settings-Tab Fragensammlung + Lückentext-Bulk-Toggle (Frontend+Apps-Script)"
```

---

## Phase 7 — KI-Batch-Migration (analog C9 Phase 4)

**Ziel:** Alle 253 Lückentext-Fragen bekommen via KI neu befüllte `korrekteAntworten` (Hauptantwort + 2-3 Synonyme) und `dropdownOptionen` (5 Stück: 1 Korrekte + 4 Distraktoren). `pruefungstauglich=false` bis LP freigibt.

**Struktur analog C9 Phase 4** (siehe `ExamLab/scripts/migrate-teilerklaerungen/`):
- `dump.mjs` — lädt Fragen aus Apps-Script
- `review-generator.mjs` — generiert Markdown-Review pro Batch
- `upload.mjs` — ruft `batchUpdateLueckentextMigration`-Endpoint

**Files:**
- Create: `ExamLab/scripts/migrate-lueckentext-antworten/dump.mjs`
- Create: `ExamLab/scripts/migrate-lueckentext-antworten/prompt-template.md`
- Create: `ExamLab/scripts/migrate-lueckentext-antworten/normalizer.mjs`
- Create: `ExamLab/scripts/migrate-lueckentext-antworten/review-generator.mjs`
- Create: `ExamLab/scripts/migrate-lueckentext-antworten/upload.mjs`
- Create: `ExamLab/scripts/migrate-lueckentext-antworten/README.md`
- Create: `ExamLab/scripts/migrate-lueckentext-antworten/SESSION-PROTOCOL.md`
- Create: `ExamLab/scripts/migrate-lueckentext-antworten/package.json`

### Task 15: Dump-Skript

**Files:**
- Create: `ExamLab/scripts/migrate-lueckentext-antworten/dump.mjs`

**Hinweis zum Endpoint `holeAlleFragenFuerMigration`:** bereits in C9 Phase 4 (S136) erstellt, siehe `ExamLab/apps-script-code.js` Zeile ~11252 (`holeAlleFragenFuerMigrationEndpoint`). Erwartet: liefert `data.fragen` mit komplettem Frage-Objekt inkl. `luecken[].id`. **Verifikations-Schritt vor Batch:** mit `curl` oder Browser-Fetch eine Lückentext-Frage laden, prüfen dass `luecken[]` vollständig und mit IDs versehen kommt. Falls Felder fehlen: C9-Endpoint erweitern (kleine Modifikation, nicht neu erstellen).

- [ ] **Step 15.1: Dump-Skript**

```js
#!/usr/bin/env node
// dump.mjs — lädt alle Lückentext-Fragen aus der Fragenbank via Apps-Script
// Nutzt bestehenden C9-Endpoint 'holeAlleFragenFuerMigration'
// Env: APPS_SCRIPT_URL, MIGRATION_EMAIL

import fs from 'node:fs/promises'

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL
const EMAIL = process.env.MIGRATION_EMAIL
if (!APPS_SCRIPT_URL || !EMAIL) {
  console.error('Env fehlt: APPS_SCRIPT_URL + MIGRATION_EMAIL')
  process.exit(1)
}

async function postAction(action, payload) {
  const r = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action, ...payload }),
    redirect: 'follow',
  })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

const resp = await postAction('holeAlleFragenFuerMigration', { email: EMAIL })
if (resp.error) { console.error('Error:', resp.error); process.exit(1) }
const alleFragen = resp.data?.fragen ?? []
const lueckentextFragen = alleFragen.filter(f => f.typ === 'lueckentext')

console.log(`Total: ${alleFragen.length} · Lückentext: ${lueckentextFragen.length}`)

await fs.writeFile(
  new URL('./fragen-dump.json', import.meta.url),
  JSON.stringify(lueckentextFragen, null, 2)
)
console.log('→ fragen-dump.json geschrieben')
```

### Task 16: Prompt-Template

**Files:**
- Create: `ExamLab/scripts/migrate-lueckentext-antworten/prompt-template.md`

- [ ] **Step 16.1: Prompt-Template**

```markdown
# Lückentext-Migrations-Prompt

Du bist Experte für Wirtschaft & Recht auf Gymnasial-Niveau (Schweiz, Gymnasium Hofwil, Deutschsprachig). Lehrplan 17, Kanton Bern, Taxonomie K1-K6.

Für jede der folgenden Lückentext-Fragen: generiere pro Lücke

1. `korrekteAntworten`: Hauptantwort + 2-3 Synonyme / Schreibvarianten (Schweizer vs. deutsche Schreibweise, Umlaute ae/ä beide Varianten, Kurz-/Langform). Die Hauptantwort ist das erste Element. Alle Varianten müssen 100 % korrekt sein.

2. `dropdownOptionen`: **Genau 5** Einträge = 1 Korrekte (die Hauptantwort aus korrekteAntworten[0]) + 4 Distraktoren aus dem gleichen semantischen Feld. **Keine Synonyme der Korrekten** — die Distraktoren müssen eigenständige, plausible, aber falsche Begriffe sein.

## Regeln

- Distraktoren: plausibel, aus dem gleichen Thema, sollten einen Lernenden ohne Wissen verwirren, aber einen Kundigen nicht irreführen. Keine absurden / thematisch fremden Wörter.
- KEINE Meta-Hinweise wie „nichts davon" oder „alle richtig".
- Zahlen/Jahreszahlen/Artikelnummern: Distraktoren sind naheliegende falsche Werte.
- Fachbegriffe: Hauptantwort in der Schweizer Schreibweise (z.B. „Kontrollpflicht", nicht „Controlling-Pflicht").

## Input (pro Frage)

\`\`\`json
{
  "id": "<uuid>",
  "fachbereich": "VWL|BWL|Recht",
  "thema": "<z.B. BWL2.3>",
  "bloom": "K1-K6",
  "fragetext": "<optional>",
  "textMitLuecken": "<Text mit {{0}} / {{1}} Platzhaltern>",
  "luecken": [{ "id": "<luecken-id>", "caseSensitive": false }]
}
\`\`\`

## Output (pro Frage)

\`\`\`json
{
  "id": "<uuid>",
  "fachbereich": "<unchanged>",
  "luecken": [
    {
      "id": "<luecken-id>",
      "korrekteAntworten": ["Hauptantwort", "Synonym1", "Synonym2"],
      "dropdownOptionen": ["Hauptantwort", "Distraktor1", "Distraktor2", "Distraktor3", "Distraktor4"]
    }
  ]
}
\`\`\`

Liefere ein JSON-Array mit einem Objekt pro Eingabe-Frage. Keine Kommentare. Keine Fliesstext-Einleitung.
```

### Task 17: Claude-Batch-Workflow

**Ansatz analog C9 Phase 4:** keine Anthropic-SDK-Dependency. User startet eine neue Claude-Code-Session pro Batch (~30–100 Fragen), paste-t den Prompt + die Fragen aus `fragen-dump.json`, Claude antwortet mit JSON-Array, User speichert das Array als `batch-sN.json`.

- [ ] **Step 17.1: Stichprobe ziehen**

```bash
# Pick 15 Fragen: 5 VWL + 5 BWL + 5 Recht
node -e "
const f = require('./fragen-dump.json');
const pickN = (arr, n) => arr.sort(() => Math.random() - 0.5).slice(0, n);
const pickF = (fach) => pickN(f.filter(x => x.fachbereich === fach), 5);
const sample = [...pickF('VWL'), ...pickF('BWL'), ...pickF('Recht')];
require('fs').writeFileSync('./stichprobe.json', JSON.stringify(sample, null, 2));
console.log('Stichprobe:', sample.length);
"
```

(Oder Helper-Script `pick-stichprobe.mjs` analog zu C9 schreiben.)

- [ ] **Step 17.2: Stichprobe via Claude Code verarbeiten**

User: neue Claude-Code-Session, paste-t `prompt-template.md` + `stichprobe.json`. Claude antwortet mit JSON-Array. User speichert als `stichprobe-response.json`.

- [ ] **Step 17.3: Review-Markdown generieren**

Skript `review-generator.mjs` baut Markdown mit pro Frage:
- Fragetext + textMitLuecken
- Pro Lücke: korrekteAntworten + dropdownOptionen
- Platz für LP-Kommentar („OK" / „Ablehnen: <Grund>")

```js
// review-generator.mjs
import fs from 'node:fs/promises'
const input = JSON.parse(await fs.readFile('./stichprobe.json', 'utf-8'))
const response = JSON.parse(await fs.readFile('./stichprobe-response.json', 'utf-8'))
const responseMap = Object.fromEntries(response.map(r => [r.id, r]))

let md = '# Lückentext-Migration — Stichprobe-Review\n\n'
md += 'Freigabe: __________ / __________ (Datum)\n\n---\n\n'
for (const frage of input) {
  const r = responseMap[frage.id]
  md += `## ${frage.id} · ${frage.fachbereich} · ${frage.thema || '—'}\n\n`
  md += `**Text:** ${frage.textMitLuecken}\n\n`
  if (!r) { md += '⚠️ KEINE RESPONSE\n\n---\n\n'; continue }
  for (const l of r.luecken) {
    md += `### Lücke \`${l.id}\`\n`
    md += `- **Akzeptiert (Freitext):** ${l.korrekteAntworten.join(' · ')}\n`
    md += `- **Dropdown (5):** ${l.dropdownOptionen.join(' · ')}\n\n`
  }
  md += '**Review:** [ ] OK  [ ] Ablehnen — Grund: ___________\n\n---\n\n'
}
await fs.writeFile('./stichprobe-review.md', md)
console.log('→ stichprobe-review.md geschrieben')
```

- [ ] **Step 17.4: LP reviewt Stichprobe**

LP öffnet `stichprobe-review.md`, prüft die 15 Fragen, markiert OK/Ablehnen. Bei >2 Ablehnungen: Prompt iterieren, Stichprobe neu laufen lassen.

- [ ] **Step 17.5: Full-Run**

Nach Freigabe der Stichprobe: alle 253 Fragen in Batches à ~30-50 verarbeiten (je nachdem wie gut Claude im Context bleibt). Analog zu C9: `generate-sN.mjs` pro Batch (aber manuell via Claude Code, nicht SDK).

Upload-Skript siehe Task 18.

### Task 18: Upload-Skript

**Files:**
- Create: `ExamLab/scripts/migrate-lueckentext-antworten/upload.mjs`

- [ ] **Step 18.1: Upload-Skript**

```js
#!/usr/bin/env node
// upload.mjs — pusht Batch-Updates an batchUpdateLueckentextMigration
// Usage: node upload.mjs batch-s1.json

import fs from 'node:fs/promises'

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL
const EMAIL = process.env.MIGRATION_EMAIL
const file = process.argv[2]
if (!APPS_SCRIPT_URL || !EMAIL || !file) {
  console.error('Usage: APPS_SCRIPT_URL=… MIGRATION_EMAIL=… node upload.mjs <batch.json>')
  process.exit(1)
}

const batch = JSON.parse(await fs.readFile(file, 'utf-8'))
console.log(`Upload ${batch.length} Fragen aus ${file} …`)

// Adaptive Batch-Size: falls Apps-Script >30s timeoutet, in Hälften splitten
async function upload(items) {
  const r = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'batchUpdateLueckentextMigration', email: EMAIL, updates: items }),
    redirect: 'follow',
  })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const resp = await r.json()
  if (resp.error) throw new Error(resp.error)
  return resp.results || []
}

try {
  const results = await upload(batch)
  const ok = results.filter(r => r.success).length
  const err = results.filter(r => r.error)
  console.log(`✓ ${ok}/${results.length} erfolgreich`)
  if (err.length) console.log('Fehler:', JSON.stringify(err, null, 2))
} catch (e) {
  console.error('Upload fehlgeschlagen:', e.message)
  if (batch.length > 10) {
    console.log('→ retry mit kleineren Batches …')
    const half = Math.floor(batch.length / 2)
    await fs.writeFile(file.replace('.json', '-a.json'), JSON.stringify(batch.slice(0, half), null, 2))
    await fs.writeFile(file.replace('.json', '-b.json'), JSON.stringify(batch.slice(half), null, 2))
    console.log(`  → ${file.replace('.json','-a.json')} (${half})`)
    console.log(`  → ${file.replace('.json','-b.json')} (${batch.length - half})`)
  }
  process.exit(1)
}
```

- [ ] **Step 18.2: Package.json**

```json
{
  "name": "migrate-lueckentext-antworten",
  "type": "module",
  "private": true,
  "scripts": {
    "dump": "node dump.mjs",
    "review": "node review-generator.mjs",
    "upload": "node upload.mjs"
  }
}
```

- [ ] **Step 18.3: README + SESSION-PROTOCOL**

Analog zu `ExamLab/scripts/migrate-teilerklaerungen/README.md` + `SESSION-PROTOCOL.md`: Step-by-step Anleitung für User.

- [ ] **Step 18.4: Commit**

```bash
git add ExamLab/scripts/migrate-lueckentext-antworten/
git commit -m "ExamLab: KI-Batch-Migration Skripte (Dump/Prompt/Upload/Review)"
```

### Task 19: KI-Batch ausführen (User-Task)

- [ ] **Step 19.1: Google-Sheets-Backup erstellen** (manuell)

- [ ] **Step 19.2: Dump ausführen**

```bash
cd ExamLab/scripts/migrate-lueckentext-antworten
APPS_SCRIPT_URL=... MIGRATION_EMAIL=... node dump.mjs
```

Erwartet: `fragen-dump.json` mit ~253 Einträgen.

- [ ] **Step 19.3: Stichprobe ziehen + via Claude Code verarbeiten**

- [ ] **Step 19.4: Stichprobe-Review durch LP**

- [ ] **Step 19.5: Bei Freigabe: Full-Run in Batches à ~30-50**

- [ ] **Step 19.6: Upload pro Batch**

```bash
node upload.mjs batch-s1.json
node upload.mjs batch-s2.json
...
```

- [ ] **Step 19.7: Vollständigkeits-Check**

```bash
# Im GAS-Editor: zaehleLeereLueckentextAntworten erneut ausführen
# Erwartet: 0 / 253 betroffene Fragen
```

---

## Phase 8 — E2E-Test + Freigabe + Merge

**Ziel:** LP testet im Browser mit echten Logins (kein Demo-Modus), bestätigt Freigabe, HANDOFF.md wird aktualisiert, Merge zu main.

### Task 20: Test-Plan schreiben (laut `regression-prevention.md` Phase 3.0)

- [ ] **Step 20.1: Test-Plan-Tabelle**

```markdown
## Test-Plan — Lückentext-Modus + Migration

### Zu testende Aenderungen

| # | Aenderung | Erwartetes Verhalten | Regressions-Risiko |
|---|-----------|---------------------|-------------------|
| 1 | Modus-Toggle im Editor | Toggle schaltet sichtbar zw. Freitext/Dropdown, inaktives Feld gedimmt | Editor könnte bei Toggle-Klick State verlieren (useState-Init-Regel prüfen) |
| 2 | SuS-Render Freitext | Input-Feld statt Select | Dropdown-Legacy-Fragen ohne Modus → Normalizer Default |
| 3 | SuS-Render Dropdown | Select mit 5 Optionen, gemischt | Autokorrektur matched gegen korrekteAntworten[0] |
| 4 | Autokorrektur | Beide Modi: erzielt/max korrekt | FiBu-Fragen nicht beeinträchtigen |
| 5 | Settings-Bulk-Toggle | 1-Klick ändert alle 253 Fragen | Nur Admin sieht Button |
| 6 | KI-migrierte Fragen | Neu befüllte korrekteAntworten + dropdownOptionen im Sheet | pruefungstauglich=false nach Migration |

### Security-Check für diese Änderung
- [ ] SuS-Response enthält `lueckentextModus` (Rendering) ABER NICHT `korrekteAntworten`/`dropdownOptionen`
- [ ] Bulk-Toggle-Endpoint ist Admin-only (Nicht-Admin kriegt 403)
- [ ] batchUpdateLueckentextMigration ist Admin-only
- [ ] pruefungstauglich=false nach KI-Batch (SuS kann migrierte Fragen erst sehen nach LP-Freigabe)

### Betroffene kritische Pfade (aus regression-prevention.md)
- [ ] Pfad 1: SuS lädt Prüfung mit Lückentext-Frage
- [ ] Pfad 5: LP Korrektur + Auto-Korrektur bei Lückentext

### Regressions-Tests (verwandte Funktionen)
- [ ] Mischung-Fragen mit `mischung.lueckentext`-Teil
- [ ] Lückentext in Pool-Import
- [ ] Lückentext-Bearbeitung in Prüfung/Üben/Fragensammlung-Editoren (3 Editor-Einstiegspunkte, gleiche Shared-Komponente)
```

### Task 21: Browser-Test (vom User)

- [ ] **Step 21.1: Tab-Gruppe erstellen, User loggt LP + SuS ein**

- [ ] **Step 21.2: LP-Pfad**
  1. Einstellungen → Fragensammlung → Bulk-Toggle „Alle auf Dropdown"
  2. Fragensammlung-Editor → Lückentext-Frage öffnen → Toggle sehen, klicken
  3. Prüfung erstellen mit 2-3 Lückentext-Fragen (je 1× Freitext + 1× Dropdown)
  4. Lobby → Test-SuS hinzufügen → Live
- [ ] **Step 21.3: SuS-Pfad**
  1. Prüfung öffnen → Lückentext-Freitext: Input-Feld, Synonyme akzeptiert
  2. Lückentext-Dropdown: 5 Optionen, 1 Korrekte + 4 Distraktoren
  3. Abgabe
- [ ] **Step 21.4: LP-Korrektur**
  1. Auto-Korrektur: erzielt/max korrekt für beide Modi
  2. Manuelle Korrektur: Freitext-Lösung zeigt korrekteAntworten, Dropdown-Lösung zeigt die korrekte Option

### Task 22: Freigabe + Merge

- [ ] **Step 22.1: LP schreibt Freigabe**

- [ ] **Step 22.2: HANDOFF.md aktualisieren**

- [ ] **Step 22.3: Merge**

```bash
git checkout main
git merge fix/lueckentext-editor
git push origin main
```

- [ ] **Step 22.4: Branch aufräumen**

```bash
git branch -d fix/lueckentext-editor
git push origin --delete fix/lueckentext-editor
```

- [ ] **Step 22.5: Memory-File aktualisieren**

`~/.claude/projects/.../memory/project_s142_bildeditor_lueckentext.md` → Status: „S142→S143: Lückentext-Modus + Migration komplett auf main, Commit `<sha>`".

---

## Risiken + Mitigation

| Risiko | Mitigation |
|--------|------------|
| KI halluziniert Distraktoren, die faktisch korrekt sind | Stichprobe-Review durch LP; Normalizer im Upload-Skript prüft nicht-leer-Arrays + 5-Items-Regel |
| Existierende Dropdown-Fragen (2 Recht) verlieren manuell gepflegte Inhalte | Explizit gewollt (User-Entscheidung); Sheet-Backup vor KI-Batch |
| Modus-Toggle im Editor crasht bei bestehenden Fragen ohne Feld | Normalizer setzt Default beim Mount; fallback auf 'freitext' |
| Bulk-Toggle löst Regressionen für nicht-Lückentext-Fragen aus | Helper filtert strikt auf `typ === 'lueckentext'` |
| Apps-Script-Endpoint-Timeout bei Batch >50 | Adaptive Batch-Size im upload.mjs (Split bei Fehler) |
| SuS sieht Auto-Korrektur-Hinweise die Lösung verraten | `bereinigeFrageFuerSuS_`-Test (Task 7.3) stellt sicher dass korrekteAntworten + dropdownOptionen entfernt sind |
| KI-Batch überschreibt manuelle LP-Edits während Migration läuft | Klares Kommunikations-Fenster: keine Pflege während Batch-Run. Backup vor Batch. |

## Post-Merge

- Nach Merge: `pruefungstauglich=false` für alle 253 migrierten Fragen. LP geht durch die Fragensammlung, prüft je Frage, schaltet `pruefungstauglich=true` via Editor.
- Cooling-Off-Periode: keine weiteren grossen Umbauten an Lückentext für 2-4 Wochen, Beobachtung auf Bug-Reports.
- Ausblick (out-of-scope dieses Plans): Fragensammlung-Tab um Metadaten-Settings erweitern (Semester, Quartale, Anzahl Jahre, Gefässe). Eigener Plan.
