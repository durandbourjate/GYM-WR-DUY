import { useCallback, useState, useRef, useEffect } from 'react';
import type { Course, Week } from '../types';
import { LESSON_COLORS, DAY_COLORS, getSequenceInfo, isPastWeek } from '../utils/colors';
import { CURRENT_WEEK } from '../data/weeks';
import { usePlannerStore } from '../store/plannerStore';

interface Props {
  weeks: Week[];
  courses: Course[];
  currentRef?: React.RefObject<HTMLTableRowElement | null>;
}

// Inline edit component
function InlineEdit({ value, onSave, onCancel }: { value: string; onSave: (v: string) => void; onCancel: () => void }) {
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <input
      ref={inputRef}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSave(text);
        if (e.key === 'Escape') onCancel();
      }}
      onBlur={() => onSave(text)}
      className="w-full bg-slate-700 text-slate-100 border border-blue-400 rounded px-1 py-0.5 text-[9px] outline-none"
      style={{ minHeight: 20 }}
    />
  );
}

export function WeekRows({ weeks, courses, currentRef }: Props) {
  const {
    selection, setSelection,
    multiSelection, toggleMultiSelect, clearMultiSelect,
    editing, setEditing,
    weekData, updateLesson,
  } = usePlannerStore();

  // Use weekData from store (mutable) if available, otherwise props
  const displayWeeks = weekData.length > 0
    ? weeks.map((w) => weekData.find((wd) => wd.w === w.w) || w)
    : weeks;

  const handleClick = useCallback(
    (weekW: string, course: Course, title: string, e: React.MouseEvent) => {
      if (!title) return;
      if (e.shiftKey || e.metaKey || e.ctrlKey) {
        toggleMultiSelect(`${weekW}-${course.id}`);
      } else {
        clearMultiSelect();
        setSelection(
          selection?.week === weekW && selection?.courseId === course.id
            ? null
            : { week: weekW, courseId: course.id, title, course }
        );
      }
    },
    [selection, setSelection, toggleMultiSelect, clearMultiSelect]
  );

  const handleDoubleClick = useCallback(
    (weekW: string, col: number) => {
      setEditing({ week: weekW, col });
    },
    [setEditing]
  );

  const handleSaveEdit = useCallback(
    (weekW: string, col: number, newTitle: string) => {
      const week = displayWeeks.find((w) => w.w === weekW);
      const existing = week?.lessons[col];
      if (existing) {
        updateLesson(weekW, col, { ...existing, title: newTitle });
      }
      setEditing(null);
    },
    [displayWeeks, updateLesson, setEditing]
  );

  return (
    <>
      {displayWeeks.map((week) => {
        const isCurrent = week.w === CURRENT_WEEK;
        const past = isPastWeek(week.w, CURRENT_WEEK);

        return (
          <tr
            key={week.w}
            ref={isCurrent ? currentRef : undefined}
            className="group"
            style={{ opacity: past && !isCurrent ? 0.4 : 1 }}
          >
            {/* Week number */}
            <td
              className="sticky left-0 z-30 px-1 text-center border-b border-slate-900/60"
              style={{ background: isCurrent ? '#172554' : '#0c0f1a' }}
            >
              <div
                className={`text-[9px] font-mono ${isCurrent ? 'font-extrabold text-blue-400' : 'font-medium text-gray-500'}`}
              >
                {week.w}
              </div>
              {isCurrent && (
                <div className="w-1 h-1 rounded-full bg-blue-400 mx-auto mt-0.5 animate-pulse" />
              )}
            </td>

            {/* Lesson cells */}
            {courses.map((c, ci) => {
              const newDay = ci === 0 || c.day !== courses[ci - 1]?.day;
              const entry = week.lessons[c.col];
              const title = entry?.title || '';
              const lessonType = entry?.type ?? -1;
              const colors = lessonType >= 0 ? LESSON_COLORS[lessonType as keyof typeof LESSON_COLORS] : null;
              const isSelected = selection?.week === week.w && selection?.courseId === c.id;
              const isMulti = multiSelection.includes(`${week.w}-${c.id}`);
              const isEditing = editing?.week === week.w && editing?.col === c.col;
              const seq = getSequenceInfo(c.id, week.w);
              const cellHeight = c.les >= 2 ? 36 : 26;

              return (
                <td
                  key={c.id}
                  className="p-0 border-b border-slate-900/40 relative group-hover:bg-slate-950/40"
                  style={{ borderLeft: newDay ? `2px solid ${DAY_COLORS[c.day]}12` : 'none' }}
                  onClick={(e) => handleClick(week.w, c, title, e)}
                  onDoubleClick={() => title && handleDoubleClick(week.w, c.col)}
                >
                  {/* Sequence bar */}
                  {seq && (
                    <div
                      className="absolute left-0 w-[3px] opacity-70"
                      style={{
                        top: seq.isFirst ? 3 : 0,
                        bottom: seq.isLast ? 3 : 0,
                        background: '#16a34a',
                        borderRadius: seq.isFirst ? '2px 0 0 0' : seq.isLast ? '0 0 0 2px' : '0',
                      }}
                    />
                  )}
                  {seq?.isFirst && (
                    <div className="absolute left-1.5 -top-0.5 text-[6px] font-bold text-green-400 z-10 bg-[#0c0f1a] px-0.5 rounded whitespace-nowrap">
                      {seq.label}
                    </div>
                  )}

                  {isEditing ? (
                    <div className="mx-0.5 ml-1.5" style={{ minHeight: cellHeight }}>
                      <InlineEdit
                        value={title}
                        onSave={(v) => handleSaveEdit(week.w, c.col, v)}
                        onCancel={() => setEditing(null)}
                      />
                    </div>
                  ) : title ? (
                    <div
                      className="mx-0.5 ml-1.5 px-1 py-0.5 rounded cursor-pointer transition-all duration-100 flex items-center hover:scale-[1.02] hover:shadow-md hover:z-10"
                      style={{
                        minHeight: cellHeight,
                        background: isMulti ? '#312e81' : isSelected ? '#1e3a5f' : colors?.bg || '#eef2f7',
                        border: `1px solid ${isMulti ? '#6366f1' : isSelected ? '#3b82f6' : colors?.border || '#cbd5e1'}`,
                        boxShadow: isMulti
                          ? '0 0 0 2px #6366f150'
                          : isSelected
                            ? '0 0 0 2px #3b82f650'
                            : 'none',
                      }}
                    >
                      {lessonType === 4 && <span className="mr-0.5 text-[8px]">📝</span>}
                      <div
                        className="leading-tight overflow-hidden"
                        style={{
                          fontSize: c.les >= 2 ? 9 : 8,
                          fontWeight: lessonType === 4 ? 700 : 500,
                          color: isMulti ? '#c7d2fe' : isSelected ? '#e2e8f0' : colors?.fg || '#475569',
                          display: '-webkit-box',
                          WebkitLineClamp: c.les >= 2 ? 3 : 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {title}
                      </div>
                    </div>
                  ) : (
                    <div style={{ minHeight: cellHeight }} />
                  )}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}
