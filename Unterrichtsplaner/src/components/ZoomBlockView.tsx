import { useMemo, useCallback } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { usePlannerData } from '../hooks/usePlannerData';
import { TYPE_BADGES, DAY_COLORS, SUBJECT_AREA_COLORS, isPastWeek } from '../utils/colors';
import type { Course, ManagedSequence } from '../types';

const DAY_ORDER: Record<string, number> = { Mo: 0, Di: 1, Mi: 2, Do: 3, Fr: 4 };

interface Props {
  semester: 1 | 2;
}

/** Info about which sequence block occupies a cell */
interface CellBlock {
  seq: ManagedSequence;
  blockIdx: number;
  label: string;
  topicMain?: string;
  subjectArea?: string;
  weekIndexInBlock: number;  // 0-based position within block.weeks
  totalWeeksInBlock: number;
  isFirst: boolean;
  isLast: boolean;
  curriculumGoal?: string;
}

/** Detect holiday/event weeks from weekData */
function getWeekType(weekW: string, weekData: any[], col: number): 'holiday' | 'event' | 'normal' {
  const week = weekData.find((w: any) => w.w === weekW);
  if (!week) return 'normal';
  const entry = week.lessons[col];
  if (!entry) return 'normal';
  if (entry.type === 6) return 'holiday';
  if (entry.type === 5) return 'event';
  return 'normal';
}

