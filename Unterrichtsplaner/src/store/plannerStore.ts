import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterType, Week, LessonEntry, Course, LessonDetail, ManagedSequence, SequenceBlock, HKGroup, TaFPhase } from '../types';
import { SEQUENCES as STATIC_SEQUENCES } from '../data/sequences';
import { COURSES, getLinkedCourseIds } from '../data/courses';

interface Selection {
  week: string;
  courseId: string;
  title: string;
  course: Course;
}

interface EditingCell {
  week: string;
  col: number;
}

interface InsertDialog {
  week: string;
  course: Course;
  hasMismatch: boolean;
  pairedCourses: Course[];
}

interface PlannerState {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  classFilter: string | null;
  setClassFilter: (c: string | null) => void;
  zoomLevel: 1 | 2 | 3;
  setZoomLevel: (z: 1 | 2 | 3) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selection: Selection | null;
  setSelection: (s: Selection | null) => void;
  multiSelection: string[];
  lastSelectedKey: string | null;
  toggleMultiSelect: (key: string) => void;
  selectRange: (toKey: string, allWeeks: string[], courses: Course[]) => void;
  clearMultiSelect: () => void;
  showHelp: boolean;
  toggleHelp: () => void;
  editing: EditingCell | null;
  setEditing: (e: EditingCell | null) => void;
  weekData: Week[];
  setWeekData: (w: Week[]) => void;
  updateLesson: (weekW: string, col: number, entry: LessonEntry) => void;
  insertDialog: InsertDialog | null;
  setInsertDialog: (d: InsertDialog | null) => void;
  // Drag & Drop
  dragSource: { week: string; col: number } | null;
  setDragSource: (d: { week: string; col: number } | null) => void;
  swapLessons: (col: number, weekA: string, weekB: string) => void;
  moveLessonToEmpty: (col: number, fromWeek: string, toWeek: string) => void;
  pushLessons: (courseCol: number, beforeWeekW: string, allWeeks: string[]) => void;
  batchShiftDown: (keys: string[], allWeeks: string[], courses: Course[]) => void;
  batchInsertBefore: (keys: string[], allWeeks: string[], courses: Course[]) => void;
  // Group drag & drop
  moveGroup: (col: number, fromWeeks: string[], toWeek: string, allWeeks: string[]) => void;
  // Lesson Details
  lessonDetails: Record<string, LessonDetail>; // key: "weekW-col"
  updateLessonDetail: (weekW: string, col: number, detail: Partial<LessonDetail>) => void;
  getLessonDetail: (weekW: string, col: number) => LessonDetail | undefined;
  // Detail Panel state
  detailPanelExpanded: boolean;
  setDetailPanelExpanded: (v: boolean) => void;
  // Phase 1: Side panel
  sidePanelOpen: boolean;
  setSidePanelOpen: (v: boolean) => void;
  sidePanelTab: 'details' | 'sequences';
  setSidePanelTab: (t: 'details' | 'sequences') => void;
  hoveredCell: { week: string; col: number } | null;
  setHoveredCell: (c: { week: string; col: number } | null) => void;
  // Empty cell action
  emptyCellAction: { week: string; courseId: string; course: Course } | null;
  setEmptyCellAction: (a: { week: string; courseId: string; course: Course } | null) => void;
  // Sequences CRUD
  sequences: ManagedSequence[];
  sequencesMigrated: boolean;
  sequenceTitlesFixed: boolean;
  migrateStaticSequences: () => void;
  fixSequenceTitles: () => void;
  addSequence: (seq: Omit<ManagedSequence, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateSequence: (id: string, updates: Partial<Pick<ManagedSequence, 'title' | 'subjectArea' | 'blocks' | 'color' | 'courseId' | 'courseIds' | 'multiDayMode'>>) => void;
  deleteSequence: (id: string) => void;
  addBlockToSequence: (seqId: string, block: SequenceBlock) => void;
  updateBlockInSequence: (seqId: string, blockIndex: number, block: Partial<SequenceBlock>) => void;
  removeBlockFromSequence: (seqId: string, blockIndex: number) => void;
  reorderBlocks: (seqId: string, fromIndex: number, toIndex: number) => void;
  // Auto-placement
  autoPlaceSequence: (seqId: string, startWeek: string, allWeekOrder: string[]) => { placed: number; skipped: string[] };
  getAvailableWeeks: (courseId: string, startWeek: string, allWeekOrder: string[]) => string[];
  // Sequence Panel UI state
  sequencePanelOpen: boolean;
  setSequencePanelOpen: (v: boolean) => void;
  editingSequenceId: string | null;
  setEditingSequenceId: (id: string | null) => void;
  // Export / Import
  exportData: () => string;
  importData: (json: string) => boolean;
  // HK Rotation
  hkOverrides: Record<string, HKGroup>; // key: "weekW-col" -> 'A' | 'B'
  hkStartGroups: Record<number, HKGroup>; // col -> start group
  setHKOverride: (weekW: string, col: number, group: HKGroup | null) => void;
  setHKStartGroup: (col: number, group: HKGroup) => void;
  // TaF Phasen
  tafPhases: TaFPhase[];
  addTaFPhase: (phase: Omit<TaFPhase, 'id'>) => string;
  updateTaFPhase: (id: string, updates: Partial<TaFPhase>) => void;
  deleteTaFPhase: (id: string) => void;
  // Undo
  undoStack: Week[][];
  pushUndo: () => void;
  undo: () => void;
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
  filter: 'ALL',
  setFilter: (f) => set({ filter: f }),
  classFilter: null,
  setClassFilter: (c) => set({ classFilter: c }),
  zoomLevel: 3,
  setZoomLevel: (z) => set({ zoomLevel: z }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  selection: null,
  setSelection: (s) => set({ selection: s }),
  multiSelection: [],
  lastSelectedKey: null,
  toggleMultiSelect: (key) =>
    set((state) => ({
      multiSelection: state.multiSelection.includes(key)
        ? state.multiSelection.filter((k) => k !== key)
        : [...state.multiSelection, key],
      lastSelectedKey: key,
    })),
  selectRange: (toKey, allWeeks, courses) => {
    const state = get();
    const fromKey = state.lastSelectedKey;
    if (!fromKey) {
      set({ multiSelection: [toKey], lastSelectedKey: toKey });
      return;
    }
    const [fromWeek, fromCourseId] = fromKey.split('-');
    const [toWeek, toCourseId] = toKey.split('-');

    // Check if both courses belong to the same class+type (linked courses, e.g. Di+Do)
    const fromCourse = courses.find(c => c.id === fromCourseId);
    const toCourse = courses.find(c => c.id === toCourseId);
    const areLinked = fromCourse && toCourse &&
      fromCourse.cls === toCourse.cls && fromCourse.typ === toCourse.typ &&
      fromCourseId !== toCourseId;

    if (areLinked) {
      // Cross-day selection: select all weeks in range for BOTH course columns
      const fromIdx = allWeeks.indexOf(fromWeek);
      const toIdx = allWeeks.indexOf(toWeek);
      if (fromIdx < 0 || toIdx < 0) return;
      const startIdx = Math.min(fromIdx, toIdx);
      const endIdx = Math.max(fromIdx, toIdx);
      const rangeKeys: string[] = [];
      for (let i = startIdx; i <= endIdx; i++) {
        rangeKeys.push(`${allWeeks[i]}-${fromCourseId}`);
        rangeKeys.push(`${allWeeks[i]}-${toCourseId}`);
      }
      set((s) => ({
        multiSelection: Array.from(new Set([...s.multiSelection, ...rangeKeys])),
        lastSelectedKey: toKey,
      }));
      return;
    }

    if (fromCourseId !== toCourseId) {
      // Different, unlinked courses — just add this one
      set((s) => ({
        multiSelection: s.multiSelection.includes(toKey)
          ? s.multiSelection
          : [...s.multiSelection, toKey],
        lastSelectedKey: toKey,
      }));
      return;
    }

    // Same column range selection
    const fromIdx = allWeeks.indexOf(fromWeek);
    const toIdx = allWeeks.indexOf(toWeek);
    if (fromIdx < 0 || toIdx < 0) return;
    const startIdx = Math.min(fromIdx, toIdx);
    const endIdx = Math.max(fromIdx, toIdx);
    const rangeKeys: string[] = [];
    for (let i = startIdx; i <= endIdx; i++) {
      rangeKeys.push(`${allWeeks[i]}-${fromCourseId}`);
    }

    // Check if same-column range should prompt for linked day
    const linkedCourseIds = getLinkedCourseIds(fromCourseId);
    if (linkedCourseIds.length > 1) {
      const otherCourseId = linkedCourseIds.find(id => id !== fromCourseId);
      if (otherCourseId) {
        const otherCourse = courses.find(c => c.id === otherCourseId);
        if (otherCourse && confirm(`Auch ${otherCourse.day} einschliessen?`)) {
          for (let i = startIdx; i <= endIdx; i++) {
            rangeKeys.push(`${allWeeks[i]}-${otherCourseId}`);
          }
        }
      }
    }

    set((s) => ({
      multiSelection: Array.from(new Set([...s.multiSelection, ...rangeKeys])),
      lastSelectedKey: toKey,
    }));
  },
  clearMultiSelect: () => set({ multiSelection: [], lastSelectedKey: null }),
  showHelp: false,
  toggleHelp: () => set((state) => ({ showHelp: !state.showHelp })),
  editing: null,
  setEditing: (e) => set({ editing: e }),
  weekData: [],
  setWeekData: (w) => set({ weekData: w }),
  updateLesson: (weekW, col, entry) =>
    set((state) => ({
      weekData: state.weekData.map((w) =>
        w.w === weekW
          ? { ...w, lessons: { ...w.lessons, [col]: entry } }
          : w
      ),
    })),
  insertDialog: null,
  setInsertDialog: (d) => set({ insertDialog: d }),

  // Lesson Details
  lessonDetails: {},
  updateLessonDetail: (weekW, col, detail) =>
    set((state) => {
      const key = `${weekW}-${col}`;
      const existing = state.lessonDetails[key] || {};
      return {
        lessonDetails: {
          ...state.lessonDetails,
          [key]: { ...existing, ...detail },
        },
      };
    }),
  getLessonDetail: (weekW, col) => {
    const key = `${weekW}-${col}`;
    return get().lessonDetails[key];
  },
  detailPanelExpanded: false,
  setDetailPanelExpanded: (v) => set({ detailPanelExpanded: v }),
  // Phase 1: Side panel
  sidePanelOpen: false,
  setSidePanelOpen: (v) => set({ sidePanelOpen: v }),
  sidePanelTab: 'details',
  setSidePanelTab: (t) => set({ sidePanelTab: t }),
  hoveredCell: null,
  setHoveredCell: (c) => set({ hoveredCell: c }),
  emptyCellAction: null,
  setEmptyCellAction: (a) => set({ emptyCellAction: a }),

  // Sequences CRUD
  sequences: [],
  sequencesMigrated: false,
  sequenceTitlesFixed: false,
  migrateStaticSequences: () => {
    const state = get();
    if (state.sequencesMigrated) return;
    const now = new Date().toISOString();
    const migrated: ManagedSequence[] = [];
    for (const [courseId, seqBlocks] of Object.entries(STATIC_SEQUENCES)) {
      const course = COURSES.find(c => c.id === courseId);
      const courseLabel = course ? `${course.cls} ${course.typ} ${course.day}` : courseId;
      migrated.push({
        id: `seq-${courseId}-${Date.now()}`,
        courseId,
        title: `Sequenzen ${courseLabel}`,
        blocks: seqBlocks.map(b => ({ weeks: [...b.weeks], label: b.label })),
        createdAt: now,
        updatedAt: now,
      });
    }
    set({ sequences: migrated, sequencesMigrated: true });
  },
  fixSequenceTitles: () => {
    const state = get();
    if (state.sequenceTitlesFixed) return;
    // Fix old "Sequenzen cXX" titles to use class+type+day
    const updated = state.sequences.map(seq => {
      if (/^Sequenzen c\d+$/.test(seq.title)) {
        const course = COURSES.find(c => c.id === seq.courseId);
        if (course) {
          return { ...seq, title: `Sequenzen ${course.cls} ${course.typ} ${course.day}`, updatedAt: new Date().toISOString() };
        }
      }
      return seq;
    });
    set({ sequences: updated, sequenceTitlesFixed: true });
  },
  addSequence: (seq) => {
    const now = new Date().toISOString();
    const id = `seq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newSeq: ManagedSequence = { ...seq, id, createdAt: now, updatedAt: now };
    set((state) => ({ sequences: [...state.sequences, newSeq] }));
    return id;
  },
  updateSequence: (id, updates) =>
    set((state) => ({
      sequences: state.sequences.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
      ),
    })),
  deleteSequence: (id) =>
    set((state) => ({ sequences: state.sequences.filter((s) => s.id !== id) })),
  addBlockToSequence: (seqId, block) =>
    set((state) => ({
      sequences: state.sequences.map((s) =>
        s.id === seqId
          ? { ...s, blocks: [...s.blocks, block], updatedAt: new Date().toISOString() }
          : s
      ),
    })),
  updateBlockInSequence: (seqId, blockIndex, block) =>
    set((state) => ({
      sequences: state.sequences.map((s) =>
        s.id === seqId
          ? {
              ...s,
              blocks: s.blocks.map((b, i) => (i === blockIndex ? { ...b, ...block } : b)),
              updatedAt: new Date().toISOString(),
            }
          : s
      ),
    })),
  removeBlockFromSequence: (seqId, blockIndex) =>
    set((state) => ({
      sequences: state.sequences.map((s) =>
        s.id === seqId
          ? { ...s, blocks: s.blocks.filter((_, i) => i !== blockIndex), updatedAt: new Date().toISOString() }
          : s
      ),
    })),
  reorderBlocks: (seqId, fromIndex, toIndex) =>
    set((state) => ({
      sequences: state.sequences.map((s) => {
        if (s.id !== seqId) return s;
        const blocks = [...s.blocks];
        const [moved] = blocks.splice(fromIndex, 1);
        blocks.splice(toIndex, 0, moved);
        return { ...s, blocks, updatedAt: new Date().toISOString() };
      }),
    })),
  // Auto-placement: find free weeks for a course
  getAvailableWeeks: (courseId, startWeek, allWeekOrder) => {
    const state = get();
    // Find sequence that matches this courseId (or has it in courseIds)
    const seq = state.sequences.find(s =>
      s.courseId === courseId || (s.courseIds && s.courseIds.includes(courseId))
    );
    // Get all cols to check: if multi-day, all linked cols must be free
    const allCourseIds = seq?.courseIds && seq.courseIds.length > 1 ? seq.courseIds : [courseId];
    const cols = allCourseIds.map(cid => {
      const course = COURSES.find(c => c.id === cid);
      return course ? course.col : parseInt(cid.replace('c', ''));
    }).filter(c => !isNaN(c));
    if (cols.length === 0) return [];
    
    const startIdx = allWeekOrder.indexOf(startWeek);
    if (startIdx < 0) return [];
    
    const available: string[] = [];
    for (let i = startIdx; i < allWeekOrder.length; i++) {
      const weekW = allWeekOrder[i];
      const week = state.weekData.find(w => w.w === weekW);
      if (!week) { available.push(weekW); continue; }
      // Week is available only if ALL linked cols are free
      const allFree = cols.every(col => !week.lessons[col]);
      if (allFree) {
        available.push(weekW);
      }
      // Skip: holidays (6), events (5), exams (4), and occupied lessons (1,2,3)
    }
    return available;
  },
  // Auto-place a sequence: distribute blocks across free weeks starting from startWeek
  autoPlaceSequence: (seqId, startWeek, allWeekOrder) => {
    const state = get();
    const seq = state.sequences.find(s => s.id === seqId);
    if (!seq) return { placed: 0, skipped: [] };
    
    // Get all columns to place into (multi-course support)
    const allCourseIds = seq.courseIds && seq.courseIds.length > 0 ? seq.courseIds : [seq.courseId];
    const cols = allCourseIds.map(cid => {
      const course = COURSES.find(c => c.id === cid);
      return course ? course.col : parseInt(cid.replace('c', ''));
    }).filter(c => !isNaN(c));
    if (cols.length === 0) return { placed: 0, skipped: [] };

    // Get available weeks based on primary column
    const available = state.getAvailableWeeks(seq.courseId, startWeek, allWeekOrder);
    
    // Determine LessonType from subjectArea
    const typeMap: Record<string, number> = { BWL: 1, VWL: 2, RECHT: 2, IN: 3, INTERDISZ: 0 };
    const lessonType = (seq.subjectArea ? typeMap[seq.subjectArea] : 0) as import('../types').LessonType;
    
    state.pushUndo();
    
    let weekIdx = 0;
    let placed = 0;
    const skipped: string[] = [];
    const newWeekData = state.weekData.map(w => ({ ...w, lessons: { ...w.lessons } }));
    const weekMap = new Map(newWeekData.map(w => [w.w, w]));
    const newBlocks: import('../types').SequenceBlock[] = [];
    
    for (const block of seq.blocks) {
      const blockWeeks: string[] = [];
      for (let i = 0; i < block.weeks.length; i++) {
        // Find next available week
        while (weekIdx < available.length) {
          const candidateWeek = available[weekIdx];
          weekIdx++;
          const week = weekMap.get(candidateWeek);
          if (week) {
            // Place in ALL columns (primary + linked)
            for (const col of cols) {
              week.lessons[col] = { title: block.label, type: lessonType };
            }
            blockWeeks.push(candidateWeek);
            placed++;
            break;
          } else {
            skipped.push(candidateWeek);
          }
        }
      }
      newBlocks.push({ label: block.label, weeks: blockWeeks });
    }
    
    // Update weekData and sequence blocks
    set({
      weekData: newWeekData,
      sequences: state.sequences.map(s =>
        s.id === seqId
          ? { ...s, blocks: newBlocks, updatedAt: new Date().toISOString() }
          : s
      ),
    });
    
    return { placed, skipped };
  },
  // Sequence Panel UI state
  sequencePanelOpen: false,
  setSequencePanelOpen: (v) => set({ sequencePanelOpen: v }),
  editingSequenceId: null,
  setEditingSequenceId: (id) => set({ editingSequenceId: id }),

  // HK Rotation
  hkOverrides: {},
  hkStartGroups: {},
  setHKOverride: (weekW, col, group) =>
    set((state) => {
      const key = `${weekW}-${col}`;
      const next = { ...state.hkOverrides };
      if (group === null) {
        delete next[key];
      } else {
        next[key] = group;
      }
      return { hkOverrides: next };
    }),
  setHKStartGroup: (col, group) =>
    set((state) => ({
      hkStartGroups: { ...state.hkStartGroups, [col]: group },
    })),

  // TaF Phasen
  tafPhases: [],
  addTaFPhase: (phase) => {
    const id = `taf-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    set((state) => ({ tafPhases: [...state.tafPhases, { ...phase, id }] }));
    return id;
  },
  updateTaFPhase: (id, updates) =>
    set((state) => ({
      tafPhases: state.tafPhases.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  deleteTaFPhase: (id) =>
    set((state) => ({
      tafPhases: state.tafPhases.filter((p) => p.id !== id),
    })),

  // Export / Import
  exportData: () => {
    const state = get();
    return JSON.stringify({
      version: '3.0',
      exportedAt: new Date().toISOString(),
      weekData: state.weekData,
      lessonDetails: state.lessonDetails,
      sequences: state.sequences,
      hkOverrides: state.hkOverrides,
      hkStartGroups: state.hkStartGroups,
      tafPhases: state.tafPhases,
    }, null, 2);
  },
  importData: (json: string) => {
    try {
      const data = JSON.parse(json);
      if (!data.weekData || !Array.isArray(data.weekData)) throw new Error('Invalid data');
      const state = get();
      state.pushUndo();
      set({
        weekData: data.weekData,
        lessonDetails: data.lessonDetails || {},
        sequences: data.sequences || state.sequences,
        hkOverrides: data.hkOverrides || {},
        hkStartGroups: data.hkStartGroups || {},
        tafPhases: data.tafPhases || [],
      });
      return true;
    } catch {
      return false;
    }
  },

  // Drag & Drop
  dragSource: null,
  setDragSource: (d) => set({ dragSource: d }),
  swapLessons: (col, weekA, weekB) => {
    if (weekA === weekB) return;
    const state = get();
    state.pushUndo();

    // Update sequences: swap weekA↔weekB in blocks belonging to courses with this col
    const courseId = COURSES.find(c => c.col === col)?.id;
    const updatedSeqs = state.sequences.map(seq => {
      if (courseId && seq.courseId !== courseId && !(seq.courseIds && seq.courseIds.includes(courseId))) return seq;
      let changed = false;
      const newBlocks = seq.blocks.map(b => {
        const hasA = b.weeks.includes(weekA);
        const hasB = b.weeks.includes(weekB);
        if (!hasA && !hasB) return b;
        changed = true;
        return {
          ...b,
          weeks: b.weeks.map(w => w === weekA ? weekB : w === weekB ? weekA : w),
        };
      });
      return changed ? { ...seq, blocks: newBlocks, updatedAt: new Date().toISOString() } : seq;
    });

    set({
      weekData: state.weekData.map((w) => {
        if (w.w === weekA) {
          const entryB = state.weekData.find((ww) => ww.w === weekB)?.lessons[col];
          const newLessons = { ...w.lessons };
          if (entryB) newLessons[col] = { ...entryB };
          else delete newLessons[col];
          return { ...w, lessons: newLessons };
        }
        if (w.w === weekB) {
          const entryA = state.weekData.find((ww) => ww.w === weekA)?.lessons[col];
          const newLessons = { ...w.lessons };
          if (entryA) newLessons[col] = { ...entryA };
          else delete newLessons[col];
          return { ...w, lessons: newLessons };
        }
        return w;
      }),
      sequences: updatedSeqs,
    });
  },
  moveLessonToEmpty: (col, fromWeek, toWeek) => {
    if (fromWeek === toWeek) return;
    const state = get();
    state.pushUndo();

    // Update sequences: replace fromWeek→toWeek in blocks
    const courseId = COURSES.find(c => c.col === col)?.id;
    const updatedSeqs = state.sequences.map(seq => {
      if (courseId && seq.courseId !== courseId && !(seq.courseIds && seq.courseIds.includes(courseId))) return seq;
      let changed = false;
      const newBlocks = seq.blocks.map(b => {
        if (!b.weeks.includes(fromWeek)) return b;
        changed = true;
        return { ...b, weeks: b.weeks.map(w => w === fromWeek ? toWeek : w) };
      });
      return changed ? { ...seq, blocks: newBlocks, updatedAt: new Date().toISOString() } : seq;
    });

    set({
      weekData: state.weekData.map((w) => {
        if (w.w === fromWeek) {
          const newLessons = { ...w.lessons };
          delete newLessons[col];
          return { ...w, lessons: newLessons };
        }
        if (w.w === toWeek) {
          const entry = state.weekData.find((ww) => ww.w === fromWeek)?.lessons[col];
          if (!entry) return w;
          return { ...w, lessons: { ...w.lessons, [col]: { ...entry } } };
        }
        return w;
      }),
      sequences: updatedSeqs,
    });
  },
  pushLessons: (courseCol, beforeWeekW, allWeeks) => {
    const state = get();
    state.pushUndo();
    const weekOrder = allWeeks;
    const targetIdx = weekOrder.indexOf(beforeWeekW);
    if (targetIdx < 0) return;
    const newWeekData = [...state.weekData.map((w) => ({ ...w, lessons: { ...w.lessons } }))];
    const weekMap = new Map(newWeekData.map((w) => [w.w, w]));
    const relevantWeeks = weekOrder.slice(targetIdx);

    // Collect entries, skipping fixed cells (type 5=Event, 6=Holiday)
    const fixedWeeks = new Set<string>();
    const movableEntries: (LessonEntry | null)[] = [];
    for (const wk of relevantWeeks) {
      const week = weekMap.get(wk);
      const entry = week?.lessons[courseCol] || null;
      if (entry && (entry.type === 5 || entry.type === 6)) {
        fixedWeeks.add(wk);
      } else {
        movableEntries.push(entry);
      }
    }
    // Insert null at front (push down by 1)
    movableEntries.unshift(null);

    // Place back, skipping fixed weeks
    let mi = 0;
    for (const wk of relevantWeeks) {
      if (fixedWeeks.has(wk)) continue; // leave fixed in place
      const week = weekMap.get(wk);
      if (week) {
        if (mi < movableEntries.length && movableEntries[mi]) {
          week.lessons[courseCol] = movableEntries[mi]!;
        } else {
          delete week.lessons[courseCol];
        }
      }
      mi++;
    }
    set({ weekData: newWeekData });
  },

  // Batch operations for multi-select
  batchShiftDown: (keys, allWeeks, courses) => {
    const state = get();
    state.pushUndo();
    const parsed = keys.map(k => {
      const [weekW, courseId] = k.split('-');
      const course = courses.find(c => c.id === courseId);
      return course ? { weekW, col: course.col } : null;
    }).filter(Boolean) as { weekW: string; col: number }[];
    const byCols = new Map<number, string[]>();
    for (const p of parsed) {
      const arr = byCols.get(p.col) || [];
      arr.push(p.weekW);
      byCols.set(p.col, arr);
    }
    let newWeekData = state.weekData.map(w => ({ ...w, lessons: { ...w.lessons } }));
    for (const [col, weeks] of byCols) {
      const earliest = weeks.reduce((best, w) => {
        const bi = allWeeks.indexOf(best);
        const wi = allWeeks.indexOf(w);
        return wi < bi ? w : best;
      }, weeks[0]);
      const weekMap = new Map(newWeekData.map(w => [w.w, w]));
      const targetIdx = allWeeks.indexOf(earliest);
      if (targetIdx < 0) continue;
      const relevantWeeks = allWeeks.slice(targetIdx);
      const entries: (LessonEntry | null)[] = relevantWeeks.map(wk => weekMap.get(wk)?.lessons[col] || null);
      entries.unshift(null);
      for (let i = 0; i < relevantWeeks.length; i++) {
        const wk = weekMap.get(relevantWeeks[i]);
        if (wk) {
          if (entries[i]) wk.lessons[col] = entries[i]!;
          else delete wk.lessons[col];
        }
      }
    }
    set({ weekData: newWeekData, multiSelection: [] });
  },
  batchInsertBefore: (keys, allWeeks, courses) => {
    get().batchShiftDown(keys, allWeeks, courses);
  },

  // Group drag & drop: move a group of cells in a column to a new position
  moveGroup: (col, fromWeeks, toWeek, allWeeks) => {
    const state = get();
    state.pushUndo();
    const weekMap = new Map(state.weekData.map(w => [w.w, w]));

    // Sort fromWeeks by their order in allWeeks
    const sorted = [...fromWeeks].sort((a, b) => allWeeks.indexOf(a) - allWeeks.indexOf(b));

    // Collect the entries to move
    const entries: (LessonEntry | null)[] = sorted.map(wk => weekMap.get(wk)?.lessons[col] || null);
    const details: Record<string, LessonDetail | undefined> = {};
    for (const wk of sorted) {
      details[wk] = state.lessonDetails[`${wk}-${col}`];
    }

    // Remove entries from their original positions
    let newWeekData = state.weekData.map(w => {
      if (sorted.includes(w.w)) {
        const newLessons = { ...w.lessons };
        delete newLessons[col];
        return { ...w, lessons: newLessons };
      }
      return { ...w, lessons: { ...w.lessons } };
    });

    // Find target position and insert, shifting existing content down
    const toIdx = allWeeks.indexOf(toWeek);
    if (toIdx < 0) { set({ weekData: newWeekData }); return; }

    // Collect non-fixed entries from toWeek onwards (excluding the moved entries)
    const weekMapNew = new Map(newWeekData.map(w => [w.w, w]));
    const targetWeeks = allWeeks.slice(toIdx);

    // Gather existing entries in the target range
    const existing: { week: string; entry: LessonEntry | null }[] = [];
    for (const wk of targetWeeks) {
      const w = weekMapNew.get(wk);
      const entry = w?.lessons[col] || null;
      const isFixed = entry && (entry.type === 5 || entry.type === 6);
      if (!isFixed) {
        existing.push({ week: wk, entry });
      }
    }

    // Build new order: moved entries first, then existing non-null entries
    const movedEntries = entries.filter(e => e !== null) as LessonEntry[];
    const existingEntries = existing.filter(e => e.entry !== null).map(e => e.entry!);
    const allEntries = [...movedEntries, ...existingEntries];

    // Place back into non-fixed slots from toIdx
    let entryIdx = 0;
    for (const wk of targetWeeks) {
      const w = weekMapNew.get(wk);
      if (!w) continue;
      const curEntry = w.lessons[col];
      const isFixed = curEntry && (curEntry.type === 5 || curEntry.type === 6);
      if (isFixed) continue;

      if (entryIdx < allEntries.length) {
        w.lessons[col] = allEntries[entryIdx];
        entryIdx++;
      } else {
        delete w.lessons[col];
      }
    }

    // Update sequences: remap weeks for blocks in this column
    const courseId = COURSES.find(c => c.col === col)?.id;
    const updatedSeqs = state.sequences.map(seq => {
      if (courseId && seq.courseId !== courseId && !(seq.courseIds && seq.courseIds.includes(courseId))) return seq;
      // Rebuild week mapping based on new positions
      let changed = false;
      const newBlocks = seq.blocks.map(b => {
        const hasMovedWeek = b.weeks.some(w => sorted.includes(w));
        if (!hasMovedWeek) return b;
        changed = true;
        // For moved weeks, find their new positions
        return b; // Sequence tracking for group moves is complex — keep blocks as-is for now
      });
      return changed ? { ...seq, blocks: newBlocks, updatedAt: new Date().toISOString() } : seq;
    });

    set({ weekData: newWeekData.map(w => weekMapNew.get(w.w) || w), sequences: updatedSeqs, multiSelection: [] });
  },

  undoStack: [],
  pushUndo: () =>
    set((state) => ({
      undoStack: [
        ...state.undoStack.slice(-9),
        state.weekData.map((w) => ({ ...w, lessons: { ...w.lessons } })),
      ],
    })),
  undo: () =>
    set((state) => {
      if (state.undoStack.length === 0) return state;
      const prev = state.undoStack[state.undoStack.length - 1];
      return {
        weekData: prev,
        undoStack: state.undoStack.slice(0, -1),
      };
    }),
    }),
    {
      name: 'unterrichtsplaner-storage',
      version: 2,
      partialize: (state) => ({
        weekData: state.weekData,
        lessonDetails: state.lessonDetails,
        sequences: state.sequences,
        sequencesMigrated: state.sequencesMigrated,
        sequenceTitlesFixed: state.sequenceTitlesFixed,
        hkOverrides: state.hkOverrides,
        hkStartGroups: state.hkStartGroups,
        tafPhases: state.tafPhases,
      }),
      migrate: (persisted: unknown, version: number) => {
        if (version < 2) {
          return { ...(persisted as Record<string, unknown>), sequences: [], sequencesMigrated: false, sequenceTitlesFixed: false };
        }
        return persisted;
      },
    }
  )
);
