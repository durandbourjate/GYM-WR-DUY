# Session 11 — Bugfixes, UX-Verbesserungen Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 11 bugs from test sessions and implement 6 UX improvements for the Prüfungstool.

**Architecture:** Isolated bugfixes in Block A (tasks 1-8), UX component rewrites in Block B (tasks 9-14). Each task produces a working, committable state. No new dependencies.

**Tech Stack:** React 19, TypeScript, Vite, Zustand, Tailwind CSS, Google Apps Script backend

**Spec:** `docs/superpowers/specs/2026-03-25-session11-bugs-ux-design.md`

---

## File Map

### Block A: Bugfixes
| Task | Files Modified | Purpose |
|------|---------------|---------|
| 1 | `apps-script-code.js`, `pruefungStore.ts`, Navigation component | B6/B16: Aufgabengruppe index fix |
| 2 | AbgabeDialog component | B7: Count mismatch (istVollstaendigBeantwortet) |
| 3 | `ZeichnenCanvas.tsx`, `usePointerEvents.ts` | B10: Text-Tool disappears |
| 4 | `usePDFAnnotations.ts`, PDF annotation renderer | B11: PDF text not editable |
| 5 | `ZeichnenToolbar.tsx` | B12: Vertical toolbar layout |
| 6 | `PDFSeite.tsx` or `PDFViewer.tsx` | B13: PDF mirror/transform bug |
| 7 | `Startbildschirm.tsx` | B14: Green status before lobby |
| 8 | `LobbyPhase.tsx`, Material component, Frage renderer | B8+B9+B15: Button feedback, icon, material height |

### Block B: UX-Verbesserungen
| Task | Files Modified | Purpose |
|------|---------------|---------|
| 9 | `KursAuswahl.tsx`, `VorbereitungPhase.tsx` | U1: Course selection redesign |
| 10 | `DurchfuehrenDashboard.tsx`, `BeendetPhase.tsx`, `KorrekturDashboard.tsx` | U2: Merge Ergebnisse+Korrektur tabs |
| 11 | `AktivPhase.tsx`, `ZeitzuschlagEditor.tsx` | U3: Inline time extension in monitoring |
| 12 | `ZeichnenToolbar.tsx`, `ZeichnenFrage.tsx`, `PDFToolbar.tsx` | U4: Extended color palette |
| 13 | `LobbyPhase.tsx` | U5: Monitoring info in lobby |
| 14 | `demoFragen.ts`, `DurchfuehrenDashboard.tsx` | U6: Update demo exam |

---

## Task 1: B6/B16 — Aufgabengruppe Zählung + Navigation (KRITISCH)

**Files:**
- Audit: `apps-script-code.js` (ladePruefung function)
- Audit: `src/store/pruefungStore.ts` (fragen array construction)
- Fix: Navigation component (FragenNavigation or equivalent in sidebar)
- Fix: `src/components/fragetypen/AufgabengruppeFrage.tsx`

- [ ] **Step 1: Audit API response**

Add temporary console.log to the frontend to inspect what `ladePruefung` returns:
- In the component that calls `apiService.ladePruefung()`, log the response
- Check: Are `teilaufgabenIds` included BOTH as children of the Aufgabengruppe AND as top-level entries in `config.abschnitte[].fragenIds`?
- Check: How many entries does `fragen[]` have vs how many navigation buttons are rendered?

```typescript
// Temporary debug in DurchfuehrenDashboard.tsx or SuS loading path
const response = await apiService.ladePruefung(id, email);
console.log('fragenIds:', response.config.abschnitte?.map(a => a.fragenIds));
console.log('fragen count:', response.fragen.length);
console.log('aufgabengruppen:', response.fragen.filter(f => f.typ === 'aufgabengruppe').map(f => ({ id: f.id, teilaufgabenIds: f.teilaufgabenIds })));
```

- [ ] **Step 2: Identify the duplication source**

Based on the audit, determine:
- **If API returns teilaufgabenIds in fragenIds:** Fix in `apps-script-code.js` → `ladePruefung` function, filter out IDs that are already teilaufgabenIds of any Aufgabengruppe
- **If Store inflates fragen[]:** Fix in `pruefungStore.ts` → `pruefungStarten` action, deduplicate

- [ ] **Step 3: Fix the duplication**

