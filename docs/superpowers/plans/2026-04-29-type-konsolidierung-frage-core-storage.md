# Bundle K — Type-Konsolidierung Frage Core + Storage

> **For agentic workers:** REQUIRED: Use `superpowers:subagent-driven-development` (if subagents available) or `superpowers:executing-plans` to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auflösung der FrageBase-Divergenz zwischen `packages/shared/src/types/fragen.ts` und `ExamLab/src/types/fragen.ts` durch zwei klar geschichtete Type-Files: `fragen-core.ts` (UI/Editor in shared) + `fragen-storage.ts` (Backend in ExamLab).

**Architecture:** `fragen-core.ts` enthält alle Frage-Typen inklusive Sharing-UI-Felder (`berechtigungen`, `geteilt`, `autor`). `fragen-storage.ts` extends mit `_recht`, `poolVersion` und `tags: (string|Tag)[]`-Override. Discriminated Union via `WithStorageBase<T>` Helper. Strukturelles Subtyping erlaubt Storage-Frage als Editor-Input ohne Mapping.

**Tech Stack:** TypeScript 5, Vite, Vitest, monorepo mit `packages/shared` + `ExamLab/`.

**Spec:** [docs/superpowers/specs/2026-04-29-type-konsolidierung-frage-core-storage-design.md](../specs/2026-04-29-type-konsolidierung-frage-core-storage-design.md)

**Geschätzte Sessions:** 3 (1 für Phase 0-2, 1 für Phase 3-5, 1 für Phase 6-7)

---

## File Structure

**Neu erstellt:**

```
packages/shared/src/types/fragen-core.ts        (~700 Z., kanonische Editor-Types)
ExamLab/src/types/fragen-storage.ts             (~150 Z., Storage-Erweiterung + WithStorageBase)
```

**Modifiziert:**

```
packages/shared/src/index.ts                    (Re-Export auf fragen-core)
ExamLab/src/types/auth.ts                       (re-exportet Berechtigung/RechteStufe aus @shared/types/auth)
+ ~15 Files in shared/editor/ + ExamLab/src/{tests,utils,store,services,components,adapters}/  (Phase 3, Editor-Imports)
+ ~24 Files in ExamLab/src/{utils,components,services,data}/  (Phase 4, Storage-Imports)
```

**Gelöscht (Phase 5):**

```
packages/shared/src/types/fragen.ts             (durch fragen-core ersetzt)
ExamLab/src/types/fragen.ts                     (durch fragen-storage ersetzt)
```

---

## Phase 0: Branch + Audit

### Task 1: Branch + Audit-Skripte

**Files:**
- Create: `audit-shared-imports.txt`, `audit-local-imports.txt`, `audit-storage-leak.txt`, `audit-tag-leak.txt`, `audit-sharing-in-core.txt`

- [ ] **Step 1.1: Branch erstellen**

```bash
cd "/Users/durandbourjate/Documents/-Gym Hofwil/00 Automatisierung Unterricht/10 Github/GYM-WR-DUY"
git checkout -b refactor/type-konsolidierung-frage-core-storage
```

- [ ] **Step 1.2: Audit-Skripte ausführen (alle 5 grep-Patterns)**

```bash
grep -rn "from '@shared/types/fragen'" ExamLab/src/ packages/shared/src/ > audit-shared-imports.txt
grep -rEn "from '(\\.\\./)+types/fragen'" ExamLab/src/ > audit-local-imports.txt
grep -rEn "from '(\\.\\./)+types/fragen'" packages/shared/src/ > audit-shared-internal-imports.txt
grep -rn "frage\\._recht\\|frage\\.poolVersion" packages/shared/src/ > audit-storage-leak.txt
grep -rn "tag\\.farbe\\|tag\\.ebene" packages/shared/src/ > audit-tag-leak.txt
grep -rn "frage\\.berechtigungen\\|frage\\.geteilt\\|frage\\.autor" packages/shared/src/ > audit-sharing-in-core.txt
```

- [ ] **Step 1.3: Audit-Auswertung**

