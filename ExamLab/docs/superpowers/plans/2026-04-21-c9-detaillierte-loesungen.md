# C9 — Detaillierte Lösungen pro Teilantwort — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** SuS im Übungsmodus sehen pro Teilantwort visuell, was sie richtig/falsch gemacht haben, mit korrekter Alternative und optionaler KI-Erklärung. Derselbe Renderer ersetzt die LP-Prüfungskorrektur-Ansicht.

**Architecture:** Jede Fragetyp-Komponente erhält Prop `modus: 'aufgabe' | 'loesung'`. Drei neue Shared Primitives (`AntwortZeile`, `MusterloesungsBlock`, `ZoneLabel`). Neue optionale `erklaerung`-Felder am Sub-Element pro Fragetyp. `generiereMusterloesung` (Apps-Script) wird erweitert, liefert Musterlösung + strukturierte Teilerklärungen in einem Call. Einmaliges Node-Migrations-Skript generiert Teilerklärungen für ~2400 bestehende Fragen mit Resume-Fähigkeit.

**Tech Stack:** React 19 + TypeScript + Vite + Zustand + Tailwind v4 · Apps Script · Vitest · `@anthropic-ai/sdk` (lokales Migrations-Skript)

**Spec:** `ExamLab/docs/superpowers/specs/2026-04-21-c9-detaillierte-loesungen-design.md`
**Referenz-Mockup:** `.superpowers/brainstorm/c9-loesungen/fragetypen-mockup-v6.html`
**Branch:** `feature/c9-detaillierte-loesungen` (neu)

---

## Konventionen

- **Alle Commits** auf Branch `feature/c9-detaillierte-loesungen`, nicht `main`. Erst merge nach User-Freigabe via Staging-E2E (siehe [.claude/rules/regression-prevention.md](.claude/rules/regression-prevention.md)).
- **TDD wo möglich:** TypeScript via `vitest`. Apps-Script via manuelle Tests im GAS-Editor + Staging-E2E.
- **Pre-Commit jeder Task:** `cd ExamLab && npx tsc -b && npx vitest run` grün (Baseline: 466/466).
- **Apps-Script-Deploy:** manuell durch User nach Backend-Änderungen. Plan markiert deploy-bedürftige Tasks.
- **Defensive Normalizer-Regel** ([.claude/rules/code-quality.md](.claude/rules/code-quality.md)): neue Felder beim Parsen normalisieren (`Array.isArray`-Guards).
- **Whitelist-Regel** (S125): jeder neue `erklaerung`-Feldname muss in `getTypDaten_` aufgenommen werden, sonst zerstört jedes LP-Save die Daten.
- **Skills:** @superpowers:test-driven-development für Komponenten, @superpowers:verification-before-completion vor Commits.

---

## File Structure

```
ExamLab/
├── src/
│   ├── types/
│   │   └── fragen.ts                                         # MODIFY: erklaerung-Felder auf 6 Sub-Types
│   ├── shared/ui/
│   │   ├── AntwortZeile.tsx                                  # NEW
│   │   ├── AntwortZeile.test.tsx                             # NEW
│   │   ├── MusterloesungsBlock.tsx                           # NEW
│   │   ├── MusterloesungsBlock.test.tsx                      # NEW
│   │   ├── ZoneLabel.tsx                                     # NEW
│   │   └── ZoneLabel.test.tsx                                # NEW
│   ├── components/fragetypen/
│   │   ├── MCFrage.tsx                                       # MODIFY: modus-prop + Lösungs-Rendering
│   │   ├── RichtigFalschFrage.tsx                            # MODIFY
│   │   ├── ZuordnungFrage.tsx                                # MODIFY
│   │   ├── LueckentextFrage.tsx                              # MODIFY
│   │   ├── HotspotFrage.tsx                                  # MODIFY
│   │   ├── BildbeschriftungFrage.tsx                         # MODIFY
│   │   ├── DragDropBildFrage.tsx                             # MODIFY
│   │   ├── SortierungFrage.tsx                               # MODIFY
│   │   ├── KontenbestimmungFrage.tsx                         # MODIFY
│   │   ├── BuchungssatzFrage.tsx                             # MODIFY
│   │   ├── TKontoFrage.tsx                                   # MODIFY
│   │   ├── BilanzERFrage.tsx                                 # MODIFY
│   │   ├── FreitextFrage.tsx                                 # MODIFY (Ganzantwort-Version)
│   │   └── BerechnungFrage.tsx                               # MODIFY (wie Freitext)
│   ├── components/editor/
│   │   └── KIMusterloesungPreview.tsx                        # NEW: Preview-Panel für KI-Ausgabe
│   ├── components/lp/korrektur/
│   │   ├── KorrekturFrageVollansicht.tsx                     # MODIFY: auf modus='loesung' umschalten
│   │   └── KorrekturFrageZeile.tsx                           # MODIFY
│   └── services/
│       └── kiAssistentApi.ts                                 # MODIFY: Response-Schema erweitern
├── apps-script-code.js                                        # MODIFY:
│                                                              #   - getTypDaten_-Whitelist erweitern
│                                                              #   - generiereMusterloesung Prompt + Schema
│                                                              #   - bereinigeFrageFuerSuS_ für Prüfen-SuS
│                                                              # KEEPS: bereinigeFrageFuerSuSUeben_ lässt erklaerung drin
├── scripts/migrate-teilerklaerungen/                          # NEW
│   ├── migrate.mjs
│   ├── prompts.mjs
│   ├── package.json
│   └── README.md
└── docs/superpowers/
    └── specs/2026-04-21-c9-detaillierte-loesungen-design.md  # EXISTING
```

---

## Phase 1 — Foundation: Datenmodell + Shared Primitives

Zielzustand: `erklaerung`-Felder im TS-Datenmodell + Apps-Script-Whitelist + 3 neue Shared-Komponenten mit Tests. Noch keine Fragetyp-Komponente verändert.

### Task 1 — Branch setup + Baseline

**Files:** keine

- [ ] **Step 1.1: Branch erstellen**

```bash
cd "/Users/durandbourjate/Documents/-Gym Hofwil/00 Automatisierung Unterricht/10 Github/GYM-WR-DUY"
git checkout main
git pull
git checkout -b feature/c9-detaillierte-loesungen
```

- [ ] **Step 1.2: Baseline verifizieren**

```bash
cd ExamLab
npx tsc -b
npx vitest run
```

Expected: tsc 0 errors, vitest 466/466 pass.

---

### Task 2 — TS-Types: `erklaerung`-Felder

**Files:**
- Modify: `ExamLab/src/types/fragen.ts`

- [ ] **Step 2.1: Erklärungs-Felder an allen Sub-Elementen ergänzen**

Öffne `ExamLab/src/types/fragen.ts`. Füge `erklaerung?: string` auf folgenden Interfaces hinzu (alle existieren, nur das Feld fehlt — MC und R/F haben es schon):

