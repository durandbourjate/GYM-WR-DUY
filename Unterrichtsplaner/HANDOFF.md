# Unterrichtsplaner – Handoff v3.8

## Status: ✅ Deployed (v3.8)
- **Commit:** c07749a
- **Datum:** 2026-03-01
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Architektur
- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Store:** `plannerStore.ts` (~870 Z.), `settingsStore.ts` (109 Z.)
- **Hook:** `usePlannerData.ts` — dynamische Courses/Weeks basierend auf Settings
- **Hauptkomponenten:** WeekRows (~672 Z.), SequencePanel (~660 Z.), DetailPanel (~735 Z.), Toolbar (~456 Z.), SettingsPanel (~340 Z.), ZoomBlockView (~215 Z.)

## Changelog v3.0–v3.8
- v3.0: Shift/Cmd+Click, empty cell UX, Esc handler, default blockType
- v3.1: Two-level BlockCategory/Subtype, Duration field, custom labels
- v3.2: Skip holidays in Shift+select/drag, IN gray, Typ label, duration presets
- v3.3: Day-based column order (Mo→Fr), auto Di+Do selection, SOL section
- v3.4: Settings panel (school config, courses, special weeks, holidays editors)
- v3.5: Settings wiring (usePlannerData hook), Sequence panel redesign
- v3.6: Sticky headers, scroll isolation, drag-selection, tab rename, KW-navigation, lesson lists
- v3.7: ZoomBlockView clickable titles/KW, block material links in Felder section
- v3.8: Lektionsliste toggelbar (Kompakt/Erweitert-Differenzierung), usePlannerData Hook-Migration in SequencePanel

## Feedback-Tracking (User-Requests)

### ✅ Erledigt (v3.6–v3.8)
- Tab "Details" → "Unterrichtseinheit", "Sequenzen" → "Sequenz"
- Scroll in Panel soll nicht Planer scrollen (overscrollBehavior:contain)
- Drag-Selection auf leere Zellen + Kontextmenü
- KW-Nummern im Block klickbar → navigiert zur Woche
- Lektionsliste in Blöcken (Klick → Unterrichtseinheit-Tab)
- "Details"-Button → "Felder" umbenannt
- ZoomBlockView: Titel klickbar → Sequenz öffnen
- ZoomBlockView: KW klickbar → Wochenansicht springen
- Materiallinks im Block-Felder-Bereich
- Kompakt vs. Erweitert sinnvoll differenziert (Kompakt=Label+KW, Erweitert=+Lektionen-Toggle+Felder-Toggle)
- SequencePanel: COURSES-Import durch usePlannerData Hook ersetzt

### ⏳ Noch offen
- (keine offenen Feedback-Items)

## Offene Aufgaben

### Settings → Weeks-Generierung
- Settings-basierte Wochen generieren (Ferien, Sonderwochen automatisch befüllen)
- Import/Export der Settings (JSON)

### Weitere Verbesserungen
- Print-Optimierung
- Andere Komponenten ebenfalls auf usePlannerData Hook migrieren (WeekRows, DetailPanel, etc.)