Erwartete Treffer:
- `audit-shared-imports.txt` — ~15 Stellen (Tests, Stores, Adapter, ueben/fragen.ts)
- `audit-local-imports.txt` — ~24 Stellen (Utils, Components, Services)
- `audit-shared-internal-imports.txt` — ~35 Stellen (alle shared/editor)
- `audit-storage-leak.txt` — **0 Treffer** (sonst Stop, Architektur überdenken)
- `audit-tag-leak.txt` — **0 Treffer** (sonst Stop)
- `audit-sharing-in-core.txt` — ≥1 Treffer (`SharedFragenEditor.tsx:517+785`) — bestätigt Cut

Falls `storage-leak` oder `tag-leak` Treffer hat: STOP, Spec-Anpassung nötig (Editor-Code in Storage-Layer umsiedeln).

- [ ] **Step 1.4: Commit**

```bash
git add audit-*.txt
git commit -m "Bundle K Phase 0: Audit-Output für Type-Konsolidierung"
```

---

## Phase 1: `fragen-core.ts` in shared anlegen

### Task 2: `fragen-core.ts` erstellen

**Files:**
- Create: `packages/shared/src/types/fragen-core.ts`
- Source: `packages/shared/src/types/fragen.ts` (bestehender Inhalt als Template)

- [ ] **Step 2.1: Datei kopieren als Ausgangspunkt**

```bash
cp packages/shared/src/types/fragen.ts packages/shared/src/types/fragen-core.ts
```

- [ ] **Step 2.2: Sub-Types als named exports**

In `fragen-core.ts` extrahieren — bisher inline in `LueckentextFrage`/`ZuordnungFrage`:

```ts
export interface ZuordnungPaar {
  links: string;
  rechts: string;
  erklaerung?: string;
}

export interface Luecke {
  id: string;
  korrekteAntworten: string[];
  caseSensitive: boolean;
  dropdownOptionen?: string[];
  erklaerung?: string;
}
```

Dann in `ZuordnungFrage` und `LueckentextFrage` nutzen:
```ts
export interface ZuordnungFrage extends FrageBase {
  typ: 'zuordnung';
  paare: ZuordnungPaar[];
}

export interface LueckentextFrage extends FrageBase {
  typ: 'lueckentext';
  luecken: Luecke[];
  // ... rest
}
```

- [ ] **Step 2.3: `FrageBase` aufräumen**

Aus shared `FrageBase` entfernen (bzw. präzisieren) — diese Felder waren `unknown`, jetzt importiert:
```ts
import type { Berechtigung } from './auth'

export interface FrageBase {
  // ... alle bisherigen UI-Felder ...
  berechtigungen?: Berechtigung[];      // konkret typisiert (vorher: unknown[])
  geteilt?: 'privat' | 'fachschaft' | 'schule';
  // ENTFERNT: _recht?: unknown          (gehört in storage)
  // ENTFERNT: poolVersion?: unknown     (gehört in storage)
  tags: string[];                        // bleibt string[] (kein Tag-Objekt in core)
}
```

- [ ] **Step 2.4: `tsc -b` + `vitest run` (Soll-Zustand)**

```bash
cd ExamLab && npx tsc -b
```
Expected: clean (alte `fragen.ts` läuft noch parallel)

```bash
cd ExamLab && npx vitest run
```
Expected: 1098 Tests grün

- [ ] **Step 2.5: Commit**

```bash
git add packages/shared/src/types/fragen-core.ts
git commit -m "Bundle K Phase 1: fragen-core.ts in shared (parallel zu fragen.ts)"
```

### Task 3: `packages/shared/src/index.ts` parallel-Export

**Files:**
- Modify: `packages/shared/src/index.ts:1`

- [ ] **Step 3.1: Index erweitern**

```ts
// VORHER (Z. 1)
export * from './types/fragen'

// NACHHER
export * from './types/fragen-core'
// 'export * from './types/fragen'' bleibt während Phase 3 — wird in Phase 5 entfernt
// Konflikt-Vermeidung: alle Symbole sind identisch typisiert, doppelter Export ist no-op
```

⚠️ **Achtung:** Falls TypeScript bei doppeltem Export Konflikte meldet (gleicher Symbolname aus zwei Quellen), nur `fragen-core` exportieren und `fragen.ts` direkt-Importer beibehalten bis Phase 5.

- [ ] **Step 3.2: `tsc -b` + `vitest run`**

```bash
cd ExamLab && npx tsc -b
```
Expected: clean

