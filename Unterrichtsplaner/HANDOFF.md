# Unterrichtsplaner — HANDOFF

## Aktueller Stand: v2.0 Features in Arbeit

### Architektur
- React + TypeScript + Vite + Zustand (persist)
- Deployed auf GitHub Pages
- Pfad: `10 Github/GYM-WR-DUY/Unterrichtsplaner/`

### Implementierte Features (v1.x → v2.0)
- Wochenplan-Grid mit Semester 1+2
- Drag & Drop einzelner Kacheln
- Detail-Panel rechts (Tabs: Details | Sequenzen)
- Sequenzen CRUD + Auto-Platzierung
- HK-Rotation, TaF-Phasen
- Excel-Import (mit Spalten/Zeilen-Mapping), Export/Import JSON
- Suche, Stats-Dashboard, Print-CSS
- Klick-Modell: 1x=Select+Minibuttons, 2x=Detail-Panel
- Hover-Preview nach 2s
- Click-outside-to-close
- Leere Zellen → Kontextmenü (Neue Kachel/Sequenz)
- Cmd+Klick Multi-Selektion
- Sequenz-Markierung klickbar → Panel öffnen
- Sequenz-Hervorhebung im Grid bei Block-Selektion
- Kachel-Titel: Oberthema › Unterthema aus lessonDetails
- Ferien/Events nicht draggable, grössere Kacheln, Icons
- Push überspringt fixierte Zellen (Ferien/Events)
- Auto-Farbe/Fach bei Sequenz-Erstellung aus Kurs
- Import setzt blockType=LESSON als Default
- Klassenfilter: Klick auf Klassenname filtert Spalten
- Typ-Badge klickbar als Filter (SF/EWR/etc.)
- Tooltips auf allen Toolbar-Buttons

### Commits v2.0
- 4eabeda: Side-Panel, Hover-Preview, Seq-Hervorhebung, feste Kacheln
- 58f4128: Auto-Farbe bei Sequenz-Erstellung, Import blockType, Kurs-Labels
- 04030e3: Klassenfilter, Push überspringt Ferien

### Noch offen (v2 Anforderungen)
#### Phase 2 (verbleibend)
- [ ] Gruppen-Drag&Drop bei Multi-Selektion
- [ ] Verständliche Labels statt interner IDs in Sequenzen
- [ ] Neue Sequenz/Kachel Buttons in Titelzeile des Übersichtsplans

#### Phase 3
- [ ] Block-Details: Oberthema, Lehrplanziel, Beschreibung, Material-Links auf Blockebene
- [ ] Vererbung: Block-Infos als Defaults für enthaltene Kacheln
- [ ] Sequenzmarkierung bewegt sich mit Kacheln beim Verschieben

#### Phase 4
- [ ] Theme→Lehrplanziel Mapping (curriculumGoals.ts + Grobzuteilung)
- [ ] Theme→Taxonomiestufe Mapping
- [ ] Header-Filter für alle Buttons klickbar (✅ teilweise implementiert)

#### Phase 5
- [ ] Zoom-Level 3 (close) = aktuelle Ansicht
- [ ] Zoom-Level 2 (medium) = Sequenz-/Block-Ansicht
- [ ] Zoom-Level 1 (far) = Semesterübersicht über 4 GYM-Jahre
- [ ] Jahrgang-Modus vs. Schuljahr-Modus
