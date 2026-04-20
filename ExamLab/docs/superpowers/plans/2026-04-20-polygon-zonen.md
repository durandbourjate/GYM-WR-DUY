# Polygon-Zonen für Bild-Fragetypen — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hotspot- und DragDrop-Bild-Zonen werden auf einheitliches Polygon-Format umgestellt; LP kann freie Polygone oder Rechtecke zeichnen; `form: 'kreis'` entfällt; Migration in einem Fenster, kein Frontend-Dual-Read.

**Architecture:** Einheitlicher Zonentyp mit `punkte: {x,y}[]` + `form: 'rechteck' | 'polygon'`. Korrektur via Ray-Casting Point-in-Polygon (Frontend + Apps-Script-Port). Editor mit Modus-Toggle-Toolbar, SVG-Overlay für Zonen-Rendering, Drag-Handles pro Punkt. Migrator-Endpoint im Apps-Script, ausgelöst via neuen Admin-UI-Button im `AdminTab` des Einstellungen-Panels.

**Tech Stack:** React 19, TypeScript, Vite, Zustand, Tailwind v4, Vitest, Apps-Script (Google).

**Spec:** [`docs/superpowers/specs/2026-04-20-polygon-zonen-design.md`](../specs/2026-04-20-polygon-zonen-design.md)

---

## Dateistruktur

**Neu angelegt:**
- `ExamLab/src/utils/zonen/polygon.ts` — Ray-Casting `istPunktInPolygon` (TS-Frontend)
- `ExamLab/src/utils/zonen/polygon.test.ts`
- `ExamLab/src/utils/zonen/migriereZone.ts` — Pure Mapping-Funktionen (Kreis/Rechteck/DragDrop → Neu-Format)
- `ExamLab/src/utils/zonen/migriereZone.test.ts`
- `ExamLab/src/components/shared/ZonenOverlay.tsx` — Gemeinsames SVG-Overlay für Editor + Korrektur-Ansicht
- `ExamLab/src/components/shared/ZonenOverlay.test.tsx`
- `ExamLab/src/components/settings/ZonenMigratorButton.tsx` — Admin-UI-Button
- `ExamLab/scripts/migriere-zonen-in-pools.mjs` — Node-Script für Pool-Dateien
- `ExamLab/scripts/migriere-zonen-in-pools.test.mjs`
- `packages/shared/src/editor/typen/HotspotEditor.test.tsx` (existiert evtl. nicht, dann neu)
- `packages/shared/src/editor/typen/DragDropBildEditor.test.tsx` (dito)

**Modifiziert:**
- `ExamLab/src/types/fragen.ts` — `HotspotBereich` + `DragDropBildZielzone` komplett ersetzt
- `ExamLab/src/utils/ueben/korrektur.ts` — Hotspot-Korrektur auf Point-in-Polygon
- `ExamLab/src/utils/autoKorrektur.ts` — LP-Auto-Korrektur (Hotspot + DragDrop)
- `ExamLab/src/utils/fragenFactory.ts` — Zone-Construction beim Speichern
- `ExamLab/src/components/fragetypen/HotspotFrage.tsx` — SuS-Render + Error-Boundary
- `ExamLab/src/components/fragetypen/DragDropBildFrage.tsx` — dito
- `ExamLab/src/components/lp/korrektur/KorrekturFrageVollansicht.tsx` — SVG-Polygon-Render für LP-Auswertung
- `ExamLab/src/components/settings/EinstellungenPanel.tsx` — `ZonenMigratorButton` im Admin-Tab einhängen
- `packages/shared/src/editor/typen/HotspotEditor.tsx` — Modus-Toggle, SVG-Overlay, Polygon-Zeichnen, Handles
- `packages/shared/src/editor/typen/DragDropBildEditor.tsx` — dasselbe Pattern, mit Label-Zuordnung
- `ExamLab/apps-script-code.js` — `istPunktInPolygon_`, Migrator-Endpoint, `parseFrage` Alt-Formate nicht mehr, `bereinigeFrageFuerSuSUeben_` Feldnamen, Korrektur-Logik

**Feature-Branch:** `feature/polygon-zonen`

---

## Phase 0 — Setup

### Task 0.1: Feature-Branch anlegen

**Files:** n/a (Git)

- [ ] **Step 1: Arbeitsverzeichnis prüfen**

```bash
cd "/Users/durandbourjate/Documents/-Gym Hofwil/00 Automatisierung Unterricht/10 Github/GYM-WR-DUY"
git status
git log --oneline -5
```

Expected: working tree clean, auf `main`.

- [ ] **Step 2: Branch anlegen und wechseln**

```bash
git checkout -b feature/polygon-zonen
```

Expected: `Switched to a new branch 'feature/polygon-zonen'`

- [ ] **Step 3: Baseline-Tests grün bestätigen**

```bash
cd ExamLab && npx vitest run && npx tsc -b
```

Expected: alle 438+ Tests grün, tsc 0 Fehler. Falls nein: STOP, nicht mit dem Plan fortfahren.

---

## Phase 1 — Pure Utilities (TDD, risikoarm)

### Task 1.1: `polygon.ts` — Ray-Casting Point-in-Polygon

**Files:**
- Create: `ExamLab/src/utils/zonen/polygon.ts`
- Test: `ExamLab/src/utils/zonen/polygon.test.ts`

- [ ] **Step 1: Verzeichnis anlegen**

```bash
mkdir -p ExamLab/src/utils/zonen
```

- [ ] **Step 2: Failing test schreiben**

Datei `ExamLab/src/utils/zonen/polygon.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { istPunktInPolygon } from './polygon'

describe('istPunktInPolygon', () => {
  it('Rechteck: Punkt innen', () => {
    const poly = [{x:10,y:10},{x:20,y:10},{x:20,y:20},{x:10,y:20}]
    expect(istPunktInPolygon({x:15,y:15}, poly)).toBe(true)
  })
  it('Rechteck: Punkt ausserhalb', () => {
    const poly = [{x:10,y:10},{x:20,y:10},{x:20,y:20},{x:10,y:20}]
    expect(istPunktInPolygon({x:5,y:15}, poly)).toBe(false)
  })
  it('Dreieck: Punkt innen', () => {
    const poly = [{x:0,y:0},{x:10,y:0},{x:5,y:10}]
    expect(istPunktInPolygon({x:5,y:3}, poly)).toBe(true)
  })
  it('Dreieck: Punkt ausserhalb', () => {
    const poly = [{x:0,y:0},{x:10,y:0},{x:5,y:10}]
    expect(istPunktInPolygon({x:5,y:11}, poly)).toBe(false)
  })
  it('Konkaves L-Polygon: Punkt in Ausbuchtung ausserhalb L-Körper', () => {
    const poly = [{x:0,y:0},{x:10,y:0},{x:10,y:5},{x:5,y:5},{x:5,y:10},{x:0,y:10}]
    expect(istPunktInPolygon({x:7,y:7}, poly)).toBe(false)
  })
  it('Konkaves L-Polygon: Punkt im L-Körper', () => {
    const poly = [{x:0,y:0},{x:10,y:0},{x:10,y:5},{x:5,y:5},{x:5,y:10},{x:0,y:10}]
    expect(istPunktInPolygon({x:2,y:8}, poly)).toBe(true)
  })
  it('Leeres Polygon: immer false', () => {
    expect(istPunktInPolygon({x:5,y:5}, [])).toBe(false)
  })
  it('Zwei-Punkt-Polygon (degenerate): immer false', () => {
    expect(istPunktInPolygon({x:5,y:5}, [{x:0,y:0},{x:10,y:10}])).toBe(false)
  })
})
```

- [ ] **Step 3: Test failen lassen**

```bash
cd ExamLab && npx vitest run src/utils/zonen/polygon.test.ts
```

Expected: FAIL — "Cannot find module './polygon'"

- [ ] **Step 4: Implementation schreiben**

Datei `ExamLab/src/utils/zonen/polygon.ts`:

```ts
/**
 * Ray-Casting Point-in-Polygon Test.
 * Funktioniert für konvexe und konkave Polygone.
 * Prozent-Koordinaten (0-100), aber unabhängig von der Einheit.
 *
 * Konvention: ein Polygon mit <3 Punkten ist degenerate → immer false.
 */
export interface Punkt {
  x: number
  y: number
}

export function istPunktInPolygon(p: Punkt, polygon: Punkt[]): boolean {
  if (polygon.length < 3) return false
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y
    const xj = polygon[j].x, yj = polygon[j].y
    const intersect =
      ((yi > p.y) !== (yj > p.y)) &&
      (p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}
```

- [ ] **Step 5: Tests grün bestätigen**

```bash
npx vitest run src/utils/zonen/polygon.test.ts
```

Expected: 8 passing.

- [ ] **Step 6: Commit**

```bash
git add ExamLab/src/utils/zonen/polygon.ts ExamLab/src/utils/zonen/polygon.test.ts
git commit -m "Polygon: Ray-Casting istPunktInPolygon + Tests"
```

---

### Task 1.2: `migriereZone.ts` — Migrations-Mapping

**Files:**
- Create: `ExamLab/src/utils/zonen/migriereZone.ts`
- Test: `ExamLab/src/utils/zonen/migriereZone.test.ts`

- [ ] **Step 1: Failing tests schreiben**

