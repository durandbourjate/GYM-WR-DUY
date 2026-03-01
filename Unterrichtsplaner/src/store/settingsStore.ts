import type { Course, CourseType, DayOfWeek, Semester } from '../types';

// === Settings Types ===
export interface PlannerSettings {
  version: number;
  school?: {
    name: string;
    lessonDurationMin: number; // default 45
  };
  subjects: SubjectConfig[];
  courses: CourseConfig[];
  specialWeeks: SpecialWeekConfig[];
  holidays: HolidayConfig[];
  semesterBreak: number; // week index where S2 starts
}

export interface SubjectConfig {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  courseType: CourseType;
}

export interface CourseConfig {
  id: string;
  cls: string;
  typ: CourseType;
  day: DayOfWeek;
  from: string;
  to: string;
  les: number;
  hk: boolean;
  semesters: Semester[];
  note?: string;
}

export interface SpecialWeekConfig {
  id: string;
  label: string;
  week: string; // KW
  type: 'event' | 'holiday';
  excludedCourseIds?: string[]; // courses NOT affected (default: all affected)
}

export interface HolidayConfig {
  id: string;
  label: string;
  startWeek: string;
  endWeek: string;
}

// === Persistence ===
const SETTINGS_KEY = 'unterrichtsplaner-settings';

const DEFAULT_SUBJECTS: SubjectConfig[] = [
  { id: 'bwl', label: 'BWL', shortLabel: 'BWL', color: '#3b82f6', courseType: 'SF' },
  { id: 'vwl', label: 'VWL', shortLabel: 'VWL', color: '#f97316', courseType: 'SF' },
  { id: 'recht', label: 'Recht', shortLabel: 'Recht', color: '#22c55e', courseType: 'SF' },
  { id: 'in', label: 'Informatik', shortLabel: 'IN', color: '#6b7280', courseType: 'IN' },
];

export function loadSettings(): PlannerSettings | null {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch { return null; }
}

export function saveSettings(settings: PlannerSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getDefaultSettings(): PlannerSettings {
  return {
    version: 1,
    school: { name: '', lessonDurationMin: 45 },
    subjects: [...DEFAULT_SUBJECTS],
    courses: [],
    specialWeeks: [],
    holidays: [],
    semesterBreak: 26,
  };
}

// Convert CourseConfig[] to Course[] (for use with existing planner logic)
export function configToCourses(configs: CourseConfig[]): Course[] {
  let colCounter = 100; // start high to avoid conflicts with legacy col numbers
  return configs.map(c => ({
    id: c.id,
    col: colCounter++,
    cls: c.cls,
    typ: c.typ,
    day: c.day,
    from: c.from,
    to: c.to,
    les: c.les as 1 | 2 | 3,
    hk: c.hk,
    semesters: c.semesters,
    note: c.note,
  }));
}

// Generate a unique ID
export function generateId(): string {
  return 'c' + Math.random().toString(36).slice(2, 8);
}