```bash
cd ExamLab && npx vitest run
```
Expected: 1098 grün

- [ ] **Step 3.3: Commit**

```bash
git add packages/shared/src/index.ts
git commit -m "Bundle K Phase 1: index.ts re-exportet fragen-core parallel"
```

---

## Phase 2: `fragen-storage.ts` in ExamLab anlegen

### Task 4: `fragen-storage.ts` erstellen

**Files:**
- Create: `ExamLab/src/types/fragen-storage.ts`

- [ ] **Step 4.1: Storage-Type-File schreiben**

```ts
// ExamLab/src/types/fragen-storage.ts
import type * as Core from '@shared/types/fragen-core'
import type { EffektivesRecht } from './auth'
import type { Tag } from './tags'
import type { PoolFrageSnapshot } from './pool'

/**
 * ExamLab-Storage-Erweiterung der FrageBase.
 * Ergänzt Backend-berechnete Felder (`_recht`, `poolVersion`) und erlaubt Tag-Objekte.
 */
export interface FrageBase extends Omit<Core.FrageBase, 'tags'> {
  tags: (string | Tag)[]
  _recht?: EffektivesRecht
  poolVersion?: PoolFrageSnapshot
}

/**
 * Type-Helper: nimmt einen Core-Fragetyp und ersetzt seine FrageBase-Felder
 * durch die Storage-Version. Discriminator `typ` bleibt erhalten weil er
 * auf jedem Sub-Type liegt (nicht in FrageBase).
 */
type WithStorageBase<T extends Core.Frage> =
  Omit<T, keyof Core.FrageBase> & FrageBase

/**
 * Storage-Variante der diskriminierten Union — strukturell kompatibel zu Core.Frage
 * für alle Core-Felder, aber typisiert mit Storage-Erweiterung.
 */
export type Frage =
  | WithStorageBase<Core.MCFrage>
  | WithStorageBase<Core.FreitextFrage>
  | WithStorageBase<Core.ZuordnungFrage>
  | WithStorageBase<Core.LueckentextFrage>
  | WithStorageBase<Core.VisualisierungFrage>
  | WithStorageBase<Core.RichtigFalschFrage>
  | WithStorageBase<Core.BerechnungFrage>
  | WithStorageBase<Core.BuchungssatzFrage>
  | WithStorageBase<Core.TKontoFrage>
  | WithStorageBase<Core.KontenbestimmungFrage>
  | WithStorageBase<Core.BilanzERFrage>
  | WithStorageBase<Core.AufgabengruppeFrage>
  | WithStorageBase<Core.PDFFrage>
  | WithStorageBase<Core.SortierungFrage>
  | WithStorageBase<Core.HotspotFrage>
  | WithStorageBase<Core.BildbeschriftungFrage>
  | WithStorageBase<Core.AudioFrage>
  | WithStorageBase<Core.DragDropBildFrage>
  | WithStorageBase<Core.CodeFrage>
  | WithStorageBase<Core.FormelFrage>

/** FrageSummary mit Backend-Recht — bleibt storage-only. */
export interface FrageSummary {
  // KOPIE aus altem ExamLab/src/types/fragen.ts:88-117 — alle Summary-Felder
  // (siehe alte Datei vor Löschen, ~30 Felder)
  id: string
  typ: string
  fachbereich: Core.Fachbereich
  thema: string
  unterthema?: string
  fragetext: string
  bloom: Core.BloomStufe
  punkte: number
  tags: (string | Tag)[]
  quelle?: 'pool' | 'papier' | 'manuell' | 'ki-generiert'
  autor?: string
  erstelltVon?: string
  erstelltAm: string
  geteilt?: 'privat' | 'fachschaft' | 'schule'
  geteiltVon?: string
  poolId?: string
  poolGeprueft?: boolean
  pruefungstauglich?: boolean
  poolUpdateVerfuegbar?: boolean
  hatAnhang: boolean
  hatMaterial: boolean
  schwierigkeit?: number
  fach: string
  berechtigungen?: import('./auth').Berechtigung[]
  _recht?: EffektivesRecht
  lernzielIds?: string[]
  semester?: string[]
  gefaesse?: string[]
}

/**
 * Re-Exports aller Sub-Types aus Core, damit Storage-Caller nur EINE Datei importieren müssen.
 * Pattern: `import type { Frage, MCFrage, MCOption } from '../types/fragen-storage'`
 */
export type {
  Fachbereich,
  BloomStufe,
  FrageTyp,
  MCFrage, FreitextFrage, ZuordnungFrage, LueckentextFrage,
  VisualisierungFrage, RichtigFalschFrage, BerechnungFrage,
  BuchungssatzFrage, TKontoFrage, KontenbestimmungFrage, BilanzERFrage,
  AufgabengruppeFrage, PDFFrage, SortierungFrage, HotspotFrage,
  BildbeschriftungFrage, AudioFrage, DragDropBildFrage, CodeFrage, FormelFrage,
  // Sub-Types
  MCOption, Luecke, ZuordnungPaar, BildbeschriftungLabel,
  HotspotBereich, DragDropBildLabel, DragDropBildZielzone,
  Buchung, BilanzPosten, KontenbestimmungEintrag,
  Lernziel, FragenPerformance, FrageAnhang,
  // Sub-Sub-Types die in Editor + Storage gebraucht werden
  Bewertungskriterium, BuchungssatzZeile, TKontoEintrag,
  KontoMitSaldo, BilanzERLoesung, BilanzERBewertung,
  BilanzStruktur, BilanzGruppe, ERStruktur, ERStufe,
  Kontenaufgabe, KontenauswahlConfig, KontenAntwort,
  TKontoDefinition, TKontoBewertung, InlineTeilaufgabe,
  CanvasConfig, PDFKategorie, PDFAnnotationsWerkzeug, PDFAnnotation,
  Niveaustufe,
} from '@shared/types/fragen-core'
```

