import type { Course } from '../types';
import { DAY_COLORS, TYPE_BADGES } from '../utils/colors';

interface Props {
  courses: Course[];
  semester: 1 | 2;
}

export function SemesterHeader({ courses, semester }: Props) {

  return (
    <thead className="sticky z-40" style={{ top: 36 }}>
      {/* Day row */}
      <tr>
        <th className="w-12 bg-gray-900 sticky left-0 z-50 py-1 border-b border-gray-800">
          <span className={`text-[9px] font-bold ${semester === 1 ? 'text-blue-400' : 'text-amber-400'}`}>
            {semester === 1 ? 'S1' : 'S2'}
          </span>
        </th>
        {courses.map((c, i) => {
          const newDay = i === 0 || c.day !== courses[i - 1]?.day;
          return (
            <th
              key={`${c.id}-day`}
              className="bg-gray-900 px-0 pt-0.5 border-b border-gray-800 text-center"
              style={{
                borderLeft: newDay ? `2px solid ${DAY_COLORS[c.day]}40` : 'none',
                fontSize: 10,
                fontWeight: 700,
                color: DAY_COLORS[c.day],
              }}
            >
              {newDay ? c.day : ''}
            </th>
          );
        })}
      </tr>
      {/* Course info row */}
      <tr>
        <th className="w-12 bg-gray-900 sticky left-0 z-50 px-1 pb-1 border-b-2 border-gray-700">
          <span className="text-[7px] text-gray-500 font-semibold">KW</span>
        </th>
        {courses.map((c, i) => {
          const newDay = i === 0 || c.day !== courses[i - 1]?.day;
          const badge = TYPE_BADGES[c.typ];
          return (
            <th
              key={`${c.id}-info`}
              className="bg-gray-900 px-0.5 pb-1 border-b-2 border-gray-700 text-center"
              style={{
                borderLeft: newDay ? `2px solid ${DAY_COLORS[c.day]}40` : 'none',
                width: 110,
                minWidth: 110,
                maxWidth: 110,
              }}
            >
              <div className="text-[10px] font-bold text-gray-200">{c.cls}</div>
              <div className="flex gap-0.5 justify-center mt-0.5 flex-wrap">
                <span
                  className="text-[7px] px-1 rounded font-bold"
                  style={{ background: badge?.bg, color: badge?.fg }}
                >
                  {c.typ}
                </span>
                <span
                  className={`text-[7px] px-1 rounded font-semibold ${
                    c.hk ? 'bg-orange-900/60 text-orange-200' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {c.hk ? 'HK' : 'GK'}
                </span>
                <span className="text-[7px] px-0.5 rounded bg-slate-800 text-slate-400">
                  {c.les}L
                </span>
              </div>
              <div className="text-[7px] text-gray-500 font-mono mt-0.5">
                {c.from}–{c.to}
              </div>
              {c.note && (
                <div className="text-[6px] text-amber-600 mt-0.5">{c.note}</div>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