Datei `ExamLab/src/utils/zonen/migriereZone.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  migriereHotspotBereichAlt,
  migriereDragDropZielzoneAlt,
  istZoneWohlgeformt,
} from './migriereZone'

describe('migriereHotspotBereichAlt', () => {
  it('Rechteck: 4 Ecken als Polygon', () => {
    const alt = {
      id: 'b1',
      form: 'rechteck',
      koordinaten: { x: 10, y: 20, breite: 30, hoehe: 40 },
      label: 'Bereich 1',
      punkte: 2,
    }
    const neu = migriereHotspotBereichAlt(alt)
    expect(neu.form).toBe('rechteck')
    expect(neu.punkte).toEqual([
      { x: 10, y: 20 },
      { x: 40, y: 20 },
      { x: 40, y: 60 },
      { x: 10, y: 60 },
    ])
    expect(neu.punktzahl).toBe(2)
    expect(neu.label).toBe('Bereich 1')
    expect(neu.id).toBe('b1')
  })
  it('Kreis: 12 Punkte als Polygon', () => {
    const alt = {
      id: 'b2',
      form: 'kreis',
      koordinaten: { x: 50, y: 50, radius: 10 },
      label: 'Kreis 1',
      punkte: 1,
    }
    const neu = migriereHotspotBereichAlt(alt)
    expect(neu.form).toBe('polygon')
    expect(neu.punkte).toHaveLength(12)
    // Erster Punkt: (50+10, 50)
    expect(neu.punkte[0].x).toBeCloseTo(60, 5)
    expect(neu.punkte[0].y).toBeCloseTo(50, 5)
    // Alle Punkte haben Abstand 10 vom Zentrum
    for (const pt of neu.punkte) {
      const d = Math.hypot(pt.x - 50, pt.y - 50)
      expect(d).toBeCloseTo(10, 5)
    }
  })
  it('Bereits migrierte Zone (punkte[] vorhanden) wird unverändert zurückgegeben', () => {
    const neu = {
      id: 'b3',
      form: 'polygon' as const,
      punkte: [{x:0,y:0},{x:10,y:0},{x:5,y:10}],
      label: 'Polygon 1',
      punktzahl: 1,
    }
    expect(migriereHotspotBereichAlt(neu)).toEqual(neu)
  })
})

describe('migriereDragDropZielzoneAlt', () => {
  it('Position-Wrapper: 4 Ecken als Polygon', () => {
    const alt = {
      id: 'z1',
      position: { x: 10, y: 20, breite: 30, hoehe: 40 },
      korrektesLabel: 'A',
    }
    const neu = migriereDragDropZielzoneAlt(alt)
    expect(neu.form).toBe('rechteck')
    expect(neu.punkte).toEqual([
      { x: 10, y: 20 },
      { x: 40, y: 20 },
      { x: 40, y: 60 },
      { x: 10, y: 60 },
    ])
    expect(neu.korrektesLabel).toBe('A')
    expect(neu.id).toBe('z1')
  })
})

describe('istZoneWohlgeformt', () => {
  it('≥3 Punkte: true', () => {
    expect(istZoneWohlgeformt({ punkte: [{x:0,y:0},{x:1,y:0},{x:0,y:1}] })).toBe(true)
  })
  it('<3 Punkte: false', () => {
    expect(istZoneWohlgeformt({ punkte: [{x:0,y:0},{x:1,y:0}] })).toBe(false)
  })
  it('punkte fehlt: false', () => {
    expect(istZoneWohlgeformt({})).toBe(false)
  })
})
```

- [ ] **Step 2: Test failen lassen**

```bash
npx vitest run src/utils/zonen/migriereZone.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implementation schreiben**

Datei `ExamLab/src/utils/zonen/migriereZone.ts`:

```ts
import type { HotspotBereich, DragDropBildZielzone } from '../../types/fragen'
import type { Punkt } from './polygon'

const KREIS_POLYGON_PUNKTE = 12

/**
 * Konvertiert eine Alt-Format-Hotspot-Zone ins neue Polygon-Format.
 * Idempotent: wenn bereits `punkte[]` vorhanden, wird unverändert zurückgegeben.
 *
 * Erwartetes Alt-Format:
 *  - Rechteck: { form: 'rechteck', koordinaten: { x, y, breite, hoehe }, ... }
 *  - Kreis:    { form: 'kreis',    koordinaten: { x, y, radius },        ... }
 *  - Feld `punkte` (number) wird zu `punktzahl` umbenannt
 */
export function migriereHotspotBereichAlt(alt: any): HotspotBereich {
  // Idempotenz: bereits migriert?
  if (Array.isArray(alt.punkte) && alt.punkte.length >= 3) {
    return alt as HotspotBereich
  }

  const k = alt.koordinaten ?? {}
  let form: 'rechteck' | 'polygon' = 'rechteck'
  let punkte: Punkt[] = []

  if (alt.form === 'kreis') {
    form = 'polygon'
    punkte = kreisZuPolygon(k.x ?? 50, k.y ?? 50, k.radius ?? 5, KREIS_POLYGON_PUNKTE)
  } else {
    // Alles andere (explizit 'rechteck' oder fehlende form) → Rechteck
    form = 'rechteck'
    punkte = rechteckZuPolygon(k.x ?? 0, k.y ?? 0, k.breite ?? 0, k.hoehe ?? 0)
  }

  return {
    id: alt.id,
    form,
    punkte,
    label: alt.label ?? '',
    punktzahl: typeof alt.punktzahl === 'number' ? alt.punktzahl : (alt.punkte_alt ?? alt.punkte ?? 1),
  }
}

/**
 * Konvertiert eine Alt-Format-DragDrop-Zielzone ins neue Polygon-Format.
 * Idempotent.
 *
 * Erwartetes Alt-Format: { position: { x, y, breite, hoehe }, korrektesLabel, id }
 */
export function migriereDragDropZielzoneAlt(alt: any): DragDropBildZielzone {
  if (Array.isArray(alt.punkte) && alt.punkte.length >= 3) {
    return alt as DragDropBildZielzone
  }

  const p = alt.position ?? {}
  return {
    id: alt.id,
    form: 'rechteck',
    punkte: rechteckZuPolygon(p.x ?? 0, p.y ?? 0, p.breite ?? 0, p.hoehe ?? 0),
    korrektesLabel: alt.korrektesLabel ?? '',
  }
}

export function istZoneWohlgeformt(zone: any): boolean {
  return Array.isArray(zone?.punkte) && zone.punkte.length >= 3
}

// --- interne Helfer ---

function rechteckZuPolygon(x: number, y: number, b: number, h: number): Punkt[] {
  return [
    { x, y },
    { x: x + b, y },
    { x: x + b, y: y + h },
    { x, y: y + h },
  ]
}

function kreisZuPolygon(cx: number, cy: number, r: number, n: number): Punkt[] {
  const punkte: Punkt[] = []
  for (let i = 0; i < n; i++) {
    const theta = (2 * Math.PI * i) / n
    punkte.push({
      x: cx + r * Math.cos(theta),
      y: cy + r * Math.sin(theta),
    })
  }
  return punkte
}
```

**Hinweis:** Dieses Modul importiert `HotspotBereich` + `DragDropBildZielzone` aus dem (noch alten) Types-File. Erst in Task 2.1 werden die Types angepasst. Zu diesem Zeitpunkt wird `migriereZone.ts` tsc-Fehler haben, weil die neuen Feldnamen noch nicht existieren. **Die Test-Datei arbeitet nur mit Duck-Typing (any) und bleibt grün.** Die tsc-Fehler werden in Task 2.1 aufgelöst, wenn die Types migriert sind.

- [ ] **Step 4: Vitest-Tests grün bestätigen**

```bash
npx vitest run src/utils/zonen/migriereZone.test.ts
```

Expected: passing.

- [ ] **Step 5: tsc (erwartet ggf. Fehler weil Types alt sind — notieren, nicht fixen)**

```bash
npx tsc -b 2>&1 | head -20
```

Expected: wenn Fehler → weiter mit Phase 2. Wenn keine Fehler → auch ok.

- [ ] **Step 6: Commit**

```bash
git add ExamLab/src/utils/zonen/migriereZone.ts ExamLab/src/utils/zonen/migriereZone.test.ts
git commit -m "Polygon: migriereHotspotBereichAlt + migriereDragDropZielzoneAlt + Tests"
```

---

## Phase 2 — Type-Refactor + alle Consumer

Die Types werden gleichzeitig in `ExamLab/src/types/fragen.ts` umgestellt. Alle Consumer-Stellen (korrektur.ts, autoKorrektur.ts, fragenFactory.ts, HotspotFrage.tsx, DragDropBildFrage.tsx, KorrekturFrageVollansicht.tsx, HotspotEditor.tsx, DragDropBildEditor.tsx) müssen zusammen angepasst werden, sonst tsc-Rotbruch.

### Task 2.1: Types umstellen

**Files:**
- Modify: `ExamLab/src/types/fragen.ts:575-620`

- [ ] **Step 1: Diff anschauen + Stellen dokumentieren**

```bash
npx grep -n "HotspotBereich\|DragDropBildZielzone\|koordinaten\|korrektur.*punkte\|bereich\.punkte" ExamLab/src -r 2>/dev/null | head -50
```

Expected: Liste aller Stellen, die Types oder Alt-Felder verwenden.

- [ ] **Step 2: Types anpassen**

Datei `ExamLab/src/types/fragen.ts`, Zeilen 575–620 ersetzen durch:

```ts
// === HOTSPOT ===

export interface HotspotBereich {
  id: string
  form: 'rechteck' | 'polygon'   // nur Editor-UX, Korrektur ignoriert
  punkte: { x: number; y: number }[]  // Prozent 0-100, ≥3 Punkte
  label: string
  punktzahl: number              // Punkte-Wert für Korrektur
}

export interface HotspotFrage extends FrageBase {
  typ: 'hotspot'
  fragetext: string
  bildUrl: string
  bereiche: HotspotBereich[]
  mehrfachauswahl: boolean
}

// === BILDBESCHRIFTUNG ===