⚠️ **Wichtig:** Die `export type {}`-Liste muss vollständig sein — alle Sub-Types die heute in `ExamLab/src/types/fragen.ts` exportiert werden, müssen hier re-exportiert werden, sonst brechen Phase-4-Imports.

**Verifikation:** Vor Step 4.2 die alte `ExamLab/src/types/fragen.ts` durchgehen und sicherstellen, dass jeder `export interface X` / `export type X` entweder in `fragen-core` oder im Re-Export oben enthalten ist.

- [ ] **Step 4.2: `tsc -b` + `vitest run`**

```bash
cd ExamLab && npx tsc -b
```
Expected: clean

```bash
cd ExamLab && npx vitest run
```
Expected: 1098 grün

- [ ] **Step 4.3: Commit**

```bash
git add ExamLab/src/types/fragen-storage.ts
git commit -m "Bundle K Phase 2: fragen-storage.ts in ExamLab (parallel zu fragen.ts)"
```

---

## Phase 3: Editor-Imports auf `fragen-core`

**Anzahl Files:** ~15 (basierend auf Audit `audit-shared-imports.txt`)

**Pattern für jeden File:** `from '@shared/types/fragen'` → `from '@shared/types/fragen-core'`

**Subagent-Driven-Development empfohlen** — parallele Updates pro Cluster.

### Task 5: Test-Files (7 Files)

**Files:**
- Modify: `ExamLab/src/tests/MCEditorPflicht.test.tsx:4`
- Modify: `ExamLab/src/tests/RichtigFalschEditorPflicht.test.tsx:4`
- Modify: `ExamLab/src/tests/HotspotEditorPflicht.test.tsx:6`
- Modify: `ExamLab/src/tests/DragDropBildEditorMultiZone.test.tsx:6`
- Modify: `ExamLab/src/tests/LueckentextEditorPflicht.test.tsx:4`
- Modify: `ExamLab/src/tests/SharedFragenEditorSaveHook.test.tsx:6`
- Modify: `ExamLab/src/tests/BildbeschriftungEditorPflicht.test.tsx:6`

- [ ] **Step 5.1: Bulk-Replace (sed-äquivalent, manuell pro File reviewen)**

In jedem File:
```ts
// VORHER
import type { ... } from '@shared/types/fragen'
// NACHHER
import type { ... } from '@shared/types/fragen-core'
```

- [ ] **Step 5.2: `tsc -b` + `vitest run`**

Expected: clean + 1098 grün

- [ ] **Step 5.3: Commit**

```bash
git add ExamLab/src/tests/
git commit -m "Bundle K Phase 3.1: 7 Test-Files auf fragen-core"
```

