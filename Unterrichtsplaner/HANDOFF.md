# Unterrichtsplaner — HANDOFF

## Aktueller Stand: v2.3 (28.02.2026)

### Architektur
- React + TypeScript + Vite + Zustand (persist)
- Deployed auf GitHub Pages
- Pfad: `10 Github/GYM-WR-DUY/Unterrichtsplaner/`

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
- [ ] 12/13 Sequences Support (>11 Blöcke)
- [x] Stats-Dashboard: Prüfungskollisionen erkennen (v2.3)
- [x] Suche über alle Kacheln/Sequenzen (v2.3)
- [x] Print-CSS für Semesterplan-Export (v2.3)

### v2.3 Features (Commit 3810916)
- **Stats-Dashboard Prüfungskollisionen**: parseClassGroups zerlegt Klassenstrings (z.B. "28bc29fs" → ['28b','28c','29f','29s']), findExamCollisions erkennt Wochen mit überlappenden Prüfungen
- **Suche**: Live-Suchfeld in Toolbar, filtert Kacheln/Sequenzen in Zoom 3 und Zoom 2, Highlighting (gelber Outline) + Dimming nicht-matchender Kacheln
- **Print-CSS**: @media print Stylesheet, no-print Klassen auf Toolbar/HelpBar, druckbare Semesterplan-Ansicht
