# Unterrichtsplaner – Handoff v3.24

## Status: ✅ Deployed (v3.24)
- **Commit:** 3891837
- **Datum:** 2026-03-01
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Architektur
- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Store:** `plannerStore.ts` (~1095 Z.), `settingsStore.ts` (181 Z.)
- **Hook:** `usePlannerData.ts` — dynamische Courses/Weeks basierend auf Settings
- **Hauptkomponenten:** WeekRows (~680 Z.), SequencePanel (~585 Z.), DetailPanel (~990 Z.), Toolbar (~463 Z.), SettingsPanel (~444 Z.), CollectionPanel (~295 Z.), ZoomBlockView (~324 Z.)

## Changelog v3.0–v3.14
- v3.0–v3.7: Grundfunktionen (siehe frühere Handoffs)
- v3.8: Lektionsliste toggelbar, usePlannerData Hook-Migration SequencePanel
- v3.9: Settings → Weeks-Generierung, Planerdaten Export/Import UI
- v3.10: Print-Optimierung (Button-Hiding, Farb-Tiles, Print-Titel)
- v3.11: Helligkeit/Kontrast, Panel-Resize (320–700px), Bug-Fixes, Cross-Semester Shift-Klick
- v3.12: Flache Sequenz-Darstellung (FlatBlockCard), SequenceCard+BlockEditor entfernt (-460Z)
- v3.13: Batch-Editing bei Multi-Select, Sequenz-Highlighting mit Block-Präzision, suggestSubjectArea
- v3.14: UX-Fixes: Legende (BWL/VWL/Recht separat + Event grau), Sequenz-Bar 5px/sticky/hover, Tab-Styling Felder/Lektionen/Reihe, Fachbereich-Klick Collapse-Fix
- v3.15: Kontextmenü bei Cursor, Sequenz-Klick=Highlight/Doppelklick=Edit, Tag-Vererbung Sequenz→Lektion, "Zu Sequenz hinzufügen"-Button im DetailPanel
- v3.16: Fachbereich-Mismatch-Warnung mit Korrigieren-Button, Reihe-UX (Erklärtext, editierbarer Titel, Sequenz-Zähler)
- v3.17: Hover-Preview 800ms (statt 2s), Feiertag-Erkennung bei Import (partielle Feiertage wie Auffahrt/Pfingsten)
- v3.18: Delete-Taste löscht Zelleninhalt, Scroll-to-Current-Button (◉), geerbter Fachbereich-Hinweis, Keyboard-Hilfe aktualisiert
- v3.19: Materialsammlung (CollectionPanel) — neuer Tab "📚 Sammlung" im Seitenpanel. Archivieren von UE, Sequenzen, Schuljahren, Bildungsgängen. Import mit Optionen (Notizen/Materiallinks). Persistierung in localStorage.
- v3.20: Zoom 2 komplett neu — KW-Zeilen-Layout statt Block-Matrix. Migration auf usePlannerData(). Sequenzen als farbige Balken (Label auf 1. Zeile, gerundete Ecken). Ferien/IW kollabiiert. Past-Wochen abgedunkelt. Klick→Sequenz, Doppelklick→Zoom3.
- v3.21: Zoom 2 — Sequenzen als rowSpan-Einheiten (verschmolzene Zellen statt Zeile-pro-KW). Farbcode-Inferenz aus weekData-Lektionstyp wenn Sequenz keinen Fachbereich hat. BlockSpan-Datenstruktur mit skipSet.
- v3.22: Zoom 1 — Ist-Zustand: ActualDataCard nutzt s2StartIndex für korrekte Semester-Zuordnung, filtert nach SF-Kurs-IDs. Labels auf Deutsch ("Mehrjahresübersicht", "Stoffverteilung"). getAvailableWeeks blockiert Feiertage (type 6) und Events (type 5) explizit — auch wenn der Kurs selbst keinen Eintrag in dieser Woche hat (globale Feiertag-Erkennung).
- v3.23: Enhanced HoverPreview — farbiger Header mit Fachbereich-Akzent, Notizen prominent (6 Zeilen statt 2), Beschreibung (3 Zeilen), SOL-Details, Materiallinks (max 4), Lernziel (2 Zeilen). Smarte Positionierung (links bei Spalten >60%). Dynamische Breite (280px wenn Extras vorhanden, sonst 224px). Block-Vererbung für SubjectArea/Topic.
- v3.24: UX-Kontrast verbessert (gray-500→gray-400 für Labels/Text in DetailPanel, SequencePanel, SettingsPanel, CollectionPanel). Zoom 2 Block-Index fix (Klick→Sequenz öffnet korrekten Block). Toolbar: Excel-Import-Button entfernt (Settings via SidePanel), ⓘ-Icon auf Kacheln entfernt. Bundle-Grösse halbiert (743→398KB).

