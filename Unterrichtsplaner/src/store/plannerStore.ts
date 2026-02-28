import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterType, Week, LessonEntry, Course, LessonDetail, ManagedSequence, SequenceBlock } from '../types';
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
  // Sequence Panel UI state
  sequencePanelOpen: boolean;
  setSequencePanelOpen: (v: boolean) => void;
  editingSequenceId: string | null;
  setEditingSequenceId: (id: string | null) => void;
  // Export / Import
  exportData: () => string;
  importData: (json: string) => boolean;
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
  // Sequence Panel UI state
  sequencePanelOpen: false,
  setSequencePanelOpen: (v) => set({ sequencePanelOpen: v }),
  editingSequenceId: null,
  setEditingSequenceId: (id) => set({ editingSequenceId: id }),

  // Export / Import
  exportData: () => {
    const state = get();
    return JSON.stringify({
      version: '2.0',
      exportedAt: new Date().toISOString(),
      weekData: state.weekData,
      lessonDetails: state.lessonDetails,
      sequences: state.sequences,
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