- `ZuordnungPaar`
- `Luecke`
- `HotspotBereich`
- `DragDropBildZielzone`
- `BildbeschriftungZone` (oder wie das Sub-Interface heute heisst — grep nach `BildbeschriftungFrage`-Sub-Struktur)
- `SortierungItem`
- `KontenbestimmungKonto`
- `Buchungssatz` (Sub-Element im Buchungssatz-Array)
- `BilanzERPosten`

Pattern konsistent halten:
```ts
export interface XYZ {
  // … existierende Felder …
  erklaerung?: string;   // Teilerklärung pro Sub-Element (C9)
}
```

- [ ] **Step 2.2: tsc grün**

```bash
cd ExamLab && npx tsc -b
```

Expected: 0 errors.

- [ ] **Step 2.3: Commit**

```bash
git add ExamLab/src/types/fragen.ts
git commit -m "C9: erklaerung-Felder an Fragetyp-Sub-Elementen hinzufuegen (Datenmodell)"
```

---

### Task 3 — Apps-Script: Whitelist erweitern

**Files:**
- Modify: `ExamLab/apps-script-code.js` (Funktion `getTypDaten_`)

**Kontext:** S125 Bug-Wiederholung vermeiden. `getTypDaten_` definiert, welche Felder beim Fragen-Save persistiert werden. Fehlt `erklaerung`, wird das Feld bei jedem LP-Save abgeschnitten.

- [ ] **Step 3.1: Whitelist für jedes Sub-Array erweitern**

Finde in `apps-script-code.js` die `getTypDaten_`-Funktion. Sie verzweigt nach Fragetyp und baut jeweils eine Whitelist der Sub-Elemente (z.B. `{id, text, korrekt, erklaerung}` für MC).

Erweitere die Whitelist pro Fragetyp um `erklaerung`:
- MC: `optionen` (bereits da — nur prüfen)
- R/F: `aussagen` (bereits da — nur prüfen)
- Zuordnung: `paare`
- Lückentext: `luecken`
- Hotspot: `bereiche`
- DragDrop-Bild: `zielzonen`
- Bildbeschriftung: `beschriftungen`/`labels` (je nach bestehender Benennung im Code)
- Sortierung: `items`
- Kontenbestimmung: `konten`
- Buchungssatz/TKonto: `buchungen`
- Bilanz/ER: `posten`

Verwende das `setIfPresent`-Pattern analog bestehender Whitelist.

- [ ] **Step 3.2: Manuelle Apps-Script-Validierung**

User deployt nach Änderung. In GAS-Editor:
```js
// Test: erstelle Frage mit erklaerung, speichere, lade zurück — erklaerung muss erhalten sein
var test = { id: 'test-1', typ: 'mc', optionen: [{id:'a', text:'t', korrekt:true, erklaerung:'Test'}] };
var saved = getTypDaten_(test);
Logger.log(JSON.stringify(saved));  // optionen[0].erklaerung muss 'Test' sein
```

- [ ] **Step 3.3: Commit + Deploy-Notiz**

```bash
git add ExamLab/apps-script-code.js
git commit -m "C9: getTypDaten_-Whitelist um erklaerung-Feld erweitert (S125-Schutz)"
```

⚠️ **User muss Apps-Script neu deployen nach diesem Task.**

---

### Task 4 — Shared Primitive: `AntwortZeile`

**Files:**
- Create: `ExamLab/src/shared/ui/AntwortZeile.tsx`
- Test: `ExamLab/src/shared/ui/AntwortZeile.test.tsx`

- [ ] **Step 4.1: Test schreiben (failing)**

`ExamLab/src/shared/ui/AntwortZeile.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AntwortZeile } from './AntwortZeile'

describe('AntwortZeile', () => {
  it('rendert ja-Marker als grünes ✓', () => {
    const { container } = render(<AntwortZeile marker="ja" variant="korrekt" label="Option A" />)
    expect(screen.getByText('✓')).toBeInTheDocument()
    expect(container.querySelector('.marker-ja')).toBeInTheDocument()
  })
  it('rendert nein-Marker als rotes ✗', () => {
    render(<AntwortZeile marker="nein" variant="falsch" label="Option A" />)
    expect(screen.getByText('✗')).toBeInTheDocument()
  })
  it('leer-Marker rendert keinen Marker-Text aber nimmt Platz ein', () => {
    const { container } = render(<AntwortZeile marker="leer" variant="neutral" label="L" />)
    expect(screen.queryByText('✓')).not.toBeInTheDocument()
    expect(screen.queryByText('✗')).not.toBeInTheDocument()
    expect(container.querySelector('.marker-leer')).toBeInTheDocument()
  })
  it('zeigt KI-Erklärung wenn vorhanden', () => {
    render(<AntwortZeile marker="ja" variant="korrekt" label="L" erklaerung="Weil X" />)
    expect(screen.getByText(/Weil X/)).toBeInTheDocument()
  })
  it('rendert Zusatz-Slot (z.B. korrekte Alternative)', () => {
    render(<AntwortZeile marker="nein" variant="falsch" label="L" zusatz={<span>→ Korrekt: Y</span>} />)
    expect(screen.getByText(/Korrekt: Y/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 4.2: Test fails**

```bash
cd ExamLab && npx vitest run src/shared/ui/AntwortZeile.test.tsx
```
Expected: FAIL, module not found.

- [ ] **Step 4.3: Komponente implementieren**

`ExamLab/src/shared/ui/AntwortZeile.tsx`:

```tsx
import { ReactNode } from 'react'

type AntwortZeileProps = {
  marker: 'ja' | 'nein' | 'leer'
  variant: 'korrekt' | 'falsch' | 'neutral'
  label: ReactNode
  erklaerung?: string
  zusatz?: ReactNode
}

const VARIANT_CLASSES: Record<AntwortZeileProps['variant'], string> = {
  korrekt: 'border-green-600 bg-green-50 dark:bg-green-950/20',
  falsch: 'border-red-600 bg-red-50 dark:bg-red-950/20',
  neutral: 'border-slate-200 dark:border-slate-700',
}

const MARKER_TEXT: Record<AntwortZeileProps['marker'], string> = {
  ja: '✓',
  nein: '✗',
  leer: '',
}

const MARKER_COLOR: Record<AntwortZeileProps['marker'], string> = {
  ja: 'text-green-600',
  nein: 'text-red-600',
  leer: '',
}

