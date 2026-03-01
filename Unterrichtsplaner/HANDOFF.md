# Unterrichtsplaner – Handoff v3.3

## Status: ✅ Deployed (v3.3)
- **Commit:** dbd2a41
- **Datum:** 2026-03-01
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Architektur
- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Store:** `plannerStore.ts` (~855 Zeilen)
- **Hauptkomponenten:** WeekRows (~620 Z.), SequencePanel (~494 Z.), DetailPanel (~720 Z.), Toolbar (~456 Z.)
- **Custom Subtypes:** localStorage key `unterrichtsplaner-custom-subtypes`
- **SOL:** SolDetails in LessonDetail, SolSection-Komponente im DetailPanel

## Changelog v3.0–v3.3
- v3.0: Shift/Cmd+Click, empty cell UX, Esc handler, default blockType
- v3.1: Two-level BlockCategory/Subtype, Duration field, custom labels
- v3.2: Skip holidays in Shift+select/drag, IN gray, Typ label, duration presets
- v3.3: Day-based column order (Mo→Fr), auto Di+Do selection, SOL section

## Offene Aufgaben

### Grössere Redesigns
1. **Einstellungsmenü** — Leerer Start ohne Import möglich:
   - Stundenplan → Kurse hinzufügen/bearbeiten
   - Sonderwochen definieren (inkl. welche Kurse betroffen)
   - Ferien definieren
   - Default-Lektionsdauer
   - Fächer die unterrichtet werden
2. **Sequenzansicht komplett überarbeiten** — Block→Planer-Navigation, Farbhintergrund, Titel-Klick=Details, Di-Do-Anzeige, externe Links
