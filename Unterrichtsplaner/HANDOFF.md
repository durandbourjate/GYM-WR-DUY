# Unterrichtsplaner – Handoff v3.14

## Status: ✅ Deployed (v3.14)
- **Commit:** bbd0211
- **Datum:** 2026-03-01
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Architektur
- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Store:** `plannerStore.ts` (~875 Z.), `settingsStore.ts` (181 Z.)
- **Hook:** `usePlannerData.ts` — dynamische Courses/Weeks basierend auf Settings
- **Hauptkomponenten:** WeekRows (~680 Z.), SequencePanel (~470 Z.), DetailPanel (~855 Z.), Toolbar (~463 Z.), SettingsPanel (~444 Z.), ZoomBlockView (~215 Z.)

## Changelog v3.0–v3.14
- v3.0–v3.7: Grundfunktionen (siehe frühere Handoffs)
- v3.8: Lektionsliste toggelbar, usePlannerData Hook-Migration SequencePanel
- v3.9: Settings → Weeks-Generierung, Planerdaten Export/Import UI
- v3.10: Print-Optimierung (Button-Hiding, Farb-Tiles, Print-Titel)
- v3.11: Helligkeit/Kontrast, Panel-Resize (320–700px), Bug-Fixes, Cross-Semester Shift-Klick
- v3.12: Flache Sequenz-Darstellung (FlatBlockCard), SequenceCard+BlockEditor entfernt (-460Z)
- v3.13: Batch-Editing bei Multi-Select, Sequenz-Highlighting mit Block-Präzision, suggestSubjectArea
- v3.14: UX-Fixes: Legende (BWL/VWL/Recht separat + Event grau), Sequenz-Bar 5px/sticky/hover, Tab-Styling Felder/Lektionen/Reihe, Fachbereich-Klick Collapse-Fix

## Architekturentscheidungen v3.11–v3.13
- **editingSequenceId Format:** Jetzt `seqId-blockIndex` (z.B. `abc123-0`) statt nur `seqId`. WeekRows parsed dieses Format mit Regex und highlightet nur den spezifischen Block.
- **panelWidth:** Im plannerStore persistiert, über Resize-Handle (320–700px) einstellbar.
- **allWeeks Prop:** WeekRows erhält optionale `allWeeks`-Prop mit allen Kalenderwochen beider Semester für Cross-Semester Shift-Select.
- **BatchOrDetailsTab:** Switcher-Komponente — zeigt BatchEditTab bei multiSelection.length > 1, sonst normaler DetailsTab.
- **FlatBlockCard:** Ersetzt alte SequenceCard. Zeigt Blöcke direkt flach, mit Parent-Sequenz-Kontext. Aufklappbare Sections: Felder, Lektionen, Reihen-Einstellungen.

## Offenes Feedback (noch nicht umgesetzt)

### 🔴 Konzeptionell / Architektur
1. **Materialsammlung (Sammlung-Tab):** Dritter Tab rechts neben "Sequenzen". Sequenzen und UE speichern für Wiederverwendung in späteren Jahren. Szenarien: (a) Lektionen+Sequenzen vom Vorjahr übernehmen, (b) Punktuell aus Sammlung importieren.
2. **Detailspalte / Notiz-Ansicht (Unterrichtsdurchführung):** Niederschwelliger Zugang zu Notizen, Kommentaren, Reflexion ("wie hat es mit der Klasse funktioniert"). Idee: aufklappbare Detailspalte pro Kurs (wie Excel-Gruppierung). Bei Einzelkurs-Ansicht umsetzbar. Auch Mouse-Over als Option.
3. **Feiertage tracken:** Wie Ferien blockieren.
4. **"Zu Sequenz hinzufügen" im DetailPanel:** Einzelne UE über Details-Menü zu neuer oder bestehender Sequenz hinzufügen.
5. **Zoom 2 (Mittlere Ansicht):** Alle KW-Zeilen, kompaktere Darstellung mit Sequenz-Labels statt volle Titel. Aktuell buggy (ZoomBlockView.tsx).
6. **Zoom 1 (Multi-Year):** "Lehrplan"-Label korrigieren, "Ist-Zustand" Ansicht überarbeiten.

### 🟡 UX (nächste Runde)
7. **Dauer-Warnung bei Verschieben (1L↔2L):** Wenn 90min-Lektion auf 45min-Slot verschoben wird → Warnung + Anpassung.
8. **Kontextmenü bei Cmd+Klick:** Soll nahe bei der Zelle erscheinen.
9. **Fachbereich-Tags oft falsch:** z.B. Preistheorie als Recht statt VWL. AutoSuggest + Vererbungslogik prüfen.
10. **Klick auf Sequenz-Titel → Planer-Highlighting:** Sequenz im Plan aktivieren (nicht Tab wechseln).
11. **Lektionen in Sequenz → Tab wechseln:** Tags (Fachbereich, Kategorie) von Reihe vererben.
12. **Unterrichtsreihe Konzept klären:** Rolle der Reihe verdeutlichen. Mehrere Sequenzen (z.B. OR AT Entstehung, OR AT Erlöschung) gehören zu einer Reihe.

### 🟢 Erledigt (v3.11–v3.14)
- ✅ Helligkeit vergangene Wochen (0.4→0.6)
- ✅ Panel-Kontrast (hellerer Hintergrund #151b2e)
- ✅ Panel-Resize mit Handle (320–700px)
- ✅ Bug: Sequenz-Abwahl bei Esc/Klick leere Zelle
- ✅ Shift-Klick über Semesterwechsel
- ✅ Flache Sequenz-Darstellung (FlatBlockCard)
- ✅ Tab "Sequenz" → "Sequenzen"
- ✅ Batch-Editing bei Mehrfachauswahl (Fachbereich, Kategorie, Dauer, SOL)
- ✅ Panel öffnet bei Multi-Select
- ✅ Sequenz-Highlighting mit Block-Präzision
- ✅ Neue Sequenz aus EmptyCellMenu setzt korrektes Block-Format
- ✅ Legende: BWL/VWL/Recht separat, Event grau, Ferien weiss
- ✅ Sequenz-Bar: 5px breit, hover-Effekt, sticky bei Kachel (nicht bei leeren Zellen)
- ✅ SequencePanel Felder/Lektionen/Reihe: Tab-Styling (aktiv hervorgehoben)
- ✅ Fachbereich-Klick in Sequenz: Modal bleibt offen (Collapse-Fix via useEffect)