## Architekturentscheidungen v3.11–v3.19
- **editingSequenceId Format:** Jetzt `seqId-blockIndex` (z.B. `abc123-0`) statt nur `seqId`. WeekRows parsed dieses Format mit Regex und highlightet nur den spezifischen Block.
- **panelWidth:** Im plannerStore persistiert, über Resize-Handle (320–700px) einstellbar.
- **allWeeks Prop:** WeekRows erhält optionale `allWeeks`-Prop mit allen Kalenderwochen beider Semester für Cross-Semester Shift-Select.
- **BatchOrDetailsTab:** Switcher-Komponente — zeigt BatchEditTab bei multiSelection.length > 1, sonst normaler DetailsTab.
- **FlatBlockCard:** Ersetzt alte SequenceCard. Zeigt Blöcke direkt flach, mit Parent-Sequenz-Kontext. Aufklappbare Sections: Felder, Lektionen, Reihen-Einstellungen.
- **CollectionPanel (v3.19):** Eigenständige Komponente als 4. Tab. Datenmodell: `CollectionItem` mit `CollectionUnit[]`. Jede Unit enthält einen Block (ohne Wochen), Lesson-Detail-Snapshots und Original-Lektionstitles. Archiv-Hierarchie: UE < Sequenz < Schuljahr < Bildungsgang. Import erstellt neue Sequenz ohne Wochen-Zuweisung; Optionen für Notizen/Materiallinks. `collection[]` im plannerStore persistiert via `partialize`.
- **ZoomBlockView v3.20–v3.21:** Komplett umgebaut. KW-Zeilen-Layout mit rowSpan für zusammenhängende Sequenz-Blöcke. Nutzt `usePlannerData()`. BlockSpan-Datenstruktur: für jeden Kurs werden kontiguitive Wochenläufe eines Blocks berechnet und als `Map<"startIdx:courseId", BlockSpan>` gespeichert. `skipSet` (Set<string>) trackt welche Zellen von einem rowSpan überdeckt sind. Farbcode: `subjectArea` wird aus Block → Sequenz → weekData-Lektionstyp inferiert (Fallback-Kette). Spaltenbreite 80px.
- **sidePanelTab:** Erweitert auf `'details' | 'sequences' | 'collection' | 'settings'`.

## Offenes Feedback (noch nicht umgesetzt)

### 🔴 Konzeptionell / Architektur
1. **Detailspalte / Notiz-Ansicht (Unterrichtsdurchführung):** Niederschwelliger Zugang zu Notizen, Kommentaren, Reflexion ("wie hat es mit der Klasse funktioniert"). Idee: aufklappbare Detailspalte pro Kurs (wie Excel-Gruppierung). Bei Einzelkurs-Ansicht umsetzbar. Auch Mouse-Over als Option.
2. **Zoom 1 (Multi-Year):** Weitere Verbesserungen der Jahrgänge-Ansicht.

### 🟡 UX (nächste Runde)
5. **Dauer-Warnung bei Verschieben (1L↔2L):** Aktuell kein reales Problem (Verschieben nur innerhalb gleicher Spalte). Relevant wenn cross-column oder Sequenz-Auto-Place erweitert wird.

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
- ✅ Kontextmenü bei Cursor-Position (auch bei Doppelklick leere Zelle)
- ✅ Sequenz-Bar/Label: Klick = nur Highlight im Planer, Doppelklick = Sequenz-Tab öffnen
- ✅ Lektion in Sequenz klicken: Fachbereich wird von Block/Sequenz geerbt
- ✅ "Zu Sequenz hinzufügen"-Button im DetailPanel (neue oder bestehende Sequenz)
- ✅ Fachbereich-Mismatch-Warnung: ⚠ Topic passt zu VWL (geerbt: RECHT) + Korrigieren-Button
- ✅ Reihe-Konzept UX: Erklärtext, editierbarer Titel, Sequenz-Zähler im Header
- ✅ Hover-Preview Timer reduziert (2s → 800ms)
- ✅ Feiertag-Erkennung bei Settings-Import (Auffahrt, Pfingsten etc.)
- ✅ Delete/Backspace-Taste löscht selektierte Zelle (mit Undo)
- ✅ Scroll-to-Current-Button (◉) in Toolbar
- ✅ Geerbter Fachbereich: Label-Hinweis "(geerbt von Sequenz)"
- ✅ Keyboard-Hilfe: Delete, Pfeiltasten dokumentiert
- ✅ Materialsammlung (Sammlung-Tab): 4. Tab "📚 Sammlung" mit Archivieren (UE, Sequenz, Schuljahr, Bildungsgang) und Import (Notizen/Materiallinks optional). 💾-Buttons in FlatBlockCard.
- ✅ Zoom 2 (Mittlere Ansicht): Komplett neu als KW-Zeilen-Layout mit Sequenz-Balken, Ferien-Kollabierung, usePlannerData()-Migration, Klick→Sequenz/Doppelklick→Zoom3.
- ✅ Zoom 1 Ist-Zustand: ActualDataCard mit Semester-Zuordnung via s2StartIndex + Kurs-Filterung. Labels Deutsch.
- ✅ Zoom 1 Labels: "Multi-Year Overview"→"Mehrjahresübersicht", "Lehrplan"→"Stoffverteilung".
- ✅ Feiertage blockieren: getAvailableWeeks überspringt Wochen mit type 5/6 explizit (auch globale Feiertage). Settings auto-apply bei Speichern und App-Init.
- ✅ HoverPreview v2: Farbiger Header, Notizen prominent (6 Zeilen), Beschreibung, SOL, Materiallinks, smarte Positionierung, Block-Vererbung.
- ✅ UX-Kontrast: gray-500→gray-400 für bessere Lesbarkeit aller Labels in allen Panels.
- ✅ Zoom 2 Block-Index: Klick auf Sequenz-Block öffnet korrekten Block (nicht nur Sequenz).
- ✅ Toolbar Cleanup: Excel-Import-Button entfernt, Settings über SidePanel. ⓘ-Icon entfernt. Bundle halbiert.
