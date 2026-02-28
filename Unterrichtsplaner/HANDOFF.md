# Unterrichtsplaner – Übergabedokument für neuen Chat

**Stand:** 28.02.2026 · **Version:** v2.0 (Sequenz-CRUD + Merge)

---

## Projektstatus

Das React/Vite-Projekt ist **voll funktionsfähig** und läuft lokal. Phase 0 + Phase 2 (Sequenzen als Entität) sind implementiert und getestet. Store enthält gemergte Features aus zwei parallelen Entwicklungssträngen.

### Implementierte Features ✅

| Feature | Status | Datei(en) |
|---------|--------|-----------|
| Semester-getrennte Tabellen (S1/S2) | ✅ fertig | App.tsx, SemesterHeader.tsx |
| Sticky Headers mit GK/HK, 1L/2L, Zeiten von–bis | ✅ fertig | SemesterHeader.tsx |
| 2L-Zellen grösser als 1L | ✅ fertig | WeekRows.tsx |
| Sequenz-Balken (farbige Balken + Labels, Store-basiert) | ✅ fertig | WeekRows.tsx, colors.ts |
| Farbcodierung (BWL/Recht/IN/Prüfung/Event/Ferien) | ✅ fertig | colors.ts |
| Filter (Alle/SF/EWR/IN/KS) | ✅ fertig | Toolbar.tsx |
| Inline-Editing (Doppelklick auf Zelle) | ✅ fertig | WeekRows.tsx |
| Multi-Select (Shift/Ctrl+Klick) | ✅ fertig | WeekRows.tsx, Toolbar.tsx |
| Detail-Panel (Klick → unten) | ✅ fertig | DetailPanel.tsx |
| Detail-Panel erweitert (Fachbereich, Taxonomie, Material) | ✅ fertig | DetailPanel.tsx |
| Insert mit Push-Logik | ✅ fertig | plannerStore.ts, InsertDialog.tsx |
| 1L/2L Slot-Mismatch-Warnung (Dialog) | ✅ fertig | InsertDialog.tsx, Toolbar.tsx |
| Undo (Ctrl+Z, 10 Schritte) | ✅ fertig | plannerStore.ts |
| S1-only Kurse verschwinden im S2-Teil | ✅ fertig | courses.ts (semesters-Feld) |
| Auto-Scroll zu aktueller Woche (w09) | ✅ fertig | App.tsx |
| Vergangene Wochen gedimmt | ✅ fertig | colors.ts (isPastWeek) |
| localStorage Persistenz (Zustand persist v2) | ✅ fertig | plannerStore.ts |
| **Sequenz-CRUD (Phase 2)** | ✅ fertig | plannerStore.ts, SequencePanel.tsx |
| Sequenz-Panel Sidebar (320px, togglebar) | ✅ fertig | SequencePanel.tsx, App.tsx |
| Sequenz Block-Editor (Label, Wochen, hinzufügen, löschen) | ✅ fertig | SequencePanel.tsx |
| Fachbereich + Farbe pro Sequenz | ✅ fertig | SequencePanel.tsx |
| Kurs-Filter im Sequenz-Panel | ✅ fertig | SequencePanel.tsx |
| Migration statischer Sequenzen → Store | ✅ fertig | plannerStore.ts |
| Batch-Operationen (Shift/Insert für Multi-Select) | ✅ fertig | plannerStore.ts |
| Export/Import (JSON) | ✅ fertig | plannerStore.ts |
| Lehrplanziel-Picker | ✅ fertig | CurriculumGoalPicker.tsx, curriculumGoals.ts |
| Statistik-Panel | ✅ fertig | StatsPanel.tsx |
| Drag & Drop (Swap/Move) | ✅ fertig | WeekRows.tsx, plannerStore.ts |
| TypeScript kompiliert fehlerfrei | ✅ | |

### Noch nicht implementiert (nächste Phasen)

| Feature | Priorität | Phase |
|---------|-----------|-------|
| Supabase-Anbindung (Persistenz, Auth) | HOCH | 3 |
| PWA-Config (Offline) | MITTEL | 3 |
| Sequenz Auto-Platzierung (aus Bibliothek in Kurs einfügen) | MITTEL | 3 |
| Fachbereich Auto-Detection (LessonType → SubjectArea) | NIEDRIG | 3 |
| LearningView-Integration (Deep-Links) | MITTEL | 4 |
| Google Calendar Sync | NIEDRIG | 4 |
| TaF Phasenmodell + HK-Rotation | NIEDRIG | 5 |
| Excel-Import (SJ 22/23–24/25) | NIEDRIG | 6 |

### Hinweis: Merge-Historie

Die Codebasis wurde am 28.02.2026 aus zwei parallelen Entwicklungssträngen gemergt:
- **Arbeitskopie** (`12 Workflow/Unterrichtsplanung/unterrichtsplaner`): Phase-2 Sequenz-CRUD
- **Git-Repo** (`10 Github/GYM-WR-DUY/Unterrichtsplaner`): CurriculumGoalPicker, StatsPanel, Batch-Ops, Export/Import

Der gemergte Stand ist in der Arbeitskopie und wird ins Git-Repo synchronisiert.

---

## Projektstruktur