If the issue is in Apps Script (likely):
```javascript
// In ladePruefung, after resolving all fragen:
// Collect all teilaufgabenIds
const alleTeilaufgabenIds = new Set();
aufgeloestesFragen.forEach(f => {
  if (f.typ === 'aufgabengruppe' && f.teilaufgabenIds) {
    f.teilaufgabenIds.forEach(id => alleTeilaufgabenIds.add(id));
  }
});

// Filter fragenIds in each Abschnitt to exclude teilaufgabenIds
config.abschnitte.forEach(abschnitt => {
  abschnitt.fragenIds = abschnitt.fragenIds.filter(id => !alleTeilaufgabenIds.has(id));
});
```

If the issue is in the Store:
```typescript
// In pruefungStarten or wherever fragen[] is set
const teilaufgabenIds = new Set(
  fragen.filter(f => f.typ === 'aufgabengruppe')
    .flatMap(f => f.teilaufgabenIds ?? [])
);
const topLevelFragen = fragen.filter(f => !teilaufgabenIds.has(f.id));
```

- [ ] **Step 4: Verify navigation consistency**

After fix, verify:
- Navigation buttons count === Header counter ("X/Y")
- Clicking each button shows the correct question
- Aufgabengruppe shows all Teilfragen inline
- MC in Aufgabengruppe shows as "beantwortet" when answered

- [ ] **Step 5: Remove debug logging and commit**

```bash
git add -A
git commit -m "fix: Aufgabengruppe Zählung — Teilfragen nicht mehr doppelt in Navigation (B6/B16)"
```

---

## Task 2: B7 — Abgabe-Count Mismatch

**Files:**
- Find: AbgabeDialog component (search for `AbgabeDialog` or the submit confirmation dialog)
- Reference: `src/utils/antwortStatus.ts` or equivalent (`istVollstaendigBeantwortet`)

- [ ] **Step 1: Locate AbgabeDialog**

```bash
grep -r "AbgabeDialog\|abgabe.*dialog\|Abgeben.*Dialog" src/ --include="*.tsx" -l
```

Also search for the truthiness check pattern:
```bash
grep -rn "!!antworten\[" src/ --include="*.tsx"
```

- [ ] **Step 2: Replace simple truthiness with istVollstaendigBeantwortet**

Find the line like:
```typescript
// OLD:
const beantwortet = fragen.filter((f) => !!antworten[f.id]).length;
```

Replace with:
```typescript
// NEW:
import { istVollstaendigBeantwortet } from '../utils/antwortStatus'; // adjust path
const beantwortet = fragen.filter((f) => istVollstaendigBeantwortet(f, antworten)).length;
```

- [ ] **Step 3: Verify counts match**

Open a test exam, answer some questions partially (e.g. only 1 of 3 Lückentext fields). Verify:
- Navigation shows same count as AbgabeDialog
- Partially answered questions are NOT counted as "beantwortet"

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: Abgabe-Count nutzt istVollstaendigBeantwortet statt einfacher Truthiness (B7)"
```

---

## Task 3: B10 — Zeichnen Text-Tool verschwindet

**Files:**
- Modify: `src/components/fragetypen/zeichnen/ZeichnenCanvas.tsx:187-261` (handleStart)
- Modify: `usePointerEvents.ts` (if separate file, otherwise pointer handling in ZeichnenCanvas)

- [ ] **Step 1: Locate pointer event handling**

```bash
grep -rn "pointerdown\|handleStart\|usePointerEvents" src/components/fragetypen/zeichnen/ --include="*.ts" --include="*.tsx"
```

- [ ] **Step 2: Add text overlay guard**

In the pointer start handler (either `usePointerEvents.ts` or `handleStart` in ZeichnenCanvas.tsx), add guard at the very beginning:

```typescript
// At start of handleStart or the pointerdown handler:
if (textOverlay.sichtbar) return; // Don't process canvas events during text input
```

- [ ] **Step 3: Ensure text input has proper event isolation**

In ZeichnenCanvas.tsx, find the text overlay input (around line 465-507) and ensure:

```tsx
<input
  // ... existing props
  onPointerDown={(e) => e.stopPropagation()}
  onMouseDown={(e) => e.stopPropagation()}
  onTouchStart={(e) => e.stopPropagation()}
  onClick={(e) => e.stopPropagation()}
