import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterType, Week, LessonEntry, Course, LessonDetail, ManagedSequence, SequenceBlock, HKGroup, TaFPhase } from '../types';
import { SEQUENCES as STATIC_SEQUENCES } from '../data/sequences';

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
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selection: Selection | null;
  setSelection: (s: Selection | null) => void;
  multiSelection: string[];
  toggleMultiSelect: (key: string) => void;
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
  migrateStaticSequences: () => void;
  addSequence: (seq: Omit<ManagedSequence, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateSequence: (id: string, updates: Partial<Pick<ManagedSequence, 'title' | 'subjectArea' | 'blocks' | 'color' | 'courseId'>>) => void;
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
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  selection: null,
  setSelection: (s) => set({ selection: s }),
  multiSelection: [],
  toggleMultiSelect: (key) =>
    set((state) => ({
      multiSelection: state.multiSelection.includes(key)
        ? state.multiSelection.filter((k) => k !== key)
        : [...state.multiSelection, key],
    })),
  clearMultiSelect: () => set({ multiSelection: [] }),
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
  migrateStaticSequences: () => {
    const state = get();
    if (state.sequencesMigrated) return;
    const now = new Date().toISOString();
    const migrated: ManagedSequence[] = [];
    for (const [courseId, seqBlocks] of Object.entries(STATIC_SEQUENCES)) {
      migrated.push({
        id: `seq-${courseId}-${Date.now()}`,
        courseId,
        title: `Sequenzen ${courseId}`,
        blocks: seqBlocks.map(b => ({ weeks: [...b.weeks], label: b.label })),
        createdAt: now,
        updatedAt: now,
      });
    }
    set({ sequences: migrated, sequencesMigrated: true });
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
    const seq = state.sequences.find(s => s.courseId === courseId);
    if (!seq) return [];
    // We need the col - find it from COURSES imported indirectly through weekData
    // Actually we work with courseId which maps to col via COURSES
    // For now, we need to extract col from the courseId (e.g. "c17" -> col 17)
    const col = parseInt(courseId.replace('c', ''));
    if (isNaN(col)) return [];
    
    const startIdx = allWeekOrder.indexOf(startWeek);
    if (startIdx < 0) return [];
    
    const available: string[] = [];
    for (let i = startIdx; i < allWeekOrder.length; i++) {
      const weekW = allWeekOrder[i];
      const week = state.weekData.find(w => w.w === weekW);
      if (!week) { available.push(weekW); continue; }
      const lesson = week.lessons[col];
      // Free = no lesson, or type 0 (other) with empty-ish title
      if (!lesson) {
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
    
    const col = parseInt(seq.courseId.replace('c', ''));
    if (isNaN(col)) return { placed: 0, skipped: [] };
    
    // Get available weeks
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
            week.lessons[col] = { title: block.label, type: lessonType };
            blockWeeks.push(candidateWeek);
            placed++;
            break;
          } else {
            // Week exists in order but not in weekData – skip
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
    });
  },
  moveLessonToEmpty: (col, fromWeek, toWeek) => {
    if (fromWeek === toWeek) return;
    const state = get();
    state.pushUndo();
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
    const entries: (LessonEntry | null)[] = relevantWeeks.map((wk) => {
      const week = weekMap.get(wk);
      return week?.lessons[courseCol] || null;
    });
    entries.unshift(null);
    for (let i = 0; i < relevantWeeks.length; i++) {
      const wk = weekMap.get(relevantWeeks[i]);
      if (wk) {
        if (entries[i]) {
          wk.lessons[courseCol] = entries[i]!;
        } else {
          delete wk.lessons[courseCol];
        }
      }
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
        hkOverrides: state.hkOverrides,
        hkStartGroups: state.hkStartGroups,
        tafPhases: state.tafPhases,
      }),
      migrate: (persisted: unknown, version: number) => {
        if (version < 2) {
          return { ...(persisted as Record<string, unknown>), sequences: [], sequencesMigrated: false };
        }
        return persisted;
      },
    }
  )
);
