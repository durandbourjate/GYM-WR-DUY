# Unterrichtsplaner – Handoff

## Projektstatus: v1.2

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

### Datenmodell
- `Course`: id, col, cls, typ, day, from/to, les, hk, semesters
- `Week`: w (KW), lessons: Record<col, LessonEntry>
- `LessonEntry`: title, type (0–6)
- `LessonDetail`: subjectArea, topicMain/Sub, curriculumGoal, taxonomyLevel, blockType, learningviewUrl, materialLinks[], notes
- `Sequence`: weeks[], label

### Persistenz
- localStorage via Zustand persist (weekData + lessonDetails)
- 🆕 JSON Export/Import für manuelle Backups

### Bekannte Limitierungen
1. Kein Responsive Design — Desktop-optimiert
2. Sequences fehlen noch für c37 (30s IN Fr 1L, zu wenige Einträge)
3. EWR (c15) und IN-HK (c13) nur S1

### Mögliche nächste Features (Phase 2+)
- Export als Markdown / Excel
- Statistik-Dashboard (Prüfungsverteilung, Fachbereich-Balance)
- Curriculum-Goals-Library (Dropdown statt Freitext)
- Print-/PDF-Ansicht für Semesterplan
- Keyboard Navigation (Pfeiltasten zwischen Zellen)

---
*Stand: 2026-02-28 · v1.2*
