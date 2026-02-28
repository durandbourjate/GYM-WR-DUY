import type { HKGroup } from '../types';
import { WEEKS } from '../data/weeks';

const WEEK_ORDER = WEEKS.map(w => w.w);

/**
 * Calculate which HK group is active for a given week/col.
 * Default: alternating A/B starting from first week.
 * Overrides allow manual correction (e.g. after cancellations).
 */
export function getHKGroup(
  weekW: string,
  col: number,
  startGroup: HKGroup = 'A',
  overrides: Record<string, HKGroup> = {}
): HKGroup {
  const key = `${weekW}-${col}`;
  if (overrides[key]) return overrides[key];

  // Count teaching weeks (non-holiday, non-event) up to this week
  const weekIdx = WEEK_ORDER.indexOf(weekW);
  if (weekIdx < 0) return startGroup;

  // Simple alternation based on position in WEEK_ORDER
  // We count only weeks where the course actually has a lesson
  let teachingWeekCount = 0;
  for (let i = 0; i <= weekIdx; i++) {
    const w = WEEKS[i];
    const lesson = w.lessons[col];
    // Count as teaching week if there's a lesson that isn't holiday/event
    if (lesson && lesson.type !== 5 && lesson.type !== 6) {
      teachingWeekCount++;
    }
  }

  // Alternate based on count
  const isEven = teachingWeekCount % 2 === 0;
  if (startGroup === 'A') {
    return isEven ? 'B' : 'A'; // 1st=A, 2nd=B, 3rd=A...
  } else {
    return isEven ? 'A' : 'B';
  }
}

/**
 * Get all weeks with their HK assignments for a given course col.
 */
export function getHKSchedule(
  col: number,
  startGroup: HKGroup = 'A',
  overrides: Record<string, HKGroup> = {}
): { week: string; group: HKGroup; isOverride: boolean }[] {
  return WEEK_ORDER.map(w => ({
    week: w,
    group: getHKGroup(w, col, startGroup, overrides),
    isOverride: !!overrides[`${w}-${col}`],
  }));
}