export interface BildbeschriftungLabel {
  id: string
  position: { x: number; y: number }  // Prozent 0-100
  korrekt: string[]                     // akzeptierte Antworten
}
```

Und weiter unten (DragDropBildZielzone, ca. Zeile 616):

```ts
export interface DragDropBildZielzone {
  id: string
  form: 'rechteck' | 'polygon'
  punkte: { x: number; y: number }[]
  korrektesLabel: string
}
```

- [ ] **Step 3: tsc-Fehler auflisten**

```bash
cd ExamLab && npx tsc -b 2>&1 | grep -E "error TS" | head -30
```

Expected: Liste der betroffenen Stellen. Notiere sie für die folgenden Tasks. Typische Kandidaten:
- `korrektur.ts` (hotspot-Case)
- `autoKorrektur.ts`
- `fragenFactory.ts`
- `HotspotEditor.tsx`, `DragDropBildEditor.tsx`
- `HotspotFrage.tsx`, `DragDropBildFrage.tsx`
- `KorrekturFrageVollansicht.tsx`

**Noch nicht committen** — Types allein ohne Consumer-Fixes sind rot.

---

### Task 2.2: `korrektur.ts` auf Polygon umstellen

**Files:**
- Modify: `ExamLab/src/utils/ueben/korrektur.ts` (Zeilen ca. 190–210, `hotspot`-Case in `pruefeAntwort`)
- Test: `ExamLab/src/utils/ueben/korrektur.test.ts` (erweitern)

- [ ] **Step 1: Alte Stelle lokalisieren**

```bash
npx grep -n "hotspot\|b\.form\|Math\.hypot" ExamLab/src/utils/ueben/korrektur.ts
```

Expected: Treffer um Zeile 190–210 mit `form === 'rechteck'` und `form === 'kreis'`.

- [ ] **Step 2: Tests erweitern (failing)**

Datei `ExamLab/src/utils/ueben/korrektur.test.ts` — Hotspot-Testblock erweitern:

```ts
import { pruefeAntwort } from './korrektur'

describe('pruefeAntwort: hotspot', () => {
  const frage = {
    id: 'h1',
    typ: 'hotspot',
    bereiche: [
      {
        id: 'b1',
        form: 'rechteck',
        punkte: [{x:10,y:10},{x:30,y:10},{x:30,y:30},{x:10,y:30}],
        label: 'Ziel',
        punktzahl: 2,
      },
      {
        id: 'b2',
        form: 'polygon',
        punkte: [{x:50,y:50},{x:70,y:50},{x:60,y:70}],
        label: 'Distraktor',
        punktzahl: 0,
      },
    ],
    mehrfachauswahl: false,
  } as any

  it('Klick im Ziel-Polygon: korrekt', () => {
    const r = pruefeAntwort(frage, { klicks: [{x:20, y:20}] })
    expect(r.korrekt).toBe(true)
    expect(r.erreichtePunkte).toBe(2)
  })
  it('Klick im Distraktor (punktzahl=0): Fehler', () => {
    const r = pruefeAntwort(frage, { klicks: [{x:60, y:60}] })
    expect(r.korrekt).toBe(false)
    expect(r.erreichtePunkte).toBe(0)
  })
  it('Klick ausserhalb aller Zonen: kein Fehler, kein Punkt', () => {
    const r = pruefeAntwort(frage, { klicks: [{x:5, y:5}] })
    expect(r.korrekt).toBe(false)
    expect(r.erreichtePunkte).toBe(0)
  })
  it('Mehrfachauswahl AN: zwei Ziel-Klicks zählen nur einmal (ein Bereich)', () => {
    const fragMA = { ...frage, mehrfachauswahl: true }
    const r = pruefeAntwort(fragMA, { klicks: [{x:20,y:20}, {x:25,y:25}] })
    expect(r.erreichtePunkte).toBe(2)
  })
})
```

- [ ] **Step 3: Tests failen bestätigen**

```bash
npx vitest run src/utils/ueben/korrektur.test.ts
```

Expected: FAIL auf den neuen Hotspot-Tests (falls Code noch alte Form/koordinaten liest).

- [ ] **Step 4: Implementation anpassen**

In `ExamLab/src/utils/ueben/korrektur.ts`, den Hotspot-Case-Block finden (`case 'hotspot':`) und die `.some()` / `.filter()`-Logik auf `istPunktInPolygon` umstellen:

```ts
import { istPunktInPolygon } from '../zonen/polygon'

// ... innerhalb pruefeAntwort, Hotspot-Case:
case 'hotspot': {
  const klicks: {x:number; y:number}[] = Array.isArray(antwort?.klicks) ? antwort.klicks : []
  const bereiche: HotspotBereich[] = Array.isArray(frage.bereiche) ? frage.bereiche : []
  const treffer = new Set<string>()
  let distraktorHit = false

  for (const k of klicks) {
    for (const b of bereiche) {
      if (!Array.isArray(b.punkte) || b.punkte.length < 3) continue
      if (istPunktInPolygon(k, b.punkte)) {
        if (b.punktzahl > 0) {
          treffer.add(b.id)
          if (!frage.mehrfachauswahl) break
        } else {
          distraktorHit = true
        }
        break
      }
    }
  }

  const gesamt = bereiche
    .filter(b => treffer.has(b.id))
    .reduce((s, b) => s + (b.punktzahl ?? 0), 0)

  const maxPunkte = bereiche
    .filter(b => b.punktzahl > 0)
    .reduce((s, b) => s + b.punktzahl, 0)

  return {
    korrekt: gesamt === maxPunkte && !distraktorHit,
    erreichtePunkte: distraktorHit ? 0 : gesamt,
    maxPunkte,
  }
}
```

**Alt-Felder entfernen:** alle `form === 'kreis'`-, `form === 'rechteck'`-, `Math.hypot`-, `koordinaten.radius`-, `b.hotspots`-Referenzen im Hotspot-Block löschen.

- [ ] **Step 5: Tests grün bestätigen**

```bash
npx vitest run src/utils/ueben/korrektur.test.ts
```

Expected: alle Hotspot-Tests passing.

- [ ] **Step 6: Commit (noch nicht, wenn tsc noch global rot)**

tsc-Status prüfen:
```bash
npx tsc -b 2>&1 | grep -c "error TS"
```

Wenn 0 → committen. Wenn >0 → weiter mit nächstem Task, dann Sammel-Commit.

---

### Task 2.3: `autoKorrektur.ts` — Hotspot + DragDrop umstellen

**Files:**
- Modify: `ExamLab/src/utils/autoKorrektur.ts:300-350`
- Test: `ExamLab/src/utils/autoKorrektur.test.ts` (erweitern oder neu)

- [ ] **Step 1: Stelle lokalisieren**

```bash
npx grep -n "hotspot\|dragdrop_bild\|b\.form\|bereich\.form\|korrektesLabel" ExamLab/src/utils/autoKorrektur.ts
```

- [ ] **Step 2: Tests für DragDrop-Bild (neu oder erweitern)**

```ts
describe('autoKorrektur: dragdrop_bild mit Polygon', () => {
  const frage = {
    id: 'dd1',
    typ: 'dragdrop_bild',
    zielzonen: [
      { id: 'z1', form: 'rechteck', punkte: [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}], korrektesLabel: 'A' },
      { id: 'z2', form: 'polygon', punkte: [{x:50,y:50},{x:70,y:50},{x:60,y:70}], korrektesLabel: 'B' },
    ],
    labels: ['A','B','C'],
  } as any

  it('Label A in Zone 1 korrekt platziert', () => {
    const r = autoKorrektur(frage, { platzierungen: [{ label: 'A', position: {x:5,y:5} }] })
    expect(r.korrekt).toBe(true)
  })
  it('Falsches Label in Zone 1: nicht korrekt', () => {
    const r = autoKorrektur(frage, { platzierungen: [{ label: 'B', position: {x:5,y:5} }] })
    expect(r.korrekt).toBe(false)
  })
  it('Label ausserhalb aller Zonen: nicht korrekt', () => {
    const r = autoKorrektur(frage, { platzierungen: [{ label: 'A', position: {x:99,y:99} }] })
    expect(r.korrekt).toBe(false)
  })
})
```

- [ ] **Step 3: Implementation anpassen**

In `autoKorrektur.ts`, den Hotspot- und DragDrop-Case umstellen — **keine** `form === 'rechteck'/'kreis'`-Verzweigungen mehr, alles über `istPunktInPolygon(klick, zone.punkte)`:

```ts
import { istPunktInPolygon } from './zonen/polygon'

// Hotspot-Case analog zu korrektur.ts
// DragDrop-Bild-Case:
case 'dragdrop_bild': {
  const platzierungen = antwort?.platzierungen ?? []
  const zonen = frage.zielzonen ?? []
  let alleKorrekt = zonen.length > 0 && platzierungen.length >= zonen.length
  for (const pl of platzierungen) {
    let gefunden = false
    for (const z of zonen) {
      if (!Array.isArray(z.punkte) || z.punkte.length < 3) continue
      if (istPunktInPolygon(pl.position, z.punkte)) {
        if (pl.label !== z.korrektesLabel) alleKorrekt = false
        gefunden = true
        break
      }
    }
    if (!gefunden) alleKorrekt = false
  }
  return { korrekt: alleKorrekt }
}
```

- [ ] **Step 4: Tests grün bestätigen**

```bash
npx vitest run src/utils/autoKorrektur.test.ts
```

---

### Task 2.4: `fragenFactory.ts` — Zone-Konstruktion

**Files:**
- Modify: `ExamLab/src/utils/fragenFactory.ts`

- [ ] **Step 1: Stelle lokalisieren**

```bash
npx grep -n "HotspotBereich\|DragDropBildZielzone\|koordinaten\|position.*breite" ExamLab/src/utils/fragenFactory.ts
```

- [ ] **Step 2: Konstruktionen auf neues Format umstellen**

Typische Stelle (bei Hotspot-Save):

```ts
// ALT:
// const bereich: HotspotBereich = {
//   id, form: 'rechteck', koordinaten: { x, y, breite, hoehe }, label, punkte: 1
// }