/>
```

- [ ] **Step 4: Verify text tool stability**

Test: Click text tool → click on canvas → type text → verify input stays visible until:
- Enter key (submits text)
- Escape key (cancels)
- Click outside the input field

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix: Zeichnen Text-Tool bleibt stabil — Canvas-Events während Texteingabe unterdrückt (B10)"
```

---

## Task 4: B11 — PDF Text-Annotationen nicht editierbar

**Files:**
- Modify: `src/components/fragetypen/pdf/usePDFAnnotations.ts`
- Modify: PDF annotation renderer component (find via grep)

- [ ] **Step 1: Locate annotation rendering**

```bash
grep -rn "annotation\|Annotation\|TextAnnotation\|doppelklick\|onDoubleClick" src/components/fragetypen/pdf/ --include="*.tsx" --include="*.ts"
```

- [ ] **Step 2: Add double-click edit support to annotation renderer**

In the component that renders text annotations on the PDF page, add:

```tsx
// On the rendered annotation element:
onDoubleClick={(e) => {
  e.stopPropagation();
  setEditierendeAnnotation(annotation.id);
}}
```

State addition:
```typescript
const [editierendeAnnotation, setEditierendeAnnotation] = useState<string | null>(null);
```

When `editierendeAnnotation === annotation.id`, render an input/textarea instead of static text:
```tsx
{editierendeAnnotation === annotation.id ? (
  <textarea
    autoFocus
    defaultValue={annotation.text}
    onBlur={(e) => {
      editieren(annotation.id, { ...annotation, text: e.target.value });
      setEditierendeAnnotation(null);
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        editieren(annotation.id, { ...annotation, text: e.currentTarget.value });
        setEditierendeAnnotation(null);
      }
      if (e.key === 'Escape') setEditierendeAnnotation(null);
    }}
  />
) : (
  <span>{annotation.text}</span>
)}
```

- [ ] **Step 3: Verify editing works**

Test: Create text annotation → place it → double-click → edit text → press Enter → verify text updated and saved.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: PDF Text-Annotationen per Doppelklick editierbar (B11)"
```

---

## Task 5: B12 — Zeichnen Toolbar vertikal Layout

**Files:**
- Modify: `src/components/fragetypen/zeichnen/ZeichnenToolbar.tsx:109` (flex-1 spacer area)

- [ ] **Step 1: Fix vertical overflow**

The `flex-1` spacer in `flex-col` mode pushes content beyond the parent's height. Fix:

```tsx
// Find the toolbar container div (likely around line 30-40)
// OLD:
<div className={`flex ${layout === 'vertikal' ? 'flex-col' : 'flex-row flex-wrap'} ...`}>

// NEW — add max-height + overflow for vertical mode:
<div className={`flex ${layout === 'vertikal' ? 'flex-col max-h-full overflow-y-auto' : 'flex-row flex-wrap'} ...`}>
```

Also remove or reduce the `flex-1` spacer in vertical mode:

```tsx
// Around line 109, the spacer div:
// OLD:
<div className="flex-1" />

// NEW — only use spacer in horizontal mode:
{layout !== 'vertikal' && <div className="flex-1" />}
```

- [ ] **Step 2: Verify toolbar layout**

Test in both horizontal and vertical mode:
- All tools visible without overlap
- Color swatches don't overflow
- Undo/Redo buttons accessible
- Layout toggle button works

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "fix: Zeichnen Toolbar vertikal — kein Overflow mehr (B12)"
```

---

## Task 6: B13 — PDF Spiegelung + B15 Material Höhe

**Files:**
- Modify: `src/components/fragetypen/PDFSeite.tsx` or `PDFViewer.tsx` (transform handling)
- Modify: Material panel component (height CSS)

- [ ] **Step 1: Find and fix transform state**

```bash
grep -rn "transform\|scale\|zoom\|pinch" src/components/fragetypen/pdf/ --include="*.tsx" --include="*.ts"
```

Add scale clamping wherever zoom/transform state is set:

```typescript
// Wherever setZoom or setScale is called:
const clampedScale = Math.max(0.25, Math.min(3, newScale)); // No negatives, min 0.25
setZoom(clampedScale);
```

