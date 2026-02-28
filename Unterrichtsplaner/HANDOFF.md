# Unterrichtsplaner — HANDOFF

## Aktueller Stand: v2.5 (28.02.2026)

### Architektur
- React + TypeScript + Vite + Zustand (persist)
- Deployed auf GitHub Pages
- Pfad: `10 Github/GYM-WR-DUY/Unterrichtsplaner/`
- **Stundenplan-Quelle**: `04 Rahmenbedingungen/Stundenplan/` — Immer aktuellste Phase verwenden!
- **SF-Wochentage**: Di + Do (NICHT Mi/Fr!). Kein Unterricht am Freitag.
- **SF-Gruppen**: 29c (Di L2 + Do L3-4), 27a28f (Di+Do L7-8), 28bc29fs (Di L9-10 + Do L2)
- **Klassenbezeichnungen**: 27a28f (nicht 27abcd8f), 28bc29fs (nicht 28bc9f9s)
- **Semester-Unterschiede**: KS 27a S1=Mo, S2=Do. EWR 29fs S1=Di, S2=Do. IN phasenabhängig.
- **getLinkedCourseIds()**: Hilfsfunktion in courses.ts findet alle Kurse derselben Klasse+Typ

### Commits v2.0–2.2 Session
- 4eabeda: Side-Panel, Hover-Preview, Seq-Hervorhebung, feste Kacheln
- 58f4128: Auto-Farbe bei Sequenz-Erstellung, Import blockType, Kurs-Labels
- 04030e3: Klassenfilter, Push überspringt Ferien
- 4ee54db: '+ Neu' Button in Toolbar
- f192745: Block-Details + Vererbung an Kacheln
- a497132: Sequenzen folgen Kacheln bei Drag&Drop, Block-Vererbung im Grid
- 0c68ed0: Zoom-Level 2 Block-Ansicht, Zoom-Toolbar, Keyboard-Shortcuts 1/2/3
- 0384576: Klick auf Block in Zoom 2 → Zoom 3 mit Scroll + Sequenz-Panel
- 1fca857: Multi-Select Batch-Buttons verdrahtet (Phase 2 komplett)
- 5aa1df4: HANDOFF.md aktualisiert
- 46407d5: Phase 4 Auto-Suggest + Zoom 1 Multi-Year View
- 4fdd6d0: HANDOFF.md aktualisiert — v2.2
- 3810916: Stats-Dashboard Prüfungskollisionen, Suche, Print-CSS
- e71b774: 12/13+ Sequences Support — 16 Farben, Kompaktansicht Blöcke
- 80c6fca: Shift+Klick Bereichs-Selektion, Gruppen-Drag&Drop
- a8557e0: Farbcode LearningView-konform, Sequenz-Titel-Fix
- de583f6: Stundenplan erster Fix
- f906097: **Stundenplan komplett korrigiert** — SF=Di+Do, kein Fr, IN phasenabhängig
- 1255499: **Shift+Klick → Neue Sequenz** — MultiSelect auf leeren+vollen Zellen, grüner Button
- 046fd9b: **Multi-Tag-Sequenzen** — courseIds Verknüpfung, Auto-Place über alle Spalten
- d20d7c0: **Jahrgangs-Modus Zoom 1** — 🎓 Jahrgänge mit Soll/Ist pro SF-Gruppe

### Implementierte Features (komplett)

**Phase 1 — Kern-Interaktion ✅**
- 1x Klick = Select + Minibuttons (+/↓/i)
- 2x Klick = Detail-Panel öffnen (rechtes Seitenpanel)
- Hover-Preview nach 2s
- Click-outside-to-close
- Leere Zellen → Kontextmenü
- Tooltips auf allen Buttons
- Alle Spalten gleich breit (110px)

**Phase 2 — Multi-Select & Sequenzen ✅**
- Cmd+Klick Multi-Selektion
- Shift+Klick Bereichs-Selektion (von-bis innerhalb einer Spalte)
- Gruppen-Drag&Drop: multi-selektierte Kacheln als Gruppe verschieben
- Sequenz-Markierung klickbar → Panel öffnen
- Sequenz-Hervorhebung im Grid bei Block-Selektion
- Auto-Farbe/Fach bei Sequenz-Erstellung
- '+ Neu' Button in Toolbar für schnelle Sequenz-Erstellung
- Klassenname klickbar → Klassenfilter
- Typ-Badge klickbar → Typ-Filter
- Batch-Buttons verdrahtet: ↓ Verschieben (+1) und ⊞ Einfügen davor

**Phase 3 — Ferien, Fixierung, Vererbung ✅**
- Ferien/Events (Type 5+6): nicht draggable, Icons, grössere Kacheln
- Push überspringt fixierte Zellen
- Drop auf fixierte Zellen blockiert
- Block-Details: topicMain, topicSub, subjectArea, curriculumGoal, etc.
- Vererbung: Block-Werte als Defaults für Kacheln (Detail-Panel + Grid-Titel)
- Sequenzmarkierung bewegt sich mit Kacheln bei Drag&Drop (swap + move)

**Phase 4 — Automation ✅**
- Auto-suggest Lehrplanziele: fuzzy-match topicMain gegen CURRICULUM_GOALS
  mit score-basiertem Ranking, Fachbereich-Boost, klickbare Vorschläge