// NEU:
const bereich: HotspotBereich = {
  id,
  form: 'rechteck',
  punkte: [{ x, y }, { x: x+breite, y }, { x: x+breite, y: y+hoehe }, { x, y: y+hoehe }],
  label,
  punktzahl: 1,
}
```

**Analog für DragDrop-Zielzonen** (falls dort Konstruktion vorhanden).

- [ ] **Step 3: tsc-Check pro Datei**

```bash
npx tsc -b 2>&1 | grep "fragenFactory"
```

Expected: 0 Treffer.

---

### Task 2.5: `HotspotFrage.tsx` (SuS) + Error-Boundary

**Files:**
- Modify: `ExamLab/src/components/fragetypen/HotspotFrage.tsx`

- [ ] **Step 1: Aktuelles Rendering anschauen**

```bash
wc -l ExamLab/src/components/fragetypen/HotspotFrage.tsx
```

- [ ] **Step 2: SVG-Klick-Handling auf Polygon umstellen**

Die Datei rendert das Bild + einen Klick-Listener. Bereiche sind für SuS unsichtbar (kein Render nötig). Der Klick-Handler muss lediglich die relative Klick-Position in `antwort.klicks` speichern. Die Korrektur passiert woanders (korrektur.ts).

**Error-Boundary oben in der Komponente einfügen:**

```ts
import { istZoneWohlgeformt } from '../../utils/zonen/migriereZone'

export default function HotspotFrage({ frage, ... }: Props) {
  const ungueltig = Array.isArray(frage.bereiche) && frage.bereiche.length > 0
    && frage.bereiche.some(b => !istZoneWohlgeformt(b))
  if (ungueltig) {
    return (
      <div className="p-4 rounded border border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
        Diese Frage konnte nicht geladen werden. Bitte LP informieren.
      </div>
    )
  }
  // ... Rest der Render-Logik unverändert
}
```

**Alt-Feld-Referenzen entfernen**: wenn die Komponente `koordinaten.radius` oder `b.form === 'kreis'` irgendwo liest (z.B. in Rendering-Code falls LP-Ansicht dieselbe Komponente nutzt), entfernen.

- [ ] **Step 3: tsc grün**

```bash
npx tsc -b 2>&1 | grep "HotspotFrage"
```

Expected: 0 Treffer.

---

### Task 2.6: `DragDropBildFrage.tsx` (SuS) + Error-Boundary

**Files:**
- Modify: `ExamLab/src/components/fragetypen/DragDropBildFrage.tsx`

- [ ] **Step 1: Aktuelles Rendering**

Zielzonen werden für SuS heute vermutlich sichtbar angezeigt (damit SuS weiss, wo er hin droppen kann) — das bleibt so. Die Render-Geometrie wird von Rechteck-Divs auf SVG-Polygone umgestellt.

- [ ] **Step 2: Rendering umstellen**

Rechteck-Div-Rendering:
```tsx
// ALT:
// zone.position.x, zone.position.y, zone.position.breite, zone.position.hoehe
```

Ersetzen durch SVG-Polygon:
```tsx
<svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
  {frage.zielzonen.map(z => (
    <polygon
      key={z.id}
      points={z.punkte.map(p => `${p.x},${p.y}`).join(' ')}
      className="fill-violet-500/15 stroke-violet-500 stroke-[0.3]"
    />
  ))}
</svg>
```

- [ ] **Step 3: Drop-Handler — Zone-Treffer via `istPunktInPolygon`**

```ts
import { istPunktInPolygon } from '../../utils/zonen/polygon'

function handleDrop(label: string, position: {x,y}) {
  const treffer = frage.zielzonen.find(z => istPunktInPolygon(position, z.punkte))
  if (!treffer) return
  // ... Platzierung speichern
}
```

- [ ] **Step 4: Error-Boundary (analog Task 2.5)**

- [ ] **Step 5: tsc-Check**

```bash
npx tsc -b 2>&1 | grep "DragDropBildFrage"
```

---

### Task 2.7: `KorrekturFrageVollansicht.tsx` (LP-Auswertung) auf SVG umstellen

**Files:**
- Modify: `ExamLab/src/components/lp/korrektur/KorrekturFrageVollansicht.tsx:420-480`

- [ ] **Step 1: Stelle lokalisieren**

```bash
npx grep -n "b\.form\|hotspot\|bereich\.form\|form === 'kreis'" ExamLab/src/components/lp/korrektur/KorrekturFrageVollansicht.tsx
```

- [ ] **Step 2: Rendering-Block für Bereiche umstellen**

Ersetze den Zweig `form === 'kreis'` / `form === 'rechteck'` durch ein einheitliches SVG-Polygon-Rendering (grün für Treffer, rot für Distraktor):

```tsx
<svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
  {bereiche.map(b => {
    const farbe = b.punktzahl > 0 ? 'fill-green-500/30 stroke-green-600' : 'fill-red-500/25 stroke-red-600'
    return (
      <polygon
        key={b.id}
        points={b.punkte.map(p => `${p.x},${p.y}`).join(' ')}
        className={`${farbe} stroke-[0.4]`}
      />
    )
  })}
  {/* SuS-Klickpunkte */}
  {klicks.map((k, i) => (
    <circle key={i} cx={k.x} cy={k.y} r="1.2" className="fill-white stroke-slate-700 stroke-[0.3]" />
  ))}
</svg>
```

- [ ] **Step 3: tsc-Check gesamt**

```bash
npx tsc -b 2>&1 | grep -c "error TS"
```

Expected: 0.

---

### Task 2.8: Editoren (Erster Pass — nur Types-Kompatibilität)

**Files:**
- Modify: `packages/shared/src/editor/typen/HotspotEditor.tsx`
- Modify: `packages/shared/src/editor/typen/DragDropBildEditor.tsx`

**Hinweis:** In diesem Task werden die Editoren nur so angepasst, dass sie mit den neuen Types kompilieren und weiterhin (ähnlich wie vorher) Rechtecke erstellen können. Der vollständige Polygon-Modus + SVG-Overlay kommt in Phase 3. Ziel hier: tsc grün, alte Editor-UX bleibt zunächst funktional auf Rechtecken.

- [ ] **Step 1: `HotspotEditor.tsx` — `koordinaten`-Lesen entfernen, `punkte[]` stattdessen**

Beim Erstellen eines neuen Bereichs (Click-2-Click):

```ts
const neuerBereich: HotspotBereich = {
  id: `b${Date.now()}`,
  form: 'rechteck',
  punkte: [
    { x: minX, y: minY },
    { x: minX + breite, y: minY },
    { x: minX + breite, y: minY + hoehe },
    { x: minX, y: minY + hoehe },
  ],
  label: `Bereich ${bereiche.length + 1}`,
  punktzahl: 1,
}
```

Beim Rendern der Bereiche im Bild — vorerst Bounding-Box aus `punkte[]` rechnen:

```ts
function boundingBox(punkte: {x,y}[]) {
  const xs = punkte.map(p => p.x), ys = punkte.map(p => p.y)
  return { x: Math.min(...xs), y: Math.min(...ys), b: Math.max(...xs)-Math.min(...xs), h: Math.max(...ys)-Math.min(...ys) }
}
```

**Alt-Felder (`koordinaten.radius`, `form === 'kreis'`, x/y/b/h-Inputs) entfernen** — das Feature für Kreis gibt's nicht mehr; x/y/b/h-Inputs wurden entschieden zu entfernen.

- [ ] **Step 2: Bereiche-Liste unter dem Bild — nur noch Label + Punktzahl-Input**

Die bestehenden x/y/b/h/r-Inputs komplett entfernen. Pro Zeile:

```tsx
<div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
  <span className="w-7 h-7 rounded-full bg-slate-200 ...">{i+1}</span>
  <input type="text" value={b.label} onChange={...} />
  <input type="number" value={b.punktzahl} onChange={(e) => handleBereichAendern(b.id, 'punktzahl', Number(e.target.value))} />
  <span>Pkt</span>
  <button onClick={() => handleBereichEntfernen(b.id)}>×</button>
</div>
```

- [ ] **Step 3: `DragDropBildEditor.tsx` analog**

**Step 4: tsc grün gesamt**

```bash
npx tsc -b 2>&1 | grep -c "error TS"
```

Expected: 0.

- [ ] **Step 5: Alle bestehenden Vitest-Tests grün**

```bash
npx vitest run
```

Expected: alle 438+ Tests passing (plus die neuen aus Phase 1/2).

- [ ] **Step 6: Phase-2-Sammel-Commit**

```bash
git add ExamLab/src/types/fragen.ts ExamLab/src/utils/ueben/korrektur.ts ExamLab/src/utils/autoKorrektur.ts ExamLab/src/utils/fragenFactory.ts ExamLab/src/utils/ueben/korrektur.test.ts ExamLab/src/utils/autoKorrektur.test.ts ExamLab/src/components/fragetypen/HotspotFrage.tsx ExamLab/src/components/fragetypen/DragDropBildFrage.tsx ExamLab/src/components/lp/korrektur/KorrekturFrageVollansicht.tsx packages/shared/src/editor/typen/HotspotEditor.tsx packages/shared/src/editor/typen/DragDropBildEditor.tsx
git commit -m "Polygon: Types + Korrektur + Rendering auf punkte[] umstellen