### Task 6: ExamLab-src-Files mit `@shared`-Import (8 Files)

**Files:**
- Modify: `ExamLab/src/types/ueben/fragen.ts:54,57`
- Modify: `ExamLab/src/utils/ueben/fragetext.ts:9`
- Modify: `ExamLab/src/utils/ueben/mastery.ts:2`
- Modify: `ExamLab/src/adapters/ueben/appsScriptAdapter.ts:232`
- Modify: `ExamLab/src/components/lp/frageneditor/PruefungFragenEditor.tsx:21`
- Modify: `ExamLab/src/services/ueben/interfaces.ts:5`
- Modify: `ExamLab/src/store/ueben/fortschrittStore.ts:4`

- [ ] **Step 6.1: Replace `@shared/types/fragen` → `@shared/types/fragen-core` in jedem File**

- [ ] **Step 6.2: `tsc -b` + `vitest run`**

Expected: clean + 1098 grün

- [ ] **Step 6.3: Commit**

```bash
git add ExamLab/src/{types,utils,adapters,components,services,store}/
git commit -m "Bundle K Phase 3.2: 8 ExamLab-src-Files auf fragen-core"
```

### Task 7: shared/editor-Files (35+ Files mit `../types/fragen` oder `../../types/fragen`)

**Files:** Aus `audit-shared-internal-imports.txt` — alle Files in `packages/shared/src/editor/` mit relativem `types/fragen`-Import.

- [ ] **Step 7.1: Globale Substitution in `packages/shared/src/editor/`**

Pattern:
- `from '../types/fragen'` → `from '../types/fragen-core'`
- `from '../../types/fragen'` → `from '../../types/fragen-core'`

Pro File reviewen (sed-Auto kann subtile Pfad-Issues erzeugen).

- [ ] **Step 7.2: `tsc -b` + `vitest run`**

Expected: clean + 1098 grün

- [ ] **Step 7.3: Commit**

```bash
git add packages/shared/src/editor/
git commit -m "Bundle K Phase 3.3: shared/editor-Files auf fragen-core"
```

### Task 8: `SharedFragenEditor.tsx` `as Berechtigung[]`-Cast entfernen

**Files:**
- Modify: `packages/shared/src/editor/SharedFragenEditor.tsx:517`

- [ ] **Step 8.1: Cast entfernen**

```ts
// VORHER
const [berechtigungen, setBerechtigungen] = useState<Berechtigung[]>(
  (frage?.berechtigungen as Berechtigung[] | undefined) ?? []
)

// NACHHER (frage.berechtigungen ist jetzt korrekt als Berechtigung[] typisiert)
const [berechtigungen, setBerechtigungen] = useState<Berechtigung[]>(
  frage?.berechtigungen ?? []
)
```

- [ ] **Step 8.2: `tsc -b` + `vitest run`**

Expected: clean + 1098 grün

- [ ] **Step 8.3: Commit**

```bash
git add packages/shared/src/editor/SharedFragenEditor.tsx
git commit -m "Bundle K Phase 3.4: SharedFragenEditor — Berechtigung-Cast weg (jetzt korrekt typisiert)"
```

---

## Phase 4: Storage-Imports auf `fragen-storage`

**Anzahl Files:** ~24 (basierend auf Audit `audit-local-imports.txt`)

**Pattern:** `from '../types/fragen'` → `from '../types/fragen-storage'` (oder analog mit `../../`/`../../../` je nach Tiefe)

**Subagent-Driven-Development empfohlen** — parallele Updates pro Cluster.

### Task 9: ExamLab-utils (10 Files)

**Files:**
- Modify: `ExamLab/src/utils/excelImport.ts:5`
- Modify: `ExamLab/src/utils/poolExporter.ts:11`
- Modify: `ExamLab/src/utils/fragenResolver.test.ts:4`
- Modify: `ExamLab/src/utils/autoKorrektur.ts:5`
- Modify: `ExamLab/src/utils/fibuAutoKorrektur.ts:1`
- Modify: `ExamLab/src/utils/autoKorrektur.test.ts:3`
- Modify: `ExamLab/src/utils/backupExport.ts:2`
- Modify: `ExamLab/src/utils/anhaengePrefetch.ts:1`
- Modify: `ExamLab/src/utils/migratePoolThemen.ts:13`
- Modify: `ExamLab/src/utils/poolConverter.ts:29`
- Modify: `ExamLab/src/utils/zonen/migriereZone.ts:1`
- Modify: `ExamLab/src/utils/ueben/lueckentextChecks.test.ts:3`