export function ZoomBlockView({ semester }: Props) {
  const {
    filter, classFilter, sequences, weekData,
    setZoomLevel, setEditingSequenceId,
    setSidePanelOpen, setSidePanelTab, setSelection,
    searchQuery, setClassFilter, setFilter,
  } = usePlannerStore();

  const { courses: allCourses, weeks: staticWeeks, s2StartIndex, currentWeek } = usePlannerData();

  // Filter and sort courses
  const courses = useMemo(() => {
    let c = allCourses.filter(co => co.semesters.includes(semester));
    if (filter !== 'ALL') c = c.filter(co => co.typ === filter);
    if (classFilter) c = c.filter(co => co.cls === classFilter);
    return [...c].sort((a, b) => {
      const dayDiff = (DAY_ORDER[a.day] ?? 9) - (DAY_ORDER[b.day] ?? 9);
      if (dayDiff !== 0) return dayDiff;
      return a.from.localeCompare(b.from);
    });
  }, [filter, classFilter, semester, allCourses]);

  // Semester weeks from dynamic data
  const effectiveWeeks = useMemo(() =>
    weekData.length > 0 ? weekData : staticWeeks,
    [weekData, staticWeeks]);

  const semWeeks = useMemo(() => {
    const all = effectiveWeeks.map(w => w.w);
    if (semester === 1) return all.slice(0, s2StartIndex);
    return all.slice(s2StartIndex);
  }, [effectiveWeeks, semester, s2StartIndex]);

  // Build cell map: for each (weekW, courseId) → CellBlock | null
  const cellMap = useMemo(() => {
    const map = new Map<string, CellBlock>();
    for (const course of courses) {
      const courseSeqs = sequences.filter(s =>
        s.courseId === course.id || (s.courseIds?.includes(course.id))
      );
      for (const seq of courseSeqs) {
        for (let bi = 0; bi < seq.blocks.length; bi++) {
          const block = seq.blocks[bi];
          const blockWeeksInSem = block.weeks.filter(w => semWeeks.includes(w));
          for (const w of blockWeeksInSem) {
            const globalIdx = block.weeks.indexOf(w);
            const key = `${w}:${course.id}`;
            map.set(key, {
              seq,
              blockIdx: bi,
              label: block.label,
              topicMain: block.topicMain,
              subjectArea: block.subjectArea || seq.subjectArea,
              weekIndexInBlock: globalIdx,
              totalWeeksInBlock: block.weeks.length,
              isFirst: globalIdx === 0,
              isLast: globalIdx === block.weeks.length - 1,
              curriculumGoal: block.curriculumGoal,
            });
          }
        }
      }
    }
    return map;
  }, [courses, sequences, semWeeks]);

  const searchLower = searchQuery.toLowerCase();

  // Click handlers
  const handleBlockClick = useCallback((cell: CellBlock) => {
    setEditingSequenceId(cell.seq.id);
    setSidePanelOpen(true);
    setSidePanelTab('sequences');
  }, [setEditingSequenceId, setSidePanelOpen, setSidePanelTab]);

  const handleBlockDblClick = useCallback((weekW: string, course: Course, cell: CellBlock) => {
    setZoomLevel(3);
    setSelection({ week: weekW, courseId: course.id, title: cell.label, course });
    setTimeout(() => {
      const row = document.querySelector(`tr[data-week="${weekW}"]`);
      row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [setZoomLevel, setSelection]);

  return (
    <div className="px-1 py-1">
      <table className="border-collapse w-max min-w-full">
        <thead className="sticky z-40" style={{ top: 0 }}>
          {/* Day row */}
          <tr>
            <th className="w-10 bg-gray-900 sticky left-0 z-50 py-0.5 border-b border-gray-800">
              <span className={`text-[8px] font-bold ${semester === 1 ? 'text-blue-400' : 'text-amber-400'}`}>
                {semester === 1 ? 'S1' : 'S2'}
              </span>
            </th>
            {courses.map((c, i) => {
              const newDay = i === 0 || c.day !== courses[i - 1]?.day;
              return (
                <th key={`${c.id}-day`} className="bg-gray-900 px-0 pt-0.5 border-b border-gray-800 text-center"
                  style={{ borderLeft: newDay ? `2px solid ${DAY_COLORS[c.day]}40` : 'none', fontSize: 9, fontWeight: 700, color: DAY_COLORS[c.day] }}>
                  {newDay ? c.day : ''}
                </th>
              );
            })}
          </tr>
          {/* Course info row */}
          <tr>
            <th className="w-10 bg-gray-900 sticky left-0 z-50 px-0.5 pb-0.5 border-b-2 border-gray-700">
              <span className="text-[7px] text-gray-500 font-semibold">KW</span>
            </th>
            {courses.map((c, i) => {
              const newDay = i === 0 || c.day !== courses[i - 1]?.day;
              const badge = TYPE_BADGES[c.typ];
              return (
                <th key={`${c.id}-info`} className="bg-gray-900 px-0.5 pb-0.5 border-b-2 border-gray-700 text-center"
                  style={{ borderLeft: newDay ? `2px solid ${DAY_COLORS[c.day]}40` : 'none', width: 80, minWidth: 80, maxWidth: 80 }}>
                  <div className={`text-[9px] font-bold cursor-pointer transition-colors ${classFilter === c.cls ? 'text-blue-400' : 'text-gray-200 hover:text-blue-300'}`}
                    onClick={() => setClassFilter(classFilter === c.cls ? null : c.cls)}>
                    {c.cls}
                  </div>
                  <div className="flex gap-0.5 justify-center mt-0.5">
                    <span className="text-[7px] px-1 rounded font-bold cursor-pointer hover:opacity-80"
                      style={{ background: badge?.bg, color: badge?.fg }}
                      onClick={() => setFilter(c.typ as any)}>
                      {c.typ}
                    </span>
                    <span className="text-[7px] px-0.5 rounded bg-slate-800 text-slate-400">{c.les}L</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {semWeeks.map(weekW => {
            const past = isPastWeek(weekW, currentWeek);
            const isCurrent = weekW === currentWeek;

            // Check if entire week is holiday
            const isHolidayWeek = effectiveWeeks.find(w => w.w === weekW &&
              Object.values(w.lessons).length > 0 &&
              Object.values(w.lessons).every(e => (e as any).type === 6));
            const holidayLabel = isHolidayWeek ? Object.values(isHolidayWeek.lessons)[0]?.title : null;

            // Check if entire week is event (IW etc.)
            const isEventWeek = !isHolidayWeek && effectiveWeeks.find(w => w.w === weekW &&
              Object.values(w.lessons).length > 0 &&
              Object.values(w.lessons).every(e => (e as any).type === 5));
            const eventLabel = isEventWeek ? Object.values(isEventWeek.lessons)[0]?.title : null;

            return (
              <tr key={weekW}
                style={{ opacity: past && !isCurrent ? 0.5 : 1, height: isHolidayWeek ? 16 : 24 }}>
                {/* KW label */}
                <td className={`bg-gray-900 sticky left-0 z-10 text-center border-b py-0 px-0.5 ${
                  isCurrent ? 'border-amber-500 bg-amber-950/30' : 'border-slate-800/50'
                }`}>
                  <span className={`text-[8px] font-mono font-bold ${isCurrent ? 'text-amber-400' : 'text-gray-500'}`}>
                    {weekW}
                  </span>
                </td>

                {/* Holiday row — collapsed */}
                {isHolidayWeek ? (
                  <td colSpan={courses.length}
                    className="border-b border-slate-800/30 text-center py-0"
                    style={{ background: '#ffffff06' }}>
                    <span className="text-[7px] text-gray-600 italic">{holidayLabel || 'Ferien'}</span>
                  </td>
                ) : isEventWeek ? (
                  <td colSpan={courses.length}
                    className="border-b border-slate-800/30 text-center py-0"
                    style={{ background: '#4b556312' }}>
                    <span className="text-[8px] text-gray-400 font-semibold">{eventLabel || 'Sonderwoche'}</span>
                  </td>
                ) : (
                  /* Normal week — per course cells */
                  courses.map((c, ci) => {
                    const newDay = ci === 0 || c.day !== courses[ci - 1]?.day;
                    const key = `${weekW}:${c.id}`;
                    const cell = cellMap.get(key);

                    // Check individual cell holiday/event
                    const wType = getWeekType(weekW, effectiveWeeks, c.col);

                    if (wType === 'holiday') {
                      return (
                        <td key={c.id} className="border-b border-slate-800/20 p-0"
                          style={{ borderLeft: newDay ? `2px solid ${DAY_COLORS[c.day]}12` : 'none', width: 80, minWidth: 80, maxWidth: 80 }}>
                          <div className="h-full flex items-center justify-center">
                            <span className="text-[6px] text-gray-600 italic">—</span>
                          </div>
                        </td>
                      );
                    }

                    if (wType === 'event' && !cell) {
                      const weekEntry = effectiveWeeks.find(w => w.w === weekW);
                      const evTitle = weekEntry?.lessons[c.col]?.title || '';
                      return (
                        <td key={c.id} className="border-b border-slate-800/20 p-0"
                          style={{ borderLeft: newDay ? `2px solid ${DAY_COLORS[c.day]}12` : 'none', width: 80, minWidth: 80, maxWidth: 80 }}>
                          <div className="h-full flex items-center px-1" style={{ background: '#4b556312' }}>
                            <span className="text-[7px] text-gray-500 truncate">{evTitle}</span>
                          </div>
                        </td>
                      );
                    }

                    // Empty cell — no sequence assigned
                    if (!cell) {
                      return (
                        <td key={c.id} className="border-b border-slate-800/20 p-0 cursor-pointer hover:bg-slate-800/30"
                          style={{ borderLeft: newDay ? `2px solid ${DAY_COLORS[c.day]}12` : 'none', width: 80, minWidth: 80, maxWidth: 80 }}
                          onClick={() => {
                            setZoomLevel(3);
                            setSelection({ week: weekW, courseId: c.id, title: '', course: c });
                            setTimeout(() => {
                              document.querySelector(`tr[data-week="${weekW}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 100);
                          }}>
                        </td>
                      );
                    }

                    // Sequence cell — render as colored bar segment
                    const colors = cell.subjectArea && SUBJECT_AREA_COLORS[cell.subjectArea as keyof typeof SUBJECT_AREA_COLORS]
                      ? SUBJECT_AREA_COLORS[cell.subjectArea as keyof typeof SUBJECT_AREA_COLORS]
                      : { bg: '#475569', fg: '#94a3b8', border: '#64748b' };

                    // Search match
                    const blockSearchMatch = searchLower.length >= 2 && (
                      cell.label.toLowerCase().includes(searchLower) ||
                      (cell.topicMain || '').toLowerCase().includes(searchLower) ||
                      (cell.curriculumGoal || '').toLowerCase().includes(searchLower) ||
                      cell.seq.title.toLowerCase().includes(searchLower)
                    );
                    const blockSearchDimmed = searchLower.length >= 2 && !blockSearchMatch;

                    // Visual: rounded corners only at block start/end
                    const borderRadius = `${cell.isFirst ? '4px' : '0'} ${cell.isFirst ? '4px' : '0'} ${cell.isLast ? '4px' : '0'} ${cell.isLast ? '4px' : '0'}`;

                    return (
                      <td key={c.id} className="border-b border-transparent p-0"
                        style={{
                          borderLeft: newDay ? `2px solid ${DAY_COLORS[c.day]}12` : 'none',
                          width: 80, minWidth: 80, maxWidth: 80,
                          opacity: blockSearchDimmed ? 0.15 : 1,
                        }}>
                        <div
                          className={`h-full px-1 flex items-center cursor-pointer transition-all hover:brightness-125 ${blockSearchMatch ? 'ring-1 ring-amber-400' : ''}`}
                          style={{
                            background: colors.bg + '50',
                            borderLeft: `3px solid ${colors.bg}`,
                            borderRadius,
                            borderTop: cell.isFirst ? `1px solid ${colors.bg}40` : 'none',
                            borderBottom: cell.isLast ? `1px solid ${colors.bg}40` : 'none',
                            minHeight: 22,
                          }}
                          title={`${cell.seq.title} → ${cell.label}${cell.topicMain ? ' (' + cell.topicMain + ')' : ''}\nKW ${cell.seq.blocks[cell.blockIdx].weeks[0]}–${cell.seq.blocks[cell.blockIdx].weeks.at(-1)} (${cell.totalWeeksInBlock}W)\nKlick: Sequenz öffnen · Doppelklick: Zur Wochenansicht`}
                          onClick={() => handleBlockClick(cell)}
                          onDoubleClick={() => handleBlockDblClick(weekW, c, cell)}
                        >
                          {/* Show label only on first week of block */}
                          {cell.isFirst ? (
                            <span className="text-[8px] font-semibold truncate leading-tight" style={{ color: colors.fg }}>
                              {cell.topicMain || cell.label}
                            </span>
                          ) : (
                            /* Middle/last rows: show subtle continuation indicator */
                            <span className="text-[6px] text-gray-600">
                              {cell.isLast ? `⌊ ${cell.totalWeeksInBlock}W` : ''}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