Hotspot- und DragDrop-Bild-Zonen nutzen jetzt einheitliches punkte[]-Format.
form: 'kreis' entfernt. korrektur.ts/autoKorrektur.ts: einziger Algorithmus
istPunktInPolygon (Ray-Casting). LP-Auswertung + SuS-Render: SVG-Polygon.
Editoren kompatibel, aber weiterhin nur Rechteck-UX (Polygon-Modus folgt)."
```

---

## Phase 3 — Editor-UX: Polygon-Modus

### Task 3.1: `ZonenOverlay.tsx` — gemeinsames SVG-Overlay (Shared)

**Files:**
- Create: `ExamLab/src/components/shared/ZonenOverlay.tsx`
- Test: `ExamLab/src/components/shared/ZonenOverlay.test.tsx`

- [ ] **Step 1: Verzeichnis anlegen, Tests schreiben**

```bash
mkdir -p ExamLab/src/components/shared
```

Test: rendert für `zonen` ein `<polygon>` pro Zone, ruft `onPointerDown` mit Zone-ID + Punkt-Index.

- [ ] **Step 2: Komponente schreiben**

```tsx
// ExamLab/src/components/shared/ZonenOverlay.tsx
import type { HotspotBereich } from '../../types/fragen'

interface ZoneMitKontext {
  id: string
  punkte: { x: number; y: number }[]
  label?: string
  akzent?: 'violett' | 'gruen' | 'rot'
}

interface Props {
  zonen: ZoneMitKontext[]
  selectedId?: string | null
  zeichnePunkte?: { x: number; y: number }[]   // aktiver Polygon-Modus: unfertige Punkte
  mausPosition?: { x: number; y: number } | null
  onZonePointerDown?: (id: string, e: React.PointerEvent) => void
  onPunktPointerDown?: (zoneId: string, punktIndex: number, e: React.PointerEvent) => void
  onPunktDoppelKlick?: (zoneId: string, punktIndex: number) => void
  onKantePointerDown?: (zoneId: string, nachPunktIndex: number, e: React.PointerEvent) => void
  readOnly?: boolean
}

export function ZonenOverlay({
  zonen, selectedId, zeichnePunkte, mausPosition,
  onZonePointerDown, onPunktPointerDown, onPunktDoppelKlick, onKantePointerDown, readOnly,
}: Props) {
  // SVG mit viewBox="0 0 100 100" — Prozent-Koordinaten direkt nutzbar
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {zonen.map(z => (
        <g key={z.id}>
          <polygon
            points={z.punkte.map(p => `${p.x},${p.y}`).join(' ')}
            className={farbeKlasse(z.akzent, z.id === selectedId)}
            style={{ pointerEvents: readOnly ? 'none' : 'auto' }}
            onPointerDown={readOnly ? undefined : (e) => onZonePointerDown?.(z.id, e)}
          />
          {z.id === selectedId && !readOnly && z.punkte.map((p, i) => (
            <circle
              key={i}
              cx={p.x} cy={p.y} r="1.2"
              className="fill-violet-500 stroke-white stroke-[0.3] cursor-move"
              onPointerDown={(e) => onPunktPointerDown?.(z.id, i, e)}
              onDoubleClick={() => onPunktDoppelKlick?.(z.id, i)}
            />
          ))}
        </g>
      ))}
      {zeichnePunkte && zeichnePunkte.length > 0 && (
        <>
          <polyline
            points={zeichnePunkte.map(p => `${p.x},${p.y}`).join(' ') + (mausPosition ? ` ${mausPosition.x},${mausPosition.y}` : '')}
            className="fill-none stroke-violet-500 stroke-[0.3]"
            strokeDasharray="1,0.8"
          />
          {zeichnePunkte.map((p, i) => (
            <circle
              key={i}
              cx={p.x} cy={p.y}
              r={i === 0 ? 1.8 : 1}
              className="fill-violet-500 stroke-white stroke-[0.3]"
            />
          ))}
        </>
      )}
    </svg>
  )
}

function farbeKlasse(akzent: 'violett'|'gruen'|'rot'|undefined, selected: boolean) {
  const base = akzent === 'gruen' ? 'fill-green-500/25 stroke-green-600'
    : akzent === 'rot' ? 'fill-red-500/25 stroke-red-600'
    : 'fill-violet-500/20 stroke-violet-500'
  return `${base} stroke-[${selected ? '0.5' : '0.3'}] cursor-pointer`
}
```

- [ ] **Step 3: Tests + Commit**

```bash
npx vitest run src/components/shared/ZonenOverlay.test.tsx
git add ExamLab/src/components/shared/ZonenOverlay.tsx ExamLab/src/components/shared/ZonenOverlay.test.tsx
git commit -m "Polygon: ZonenOverlay (gemeinsames SVG-Overlay für Editor + Korrektur)"
```

---

### Task 3.2: `HotspotEditor` Modus-Toggle + Polygon-Zeichnen

**Files:**
- Modify: `packages/shared/src/editor/typen/HotspotEditor.tsx`
- Test: `packages/shared/src/editor/typen/HotspotEditor.test.tsx` (neu)

- [ ] **Step 1: Test-Datei anlegen (failing)**

```tsx
import { render, fireEvent, screen } from '@testing-library/react'
import HotspotEditor from './HotspotEditor'

describe('HotspotEditor', () => {
  function setup(initialBereiche: any[] = []) {
    let bereiche = initialBereiche
    const setBereiche = (fn: any) => { bereiche = typeof fn === 'function' ? fn(bereiche) : fn }
    // ... Render-Wrapper
    return { getBereiche: () => bereiche, rerender }
  }

  it('Modus-Toggle: Polygon-Button wechselt Modus', () => { ... })
  it('Rechteck-Modus: 2 Klicks erzeugen 4-Punkt-Zone mit form=rechteck', () => { ... })
  it('Polygon-Modus: 4 Klicks + Doppelklick erzeugen Zone mit form=polygon + 4 Punkten', () => { ... })
  it('Polygon-Modus: Klick auf ersten Punkt schliesst', () => { ... })
  it('Polygon-Modus: 2 Klicks + Doppelklick → kein neuer Bereich (<3 Punkte)', () => { ... })
  it('ESC während Polygon-Zeichnen: verwirft unfertige Punkte', () => { ... })
  it('Punkt-Doppelklick bei 4 Punkten löscht den Punkt (→3)', () => { ... })
  it('Punkt-Doppelklick bei 3 Punkten lässt ihn stehen', () => { ... })
})
```

- [ ] **Step 2: Toolbar + State-Erweiterung einbauen**

```tsx
const [modus, setModus] = useState<'rechteck' | 'polygon'>('rechteck')
const [ersteEcke, setErsteEcke] = useState<{x,y} | null>(null)    // Rechteck-Modus
const [polyPunkte, setPolyPunkte] = useState<{x,y}[]>([])         // Polygon-Modus
const [selectedId, setSelectedId] = useState<string | null>(null)
const [mausPosition, setMausPosition] = useState<{x,y} | null>(null)

// ESC-Handler
useEffect(() => {
  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') { setErsteEcke(null); setPolyPunkte([]) }
  }
  window.addEventListener('keydown', onKey)
  return () => window.removeEventListener('keydown', onKey)
}, [])
```

Toolbar-JSX (über dem Bild):

```tsx
<div className="flex items-center gap-2 mb-2">
  <button
    onClick={() => { setModus('rechteck'); setPolyPunkte([]) }}
    className={modus === 'rechteck' ? 'filter-btn filter-btn-active' : 'filter-btn'}
  >□ Rechteck</button>
  <button
    onClick={() => { setModus('polygon'); setErsteEcke(null) }}
    className={modus === 'polygon' ? 'filter-btn filter-btn-active' : 'filter-btn'}
  >⬡ Polygon</button>
  <span className="ml-auto text-xs text-slate-500">Bereiche: {bereiche.length}</span>
</div>
```

- [ ] **Step 3: Klick-Handler erweitern**

```tsx
function handleBildKlick(e: React.MouseEvent<HTMLDivElement>) {
  const target = e.target as HTMLElement
  if (target.closest('[data-bereich]')) return
  const p = bildKoordinaten(e); if (!p) return

  if (modus === 'rechteck') {
    if (!ersteEcke) setErsteEcke(p)
    else {
      const minX = Math.min(ersteEcke.x, p.x), minY = Math.min(ersteEcke.y, p.y)
      const b = Math.abs(p.x - ersteEcke.x), h = Math.abs(p.y - ersteEcke.y)
      const neu: HotspotBereich = {
        id: `b${Date.now()}`,
        form: 'rechteck',
        punkte: [{x:minX,y:minY},{x:minX+b,y:minY},{x:minX+b,y:minY+h},{x:minX,y:minY+h}],
        label: `Bereich ${bereiche.length+1}`,
        punktzahl: 1,
      }
      setBereiche(prev => [...prev, neu])
      setErsteEcke(null)
      setSelectedId(neu.id)
    }
  } else {
    // Polygon-Modus
    // Hit-Radius erster Punkt
    if (polyPunkte.length >= 3) {
      const erste = polyPunkte[0]
      if (Math.hypot(p.x - erste.x, p.y - erste.y) < 2) {
        polygonAbschliessen()
        return
      }
    }
    setPolyPunkte(prev => [...prev, p])
  }
}

function handleBildDoppelKlick(e: React.MouseEvent) {
  if (modus === 'polygon' && polyPunkte.length >= 3) polygonAbschliessen()
}

function polygonAbschliessen() {
  if (polyPunkte.length < 3) { setPolyPunkte([]); return }
  const neu: HotspotBereich = {
    id: `b${Date.now()}`,
    form: 'polygon',
    punkte: polyPunkte,
    label: `Bereich ${bereiche.length+1}`,
    punktzahl: 1,
  }
  setBereiche(prev => [...prev, neu])
  setPolyPunkte([])
  setSelectedId(neu.id)
}
```

**Achtung Abschluss-Race** (Spec-Hinweis): Klick auf ersten Punkt wird IM selben Handler VOR dem generellen "Punkt hinzufügen" geprüft — wie oben umgesetzt.

- [ ] **Step 4: `ZonenOverlay` einbinden**

```tsx
<div ref={containerRef} className="relative block w-full max-w-2xl cursor-crosshair"
  onClick={handleBildKlick}
  onDoubleClick={handleBildDoppelKlick}
  onMouseMove={(e) => { const p = bildKoordinaten(e); if (p) setMausPosition(p) }}
  onMouseLeave={() => setMausPosition(null)}
