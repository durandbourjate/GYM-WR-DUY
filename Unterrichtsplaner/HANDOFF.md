# Unterrichtsplaner – Handoff v3.5

## Status: ✅ Deployed (v3.5)
- **Commit:** 023f01a
- **Datum:** 2026-03-01
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Architektur
- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Store:** `plannerStore.ts` (~855 Z.), `settingsStore.ts` (109 Z.)
- **Hook:** `usePlannerData.ts` — dynamische Courses/Weeks basierend auf Settings
- **Hauptkomponenten:** WeekRows (~620 Z.), SequencePanel (~570 Z.), DetailPanel (~730 Z.), Toolbar (~456 Z.), SettingsPanel (~340 Z.)
- **Custom Subtypes:** localStorage `unterrichtsplaner-custom-subtypes`
- **Settings:** localStorage `unterrichtsplaner-settings`

## Changelog v3.0–v3.5
- v3.0: Shift/Cmd+Click, empty cell UX, Esc handler, default blockType
- v3.1: Two-level BlockCategory/Subtype, Duration field, custom labels
- v3.2: Skip holidays in Shift+select/drag, IN gray, Typ label, duration presets
- v3.3: Day-based column order (Mo→Fr), auto Di+Do selection, SOL section
- v3.4: Settings panel (school config, courses, special weeks, holidays editors)
- v3.5: Settings wiring (usePlannerData hook), Sequence panel redesign (navigation, colors, links, notes)

## Neue Features v3.3–v3.5

### SOL-System (v3.3)
- SolDetails: enabled, topic, description, materialLinks, duration
- SOL-Tag 📚 auf Kacheln und in Detail-Header

### Einstellungsmenü (v3.4)
- ⚙ Tab im SidePanel
- Schule & Grundeinstellungen (Name, Lektionsdauer)
- Kurs-Editor (hinzufügen, bearbeiten, entfernen)
- Sonderwochen-Editor (KW, Typ, Kurs-Ausschlüsse)
- Ferien-Editor (KW-Bereiche)
- **Hinweis:** Settings werden gespeichert, aber noch nicht zum Generieren der Wochen verwendet. Nur Courses können dynamisch kommen.

### Sequenzansicht (v3.5)
- Block→Planer-Navigation: Klick auf Block scrollt zur Woche und öffnet Details
- Kompaktansicht navigiert ebenfalls (statt nur expandieren)
- Farbliche Subject-Area-Akzente (Sequenzkarten + Block-Borders)
- Links-Feld pro Sequenz (LearningView, Material)
- Notizen-Feld pro Sequenz

## Offene Aufgaben

### Settings → Weeks-Generierung
- Settings-basierte Wochen generieren (Ferien, Sonderwochen als type 5/6 automatisch befüllen)
- Import/Export der Settings (JSON)

### Weitere Verbesserungen
- SequencePanel: COURSES-Import durch usePlannerData Hook ersetzen (vollständiger Refactor)
- getLinkedCourseIds: dynamisch aus usePlannerData statt statisch
- Print-Optimierung für Sequenzansicht
