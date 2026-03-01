# Unterrichtsplaner – Handoff v3.28

## Status: ✅ Deployed (v3.38)
- **Commit:** bf80b5e
- **Datum:** 2026-03-01
- **Deploy:** https://durandbourjate.github.io/GYM-WR-DUY/Unterrichtsplaner/

## Architektur
- **Stack:** React + TypeScript + Vite + Zustand + PWA
- **Store:** `plannerStore.ts` (~1125 Z.), `settingsStore.ts` (181 Z.)
- **Hook:** `usePlannerData.ts` — dynamische Courses/Weeks basierend auf Settings
- **Hauptkomponenten:** WeekRows (~1021 Z.), SequencePanel (~660 Z.), DetailPanel (~1027 Z.), ZoomYearView (~569 Z.), Toolbar (~463 Z.), SettingsPanel (~444 Z.), CollectionPanel (~295 Z.)

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
- v3.24: UX-Kontrast verbessert (gray-500→gray-400 für Labels/Text in DetailPanel, SequencePanel, SettingsPanel, CollectionPanel). Zoom 2 Block-Index fix (Klick→Sequenz öffnet korrekten Block). Toolbar: Excel-Import-Button entfernt (Settings via SidePanel), ⓘ-Icon auf Kacheln entfernt. Bundle-Grösse halbiert (743→398KB). Deploy-Workflow repariert (kombinierte Site: Uebungen + Unterrichtsplaner). SW-Scope auf /Unterrichtsplaner/ beschränkt.
- v3.25: Aufklappbare Notizen-Spalte pro Kurs. Toggle-Button (▸/◂) im Spaltenheader. Inline-editierbare NoteCell (100px) zeigt/bearbeitet Notizen aus lessonDetails.
- v3.26: HoverPreview zeigt nach oben bei Zellen im unteren Bildschirmdrittel. Notizen-Spalte: breiterer Default (200px), grösserer Toggle-Button mit 📝-Icon, Zeilenumbrüche (whitespace-pre-line), grössere Schrift.
- v3.27: Zoom 2 — farbige Blöcke mit Dark-Mode-Palette (VWL=orange-braun, BWL=dunkelblau, Recht=dunkelgrün), grössere Schrift (10px Labels, 8px Details), breitere Spalten (110px). Notizen-Spalte resizable (Drag-Handle im Header, 80-400px Range, noteColWidth im Store). ZoomYearView Placeholder-Datei.

- v3.28: Zoom 2 komplett umgebaut → Jahresansicht (ZoomYearView). Ganzes Schuljahr in einer Tabelle statt S1/S2 separat. Kurse nach cls+typ gruppiert. 2-Tage-Kurse: breiter Balken bei geteilter Sequenz (courseIds), 2 schmale Sub-Spalten bei separaten Sequenzen. Semester-Trennlinie (goldener Border). ZoomBlockView (alte Semesteransicht) bleibt als Komponente erhalten, wird aber nicht mehr in App.tsx verwendet.

- v3.29: SOL-Total — Σ-Badge neben "📚 SOL (Reihe)" zeigt Summe aller Lektion-SOL-Einträge (count + formatierte Dauer). Neue utils/solTotal.ts mit parseDurationToMinutes (erkennt min/h/Lektionen/Halbtag/Ganztag), formatMinutes, computeSeqSolTotal. Duplikat-Funktionen aus SequencePanel entfernt.

- v3.30: SidePanel schliesst bei Abwahl — Klick leere Zelle und Klick gleiche Zelle (toggle) schliessen Panel + clearing editingSequenceId.

- v3.31: Noten-Vorgaben-Tracking (MiSDV Art. 4) — Neue utils/gradeRequirements.ts mit Mindestanzahl-Beurteilungsprüfung pro Kursgruppe/Semester/GYM-Stufe. Rotes Badge (Zahl) am 📊-Button bei offenen Warnungen. StatsPanel zeigt Section "📋 Beurteilungsvorgaben" mit Warnungen (🔴 critical, 🟡 warning) und OK-Status. GYM-Stufe wird aus Klassenname abgeleitet (Maturjahrgang → GYM1-5).

