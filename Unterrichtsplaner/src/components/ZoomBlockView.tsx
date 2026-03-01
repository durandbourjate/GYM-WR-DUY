import { useMemo } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { COURSES } from '../data/courses';
import { WEEKS, S2_START_INDEX } from '../data/weeks';
import { TYPE_BADGES, DAY_COLORS, SUBJECT_AREA_COLORS } from '../utils/colors';
import type { Course, ManagedSequence } from '../types';

const DAY_ORDER: Record<string, number> = { Mo: 0, Di: 1, Mi: 2, Do: 3, Fr: 4 };

interface Props {
  semester: 1 | 2;
}

export function ZoomBlockView({ semester }: Props) {
  const {
    filter, classFilter, sequences,
    setZoomLevel, setEditingSequenceId,
    setSidePanelOpen, setSidePanelTab, setSelection,
    searchQuery,
  } = usePlannerStore();

  // Filter and sort courses (same logic as App.tsx)
  const courses = useMemo(() => {
    let c = COURSES.filter(co => co.semesters.includes(semester));
    if (filter !== 'ALL') c = c.filter(co => co.typ === filter);
    if (classFilter) c = c.filter(co => co.cls === classFilter);
    return [...c].sort((a, b) => {
      const dayDiff = (DAY_ORDER[a.day] ?? 9) - (DAY_ORDER[b.day] ?? 9);
      if (dayDiff !== 0) return dayDiff;
      return a.from.localeCompare(b.from);
    });
  }, [filter, classFilter, semester]);

  // Semester weeks
  const semWeeks = useMemo(() => {
    const allWeeks = WEEKS.map(w => w.w);
    if (semester === 1) return allWeeks.slice(0, S2_START_INDEX);
    return allWeeks.slice(S2_START_INDEX);
  }, [semester]);

  // For each course, collect sequence blocks in week order
  type BlockInfo = {
    seq: ManagedSequence;
    blockIdx: number;
    label: string;
    topicMain?: string;
    subjectArea?: string;
    weeks: string[];
    curriculumGoal?: string;
  };

  const courseBlockMap = useMemo(() => {
    const map = new Map<string, BlockInfo[]>();
    for (const course of courses) {
      const courseSeqs = sequences.filter(s =>
        s.courseId === course.id || (s.courseIds?.includes(course.id))
      );
      const blocks: BlockInfo[] = [];
      for (const seq of courseSeqs) {
        for (let bi = 0; bi < seq.blocks.length; bi++) {
          const block = seq.blocks[bi];
          const relevantWeeks = block.weeks.filter(w => semWeeks.includes(w));
          if (relevantWeeks.length === 0) continue;
          blocks.push({
            seq,
            blockIdx: bi,
            label: block.label,
            topicMain: block.topicMain,
            subjectArea: block.subjectArea || seq.subjectArea,
            weeks: relevantWeeks,
            curriculumGoal: block.curriculumGoal,
          });
        }
      }
      // Sort by first week
      blocks.sort((a, b) => semWeeks.indexOf(a.weeks[0]) - semWeeks.indexOf(b.weeks[0]));
      map.set(course.id, blocks);
    }
    return map;
  }, [courses, sequences, semWeeks]);

  // Max blocks across all courses (for row count)
  const maxBlocks = Math.max(...Array.from(courseBlockMap.values()).map(b => b.length), 1);

  const handleBlockClick = (block: BlockInfo) => {
    setEditingSequenceId(block.seq.id);
    setSidePanelOpen(true);
    setSidePanelTab('sequences');
  };

  const handleBlockNavClick = (block: BlockInfo, course: Course) => {
    setZoomLevel(3);
    const firstWeek = block.weeks[0];
    if (firstWeek) {
      setSelection({ week: firstWeek, courseId: course.id, title: block.label, course });
      setTimeout(() => {
        const row = document.querySelector(`[data-week="${firstWeek}"]`);
        row?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const searchLower = searchQuery.toLowerCase();

  return (
    <div className="px-2 py-2">
      <table className="border-collapse w-max min-w-full">
        <thead className="sticky z-40" style={{ top: 0 }}>
          {/* Day row */}
          <tr>
            <th className="w-8 bg-gray-900 sticky left-0 z-50 py-0.5 border-b border-gray-800">
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
            <th className="w-8 bg-gray-900 sticky left-0 z-50 px-0.5 pb-0.5 border-b-2 border-gray-700">
              <span className="text-[6px] text-gray-500">#</span>
            </th>
            {courses.map((c, i) => {
              const newDay = i === 0 || c.day !== courses[i - 1]?.day;
              const badge = TYPE_BADGES[c.typ];
              return (
                <th key={`${c.id}-info`} className="bg-gray-900 px-0.5 pb-0.5 border-b-2 border-gray-700 text-center"
                  style={{ borderLeft: newDay ? `2px solid ${DAY_COLORS[c.day]}40` : 'none', width: 110, minWidth: 110, maxWidth: 110 }}>
                  <div className="text-[9px] font-bold text-gray-200">{c.cls}</div>
                  <div className="flex gap-0.5 justify-center mt-0.5">
                    <span className="text-[7px] px-1 rounded" style={{ background: badge?.bg, color: badge?.fg }}>{c.typ}</span>
                    <span className="text-[7px] px-0.5 rounded bg-slate-800 text-slate-400">{c.les}L</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxBlocks }, (_, rowIdx) => (
            <tr key={rowIdx}>
              <td className="bg-gray-900 sticky left-0 z-10 text-center border-b border-slate-800 py-0.5">
                <span className="text-[7px] text-gray-600">{rowIdx + 1}</span>
              </td>
              {courses.map((c, ci) => {
                const blocks = courseBlockMap.get(c.id) || [];
                const block = blocks[rowIdx];
                const newDay = ci === 0 || c.day !== courses[ci - 1]?.day;

                if (!block) {
                  return (
                    <td key={c.id} className="border-b border-slate-900/30 p-0.5"
                      style={{ borderLeft: newDay ? `2px solid ${DAY_COLORS[c.day]}12` : 'none', width: 110, minWidth: 110, maxWidth: 110, height: 40 }}>
                    </td>
                  );
                }

                const colors = block.subjectArea && SUBJECT_AREA_COLORS[block.subjectArea as keyof typeof SUBJECT_AREA_COLORS]
                  ? SUBJECT_AREA_COLORS[block.subjectArea as keyof typeof SUBJECT_AREA_COLORS]
                  : { bg: '#475569', fg: '#94a3b8' };

                const blockSearchMatch = searchLower.length >= 2 && (
                  block.label.toLowerCase().includes(searchLower) ||
                  (block.topicMain || '').toLowerCase().includes(searchLower) ||
                  (block.curriculumGoal || '').toLowerCase().includes(searchLower) ||
                  block.seq.title.toLowerCase().includes(searchLower)
                );
                const blockSearchDimmed = searchLower.length >= 2 && !blockSearchMatch;

                return (
                  <td key={c.id} className="border-b border-slate-900/30 p-0.5"
                    style={{ borderLeft: newDay ? `2px solid ${DAY_COLORS[c.day]}12` : 'none', width: 110, minWidth: 110, maxWidth: 110, opacity: blockSearchDimmed ? 0.2 : 1 }}>
                    <div className={`rounded px-1.5 py-1 h-full transition-all ${blockSearchMatch ? 'ring-2 ring-amber-400' : ''}`}
                      style={{ background: colors.bg + '40', borderLeft: `3px solid ${colors.bg}` }}>
                      <div className="text-[9px] font-semibold truncate cursor-pointer hover:brightness-150 hover:underline"
                        style={{ color: colors.fg }}
                        title={`${block.label} — Klick: Sequenz "${block.seq.title}" öffnen`}
                        onClick={() => handleBlockClick(block)}>
                        {block.topicMain || block.label}
                      </div>
                      <div className="text-[7px] flex items-center gap-0.5 flex-wrap" style={{ color: colors.fg, opacity: 0.7 }}>
                        {block.label !== (block.topicMain || block.label) && <span>{block.label} · </span>}
                        <span>{block.weeks.length}W · </span>
                        <span className="cursor-pointer hover:text-blue-300 hover:underline"
                          title={`KW ${block.weeks[0]}–${block.weeks[block.weeks.length - 1]} — Klick: Zur Wochenansicht springen`}
                          onClick={() => handleBlockNavClick(block, c)}>
                          KW {block.weeks[0]}–{block.weeks[block.weeks.length - 1]}
                        </span>
                      </div>
                      {block.curriculumGoal && (
                        <div className="text-[6px] truncate mt-0.5" style={{ color: colors.fg, opacity: 0.5 }}>
                          {block.curriculumGoal}
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