export function AntwortZeile({ marker, variant, label, erklaerung, zusatz }: AntwortZeileProps) {
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border px-3 py-2 my-1.5 ${VARIANT_CLASSES[variant]}`}
      data-testid="antwort-zeile"
    >
      <span
        className={`marker-${marker} ${MARKER_COLOR[marker]} font-bold w-5 text-center shrink-0`}
        aria-hidden
      >
        {MARKER_TEXT[marker]}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-medium">{label}</div>
        {zusatz && <div className="text-sm">{zusatz}</div>}
        {erklaerung && (
          <div className="mt-1.5 pl-2.5 border-l-2 border-slate-300 dark:border-slate-600 text-xs italic text-slate-600 dark:text-slate-400">
            💡 {erklaerung}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4.4: Test grün**

```bash
cd ExamLab && npx vitest run src/shared/ui/AntwortZeile.test.tsx
```
Expected: PASS (5 tests).

- [ ] **Step 4.5: Commit**

```bash
git add ExamLab/src/shared/ui/AntwortZeile.tsx ExamLab/src/shared/ui/AntwortZeile.test.tsx
git commit -m "C9: AntwortZeile Shared Primitive (MC/RF/Freitext-Zeile mit Marker + Erklaerung)"
```

---

### Task 5 — Shared Primitive: `MusterloesungsBlock`

**Files:**
- Create: `ExamLab/src/shared/ui/MusterloesungsBlock.tsx`
- Test: `ExamLab/src/shared/ui/MusterloesungsBlock.test.tsx`

- [ ] **Step 5.1: Test schreiben**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MusterloesungsBlock } from './MusterloesungsBlock'

describe('MusterloesungsBlock', () => {
  it('rendert mit korrekt-Styling', () => {
    const { container } = render(
      <MusterloesungsBlock variant="korrekt"><p>Erklärung</p></MusterloesungsBlock>
    )
    expect(container.querySelector('.border-green-600')).toBeInTheDocument()
    expect(screen.getByText('Erklärung')).toBeInTheDocument()
  })
  it('rendert mit falsch-Styling', () => {
    const { container } = render(
      <MusterloesungsBlock variant="falsch"><p>Text</p></MusterloesungsBlock>
    )
    expect(container.querySelector('.border-red-600')).toBeInTheDocument()
  })
  it('nutzt default-Label wenn kein label-Prop', () => {
    render(<MusterloesungsBlock variant="korrekt"><p>X</p></MusterloesungsBlock>)
    expect(screen.getByText(/Richtig beantwortet/i)).toBeInTheDocument()
  })
  it('nutzt custom label', () => {
    render(<MusterloesungsBlock variant="falsch" label="Nicht ganz"><p>X</p></MusterloesungsBlock>)
    expect(screen.getByText(/Nicht ganz/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 5.2: Test fails**

- [ ] **Step 5.3: Komponente implementieren**

```tsx
import { ReactNode } from 'react'

type Props = {
  variant: 'korrekt' | 'falsch'
  label?: string
  children: ReactNode
}

const DEFAULT_LABEL = {
  korrekt: 'Richtig beantwortet',
  falsch: 'Nicht ganz — Zusammenhang',
}

export function MusterloesungsBlock({ variant, label, children }: Props) {
  const borderClass = variant === 'korrekt' ? 'border-green-600 bg-green-50 dark:bg-green-950/20' : 'border-red-600 bg-red-50 dark:bg-red-950/20'
  const labelColor = variant === 'korrekt' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
  return (
    <div className={`mt-4 p-4 rounded-lg border ${borderClass}`}>
      <div className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>
        {label ?? DEFAULT_LABEL[variant]}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  )
}
```

- [ ] **Step 5.4: Test grün**

- [ ] **Step 5.5: Commit**

```bash
git add ExamLab/src/shared/ui/MusterloesungsBlock.tsx ExamLab/src/shared/ui/MusterloesungsBlock.test.tsx
git commit -m "C9: MusterloesungsBlock Shared Primitive"
```

---

### Task 6 — Shared Primitive: `ZoneLabel`

**Files:**
- Create: `ExamLab/src/shared/ui/ZoneLabel.tsx`
- Test: `ExamLab/src/shared/ui/ZoneLabel.test.tsx`

Verwendung: Bildbeschriftung, DragDrop-Bild, Lückentext. Einzeilig bei korrekt, zweizeilig bei falsch (oben grün = korrekte Antwort, unten rot = SuS-Antwort).

- [ ] **Step 6.1: Test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ZoneLabel } from './ZoneLabel'

describe('ZoneLabel', () => {
  it('korrekt: einzeilig mit susAntwort', () => {
    render(<ZoneLabel variant="korrekt" susAntwort="Eigenkapital" />)
    expect(screen.getByText('Eigenkapital')).toBeInTheDocument()
  })
  it('falsch: zweizeilig mit korrekter + SuS-Antwort', () => {
    render(<ZoneLabel variant="falsch" susAntwort="Aktiva" korrekteAntwort="Eigenkapital" />)
    expect(screen.getByText('Eigenkapital')).toBeInTheDocument()
    expect(screen.getByText('Aktiva')).toBeInTheDocument()
  })
  it('falsch + leer: zeigt placeholder statt leerer Antwort', () => {
    render(<ZoneLabel variant="falsch" korrekteAntwort="X" placeholder="leer gelassen" />)
    expect(screen.getByText('leer gelassen')).toBeInTheDocument()
    expect(screen.getByText('X')).toBeInTheDocument()
  })
  it('neutral: kein spezielles Styling', () => {
    const { container } = render(<ZoneLabel variant="neutral" susAntwort="Text" />)
    expect(container.querySelector('.border-green-600')).not.toBeInTheDocument()
    expect(container.querySelector('.border-red-600')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 6.2: Test fails**

- [ ] **Step 6.3: Implementieren**

```tsx
type Props = {
  variant: 'korrekt' | 'falsch' | 'neutral'
  susAntwort?: string
  korrekteAntwort?: string
  placeholder?: string
}

export function ZoneLabel({ variant, susAntwort, korrekteAntwort, placeholder }: Props) {
  if (variant === 'korrekt') {
    return (
      <div className="inline-flex px-2 py-0.5 rounded border border-green-600 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-xs font-semibold leading-tight">
        {susAntwort}
      </div>
    )
  }
  if (variant === 'falsch') {
    return (
      <div className="inline-flex flex-col items-start px-2 py-1 rounded border border-red-600 bg-white dark:bg-slate-800 gap-0.5 leading-tight">
        <span className="text-green-700 dark:text-green-400 font-bold text-xs">
          {korrekteAntwort}
        </span>
        <span className="text-red-700 dark:text-red-400 text-sm">
          {susAntwort || <em className="text-slate-500 italic">{placeholder ?? 'leer gelassen'}</em>}
        </span>
      </div>
    )
  }
  return (
    <div className="inline-flex px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-xs">
      {susAntwort}
    </div>
  )
}
```

- [ ] **Step 6.4: Test grün**

- [ ] **Step 6.5: Commit**

```bash
git add ExamLab/src/shared/ui/ZoneLabel.tsx ExamLab/src/shared/ui/ZoneLabel.test.tsx
git commit -m "C9: ZoneLabel Shared Primitive (einzeilig/zweizeilig je nach variant)"
```

---

### Task 7 — Phase-1-Gate: Baseline nach Foundation

- [ ] **Step 7.1: Volltest**

```bash
cd ExamLab && npx tsc -b && npx vitest run && npm run build
```

Expected: tsc + vitest (466 + 13 neue = 479) + build alle grün.

- [ ] **Step 7.2: Zwischenstand-Commit (Tag)**

```bash
git tag c9-phase1-foundation -m "Phase 1 complete: Datenmodell + Shared Primitives + Whitelist"
```

---

## Phase 2 — Fragetyp-Komponenten mit `modus='loesung'`

Zielzustand: Alle 14 Fragetyp-Komponenten unterstützen `modus='loesung'`. Jeder Typ ist einzeln getestet — 1 Test pro Fragetyp mit Mock-Daten für Lösungs-Rendering.

**Reihenfolge (Priorität nach Häufigkeit):**
1. MC
2. RichtigFalsch
3. Zuordnung
4. Lückentext
5. Hotspot
6. Bildbeschriftung
7. DragDropBild
8. Freitext + Berechnung (gemeinsam)
9. Sortierung
10. Kontenbestimmung
11. Buchungssatz
12. TKonto
13. BilanzER

Nicht auto-korrigierbar (kein `modus='loesung'` nötig, nur Musterlösungs-Block): Zeichnen, Audio, Code, PDF, FormelFrage (atomar).

**Gemeinsame Task-Struktur pro Fragetyp** (folgen alle dem Muster aus Task 8 MC):

### Task 8 — MC: `modus='loesung'`

**Files:**
- Modify: `ExamLab/src/components/fragetypen/MCFrage.tsx`
- Test: `ExamLab/src/components/fragetypen/MCFrage.test.tsx` (neu oder bestehend erweitern)

- [ ] **Step 8.1: Test für Lösungs-Modus schreiben**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MCFrage } from './MCFrage'

describe('MCFrage modus=loesung', () => {
  const frage = {
    id: 'f1', typ: 'mc',
    text: 'Frage',
    optionen: [
      { id: 'a', text: 'Option A', korrekt: true, erklaerung: 'Weil A richtig' },
      { id: 'b', text: 'Option B', korrekt: false, erklaerung: 'B ist falsch, weil...' },
      { id: 'c', text: 'Option C', korrekt: true, erklaerung: 'C ist auch richtig' },
      { id: 'd', text: 'Option D', korrekt: false, erklaerung: 'D ist falsch' },
    ],
    mehrfachauswahl: true,
  } as any

  it('gewählt+korrekt zeigt grüne Zeile mit ✓', () => {
    const antwort = { optionenIds: ['a'] }
    render(<MCFrage frage={frage} antwort={antwort} modus="loesung" />)
    const zeileA = screen.getByText('Option A').closest('[data-testid="antwort-zeile"]')
    expect(zeileA?.className).toMatch(/border-green/)
    expect(zeileA?.textContent).toContain('✓')
  })
  it('gewählt+falsch zeigt rote Zeile mit ✓ (Marker immer grün bei Wahl)', () => {
    const antwort = { optionenIds: ['b'] }
    render(<MCFrage frage={frage} antwort={antwort} modus="loesung" />)
    const zeileB = screen.getByText('Option B').closest('[data-testid="antwort-zeile"]')
    expect(zeileB?.className).toMatch(/border-red/)
    expect(zeileB?.textContent).toContain('✓')
  })
  it('nicht-gewählt+wäre-korrekt zeigt rote Zeile ohne Marker', () => {
    const antwort = { optionenIds: ['a'] }  // C nicht gewählt, aber korrekt
    render(<MCFrage frage={frage} antwort={antwort} modus="loesung" />)
    const zeileC = screen.getByText('Option C').closest('[data-testid="antwort-zeile"]')
    expect(zeileC?.className).toMatch(/border-red/)
    expect(zeileC?.textContent).not.toContain('✓')
    expect(zeileC?.textContent).not.toContain('✗')
  })
  it('nicht-gewählt+falsch zeigt neutrale Zeile', () => {
    const antwort = { optionenIds: ['a'] }
    render(<MCFrage frage={frage} antwort={antwort} modus="loesung" />)
    const zeileD = screen.getByText('Option D').closest('[data-testid="antwort-zeile"]')
    expect(zeileD?.className).not.toMatch(/border-(red|green)/)
  })
  it('rendert KI-Erklärung wenn erklaerung vorhanden', () => {
    const antwort = { optionenIds: ['a'] }
    render(<MCFrage frage={frage} antwort={antwort} modus="loesung" />)
    expect(screen.getByText(/Weil A richtig/)).toBeInTheDocument()
  })
  it('modus=aufgabe zeigt interaktive Checkboxes ohne Farben', () => {
    render(<MCFrage frage={frage} antwort={undefined} modus="aufgabe" />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(4)
  })
})
```

- [ ] **Step 8.2: Tests fails**

- [ ] **Step 8.3: `modus`-Prop + Lösungs-Rendering implementieren**

In `MCFrage.tsx`:
1. Prop-Type erweitern: `modus?: 'aufgabe' | 'loesung'` (default 'aufgabe')
2. Im `modus='loesung'`: Interactive Inputs auslassen, statt dessen pro Option `AntwortZeile` rendern. Variant/Marker nach der Regel:
   - `istGewaehlt && option.korrekt` → marker='ja', variant='korrekt'
   - `istGewaehlt && !option.korrekt` → marker='ja', variant='falsch'
   - `!istGewaehlt && option.korrekt` → marker='leer', variant='falsch'
   - `!istGewaehlt && !option.korrekt` → marker='leer', variant='neutral'
3. Erklärung aus `option.erklaerung` durchreichen

- [ ] **Step 8.4: Tests grün**

```bash
cd ExamLab && npx vitest run src/components/fragetypen/MCFrage.test.tsx
```

- [ ] **Step 8.5: Commit**

```bash
git add ExamLab/src/components/fragetypen/MCFrage.tsx ExamLab/src/components/fragetypen/MCFrage.test.tsx
git commit -m "C9: MCFrage modus='loesung' mit Inline-Korrektur + KI-Erklaerungen"
```

---

### Tasks 9–14 — Restliche 7 Kern-Fragetypen (gleiche Struktur wie Task 8)

Jeweils: Test schreiben (4–6 Cases pro Typ) → Test fails → `modus`-Prop + Lösungs-Rendering → Tests grün → Commit.

- [ ] **Task 9: RichtigFalsch** — nutzt `AntwortZeile`. Marker: SuS sagt „Richtig"→✓, „Falsch"→✗. Variant: grün wenn SuS-Urteil match korrekt-Flag, sonst rot.
- [ ] **Task 10: Zuordnung** — pro Paar eigenes Layout (nicht `AntwortZeile`, da 2 Spalten). Grüner/roter Rahmen. Bei falsch: `ziel-korrekt` Text in grün.
- [ ] **Task 11: Lückentext** — Inline-Fluss mit `ZoneLabel` (einzeilig korrekt / zweizeilig falsch). `line-height: 2.2` auf Container.
- [ ] **Task 12: Hotspot** — `ZonenOverlay` (S128 existiert) mit variant='korrekt-bereich', ergänzt um `ZoneLabel`. Klick-Marker aus SuS-Antwort in rot/grün.
- [ ] **Task 13: Bildbeschriftung** — `ZonenOverlay` + `ZoneLabel` (einzeilig/zweizeilig). SuS-Antwort aus `antwort.beschriftungen[i].text`.
- [ ] **Task 14: DragDropBild** — analog Bildbeschriftung, aber `susAntwort` aus `antwort.mapping`.

Commit-Messages nach Pattern `"C9: <Typ>Frage modus='loesung' mit ..."`

---

### Tasks 15–20 — Sondertypen

- [ ] **Task 15: Freitext + Berechnung** — Ein-Zeilen-Version (kein Teilantwort-Strukturvergleich). Wenn `korrektur.korrekt === true` grüner Rahmen, sonst rot. Musterlösungs-Block mit Erklärungsfokus.
- [ ] **Task 16: Sortierung** — pro Item eine Zeile „deine Position: X · korrekt: Y" mit Farbe je nach Match.
- [ ] **Task 17: Kontenbestimmung** — pro Konto eine Zeile, Rahmen grün/rot. Bei falsch: korrekte Kategorie als grüner Text daneben.
- [ ] **Task 18: Buchungssatz** — pro Buchung Zeile mit Soll/Haben/Betrag. Pro Feld grün/rot. Bei falsch: korrekte Werte als `ZoneLabel`-artige Pills.
- [ ] **Task 19: TKonto** — analog Buchungssatz. Fehlende Buchungen als neutral-rote Platzhalter.
- [ ] **Task 20: BilanzER** — pro Posten Zeile, Farbe nach Auto-Korrektur.

---

### Task 21 — Phase-2-Gate

- [ ] **Step 21.1: Volltest**

```bash
cd ExamLab && npx tsc -b && npx vitest run && npm run build
```

- [ ] **Step 21.2: Zwischenstand-Tag**

```bash
git tag c9-phase2-fragetypen -m "Phase 2 complete: alle Fragetypen mit modus=loesung"
```

---

## Phase 3 — Apps-Script Backend + Editor-Integration

Zielzustand: `generiereMusterloesung` liefert strukturierte Teilerklärungen. Editor-UI zeigt Preview-Panel mit Übernahme-Button.

### Task 22 — Apps-Script: `generiereMusterloesung` Prompt + Response-Schema

**Files:**
- Modify: `ExamLab/apps-script-code.js` (Funktion `generiereMusterloesung`)

- [ ] **Step 22.1: Prompt-Erweiterung**

In der `generiereMusterloesung`-Handler-Funktion:
1. System-Prompt um JSON-Output-Schema ergänzen — definiere, dass die Response `{musterloesung, teilerklaerungen[]}` enthält, pro Fragetyp mit spezifischer `feld`-Angabe (`optionen|aussagen|paare|luecken|bereiche|zielzonen|beschriftungen|items|konten|buchungen|posten`).
2. System-Prompt um Rendering-Regeln ergänzen (Beispiele für Format pro Typ, ähnlich wie bei S130 KI-Kalibrierung).
3. Response-Parser anpassen: JSON aus Claude-Response extrahieren, bei Parsing-Fehler auf Legacy-Response (plain string) fallback.

Beispiel-Prompt-Struktur (adaption an bestehenden):

```
Antworte ausschliesslich als JSON-Objekt:
{
  "musterloesung": "... didaktische Gesamterklärung, 2-4 Sätze ...",
  "teilerklaerungen": [
    { "feld": "optionen", "id": "opt-1", "text": "Kurze Begründung, 1-2 Sätze" },
    ...
  ]
}

Fragetyp-Regeln:
- mc: erkläre pro optionen[i]. feld='optionen', id=optionen[i].id
- rf: erkläre pro aussagen[i]. feld='aussagen'
- zuordnung: erkläre pro paare[i]. feld='paare'
- lueckentext: erkläre pro luecken[i]. feld='luecken'
- hotspot: erkläre pro bereiche[i]. feld='bereiche'
- dragdrop_bild: erkläre pro zielzonen[i]. feld='zielzonen'
- bildbeschriftung: erkläre pro beschriftungen[i]. feld='beschriftungen'
- sortierung: erkläre pro items[i]. feld='items'
- kontenbestimmung: erkläre pro konten[i]. feld='konten'
- buchungssatz/tkonto: erkläre pro buchungen[i]. feld='buchungen'
- bilanz_er: erkläre pro posten[i]. feld='posten'
- Typen ohne Teilantworten (freitext, berechnung, zeichnen, audio, code, pdf, formel): teilerklaerungen = []
```

- [ ] **Step 22.2: Response-Backward-Compat**

Parser muss graceful sein: wenn Claude nur einen Plain-String liefert (z.B. alte Deployment-Version, fehlerhaftes JSON), return `{musterloesung: string, teilerklaerungen: []}`. Kein Crash.

- [ ] **Step 22.3: Manuelle Validierung im GAS-Editor**

User deployt. Dann im GAS-Editor:
```js
var test = {
  typ: 'mc',
  text: 'Welche Kennzahl gehört zur Liquiditätsanalyse?',
  optionen: [{id:'a', text:'Current Ratio', korrekt:true}, {id:'b', text:'Umsatzrendite', korrekt:false}]
};
var r = generiereMusterloesung({ frage: test, email: 'test@hof.ch' });
Logger.log(r);
```
Expected: `r.ergebnis.musterloesung` (String) + `r.ergebnis.teilerklaerungen` (Array mit 2 Einträgen, id=a+b).

- [ ] **Step 22.4: Commit + Deploy-Notiz**

```bash
git add ExamLab/apps-script-code.js
git commit -m "C9: generiereMusterloesung liefert strukturierte Teilerklaerungen + Parser-Fallback"
```

⚠️ **User muss Apps-Script deployen.**

---

### Task 23 — Service-Layer: Response-Schema-Erweiterung

**Files:**
- Modify: `ExamLab/src/services/kiAssistentApi.ts` (oder wie der aktuelle Service heisst — grep `generiereMusterloesung`)

- [ ] **Step 23.1: Response-Type erweitern**

```ts
// … bestehender Type …
export interface GeneriereMusterloesungResponse {
  musterloesung: string
  teilerklaerungen: Array<{
    feld: 'optionen' | 'aussagen' | 'paare' | 'luecken' | 'bereiche' | 'zielzonen' | 'beschriftungen' | 'items' | 'konten' | 'buchungen' | 'posten'
    id: string
    text: string
  }>
}
```

- [ ] **Step 23.2: Normalizer-Defensive**

Nach `postJson`-Call: wenn `teilerklaerungen` fehlt/undefined → `teilerklaerungen: []`. Gilt für beide Response-Zweige (wrapped + unwrapped).

- [ ] **Step 23.3: Unit-Test für Normalizer**

```ts
it('behandelt fehlendes teilerklaerungen-Feld als leeres Array', () => {
  const raw = { success: true, data: { musterloesung: 'X' } }
  const parsed = normalisiereMusterloesungsResponse(raw)
  expect(parsed.teilerklaerungen).toEqual([])
})
```

- [ ] **Step 23.4: Commit**

```bash
git add ExamLab/src/services/kiAssistentApi.ts ExamLab/src/services/*.test.ts
git commit -m "C9: Frontend-Service tolerates fehlendes teilerklaerungen (Rueckwaertskompat)"
```

---

### Task 24 — Editor-UI: `KIMusterloesungPreview`-Panel

**Files:**
- Create: `ExamLab/src/components/editor/KIMusterloesungPreview.tsx`
- Test: `ExamLab/src/components/editor/KIMusterloesungPreview.test.tsx`

Panel zeigt nach KI-Musterlösung-Klick die Response: Musterlösungs-Text + Liste der Teilerklärungen. LP kann:
- Teilerklärung pro Element editieren (Text-Input)
- Übernehmen → Callback mit allen Feldern
- Verwerfen → schliesst Panel

- [ ] **Step 24.1: Test**

Cases: rendert Musterlösung, rendert Teilerklärungen, Edit propagiert via `onChange`, Übernehmen ruft `onUebernehmen` mit aktualisierten Daten.

- [ ] **Step 24.2: Test fails**

- [ ] **Step 24.3: Komponente implementieren**

Struktur:
- Title „KI-Vorschlag"
- Block: Musterlösung (Textarea, editierbar)
- Block: Teilerklärungen (pro Element: Element-Label + Text-Input + Element-ID mitführen)
- Buttons: „Übernehmen" (violett), „Verwerfen"

- [ ] **Step 24.4: Test grün**

- [ ] **Step 24.5: Integration in bestehenden Editor**

Finde die Stelle wo heute `generiereMusterloesung` im Editor aufgerufen wird (grep `generiereMusterloesung` in `src/components/editor/**`). Ersetze den Inline-Text-Bereich durch `KIMusterloesungPreview`.

Bei „Übernehmen": schreibe `frage.musterlosung` + für jedes `teilerklaerung` das entsprechende `frage.<feld>[i].erklaerung`.

**Design-Entscheidung (aus Spec §12):** Die KI-Response zeigt im Preview-Panel die generierten Texte. Bestehende, manuell gepflegte Erklärungen werden **nicht automatisch überschrieben**, sondern im Panel mit Hinweis „Bereits vorhandene Erklärung (LP-gepflegt)" markiert. LP entscheidet pro Zeile: übernehmen (überschreibt) oder behalten. Default: KI-Text NUR in leere Felder übernehmen.

- [ ] **Step 24.6: Commit**

```bash
git add ExamLab/src/components/editor/KIMusterloesungPreview.tsx \
        ExamLab/src/components/editor/KIMusterloesungPreview.test.tsx \
        ExamLab/src/components/editor/SharedFragenEditor.tsx  # oder wo immer das Panel integriert wird
git commit -m "C9: Editor KIMusterloesungPreview mit Teilerklaerungs-Review"
```

---

### Task 25 — Privacy: Prüfen-SuS-Bereinigung

**Files:**
- Modify: `ExamLab/apps-script-code.js` (Funktionen `bereinigeFrageFuerSuS_` und `bereinigeFrageFuerSuSUeben_`)

**Invariante:** Im Prüfen-Modus sieht SuS NIEMALS die Erklärungen (können Musterlösung indirekt verraten). Im Übungsmodus DOCH.

- [ ] **Step 25.1: `bereinigeFrageFuerSuS_` erweitern**

Whitelist/Blacklist-Logik (S122 Phase 2): für jedes Sub-Array (`optionen`, `aussagen`, `paare`, etc.) das `erklaerung`-Feld entfernen. Pro Fragetyp die Sub-Array-Felder kennen.

- [ ] **Step 25.2: `bereinigeFrageFuerSuSUeben_` NICHT anfassen**

Übungsmodus erhält die Felder — SuS sieht Erklärungen nach „Antwort prüfen".

- [ ] **Step 25.3: Security-Test als GAS-Snippet**

```js
function testC9Privacy_() {
  var f = { typ:'mc', optionen:[{id:'a', text:'X', korrekt:true, erklaerung:'LEAK'}] };
  var pruefen = bereinigeFrageFuerSuS_(f);
  console.assert(!pruefen.optionen[0].erklaerung, 'Prüfen-SuS darf erklaerung nicht sehen');
  var ueben = bereinigeFrageFuerSuSUeben_(f);
  console.assert(ueben.optionen[0].erklaerung === 'LEAK', 'Üben-SuS sieht erklaerung');
}
```

User ruft `testC9Privacy_()` im GAS-Editor, erwartet „Prüfen-SuS darf erklaerung nicht sehen"-Assertion grün.

- [ ] **Step 25.4: Frontend-Security-Test**

In `ExamLab/src/__tests__/regression/securityInvarianten.test.ts` (bestehende Datei) einen Test ergänzen, der prüft: wenn das Frontend eine Prüfen-SuS-Response bekommt, enthalten die Sub-Elemente keine `erklaerung`-Properties. Mock `apiClient.postJson` zu retournieren eines Fakes.

- [ ] **Step 25.5: Commit**

```bash
git add ExamLab/apps-script-code.js ExamLab/src/__tests__/regression/securityInvarianten.test.ts
git commit -m "C9: Privacy-Invariante — erklaerung raus bei Pruefen-SuS (S122-Pattern)"
```

⚠️ **User muss Apps-Script deployen.**

---

### Task 26 — Phase-3-Gate

- [ ] **Step 26.1: Volltest**

```bash
cd ExamLab && npx tsc -b && npx vitest run && npm run build
```

- [ ] **Step 26.2: Tag**

```bash
git tag c9-phase3-backend -m "Phase 3 complete: Apps-Script + Editor + Privacy"
```

---

## Phase 4 — Migrations-Skript (Node + Anthropic SDK)

Zielzustand: Lokales Skript, das via Apps-Script-`speichereFrage`-Endpoint + Anthropic-SDK für ~2400 bestehende Fragen Teilerklärungen generiert, mit State-Datei-Resume.

### Task 27 — Skript-Gerüst

**Files:**
- Create: `ExamLab/scripts/migrate-teilerklaerungen/package.json`
- Create: `ExamLab/scripts/migrate-teilerklaerungen/migrate.mjs`
- Create: `ExamLab/scripts/migrate-teilerklaerungen/prompts.mjs`
- Create: `ExamLab/scripts/migrate-teilerklaerungen/README.md`

- [ ] **Step 27.1: `package.json`**

```json
{
  "name": "migrate-teilerklaerungen",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "dependencies": {
    "@anthropic-ai/sdk": "^0.27.0"
  },
  "scripts": {
    "dry-run": "node migrate.mjs --dry-run --limit 20",
    "migrate": "node migrate.mjs"
  }
}
```

- [ ] **Step 27.2: `prompts.mjs`**

Exportiert `SYSTEM_PROMPT` und `buildUserPrompt(frage)` — Source of Truth für Apps-Script und lokales Skript gleichermaßen. Beim Apps-Script-Deploy später angleichen (Copy-Paste aus dieser Datei).

- [ ] **Step 27.3: `migrate.mjs` — Hauptlogik**

```js
#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts.mjs'

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || '<prod-url>'
const API_KEY = process.env.ANTHROPIC_API_KEY
if (!API_KEY) { console.error('ANTHROPIC_API_KEY required'); process.exit(1) }

const args = new Set(process.argv.slice(2))
const DRY_RUN = args.has('--dry-run')
const LIMIT = parseInt(process.argv.find(a => a.startsWith('--limit='))?.split('=')[1] || '0')

const client = new Anthropic({ apiKey: API_KEY })
const STATE_PATH = path.join(import.meta.dirname, 'state.json')
const LOG_PATH = path.join(import.meta.dirname, 'log.jsonl')

async function loadState() {
  try { return JSON.parse(await fs.readFile(STATE_PATH, 'utf8')) }
  catch { return { gestartet: new Date().toISOString(), fragen: {} } }
}
async function saveState(state) { await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2)) }
async function logLine(obj) { await fs.appendFile(LOG_PATH, JSON.stringify(obj) + '\n') }

async function ladeAlleFragen() {
  const r = await fetch(APPS_SCRIPT_URL, {
    method: 'POST', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'holeAlleFragenFuerMigration', email: 'admin@example.ch' })
  })
  return (await r.json()).data
}
async function speichereFrage(frage) {
  const r = await fetch(APPS_SCRIPT_URL, {
    method: 'POST', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'speichereFrage', frage, email: 'admin@example.ch' })
  })
  return r.json()
}

async function bereicherFrage(frage) {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',   // oder haiku-4-5 — entscheiden nach Dry-Run-Qualität
    max_tokens: 2000,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: buildUserPrompt(frage) }]
  })
  const text = msg.content[0].text
  return JSON.parse(text)  // { musterloesung, teilerklaerungen }
}

function hatBereitsErklaerungen(frage) {
  // Prüft, ob die Frage schon Teilerklärungen hat — Idempotenz
  const arr = frage.optionen || frage.aussagen || frage.paare || frage.luecken ||
              frage.bereiche || frage.zielzonen || frage.beschriftungen ||
              frage.items || frage.konten || frage.buchungen || frage.posten || []
  return arr.some(el => typeof el.erklaerung === 'string' && el.erklaerung.length > 10)
}

async function main() {
  const state = await loadState()
  const fragen = await ladeAlleFragen()
  let processed = 0

  for (const frage of fragen) {
    if (LIMIT > 0 && processed >= LIMIT) break
    const status = state.fragen[frage.id]?.status
    if (status === 'done' || status === 'giving-up') continue
    if (hatBereitsErklaerungen(frage)) {
      state.fragen[frage.id] = { status: 'skipped', grund: 'already has erklaerungen', zeitpunkt: new Date().toISOString() }
      await saveState(state)
      continue
    }

    try {
      const { musterloesung, teilerklaerungen } = await bereicherFrage(frage)
      // Merge in die Frage-Struktur
      const feldMap = { optionen:'optionen', aussagen:'aussagen', paare:'paare', luecken:'luecken',
                        bereiche:'bereiche', zielzonen:'zielzonen', beschriftungen:'beschriftungen',
                        items:'items', konten:'konten', buchungen:'buchungen', posten:'posten' }
      for (const te of teilerklaerungen) {
        const arr = frage[feldMap[te.feld]]
        if (!arr) continue
        const el = arr.find(x => x.id === te.id)
        if (el) el.erklaerung = te.text
      }
      if (!frage.musterlosung || frage.musterlosung.length < 10) frage.musterlosung = musterloesung

      if (!DRY_RUN) await speichereFrage(frage)
      state.fragen[frage.id] = { status: 'done', zeitpunkt: new Date().toISOString() }
      await logLine({ id: frage.id, status: 'done', dry: DRY_RUN, teile: teilerklaerungen.length })
    } catch (e) {
      const prev = state.fragen[frage.id]?.retries || 0
      state.fragen[frage.id] = {
        status: prev >= 2 ? 'giving-up' : 'failed',
        fehler: e.message, retries: prev + 1, zeitpunkt: new Date().toISOString()
      }
      await logLine({ id: frage.id, status: 'failed', fehler: e.message })
    }
    await saveState(state)
    processed++
    await new Promise(r => setTimeout(r, 500))  // rate-limit buffer
  }
  console.log(`Processed ${processed}, state: ${Object.values(state.fragen).reduce((a,s)=>((a[s.status]=(a[s.status]||0)+1),a),{})}`)
}

main().catch(e => { console.error(e); process.exit(1) })
```

- [ ] **Step 27.4: README.md**

Beschreibt Setup (`npm install`, `export ANTHROPIC_API_KEY=...`, `export APPS_SCRIPT_URL=...`), Dry-Run-Workflow, Resume-Verhalten, wie State-Datei zu interpretieren.

⚠️ Node ≥ 20.11 erforderlich (`import.meta.dirname`). Bei älteren Versionen auf `import.meta.url` + `fileURLToPath` umstellen.

- [ ] **Step 27.5: Commit**

```bash
git add ExamLab/scripts/migrate-teilerklaerungen/
git commit -m "C9: Migrations-Skript fuer Teilerklaerungen (Resume-faehig, Dry-Run-Modus)"
```

---

### Task 28 — Apps-Script: Admin-Endpoint `holeAlleFragenFuerMigration`

**Files:**
- Modify: `ExamLab/apps-script-code.js`

- [ ] **Step 28.1: Endpoint implementieren**

Neuer Case im `doPost`-Dispatcher (vor `default`):

```js
case 'holeAlleFragenFuerMigration': {
  if (!istAdmin_(body.email)) return jsonResponse({ error: 'admin only' });
  // Fetch alle Fragen aus allen Fachbereichs-Sheets
  var alle = [];
  ['BWL','VWL','Recht','Informatik'].forEach(function(fach) {
    var fragen = ladeAlleFragenAusSheet_(fach);  // existiert bereits oder wird hier als Helper geschrieben
    alle = alle.concat(fragen);
  });
  return jsonResponse({ success: true, data: alle });
}
```

- [ ] **Step 28.2: Helper `ladeAlleFragenAusSheet_` prüfen/implementieren**

Falls noch nicht vorhanden, analog zu bestehendem `lernplattformLadeFragen`-Helper, aber OHNE SuS-Bereinigung (Admin sieht alles).

- [ ] **Step 28.3: Commit + Deploy**

```bash
git add ExamLab/apps-script-code.js
git commit -m "C9: holeAlleFragenFuerMigration Admin-Endpoint"
```

⚠️ **User muss Apps-Script deployen.**

---

### Task 29 — Dry-Run + Stichproben-Review (mit User)

- [ ] **Step 29.1: Dry-Run 20 Fragen**

```bash
cd ExamLab/scripts/migrate-teilerklaerungen
npm install
export ANTHROPIC_API_KEY=<aus User-Env>
export APPS_SCRIPT_URL=<aus User-Env>
node migrate.mjs --dry-run --limit 20
```

- [ ] **Step 29.2: Log-Review mit User**

User reviewt `log.jsonl` — pro Frage: ist der Output fachlich plausibel? Besonders: Schweizer Recht-Fragen.

- [ ] **Step 29.3: Entscheidung Model**

Basierend auf Review: Sonnet 4.6 (teurer, bessere Qualität) vs. Haiku 4.5 (billiger, schneller). Setze in `migrate.mjs` den finalen Modellnamen.

- [ ] **Step 29.4: Commit Model-Wahl**

```bash
git add ExamLab/scripts/migrate-teilerklaerungen/migrate.mjs
git commit -m "C9: Migrations-Skript — Modell-Wahl nach Dry-Run (claude-<x>)"
```

---

### Task 30 — Live-Run (lang laufend, im Hintergrund)

- [ ] **Step 30.1: Live-Run starten**

```bash
cd ExamLab/scripts/migrate-teilerklaerungen
nohup node migrate.mjs > migrate.log 2>&1 &
```

Erwartete Laufzeit: ~160 min bei 2400 Fragen.

- [ ] **Step 30.2: Überwachen**

Periodisch `tail -f migrate.log`, `state.json` prüfen. Bei Abbruch: einfach erneut starten, das Skript resumiert.

- [ ] **Step 30.3: Abschluss-Review**

Nach Lauf: User stichprobenartig 5–10 migrierte Fragen im ExamLab-Frontend im Üben-Modus prüfen — Lösungs-Ansicht zeigt Teilerklärungen?

- [ ] **Step 30.4: State-Datei archivieren**

```bash
cp ExamLab/scripts/migrate-teilerklaerungen/state.json ExamLab/scripts/migrate-teilerklaerungen/state-post-migration-$(date +%Y%m%d).json
git add -f ExamLab/scripts/migrate-teilerklaerungen/state-post-migration-*.json
git commit -m "C9: Migration erfolgt — State archiviert"
```

---

## Phase 5 — LP-Korrektur umschalten

### Task 31 — `KorrekturFrageVollansicht` auf `modus='loesung'`

**Files:**
- Modify: `ExamLab/src/components/lp/korrektur/KorrekturFrageVollansicht.tsx`
- Modify: `ExamLab/src/components/lp/korrektur/KorrekturFrageZeile.tsx`

- [ ] **Step 31.1: Analyse bestehender Render-Pfad**

Lese die bestehende Komponente. Liste alle Eigenheiten der Korrektur-spezifischen Darstellung (z.B. KI-Punkte-Felder aus S130, manueller Punkt-Input). Diese bleiben!

Die reine Frage-Darstellung wird ersetzt: statt inline-Rendering der Frage/Antwort ruft die Komponente jetzt die Fragetyp-Komponente mit `modus='loesung'` auf.

- [ ] **Step 31.2: Umbau**

Ersetze den Frage-Render-Block in `KorrekturFrageVollansicht.tsx` durch dynamischen Fragetyp-Dispatch mit `modus='loesung'` (analog zum Üben-Renderer).

- [ ] **Step 31.3: Tests grün**

Bestehende LP-Korrektur-Tests müssen weiter grün sein.

- [ ] **Step 31.4: Commit**

```bash
git add ExamLab/src/components/lp/korrektur/
git commit -m "C9: LP-Korrektur-Ansicht nutzt Fragetyp modus='loesung' (Deduplication)"
```

---

## Phase 6 — Staging-E2E + Merge

### Task 32 — Volltest

- [ ] **Step 32.1:**

```bash
cd ExamLab && npx tsc -b && npx vitest run && npm run build
```

Expected: alles grün. Testzahl ist um ~50 angestiegen (3 Shared + 14 Fragetypen × ~4 Tests).

### Task 33 — Staging-Deploy

- [ ] **Step 33.1: Push auf preview-Branch** (siehe [memory/feedback_preview_forcepush.md](feedback_preview_forcepush.md) — NICHT force-push wenn preview WIP hat)

```bash
git log preview ^HEAD  # checken: liegt WIP auf preview?
# Wenn leer: safe
git push origin feature/c9-detaillierte-loesungen:preview --force-with-lease
```

GitHub Actions deployed staging unter `/staging/`.

### Task 34 — E2E-Browser-Test mit echten Logins (Test-Plan-Pflicht siehe [rules/regression-prevention.md](.claude/rules/regression-prevention.md))

Test-Plan pro Bereich:
1. **LP Üben (als Admin):** eine Frage pro Fragetyp im Editor öffnen, KI-Musterlösung klicken → Preview-Panel erscheint → Teilerklärungen editieren → übernehmen → Frage speichern. Frage im Üben-Modus als SuS öffnen.
2. **SuS Üben:** Frage beantworten → „Antwort prüfen" → Lösungs-Ansicht zeigt korrekte v6-Darstellung pro Fragetyp.
3. **SuS Prüfen:** während Prüfung: keine Erklärungen sichtbar (Network-Tab prüfen: `erklaerung`-Feld fehlt in Response).
4. **LP Korrektur:** nach Abgabe in Korrektur-Ansicht → gleiche v6-Darstellung.

- [ ] **Step 34.1: Test-Plan schreiben**

Im Chat den Test-Plan dokumentieren.

- [ ] **Step 34.2: Tab-Gruppe + Login (User)**

User loggt LP + SuS-Test-Account in Chrome-in-Chrome ein.

- [ ] **Step 34.3: Durchlauf der 4 Szenarien**

Screenshots + Konsolen-Log pro Szenario.

- [ ] **Step 34.4: Regression-Checks**

- 5 kritische Pfade ([rules/regression-prevention.md](.claude/rules/regression-prevention.md) 1.3): SuS-Prüfung-Laden, Heartbeat, Abgabe, Monitoring, Korrektur-Auto
- Security-Check Phase 4: SuS-Response ohne `erklaerung` im Prüfen

- [ ] **Step 34.5: E2E-Report**

Bereite Zusammenfassung: was bestanden, was offen, Screenshots.

### Task 35 — User-Freigabe + Merge

- [ ] **Step 35.1: User prüft E2E-Report + gibt „Merge OK"**

- [ ] **Step 35.2: Merge zu main**

```bash
git checkout main
git pull
git merge --no-ff feature/c9-detaillierte-loesungen
git push
```

- [ ] **Step 35.3: Branch löschen**

```bash
git branch -d feature/c9-detaillierte-loesungen
git push origin --delete feature/c9-detaillierte-loesungen  # falls gepusht
```

- [ ] **Step 35.4: HANDOFF.md aktualisieren**

- [ ] **Step 35.5: Memory aktualisieren**

`memory/project_detaillierte_loesungen.md` als erledigt markieren mit Verweis auf Commit.

---

## Lehren / Risiko-Mitigation Recap

- **S125-Pattern:** jeder neue `erklaerung`-Feldname steht in `getTypDaten_`-Whitelist. Roundtrip-Test pro Fragetyp absichert gegen Wiederholung (Tasks 2+3+8+…).
- **S122-Privacy-Pattern:** `bereinigeFrageFuerSuS_` entfernt `erklaerung` für Prüfen-SuS (Task 25). Security-Test in `securityInvarianten.test.ts`.
- **S130-Integration:** KI-Kalibrierung-Workflow bleibt. LP-Korrekturen an Teilerklärungen werden als Feedback erfasst (automatisch, da `generiereMusterloesung` den Kalibrierungs-Pfad nutzt).
- **S127-Entry-Point-Lehre:** Bei LP-Korrektur-Umstellung prüfen, welche Store-Actions/Routen den Fragetyp-Dispatcher aufrufen — sonst tote Fixes.
- **Apps-Script-Latenz:** Migration dauert lang. Resumability ist der Schutz.
