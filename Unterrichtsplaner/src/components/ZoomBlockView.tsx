import { usePlannerStore } from '../store/plannerStore';
import { COURSES } from '../data/courses';
import { WEEKS } from '../data/weeks';
import { TYPE_BADGES } from '../utils/colors';

const SUBJECT_COLORS: Record<string, { bg: string; fg: string; border: string }> = {
  BWL: { bg: '#1e3a5f', fg: '#93c5fd', border: '#3b82f6' },
  VWL: { bg: '#3b1f0b', fg: '#fdba74', border: '#f97316' },
  RECHT: { bg: '#052e16', fg: '#86efac', border: '#22c55e' },
  IN: { bg: '#083344', fg: '#67e8f9', border: '#06b6d4' },
  INTERDISZ: { bg: '#2e1065', fg: '#c4b5fd', border: '#a855f7' },
};

interface Props {
  semester: 1 | 2;
}

export function ZoomBlockView({ semester }: Props) {
  const { filter, classFilter, sequences, weekData, setZoomLevel, setEditingSequenceId, setSidePanelOpen, setSidePanelTab, searchQuery } = usePlannerStore();

  // Filter courses
  let courses = COURSES.filter(c => c.semesters.includes(semester));
  if (filter !== 'ALL') courses = courses.filter(c => c.typ === filter);
  if (classFilter) courses = courses.filter(c => c.cls === classFilter);

  // Semester weeks
  const semWeeks = semester === 1
    ? WEEKS.filter(w => parseInt(w.w) >= 33 || parseInt(w.w) === 0).map(w => w.w)
    : WEEKS.filter(w => parseInt(w.w) >= 7 && parseInt(w.w) <= 32).map(w => w.w);
  const allWeekOrder = WEEKS.map(w => w.w);
  const orderedSemWeeks = allWeekOrder.filter(w => semWeeks.includes(w));

  const totalWeeks = orderedSemWeeks.length;
  if (totalWeeks === 0) return null;

  return (
    <div className="px-4 py-3">
      <div className="text-[10px] text-gray-500 mb-2 font-semibold">
        {semester === 1 ? 'Semester 1' : 'Semester 2'} — Block-Ansicht ({totalWeeks} Wochen)
      </div>
      {/* Week scale */}
      <div className="flex mb-1" style={{ marginLeft: 120 }}>
        {orderedSemWeeks.map(w => (
          <div key={w} className="text-[7px] text-gray-600 text-center" style={{ width: `${100/totalWeeks}%`, minWidth: 0 }}>
            {w}
          </div>
        ))}
      </div>

      {/* Course rows */}
      <div className="space-y-1">
        {courses.map(course => {
          const badge = TYPE_BADGES[course.typ];
          // Find sequences for this course
          const courseSeqs = sequences.filter(s => s.courseId === course.id);
          
          // Build block segments: sequences + unsequenced lessons
          type Segment = {
            type: 'sequence';
            seq: typeof courseSeqs[0];
            block: typeof courseSeqs[0]['blocks'][0];
            blockIdx: number;
            startIdx: number;
            endIdx: number;
          } | {
            type: 'gap';
            startIdx: number;
            endIdx: number;
            hasContent: boolean;
          };

          const segments: Segment[] = [];
          const coveredWeeks = new Set<string>();

          // Add sequence blocks
          for (const seq of courseSeqs) {
            for (let bi = 0; bi < seq.blocks.length; bi++) {
              const block = seq.blocks[bi];
              if (block.weeks.length === 0) continue;
              const weekIndices = block.weeks
                .map(w => orderedSemWeeks.indexOf(w))
                .filter(i => i >= 0)
                .sort((a, b) => a - b);
              if (weekIndices.length === 0) continue;
              segments.push({
                type: 'sequence',
                seq,
                block,
                blockIdx: bi,
                startIdx: weekIndices[0],
                endIdx: weekIndices[weekIndices.length - 1],
              });
              block.weeks.forEach(w => coveredWeeks.add(w));
            }
          }

          // Find gaps with content (unsequenced lessons)
          let gapStart = -1;
          let gapHasContent = false;
          for (let i = 0; i < totalWeeks; i++) {
            const w = orderedSemWeeks[i];
            if (coveredWeeks.has(w)) {
              if (gapStart >= 0) {
                segments.push({ type: 'gap', startIdx: gapStart, endIdx: i - 1, hasContent: gapHasContent });
                gapStart = -1;
                gapHasContent = false;
              }
            } else {
              if (gapStart < 0) gapStart = i;
              const wd = weekData.find(ww => ww.w === w);
              if (wd?.lessons[course.col]) gapHasContent = true;
            }
          }
          if (gapStart >= 0) {
            segments.push({ type: 'gap', startIdx: gapStart, endIdx: totalWeeks - 1, hasContent: gapHasContent });
          }

          // Sort by startIdx
          segments.sort((a, b) => a.startIdx - b.startIdx);

          return (
            <div key={course.id} className="flex items-stretch" style={{ minHeight: 28 }}>
              {/* Course label */}
              <div className="w-[120px] shrink-0 flex items-center gap-1 pr-2">
                <span className="text-[9px] font-bold text-gray-300 truncate">{course.cls}</span>
                <span className="text-[7px] px-1 rounded" style={{ background: badge?.bg, color: badge?.fg }}>{course.typ}</span>
              </div>

              {/* Timeline */}
              <div className="flex-1 relative flex items-stretch">
                {segments.map((seg, si) => {
                  const left = `${(seg.startIdx / totalWeeks) * 100}%`;
                  const width = `${((seg.endIdx - seg.startIdx + 1) / totalWeeks) * 100}%`;

                  if (seg.type === 'gap') {
                    if (!seg.hasContent) return null;
                    return (
                      <div key={`gap-${si}`} className="absolute top-0 bottom-0 flex items-center justify-center"
                        style={{ left, width }}>
                        <div className="w-full h-3 bg-slate-800/60 rounded border border-dashed border-slate-700 flex items-center justify-center">
                          <span className="text-[7px] text-gray-600">…</span>
                        </div>
                      </div>
                    );
                  }

                  const colors = seg.block.subjectArea ? SUBJECT_COLORS[seg.block.subjectArea] :
                    seg.seq.subjectArea ? SUBJECT_COLORS[seg.seq.subjectArea] :
                    { bg: '#1e293b', fg: '#94a3b8', border: '#475569' };

                  // Search match in block view
                  const searchLower = searchQuery.toLowerCase();
                  const blockSearchMatch = searchQuery.length >= 2 && (
                    seg.block.label.toLowerCase().includes(searchLower) ||
                    (seg.block.topicMain || '').toLowerCase().includes(searchLower) ||
                    (seg.block.curriculumGoal || '').toLowerCase().includes(searchLower) ||
                    seg.seq.title.toLowerCase().includes(searchLower)
                  );
                  const blockSearchDimmed = searchQuery.length >= 2 && !blockSearchMatch;

                  return (
                    <div key={`seq-${si}`} className={`absolute top-0.5 bottom-0.5 rounded-sm overflow-hidden cursor-pointer hover:brightness-125 hover:scale-[1.02] transition-all ${blockSearchMatch ? 'ring-2 ring-amber-400' : ''}`}
                      style={{ left, width, background: colors.bg, border: `1px solid ${colors.border}`, opacity: blockSearchDimmed ? 0.2 : 1 }}
                      title={`${seg.seq.title} — ${seg.block.label}\n${seg.block.topicMain || ''}\nKW ${seg.block.weeks.join(', ')}\n\n🖱 Klick → Wochen-Ansicht öffnen`}
                      onClick={() => {
                        // Open sequence in side panel
                        setEditingSequenceId(seg.seq.id);
                        setSidePanelOpen(true);
                        setSidePanelTab('sequences');
                        // Switch to week view
                        setZoomLevel(3);
                        // Scroll to first week of block after render
                        const firstWeek = seg.block.weeks[0];
                        if (firstWeek) {
                          setTimeout(() => {
                            const weekRow = document.querySelector(`[data-week="${firstWeek}"]`);
                            weekRow?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 100);
                        }
                      }}
                    >
                      <div className="px-1 py-0.5 h-full flex flex-col justify-center overflow-hidden">
                        <div className="text-[8px] font-semibold truncate" style={{ color: colors.fg }}>
                          {seg.block.topicMain || seg.block.label}
                        </div>
                        <div className="text-[7px] truncate" style={{ color: colors.fg, opacity: 0.7 }}>
                          {seg.block.weeks.length}W · {seg.block.curriculumGoal || seg.seq.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
