import { useMemo } from 'react';
import { COURSES, getLinkedCourseIds as staticGetLinkedCourseIds } from '../data/courses';
import { WEEKS, S2_START_INDEX, CURRENT_WEEK } from '../data/weeks';
import { loadSettings } from '../store/settingsStore';
import type { Course } from '../types';

/**
 * Hook that returns courses and weeks based on settings (if configured)
 * or falls back to hardcoded data.
 */
export function usePlannerData() {
  const settings = useMemo(() => loadSettings(), []);
  const hasCustomCourses = settings !== null && settings.courses.length > 0;

  const courses: Course[] = useMemo(() => {
    if (!hasCustomCourses || !settings) return COURSES;
    let colCounter = 100;
    return settings.courses.map(c => ({
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
  }, [settings, hasCustomCourses]);

  const weeks = WEEKS;

  const s2StartIndex = settings?.semesterBreak ?? S2_START_INDEX;
  const currentWeek = CURRENT_WEEK;

  const getLinkedCourseIds = useMemo(() => {
    if (!hasCustomCourses) return staticGetLinkedCourseIds;
    return (courseId: string): string[] => {
      const course = courses.find(c => c.id === courseId);
      if (!course) return [courseId];
      return courses
        .filter(c => c.cls === course.cls && c.typ === course.typ)
        .map(c => c.id);
    };
  }, [courses, hasCustomCourses]);

  return { courses, weeks, s2StartIndex, currentWeek, getLinkedCourseIds, hasCustomCourses };
}
