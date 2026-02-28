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

export interface Sequence {
  weeks: string[];
  label: string;
}

export interface SequenceInfo {
  label: string;
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
}

export type FilterType = 'ALL' | CourseType;