>
  <img src={resolvePoolBildUrl(bildUrl)} ... />
  <ZonenOverlay
    zonen={bereiche.map(b => ({ id: b.id, punkte: b.punkte, label: b.label, akzent: 'violett' }))}
    selectedId={selectedId}
    zeichnePunkte={modus === 'polygon' ? polyPunkte : (ersteEcke ? [ersteEcke] : [])}
    mausPosition={mausPosition}
    onZonePointerDown={(id, e) => { setSelectedId(id); handleBereichPointerDown(bereiche.find(b => b.id === id)!, e) }}
    onPunktPointerDown={handlePunktPointerDown}
    onPunktDoppelKlick={handlePunktDoppelKlick}
  />
</div>
```

- [ ] **Step 5: Drag-Handling für Punkte**

```ts
function handlePunktPointerDown(zoneId: string, punktIndex: number, e: React.PointerEvent) {
  e.stopPropagation()
  setDrag({ kind: 'punkt', zoneId, punktIndex })
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
}

function handlePunktDoppelKlick(zoneId: string, punktIndex: number) {
  setBereiche(prev => prev.map(b => {
    if (b.id !== zoneId) return b
    if (b.punkte.length <= 3) return b  // Minimum halten
    return { ...b, punkte: b.punkte.filter((_, i) => i !== punktIndex) }
  }))
}
```

useEffect für globale Pointer-Move/Up erweitert den bestehenden Drag-Mechanismus:

```ts
useEffect(() => {
  if (!drag) return
  function onMove(e: PointerEvent) {
    const p = bildKoordinaten(e); if (!p) return
    setBereiche(prev => prev.map(b => {
      if (b.id !== drag!.zoneId) return b
      if (drag!.kind === 'punkt') {
        if (b.form === 'rechteck') {
          // axis-aligned Constraint: Nachbarn mitziehen
          return anwendenRechteckConstraint(b, drag!.punktIndex, p)
        }
        const neuPunkte = b.punkte.map((pt, i) => i === drag!.punktIndex ? p : pt)
        return { ...b, punkte: neuPunkte }
      } else {
        // kind === 'flaeche' — ganze Zone verschieben
        const dx = p.x - drag!.startX, dy = p.y - drag!.startY
        return { ...b, punkte: b.punkte.map(pt => ({ x: pt.x+dx, y: pt.y+dy })) }
      }
    }))
  }
  // ...
}, [drag])
```

`anwendenRechteckConstraint(b, index, p)`: zieht den `index`-Punkt auf `p` und setzt die zwei Nachbar-Punkte auf die gemeinsame Koordinate, damit das Rechteck achsenparallel bleibt. Konvention: Punkte-Reihenfolge `[TL, TR, BR, BL]`.

- [ ] **Step 6: Tests grün**

```bash
npx vitest run packages/shared/src/editor/typen/HotspotEditor.test.tsx
```

- [ ] **Step 7: Commit**

```bash
git add packages/shared/src/editor/typen/HotspotEditor.tsx packages/shared/src/editor/typen/HotspotEditor.test.tsx
git commit -m "Polygon: HotspotEditor mit Modus-Toggle + Polygon-Zeichnen + Handles"
```

---

### Task 3.3: `DragDropBildEditor` — gleiches Pattern

**Files:**
- Modify: `packages/shared/src/editor/typen/DragDropBildEditor.tsx`
- Test: `packages/shared/src/editor/typen/DragDropBildEditor.test.tsx` (neu)

- [ ] **Step 1: Pattern kopieren, Unterschiede**

Anders als Hotspot: statt `punktzahl` gibt es `korrektesLabel`. Die Liste unter dem Bild zeigt: Nummer, Label-Input, Dropdown „korrektesLabel" (aus `frage.labels`), ×-Button.

- [ ] **Step 2–7:** analog zu Task 3.2 — Tests schreiben, Toolbar einbauen, ZonenOverlay einbinden, Drag-Handler, Tests grün, Commit.

```bash
git add packages/shared/src/editor/typen/DragDropBildEditor.tsx packages/shared/src/editor/typen/DragDropBildEditor.test.tsx
git commit -m "Polygon: DragDropBildEditor mit Modus-Toggle + Polygon-Zeichnen"
```

---

## Phase 4 — Apps-Script-Backend

### Task 4.1: `istPunktInPolygon_` im Apps-Script + `konvertiereZoneAlt_`

**Files:**
- Modify: `ExamLab/apps-script-code.js`

- [ ] **Step 1: Helper-Funktionen am Datei-Anfang einfügen**

```js
// === ZONEN-POLYGON HELPER (ab 2026-04-20) ===

