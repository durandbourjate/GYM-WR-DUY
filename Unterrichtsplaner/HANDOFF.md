# Unterrichtsplaner — HANDOFF

## Aktueller Stand: v2.1 (28.02.2026)

### Architektur
- React + TypeScript + Vite + Zustand (persist)
- Deployed auf GitHub Pages
- Pfad: `10 Github/GYM-WR-DUY/Unterrichtsplaner/`

### Commits v2.0–2.1 Session
- 4eabeda: Side-Panel, Hover-Preview, Seq-Hervorhebung, feste Kacheln
- 58f4128: Auto-Farbe bei Sequenz-Erstellung, Import blockType, Kurs-Labels
- 04030e3: Klassenfilter, Push überspringt Ferien
- 4ee54db: '+ Neu' Button in Toolbar
- f192745: Block-Details + Vererbung an Kacheln
- a497132: Sequenzen folgen Kacheln bei Drag&Drop, Block-Vererbung im Grid
- (v2.1): Zoom-Level 2 Block-Ansicht, Zoom-Toolbar, Keyboard-Shortcuts 1/2/3

### Implementierte Features (komplett)

**Phase 1 — Kern-Interaktion ✅**
- 1x Klick = Select + Minibuttons (+/↓/i)
- 2x Klick = Detail-Panel öffnen (rechtes Seitenpanel)
- Hover-Preview nach 2s
- Click-outside-to-close
- Leere Zellen → Kontextmenü
- Tooltips auf allen Buttons
- Alle Spalten gleich breit (110px)

**Phase 2 — Multi-Select & Sequenzen (grösstenteils ✅)**
- Cmd+Klick Multi-Selektion
- Sequenz-Markierung klickbar → Panel öffnen
- Sequenz-Hervorhebung im Grid bei Block-Selektion
- Auto-Farbe/Fach bei Sequenz-Erstellung
- '+ Neu' Button in Toolbar für schnelle Sequenz-Erstellung
- Klassenname klickbar → Klassenfilter
- Typ-Badge klickbar → Typ-Filter

**Phase 3 — Ferien, Fixierung, Vererbung (grösstenteils ✅)**
- Ferien/Events (Type 5+6): nicht draggable, Icons, grössere Kacheln
- Push überspringt fixierte Zellen
- Drop auf fixierte Zellen blockiert
- Block-Details: topicMain, topicSub, subjectArea, curriculumGoal, etc.
- Vererbung: Block-Werte als Defaults für Kacheln (Detail-Panel + Grid-Titel)
- Sequenzmarkierung bewegt sich mit Kacheln bei Drag&Drop (swap + move)

**Phase 5 — Zoom (teilweise ✅)**
- Zoom-Level Store (zoomLevel: 1|2|3, Default=3)
- Toolbar: 3-stufiger Zoom-Schalter (◫ ▧ ▦)
- Keyboard-Shortcuts: 1/2/3 zum Umschalten (ohne Modifier, nicht in Inputs)
- Zoom 3 (nah) = Wochen-Ansicht (bisherige Ansicht) ✅
- Zoom 2 (mittel) = Block-Ansicht (ZoomBlockView) ✅
  - Farbige Timeline-Balken pro Kurs, geordnet nach Sequenz-Blöcken
  - Fachfarben: BWL=blau, VWL=orange, Recht=grün, IN=cyan, Interdisz=violett
  - Wochen-Skala oben, Hover-Tooltips mit Block-Details
  - Gap-Darstellung für unsequenzierte Lektionen
  - Filter (Typ/Klasse) wirken auch auf Block-Ansicht
- Zoom 1 (weit) = Platzhalter für Multi-Year View

### Noch offen

#### Phase 2 (verbleibend)
- [ ] Gruppen-Drag&Drop bei Multi-Selektion

#### Phase 4 — Automation
- [ ] Theme→Lehrplanziel Mapping (curriculumGoals.ts + Grobzuteilung)
- [ ] Theme→Taxonomiestufe Mapping

#### Phase 5 — Multi-Year View (verbleibend)
- [ ] Zoom-Level 1 = Semesterübersicht über 4 GYM-Jahre
- [ ] Jahrgang-Modus vs. Schuljahr-Modus
- [ ] Klick auf Block in Zoom 2 → Detail-Panel oder Zoom 3 mit Scroll-to