- v3.32: UX-Verbesserungen — (1) Leere Zellen klickbar mit blauer Markierung statt nur Deselect. (2) SidePanel schliesst zuverlässig bei Abwahl + Klick leere Zelle. (3) Zoom 2 grössere Schrift: ROW_H 26px, Labels 12/10/9px, Spalten 140/70px. (4) Sequenz-Klick in Zoom 2 scrollt die SequenceCard im Panel automatisch in View (scrollIntoView). (5) Shift-Klick bei Mehrtages-Kursen wählt nur den angeklickten Tag; Shift+Alt wählt beide Tage. (6) SequencePanel cardRef-Duplikat bereinigt.

- v3.33: Batch-Edit Active-State — Fachbereich/Kategorie/Dauer/SOL-Buttons im Batch-Tab zeigen den aktuellen Wert der selektierten Zellen mit farblicher Hervorhebung (ring + stärkerer Hintergrund). "(gemischt)"-Hinweis bei unterschiedlichen Werten. ZoomYearView sticky header Positionsfix.

- v3.34: UX-Verbesserungen #2 — (1) Klick+Drag leere Zellen bleiben nach mouseup markiert (lila Outline bleibt). (2) Zoom 3: Toggle vergangene Wochen dim/hell (◐-Button in Toolbar, `dimPastWeeks` in Store). (3) Shift-Klick Mehrtages-Kurse: Popup fragt "Auch [anderer Tag] auswählen?" statt Shift+Alt. (4) Zoom 2: Einzellektionen ohne Sequenz werden angezeigt (gestrichelter Border, halbtransparent, Klick→Details, DblClick→Zoom3). (5) SequencePanel: aktive Sequenz als Pin-Card oben angepinnt (unter Klassenbuttons); Felder+Lektionen standardmässig ausgeklappt wenn aktiv.

- v3.35: UX-Fixes #3 — (1) Sequenz-Bar + Label Farbcode = Fachbereich statt Kurstyp (VWL=orange, BWL=blau, Recht=grün, IN=grau, INTERDISZ=violett). (2) Ferien-Wochen (type 6) in Sequenz-Lektionsliste als graue nicht-editierbare Zeile. (3) Felder/Lektionen in FlatBlockCard default ausgeklappt. (4) Aktive Sequenz Pin-Card: excluded aus normaler Sequenzliste (Doppel-Anzeige-Bug). (5) Sammlung-Buttons umbenannt: "📥 In Sammlung" / "📥 Reihe → Sammlung".

- v3.36: UX-Fixes #4 — (1) Shift-Klick Mehrtages-Bug fix: "Ja, beide Tage" expandiert gesamte multiSelection um andere Tage. Kein Popup wenn anderer Tag bereits selektiert. Popup schliesst bei Click-Outside/Esc. (2) Sequenz-Detail Feldordnung: Oberthema→Unterthema→Beschreibung→Lehrplanziel (kleiner). (3) Material vereinfacht: LearningView+Materiallinks → ein "Material"-Feld. (4) Zoom 2 loose lessons fix: entry.title-Prüfung, type 0 korrekt, Holidays/Events gefiltert.

- v3.37: Zoom 2 + Ferien Fixes — (1) Ferien/Events zeigen keinen Sequenz-Balken/Label in Zoom 3. (2) Zoom 2 loose lessons bei multi-day Kursen (looseKey-Fallback). (3) Header top:0 + padding → Klassen-Beschriftungen voll lesbar. (4) Block-Farben aufgehellt, Default-Block heller, Ferien/KW-Labels heller. (5) dimPastWeeks-Toggle wirkt in Zoom 2.

- v3.38: Ferien/Events Zoom 2 Overhaul — (1) Aufeinanderfolgende Ferien-Wochen als zusammengefasste rowSpan-Blöcke (KW-Range, 🏖, Name, Wochenzähler). (2) Ganztags-Events als colspan-Block mit 📅 + amber-Farbe. (3) Partielle Events pro Kurs-Zelle als Mini-Blöcke. (4) Multi-day Sub-Columns Events/Holidays ebenso.

- v3.35: UX-Fixes #3 — (1) Sequenz-Bar + Label Farbcode = Fachbereich statt Kurstyp (VWL=orange, BWL=blau, Recht=grün, IN=grau, INTERDISZ=violett). (2) Ferien-Wochen (type 6) in Sequenz-Lektionsliste als graue nicht-editierbare Zeile statt klickbar. (3) Felder/Lektionen in FlatBlockCard default ausgeklappt (useState(true)). (4) Aktive Sequenz Pin-Card: wird aus der normalen Sequenzliste excluded um Doppel-Anzeige zu vermeiden. (5) Sammlung-Buttons umbenannt: "💾 UE speichern" → "📥 In Sammlung", "💾 Reihe" → "📥 Reihe → Sammlung".

