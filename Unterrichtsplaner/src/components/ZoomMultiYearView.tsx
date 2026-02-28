import { useMemo, useState } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { CURRICULUM_GOALS, type CurriculumGoal } from '../data/curriculumGoals';
import type { SubjectArea } from '../types';

/**
 * Zoom Level 1: Multi-Year View
 * 
 * Shows a high-level overview of the 4-year gymnasium curriculum
 * organized by semesters (S1–S8) with subject distribution.
 * 
 * Two modes:
 * - "curriculum" = Lehrplan-Sicht (what SHOULD be taught per semester)
 * - "actual" = Ist-Zustand (what IS planned in the current planner data)
 */

const SUBJECT_COLORS: Record<SubjectArea, { bg: string; text: string; border: string; light: string }> = {
  BWL: { bg: '#1e3a5f', text: '#93c5fd', border: '#3b82f6', light: '#dbeafe' },
  VWL: { bg: '#3b1f0b', text: '#fdba74', border: '#f97316', light: '#ffedd5' },
  RECHT: { bg: '#052e16', text: '#86efac', border: '#22c55e', light: '#dcfce7' },
  IN: { bg: '#1f2937', text: '#9ca3af', border: '#6b7280', light: '#f3f4f6' },
  INTERDISZ: { bg: '#2e1065', text: '#c4b5fd', border: '#a855f7', light: '#ede9fe' },
};

// Stoffverteilung from Grobzuteilung DUY
const STOFF_VERTEILUNG: { semester: string; gym: string; recht: number; bwl: number; vwl: number }[] = [
  { semester: 'S1', gym: 'GYM1', recht: 0, bwl: 3, vwl: 0 },
  { semester: 'S2', gym: 'GYM1', recht: 1, bwl: 2, vwl: 0 },
  { semester: 'S3', gym: 'GYM2', recht: 2, bwl: 1, vwl: 2 },
  { semester: 'S4', gym: 'GYM2', recht: 3, bwl: 0, vwl: 2 },
  { semester: 'S5', gym: 'GYM3', recht: 2, bwl: 0, vwl: 2 },
  { semester: 'S6', gym: 'GYM3', recht: 0, bwl: 2, vwl: 2 },
  { semester: 'S7', gym: 'GYM4', recht: 2, bwl: 0, vwl: 2 },
  { semester: 'S8', gym: 'GYM4', recht: 0, bwl: 2, vwl: 2 },
];

// Group curriculum goals by semester
function getGoalsBySemester(semester: string): CurriculumGoal[] {
  return CURRICULUM_GOALS.filter(g => {
    if (!g.semester) return false;
    // Handle ranges like "S3/S4", "S5–S8"
    return g.semester.includes(semester) ||
      g.semester.split(/[/–-]/).some(s => s.trim() === semester);
  });
}

type ViewMode = 'curriculum' | 'actual';

function SubjectBar({ area, weight, total }: { area: SubjectArea; weight: number; total: number }) {
  if (weight === 0) return null;
  const pct = (weight / total) * 100;
  const c = SUBJECT_COLORS[area];
  return (
    <div className="flex items-center" style={{ width: `${pct}%`, minWidth: 20 }}>
      <div className="h-5 rounded-sm w-full flex items-center justify-center"
        style={{ background: c.bg, border: `1px solid ${c.border}` }}>
        <span className="text-[8px] font-bold" style={{ color: c.text }}>{weight}</span>
      </div>
    </div>
  );
}

function GoalChip({ goal }: { goal: CurriculumGoal }) {
  const c = SUBJECT_COLORS[goal.area];
  return (
    <div className="flex items-start gap-1 py-0.5 group"
      title={`${goal.goal}\n\nInhalte: ${goal.contents.join(', ')}`}>
      <span className="text-[7px] font-mono px-1 py-px rounded shrink-0"
        style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
        {goal.id}
      </span>
      <span className="text-[8px] text-gray-300 leading-tight">
        {goal.topic}
      </span>
    </div>
  );
}

