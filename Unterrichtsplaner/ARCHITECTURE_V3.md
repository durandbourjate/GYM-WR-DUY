# Unterrichtsplaner v3 — Architekturplan

## Ziel
Flexibler, leerer Planer ohne hardcoded Daten. Alles ist Nutzerdaten.
Mehrere unabhängige Planer-Instanzen pro Person möglich.

## Phase 1: Multi-Planer + leerer Zustand

### Datenmodell

```typescript
// Ein einzelner Planer
interface PlannerInstance {
  id: string;
  name: string;                    // z.B. "SF WR 25/26"
  createdAt: string;
  updatedAt: string;

  // Zeitraum
  startWeek: string;               // z.B. "33" (KW33 = Schuljahresstart)
  startYear: number;               // z.B. 2025
  endWeek: string;                 // z.B. "27"  
  endYear: number;                 // z.B. 2026
  semesterBreakWeek?: string;      // z.B. "07" (wo S2 beginnt, optional)

  // Kurse (= Spalten im Raster)
  courses: PlannerCourse[];

  // Zellinhalte
  entries: Record<string, CellEntry>;  // key: "weekNr-courseId"
  
  // Lektionsdetails (Notes etc.)
  lessonDetails: Record<string, LessonDetail>; // key: "weekNr-courseId"

  // Sequenzen
  sequences: ManagedSequence[];

  // Kategorien/Typen (konfigurierbar)
  categories: CategoryConfig[];

  // Sammlung
  collection: CollectionItem[];
}

// Kurs-Definition (was aktuell in courses.ts hardcoded ist)
interface PlannerCourse {
  id: string;
  name: string;          // z.B. "29c SF WR"
  shortName: string;     // z.B. "29c"
  day: string;           // "Mo" | "Di" | "Mi" | "Do" | "Fr"
  timeFrom: string;      // "09:00"
  timeTo: string;        // "09:45"
  lessons: number;       // 1, 2, 3
  color?: string;
  semester?: number[];   // [1], [2], [1,2] — optional
  group?: string;        // Verknüpfungsgruppe (z.B. "29c-SF" für Di+Do)
  hasHalfClass?: boolean;
  notes?: string;
}

// Zellinhalt (was aktuell in weeks.ts als LessonEntry steht)
interface CellEntry {
  title: string;
  categoryId: string;     // Referenz auf CategoryConfig
  sequenceId?: string;    // Optionale Sequenz-Zuordnung
}

// Konfigurierbare Kategorie (ersetzt fixen LessonType 0-6)
interface CategoryConfig {
  id: string;
  label: string;
  color: string;           // Hintergrundfarbe
  textColor?: string;
  icon?: string;           // Emoji oder Lucide-Icon
  isHoliday?: boolean;     // Blockiert die Zelle
  isEvent?: boolean;       // Spezialwoche
}
```

### Default-Kategorien (bei neuem Planer)
```
lesson    — Unterricht (Standard)    — #1e293b (dunkel)
exam      — Prüfung                  — #dc2626 (rot)
event     — Anlass/Sonderwoche       — #8b5cf6 (violett)  
holiday   — Ferien/Feiertag          — #6b7280 (grau)
cancelled — Ausfall                  — #374151 (dunkelgrau)
```
Lehrperson kann weitere hinzufügen (z.B. BWL, VWL, Recht, IN)
oder die bestehenden umbenennen/anpassen.

### Wochenraster-Generierung
Kein hardcoded weeks.ts mehr. Das Raster wird dynamisch generiert:
- Input: startWeek, startYear, endWeek, endYear
- Output: Array von Wochen-IDs ["33", "34", ..., "52", "01", "02", ..., "27"]
- Ferien/Feiertage werden als CellEntries mit category "holiday" gespeichert
- Semestergrenze ist eine optionale visuelle Trennung

### Storage
```
localStorage key: "unterrichtsplaner-instances"
Wert: { 
  activeId: string,
  instances: PlannerInstance[]
}
```

### UI-Änderungen Phase 1
1. **Tab-Leiste** oben: Planer-Tabs + "+" Button für neuen Planer
2. **Neuer Planer Dialog**: Name, Zeitraum, aus Vorlage/Import?
3. **Export/Import**: JSON Export pro Planer, JSON Import
4. **Leerer Zustand**: Wenn Planer keine Kurse hat → Willkommens-Screen
   "Füge Kurse hinzu, um zu beginnen"
5. **Kurs-Management**: Kurse anlegen/bearbeiten/löschen in Settings
6. **Ferien-Tool**: Wochen als Ferien markieren (ganzer Block oder einzelne Zellen)

### Migration
- Bestehende hardcoded Daten (weeks.ts, courses.ts etc.) bleiben als Fallback
- planner_backup_SJ2526.json kann über Import geladen werden
- Beim ersten Start: leerer Planer, kein automatisches Laden alter Daten

### Dateien die sich ändern
- ENTFERNT: data/weeks.ts, data/courses.ts, data/sequences.ts, data/initialLessonDetails.ts
- NEU: store/instanceStore.ts (Multi-Planer Management)
- ÜBERARBEITET: store/plannerStore.ts (arbeitet auf aktiver Instanz)
- ÜBERARBEITET: types/index.ts (neue Typen)
- ÜBERARBEITET: App.tsx (Tab-Leiste, leerer Zustand)
- ÜBERARBEITET: hooks/usePlannerData.ts (dynamisch statt hardcoded)
- ÜBERARBEITET: components/SettingsPanel.tsx (Kurs-Management, Kategorien)
- ÜBERARBEITET: Alle Komponenten die WEEKS/COURSES importieren

### Risiken / Entscheidungen
1. **col-Nummern**: Aktuell referenziert alles über `col` (Excel-Spaltennummern).
   Neu: Referenz über `courseId` (string). Alle Records-Keys ändern sich.
   → Entscheidung: Neue Planer nutzen courseId, Import mappt col→courseId.

2. **Datenmenge**: Alles in localStorage. Bei vielen Planern könnte das 
   eng werden (5MB Limit). 
   → Für Phase 1 reicht localStorage. Später: IndexedDB.

3. **Backward Compatibility**: Bestehende URLs mit #-Parametern etc.
   → Nicht relevant, da wir komplett neu starten.
