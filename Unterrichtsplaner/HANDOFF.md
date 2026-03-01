# Unterrichtsplaner – Handoff v3.10

## Status: ✅ Deployed (v3.10)
- **Commit:** e8cf7c7
- **Datum:** 2026-03-01
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Architektur
- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Store:** `plannerStore.ts` (~866 Z.), `settingsStore.ts` (181 Z.)
- **Hook:** `usePlannerData.ts` — dynamische Courses/Weeks basierend auf Settings
- **Hauptkomponenten:** WeekRows (~672 Z.), SequencePanel (~660 Z.), DetailPanel (~735 Z.), Toolbar (~463 Z.), SettingsPanel (~444 Z.), ZoomBlockView (~215 Z.)

## Changelog v3.0–v3.10
- v3.0: Shift/Cmd+Click, empty cell UX, Esc handler, default blockType
- v3.1: Two-level BlockCategory/Subtype, Duration field, custom labels
- v3.2: Skip holidays in Shift+select/drag, IN gray, Typ label, duration presets
- v3.3: Day-based column order (Mo→Fr), auto Di+Do selection, SOL section
- v3.4: Settings panel (school config, courses, special weeks, holidays editors)
- v3.5: Settings wiring (usePlannerData hook), Sequence panel redesign
- v3.6: Sticky headers, scroll isolation, drag-selection, tab rename, KW-navigation, lesson lists
- v3.7: ZoomBlockView clickable titles/KW, block material links in Felder section
- v3.8: Lektionsliste toggelbar (Kompakt/Erweitert), usePlannerData Hook-Migration SequencePanel
- v3.9: Settings → Weeks-Generierung (Ferien/Sonderwochen anwenden), Planerdaten Export/Import UI
- v3.10: Print-Optimierung (gezieltes Button-Hiding, Sticky→static, Farb-Tiles, Print-Titel)

## Feedback-Tracking (User-Requests)

### ✅ Alle bisherigen Requests erledigt (v3.6–v3.10)

### ⏳ Noch offen
- (keine offenen Feedback-Items)

## Offene Aufgaben / Ideen

### Architektur
- Andere Komponenten (WeekRows, DetailPanel, Toolbar) auf usePlannerData Hook migrieren
- Toolbar: COURSES-Import → usePlannerData

### Features
- Settings: Import eines neuen Stundenplans für nächstes Schuljahr
- Wochenansicht: Drag & Drop zwischen Semestern
- Statistik: Lektionszählung pro Fachbereich/Sequenz
