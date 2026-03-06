# Refactoring-Analyse — Unterrichtsplaner

> Einmalige Analyse, März 2026. Wird bei Refactoring-Tasks referenziert.
> Nicht bei jeder Session lesen — nur wenn HANDOFF.md explizit darauf verweist.

## Code-Übersicht (v3.92)

16'541 Zeilen TypeScript/TSX in src/. 0 TS-Fehler. 0 Tests.

### Dateien nach Grösse (Top 10)

| Datei | Zeilen | Problem |
|-------|--------|---------|
| SettingsPanel.tsx | 2137 | 23 interne Funktionen, 6+ Sub-Editoren, 46 Hooks |
| plannerStore.ts | 1503 | Monolithischer Store, ~40 Actions |
| WeekRows.tsx | 1445 | 3 Sub-Komponenten inline (EditableCell, HoverPreview, NotesColumn) |
| DetailPanel.tsx | 1396 | Block-Kategorie-System + 19 interne Funktionen |
| initialLessonDetails.ts | 1286 | Reine Daten — kein Refactoring nötig |

## Konkrete Probleme

### P1: SettingsPanel ist 6 Editoren in einer Datei

Enthält eigenständige Sub-Editoren die je 100–400 Zeilen haben:
- SubjectsEditor (Z.320–437)
- CourseEditor (Z.478–674)
- SpecialWeeksEditor (Z.739–986)
- HolidaysEditor (Z.988–1077)
- AssessmentRulesEditor (Z.1087–1204)
- GCalSection (Z.1206–1661)

**Empfehlung:** Jeder Editor → eigene Datei in `components/settings/`.
Shared Helpers (Section, SmallInput, SmallSelect, RubricCollectionButtons) → `components/settings/shared.tsx`.

### P2: plannerStore hat zu viele Verantwortlichkeiten

~40 Actions in einem Store. Logische Gruppen:
- UI-State (filter, zoom, selection, sidepanel) — ~15 Actions
- Daten-Mutations (weekData, lessonDetails) — ~10 Actions
- Sequenz-Verwaltung (addSequence, updateBlock, ...) — ~8 Actions
- Sammlung (collection) — ~5 Actions

**Empfehlung:** Zustand Slices verwenden. Entweder:
a) Separate Stores (sequenceStore, collectionStore) — einfacher
b) Slice-Pattern innerhalb plannerStore — weniger Breaking Changes

Option (b) empfohlen: Store intern in Slices aufteilen (je eine Datei unter `store/slices/`), aber nach aussen einheitlicher `usePlannerStore` Hook beibehalten.

### P3: WeekRows enthält 3 eigenständige Komponenten

EditableCell, HoverPreview, NotesColumn sind jeweils 50–150 Zeilen und eigenständig.

**Empfehlung:** In eigene Dateien extrahieren:
- `components/EditableCell.tsx`
- `components/HoverPreview.tsx`
- `components/NotesColumn.tsx`

### P4: DetailPanel mischt Datenlogik und UI

Block-Kategorie-System (Z.15–120) ist reines Datenmodell mit Konstanten, Lookup-Funktionen, Utility-Logik. Hat nichts mit der Komponente zu tun.

**Empfehlung:** → `utils/blockCategories.ts` oder `data/blockCategories.ts`

### P5: 44 × `as any` Type-Casts

Nicht alle sind vermeidbar, aber viele stammen aus schnellen Feature-Ergänzungen.

**Empfehlung:** Bei jedem Refactoring-Schritt die betroffenen `as any` mit echten Types ersetzen.
Kein eigener Task — opportunistisch bei P1–P4 miterledigen.

## Was NICHT refactorn

- **initialLessonDetails.ts** (1286 Z.) — reine Daten, keine Logik
- **curriculumGoals.ts** (428 Z.) — reine Daten
- **gcal.ts** (524 Z.) — Service-Modul, bereits gut isoliert
- **ZoomMultiYearView.tsx** (665 Z.) — eigenständige View, akzeptable Grösse
- **Toolbar.tsx** (514 Z.) — viele kleine UI-Elemente, Split lohnt sich nicht

## Empfohlene Reihenfolge

| Prio | Task | Risiko | Effekt |
|------|------|--------|--------|
| 1 | P1: SettingsPanel aufteilen | Niedrig (isolierte Sub-Editoren) | −1500 Z. aus Hauptdatei |
| 2 | P3: WeekRows Sub-Komponenten extrahieren | Niedrig | −300 Z., bessere Lesbarkeit |
| 3 | P4: DetailPanel Datenlogik extrahieren | Niedrig | −100 Z., saubere Trennung |
| 4 | P2: plannerStore in Slices | Mittel (zentral) | Bessere Wartbarkeit |
| 5 | P5: as any reduzieren | Niedrig | Typ-Sicherheit |

## Regeln für das Refactoring

1. **Pro Commit ein Refactoring-Schritt.** Nie mehrere gleichzeitig.
2. **Nach jedem Schritt:** `npx tsc --noEmit && npm run build` — muss fehlerfrei sein.
3. **Keine Funktionalitäts-Änderungen.** Reines Move+Rename. Wenn etwas nicht 1:1 extrahierbar ist → nicht anfassen.
4. **Imports aktualisieren.** Nach jedem Extract: alle Import-Stellen prüfen.
5. **Smoke-Test im Browser.** Nach jedem Commit: App öffnen, Settings aufmachen, Sequenz erstellen, Zoom wechseln.
