import { create } from 'zustand';
import type { FilterType, Week, LessonEntry, Course, LessonDetail } from '../types';

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
  // Lesson Details
  lessonDetails: Record<string, LessonDetail>; // key: "weekW-col"
  updateLessonDetail: (weekW: string, col: number, detail: Partial<LessonDetail>) => void;
  getLessonDetail: (weekW: string, col: number) => LessonDetail | undefined;
  // Detail Panel state
  detailPanelExpanded: boolean;
  setDetailPanelExpanded: (v: boolean) => void;
  undoStack: Week[][];
  pushUndo: () => void;
  undo: () => void;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  filter: 'ALL',
  setFilter: (f) => set({ filter: f }),
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
}));
