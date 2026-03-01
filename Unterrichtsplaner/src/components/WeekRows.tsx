import { useCallback, useState, useRef, useEffect } from 'react';
import type { Course, Week } from '../types';
import { LESSON_COLORS, SUBJECT_AREA_COLORS, DAY_COLORS, getSequenceInfoFromStore, isPastWeek } from '../utils/colors';
import { CURRENT_WEEK } from '../data/weeks';
import { usePlannerStore } from '../store/plannerStore';
import { getHKGroup } from '../utils/hkRotation';
import { getEffectiveCategorySubtype, getCategoryLabel, getSubtypeLabel, CATEGORIES } from './DetailPanel';

interface Props {
  weeks: Week[];
  courses: Course[];
  currentRef?: React.RefObject<HTMLTableRowElement | null>;
}

function InlineEdit({ value, onSave, onCancel }: { value: string; onSave: (v: string) => void; onCancel: () => void }) {
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);
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

/* Hover preview popover */
function HoverPreview({ week, col, courses }: { week: string; col: number; courses: Course[] }) {
  const { lessonDetails, weekData, sequences } = usePlannerStore();
  const key = `${week}-${col}`;
  const detail = lessonDetails[key];
  const weekEntry = weekData.find(w => w.w === week);
  const entry = weekEntry?.lessons[col];
  const course = courses.find(c => c.col === col);
  if (!entry || !course) return null;

  const seq = getSequenceInfoFromStore(course.id, week, sequences);

  return (
    <div className="absolute right-0 top-0 w-56 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-[80] p-2.5 pointer-events-none"
      style={{ transform: 'translateX(100%)' }}>
      <div className="text-[10px] font-bold text-gray-200 mb-1">{entry.title}</div>
      {detail?.topicMain && (
        <div className="text-[9px] text-gray-400 mb-0.5">📌 {detail.topicMain}{detail.topicSub ? ` › ${detail.topicSub}` : ''}</div>
      )}
      {detail?.subjectArea && (
        <span className="text-[8px] px-1 py-px rounded border border-gray-600 text-gray-400 mr-1">{detail.subjectArea}</span>
      )}
      {(() => {
        const { category, subtype } = getEffectiveCategorySubtype(detail || {});
        const catDef = category ? CATEGORIES.find(c => c.key === category) : null;
        return (category && category !== 'LESSON') || subtype ? (
          <>
            {catDef && catDef.key !== 'LESSON' && (
              <span className="text-[8px] px-1 py-px rounded border border-gray-600 text-gray-400 mr-1">{catDef.icon} {getCategoryLabel(catDef.key, false)}</span>
            )}
            {subtype && category && (
              <span className="text-[8px] px-1 py-px rounded border border-gray-600 text-gray-400">{getSubtypeLabel(category, subtype, false)}</span>
            )}
          </>
        ) : null;
      })()}
      {seq && (
        <div className="text-[8px] mt-1 text-gray-500">▧ {seq.label} ({seq.index + 1}/{seq.total})</div>
      )}
      {detail?.curriculumGoal && (
        <div className="text-[8px] mt-1 text-gray-500 truncate">🎯 {detail.curriculumGoal}</div>
      )}
      {detail?.notes && (
        <div className="text-[8px] mt-1 text-gray-500 line-clamp-2">📝 {detail.notes}</div>
      )}
    </div>
  );
}