- [ ] **Step 9.1: Replace pro File:** `'../types/fragen'` → `'../types/fragen-storage'` (Tiefe variiert: `../`, `../../`)

- [ ] **Step 9.2: `tsc -b` + `vitest run`**

- [ ] **Step 9.3: Commit**

```bash
git add ExamLab/src/utils/
git commit -m "Bundle K Phase 4.1: ExamLab-utils auf fragen-storage"
```

### Task 10: ExamLab-Components (8 Files)

**Files:**
- Modify: `ExamLab/src/components/ueben/UebungsScreen.tsx:8`
- Modify: `ExamLab/src/components/lp/korrektur/KorrekturFrageVollansicht.tsx:3`
- Modify: `ExamLab/src/components/lp/durchfuehrung/BeendetPhase.tsx:4`
- Modify: `ExamLab/src/components/lp/fragenbank/PoolSyncDialog.tsx:6`
- Modify: `ExamLab/src/components/lp/korrektur/BatchExportDialog.tsx:5`
- Modify: `ExamLab/src/components/lp/frageneditor/PoolUpdateVergleich.tsx:2`
- Modify: `ExamLab/src/components/lp/fragenbank/ExcelImport.tsx:7`
- Modify: `ExamLab/src/components/fragetypen/zeichnen/ZeichnenCanvas.tsx:2`
- Modify: `ExamLab/src/components/lp/fragenbank/RueckSyncDialog.tsx:5`

- [ ] **Step 10.1: Replace pro File**

- [ ] **Step 10.2: `tsc -b` + `vitest run`**

- [ ] **Step 10.3: Commit**

```bash
git add ExamLab/src/components/
git commit -m "Bundle K Phase 4.2: ExamLab-Components auf fragen-storage"
```

### Task 11: ExamLab-services + data + tests-rest (4 Files)

**Files:**
- Modify: `ExamLab/src/services/poolSync.ts:18`
- Modify: `ExamLab/src/data/bewertungsrasterVorlagen.ts:8`
- Modify: `ExamLab/src/tests/anhaengePrefetch.test.ts:2`

- [ ] **Step 11.1: Replace pro File**

- [ ] **Step 11.2: `tsc -b` + `vitest run`**

- [ ] **Step 11.3: Commit**

```bash
git add ExamLab/src/services/ ExamLab/src/data/ ExamLab/src/tests/
git commit -m "Bundle K Phase 4.3: services + data + tests-rest auf fragen-storage"
```

### Task 12: Sub-Cleanup `ExamLab/src/types/auth.ts`

**Files:**
- Modify: `ExamLab/src/types/auth.ts`

- [ ] **Step 12.1: Berechtigung + RechteStufe re-exportieren**

```ts
// ExamLab/src/types/auth.ts (Beginn)
export type { Berechtigung, RechteStufe } from '@shared/types/auth'

/** Rollen basierend auf E-Mail-Domain (ExamLab-Welt) */
export type Rolle = 'sus' | 'lp' | 'unbekannt'

/** Effektives Recht einer LP auf ein Item */
export type EffektivesRecht = 'inhaber' | 'bearbeiter' | 'betrachter'

/** Authentifizierter Benutzer (bleibt ExamLab-spezifisch) */
export interface AuthUser {
  // ... unverändert
}
```

- [ ] **Step 12.2: `tsc -b` + `vitest run`**

Expected: clean + 1098 grün — bestehende Caller von `import type { Berechtigung } from './auth'` funktionieren unverändert (transparenter Re-Export)

- [ ] **Step 12.3: Commit**

```bash
git add ExamLab/src/types/auth.ts
git commit -m "Bundle K Phase 4.4: ExamLab/auth.ts re-exportet Berechtigung aus @shared (Doppeldefinition weg)"
```

---

## Phase 5: Cleanup

### Task 13: Alte Type-Files löschen + index.ts aufräumen

