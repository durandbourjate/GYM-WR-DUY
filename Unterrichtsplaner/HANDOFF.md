# Unterrichtsplaner – Handoff v3.71

## Status: ✅ Deployed (v3.72)
- **Commit:** 8cad5d3
- **Datum:** 2026-03-03
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Erledigte Aufträge (v3.54–v3.63)

| Version | Auftrag | Status |
|---------|---------|--------|
| v3.54 | Kurs-Konfiguration Export/Import | ✅ |
| v3.55 | Aus Sammlung laden für Settings | ✅ |
| v3.56 | Kachel-Badge für Prüfungen | ✅ |
| v3.57 | Warnung bei 1L/2L Rhythmisierung | ✅ |
| v3.58 | Drag&Drop Verschieben | ✅ |
| v3.59 | Doppelklick Kursfilter | ✅ |
| v3.60–63 | Google Calendar Integration (4 Phasen) | ✅ |

## Erledigte Aufträge (v3.64–v3.70, UX-Feedback Runde 2)

| Version | Auftrag | Status |
|---------|---------|--------|
| v3.64 | Bugfixes & Defaults (Dauer min, SOL/Kategorie/Dauer Defaults, Sequenz-Persistenz) | ✅ |
| v3.65 | Toolbar aufräumen (dynamische Kursfilter, DataMenu/+Neu entfernt) | ✅ |
| v3.66 | Kurs-Settings (Endzeit auto, + Tag Button, grössere Zeitfelder) | ✅ |
| v3.67 | Ferien vereinfacht (Tage nur bei Einzelwochen, ReapplyButton entfernt) | ✅ |
| v3.68 | Batch→Sequenz (Fachbereich übertragen, floating Toolbar) | ✅ |
| v3.69 | Sammlung im Detail-Tab (Speichern/Laden einzelner UE) | ✅ |
| v3.70 | Sequenz-Felder (Erklärtexte, Hierarchie-Indikator) | ✅ |

**Hinweis:** Google Calendar benötigt Google Cloud Projekt mit OAuth Client ID.

---

## Backlog (niedrigere Priorität)

1. **Template-System erweitern:** Komplette Planer-Daten als Template, Vorlagen-Bibliothek.
2. **Event-Overlay Name-Verschiebung:** Bei partiellen Sonderwochen Name verschieben.
3. **IW-Plan Auto-Verknüpfung:** Automatische IW-Event-Erkennung im DetailPanel.
4. **Automatischer Lehrplanbezug:** Lehrplanziele aus Thema/Fachbereich vorschlagen.
5. **Zoom 1 (Multi-Year):** Weitere Verbesserungen der Jahrgänge-Ansicht.

---

## Architektur

- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Build & Deploy:** `./deploy.sh` baut die App und kopiert Build-Output (assets/, index.html, sw.js etc.) in den Repo-Root. GitHub Pages serviert direkt aus `main`. `dist/` ist in .gitignore — nur die kopierten Dateien werden committet. Für lokale Entwicklung: `npm run dev` (nutzt `src/index.dev.html` als Vite-Entry).
- **Wiki:** `wiki.html` (Standalone-HTML, kein Build nötig). Erreichbar über 📖-Button in der Toolbar.
- **Store:** `plannerStore.ts` (~1247 Z.), `settingsStore.ts` (~256 Z.), `instanceStore.ts` (~204 Z.)
- **Hook:** `usePlannerData.ts` — liest Kurse/Wochen reaktiv aus `plannerStore.plannerSettings` (pro Instanz) → Fallback auf globale Settings → Fallback auf hardcoded WEEKS/COURSES. Gibt `isLegacy`-Flag zurück.
- **Multi-Planer:** `instanceStore.ts` verwaltet Planer-Instanzen (Tabs). Jeder Planer hat eigenen localStorage-Slot (`planner-data-{id}`) inkl. `plannerSettings`. `plannerStore.ts` speichert/lädt Daten pro Instanz via `switchInstance()`.
- **Hauptkomponenten:** WeekRows (~1021 Z.), SequencePanel (~708 Z.), DetailPanel (~1320 Z.), ZoomYearView (~569 Z.), Toolbar (~354 Z.), SettingsPanel (~1427 Z.), CollectionPanel (~295 Z.), PlannerTabs (~263 Z.)