/* Empty cell context menu */
function EmptyCellMenu({ week, course, onClose }: { week: string; course: Course; onClose: () => void }) {
  const { updateLesson, pushUndo, addSequence, setSidePanelOpen, setSidePanelTab, setSelection, setEditingSequenceId } = usePlannerStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [onClose]);

  const handleNewLesson = () => {
    pushUndo();
    updateLesson(week, course.col, { title: 'Neue Lektion', type: 1 });
    // Set default blockCategory to LESSON
    usePlannerStore.getState().updateLessonDetail(week, course.col, { blockCategory: 'LESSON' });
    setSelection({ week, courseId: course.id, title: 'Neue Lektion', course });
    setSidePanelOpen(true);
    setSidePanelTab('details');
    onClose();
  };

  const handleNewSequence = () => {
    const seqId = addSequence({ courseId: course.id, title: `Neue Sequenz ${course.cls}`, blocks: [{ weeks: [week], label: 'Neuer Block' }] });
    setEditingSequenceId(seqId);
    setSidePanelOpen(true);
    setSidePanelTab('sequences');
    onClose();
  };

  return (
    <div ref={menuRef} className="absolute z-[80] bg-slate-800 border border-slate-600 rounded-lg shadow-xl py-1 w-36"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <button onClick={handleNewLesson}
        className="w-full px-3 py-1.5 text-left text-[10px] text-gray-200 hover:bg-slate-700 cursor-pointer flex items-center gap-2">
        <span>📖</span> Neue Kachel
      </button>
      <button onClick={handleNewSequence}
        className="w-full px-3 py-1.5 text-left text-[10px] text-gray-200 hover:bg-slate-700 cursor-pointer flex items-center gap-2">
        <span>▧</span> Neue Sequenz
      </button>
    </div>
  );
}