If touch gestures set the transform, add rotation prevention:

```tsx
// On the PDF container:
onTouchMove={(e) => {
  // Only allow 2-finger pinch zoom, prevent rotation
  if (e.touches.length === 2) {
    e.preventDefault();
    // Only use distance between fingers for zoom, ignore angle
  }
}}
style={{ touchAction: 'pan-x pan-y' }} // Disable browser rotate gesture
```

- [ ] **Step 2: Fix material height**

```bash
grep -rn "MaterialPanel\|material.*panel\|materialAnzeige" src/ --include="*.tsx" -l
```

Find the material container and fix height:

```tsx
// Find the container with max-height or fixed height
// Replace with:
<div className="flex-1 overflow-y-auto min-h-0">
  {/* Material content */}
</div>
```

Ensure parent has `flex flex-col h-full` or equivalent.

- [ ] **Step 3: Verify both fixes**

- PDF: Pinch-zoom should only zoom in/out, never mirror
- Material: Panel should use full available height with scroll

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: PDF kein Spiegeln mehr + Material volle Höhe (B13, B15)"
```

---

## Task 7: B14 — SuS grün vor Lobby

**Files:**
- Modify: `src/components/Startbildschirm.tsx:143-170` (Warteraum section)

- [ ] **Step 1: Change connection status color**

Find the green "Verbunden" text in the Warteraum section (around line 155-165):

```tsx
// OLD (around the heartbeat success message):
<span className="text-green-600 dark:text-green-400">
  Verbunden — warte auf Freischaltung
</span>

// NEW — blue instead of green:
<span className="text-blue-600 dark:text-blue-400">
  Verbunden — warte auf Freischaltung
</span>
```

Also check for any green icons/dots in the same section and change to blue.

- [ ] **Step 2: Verify visual distinction**

- Warteraum (before Lobby): Blue "Verbunden" text
- After Lobby opens: Green/different styling to indicate "ready"

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "fix: Warteraum-Status blau statt grün — unterscheidbar von Lobby (B14)"
```

---

## Task 8: B8 + B9 — Button-Feedback + Material-Icon

**Files:**
- Audit: `src/components/lp/LobbyPhase.tsx` (Freischalten button)
- Audit: Frage renderer (Material-Icon prop forwarding)

- [ ] **Step 1: Audit Freischalten button feedback**

In `LobbyPhase.tsx` (lines 108-123), check if the "Freischalten" button already has a loading state. The parent `DurchfuehrenDashboard` passes `freischaltenLaedt` — verify it's being used:

```bash
grep -n "freischalten\|Freischalten\|laedt\|loading" src/components/lp/LobbyPhase.tsx
```

If loading state exists but no visual feedback: add `disabled` + spinner:

