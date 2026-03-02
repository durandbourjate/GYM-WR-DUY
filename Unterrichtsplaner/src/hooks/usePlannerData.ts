import { useMemo } from 'react';
import { COURSES, getLinkedCourseIds as staticGetLinkedCourseIds } from '../data/courses';
import { WEEKS, S2_START_INDEX, CURRENT_WEEK } from '../data/weeks';
import { loadSettings, configToCourses } from '../store/settingsStore';
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
 * Hook that returns courses and weeks based on settings (if configured)
 * or falls back to hardcoded data for legacy planners.
 * 
 * For NEW planners (created via instanceStore), weeks are generated dynamically
 * from the instance metadata and courses come from settings.
 * For LEGACY planners (no instance or imported with hardcoded data), falls back
 * to static WEEKS/COURSES.
 */
export function usePlannerData() {
  const activeMeta = useInstanceStore(s => s.getActive());
  const settings = useMemo(() => loadSettings(), []);
  const hasCustomCourses = settings !== null && settings.courses.length > 0;

  // === Courses ===
  const courses: Course[] = useMemo(() => {
    if (hasCustomCourses && settings) {
      return configToCourses(settings.courses);
    }
    return COURSES;
  }, [settings, hasCustomCourses]);

  // === Weeks ===
  // For planners with instance metadata, generate weeks dynamically.
  // For legacy planners (or when instance meta matches static data), use WEEKS.
  const { weeks, s2StartIndex, isLegacy } = useMemo(() => {
    if (!activeMeta) {
      // No active instance → legacy mode
      return { weeks: WEEKS, s2StartIndex: settings?.semesterBreak ?? S2_START_INDEX, isLegacy: true };
    }

    // Check if this is a legacy planner that still uses hardcoded WEEKS
    // (i.e. the week range matches the default SJ 25/26 range AND we have hardcoded data)
    const isDefaultRange = activeMeta.startWeek === 33 && activeMeta.startYear === 2025
      && activeMeta.endWeek === 27 && activeMeta.endYear === 2026;
    
    if (isDefaultRange && WEEKS.length > 0 && !hasCustomCourses) {
      // Legacy planner with default range — use static WEEKS
      return { weeks: WEEKS, s2StartIndex: settings?.semesterBreak ?? S2_START_INDEX, isLegacy: true };
    }

    // Dynamic weeks from instance metadata
    const weekIds = generateWeekIds(
      activeMeta.startWeek, activeMeta.startYear,
      activeMeta.endWeek, activeMeta.endYear
    );

    // Generate empty Week objects
    const dynamicWeeks: Week[] = weekIds.map(w => ({ w, lessons: {} }));

    // Calculate S2 start index from semesterBreakWeek
    const breakWeek = String(activeMeta.semesterBreakWeek ?? 7).padStart(2, '0');
    const breakIdx = weekIds.indexOf(breakWeek);
    const s2Idx = breakIdx >= 0 ? breakIdx : Math.floor(weekIds.length / 2);

    return { weeks: dynamicWeeks, s2StartIndex: s2Idx, isLegacy: false };
  }, [activeMeta, settings, hasCustomCourses]);

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