function istPunktInPolygon_(p, polygon) {
  if (!Array.isArray(polygon) || polygon.length < 3) return false;
  var inside = false;
  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    var xi = polygon[i].x, yi = polygon[i].y;
    var xj = polygon[j].x, yj = polygon[j].y;
    var intersect = ((yi > p.y) !== (yj > p.y)) &&
      (p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function zn_rechteckZuPolygon_(x, y, b, h) {
  return [
    { x: x, y: y }, { x: x + b, y: y },
    { x: x + b, y: y + h }, { x: x, y: y + h }
  ];
}

function zn_kreisZuPolygon_(cx, cy, r) {
  var punkte = [], n = 12;
  for (var i = 0; i < n; i++) {
    var t = (2 * Math.PI * i) / n;
    punkte.push({ x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) });
  }
  return punkte;
}

function zn_istWohlgeformt_(zone) {
  return zone && Array.isArray(zone.punkte) && zone.punkte.length >= 3;
}

function zn_migriereHotspotBereich_(alt) {
  if (zn_istWohlgeformt_(alt)) return alt;
  var k = alt.koordinaten || {};
  var form, punkte;
  if (alt.form === 'kreis') {
    form = 'polygon';
    punkte = zn_kreisZuPolygon_(k.x || 50, k.y || 50, k.radius || 5);
  } else {
    form = 'rechteck';
    punkte = zn_rechteckZuPolygon_(k.x || 0, k.y || 0, k.breite || 0, k.hoehe || 0);
  }
  return {
    id: alt.id,
    form: form,
    punkte: punkte,
    label: alt.label || '',
    punktzahl: typeof alt.punktzahl === 'number' ? alt.punktzahl : (alt.punkte || 1)
  };
}

function zn_migriereDragDropZielzone_(alt) {
  if (zn_istWohlgeformt_(alt)) return alt;
  var p = alt.position || {};
  return {
    id: alt.id,
    form: 'rechteck',
    punkte: zn_rechteckZuPolygon_(p.x || 0, p.y || 0, p.breite || 0, p.hoehe || 0),
    korrektesLabel: alt.korrektesLabel || ''
  };
}
```

- [ ] **Step 2: `parseFrage`-Case `hotspot` anpassen**

Lass `parseFrage` für Hotspot/DragDrop **nur das neue Format** zurückgeben — keine Alt-Felder mehr. Dual-Read bewusst nicht gewünscht. (Der Migrator muss VOR dem Frontend-Deploy durchgelaufen sein.)

Stichpunktweise:
- Hotspot: `bereiche = typDaten.bereiche` (angenommen als Polygon nach Migration). Wenn nicht wohlgeformt → unverändert durchreichen, der Frontend-Error-Boundary fängt das ab.
- DragDrop: `zielzonen = typDaten.zielzonen` (angenommen als Polygon).

- [ ] **Step 3: `getTypDaten` (Save-Pfad) anpassen**

Hotspot-Save: persistiere `bereiche` (Array) mit `punkte[]` und `punktzahl`, entferne `koordinaten`-Felder.
DragDrop-Save: persistiere `zielzonen` mit `punkte[]`, entferne `position`-Wrapper.

- [ ] **Step 4: `lernplattformPruefeAntwort` (Server-Korrektur) anpassen**

Hotspot-Case auf `istPunktInPolygon_` umstellen (analog Frontend-Logik), DragDrop dito.

- [ ] **Step 5: `bereinigeFrageFuerSuSUeben_` Feldnamen-Liste anpassen**

`LOESUNGS_FELDER_` oder äquivalent: wenn `koordinaten` explizit erwähnt → entfernen. Wenn `punktzahl` in der Sperrliste fehlen soll → sicherstellen dass SuS keine `punktzahl`-Information sieht. (SuS darf nicht wissen, welche Bereiche Punkte geben.) Konkret: für Hotspot werden für SuS `bereiche` komplett entfernt (nur Bild bleibt). Das dürfte heute schon so sein — überprüfen.

- [ ] **Step 6: Manueller Test (Apps-Script-Editor)**

Im Apps-Script-Editor `test_istPunktInPolygon_()` schreiben und einmal ausführen:

```js
function test_istPunktInPolygon_() {
  var poly = [{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
  Logger.log(istPunktInPolygon_({x:5,y:5}, poly));  // true
  Logger.log(istPunktInPolygon_({x:15,y:5}, poly)); // false
}
```

---

### Task 4.2: `admin:migriereZonen`-Endpoint

**Files:**
- Modify: `ExamLab/apps-script-code.js`

- [ ] **Step 1: Route-Handler einfügen**

Analog zu `admin:migrierMediaQuelle` (bestehendes Muster):

```js
// In der zentralen doPost-Route:
if (action === 'admin:migriereZonen') {
  return handleAdminMigriereZonen_(body);
}
```

- [ ] **Step 2: Handler schreiben**

```js
function handleAdminMigriereZonen_(body) {
  // Auth: callerEmail muss Admin sein
  if (!pruefeAdmin_(body.callerEmail)) {
    return jsonResponse_({ success: false, error: 'Nicht autorisiert' });
  }

  var dryRun = body.dryRun !== false;  // default TRUE
  var sheetName = body.sheetName;       // optional, default alle Fragen-Sheets
  var sheetNames = sheetName ? [sheetName] : ['VWL','BWL','Recht','Informatik'];

  var summary = [];
  var tabs = [];

  for (var s = 0; s < sheetNames.length; s++) {
    var name = sheetNames[s];
    var sheet = SpreadsheetApp.openById(FRAGENBANK_ID_).getSheetByName(name);
    if (!sheet) { tabs.push({ name: name, fehler: 'sheet fehlt' }); continue; }

    var letzte = sheet.getLastRow(); if (letzte < 2) { tabs.push({name:name,rows:0,aktualisiert:0}); continue; }
    var range = sheet.getRange(2, 1, letzte-1, sheet.getLastColumn());
    var werte = range.getValues();
    var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    var colTypDaten = headers.indexOf('typDaten');
    var colTyp = headers.indexOf('typ');
    var colId = headers.indexOf('id');

    var aktualisiert = 0, uebersprungen = 0;

    for (var r = 0; r < werte.length; r++) {
      var typ = werte[r][colTyp];
      if (typ !== 'hotspot' && typ !== 'dragdrop_bild') { uebersprungen++; continue; }
      var typDaten;
      try { typDaten = JSON.parse(werte[r][colTypDaten] || '{}'); } catch (e) { uebersprungen++; continue; }

      var veraendert = false;
      if (typ === 'hotspot' && Array.isArray(typDaten.bereiche)) {
        var neuBereiche = typDaten.bereiche.map(function(b) {
          if (zn_istWohlgeformt_(b)) return b;
          veraendert = true;
          return zn_migriereHotspotBereich_(b);
        });
        typDaten.bereiche = neuBereiche;
      } else if (typ === 'dragdrop_bild' && Array.isArray(typDaten.zielzonen)) {
        var neuZonen = typDaten.zielzonen.map(function(z) {
          if (zn_istWohlgeformt_(z)) return z;
          veraendert = true;
          return zn_migriereDragDropZielzone_(z);
        });
        typDaten.zielzonen = neuZonen;
      }

      if (veraendert) {
        if (!dryRun) {
          werte[r][colTypDaten] = JSON.stringify(typDaten);
        }
        aktualisiert++;
        if (summary.length < 50) {
          summary.push({ sheet: name, frageId: werte[r][colId], typ: typ });
        }
      } else {
        uebersprungen++;
      }
    }

    if (!dryRun && aktualisiert > 0) {
      range.setValues(werte);
    }

    tabs.push({ name: name, rows: werte.length, aktualisiert: aktualisiert, uebersprungen: uebersprungen });
  }

  return jsonResponse_({ success: true, dryRun: dryRun, tabs: tabs, summary: summary });
}
```

**Wichtig:** `pruefeAdmin_(email)` verwenden, existiert bereits. Nicht `callerEmail === 'yannick...'` hart vergleichen.

- [ ] **Step 3: Im Apps-Script-Editor Dry-Run-Testfunktion**

```js
function test_migratorDryRun() {
  var res = handleAdminMigriereZonen_({
    callerEmail: 'yannick.durand@gymhofwil.ch',
    dryRun: true, sheetName: 'BWL'
  });
  Logger.log(res.getContent());
}
```

Lokal nicht ausführbar — wird erst beim Deploy im Apps-Script-Editor getestet.

- [ ] **Step 4: Commit**

```bash
git add ExamLab/apps-script-code.js
git commit -m "Polygon: Apps-Script istPunktInPolygon_ + admin:migriereZonen-Endpoint"
```

---

## Phase 5 — Admin-UI & Pool-Script

### Task 5.1: `ZonenMigratorButton` im EinstellungenPanel-Admin-Tab

**Files:**
- Create: `ExamLab/src/components/settings/ZonenMigratorButton.tsx`
- Modify: `ExamLab/src/components/settings/EinstellungenPanel.tsx`

- [ ] **Step 1: Komponente schreiben**

```tsx
// ZonenMigratorButton.tsx
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL ?? ''

export default function ZonenMigratorButton() {
  const user = useAuthStore(s => s.user)
  const [busy, setBusy] = useState(false)
  const [log, setLog] = useState<string | null>(null)
  const [sheet, setSheet] = useState('BWL')

  async function migriere(dryRun: boolean) {
    if (!user?.email) return
    setBusy(true); setLog(null)
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'admin:migriereZonen',
          callerEmail: user.email,
          dryRun,
          sheetName: sheet || undefined,
        }),
        redirect: 'follow',
      })
      const json = await res.json()
      setLog(JSON.stringify(json, null, 2))
    } catch (e: any) {
      setLog('Fehler: ' + e.message)
    }
    setBusy(false)
  }

  return (
    <div className="p-4 border border-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg space-y-3">
      <h3 className="font-semibold text-amber-800 dark:text-amber-200">Zonen-Migration (Polygon-Format)</h3>
      <p className="text-xs text-amber-700 dark:text-amber-300">
        Einmalige Migration bestehender Hotspot-Bereiche + DragDrop-Zielzonen ins neue Polygon-Format.
        Erst Dry-Run auf einem Sheet, dann live. Vorher Backup-Kopie in Drive erstellen!
      </p>
      <div className="flex items-center gap-2">
        <label className="text-sm">Sheet:</label>
        <select value={sheet} onChange={e => setSheet(e.target.value)} className="border rounded px-2 py-1">
          <option value="BWL">BWL</option>
          <option value="VWL">VWL</option>
          <option value="Recht">Recht</option>
          <option value="Informatik">Informatik</option>
          <option value="">(alle)</option>
        </select>
        <button disabled={busy} onClick={() => migriere(true)} className="filter-btn">Dry-Run</button>
        <button disabled={busy} onClick={() => {
          if (!confirm('Wirklich live migrieren? Backup vorhanden?')) return
          migriere(false)
        }} className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700">Live migrieren</button>
      </div>
      {log && <pre className="text-xs bg-white dark:bg-slate-900 p-2 rounded max-h-64 overflow-auto">{log}</pre>}
    </div>
  )
}
```

- [ ] **Step 2: In `EinstellungenPanel.tsx` → `AdminTab` einhängen**

`AdminTab`-Render-Stelle finden (Zeile ~86ff), `<ZonenMigratorButton />` einfügen.

- [ ] **Step 3: tsc + Build grün**

```bash
npx tsc -b && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add ExamLab/src/components/settings/ZonenMigratorButton.tsx ExamLab/src/components/settings/EinstellungenPanel.tsx
git commit -m "Polygon: ZonenMigratorButton im Admin-Tab (Dry-Run + Live)"
```

---

### Task 5.2: `migriere-zonen-in-pools.mjs` — Pool-Dateien im Git

**Files:**
- Create: `ExamLab/scripts/migriere-zonen-in-pools.mjs`
- Create: `ExamLab/scripts/migriere-zonen-in-pools.test.mjs`

- [ ] **Step 1: Script schreiben**

```js
#!/usr/bin/env node
// Node-Script: migriert Pool-Dateien im Git-Repo ins neue Zonen-Format.
// Usage: node scripts/migriere-zonen-in-pools.mjs [--dry-run]

import fs from 'node:fs/promises'
import path from 'node:path'
import { glob } from 'glob'

const REPO_ROOT = path.resolve(process.cwd(), '..')  // Script läuft aus ExamLab/, Pools in Uebungen/
const DRY_RUN = process.argv.includes('--dry-run')

function rechteckZuPolygon(x, y, b, h) {
  return [
    { x, y }, { x: x + b, y },
    { x: x + b, y: y + h }, { x, y: y + h }
  ]
}

function kreisZuPolygon(cx, cy, r) {
  const punkte = []
  for (let i = 0; i < 12; i++) {
    const t = (2 * Math.PI * i) / 12
    punkte.push({ x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) })
  }
  return punkte
}

function migriereZone(zone, typ) {
  if (Array.isArray(zone.punkte) && zone.punkte.length >= 3) return zone
  if (typ === 'hotspot') {
    const k = zone.koordinaten || {}
    if (zone.form === 'kreis') {
      return { id: zone.id, form: 'polygon', punkte: kreisZuPolygon(k.x, k.y, k.radius),
               label: zone.label, punktzahl: zone.punktzahl ?? zone.punkte ?? 1 }
    }
    return { id: zone.id, form: 'rechteck', punkte: rechteckZuPolygon(k.x, k.y, k.breite, k.hoehe),
             label: zone.label, punktzahl: zone.punktzahl ?? zone.punkte ?? 1 }
  } else {
    const p = zone.position || {}
    return { id: zone.id, form: 'rechteck', punkte: rechteckZuPolygon(p.x, p.y, p.breite, p.hoehe),
             korrektesLabel: zone.korrektesLabel }
  }
}

export function migriereFragenArray(fragen) {
  let zaehler = 0
  const neu = fragen.map(f => {
    if (f.typ === 'hotspot' && Array.isArray(f.bereiche)) {
      const neuBereiche = f.bereiche.map(b => {
        const r = migriereZone(b, 'hotspot')
        if (r !== b) zaehler++
        return r
      })
      return { ...f, bereiche: neuBereiche }
    }
    if (f.typ === 'dragdrop_bild' && Array.isArray(f.zielzonen)) {
      const neuZonen = f.zielzonen.map(z => {
        const r = migriereZone(z, 'dragdrop_bild')
        if (r !== z) zaehler++
        return r
      })
      return { ...f, zielzonen: neuZonen }
    }
    return f
  })
  return { fragen: neu, aktualisiert: zaehler }
}

