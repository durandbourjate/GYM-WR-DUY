import { useMemo } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { COURSES } from '../data/courses';
import { WEEKS } from '../data/weeks';
import type { Course, Week } from '../types';

interface CourseStats {
  course: Course;
  totalLessons: number;
  exams: number;
  events: number;
  holidays: number;
  byType: Record<number, number>; // type -> count
  examWeeks: string[];
}

function computeStats(weekData: Week[]): CourseStats[] {
  const data = weekData.length > 0 ? weekData : WEEKS;
  return COURSES.map((course) => {
    const stats: CourseStats = {
      course,
      totalLessons: 0,
      exams: 0,
      events: 0,
      holidays: 0,
      byType: {},
      examWeeks: [],
    };
    for (const week of data) {
      const entry = week.lessons[course.col];
      if (!entry) continue;
      stats.totalLessons++;
      stats.byType[entry.type] = (stats.byType[entry.type] || 0) + 1;
      if (entry.type === 4) {
        stats.exams++;
        stats.examWeeks.push(week.w);
      }
      if (entry.type === 5) stats.events++;
      if (entry.type === 6) stats.holidays++;
    }
    return stats;
  });
}

const TYPE_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: 'Andere', color: '#94a3b8' },
  1: { label: 'BWL', color: '#3b82f6' },
  2: { label: 'Recht/VWL', color: '#22c55e' },
  3: { label: 'IN', color: '#0ea5e9' },
  4: { label: 'Prüfung', color: '#ef4444' },
  5: { label: 'Event', color: '#eab308' },
  6: { label: 'Ferien', color: '#d4d4d8' },
};

function MiniBar({ byType, total }: { byType: Record<number, number>; total: number }) {
  if (total === 0) return <div className="h-2 bg-gray-800 rounded" />;
  const order = [1, 2, 3, 0, 4, 5, 6];
  return (
    <div className="h-2 rounded overflow-hidden flex">
      {order.map((t) => {
        const count = byType[t] || 0;
        if (count === 0) return null;
        return (
          <div
            key={t}
            style={{
              width: `${(count / total) * 100}%`,
              background: TYPE_LABELS[t]?.color || '#666',
            }}
            title={`${TYPE_LABELS[t]?.label}: ${count}`}
          />
        );
      })}
    </div>
  );
}

export function StatsPanel({ onClose }: { onClose: () => void }) {
  const { weekData } = usePlannerStore();
  const stats = useMemo(() => computeStats(weekData), [weekData]);

  const totalExams = stats.reduce((s, c) => s + c.exams, 0);
  const teachingWeeks = stats.reduce(
    (s, c) => s + c.totalLessons - c.holidays - c.events,
    0
  );

  // Exam collision check: weeks where multiple exams happen
  const examsByWeek = new Map<string, string[]>();
  for (const s of stats) {
    for (const w of s.examWeeks) {
      const arr = examsByWeek.get(w) || [];
      arr.push(s.course.cls);
      examsByWeek.set(w, arr);
    }
  }
  const collisions = [...examsByWeek.entries()].filter(([, cls]) => cls.length > 1);

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-slate-800 rounded-lg p-5 max-w-3xl w-full max-h-[80vh] overflow-y-auto border border-gray-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-100">📊 Statistik SJ 25/26</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 cursor-pointer text-xs">✕</button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-700/50 rounded p-2.5 text-center">
            <div className="text-lg font-bold text-gray-100">{totalExams}</div>
            <div className="text-[9px] text-gray-400">Prüfungen total</div>
          </div>
          <div className="bg-slate-700/50 rounded p-2.5 text-center">
            <div className="text-lg font-bold text-gray-100">{COURSES.length}</div>
            <div className="text-[9px] text-gray-400">Kurse</div>
          </div>
          <div className="bg-slate-700/50 rounded p-2.5 text-center">
            <div className="text-lg font-bold text-gray-100">{teachingWeeks}</div>
            <div className="text-[9px] text-gray-400">Unterrichts-Einträge</div>
          </div>
        </div>

        {/* Per-course table */}
        <table className="w-full text-[10px] mb-4">
          <thead>
            <tr className="text-gray-500 border-b border-gray-700">
              <th className="text-left py-1 pr-2">Kurs</th>
              <th className="text-left py-1 pr-2">Typ</th>
              <th className="text-right py-1 pr-2">Lekt.</th>
              <th className="text-right py-1 pr-2">Prüf.</th>
              <th className="text-left py-1 px-2 w-40">Verteilung</th>
              <th className="text-left py-1">Prüfungswochen</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.course.id} className="border-b border-gray-800 hover:bg-slate-700/30">
                <td className="py-1.5 pr-2 font-semibold text-gray-200">{s.course.cls}</td>
                <td className="py-1.5 pr-2">
                  <span className="px-1 py-px rounded text-[8px] font-bold" style={{
                    background: s.course.typ === 'SF' ? '#16a34a' : s.course.typ === 'IN' ? '#0ea5e9' : s.course.typ === 'EWR' ? '#d97706' : '#7c3aed',
                    color: '#fff',
                  }}>{s.course.typ}</span>
                </td>
                <td className="py-1.5 pr-2 text-right text-gray-300">{s.totalLessons - s.holidays}</td>
                <td className="py-1.5 pr-2 text-right font-semibold text-red-400">{s.exams || '–'}</td>
                <td className="py-1.5 px-2"><MiniBar byType={s.byType} total={s.totalLessons} /></td>
                <td className="py-1.5 text-gray-500">
                  {s.examWeeks.length > 0 ? s.examWeeks.map((w) => `KW${w}`).join(', ') : '–'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Exam collisions */}
        {collisions.length > 0 && (
          <div className="bg-red-950/30 border border-red-800 rounded p-3">
            <div className="text-[10px] font-bold text-red-300 mb-1">⚠ Prüfungskollisionen</div>
            {collisions.map(([w, classes]) => (
              <div key={w} className="text-[9px] text-red-400">
                KW{w}: {classes.join(', ')} ({classes.length} Prüfungen)
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-3 flex gap-3 flex-wrap">
          {[1, 2, 3, 0, 4, 5].map((t) => (
            <span key={t} className="flex items-center gap-1 text-[8px] text-gray-500">
              <span className="w-2 h-2 rounded-sm" style={{ background: TYPE_LABELS[t].color }} />
              {TYPE_LABELS[t].label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