export function WeekRows({ weeks, courses, currentRef }: Props) {
  const {
    selection, setSelection,
    multiSelection, toggleMultiSelect, clearMultiSelect, selectRange,
    editing, setEditing,
    weekData, updateLesson,
    dragSource, setDragSource, swapLessons, moveLessonToEmpty, moveGroup,
    sequences, editingSequenceId,
    hkOverrides, hkStartGroups, setHKOverride,
    tafPhases,
    setSidePanelOpen, setSidePanelTab,
    lessonDetails,
    setInsertDialog, pushLessons, pushUndo,
    searchQuery,
  } = usePlannerStore();

  const [dropTarget, setDropTarget] = useState<{ week: string; col: number } | null>(null);
  const [hoverCell, setHoverCell] = useState<{ week: string; col: number } | null>(null);
  const [showHoverPreview, setShowHoverPreview] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [emptyCellMenu, setEmptyCellMenu] = useState<{ week: string; course: Course } | null>(null);

  const displayWeeks = weekData.length > 0
    ? weeks.map((w) => weekData.find((wd) => wd.w === w.w) || w)
    : weeks;

  const allWeekKeys = weeks.map(w => w.w);

  // Single click: select + show mini-buttons (no detail panel)
  const handleClick = useCallback(
    (weekW: string, course: Course, title: string, e: React.MouseEvent) => {
      if (!title) return;
      if (e.shiftKey) {
        // Shift+Click: range select within column
        selectRange(`${weekW}-${course.id}`, allWeekKeys, courses);
      } else if (e.metaKey || e.ctrlKey) {
        toggleMultiSelect(`${weekW}-${course.id}`);
      } else {
        clearMultiSelect();
        const isSame = selection?.week === weekW && selection?.courseId === course.id;
        setSelection(isSame ? null : { week: weekW, courseId: course.id, title, course });
        // Don't open side panel on single click
      }
    },
    [selection, setSelection, toggleMultiSelect, clearMultiSelect, selectRange, allWeekKeys, courses]
  );

  // Double click: open side panel with details tab
  const handleDoubleClick = useCallback(
    (weekW: string, course: Course, title: string) => {
      if (!title) return;
      setSelection({ week: weekW, courseId: course.id, title, course });
      setSidePanelOpen(true);
      setSidePanelTab('details');
    },
    [setSelection, setSidePanelOpen, setSidePanelTab]
  );

  // Empty cell click
  const handleEmptyCellClick = useCallback(
    (weekW: string, course: Course) => {
      setEmptyCellMenu({ week: weekW, course });
    },
    []
  );

  const handleSaveEdit = useCallback(
    (weekW: string, col: number, newTitle: string) => {
      const week = displayWeeks.find((w) => w.w === weekW);
      const existing = week?.lessons[col];
      if (existing) { updateLesson(weekW, col, { ...existing, title: newTitle }); }
      setEditing(null);
    },
    [displayWeeks, updateLesson, setEditing]
  );

  // Hover preview logic
  const handleMouseEnter = useCallback((weekW: string, col: number) => {
    setHoverCell({ week: weekW, col });
    setShowHoverPreview(false);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setShowHoverPreview(true), 2000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverCell(null);
    setShowHoverPreview(false);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  }, []);

  // Mini action buttons for selected cell
  const handleMiniInsert = useCallback((e: React.MouseEvent, course: Course, weekW: string) => {
    e.stopPropagation();
    const paired = COURSES_CACHE.filter(c => c.id !== course.id && c.cls === course.cls && c.typ === course.typ && c.les !== course.les);
    setInsertDialog({ week: weekW, course, hasMismatch: paired.length > 0, pairedCourses: paired });
  }, [setInsertDialog]);

  const handleMiniPush = useCallback((e: React.MouseEvent, course: Course, weekW: string) => {
    e.stopPropagation();
    pushUndo();
    pushLessons(course.col, weekW, allWeekKeys);
  }, [pushUndo, pushLessons, allWeekKeys]);

  const handleMiniDetails = useCallback((e: React.MouseEvent, course: Course, weekW: string, title: string) => {
    e.stopPropagation();
    setSelection({ week: weekW, courseId: course.id, title, course });
    setSidePanelOpen(true);
    setSidePanelTab('details');
  }, [setSelection, setSidePanelOpen, setSidePanelTab]);

  return (
    <>
      {displayWeeks.map((week) => {
        const isCurrent = week.w === CURRENT_WEEK;
        const past = isPastWeek(week.w, CURRENT_WEEK);
        return (
          <tr
            key={week.w}
            ref={isCurrent ? currentRef : undefined}
            data-week={week.w}
            className="group"
            style={{ opacity: past && !isCurrent ? 0.4 : 1 }}
          >
            {/* Week number */}
            <td
              className="sticky left-0 z-30 px-1 text-center border-b border-slate-900/60"
              style={{ background: isCurrent ? '#172554' : '#0c0f1a' }}
            >
              <div className={`text-[9px] font-mono ${isCurrent ? 'font-extrabold text-blue-400' : 'font-medium text-gray-500'}`}>
                {week.w}
              </div>
              {isCurrent && <div className="w-1 h-1 rounded-full bg-blue-400 mx-auto mt-0.5 animate-pulse" />}
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
              const seq = getSequenceInfoFromStore(c.id, week.w, sequences);
              const cellHeight = c.les >= 2 ? 36 : 26;
              const isDragOver = dropTarget?.week === week.w && dropTarget?.col === c.col;
              const isDragSrc = dragSource?.week === week.w && dragSource?.col === c.col;
              const hkGroup = c.hk ? getHKGroup(week.w, c.col, hkStartGroups[c.col] || 'A', hkOverrides) : null;
              const isHovered = hoverCell?.week === week.w && hoverCell?.col === c.col;
              const showPreview = isHovered && showHoverPreview && title && !isSelected;
              const showEmptyMenu = emptyCellMenu?.week === week.w && emptyCellMenu?.course.id === c.id;

              // Lesson detail for display (with block inheritance)
              const cellDetail = lessonDetails[`${week.w}-${c.col}`];
              const parentBlock = seq ? (() => {
                const parentSeq = sequences.find(s => s.id === seq.sequenceId);
                return parentSeq?.blocks.find(b => b.weeks.includes(week.w));
              })() : null;

              // Use SubjectArea color if available (more precise than LessonType)
              const effectiveSubjectArea = cellDetail?.subjectArea || parentBlock?.subjectArea;
              const saColors = effectiveSubjectArea ? SUBJECT_AREA_COLORS[effectiveSubjectArea] : null;
              const cellColors = saColors || colors;

              // Sequence highlight: is this cell part of the currently edited sequence?
              const editingSeq = editingSequenceId ? sequences.find(s => s.id === editingSequenceId) : null;
              const editingSeqMatchesCourse = editingSeq && (
                editingSeq.courseId === c.id ||
                (editingSeq.courseIds && editingSeq.courseIds.includes(c.id))
              );
              const isInEditingSeq = editingSeqMatchesCourse && editingSeq?.blocks.some(b => b.weeks.includes(week.w));
              const isSeqDimmed = editingSeqMatchesCourse && !isInEditingSeq && !!title;
              const effectiveTopicMain = cellDetail?.topicMain || parentBlock?.topicMain;
              const effectiveTopicSub = cellDetail?.topicSub || parentBlock?.topicSub;
              const displayTitle = effectiveTopicMain
                ? (effectiveTopicSub ? `${effectiveTopicMain} › ${effectiveTopicSub}` : effectiveTopicMain)
                : title;

              // Fixed cells: holidays (type 6) and events (type 5) should not be draggable
              const isFixed = lessonType === 6 || lessonType === 5;

              // Search match
              const searchLower = searchQuery.toLowerCase();
              const isSearchMatch = searchQuery.length >= 2 && (
                displayTitle.toLowerCase().includes(searchLower) ||
                title.toLowerCase().includes(searchLower) ||
                (cellDetail?.notes || '').toLowerCase().includes(searchLower) ||
                (cellDetail?.curriculumGoal || '').toLowerCase().includes(searchLower) ||
                (seq?.label || '').toLowerCase().includes(searchLower)
              );
              const isSearchDimmed = searchQuery.length >= 2 && !isSearchMatch && !!title;

              const tafPhase = tafPhases.find(p => {
                const allW = weeks.map(w => w.w);
                const si = allW.indexOf(p.startWeek);
                const ei = allW.indexOf(p.endWeek);
                const wi = allW.indexOf(week.w);
                return si >= 0 && ei >= 0 && wi >= si && wi <= ei;
              });

              return (
                <td
                  key={c.id}
                  className="p-0 border-b border-slate-900/40 relative group-hover:bg-slate-950/40"
                  style={{
                    borderLeft: newDay ? `2px solid ${DAY_COLORS[c.day]}12` : 'none',
                    outline: isDragOver ? '2px solid #3b82f6' : isMulti && !title ? '2px solid #6366f180' : 'none',
                    outlineOffset: '-2px',
                    background: isDragOver ? '#1e3a5f30' : isMulti && !title ? '#312e8140' : undefined,
                    width: 110,
                    minWidth: 110,
                    maxWidth: 110,
                  }}
                  onClick={(e) => {
                    if (e.shiftKey || e.metaKey || e.ctrlKey) {
                      if (e.shiftKey) {
                        selectRange(`${week.w}-${c.id}`, allWeekKeys, courses);
                      } else {
                        toggleMultiSelect(`${week.w}-${c.id}`);
                      }
                    } else if (title) {
                      handleClick(week.w, c, title, e);
                    } else {
                      // Click on empty cell: just deselect everything
                      clearMultiSelect();
                      setSelection(null);
                      setEmptyCellMenu(null);
                    }
                  }}
                  onDoubleClick={() => {
                    if (title) {
                      handleDoubleClick(week.w, c, title);
                    } else {
                      // Double-click on empty cell: show new tile/sequence menu
                      handleEmptyCellClick(week.w, c);
                    }
                  }}
                  onMouseEnter={() => title && handleMouseEnter(week.w, c.col)}
                  onMouseLeave={handleMouseLeave}
                  onDragOver={(e) => {
                    if (dragSource) {
                      const dragCourse = courses.find(cc => cc.col === dragSource.col);
                      const dragKey = dragCourse ? `${dragSource.week}-${dragCourse.id}` : '';
                      const isGroupDrag = multiSelection.length > 1 && multiSelection.includes(dragKey);
                      if (isGroupDrag || dragSource.col === c.col) {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        setDropTarget({ week: week.w, col: c.col });
                      }
                    }
                  }}
                  onDragLeave={() => setDropTarget(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDropTarget(null);
                    if (!dragSource) return;
                    if (dragSource.week === week.w && dragSource.col === c.col) return;
                    // Don't allow dropping onto fixed cells
                    if (isFixed) return;

                    // Check if dragging a multi-selected group
                    const dragCourse = courses.find(cc => cc.col === dragSource.col);
                    const dragKey = dragCourse ? `${dragSource.week}-${dragCourse.id}` : '';
                    const isGroupDrag = multiSelection.length > 1 && multiSelection.includes(dragKey);

                    if (isGroupDrag) {
                      // Group drag: move all selected cells by column to target position
                      // Group selections by column (col)
                      const byCol = new Map<number, string[]>();
                      for (const key of multiSelection) {
                        const parts = key.split('-');
                        const cid = parts[parts.length - 1];
                        const wk = parts.slice(0, parts.length - 1).join('-');
                        const course = courses.find(cc => cc.id === cid);
                        if (course) {
                          if (!byCol.has(course.col)) byCol.set(course.col, []);
                          byCol.get(course.col)!.push(wk);
                        }
                      }
                      // Calculate week offset from dragSource to drop target
                      const fromIdx = allWeekKeys.indexOf(dragSource.week);
                      const toIdx = allWeekKeys.indexOf(week.w);
                      if (fromIdx >= 0 && toIdx >= 0) {
                        const offset = toIdx - fromIdx;
                        // Move each column's group by the same offset
                        for (const [col, weeks] of byCol) {
                          const sorted = [...weeks].sort((a, b) => allWeekKeys.indexOf(a) - allWeekKeys.indexOf(b));
                          const targetWeek = allWeekKeys[allWeekKeys.indexOf(sorted[0]) + offset];
                          if (targetWeek) {
                            moveGroup(col, sorted, targetWeek, allWeekKeys);
                          }
                        }
                      }
                    } else if (dragSource.col === c.col) {
                      if (title) {
                        swapLessons(c.col, dragSource.week, week.w);
                      } else {
                        moveLessonToEmpty(c.col, dragSource.week, week.w);
                      }
                    }
                    setDragSource(null);
                  }}
                >
                  {/* Sequence bar */}
                  {seq && (
                    <div
                      className="absolute left-0 w-[3px] opacity-70 cursor-pointer"
                      style={{
                        top: seq.isFirst ? 3 : 0,
                        bottom: seq.isLast ? 3 : 0,
                        background: seq.color || '#16a34a',
                        borderRadius: seq.isFirst ? '2px 0 0 0' : seq.isLast ? '0 0 0 2px' : '0',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const parentSeq = sequences.find(s => s.id === seq.sequenceId);
                        if (parentSeq) {
                          usePlannerStore.getState().setEditingSequenceId(parentSeq.id);
                          setSidePanelOpen(true);
                          setSidePanelTab('sequences');
                        }
                      }}
                      title={`Sequenz öffnen: ${seq.label}`}
                    />
                  )}
                  {seq?.isFirst && (
                    <div className="absolute left-1.5 -top-0.5 text-[6px] font-bold z-10 bg-[#0c0f1a] px-0.5 rounded whitespace-nowrap cursor-pointer"
                      style={{ color: seq.color || '#4ade80' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const parentSeq = sequences.find(s => s.id === seq.sequenceId);
                        if (parentSeq) {
                          usePlannerStore.getState().setEditingSequenceId(parentSeq.id);
                          setSidePanelOpen(true);
                          setSidePanelTab('sequences');
                        }
                      }}
                      title={`Sequenz öffnen: ${seq.label}`}
                    >
                      {seq.label}
                    </div>
                  )}

                  {/* HK Rotation Badge */}
                  {hkGroup && title && (
                    <div
                      className="absolute right-0.5 top-0 text-[7px] font-bold z-10 px-1 py-px rounded-bl cursor-pointer select-none"
                      style={{
                        background: hkGroup === 'A' ? '#7c3aed40' : '#0ea5e940',
                        color: hkGroup === 'A' ? '#a78bfa' : '#67e8f9',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setHKOverride(week.w, c.col, hkGroup === 'A' ? 'B' : 'A');
                      }}
                      title={`HK ${hkGroup} – Klick zum Wechseln`}
                    >
                      {hkGroup}
                    </div>
                  )}

                  {/* TaF Phase indicator */}
                  {tafPhase && ci === 0 && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[2px]"
                      style={{ background: tafPhase.color }}
                      title={tafPhase.name}
                    />
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
                      draggable={!isFixed}
                      onDragStart={(e) => {
                        if (isFixed) { e.preventDefault(); return; }
                        setDragSource({ week: week.w, col: c.col });
                        e.dataTransfer.effectAllowed = 'move';
                        const isGroupDrag = multiSelection.length > 1 && multiSelection.includes(`${week.w}-${c.id}`);
                        e.dataTransfer.setData('text/plain', isGroupDrag ? `group:${c.col}` : `${week.w}:${c.col}`);
                      }}
                      onDragEnd={() => { setDragSource(null); setDropTarget(null); }}
                      className={`mx-0.5 ml-1.5 px-1 py-0.5 rounded transition-all duration-100 flex items-center hover:shadow-md hover:z-10 relative ${isFixed ? 'cursor-default' : 'cursor-grab hover:scale-[1.02]'} ${isSearchMatch ? 'search-highlight' : ''}`}
                      style={{
                        minHeight: isFixed ? Math.max(cellHeight, 32) : cellHeight,
                        opacity: isDragSrc ? 0.35 : isSeqDimmed ? 0.3 : isSearchDimmed ? 0.2 : 1,
                        background: isInEditingSeq ? '#1e3a5f' : isMulti ? '#312e81' : isSelected ? '#1e3a5f' : cellColors?.bg || '#eef2f7',
                        border: `1px solid ${isInEditingSeq ? '#60a5fa' : isMulti ? '#6366f1' : isSelected ? '#3b82f6' : cellColors?.border || '#cbd5e1'}`,
                        boxShadow: isInEditingSeq ? '0 0 0 2px #3b82f640' : isMulti ? '0 0 0 2px #6366f150' : isSelected ? '0 0 0 2px #3b82f650' : 'none',
                      }}
                    >
                      {lessonType === 4 && <span className="mr-0.5 text-[8px]">📝</span>}
                      {isFixed && <span className="mr-0.5 text-[8px]">{lessonType === 6 ? '🏖' : '📅'}</span>}
                      {cellDetail?.sol?.enabled && <span className="mr-0.5 text-[8px]" title="SOL">📚</span>}
                      <div
                        className="leading-tight overflow-hidden flex-1 cursor-pointer"
                        onClick={(e) => {
                          // Let Cmd/Shift clicks propagate to td for multi-select handling
                          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                          e.stopPropagation();
                          setSelection({ week: week.w, courseId: c.id, title, course: c });
                          setSidePanelOpen(true);
                          setSidePanelTab('details');
                        }}
                        title="Klick: Details öffnen"
                        style={{
                          fontSize: c.les >= 2 ? 9 : 8,
                          fontWeight: lessonType === 4 || isFixed ? 700 : 500,
                          color: isInEditingSeq ? '#93c5fd' : isMulti ? '#c7d2fe' : isSelected ? '#e2e8f0' : cellColors?.fg || '#475569',
                          display: '-webkit-box',
                          WebkitLineClamp: c.les >= 2 ? 3 : 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {displayTitle}
                        <span className="text-[7px] opacity-40 ml-0.5">ⓘ</span>
                      </div>

                      {/* Mini action buttons on selection */}
                      {isSelected && (
                        <div className="absolute right-0.5 bottom-0.5 flex gap-px z-20">
                          <button
                            onClick={(e) => handleMiniInsert(e, c, week.w)}
                            className="w-4 h-4 rounded bg-slate-700/90 text-gray-300 text-[8px] flex items-center justify-center cursor-pointer hover:bg-blue-600 hover:text-white border border-slate-600"
                            title="Einfügen (leere Zeile davor)"
                          >+</button>
                          <button
                            onClick={(e) => handleMiniPush(e, c, week.w)}
                            className="w-4 h-4 rounded bg-slate-700/90 text-gray-300 text-[8px] flex items-center justify-center cursor-pointer hover:bg-blue-600 hover:text-white border border-slate-600"
                            title="Push (nach unten verschieben)"
                          >↓</button>
                          <button
                            onClick={(e) => handleMiniDetails(e, c, week.w, title)}
                            className="w-4 h-4 rounded bg-slate-700/90 text-gray-300 text-[8px] flex items-center justify-center cursor-pointer hover:bg-blue-600 hover:text-white border border-slate-600"
                            title="Details öffnen"
                          >i</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-slate-800/40 rounded mx-0.5"
                      style={{ minHeight: cellHeight }}
                      title="Klick: Neue Kachel oder Sequenz"
                    />
                  )}

                  {/* Hover preview popover */}
                  {showPreview && <HoverPreview week={week.w} col={c.col} courses={courses} />}

                  {/* Empty cell context menu */}
                  {showEmptyMenu && (
                    <EmptyCellMenu
                      week={week.w}
                      course={c}
                      onClose={() => setEmptyCellMenu(null)}
                    />
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

// We need courses for paired detection in mini-buttons
import { COURSES as COURSES_CACHE } from '../data/courses';
