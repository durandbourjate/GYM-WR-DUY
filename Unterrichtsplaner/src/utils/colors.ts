import type { LessonType, SequenceInfo, CourseType } from '../types';
import { SEQUENCES } from '../data/sequences';

export const LESSON_COLORS: Record<LessonType, { bg: string; fg: string; border: string }> = {
  0: { bg: '#eef2f7', fg: '#475569', border: '#cbd5e1' },
  1: { bg: '#dbeafe', fg: '#1e40af', border: '#93c5fd' }, // BWL
  2: { bg: '#dcfce7', fg: '#166534', border: '#86efac' }, // Recht/VWL
  3: { bg: '#e0f2fe', fg: '#0369a1', border: '#7dd3fc' }, // IN
  4: { bg: '#fee2e2', fg: '#991b1b', border: '#fca5a5' }, // Exam
  5: { bg: '#fef9c3', fg: '#854d0e', border: '#fde68a' }, // Event
  6: { bg: '#ffffff', fg: '#a1a1aa', border: '#e4e4e7' }, // Holiday
};

export const DAY_COLORS: Record<string, string> = {
  Mo: '#818cf8', Di: '#a78bfa', Mi: '#c084fc', Do: '#e879f9', Fr: '#f472b6',
};

export const TYPE_BADGES: Record<CourseType, { bg: string; fg: string }> = {
  SF: { bg: '#16a34a', fg: '#fff' },
  EWR: { bg: '#d97706', fg: '#fff' },
  IN: { bg: '#0ea5e9', fg: '#fff' },
  KS: { bg: '#7c3aed', fg: '#fff' },
  EF: { bg: '#ec4899', fg: '#fff' },
};

export function getSequenceInfo(courseId: string, weekW: string): SequenceInfo | null {
  const seqs = SEQUENCES[courseId];
  if (!seqs) return null;
  for (const seq of seqs) {
    const idx = seq.weeks.indexOf(weekW);
    if (idx >= 0) {
      return {
        label: seq.label,
        index: idx,
        total: seq.weeks.length,
        isFirst: idx === 0,
        isLast: idx === seq.weeks.length - 1,
      };
    }
  }
  return null;
}

export function isPastWeek(w: string, current: string): boolean {
  const n = parseInt(w);
  const c = parseInt(current);
  // School year runs w33-w32: weeks 33+ are in year 1, weeks 01-32 in year 2
  if (n >= 33) return c >= 33 ? n < c : true;  // both in Y1, or current is in Y2
  if (c >= 33) return false;                     // week in Y2, current in Y1
  return n < c;                                   // both in Y2
}
