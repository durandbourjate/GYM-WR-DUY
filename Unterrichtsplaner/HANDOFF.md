# Unterrichtsplaner – Handoff

## Projektstatus: v1.4

### Tech Stack
- React 18 + TypeScript + Vite 7
- Zustand 5 (mit `persist` → localStorage)
- Tailwind 4 (inline classes)
- Keine externe UI-Bibliothek

### Was steht (v1.1 → v1.2 Änderungen markiert mit 🆕)

**Kernfunktionen:**
- Jahresübersicht als Tabelle: Zeilen = KW33–KW27, Spalten = 13 Kurse
- Semester-Split bei KW07 (S2_START_INDEX = 26)
- Filter nach Kurstyp (ALL/SF/EWR/IN/KS)
- Inline-Edit per Doppelklick
- Drag & Drop zum Verschieben/Tauschen
- Push-Funktion (alle folgenden Einträge +1)
- Insert-Dialog mit 1L/2L-Slot-Konflikt-Warnung
- Undo (Ctrl+Z, 10-stufig)
- Sequenz-Balken (grüne vertikale Themenblöcke)

**Detail-Panel (fixiert unten):**
- Fachbereich, Taxonomiestufe K1–K6, Block-Typ
- Thema (Haupt/Unter), Lehrplanziel LP17
- LearningView-URL, Material-Links, Notizen

**🆕 v1.2 Neu:**
- Automatische Aktuelle-Woche-Erkennung (ISO 8601, kein Hardcode mehr)
- Multi-Select Batch-Aktionen funktional (Verschieben +1, Einfügen davor)
- JSON Export/Import-Buttons in Toolbar (Datensicherung)
- Suchfeld in Toolbar (filtert alle Lektionsinhalte, Treffer gelb, Rest gedimmt)
- Sequences für 12/13 Kurse vervollständigt (vorher 5/13)

**🆕 v1.3 Neu:**
- Statistik-Dashboard (📊 Button): Prüfungsverteilung, Fachbereich-Balance, Prüfungskollisionen
- Keyboard Shortcuts: ⌘F → Suche, Escape → Schliessen/Abwählen
- Print-CSS (A3 Landscape, kompakte Darstellung)
- Fix: React Error #310 (useCallback Typ-Parameter in DetailPanel)

**🆕 v1.4 Neu:**
- Curriculum-Goals-Library: 30+ LP17-Grobziele als durchsuchbares Dropdown
  - Neue Datei: `src/data/curriculumGoals.ts` (strukturierte LP17-Ziele mit ID, Fachbereich, Zyklus, Semester)
  - Neue Komponente: `src/components/CurriculumGoalPicker.tsx` (Suche, Zyklusfilter, Fachbereich-Filterung, Freitext-Fallback)
  - DetailPanel: Lehrplanziel-Feld ersetzt Freitext-Textarea durch den Picker
  - IDs nach Schema: R-Z1-01 (Recht, Zyklus 1, Nr 1), B-Z2-03 (BWL, Zyklus 2, Nr 3), V-Z2-07 (VWL)
  - Filtert automatisch nach gewähltem Fachbereich (subjectArea)
  - Semester-Zuordnung gemäss DUY-Grobzuteilung (S1–S8)

### Datenmodell
- `Course`: id, col, cls, typ, day, from/to, les, hk, semesters
- `Week`: w (KW), lessons: Record<col, LessonEntry>
- `LessonEntry`: title, type (0–6)
- `LessonDetail`: subjectArea, topicMain/Sub, curriculumGoal, taxonomyLevel, blockType, learningviewUrl, materialLinks[], notes
- `Sequence`: weeks[], label

- `CurriculumGoal`: id, area, cycle, topic, goal, contents[], semester

### Persistenz
- localStorage via Zustand persist (weekData + lessonDetails)
- 🆕 JSON Export/Import für manuelle Backups

### Bekannte Limitierungen
1. Kein Responsive Design — Desktop-optimiert
2. Sequences fehlen noch für c37 (30s IN Fr 1L, zu wenige Einträge)
3. EWR (c15) und IN-HK (c13) nur S1

### Mögliche nächste Features (Phase 2+)
- Export als Markdown / Excel
- Print-/PDF-Ansicht für Semesterplan
- Keyboard Navigation (Pfeiltasten zwischen Zellen)
- Curriculum-Goals erweitern: EWR-spezifische Ziele, EF-Ziele
- Goal-Statistik: Abdeckung der LP17-Ziele pro Kurs/Semester

---
*Stand: 2026-02-28 · v1.4*
