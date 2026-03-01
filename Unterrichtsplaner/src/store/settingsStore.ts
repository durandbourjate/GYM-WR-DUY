import type { Course, CourseType, DayOfWeek, Semester } from '../types';
import { COURSES } from '../data/courses';
import { WEEKS, S2_START_INDEX } from '../data/weeks';

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

// Import current hardcoded courses into settings
export function importCurrentCourses(): CourseConfig[] {
  return COURSES.map(c => ({
    id: c.id,
    cls: c.cls,
    typ: c.typ,
    day: c.day,
    from: c.from,
    to: c.to,
    les: c.les,
    hk: c.hk,
    semesters: [...c.semesters],
    note: c.note,
  }));
}

// Detect holidays from current WEEKS data (weeks where all entries are type 6)
export function importCurrentHolidays(): HolidayConfig[] {
  const holidays: HolidayConfig[] = [];
  let currentHoliday: { label: string; startWeek: string; endWeek: string } | null = null;

  for (const week of WEEKS) {
    const entries = Object.values(week.lessons);
    const allHoliday = entries.length > 0 && entries.every(e => e.type === 6);
    if (allHoliday) {
      const label = entries[0]?.title || 'Ferien';
      if (currentHoliday && currentHoliday.label === label) {
        currentHoliday.endWeek = week.w;
      } else {
        if (currentHoliday) holidays.push({ id: generateId(), ...currentHoliday });
        currentHoliday = { label, startWeek: week.w, endWeek: week.w };
      }
    } else {
      if (currentHoliday) holidays.push({ id: generateId(), ...currentHoliday });
      currentHoliday = null;
    }
  }
  if (currentHoliday) holidays.push({ id: generateId(), ...currentHoliday });
  return holidays;
}

// Detect special weeks from current WEEKS data (weeks where all entries are type 5 or type 6 partial)
export function importCurrentSpecialWeeks(): SpecialWeekConfig[] {
  const specials: SpecialWeekConfig[] = [];
  for (const week of WEEKS) {
    const entries = Object.values(week.lessons);
    if (entries.length === 0) continue;
    const allEvent = entries.every(e => e.type === 5);
    if (allEvent) {
      const label = entries[0]?.title || 'Sonderwoche';
      specials.push({ id: generateId(), label, week: week.w, type: 'event' });
      continue;
    }
    // Check for partial holidays (some entries are type 6, not all → single-day holiday in a week)
    const holidays = entries.filter(e => e.type === 6);
    const nonHolidays = entries.filter(e => e.type !== 6);
    if (holidays.length > 0 && nonHolidays.length > 0) {
      // This week has a partial holiday (e.g. Auffahrt on Thursday but other days have lessons)
      const label = holidays[0]?.title || 'Feiertag';
      specials.push({ id: generateId(), label, week: week.w, type: 'holiday' });
    }
  }
  return specials;
}

// Get effective courses: settings if available, else hardcoded
export function getEffectiveCourses(): Course[] {
  const settings = loadSettings();
  if (settings && settings.courses.length > 0) {
    return configToCourses(settings.courses);
  }
  return COURSES;
}

// Get effective S2 start index
export function getEffectiveS2StartIndex(): number {
  const settings = loadSettings();
  if (settings) return settings.semesterBreak;
  return S2_START_INDEX;
}