### Architektur-Details

- **editingSequenceId Format:** `seqId-blockIndex` (z.B. `abc123-0`). WeekRows parsed mit Regex und highlightet nur den spezifischen Block.
- **panelWidth:** Im plannerStore persistiert, über Resize-Handle (320–700px) einstellbar.
- **allWeeks Prop:** WeekRows erhält optionale `allWeeks`-Prop für Cross-Semester Shift-Select.
- **BatchOrDetailsTab:** Switcher — zeigt BatchEditTab bei multiSelection.length > 1, sonst DetailsTab.
- **FlatBlockCard:** Ersetzt alte SequenceCard. Aufklappbare Sections: Felder, Lektionen, Reihen-Einstellungen.
- **CollectionPanel:** Datenmodell `CollectionItem` mit `CollectionUnit[]`. Archiv-Hierarchie: UE < Sequenz < Schuljahr < Bildungsgang.
- **ZoomYearView:** rowSpan für zusammenhängende Sequenz-Blöcke. BlockSpan-Datenstruktur mit skipSet.
- **sidePanelTab:** `'details' | 'sequences' | 'collection' | 'settings'`.

---

## Changelog

- v3.0–v3.7: Grundfunktionen (siehe frühere Handoffs)
- v3.8–v3.10: Lektionsliste, Settings→Weeks, Print-Optimierung
- v3.11–v3.14: Kontrast, Panel-Resize, FlatBlockCard, Batch-Editing, Legende
- v3.15–v3.18: Kontextmenü, Tag-Vererbung, Mismatch-Warnung, HoverPreview, Delete-Taste
- v3.19: Materialsammlung (CollectionPanel)
- v3.20–v3.21: Zoom 2 (KW-Zeilen, rowSpan, BlockSpan)
- v3.22: Zoom 1 Ist-Zustand, Deutsch, Feiertag-Erkennung
- v3.23–v3.24: Enhanced HoverPreview, UX-Kontrast, Bundle halbiert, Deploy-Fix
- v3.25–v3.27: Notizen-Spalte, Zoom 2 Farben, Resizable
- v3.28–v3.29: Zoom 2→Jahresansicht, SOL-Total
- v3.30–v3.34: SidePanel-Fixes, Noten-Vorgaben, Batch-Active-State, dimPastWeeks, Pin-Card
- v3.35–v3.41: Sequenz-Bar Farbcode, Ferien/Events Overhaul (Zoom 2+3), Batch-Sequenzen
- v3.42–v3.46: Multi-Planer, Settings pro Instanz, Templates, Presets, Legacy-Migration
- v3.47–v3.49: Flexible Kategorien (3 Phasen), Block-Label UX
- v3.50–v3.53: UX-Feedback Runde 1 (Zoom 2 entfernt, Auto-Save, UE-Workflow, Sonderwochen, Drag)
- v3.54: Kurs-Konfiguration Export/Import in Settings
- v3.55: Aus Sammlung laden für Settings-Konfigurationen
- v3.56: Kachel-Badge für Prüfungen und Spezialanlässe
- v3.57: Warnung bei gestörter 1L/2L Rhythmisierung nach Push
- v3.58: Drag&Drop Verschieben von Lektionen innerhalb eines Kurses
- v3.59: Doppelklick auf Spaltentitel als Kursfilter
- v3.60–63: Google Calendar Integration (OAuth, Sync, Import, Kollisionen)
- v3.64: Bugfixes — Dauer in min, SOL/Kategorie/Dauer Defaults, Sequenz-Persistenz
- v3.65: Toolbar aufräumen — dynamische Kursfilter, DataMenu/+Neu entfernt
- v3.66: Kurs-Settings — Endzeit auto, + Tag Button, grössere Zeitfelder
- v3.67: Ferien vereinfacht — Tage nur bei Einzelwochen, ReapplyButton entfernt
- v3.68: Batch→Sequenz — Fachbereich übertragen, floating Toolbar
- v3.69: Sammlung im Detail-Tab — Speichern/Laden einzelner UE
- v3.70: Sequenz-Felder — Erklärtexte und Feld-Hierarchie
- v3.71: Wiki-Anleitung (wiki.html), Build-Pipeline (deploy.sh, dist/ ignoriert), 📖-Button in Toolbar
