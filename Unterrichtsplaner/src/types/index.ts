// Core types for the Unterrichtsplaner

export type CourseType = 'SF' | 'EWR' | 'EF' | 'KS' | 'IN';
export type DayOfWeek = 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr';
export type LessonType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
// 0=other, 1=BWL, 2=Recht/VWL, 3=IN, 4=exam, 5=event, 6=holiday

export type Semester = 1 | 2;

export interface Course {
  id: string;
  col: number;           // Excel column reference
  cls: string;           // Class name (e.g. "29c", "28bc29fs")
  typ: CourseType;
  day: DayOfWeek;
  from: string;          // Start time "09:00"
  to: string;            // End time "09:45"
  les: 1 | 2 | 3;       // Number of lessons
  hk: boolean;           // Is Halbklasse?
  semesters: Semester[];  // Active in which semesters
  note?: string;         // Additional info
}

export interface LessonEntry {
  title: string;
  type: LessonType;
}

export interface Week {
  w: string;             // Week number as string (e.g. "33", "01")
  lessons: Record<number, LessonEntry>; // col -> entry
}

export interface SequenceBlock {
  weeks: string[];
  label: string;
  // Block-level details (inherited as defaults by contained tiles)
  topicMain?: string;
  topicSub?: string;
  subjectArea?: SubjectArea;
  curriculumGoal?: string;
  taxonomyLevel?: TaxonomyLevel;
  description?: string;
  materialLinks?: string[];
}

/** Legacy static format (for migration) */
export interface Sequence {
  weeks: string[];
  label: string;
}

/** Managed sequence with CRUD capabilities */
export interface ManagedSequence {
  id: string;
  courseId: string;         // Primary course (backward compat)
  courseIds?: string[];      // All linked courses (multi-day: e.g. ["c11","c31"] for 29c SF Di+Fr)
  title: string;
  subjectArea?: SubjectArea;
  blocks: SequenceBlock[];
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SequenceInfo {
  sequenceId: string;
  label: string;
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  color?: string;
}

export type FilterType = 'ALL' | CourseType;

// Extended lesson detail fields (Phase 1)
export type SubjectArea = 'VWL' | 'BWL' | 'RECHT' | 'IN' | 'INTERDISZ';
export type TaxonomyLevel = 'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K6';
export type BlockType =
  | 'LESSON'
  | 'EXAM'
  | 'EXAM_ORAL'
  | 'EXAM_LONG'
  | 'PRESENTATION'
  | 'PROJECT_DUE'
  | 'SELF_STUDY'
  | 'INTRO'
  | 'DISCUSSION'
  | 'EVENT'
  | 'HOLIDAY';

export interface LessonDetail {
  subjectArea?: SubjectArea;
  topicMain?: string;
  topicSub?: string;
  curriculumGoal?: string;
  taxonomyLevel?: TaxonomyLevel;
  blockType?: BlockType;
  description?: string;
  learningviewUrl?: string;
  materialLinks?: string[];
  notes?: string;
}

// HK Rotation
export type HKGroup = 'A' | 'B';

// TaF Phasenmodell
export interface TaFPhase {
  id: string;
  name: string;           // z.B. "Phase 1", "Trainingsphase"
  startWeek: string;      // KW
  endWeek: string;        // KW
  color: string;          // Phasenfarbe
  absentClasses: string[];  // Klassen die in dieser Phase abwesend sind
  presentClasses: string[]; // Klassen die anwesend sind
  notes?: string;
}
