import { useMemo } from 'react';
import { COURSES, getLinkedCourseIds as staticGetLinkedCourseIds } from '../data/courses';
import { WEEKS, S2_START_INDEX } from '../data/weeks';
import { configToCourses, loadSettings } from '../store/settingsStore';
import { usePlannerStore } from '../store/plannerStore';
import { useInstanceStore, generateWeekIds } from '../store/instanceStore';
import type { Course, Week } from '../types';

/**
 * Determine the current ISO week number.
 */
function getCurrentISOWeek(): string {
  const now = new Date();
  const jan4 = new Date(now.getFullYear(), 0, 4);
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000) + 1;
  const dayOfWeek = jan4.getDay() || 7;
  const weekNum = Math.ceil((dayOfYear + dayOfWeek - 1) / 7);
  return String(Math.max(1, Math.min(53, weekNum))).padStart(2, '0');
}

/**
 * Hook that returns courses and weeks.
 * 
 * Settings source priority:
 * 1. plannerSettings in store (per-instance, new system)
 * 2. global localStorage settings (legacy, migration path)
 * 3. hardcoded COURSES/WEEKS (legacy fallback)
 */
export function usePlannerData() {
  const activeMeta = useInstanceStore(s => s.getActive());
  const storeSettings = usePlannerStore(s => s.plannerSettings);
  
  // Fall back to global settings for legacy planners
  const globalSettings = useMemo(() => loadSettings(), []);
  const settings = storeSettings ?? globalSettings;
  const hasCustomCourses = settings !== null && settings.courses.length > 0;

  // === Courses ===
  const courses: Course[] = useMemo(() => {
    if (hasCustomCourses && settings) {
      return configToCourses(settings.courses);
    }
    return COURSES;
  }, [settings, hasCustomCourses]);

  // === Weeks ===
  const { weeks, s2StartIndex, isLegacy } = useMemo(() => {
    if (!activeMeta) {
      return { weeks: WEEKS, s2StartIndex: settings?.semesterBreak ?? S2_START_INDEX, isLegacy: true };
    }

    // Legacy planner detection: default SJ 25/26 range + no custom courses + no store settings
    const isDefaultRange = activeMeta.startWeek === 33 && activeMeta.startYear === 2025
      && activeMeta.endWeek === 27 && activeMeta.endYear === 2026;
    
    if (isDefaultRange && WEEKS.length > 0 && !hasCustomCourses && !storeSettings) {
      return { weeks: WEEKS, s2StartIndex: settings?.semesterBreak ?? S2_START_INDEX, isLegacy: true };
    }

    // Dynamic weeks from instance metadata
    const weekIds = generateWeekIds(
      activeMeta.startWeek, activeMeta.startYear,
      activeMeta.endWeek, activeMeta.endYear
    );
    const dynamicWeeks: Week[] = weekIds.map(w => ({ w, lessons: {} }));

    // S2 start index from semesterBreakWeek
    const breakWeek = String(activeMeta.semesterBreakWeek ?? 7).padStart(2, '0');
    const breakIdx = weekIds.indexOf(breakWeek);
    const s2Idx = breakIdx >= 0 ? breakIdx : Math.floor(weekIds.length / 2);

    return { weeks: dynamicWeeks, s2StartIndex: s2Idx, isLegacy: false };
  }, [activeMeta, settings, hasCustomCourses, storeSettings]);

  const currentWeek = useMemo(() => getCurrentISOWeek(), []);

  // === Linked course IDs ===
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

  return { courses, weeks, s2StartIndex, currentWeek, getLinkedCourseIds, hasCustomCourses, isLegacy };
}