- v3.37: Zoom 2 + Ferien Fixes — (1) Ferien/Events (isFixed) zeigen keinen Sequenz-Balken und kein Sequenz-Label mehr in Zoom 3. (2) Zoom 2 loose lessons: Multi-day-Kurse zeigen jetzt auch Einzellektionen (looseKey-Fallback bei Sub-Columns fehlte). (3) Zoom 2 Header: `top: 0` statt `top: -1`, mehr Padding (`py-1`) → Klassen-Beschriftungen voll lesbar. (4) Zoom 2 Schrift heller: Block-Farben aufgehellt (VWL fg `#fde6cc`, BWL `#dbeafe`, Recht `#d1fae5`), Default-Block `#cbd5e1`, Ferien-Label `text-gray-300`, KW-Labels `text-gray-400`. (5) dimPastWeeks-Toggle wirkt jetzt in Zoom 2 (war vorher hardcoded opacity 0.5).

- v3.36: UX-Fixes #4 — (1) Shift-Klick Mehrtages-Bug fix: "Ja, beide Tage" expandiert jetzt die GESAMTE aktuelle multiSelection um die anderen Tage (nicht nur letzte Woche). Kein Popup wenn anderer Tag bereits manuell selektiert. Popup schliesst bei Klick daneben oder Esc. (2) Sequenz-Detail Feldordnung: Oberthema→Unterthema→Beschreibung→Lehrplanziel (kleiner, dezenter). (3) Material vereinfacht: LearningView-Feld + Materiallinks → ein "Material"-Feld. LV-URLs werden intern erkannt und in learningviewUrl gespeichert (Rückwärtskompatibilität). (4) Zoom 2 loose lessons fix: entry.title-Prüfung statt nur entry, type 0 korrekt behandelt (nicht mehr als empty string), Holidays/Events gefiltert, Label zeigt Titel statt Type-Nummer.

### Offene Feature-Requests v3.35+

#### 🔴 Sofort (v3.35) — ✅ Erledigt
1. ✅ Sequenz-Bar Farbcode = Fachbereich
2. ✅ Ferien aus Lektionsliste filtern
3. ✅ Felder/Lektionen default ausgeklappt
4. ✅ Doppelte Sequenz-Anzeige Bug fix
5. ✅ Sammlung-Buttons umbenannt