function SemesterCard({ sv, expanded, onToggle }: { 
  sv: typeof STOFF_VERTEILUNG[0]; 
  expanded: boolean; 
  onToggle: () => void;
}) {
  const goals = useMemo(() => getGoalsBySemester(sv.semester), [sv.semester]);
  const total = sv.recht + sv.bwl + sv.vwl;
  
  // Group goals by area
  const goalsByArea = useMemo(() => {
    const grouped: Record<SubjectArea, CurriculumGoal[]> = { BWL: [], VWL: [], RECHT: [], IN: [], INTERDISZ: [] };
    for (const g of goals) grouped[g.area].push(g);
    return grouped;
  }, [goals]);

  return (
    <div className={`rounded-md border transition-all ${expanded ? 'border-slate-500' : 'border-slate-700 hover:border-slate-600'}`}
      style={{ background: expanded ? '#0f172a' : '#0c1220' }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 cursor-pointer" onClick={onToggle}>
        <span className="text-[11px] font-bold text-gray-200 w-6">{sv.semester}</span>
        {/* Subject distribution bar */}
        <div className="flex-1 flex gap-px">
          <SubjectBar area="BWL" weight={sv.bwl} total={Math.max(total, 1)} />
          <SubjectBar area="VWL" weight={sv.vwl} total={Math.max(total, 1)} />
          <SubjectBar area="RECHT" weight={sv.recht} total={Math.max(total, 1)} />
        </div>
        <span className="text-[8px] text-gray-500 w-12 text-right">{goals.length} Ziele</span>
        <span className="text-[9px] text-gray-500">{expanded ? '▾' : '▸'}</span>
      </div>
      
      {/* Expanded details */}
      {expanded && (
        <div className="px-3 pb-2 space-y-1.5 border-t border-slate-700/50 pt-2">
          {(['BWL', 'VWL', 'RECHT'] as SubjectArea[]).map(area => {
            const areaGoals = goalsByArea[area];
            if (areaGoals.length === 0) return null;
            const c = SUBJECT_COLORS[area];
            return (
              <div key={area}>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-[8px] font-bold px-1 rounded"
                    style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
                    {area}
                  </span>
                </div>
                <div className="pl-1 space-y-px">
                  {areaGoals.map(g => <GoalChip key={g.id} goal={g} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ActualDataCard({ semester, gymYear }: { semester: string; gymYear: string }) {
  const { sequences } = usePlannerStore();
  
  // Count actual planned lessons by subject area from sequences
  const stats = useMemo(() => {
    const counts: Record<SubjectArea, number> = { BWL: 0, VWL: 0, RECHT: 0, IN: 0, INTERDISZ: 0 };
    const topics: Record<SubjectArea, string[]> = { BWL: [], VWL: [], RECHT: [], IN: [], INTERDISZ: [] };
    
    for (const seq of sequences) {
      const area = seq.subjectArea;
      if (!area) continue;
      for (const block of seq.blocks) {
        const weekCount = block.weeks.length;
        const effectiveArea = block.subjectArea || area;
        counts[effectiveArea] += weekCount;
        if (block.topicMain && !topics[effectiveArea].includes(block.topicMain)) {
          topics[effectiveArea].push(block.topicMain);
        }
      }
    }
    
    return { counts, topics };
  }, [sequences]);

  const total = Object.values(stats.counts).reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] font-bold text-gray-200">{semester}</span>
        <span className="text-[8px] text-gray-500">{gymYear}</span>
        <span className="text-[8px] text-gray-600 ml-auto">{total} Lektionen geplant</span>
      </div>
      {total > 0 ? (
        <div className="space-y-1">
          {(['BWL', 'VWL', 'RECHT', 'IN'] as SubjectArea[]).map(area => {
            if (stats.counts[area] === 0) return null;
            const c = SUBJECT_COLORS[area];
            return (
              <div key={area} className="flex items-center gap-2">
                <span className="text-[8px] font-bold w-10 shrink-0" style={{ color: c.text }}>{area}</span>
                <div className="flex-1 h-3 bg-slate-800 rounded-sm overflow-hidden">
                  <div className="h-full rounded-sm transition-all" style={{
                    width: `${(stats.counts[area] / total) * 100}%`,
                    background: c.border,
                    opacity: 0.7,
                  }} />
                </div>
                <span className="text-[8px] text-gray-500 w-6 text-right">{stats.counts[area]}</span>
              </div>
            );
          })}
          {/* Topics preview */}
          <div className="mt-1 pt-1 border-t border-slate-700/30">
            {(['BWL', 'VWL', 'RECHT'] as SubjectArea[]).map(area => {
              if (stats.topics[area].length === 0) return null;
              const c = SUBJECT_COLORS[area];
              return (
                <div key={area} className="text-[7px] text-gray-500 truncate">
                  <span style={{ color: c.text }}>{area}:</span>{' '}
                  {stats.topics[area].slice(0, 3).join(', ')}{stats.topics[area].length > 3 ? ' …' : ''}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-[9px] text-gray-600 italic">Keine Daten verfügbar</div>
      )}
    </div>
  );
}

export function ZoomMultiYearView() {
  const [mode, setMode] = useState<ViewMode>('curriculum');
  const [expandedSemesters, setExpandedSemesters] = useState<Set<string>>(new Set());
  
  const toggleSemester = (s: string) => {
    setExpandedSemesters(prev => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
  };

  const expandAll = () => setExpandedSemesters(new Set(STOFF_VERTEILUNG.map(s => s.semester)));
  const collapseAll = () => setExpandedSemesters(new Set());

  // Summary stats
  const totals = useMemo(() => {
    const t = { recht: 0, bwl: 0, vwl: 0, goals: 0 };
    for (const sv of STOFF_VERTEILUNG) {
      t.recht += sv.recht;
      t.bwl += sv.bwl;
      t.vwl += sv.vwl;
    }
    t.goals = CURRICULUM_GOALS.length;
    return t;
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-gray-200">◫ Multi-Year Overview</h2>
          <p className="text-[9px] text-gray-500 mt-0.5">
            Stoffverteilung SF WR über 4 Gymnasialjahre (S1–S8)
          </p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setMode('curriculum')}
            className={`px-2.5 py-1 rounded text-[9px] font-semibold border cursor-pointer transition-colors ${
              mode === 'curriculum' ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'border-gray-700 text-gray-500 hover:text-gray-300'
            }`}>
            📋 Lehrplan
          </button>
          <button onClick={() => setMode('actual')}
            className={`px-2.5 py-1 rounded text-[9px] font-semibold border cursor-pointer transition-colors ${
              mode === 'actual' ? 'bg-green-500/20 border-green-500 text-green-300' : 'border-gray-700 text-gray-500 hover:text-gray-300'
            }`}>
            📊 Ist-Zustand
          </button>
        </div>
      </div>

      {mode === 'curriculum' ? (
        <>
          {/* Summary bar */}
          <div className="flex items-center gap-3 mb-3 px-2 py-1.5 bg-slate-800/50 rounded-md border border-slate-700">
            <span className="text-[9px] text-gray-400">Gesamt:</span>
            <span className="text-[9px] font-bold" style={{ color: SUBJECT_COLORS.BWL.text }}>BWL {totals.bwl}</span>
            <span className="text-[9px] font-bold" style={{ color: SUBJECT_COLORS.VWL.text }}>VWL {totals.vwl}</span>
            <span className="text-[9px] font-bold" style={{ color: SUBJECT_COLORS.RECHT.text }}>Recht {totals.recht}</span>
            <span className="text-[8px] text-gray-500 ml-auto">{totals.goals} Lehrplanziele</span>
            <button onClick={expandAll} className="text-[8px] text-gray-500 hover:text-gray-300 cursor-pointer" title="Alle aufklappen">⊞</button>
            <button onClick={collapseAll} className="text-[8px] text-gray-500 hover:text-gray-300 cursor-pointer" title="Alle zuklappen">⊟</button>
          </div>

          {/* GYM years */}
          <div className="space-y-4">
            {[['GYM1', 'S1', 'S2'], ['GYM2', 'S3', 'S4'], ['GYM3', 'S5', 'S6'], ['GYM4', 'S7', 'S8']].map(([gym, s1, s2]) => (
              <div key={gym}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-amber-500">{gym}</span>
                  <div className="flex-1 h-px bg-amber-800/30" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[s1, s2].map(sem => {
                    const sv = STOFF_VERTEILUNG.find(s => s.semester === sem)!;
                    return (
                      <SemesterCard key={sem} sv={sv}
                        expanded={expandedSemesters.has(sem)}
                        onToggle={() => toggleSemester(sem)} />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Actual data view */}
          <div className="text-[9px] text-gray-500 mb-3 px-2 py-1.5 bg-slate-800/50 rounded-md border border-slate-700">
            Zeigt geplante Lektionen aus den Sequenzen des aktuellen Schuljahres.
          </div>
          <div className="space-y-4">
            {[['GYM1', 'S1', 'S2'], ['GYM2', 'S3', 'S4'], ['GYM3', 'S5', 'S6'], ['GYM4', 'S7', 'S8']].map(([gym, s1, s2]) => (
              <div key={gym}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-amber-500">{gym}</span>
                  <div className="flex-1 h-px bg-amber-800/30" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ActualDataCard semester={s1} gymYear={gym} />
                  <ActualDataCard semester={s2} gymYear={gym} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-4">
        {(['BWL', 'VWL', 'RECHT'] as SubjectArea[]).map(area => {
          const c = SUBJECT_COLORS[area];
          return (
            <div key={area} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: c.bg, border: `1px solid ${c.border}` }} />
              <span className="text-[8px] font-medium" style={{ color: c.text }}>{area}</span>
            </div>
          );
        })}
        <span className="text-[7px] text-gray-600 ml-auto">Zahlen = Gewichtungseinheiten (Grobzuteilung DUY)</span>
      </div>
    </div>
  );
}