**Files:**
- Delete: `packages/shared/src/types/fragen.ts`
- Delete: `ExamLab/src/types/fragen.ts`
- Modify: `packages/shared/src/index.ts:1`

- [ ] **Step 13.1: Alte Files löschen**

```bash
rm packages/shared/src/types/fragen.ts
rm ExamLab/src/types/fragen.ts
```

- [ ] **Step 13.2: `index.ts` parallel-Export entfernen**

```ts
// packages/shared/src/index.ts
// VORHER (während Phase 1-4)
export * from './types/fragen-core'
// export * from './types/fragen'   // ggf. zusätzlich

// NACHHER
export * from './types/fragen-core'
```

- [ ] **Step 13.3: Verifikations-Greps**

```bash
grep -rn "from '@shared/types/fragen'" ExamLab/src/ packages/shared/src/
# Erwartet: 0 Treffer

grep -rEn "from '(\\.\\./)+types/fragen'" ExamLab/src/ packages/shared/src/
# Erwartet: 0 Treffer
```

Falls Treffer: betroffenen File auf `fragen-core` (shared/editor) oder `fragen-storage` (ExamLab) umstellen.

- [ ] **Step 13.4: `tsc -b` + `vitest run` + `npm run build`**

```bash
cd ExamLab
npx tsc -b
# Expected: clean

npx vitest run
# Expected: 1098 grün

npm run build
# Expected: erfolgreich
```

- [ ] **Step 13.5: Commit**

```bash
git add -A
git commit -m "Bundle K Phase 5: Cleanup — alte fragen.ts gelöscht, index.ts auf fragen-core only"
```

---

## Phase 6: Browser-E2E

### Task 14: Test-Plan in HANDOFF.md

**Files:**
- Modify: `ExamLab/HANDOFF.md` (neue Sektion)

- [ ] **Step 14.1: Test-Plan dokumentieren**

In HANDOFF.md "Aktiv offen" oder "Letzter Stand" als Bundle K E2E:

```markdown
## Bundle K Browser-E2E Test-Plan

### Setup
- Tab-Gruppe LP (`wr.test@gymhofwil.ch`) + SuS (`wr.test@stud.gymhofwil.ch`)
- Echte Logins, kein Demo-Modus

### Zu testende Pfade (Type-Refactor — Verhalten unverändert erwartet)

**LP-Pfade:**
- [ ] Fragensammlung öffnen — alle 20 Fragetypen einmal im Editor öffnen
- [ ] Pflichtfeld-Outlines erscheinen wo erwartet
- [ ] prev/next-Navigation: Felder synchronisieren (S129-Regel mit `key={frage.id}`)
- [ ] Berechtigungs-Editor öffnen, Sharing setzen, speichern
- [ ] Tag mit Farbe + String-Tag: beide rendern korrekt
- [ ] Korrektur-Vollansicht: 1 Frage pro Typ-Gruppe (Bild/Drag, FiBu, Standard) — Bewertungsraster + Teilerklärungen sichtbar

**SuS-Pfade:**
- [ ] 1 Frage pro Typ-Gruppe im Üben-Modus lösen + Auto-Korrektur
- [ ] Heartbeat speichert (Network-Tab beobachten)
- [ ] Abgabe persistiert

### Security-Check (Network-Tab)
- [ ] SuS-API-Response: KEINE `_recht`/`berechtigungen` (sind LP-only)
- [ ] LP-API-Response: `berechtigungen` + `_recht` durchgereicht
- [ ] Tag-Objekte mit `farbe`/`ebene` rendern bei LP, nicht bei SuS
```

- [ ] **Step 14.2: Commit**

```bash
git add ExamLab/HANDOFF.md
git commit -m "Bundle K Phase 6.0: Browser-E2E Test-Plan in HANDOFF"
```

### Task 15: Browser-Test durchführen

**Voraussetzung:** Branch ist auf `origin/preview` deployed (Force-Push laut `feedback_preview_forcepush.md` mit Vorab-Check).

- [ ] **Step 15.1: Force-Push auf preview**

```bash
git log preview ^HEAD --oneline   # prüfen ob preview Work-in-Progress hat
# Wenn leer: sicher
git push origin HEAD:preview --force-with-lease
```

- [ ] **Step 15.2: User testet im Browser** (Tab-Gruppe LP+SuS, alle Pfade aus Test-Plan)