#### 🟡 Bald (v3.36) — ✅ Erledigt
6. ✅ Shift-Klick Mehrtages-Bug fix (voller Range, kein Popup bei manueller Auswahl, Click-Outside/Esc)
7. ✅ Popup UX Mehrtages-Kurse (integriert in #6)
8. ✅ Lehrplanziel weniger prominent (Reihenfolge: Oberthema→Unterthema→Beschreibung→Lehrplanziel)
9. ✅ Material vereinfacht (LV+Material → 1 Feld)
10. ✅ Zoom 2 loose lessons Bug fix

- v3.38: Ferien/Events Zoom 2 Overhaul — (1) Aufeinanderfolgende Ferien-Wochen (type 6) werden als zusammengefasste rowSpan-Blöcke gerendert mit KW-Range-Label (z.B. "KW42–KW43"), 🏖-Icon, Name und Wochenzähler. (2) Ganztags-Events (type 5, alle Kurse betroffen) ebenso als colspan-Block mit 📅-Icon und amber-Farbe. (3) Partielle Events (nur einzelne Kurse betroffen): pro Kurs-Zelle als kleiner grauer Block mit Icon statt leere Zelle. (4) Multi-day Sub-Columns: Events/Holidays werden dort ebenfalls als Mini-Blöcke gerendert.

#### 🔵 Nächste Runde (v3.37+) — ✅ Erledigt
11. ✅ Ferien als durchgehende Blöcke (rowSpan, zusammengefasst, normalgross)
12. ✅ Studienreisen/Sonderwochen visuell (colspan für Ganz-Events, pro-Kurs-Blöcke für partielle)
13. **Google Calendar Integration** — Konzept steht, Umsetzung bei Gelegenheit

### Feature-Spec: Google Calendar Integration (geplant)

**Kernidee:** Planer wird zur Quelle für Unterrichtslektionen im Kalender. Keine Doppelpflege mehr.

**3 Funktionen:**

1. **Planer→Kalender Sync (automatisch bei jeder Änderung)**
   - Lektionen/Prüfungen werden als Google-Calendar-Events erstellt
   - Wählbar: alle Lektionen (wöchentlich) ODER nur Prüfungen/Spezialanlässe
   - Events mit Tag `planer-managed` markiert, damit Planer sie wiedererkennt
   - Update/Delete bei Änderungen im Planer (bidirektional nur Planer→Kalender)
   - Event enthält: Titel, Fachbereich, Thema, Klasse, Zeitslot (aus Kursdaten)

2. **Kalender→Planer Import (Sonderwochen)**
   - Events aus Schul-Kalender mit Keywords (IW, Besuchstag, Sonderwoche) → Holiday/Event-Blöcke
   - Per "Importieren"-Aktion oder automatisch bei erkannten Keywords
   - Multi-Kalender-Support: Benutzer wählt in Settings welche Kalender gelesen werden

3. **Kollisionswarnungen (⚠️ in Zellen)**
   - Nur für Events aus Nicht-Planer-Kalendern (keine Warnungen für selbst gepushte Lektionen)
   - ⚠️ wenn Schul-Kalender-Event (Sitzung, Konferenz) auf gleichen Zeitslot fällt
   - Tooltip zeigt kollidierenden Event

**Multi-Kalender-Architektur:**
- Schreib-Kalender: 1 Kalender konfigurierbar (z.B. "Unterricht") — hier pushed der Planer hin
- Lese-Kalender: N Kalender konfigurierbar (z.B. "Schule allgemein", "Privat") — für Import + Kollision
- planer-managed Events werden bei Kollisionscheck ausgeschlossen

**Technisch:**
- Google Calendar API via OAuth (Settings-Flow)
- Sync-State im plannerStore (eventId-Mapping pro Lektion)
- Settings: Kalender-Auswahl, Sync-Modus (alle/nur Prüfungen), Auto-Sync on/off Klick zum Editieren, Enter/Blur zum Speichern, Escape zum Abbrechen.

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

### 🟡 Geplant (mittlere Priorität)
1. **Google Calendar Integration** — Konzept dokumentiert (siehe Feature-Spec oben). Planer→Kalender Sync, Kalender→Planer Import, Kollisionswarnungen.
2. **Dauer-Warnung bei Verschieben (1L↔2L):** Relevant wenn cross-column oder Sequenz-Auto-Place erweitert wird.

### 🔵 Ideen (niedrige Priorität)
3. **Automatischer Lehrplanbezug:** Lehrplanziele automatisch aus Thema/Fachbereich vorschlagen.
4. **Zoom 1 (Multi-Year):** Weitere Verbesserungen der Jahrgänge-Ansicht.

### 🟢 Erledigt (v3.11–v3.29)
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
- ✅ Deploy-Fix: Kombinierte Site (Uebungen + Unterrichtsplaner). SW-Scope korrigiert.
- ✅ Notizen-Spalte (v3.25–v3.26): Aufklappbar pro Kurs via 📝-Toggle im Header. Inline-editierbare NoteCell, 200px Default, resizable (80–400px), Zeilenumbrüche. Löst "Detailspalte / Notiz-Ansicht" Feature-Request.
- ✅ HoverPreview Positionierung (v3.26): Zeigt nach oben bei Zellen im unteren Bildschirmdrittel.
- ✅ Zoom 2 Farbpalette (v3.27): Dark-Mode-Farben (VWL=orange, BWL=blau, Recht=grün), grössere Schrift, breitere Spalten.
- ✅ Zoom 2 Jahresansicht (v3.28): Ganzes Schuljahr in einer Tabelle. Kurse nach cls+typ gruppiert. 2-Tage-Kurse: breiter Balken bei geteilter Sequenz, 2 schmale Sub-Spalten bei separaten.
- ✅ SOL-Total (v3.29): Σ-Badge zeigt Summe aller Lektion-SOL-Einträge pro Sequenz. utils/solTotal.ts.