async function main() {
  const dateien = await glob('Uebungen/**/pool-*.js', { cwd: REPO_ROOT })
  let totalAktualisiert = 0
  for (const relativ of dateien) {
    const absolut = path.join(REPO_ROOT, relativ)
    const quelle = await fs.readFile(absolut, 'utf8')

    // Pattern: `const POOL = { ..., fragen: [...] }`
    // Parsing via Function-Constructor (lokal sicher)
    const modul = new Function(`${quelle}; return typeof POOL !== 'undefined' ? POOL : null`)()
    if (!modul?.fragen) { console.log(`SKIP ${relativ} (kein POOL.fragen)`); continue }

    const { fragen, aktualisiert } = migriereFragenArray(modul.fragen)
    if (aktualisiert === 0) { console.log(`= ${relativ} (nix zu tun)`); continue }
    totalAktualisiert += aktualisiert

    if (DRY_RUN) {
      console.log(`~ ${relativ}: ${aktualisiert} Zonen migrierbar`)
      continue
    }

    // Ersetze die fragen-Zuweisung im Quelltext
    const neuJs = quelle.replace(
      /fragen\s*:\s*\[[\s\S]*?\]\s*(?=,|\s*\})/,
      `fragen: ${JSON.stringify(fragen, null, 2)}`
    )
    await fs.writeFile(absolut, neuJs, 'utf8')
    console.log(`✓ ${relativ}: ${aktualisiert} Zonen migriert`)
  }
  console.log(`Fertig: ${totalAktualisiert} Zonen über alle Pools.`)
}

main().catch(e => { console.error(e); process.exit(1) })
```

- [ ] **Step 2: Test schreiben (Unit-Test für `migriereFragenArray`)**

```js
// migriere-zonen-in-pools.test.mjs
import { describe, it, expect } from 'vitest'
import { migriereFragenArray } from './migriere-zonen-in-pools.mjs'

describe('migriereFragenArray', () => {
  it('Hotspot Rechteck wird migriert', () => {
    const fragen = [{
      typ: 'hotspot',
      bereiche: [{ id:'b1', form:'rechteck', koordinaten:{x:10,y:20,breite:30,hoehe:40}, label:'X', punkte: 1 }]
    }]
    const { fragen: neu, aktualisiert } = migriereFragenArray(fragen)
    expect(aktualisiert).toBe(1)
    expect(neu[0].bereiche[0].punkte).toHaveLength(4)
    expect(neu[0].bereiche[0].punktzahl).toBe(1)
  })
  it('Bereits migrierte Zone wird übersprungen', () => {
    const fragen = [{
      typ: 'hotspot',
      bereiche: [{ id:'b1', form:'rechteck', punkte:[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}], label:'X', punktzahl: 1 }]
    }]
    const { aktualisiert } = migriereFragenArray(fragen)
    expect(aktualisiert).toBe(0)
  })
})
```

- [ ] **Step 3: Tests grün**

```bash
cd ExamLab && npx vitest run scripts/migriere-zonen-in-pools.test.mjs
```

- [ ] **Step 4: Dry-Run gegen echtes Repo**

```bash
cd ExamLab && node scripts/migriere-zonen-in-pools.mjs --dry-run
```

Expected: Liste betroffener Pool-Dateien mit Anzahl Zonen. Keine Datei-Änderungen (wg. --dry-run).

- [ ] **Step 5: Commit (nur Script)**

```bash
git add ExamLab/scripts/migriere-zonen-in-pools.mjs ExamLab/scripts/migriere-zonen-in-pools.test.mjs
git commit -m "Polygon: Pool-Migrations-Script + Tests (Dry-Run funktioniert)"
```

**Wichtig:** Die Pool-Dateien selbst werden erst in Phase 6 migriert (Migrations-Fenster).

---

## Phase 6 — Migrations-Fenster (Deploy-Choreographie)

**Voraussetzung:** Alle vorangegangenen Phasen committed. `tsc -b`, `vitest run`, `npm run build` alle grün. Feature-Branch gepusht auf Remote.

### Task 6.1: Staging-Deploy über Preview-Branch (VOR main)

- [ ] **Step 1: Preview-Branch aktualisieren**

Memory `feedback_preview_forcepush.md` beachten: erst prüfen was auf `preview` liegt was nicht auf `feature/polygon-zonen` ist.

```bash
git fetch origin preview
git log --oneline preview ^feature/polygon-zonen | head
```

Wenn Output leer → Force-Push sicher. Wenn nicht leer → Rebase oder Stop, mit User klären.

```bash
git push origin feature/polygon-zonen:preview --force-with-lease
```

- [ ] **Step 2: GitHub-Actions-Build abwarten**

Nach ~3–5 Min prüfen:

```bash
curl -sI https://durandbourjate.github.io/GYM-WR-DUY/staging/ | grep -i last-modified
```

Expected: Zeitpunkt < 5 Min.

---

### Task 6.2: Apps-Script-Deploy (Neu-Format-Backend)

**User-Aktion** (nicht automatisierbar):

- [ ] **Step 1** Backup der Fragenbank-Sheets in Drive (Rechtsklick → „Kopie erstellen" mit Suffix `-backup-polygon-YYYY-MM-DD`). 4 Tabs prüfen.

- [ ] **Step 2** `ExamLab/apps-script-code.js` komplett in den Apps-Script-Editor kopieren (überschreiben).

- [ ] **Step 3** „Bereitstellen → Bereitstellung verwalten → Bearbeiten → Version: Neu → Bereitstellen".

- [ ] **Step 4** Deployment-URL in `.env.local` (Frontend) prüfen — sollte gleich bleiben.

---

### Task 6.3: Dry-Run + Live-Migration via Admin-UI

Staging-URL mit LP-Login öffnen. Menü `Einstellungen → Admin`, dort `ZonenMigratorButton`.

- [ ] **Step 1** Dry-Run auf BWL. Ausgabe inspizieren — 73 Fragen müssen `uebersprungen` oder `aktualisiert` sein, kein `fehler`. Die ersten 20 summary-Einträge sinnvoll?

- [ ] **Step 2** Live-Migration BWL. Im Frontend: 1 Hotspot-Frage aus BWL öffnen, Zone sichtbar als Polygon? Speichern-neu-Laden funktioniert?

- [ ] **Step 3** Live-Migration Recht → VWL → Informatik (jeweils Verify).

- [ ] **Step 4** Idempotenz-Check: Live-Lauf nochmal auf BWL → `aktualisiert: 0`.

---

### Task 6.4: Pool-Dateien migrieren + committen

- [ ] **Step 1** Node-Script live laufen lassen:

```bash
cd ExamLab && node scripts/migriere-zonen-in-pools.mjs
```

Expected: Liste der migrierten Pool-Dateien + Gesamtzahl.

- [ ] **Step 2** Git-Diff reviewen (Stichproben aus 2–3 Pool-Dateien):

```bash
cd .. && git diff Uebungen/ | head -200
```

- [ ] **Step 3** Commit:

```bash
git add Uebungen/
git commit -m "Polygon: Pool-Dateien auf neues Zonen-Format migriert"
git push origin feature/polygon-zonen
```

---

### Task 6.5: Staging-E2E (schriftlicher Test-Plan + Browser)

Test-Plan gemäss `regression-prevention.md` Phase 3.0 schriftlich vor dem Testen.

**LP-Pfad:**
- [ ] 1 migrierte Hotspot-Frage (BWL, bekannter Fragen-ID) öffnen → Editor zeigt Polygon-Umriss, Handles funktionieren
- [ ] Polygon-Punkt verschieben, speichern, Seite neu laden → Änderung persistiert
- [ ] Neue Hotspot-Frage mit Rechteck-Modus (2 Klicks) → speichern/neu-laden → 4-Punkt-Polygon mit `form:'rechteck'`
- [ ] Neue Hotspot-Frage mit Polygon-Modus (4 Klicks + Doppelklick) → `form:'polygon'` mit 4 Punkten
- [ ] Dasselbe für DragDrop-Bild

**SuS-Pfad** (mit echtem SuS-Account):
- [ ] Dieselbe Frage im Üben-Modus → Klick in Polygon-Ziel → ✓
- [ ] Klick ausserhalb → keine Punkte
- [ ] Klick in Distraktor (wenn vorhanden) → Fehler
- [ ] DragDrop: Label in Ziel-Polygon → korrekt

**Security-Check (Phase 4 der regression-prevention):**
- [ ] SuS-Response enthält keine Zonen-Koordinaten (Network-Tab → `lernplattformLadeFragen`-Response)
- [ ] SuS-Response: `bereiche` fehlt oder leer? (Heute schon so — Verifikation bestätigen)

---

### Task 6.6: Merge main + Push

- [ ] **Step 1** User-Freigabe einholen

- [ ] **Step 2** Merge:

```bash
git checkout main
git merge feature/polygon-zonen
git push origin main
```

- [ ] **Step 3** HANDOFF.md aktualisieren (Session-Eintrag)

- [ ] **Step 4** Branch aufräumen:

```bash
git branch -d feature/polygon-zonen
git push origin --delete feature/polygon-zonen
```

---

## Referenzen

- Spec: [`docs/superpowers/specs/2026-04-20-polygon-zonen-design.md`](../specs/2026-04-20-polygon-zonen-design.md)
- Rules: `.claude/rules/regression-prevention.md`, `.claude/rules/deployment-workflow.md`, `.claude/rules/code-quality.md`
- Vorlage Migrations-Pattern: `docs/superpowers/plans/2026-04-19-mediaquelle-unification.md` (Phase 5)
- Vorlage Repair-Script-Pattern: `tmp/repair-hotspots.mjs` (S125)