- [ ] **Step 15.3: Test-Plan-Checkboxes abhaken** (in HANDOFF.md)

- [ ] **Step 15.4: Commit Test-Ergebnis**

```bash
git add ExamLab/HANDOFF.md
git commit -m "Bundle K Phase 6: E2E mit echten Logins durchgeführt — alle Pfade ✓"
```

---

## Phase 7: Merge

### Task 16: Pre-Merge-Checks + HANDOFF + Merge

**Files:**
- Modify: `ExamLab/HANDOFF.md`
- Merge: `refactor/type-konsolidierung-frage-core-storage` → `main`

- [ ] **Step 16.1: Pre-Merge-Checks**

```bash
cd ExamLab
npx tsc -b                    # Expected: clean
npx vitest run                # Expected: 1098 grün
npm run build                 # Expected: erfolgreich
```

- [ ] **Step 16.2: HANDOFF.md final aktualisieren**

In `ExamLab/HANDOFF.md`:
- "FrageBase-Divergenz" aus „Aktiv offen" entfernen
- Bundle K als „Letzter Stand auf main" eintragen mit Commit-Hash
- Historie-Tabelle: neue Zeile S162+ Bundle K
- Memory-Eintrag verlinken

- [ ] **Step 16.3: Merge auf main**

```bash
git checkout main
git pull origin main
git merge --no-ff refactor/type-konsolidierung-frage-core-storage -m "Bundle K: Type-Konsolidierung Frage Core + Storage"
git push origin main
```

- [ ] **Step 16.4: Branch cleanup**

```bash
git branch -d refactor/type-konsolidierung-frage-core-storage
git push origin --delete refactor/type-konsolidierung-frage-core-storage
```

- [ ] **Step 16.5: Memory-Eintrag**

`~/.claude/projects/.../memory/project_s162_bundle_k_type_konsolidierung.md` mit:
- Was Bundle K geliefert hat (Cut-Decision, WithStorageBase-Helper)
- Welche Erfahrungen für künftige Refactors festzuhalten sind
- Verweis auf Spec + Plan

---

## Risiko-Mitigations-Reminder

| # | Wenn das passiert ... | Tu das ... |
|---|---|---|
| 1 | Audit-Phase findet `_recht`/`poolVersion` in shared | STOP — Spec überarbeiten, betroffenen shared-Code in ExamLab umsiedeln |
| 2 | `tsc -b` schlägt nach Phase 1 fehl mit „doppelte Symbole" | `index.ts` nur `fragen-core` exportieren, alte Direkt-Importer beibehalten bis Phase 5 |
| 3 | Phase 4 — Storage-Frage kann nicht in Editor-Komponente verwendet werden | Editor-Komponente nimmt `Core.MCFrage` (oder andere Sub-Type) — Storage-Frage ist structurally compatible. Falls TS doch klagt: explizites Cast `as Core.MCFrage` in Caller |
| 4 | `WithStorageBase<T>` produziert `unknown` statt expected Type | Discriminator-Property `typ` muss in Sub-Type bleiben (nicht in FrageBase). Verifikation: `frage.typ === 'mc'` muss narrowen |
| 5 | Phase 5 grep findet doch noch alte Pfade | Ein File übersehen — auf `fragen-core` (Editor) oder `fragen-storage` (ExamLab) umstellen, dann erneut greppen |

---

## Erfolgs-Kriterien (final)

- [ ] 0 Treffer für `from '@shared/types/fragen'` in `ExamLab/src/` und `packages/shared/src/`
- [ ] 0 Treffer für `from '(\\.\\./)+types/fragen'` in `ExamLab/src/` und `packages/shared/src/`
- [ ] 1098 vitest grün
- [ ] `npx tsc -b` clean
- [ ] `npm run build` clean
- [ ] Browser-E2E ohne Errors auf staging mit echten Logins
- [ ] HANDOFF.md aktualisiert mit Bundle-K-Status
- [ ] Spec + Plan committet (bereits ✓ vor Implementation)
- [ ] FrageBase-Divergenz aus „Aktiv offen" in HANDOFF.md entfernt
- [ ] `ExamLab/types/auth.ts` re-exportet `Berechtigung`/`RechteStufe` aus `@shared/types/auth`
