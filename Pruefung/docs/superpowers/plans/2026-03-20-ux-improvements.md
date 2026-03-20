# UX-Verbesserungen Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Einheitlicher Header, bessere Fragenbank-Interaktion, Layout-Fixes, Duplizieren, Audio-Aufnahme im Editor, Materialien-Erweiterung.

**Architecture:** Neues `LPHeader`-Shared-Component für alle LP-Ansichten. Fragenbank bekommt Ziel-Leiste und +/– Buttons. BewertungsrasterEditor wird aus FragenEditor extrahiert. Materialien-Typ wird um Audio/Video/Embed erweitert.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, Google Apps Script Backend

**Spec:** `docs/superpowers/specs/2026-03-20-ux-improvements-design.md`

---

### Task 1: LPHeader — Shared Header Component

**Files:**
- Create: `src/components/lp/LPHeader.tsx`
- Modify: `src/components/lp/LPStartseite.tsx`
- Modify: `src/components/lp/PruefungsComposer.tsx`
- Modify: `src/components/lp/MonitoringDashboard.tsx`
- Modify: `src/components/lp/KorrekturDashboard.tsx`

- [ ] **Step 1: Create LPHeader component**

Create `src/components/lp/LPHeader.tsx`:

```tsx
import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore.ts'
import ThemeToggle from '../ThemeToggle.tsx'

interface Props {
  titel: string
  untertitel?: string
  zurueck?: () => void
  statusText?: string
  ansichtsButtons?: React.ReactNode
  onFragenbank?: () => void
  onHilfe?: () => void
  fragebankOffen?: boolean
  hilfeOffen?: boolean
}

export default function LPHeader({ titel, untertitel, zurueck, statusText, ansichtsButtons, onFragenbank, onHilfe, fragebankOffen, hilfeOffen }: Props) {
  const abmelden = useAuthStore((s) => s.abmelden)
  const user = useAuthStore((s) => s.user)

  // ESC-Handler: schliesst oberstes Panel
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key !== 'Escape') return
      if (fragebankOffen && onFragenbank) onFragenbank()
      else if (hilfeOffen && onHilfe) onHilfe()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [fragebankOffen, hilfeOffen, onFragenbank, onHilfe])

  const buttonClass = 'px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer'

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-2.5 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {zurueck && (
            <button onClick={zurueck} className={buttonClass}>
              ← Zurück
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">{titel}</h1>
            {untertitel && (
              <p className="text-sm text-slate-500 dark:text-slate-400">{untertitel}</p>
            )}
          </div>
          {statusText && (
            <span className="text-sm text-green-600 dark:text-green-400">{statusText}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {ansichtsButtons}
          {ansichtsButtons && (
            <span className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1" />
          )}
          {onFragenbank && (
            <button onClick={onFragenbank} className={buttonClass}>Fragenbank</button>
          )}
          {onHilfe && (
            <button onClick={onHilfe} className={buttonClass}>Hilfe</button>
          )}
          <button onClick={abmelden} className="px-2 py-1.5 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
            Abmelden
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Replace header in LPStartseite**

In `src/components/lp/LPStartseite.tsx`:
- Add import: `import LPHeader from './LPHeader.tsx'`
- Remove import of `ThemeToggle`
- Replace the entire `<header>...</header>` block (lines ~140–181) with:

```tsx
<LPHeader
  titel="Prüfungsplattform"
  untertitel={user ? `${user.name} · Lehrperson` : undefined}
  ansichtsButtons={
    <button onClick={handleNeue} className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
      + Neue Prüfung
    </button>
  }
  onFragenbank={() => { setZeigHilfe(false); setZeigFragenbank(true) }}
  onHilfe={() => { setZeigFragenbank(false); setZeigHilfe(true) }}
  fragebankOffen={zeigFragenbank}
  hilfeOffen={zeigHilfe}
/>
```

- [ ] **Step 3: Replace header in PruefungsComposer**

In `src/components/lp/PruefungsComposer.tsx`:
- Add import: `import LPHeader from './LPHeader.tsx'`
- Remove import of `ThemeToggle`
- Add state: `const [zeigHilfe, setZeigHilfe] = useState(false)` (after existing state declarations)
- Replace the `<header>...</header>` block (lines ~252–287) with:

```tsx
<LPHeader
  titel={config ? 'Prüfung bearbeiten' : 'Neue Prüfung'}
  zurueck={onZurueck}
  statusText={
    autoSaveStatus === 'gespeichert' && speicherStatus === 'idle' ? 'Automatisch gespeichert ✓' :
    speicherStatus === 'erfolg' ? 'Gespeichert ✓' :
    speicherStatus === 'fehler' ? 'Fehler beim Speichern' : undefined
  }
  ansichtsButtons={
    <button
      onClick={handleSpeichern}
      disabled={speicherStatus === 'speichern' || !pruefung.titel.trim()}
      className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
    >
      {speicherStatus === 'speichern' ? 'Speichern...' : 'Speichern'}
    </button>
  }
  onFragenbank={() => { setZeigHilfe(false); setZeigFragenBrowser(!zeigFragenBrowser) }}
  onHilfe={() => { setZeigFragenBrowser(false); setZeigHilfe(!zeigHilfe) }}
  fragebankOffen={zeigFragenBrowser}
  hilfeOffen={zeigHilfe}