```tsx
<button
  onClick={onFreischalten}
  disabled={freischaltenLaedt}
  className={`... ${freischaltenLaedt ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  {freischaltenLaedt ? '⏳ Wird freigeschaltet...' : '▶ Freischalten'}
</button>
```

- [ ] **Step 2: Fix Material-Icon**

```bash
grep -rn "material.*icon\|materialIcon\|📎\|anhang\|attachment" src/components/fragetypen/ --include="*.tsx" -l
```

Find where the Material-Icon should be rendered per question and ensure the `material` or `anhaenge` property from the Frage object is passed through and displayed.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "fix: Button-Feedback bei Freischalten + Material-Icon sichtbar (B8, B9)"
```

---

## Task 9: U1 — Kurs-Auswahl Redesign

**Files:**
- Rewrite: `src/components/lp/KursAuswahl.tsx` (174 lines)
- Modify: `src/components/lp/VorbereitungPhase.tsx:18-33` (state model), `:75-122` (toggle handlers)

- [ ] **Step 1: Refactor VorbereitungPhase state model**

Replace the dual-state model with a single Set:

```typescript
// OLD (lines 18-33):
const [ausgewaehlteKurse, setAusgewaehlteKurse] = useState<Set<string>>(new Set());
const [abgewaehlte, setAbgewaehlte] = useState<Set<string>>(new Set());

// NEW:
const [ausgewaehlteSuS, setAusgewaehlteSuS] = useState<Set<string>>(new Set());
```

- [ ] **Step 2: Update toggle handlers in VorbereitungPhase**

```typescript
// NEW handler: Toggle all SuS of a course
const handleToggleKurs = (kursId: string) => {
  const kursSuS = kursGruppen.find(k => k.kurs === kursId)?.schueler ?? [];
  const kursEmails = kursSuS.map(s => s.email);
  const alleAusgewaehlt = kursEmails.every(e => ausgewaehlteSuS.has(e));

  setAusgewaehlteSuS(prev => {
    const next = new Set(prev);
    if (alleAusgewaehlt) {
      kursEmails.forEach(e => next.delete(e));
    } else {
      kursEmails.forEach(e => next.add(e));
    }
    return next;
  });
};

// NEW handler: Toggle individual SuS
const handleToggleSuS = (email: string) => {
  setAusgewaehlteSuS(prev => {
    const next = new Set(prev);
    if (next.has(email)) next.delete(email); else next.add(email);
    return next;
  });
};

// NEW: Alle/Keine
const handleAlleAuswaehlen = () => {
  const alleEmails = kursGruppen.flatMap(k => k.schueler.map(s => s.email));
  setAusgewaehlteSuS(new Set(alleEmails));
};
const handleKeineAuswaehlen = () => setAusgewaehlteSuS(new Set());
```

- [ ] **Step 3: Update teilnehmer derivation**

Update the effect that builds `teilnehmer[]` from selected SuS:

```typescript
// Build teilnehmer from ausgewaehlteSuS
const teilnehmer = rohDaten
  .filter(s => ausgewaehlteSuS.has(s.email))
  .map(s => ({
    email: s.email,
    name: `${s.name} ${s.vorname}`,
    klasse: s.klasse,
    quelle: 'klassenliste' as const,
  }));
```

- [ ] **Step 4: Rewrite KursAuswahl component**

New props interface:
```typescript
interface KursAuswahlProps {
  kursGruppen: KursGruppe[];
  ausgewaehlteSuS: Set<string>;
  onToggleKurs: (kursId: string) => void;
  onToggleSuS: (email: string) => void;
  onAlleAuswaehlen: () => void;
  onKeineAuswaehlen: () => void;
  onNeuLaden?: () => void;
}
```

Key rendering changes:
```tsx
// Kurs-Header with indeterminate checkbox
const KursCheckbox = ({ kursId, schueler }: { kursId: string; schueler: KlassenlistenSuS[] }) => {
  const ref = useRef<HTMLInputElement>(null);
  const emails = schueler.map(s => s.email);
  const ausgewaehlt = emails.filter(e => ausgewaehlteSuS.has(e)).length;
  const alle = ausgewaehlt === emails.length;
  const einige = ausgewaehlt > 0 && !alle;

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = einige;
  }, [einige]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={alle}
      onChange={() => onToggleKurs(kursId)}
    />
  );
};

// SuS always visible with individual checkboxes
{schueler.map(sus => (
  <label key={sus.email} className="flex items-center gap-2 py-0.5 cursor-pointer">
    <input
      type="checkbox"
      checked={ausgewaehlteSuS.has(sus.email)}
      onChange={() => onToggleSuS(sus.email)}
    />
    <span>{sus.name} {sus.vorname}</span>
  </label>
))}
```

- [ ] **Step 5: Verify full workflow**

Test:
- Click individual SuS → Kurs-Checkbox shows indeterminate
- Click Kurs-Checkbox → all SuS selected
- Click again → all deselected
- "Alle" selects everything, "Keine" deselects everything
- Participant list updates correctly
- Save + move to Lobby works

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: Kurs-Auswahl Redesign — Indeterminate-Checkboxen, SuS immer sichtbar (U1)"
```

---

## Task 10: U2 — Ergebnisse + Korrektur zusammenlegen

**Files:**
- Modify: `src/components/lp/DurchfuehrenDashboard.tsx:17-52` (tab types + config)
- Modify: `src/components/lp/BeendetPhase.tsx` (wrap in collapsible)
- Create: `src/components/lp/AuswertungTab.tsx` (new combined tab)

- [ ] **Step 1: Update tab types and config**

In `DurchfuehrenDashboard.tsx`:

```typescript
// OLD (line 17):
type DurchfuehrenTab = 'vorbereitung' | 'lobby' | 'live' | 'ergebnisse' | 'korrektur';

// NEW:
type DurchfuehrenTab = 'vorbereitung' | 'lobby' | 'live' | 'auswertung';

// OLD TAB_CONFIG (lines 19-25):
const TAB_CONFIG = [
  { key: 'vorbereitung', label: 'Vorbereitung', icon: '⚙️' },
  { key: 'lobby', label: 'Lobby', icon: '🟡' },
  { key: 'live', label: 'Live', icon: '🟢' },
  { key: 'ergebnisse', label: 'Ergebnisse', icon: '⏹' },
  { key: 'korrektur', label: 'Korrektur', icon: '✏️' },
];

// NEW:
const TAB_CONFIG = [
  { key: 'vorbereitung', label: 'Vorbereitung', icon: '⚙️' },
  { key: 'lobby', label: 'Lobby', icon: '🟡' },
  { key: 'live', label: 'Live', icon: '🟢' },
  { key: 'auswertung', label: 'Auswertung', icon: '✏️' },
];
```

- [ ] **Step 2: Add URL fallback for old tab names**

```typescript
// In the URL param reading logic:
const tabParam = searchParams.get('tab');
const tab = tabParam === 'ergebnisse' || tabParam === 'korrektur'
  ? 'auswertung'
  : tabParam as DurchfuehrenTab;
```

- [ ] **Step 3: Update phaseZuTab and istTabVerfuegbar**

```typescript
// phaseZuTab:
function phaseZuTab(phase: PruefungsPhase): DurchfuehrenTab {
  switch (phase) {
    case 'vorbereitung': return 'vorbereitung';
    case 'lobby': return 'lobby';
    case 'aktiv': return 'live';
    case 'beendet': return 'auswertung';
  }
}

// istTabVerfuegbar — auswertung replaces both ergebnisse + korrektur:
function istTabVerfuegbar(tab: DurchfuehrenTab, phase: PruefungsPhase): boolean {
  // auswertung always available (like korrektur was)
  if (tab === 'auswertung') return true;
  // ... rest unchanged
}
```

- [ ] **Step 4: Create AuswertungTab component**

```tsx
// src/components/lp/AuswertungTab.tsx
import { useState } from 'react';
import BeendetPhase from './BeendetPhase';
import KorrekturDashboard from './KorrekturDashboard';

interface Props {
  // Pass through all props needed by both children
  config: PruefungsConfig;
  schuelerStatus: SchuelerStatus[];
  fragen: Frage[];
  abgaben: any;
  // ... other props
}

export default function AuswertungTab(props: Props) {
  const [ergebnisseOffen, setErgebnisseOffen] = useState(true);

  return (
    <div className="space-y-4">
      {/* Accordion: Ergebnisse */}
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setErgebnisseOffen(!ergebnisseOffen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-750 text-left"
        >
          <span className="font-medium">📊 Ergebnisse & Übersicht</span>
          <span className="text-lg">{ergebnisseOffen ? '▾' : '▸'}</span>
        </button>
        {ergebnisseOffen && (
          <div className="p-4 border-t border-slate-700">
            <BeendetPhase {...beendetProps} />
          </div>
        )}
      </div>

      {/* Korrektur: always visible */}
      <KorrekturDashboard {...korrekturProps} />
    </div>
  );
}
```

- [ ] **Step 5: Wire AuswertungTab into DurchfuehrenDashboard**

Replace the separate `ergebnisse` and `korrektur` tab content rendering with single `auswertung` tab.

- [ ] **Step 6: Verify tab navigation**

Test:
- Phase progression advances to "Auswertung" tab after exam ends
- Accordion opens/closes correctly
- Old URLs `?tab=ergebnisse` and `?tab=korrektur` redirect to `auswertung`
- All export buttons still work
- Korrektur-Dashboard still fully functional

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: Ergebnisse + Korrektur zu Auswertung-Tab zusammengelegt (U2)"
```

---

## Task 11: U3 — Zeitzuschlag inline im Live-Monitoring

**Files:**
- Modify: `src/components/lp/AktivPhase.tsx:93-109` (table columns), `:265-279` (ZeitzuschlagEditor section)
- Modify: `src/components/lp/ZeitzuschlagEditor.tsx` (extract inline variant)

- [ ] **Step 1: Add Zeitzuschlag column to monitoring table**

In `AktivPhase.tsx`, add a compact column after the existing columns:

```tsx
// Table header (around line 93):
<th className="px-2 py-1.5 text-left text-xs">⏱ Zeit+</th>

// Table body per row:
<td className="px-2 py-1.5">
  <ZeitzuschlagInline
    email={schueler.email}
    name={schueler.name}
    minuten={config.zeitverlaengerungen?.[schueler.email] ?? 0}
    pruefungsEnde={config.endeUm}
    onAendern={(minuten) => {
      const neue = { ...config.zeitverlaengerungen, [schueler.email]: minuten };
      if (minuten === 0) delete neue[schueler.email];
      onConfigUpdate({ zeitverlaengerungen: neue });
    }}
  />
</td>
```

- [ ] **Step 2: Create ZeitzuschlagInline component**

```tsx
// Inline in AktivPhase.tsx or as small component:
function ZeitzuschlagInline({ email, minuten, pruefungsEnde, onAendern }: {
  email: string;
  minuten: number;
  pruefungsEnde?: string;
  onAendern: (minuten: number) => void;
}) {
  const [editieren, setEditieren] = useState(false);

  // Calculate countdown if in overtime
  const istUeberzeit = pruefungsEnde && new Date() > new Date(pruefungsEnde);
  const zuschlagEnde = pruefungsEnde && minuten > 0
    ? new Date(new Date(pruefungsEnde).getTime() + minuten * 60000)
    : null;
  const verbleibend = zuschlagEnde
    ? Math.max(0, Math.floor((zuschlagEnde.getTime() - Date.now()) / 1000))
    : null;

  if (minuten === 0) {
    return (
      <button
        onClick={() => onAendern(5)}
        className="text-xs text-slate-500 hover:text-blue-400"
        title="+5 Minuten Zeitzuschlag"
      >
        +5
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {istUeberzeit && verbleibend !== null && verbleibend > 0 ? (
        <span className="text-amber-400 font-mono">
          ⏱ {Math.floor(verbleibend / 60)}:{String(verbleibend % 60).padStart(2, '0')}
        </span>
      ) : (
        <span className="text-blue-400">+{minuten}′</span>
      )}
      <button
        onClick={() => onAendern(minuten + 5)}
        className="text-slate-500 hover:text-blue-400"
        title="+5 Minuten hinzufügen"
      >
        +5
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Remove or collapse old ZeitzuschlagEditor section**

In AktivPhase.tsx, remove the collapsible `zeigZeitzuschlag` section (around lines 265-279) since time extensions are now inline.

- [ ] **Step 4: Add countdown timer refresh**

The countdown needs to tick. Add a 1-second interval when any student is in overtime:

```typescript
// In AktivPhase:
const [tick, setTick] = useState(0);
useEffect(() => {
  const hatUeberzeit = schuelerStatus.some(s => /* in overtime with extension */);
  if (!hatUeberzeit) return;
  const interval = setInterval(() => setTick(t => t + 1), 1000);
  return () => clearInterval(interval);
}, [schuelerStatus]);
```

- [ ] **Step 5: Verify**

Test:
- "+5" button appears for students without extension
- Click adds 5 minutes, shows "+5′" badge
- Click again adds another 5 (shows "+10′")
- During overtime: countdown ticks down
- Table doesn't break layout on normal screen

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: Zeitzuschlag inline im Live-Monitoring mit Countdown (U3)"
```

---

## Task 12: U4 — Farbpalette erweitern

**Files:**
- Modify: `src/components/fragetypen/zeichnen/ZeichnenFrage.tsx:45` (verfuegbareFarben)
- Modify: `src/components/fragetypen/zeichnen/ZeichnenToolbar.tsx` (color swatch size if needed)
- Modify: PDF toolbar (analogous)

- [ ] **Step 1: Update color list in ZeichnenFrage**

Find where `verfuegbareFarben` is defined (from canvasConfig or defaults):

```typescript
// Expanded color palette:
const STANDARD_FARBEN = [
  '#000000', // Schwarz (Default)
  '#DC2626', // Rot kräftig
  '#2563EB', // Blau kräftig
  '#16A34A', // Grün kräftig
  '#F59E0B', // Orange/Amber
  // Pastell für Markieren:
  '#FEF08A', // Gelb Pastell
  '#FBCFE8', // Rosa Pastell
  '#BAE6FD', // Hellblau Pastell
  '#BBF7D0', // Hellgrün Pastell
];
```

Set as default when canvasConfig doesn't specify colors:
```typescript
const farben = canvasConfig?.verfuegbareFarben ?? STANDARD_FARBEN;
```

Set Schwarz as default:
```typescript
const [aktiveFarbe, setAktiveFarbe] = useState(farben[0]); // #000000
```

- [ ] **Step 2: Apply same palette to PDF toolbar**

Find PDFToolbar and update its color list analogously.

- [ ] **Step 3: Verify**

- Zeichnen: 9 colors visible, Schwarz default, kräftige + Pastell
- PDF: Same palette available
- Existing drawings with old colors still render correctly

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Erweiterte Farbpalette — kräftige + Pastellfarben, Schwarz als Default (U4)"
```

---

## Task 13: U5 — Monitoring-Infos in Lobby

**Files:**
- Modify: `src/components/lp/LobbyPhase.tsx` (127 lines)

- [ ] **Step 1: Add monitoring data to Lobby table**

The `LobbyPhase` already has `schuelerStatus[]` (or can get it from parent). Extend the "bereite" list with device and control info:

```tsx
// In the bereite section (around lines 40-60), add columns:
{bereite.map(s => (
  <div key={s.email} className="flex items-center justify-between py-1">
    <div className="flex items-center gap-2">
      <span className="text-green-500">●</span>
      <span>{s.name}</span>
      <span className="text-xs text-slate-500">{s.klasse}</span>
    </div>
    <div className="flex items-center gap-3 text-xs text-slate-400">
      <span>{s.geraet === 'tablet' ? '📱' : '💻'}</span>
      <span>{stufeIcon(s.kontrollStufe)}</span>
      {s.sebVersion && <span className="text-green-600">SEB</span>}
    </div>
  </div>
))}
```

- [ ] **Step 2: Ensure schuelerStatus is passed to LobbyPhase**

Check `DurchfuehrenDashboard.tsx` — if `schuelerStatus` isn't already passed to `LobbyPhase`, add it:

```tsx
<LobbyPhase
  // ... existing props
  schuelerStatus={daten?.schueler ?? []}
/>
```

Update `LobbyPhase` props type accordingly.

- [ ] **Step 3: Verify**

- Students in Lobby show device icon (laptop/tablet)
- Control level indicator visible
- SEB badge if applicable
- Non-connected students still show as grey/pending

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Monitoring-Infos (Gerät, Kontrolle, SEB) in Lobby sichtbar (U5)"
```

---

## Task 14: U6 — Demo-Prüfung aktualisieren

**Files:**
- Modify: `src/data/demoFragen.ts`
- Modify: `src/components/lp/DurchfuehrenDashboard.tsx:217-248` (demo config)

- [ ] **Step 1: Add missing question types to demoFragen.ts**

Add demo questions for types not yet covered:
- `visualisierung`/`zeichnen` (drawing question with background image)
- `aufgabengruppe` (with 2-3 Teilfragen)
- `pdf` (PDF annotation question)
- FiBu types: `buchungssatz`, `t-konto`, `bilanz-er`, `kontenbestimmung`

Each question needs: id, typ, version, fachbereich, thema, bloom, punkte, fragetext, and type-specific fields.

- [ ] **Step 2: Update demo config in DurchfuehrenDashboard**

Add the new question IDs to `abschnitte[].fragenIds` in the inline demo config.

- [ ] **Step 3: Verify demo exam**

Load demo exam, go through all questions, verify each type renders correctly.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Demo-Prüfung aktualisiert — alle Fragetypen abgedeckt (U6)"
```

---

## Final: Build + Deploy

- [ ] **Step 1: Run build**

```bash
cd Pruefung && npm run build
```

Fix any TypeScript errors.

- [ ] **Step 2: Run local preview**

```bash
npm run preview
```

Quick smoke test of key flows.

- [ ] **Step 3: Final commit + push**

```bash
git add -A
git commit -m "Session 11: 11 Bugfixes + 6 UX-Verbesserungen"
git push
```

- [ ] **Step 4: Update HANDOFF.md**

Document all changes in the session table.