```
~/Documents/-Gym Hofwil/00 Automatisierung Unterricht/
  12 Workflow/Unterrichtsplanung/
    unterrichtsplaner/              ← React/Vite-Projekt (Arbeitskopie)
      src/
        App.tsx                     ← Hauptlayout (S1/S2 Tabellen + SequencePanel)
        main.tsx                    ← Entry point
        index.css                   ← Tailwind base
        types/index.ts              ← TypeScript-Typen (inkl. ManagedSequence)
        store/plannerStore.ts       ← Zustand-Store (State, Undo, Push, Sequences CRUD, Export/Import)
        data/
          courses.ts                ← 13 Kurse mit Slot-Infos
          weeks.ts                  ← 52 Wochen mit Lektionsdaten
          sequences.ts              ← Statische Sequenz-Definitionen (Legacy, für Migration)
          curriculumGoals.ts        ← Lehrplanziele nach Fachbereich
        components/
          DetailPanel.tsx           ← Erweitertes Detail-Panel
          SemesterHeader.tsx        ← Kurs-Header pro Semester
          WeekRows.tsx              ← Zeilen-Rendering + Inline-Edit + Drag&Drop
          Toolbar.tsx               ← AppHeader, HelpBar, Legend, MultiSelect
          InsertDialog.tsx          ← Einfügen-Dialog mit Mismatch-Warnung
          SequencePanel.tsx         ← Sequenz-CRUD Sidebar (Phase 2)
          CurriculumGoalPicker.tsx  ← Lehrplanziel-Auswahl
          StatsPanel.tsx            ← Statistik-Übersicht
        utils/
          colors.ts                 ← Farben, Sequenz-Lookup (Store-basiert), isPastWeek
      package.json                  ← React 19, Tailwind 4, Zustand 5, Vite 7
  10 Github/GYM-WR-DUY/
    Unterrichtsplaner/              ← Git-Repo (wird mit Arbeitskopie synchronisiert)
```

---

## Tech Stack

| Komponente | Version | Zweck |
|---|---|---|
| React | 19.2 | UI Framework |
| Vite | 7.3 | Build/Dev-Server |
| TypeScript | 5.9 | Typsicherheit |
| Tailwind CSS | 4.2 | Styling (via @tailwindcss/vite) |
| Zustand | 5.0 | State Management (mit persist v2) |
| ESLint | 9.x | Linting |

**Dev-Server starten:** `cd unterrichtsplaner && npm run dev`

---

## Datenmodell

### ManagedSequence (NEU Phase 2)
```typescript
{
  id: string, courseId: string, title: string,
  subjectArea?: SubjectArea, blocks: SequenceBlock[],
  color?: string, createdAt: string, updatedAt: string
}
```

### SequenceBlock
```typescript
{ weeks: string[], label: string }
```

### Course
```typescript
{
  id: string, col: number, cls: string, typ: CourseType,
  day: DayOfWeek, from: string, to: string, les: 1|2|3,
  hk: boolean, semesters: Semester[], note?: string
}
```

### LessonType
0=other, 1=BWL(blau), 2=Recht/VWL(grün), 3=IN(hellblau), 4=Prüfung(rot), 5=Event(gelb), 6=Ferien(weiss)

---

## Kurse mit 1L/2L Slot-Mismatch (kritisch für Verschiebungslogik)

| Kurs | Slot 1 | Slot 2 | Mismatch? |
|------|--------|--------|-----------|
| 29c SF WR GYM1 | c11: Di 1L | c31: Fr 2L | ✅ JA |
| 28bc29fs SF WR GYM2 | c19: Mi 2L | c29: Fr 1L | ✅ JA |
| 27a28f SF WR GYM3 | c17: Mi 2L | c35: Fr 2L | ❌ gleich |
| 28c IN GYM2 | c4: Mo 1L | c13: Di 2L HK | ✅ JA (+ HK) |
| 30s IN GYM1 | c24: Do 2L | c37: Fr 1L | ✅ JA |

---

## Empfohlener nächster Schritt

**Phase 3: Supabase-Anbindung + PWA**

1. **Supabase Setup** – Projekt erstellen, Schema für sequences/weekData/lessonDetails
2. **Auth** – Email/Password Login, Row-Level Security
3. **Sync** – Local-first mit Supabase-Sync (optimistisch)
4. **PWA** – Service Worker, Offline-Cache, Install-Prompt
5. **Sequenz Auto-Platzierung** – Template aus Bibliothek in Kurs-Timeline einfügen

Alternativ (falls Supabase noch nicht nötig):
- **UI-Polish**: CurriculumGoalPicker und StatsPanel in die App integrieren (sie existieren als Dateien, sind aber ggf. noch nicht in App.tsx eingebunden)
- **Sequenz-Verfeinerung**: Drag & Drop für Block-Reihenfolge im Panel, Week-Picker per Klick auf Zellen

---

## Konzeptdokument

Das vollständige Konzept (v3) mit allen Entitäten, Phasen und Architektur-Entscheidungen liegt unter:
`Unterrichtsplaner_Konzept_v3.md`

---

## Session-Verlauf

| Session | Inhalt | Ort |
|---------|--------|-----|
| v1 | Konzept-Entwicklung (Architektur, Datenmodell, 8 Phasen) | Claude-Projekt |
| v2 | 21 Feedback-Punkte eingearbeitet | Claude-Projekt |
| v3 | Prototyp Phase 0 gebaut (Excel-Daten → React → Vite) | Claude-Projekt |
| v4 | Git init, Detail-Panel, localStorage Persist | Claude-Projekt |
| v5 | CurriculumGoalPicker, StatsPanel, Batch-Ops, Export/Import | Git-Repo Branch |
| v6 | Phase 2: Sequenz-CRUD, SequencePanel, ManagedSequence-Types, Store-basierte Sequenz-Balken | Arbeitskopie |
| v7 | Merge beider Stränge, HANDOFF v2.0 aktualisiert, Git-Push | claude.ai Chat 28.02.2026 |