/>
```

- Keep the tabs `<div>` below the header as-is (it was below `</header>` anyway).
- Add HilfeSeite rendering at bottom of component (alongside FragenBrowser):

```tsx
{zeigHilfe && <HilfeSeite onSchliessen={() => setZeigHilfe(false)} />}
```

- Add import: `import HilfeSeite from './HilfeSeite.tsx'`

- [ ] **Step 4: Replace header in MonitoringDashboard**

In `src/components/lp/MonitoringDashboard.tsx`:
- Add import: `import LPHeader from './LPHeader.tsx'`
- Add imports for panels: `import FragenBrowser from './FragenBrowser.tsx'` and `import HilfeSeite from './HilfeSeite.tsx'`
- Remove import of `ThemeToggle`
- Add state: `const [zeigFragenbank, setZeigFragenbank] = useState(false)` and `const [zeigHilfe, setZeigHilfe] = useState(false)`
- Replace the `<header>...</header>` block (lines ~231–296) with:

```tsx
<LPHeader
  titel="Prüfungs-Monitoring"
  untertitel={`${daten.pruefungTitel}${istDemoModus ? ' (Demo)' : ''}`}
  zurueck={() => { window.history.pushState({}, '', window.location.pathname); window.location.reload() }}
  ansichtsButtons={<>
    <button
      onClick={() => setAutoRefresh(!autoRefresh)}
      title={autoRefresh ? 'Auto-Refresh pausieren' : 'Auto-Refresh aktivieren'}
      className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${autoRefresh ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300' : 'border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400'}`}
    >
      <span className={`inline-block w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
      Live
    </button>
    <button onClick={ladeDaten} title="Jetzt aktualisieren" className="px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
      ↻
    </button>
  </>}
  onFragenbank={() => { setZeigHilfe(false); setZeigFragenbank(!zeigFragenbank) }}
  onHilfe={() => { setZeigFragenbank(false); setZeigHilfe(!zeigHilfe) }}
  fragebankOffen={zeigFragenbank}
  hilfeOffen={zeigHilfe}
/>
```

- Add panel rendering at bottom of component return (before closing `</div>`):

```tsx
{zeigFragenbank && <FragenBrowser onSchliessen={() => setZeigFragenbank(false)} />}
{zeigHilfe && <HilfeSeite onSchliessen={() => setZeigHilfe(false)} />}
```

- [ ] **Step 5: Replace header in KorrekturDashboard**

In `src/components/lp/KorrekturDashboard.tsx`:
- Same pattern as MonitoringDashboard: import LPHeader, FragenBrowser, HilfeSeite
- Remove ThemeToggle import
- Add state for panels
- Replace header, move Freigeben toggle to `ansichtsButtons`
- Add panel rendering at bottom

- [ ] **Step 6: Build and verify**

Run: `cd Pruefung && npm run build`
Expected: No TypeScript errors, successful build.

- [ ] **Step 7: Commit**

```bash
git add src/components/lp/LPHeader.tsx src/components/lp/LPStartseite.tsx src/components/lp/PruefungsComposer.tsx src/components/lp/MonitoringDashboard.tsx src/components/lp/KorrekturDashboard.tsx
git commit -m "Pruefung: einheitlicher LPHeader für alle LP-Ansichten"
```

---

### Task 2: Panel-Breiten & ThemeToggle entfernen

**Files:**
- Modify: `src/components/lp/FragenBrowser.tsx`
- Modify: `src/components/lp/HilfeSeite.tsx`

- [ ] **Step 1: FragenBrowser — Breite, Buttons, ThemeToggle**

In `src/components/lp/FragenBrowser.tsx`:
- Change initial width from `672` to `1008` (line ~42: `useState(672)` → `useState(1008)`)
- Change min width from `400` to `600` in resize handler
- Remove `ThemeToggle` import and usage
- Reorder header buttons to: `+ Neue Frage` · `Import` · `Export` · `×`
  - Currently order is: Export, Import via KI, + Neue Frage, ThemeToggle, ×
  - New order: + Neue Frage, Import via KI, Export, ×

- [ ] **Step 2: HilfeSeite — Breite, ThemeToggle**

In `src/components/lp/HilfeSeite.tsx`:
- Change initial width from `768` to `1152` (line ~35)
- Change min width in resize handler to `600`
- Remove `ThemeToggle` import and usage from header

- [ ] **Step 3: Build and verify**

Run: `cd Pruefung && npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/components/lp/FragenBrowser.tsx src/components/lp/HilfeSeite.tsx
git commit -m "Pruefung: Fragenbank/Hilfe breiter, ThemeToggle entfernt, Buttons umgeordnet"
```

---

### Task 3: BerechnungEditor Layout-Fix

**Files:**
- Modify: `src/components/lp/frageneditor/BerechnungEditor.tsx`

- [ ] **Step 1: Fix field widths**

In `BerechnungEditor.tsx`:

Change the Hilfsmittel wrapper (line 44) from:
```tsx
<div className="flex-1">
```
to:
```tsx
<div className="w-64">
```

Change the Bezeichnung input (line ~76) from:
```tsx
className="input-field flex-1 min-w-0"
```
to:
```tsx
className="input-field w-48 shrink-0"
```

Change the Ergebnis input (line ~83) from:
```tsx
className="input-field w-20 text-center font-mono shrink-0"
```
to:
```tsx
className="input-field flex-1 min-w-0 text-center font-mono"
```

Change the Toleranz input (line ~91) from:
```tsx
className="input-field w-20 text-center shrink-0"
```
to:
```tsx
className="input-field flex-1 min-w-0 text-center"
```

Also update the column headers (lines ~61–66) to match:
- Bezeichnung: `w-48` statt `flex-1 min-w-0`
- Ergebnis: `flex-1` statt `w-20`
- Toleranz: `flex-1` statt `w-20`
- Einheit: `w-16` (bleibt)

- [ ] **Step 2: Build and verify**

Run: `cd Pruefung && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/lp/frageneditor/BerechnungEditor.tsx
git commit -m "Pruefung: BerechnungEditor Layout-Fix — Feldgrössen getauscht"
```

---

### Task 4: BewertungsrasterEditor extrahieren + Styling

**Files:**
- Create: `src/components/lp/frageneditor/BewertungsrasterEditor.tsx`
- Modify: `src/components/lp/frageneditor/FragenEditor.tsx`

- [ ] **Step 1: Create BewertungsrasterEditor**

Extract lines ~1200–1348 from FragenEditor.tsx into a new component. The component receives all needed state as props:

Create `src/components/lp/frageneditor/BewertungsrasterEditor.tsx`:

```tsx
import { useState } from 'react'
import type { Bewertungskriterium } from '../../../types/fragen.ts'

interface VorlagenMap {
  [name: string]: Bewertungskriterium[]
}

const DEFAULT_VORLAGEN: VorlagenMap = {
  'Standard (3 Kriterien)': [
    { beschreibung: 'Inhaltliche Richtigkeit', punkte: 2 },
    { beschreibung: 'Vollständigkeit', punkte: 1 },
    { beschreibung: 'Fachsprache / Präzision', punkte: 1 },
  ],
  'Erörterung / Argumentation': [
    { beschreibung: 'These / Standpunkt klar formuliert', punkte: 1 },
    { beschreibung: 'Argumente schlüssig und belegt', punkte: 2 },
    { beschreibung: 'Gegenargumente berücksichtigt', punkte: 1 },
    { beschreibung: 'Schlussfolgerung logisch abgeleitet', punkte: 1 },
  ],
  'Fallanalyse (Recht)': [
    { beschreibung: 'Sachverhalt korrekt erfasst', punkte: 1 },
    { beschreibung: 'Rechtsnorm(en) korrekt identifiziert', punkte: 1 },
    { beschreibung: 'Subsumtion / Anwendung auf Fall', punkte: 2 },
    { beschreibung: 'Ergebnis / Rechtsfolge korrekt', punkte: 1 },
  ],
}

interface Props {
  bewertungsraster: Bewertungskriterium[]
  setBewertungsraster: (raster: Bewertungskriterium[]) => void
  /** KI-Buttons (Generieren, Prüfen & Verbessern) */
  kiButtons?: React.ReactNode
}

export default function BewertungsrasterEditor({ bewertungsraster, setBewertungsraster, kiButtons }: Props) {
  const [vorlagen, setVorlagen] = useState<VorlagenMap>(() => ladeVorlagen())
  const [vorlageName, setVorlageName] = useState('')

  function ladeVorlagen(): VorlagenMap {
    try {
      const raw = localStorage.getItem('bewertungsraster-vorlagen')
      return raw ? { ...DEFAULT_VORLAGEN, ...JSON.parse(raw) } : { ...DEFAULT_VORLAGEN }
    } catch {
      return { ...DEFAULT_VORLAGEN }
    }
  }

  function speichereVorlagen(v: VorlagenMap): void {
    const custom: VorlagenMap = {}
    for (const [k, val] of Object.entries(v)) {
      if (!(k in DEFAULT_VORLAGEN)) custom[k] = val
    }
    try {
      localStorage.setItem('bewertungsraster-vorlagen', JSON.stringify(custom))
    } catch { /* quota exceeded — ignore */ }
  }

  function handleSpeichereVorlage(): void {
    const name = vorlageName.trim()
    if (!name || bewertungsraster.length === 0) return
    const neu = { ...vorlagen, [name]: [...bewertungsraster] }
    setVorlagen(neu)
    speichereVorlagen(neu)
    setVorlageName('')
  }

  function handleLoescheVorlage(name: string): void {
    const neu = { ...vorlagen }
    delete neu[name]
    setVorlagen(neu)
    speichereVorlagen(neu)
  }

  const customVorlagen = Object.keys(vorlagen).filter((k) => !(k in DEFAULT_VORLAGEN))
  const btnClass = 'px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer'

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Bewertungsraster
        </label>
        <div className="flex items-center gap-1.5 flex-wrap">
          {kiButtons}

          {/* Vorlage laden */}
          <select
            className={`${btnClass} bg-white dark:bg-slate-700`}
            value=""
            onChange={(e) => {
              const v = vorlagen[e.target.value]
              if (v) setBewertungsraster([...v])
            }}
          >
            <option value="">Vorlage laden...</option>
            {Object.keys(vorlagen).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          {/* Speichern */}
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={vorlageName}
              onChange={(e) => setVorlageName(e.target.value)}
              placeholder="Vorlagenname"
              className="input-field w-28 text-xs py-1"
            />
            <button
              onClick={handleSpeichereVorlage}
              disabled={!vorlageName.trim() || bewertungsraster.length === 0}
              className={`${btnClass} disabled:opacity-40`}
            >
              Speichern
            </button>
          </div>

          {/* Löschen — gleicher Stil wie Speichern */}
          {customVorlagen.length > 0 && (
            <select
              className={`${btnClass} bg-white dark:bg-slate-700 text-red-500 dark:text-red-400`}
              value=""
              onChange={(e) => {
                if (e.target.value) handleLoescheVorlage(e.target.value)
              }}
            >
              <option value="">Löschen...</option>
              {customVorlagen.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          )}

          {/* Zurücksetzen */}
          <button
            onClick={() => setBewertungsraster([
              { beschreibung: 'Inhaltliche Richtigkeit', punkte: 2 },
              { beschreibung: 'Vollständigkeit', punkte: 1 },
              { beschreibung: 'Fachsprache / Präzision', punkte: 1 },
            ])}
            className={btnClass}
          >
            Zurücksetzen
          </button>
        </div>
      </div>

      {/* Kriterien-Tabelle */}
      <div className="space-y-1.5">
        {bewertungsraster.length > 0 && (
          <div className="flex gap-2 items-center text-xs text-slate-500 dark:text-slate-400">
            <span className="flex-1 min-w-0">Kriterium</span>
            <span className="w-14 text-center">Pkt.</span>
            <span className="w-7" />
          </div>
        )}
        {bewertungsraster.map((k, i) => (
          <div key={i} className="flex items-start gap-2">
            <input
              type="text"
              value={k.beschreibung}
              onChange={(e) => {
                const neu = [...bewertungsraster]
                neu[i] = { ...neu[i], beschreibung: e.target.value }
                setBewertungsraster(neu)
              }}
              className="input-field flex-1 min-w-0"
              placeholder="Kriterium"
            />
            <input
              type="number"
              value={k.punkte}
              onChange={(e) => {
                const neu = [...bewertungsraster]
                neu[i] = { ...neu[i], punkte: parseFloat(e.target.value) || 0 }
                setBewertungsraster(neu)
              }}
              className="input-field w-14 text-center"
              min={0}
              step={0.5}
            />
            <button
              onClick={() => setBewertungsraster(bewertungsraster.filter((_, j) => j !== i))}
              className="mt-1.5 w-7 h-7 text-red-400 hover:text-red-600 dark:hover:text-red-300 cursor-pointer text-sm shrink-0"
            >×</button>
          </div>
        ))}
      </div>

      <button
        onClick={() => setBewertungsraster([...bewertungsraster, { beschreibung: '', punkte: 1 }])}
        className="mt-2 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
      >
        + Kriterium hinzufügen
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Replace Bewertungsraster in FragenEditor**

In `src/components/lp/frageneditor/FragenEditor.tsx`:
- Add import: `import BewertungsrasterEditor from './BewertungsrasterEditor.tsx'`
- Remove the entire Bewertungsraster section (approximately lines 1200–1348: everything from the `{/* Bewertungsraster Vorlagen */}` comment to the `+ Kriterium hinzufügen` button)
- Remove the `DEFAULT_VORLAGEN`, `ladeVorlagen`, `speichereVorlagen` functions and related state (`vorlagen`, `vorlageName`)
- Replace with:

```tsx
<BewertungsrasterEditor
  bewertungsraster={bewertungsraster}
  setBewertungsraster={setBewertungsraster}
/>
```

- [ ] **Step 3: Build and verify**

Run: `cd Pruefung && npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/components/lp/frageneditor/BewertungsrasterEditor.tsx src/components/lp/frageneditor/FragenEditor.tsx
git commit -m "Pruefung: BewertungsrasterEditor extrahiert, Löschen-Button kompakter"
```

---

### Task 5: Bewertungsraster KI-Buttons + Apps Script

**Files:**
- Modify: `src/components/lp/frageneditor/FragenEditor.tsx`
- Modify: `src/services/apiService.ts`
- Modify: `apps-script-code.js`

- [ ] **Step 1: Add KI actions to apiService**

In `src/services/apiService.ts`, the `kiAssistent` function (line ~574) already supports arbitrary actions. No new function needed — we'll call `kiAssistent(email, 'bewertungsrasterGenerieren', payload)` and `kiAssistent(email, 'bewertungsrasterVerbessern', payload)` directly.

- [ ] **Step 2: Add KI buttons to FragenEditor**

In `src/components/lp/frageneditor/FragenEditor.tsx`, where `<BewertungsrasterEditor>` is rendered, add the `kiButtons` prop. The KI buttons follow the same pattern as the existing `titelRechts` buttons on Fragetyp-Editoren (e.g. BerechnungEditor):

```tsx
<BewertungsrasterEditor
  bewertungsraster={bewertungsraster}
  setBewertungsraster={setBewertungsraster}
  kiButtons={
    apiService.istKonfiguriert() && !istDemoModus && user ? <>
      <button
        onClick={async () => {
          const result = await apiService.kiAssistent(user.email, 'bewertungsrasterGenerieren', {
            fragetext, frageTyp: typ, punkte, musterlosung, bloom,
          })
          if (result?.bewertungsraster) setBewertungsraster(result.bewertungsraster)
        }}
        disabled={!fragetext.trim()}
        className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
        title="Fragetext nötig"
      >
        Generieren
      </button>
      <button
        onClick={async () => {
          const result = await apiService.kiAssistent(user.email, 'bewertungsrasterVerbessern', {
            fragetext, frageTyp: typ, punkte, musterlosung, bloom, bewertungsraster,
          })
          if (result?.bewertungsraster) setBewertungsraster(result.bewertungsraster)
        }}
        disabled={!fragetext.trim() || bewertungsraster.length === 0}
        className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
        title="Fragetext nötig"
      >
        Prüfen &amp; Verbessern
      </button>
    </> : undefined
  }
/>
```

Note: `fragetext`, `typ`, `punkte`, `musterlosung`, `bloom`, `bewertungsraster`, `user`, `istDemoModus` are all already in scope in FragenEditor.

- [ ] **Step 3: Add Apps Script cases**

In `apps-script-code.js`, add two new cases inside the `kiAssistentEndpoint` function's switch statement (after existing cases like `klassifiziereFrage`):

```javascript
case 'bewertungsrasterGenerieren': {
  const { fragetext, frageTyp, punkte, musterlosung, bloom } = daten;
  const systemPrompt = `Du bist ein Experte für Prüfungsdidaktik am Gymnasium (Schweiz). Erstelle ein Bewertungsraster für die folgende Prüfungsfrage. Das Raster soll klar, messbar und fair sein. Die Summe der Punkte muss genau ${punkte} ergeben.`;
  const userPrompt = `Fragetyp: ${frageTyp}\nBloom-Stufe: ${bloom}\nGesamtpunkte: ${punkte}\nFragetext: ${fragetext}\n${musterlosung ? `Musterlösung: ${musterlosung}` : ''}\n\nErstelle ein Bewertungsraster als JSON: { "bewertungsraster": [{ "beschreibung": "...", "punkte": N, "stichworte": ["..."] }] }`;
  const antwort = rufeClaudeAuf(systemPrompt, userPrompt);
  return antwort;
}

case 'bewertungsrasterVerbessern': {
  const { fragetext, frageTyp, punkte, musterlosung, bloom, bewertungsraster } = daten;
  const systemPrompt = `Du bist ein Experte für Prüfungsdidaktik am Gymnasium (Schweiz). Verbessere das bestehende Bewertungsraster: mach Kriterien messbarer, klarer, fairer. Die Summe der Punkte muss genau ${punkte} ergeben.`;
  const userPrompt = `Fragetyp: ${frageTyp}\nBloom-Stufe: ${bloom}\nGesamtpunkte: ${punkte}\nFragetext: ${fragetext}\n${musterlosung ? `Musterlösung: ${musterlosung}` : ''}\n\nBestehendes Raster:\n${JSON.stringify(bewertungsraster, null, 2)}\n\nVerbessere das Raster. Antworte als JSON: { "bewertungsraster": [{ "beschreibung": "...", "punkte": N, "stichworte": ["..."] }], "aenderungen": "Kurze Beschreibung der Änderungen" }`;
  const antwort = rufeClaudeAuf(systemPrompt, userPrompt);
  return antwort;
}
```

- [ ] **Step 4: Build and verify**

Run: `cd Pruefung && npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/components/lp/frageneditor/FragenEditor.tsx apps-script-code.js
git commit -m "Pruefung: KI-Buttons für Bewertungsraster (Generieren + Verbessern)"
```

---

### Task 6: Prüfung duplizieren

**Files:**
- Modify: `src/components/lp/LPStartseite.tsx`

- [ ] **Step 1: Add duplicate function and button**

In `src/components/lp/LPStartseite.tsx`:

Add a `handleDuplizieren` function (near other handlers like `handleNeue`):

```tsx
async function handleDuplizieren(config: PruefungsConfig): Promise<void> {
  const kopie: PruefungsConfig = {
    ...config,
    id: '',
    titel: `Kopie von ${config.titel}`,
    klasse: '',
    erlaubteKlasse: '',
    datum: new Date().toISOString().split('T')[0],
  }
  // ID generieren
  kopie.id = `${kopie.titel.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`

  if (!istDemoModus && apiService.istKonfiguriert() && user) {
    await apiService.speichereConfig(user.email, kopie)
  }

  setEditConfig(kopie)
  setAnsicht('composer')
}
```

In the PruefungsKarte component (where Bearbeiten/Monitoring/Korrektur buttons are rendered), add a "Duplizieren" button:

```tsx
<button
  onClick={() => handleDuplizieren(config)}
  className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
>
  Duplizieren
</button>
```

- [ ] **Step 2: Build and verify**

Run: `cd Pruefung && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/lp/LPStartseite.tsx
git commit -m "Pruefung: Prüfung duplizieren"
```

---

### Task 7: Fragenbank — Klickverhalten & Ziel-Leiste

**Files:**
- Modify: `src/components/lp/FragenBrowser.tsx`
- Modify: `src/components/lp/PruefungsComposer.tsx`

This is the most complex task. The FragenBrowser needs:
1. A "Ziel" bar showing which exam questions are added to
2. +/– buttons instead of "Bearbeiten" button
3. Click on question opens editor (not closes panel)
4. Visual marking for questions in the target exam

- [ ] **Step 1: Add target-related props to FragenBrowser**

In `src/components/lp/FragenBrowser.tsx`, extend the Props interface:

```tsx
interface Props {
  onSchliessen: () => void
  // Bestehende Props für Composer-Modus
  pruefungsFragenIds?: string[]
  onFrageHinzufuegen?: (frageIds: string[]) => void
  onFrageEntfernen?: (frageId: string) => void
  // Ziel-Anzeige
  zielPruefungTitel?: string
  zielAbschnittTitel?: string
}
```

- [ ] **Step 2: Add Ziel-Leiste and +/– buttons**

At the top of the panel (after the backdrop, before the header), add the Ziel-Leiste:

```tsx
{zielPruefungTitel && (
  <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 flex items-center justify-between">
    <span className="text-xs text-green-700 dark:text-green-300">
      Ziel: <strong>{zielPruefungTitel}</strong>
      {zielAbschnittTitel && <> · {zielAbschnittTitel}</>}
    </span>
    {/* "ändern" link — for future implementation */}
  </div>
)}
```

In the question card rendering (both DetailKarte and KompaktZeile), replace the "Bearbeiten" button with +/– button:

```tsx
{/* +/– Button links */}
{onFrageHinzufuegen && (
  pruefungsFragenIds?.includes(frage.id) ? (
    <button
      onClick={(e) => { e.stopPropagation(); onFrageEntfernen?.(frage.id) }}
      className="w-6 h-6 rounded-full border border-red-400 bg-red-50 dark:bg-red-900/30 text-red-500 text-sm flex items-center justify-center shrink-0 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50"
      title="Aus Prüfung entfernen"
    >–</button>
  ) : (
    <button
      onClick={(e) => { e.stopPropagation(); onFrageHinzufuegen([frage.id]) }}
      className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-500 text-slate-500 text-sm flex items-center justify-center shrink-0 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600"
      title="Zur Prüfung hinzufügen"
    >+</button>
  )
)}
```

Make the question card clickable (opens editor):

```tsx
<div
  onClick={() => setEditFrage(frage)}
  className={`cursor-pointer ... ${pruefungsFragenIds?.includes(frage.id) ? 'border-2 border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10' : ''}`}
>
```

Add "✓ In dieser Prüfung" indicator for contained questions:

```tsx
{pruefungsFragenIds?.includes(frage.id) && (
  <span className="text-[10px] text-green-600 dark:text-green-400">✓ In dieser Prüfung</span>
)}
```

Remove the old "Bearbeiten" button.

- [ ] **Step 3: Pass props from PruefungsComposer**

In `src/components/lp/PruefungsComposer.tsx`, where `<FragenBrowser>` is rendered, add the new props:

```tsx
{zeigFragenBrowser && (
  <FragenBrowser
    onSchliessen={() => setZeigFragenBrowser(false)}
    pruefungsFragenIds={pruefung.abschnitte.flatMap((a) => a.fragenIds)}
    onFrageHinzufuegen={handleFragenHinzufuegen}
    onFrageEntfernen={handleFrageEntfernen}
    zielPruefungTitel={pruefung.titel || 'Neue Prüfung'}
    zielAbschnittTitel={pruefung.abschnitte[zielAbschnittIndex]?.titel}
  />
)}
```

- [ ] **Step 4: Build and verify**

Run: `cd Pruefung && npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/components/lp/FragenBrowser.tsx src/components/lp/PruefungsComposer.tsx
git commit -m "Pruefung: Fragenbank Klickverhalten — +/– Buttons, Ziel-Leiste, Klick öffnet Editor"
```

---

### Task 8: Audio-Aufnahme im AnhangEditor

**Files:**
- Modify: `src/components/lp/frageneditor/AnhangEditor.tsx`

- [ ] **Step 1: Add AudioRecorder to AnhangEditor**

In `src/components/lp/frageneditor/AnhangEditor.tsx`:

Add import:
```tsx
import AudioRecorder from '../../AudioRecorder.tsx'
```

Add state:
```tsx
const [aufnahmeModus, setAufnahmeModus] = useState(false)
```

Add a "🎤 Aufnehmen" button next to the existing "Datei hochladen" and "URL einbetten" buttons:

```tsx
<button
  onClick={() => setAufnahmeModus(!aufnahmeModus)}
  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
  title="Audio aufnehmen"
>
  🎤 Aufnehmen
</button>
```

Below the buttons row, show the AudioRecorder when `aufnahmeModus` is true:

```tsx
{aufnahmeModus && (
  <div className="mt-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
    <AudioRecorder
      onSpeichern={async (blob) => {
        const file = new File([blob], `aufnahme-${Date.now()}.webm`, { type: blob.type })
        // Use existing file handling — add to neueDateien
        onAnhangHinzu(file)
        setAufnahmeModus(false)
      }}
    />
  </div>
)}
```

Note: `onAnhangHinzu` is the existing prop that handles new file additions. Check the exact prop name — it may be called differently. The AnhangEditor receives files via the drag-drop handler which calls the parent's add function. We need to check how new files are passed to the parent.

Looking at AnhangEditor.tsx: the component manages `neueDateien` state internally and calls `onUpload` prop. The AudioRecorder's `onSpeichern` should add the file to `neueDateien`:

```tsx
{aufnahmeModus && (
  <div className="mt-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
    <AudioRecorder
      onSpeichern={async (blob) => {
        const file = new File([blob], `aufnahme-${Date.now()}.webm`, { type: blob.type })
        setNeueDateien((prev) => [...prev, file])
        setAufnahmeModus(false)
      }}
    />
  </div>
)}
```

- [ ] **Step 2: Build and verify**

Run: `cd Pruefung && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/components/lp/frageneditor/AnhangEditor.tsx
git commit -m "Pruefung: Audio-Aufnahme direkt im AnhangEditor"
```

---

### Task 9: Materialien um Audio/Video/Embed erweitern

**Files:**
- Modify: `src/types/pruefung.ts`
- Modify: `src/components/lp/composer/ConfigTab.tsx`
- Modify: `src/components/MaterialPanel.tsx`

- [ ] **Step 1: Extend PruefungsMaterial type**

In `src/types/pruefung.ts`, modify `PruefungsMaterial`:

```typescript
export interface PruefungsMaterial {
  titel: string
  typ: 'pdf' | 'text' | 'link' | 'dateiUpload' | 'videoEmbed'
  inhalt: string  // URL, text content, or Drive file ID
  driveFileId?: string
  mimeType?: string     // MIME-Type for audio/video distinction
  embedUrl?: string     // Embed URL for videoEmbed type
}
```

- [ ] **Step 2: Add audio/video upload and videoEmbed to ConfigTab**

In `src/components/lp/composer/ConfigTab.tsx`, in the Materialien section:

Add import:
```tsx
import { parseVideoUrl } from '../../../utils/mediaUtils.ts'
import AudioPlayer from '../../AudioPlayer.tsx'
```

Extend the "Typ" dropdown to include `videoEmbed`:

```tsx
<option value="videoEmbed">Video-Embed (YouTube/nanoo.tv)</option>
```

For `dateiUpload` type, change the file input accept attribute to include audio/video:

```tsx
accept="application/pdf,audio/*,video/*"
```

For `videoEmbed` type, add URL input with validation:

```tsx
{neuesMaterial.typ === 'videoEmbed' && (
  <div className="flex gap-2">
    <input
      type="url"
      value={neuesMaterial.inhalt}
      onChange={(e) => setNeuesMaterial({ ...neuesMaterial, inhalt: e.target.value })}
      placeholder="YouTube, Vimeo oder nanoo.tv URL"
      className="input-field flex-1"
    />
  </div>
)}
```

When saving a `videoEmbed` material, parse the URL and store the embed URL:

```tsx
if (neuesMaterial.typ === 'videoEmbed') {
  const parsed = parseVideoUrl(neuesMaterial.inhalt)
  if (!parsed) { /* show error */ return }
  material.embedUrl = parsed.embedUrl
}
```

For `dateiUpload`, store the mimeType of the uploaded file:

```tsx
material.mimeType = file.type
```

- [ ] **Step 3: Extend MaterialPanel rendering**

In `src/components/MaterialPanel.tsx`:

Add imports:
```tsx
import AudioPlayer from './AudioPlayer.tsx'
```

In the content rendering section, add cases for audio and video:

```tsx
{/* Audio */}
{material.typ === 'dateiUpload' && material.mimeType?.startsWith('audio/') && (
  <div className="p-4">
    <AudioPlayer
      src={`https://drive.google.com/uc?id=${material.driveFileId}&export=download`}
    />
  </div>
)}

{/* Video Embed */}
{material.typ === 'videoEmbed' && material.embedUrl && (
  <iframe
    src={material.embedUrl}
    className="w-full h-full border-0"
    allow="autoplay; encrypted-media"
    allowFullScreen
  />
)}

{/* Video Upload */}
{material.typ === 'dateiUpload' && material.mimeType?.startsWith('video/') && (
  <video
    src={`https://drive.google.com/uc?id=${material.driveFileId}&export=download`}
    controls
    className="w-full h-full"
  />
)}
```

Update the `typIcon` function to include audio/video icons:

```tsx
function typIcon(material: PruefungsMaterial): string {
  if (material.typ === 'videoEmbed') return '🎬'
  if (material.typ === 'dateiUpload' && material.mimeType?.startsWith('audio/')) return '🔊'
  if (material.typ === 'dateiUpload' && material.mimeType?.startsWith('video/')) return '🎬'
  if (material.typ === 'pdf' || material.typ === 'dateiUpload') return '📄'
  if (material.typ === 'text') return '📝'
  if (material.typ === 'link') return '🔗'
  return '📎'
}
```

- [ ] **Step 4: Build and verify**

Run: `cd Pruefung && npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/types/pruefung.ts src/components/lp/composer/ConfigTab.tsx src/components/MaterialPanel.tsx
git commit -m "Pruefung: Materialien um Audio/Video/Embed erweitert"
```

---

### Task 10: HANDOFF.md aktualisieren + Final Commit

**Files:**
- Modify: `Pruefung/HANDOFF.md`

- [ ] **Step 1: Update HANDOFF.md**

Add a new section for Phase 5b describing all implemented features:
- Einheitlicher LPHeader
- Fragenbank: breiteres Panel, neue Button-Reihenfolge, +/– Buttons, Ziel-Leiste
- Panel-Flow: ESC schliesst Panels, Direktwechsel
- BerechnungEditor Layout-Fix
- BewertungsrasterEditor extrahiert + KI-Buttons
- Prüfung duplizieren
- Audio-Aufnahme im AnhangEditor
- Materialien Audio/Video/Embed

Add new files to the directory structure section.

- [ ] **Step 2: Final build verification**

Run: `cd Pruefung && npm run build`

- [ ] **Step 3: Commit and push**

```bash
git add -A
git commit -m "Pruefung: UX-Verbesserungen Phase 5b — Header, Fragenbank, Layout-Fixes, Duplizieren, Audio, Materialien"
git push
```

**Reminder:** User muss `apps-script-code.js` in Apps Script Editor kopieren und neue Bereitstellung erstellen (2 neue KI-Aktionen).