- Auto-suggest Taxonomiestufe: BlockType→K-Level Mapping (INTRO→K1, LESSON→K2, etc.)
- Suggestion-Chips im DetailPanel unter Thema/Taxonomie Feldern

**Phase 5 — Zoom ✅**
- Zoom-Level Store (zoomLevel: 1|2|3, Default=3)
- Toolbar: 3-stufiger Zoom-Schalter (◫ ▧ ▦)
- Keyboard-Shortcuts: 1/2/3 zum Umschalten (ohne Modifier, nicht in Inputs)
- Zoom 3 (nah) = Wochen-Ansicht (bisherige Ansicht)
- Zoom 2 (mittel) = Block-Ansicht (ZoomBlockView)
  - Farbige Timeline-Balken pro Kurs, geordnet nach Sequenz-Blöcken
  - Fachfarben: BWL=blau, VWL=orange, Recht=grün, IN=cyan, Interdisz=violett
  - Wochen-Skala oben, Hover-Tooltips mit Block-Details
  - Gap-Darstellung für unsequenzierte Lektionen
  - Filter (Typ/Klasse) wirken auch auf Block-Ansicht
  - Klick auf Block → Zoom 3 mit Scroll + Sequenz-Panel
- Zoom 1 (weit) = Multi-Year View (Semesterübersicht S1–S8)
  - Lehrplan-Modus: Stoffverteilung DUY mit expandierbaren Semester-Karten
  - Ist-Zustand-Modus: aggregierte Statistiken aus Sequenz-Daten
  - Farbcodierung BWL/VWL/Recht konsistent

### Noch offen / Ideen
- [x] 12/13 Sequences Support (v2.4: 16 Farben, Kompaktansicht >6 Blöcke)
- [x] Stats-Dashboard: Prüfungskollisionen erkennen (v2.3)
- [x] Suche über alle Kacheln/Sequenzen (v2.3)
- [x] Print-CSS für Semesterplan-Export (v2.3)
- [x] Shift+Klick Bereichs-Selektion (v2.5)
- [x] Gruppen-Drag&Drop (v2.5)
- [x] Multi-Tag-Sequenzen: Sequenz über 2 courseIds (Di+Do), Di-Do alternierend ODER getrennt (v2.7)
- [x] Shift+Klick Bereichsauswahl → Sequenz starten aus Mehrfachauswahl (v2.6)
- [x] Jahrgangs-Modus in Zoom 1: SF-Gruppen mit Soll/Ist-Vergleich (v2.8)

### v2.5 Features (Commits 80c6fca, a8557e0)
- **Shift+Klick Bereichs-Selektion**: Shift+Klick selektiert alle Kacheln von der letzten Auswahl bis zur geklickten Zelle innerhalb derselben Spalte. Funktioniert additiv mit bestehender Multi-Selektion.
- **Gruppen-Drag&Drop**: Multi-selektierte Kacheln können als Gruppe per Drag&Drop an eine neue Position innerhalb derselben Spalte verschoben werden. Fixierte Zellen (Ferien/Events) werden übersprungen, bestehende Kacheln rutschen nach unten.
- **lastSelectedKey Tracking**: Store trackt die letzte selektierte Kachel für korrekte Shift-Bereichs-Berechnung.
- **Farbcode LearningView-konform**: VWL=orange, BWL=blau, Recht=grün, IN=grau. SubjectArea-Farbe hat Priorität über LessonType in Kacheln. Alle Views (Zoom 1-3, Stats) konsistent.
- **Sequenz-Titel**: Migration generiert jetzt Titel mit Klasse+Typ+Tag statt courseId (z.B. "Sequenzen 27abcd8f SF Do" statt "Sequenzen c17"). Re-Migration für bestehende Sequenzen via `fixSequenceTitles()`.
- **Stundenplan korrigiert (de583f6)**: courses.ts komplett überarbeitet basierend auf Stundenplan S2 Phase 4. SF liegt auf **Do+Fr** (war fälschlich Di+Mi), IN auf **Di** (war Mo). Klassenbezeichnungen vollständig: 27abcd8f (statt 27a28f), 28bc9f9s (statt 28bc29fs). Quelle: `04 Rahmenbedingungen/Stundenplan/Stundenplan S2 Phase 4.pdf`

### v2.4 Features (Commit e71b774)
- **Erweiterte Farbpalette**: SEQUENCE_COLORS von 10 auf 16 Farben, Color-Picker mit flex-wrap
- **Kompaktansicht Blöcke**: Bei Sequenzen mit >6 Blöcken automatisch einzeilige Darstellung (Label + Wochen-Anzahl + KW-Bereich), Toggle zwischen kompakt/erweitert
- **Block-Zähler**: Anzahl Blöcke im Panel-Header sichtbar

### v2.3 Features (Commit 3810916)
- **Stats-Dashboard Prüfungskollisionen**: parseClassGroups zerlegt Klassenstrings (z.B. "28bc29fs" → ['28b','28c','29f','29s']), findExamCollisions erkennt Wochen mit überlappenden Prüfungen
- **Suche**: Live-Suchfeld in Toolbar, filtert Kacheln/Sequenzen in Zoom 3 und Zoom 2, Highlighting (gelber Outline) + Dimming nicht-matchender Kacheln
- **Print-CSS**: @media print Stylesheet, no-print Klassen auf Toolbar/HelpBar, druckbare Semesterplan-Ansicht
