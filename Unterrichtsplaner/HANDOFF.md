# Unterrichtsplaner – Handoff v3.11

## Status: ✅ Deployed (v3.11)
- **Commit:** a6591f4
- **Datum:** 2026-03-01
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Architektur
- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Store:** `plannerStore.ts` (~870 Z.), `settingsStore.ts` (181 Z.)
- **Hook:** `usePlannerData.ts` — dynamische Courses/Weeks basierend auf Settings
- **Hauptkomponenten:** WeekRows (~674 Z.), SequencePanel (~664 Z.), DetailPanel (~757 Z.), Toolbar (~463 Z.), SettingsPanel (~444 Z.), ZoomBlockView (~215 Z.)

## Changelog v3.0–v3.11
- v3.0–v3.7: Grundfunktionen (siehe frühere Handoffs)
- v3.8: Lektionsliste toggelbar, usePlannerData Hook-Migration SequencePanel
- v3.9: Settings → Weeks-Generierung, Planerdaten Export/Import UI
- v3.10: Print-Optimierung (Button-Hiding, Farb-Tiles, Print-Titel)
- v3.11: Helligkeit/Kontrast, Panel-Resize (320–700px), Bug-Fixes, Cross-Semester Shift-Klick

## Offenes Feedback (aus User-Tests, noch nicht umgesetzt)

### 🔴 Konzeptionell (grosse Änderungen)
1. **Flache Sequenz-Darstellung:** Tab "Sequenzen" soll direkt die Sequenzen (bisherige "Blöcke") auflisten, OHNE Übergruppe. Gefiltert nach Klasse/Fachbereich. Die Übergruppe (=Unterrichtsreihe) bleibt im Datenmodell, wird aber im UI nicht als eigene Ebene gezeigt.
2. **Batch-Editing:** Bei Mehrfachauswahl (mehrere Zellen markiert) sollen Felder wie Fachbereich, Kategorie, Typ, Dauer, SOL für alle gleichzeitig gesetzt werden können — OHNE automatisch eine Sequenz zu erstellen.
3. **Zoom 2 (Mittlere Ansicht):** Soll weiterhin alle KW als Zeilen zeigen, aber kompakter — Sequenz-Labels statt volle Lektionstitel. Aktuell buggy.
4. **Zoom 1 (Multi-Year):** "Lehrplan"-Label korrigieren (kommt aus Jahresplan, nicht Lehrplan). "Ist-Zustand" Ansicht erklären/überarbeiten.

### 🟡 UX-Verbesserungen
5. **Kontextmenü bei Cmd+Klick:** Soll nahe bei der Zelle erscheinen, nicht bei der Kopfzeile.
6. **Einzelklick auf Zelle:** Soll Zelle markieren ohne Menü. Dann Shift+Klick für Bereich.
7. **"Neue Sequenz" aus Popup-Menü:** Bug — löst nichts aus.
8. **Fachbereich-Tags oft falsch:** z.B. 28bc29fs Preistheorie als Recht getaggt statt VWL. AutoSuggest prüfen.
9. **Sequenz-Felder = Unterrichtsreihe-Felder:** Klick auf Sequenz-Titel im Tab soll die Reihe im Planer aktivieren (highlighten). Die aufklappbaren Felder der Reihe sollen dieselben Einstellungsmöglichkeiten bieten wie im Tab Unterrichtseinheit.
10. **Lektionen in Sequenz → Unterrichtseinheit:** Klick auf Lektion in der Sequenz-Lektionsliste öffnet Tab Unterrichtseinheit für diese konkrete Lektion. Tags (Fachbereich, Kategorie) sollen von der Reihe vererbt werden.

### 🟢 Erledigt (v3.11)
- ✅ Helligkeit vergangene Wochen (0.4→0.6)
- ✅ Panel-Kontrast (hellerer Hintergrund, hellere Tabs)
- ✅ Panel-Resize (flexibel 320–700px mit Handle)
- ✅ Bug: Sequenz-Abwahl bei Esc/Klick leere Zelle
- ✅ Shift-Klick über Semesterwechsel
- ✅ Speicherung: Alle Änderungen werden direkt im Zustand/LocalStorage persistiert (kein Speicher-Button nötig)

## Technische Hinweise für nächste Session
- **panelWidth** ist im plannerStore persistiert (Standard: 400px)
- **allWeeks** Prop in WeekRows ermöglicht Cross-Semester-Operationen
- **editingSequenceId** wird jetzt bei Esc/Klick-auf-leer zurückgesetzt
- Für flache Sequenz-Ansicht: ManagedSequence.blocks[i] direkt als Karten rendern, ManagedSequence als dezenter Kontext-Header
- Für Batch-Editing: Neuer Modus im DetailPanel wenn multiSelection.length > 1
- Für Zoom 2: ZoomBlockView.tsx komplett überarbeiten, KW-Zeilen beibehalten aber Zellen kondensieren
