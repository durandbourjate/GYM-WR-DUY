import { create } from 'zustand';
import type { Course, FilterType, Week, LessonEntry } from '../types';

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
  // Filter
  filter: FilterType;
  setFilter: (f: FilterType) => void;

  // Selection
  selection: Selection | null;
  setSelection: (s: Selection | null) => void;

  // Multi-select
  multiSelection: string[];
  toggleMultiSelect: (key: string) => void;
  clearMultiSelect: () => void;

  // Help
  showHelp: boolean;
  toggleHelp: () => void;

  // Inline editing
  editing: EditingCell | null;
  setEditing: (e: EditingCell | null) => void;

  // Week data (mutable copy for editing)
  weekData: Week[];
  setWeekData: (w: Week[]) => void;
  updateLesson: (weekW: string, col: number, entry: LessonEntry) => void;

  // Insert dialog
  insertDialog: InsertDialog | null;
  setInsertDialog: (d: InsertDialog | null) => void;

  // Push: insert empty slot and shift following lessons
  pushLessons: (courseCol: number, beforeWeekW: string, allWeeks: string[]) => void;

  // Undo stack
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

  pushLessons: (courseCol, beforeWeekW, allWeeks) => {
    const state = get();
    // Save undo
    state.pushUndo();

    const weekOrder = allWeeks;
    const targetIdx = weekOrder.indexOf(beforeWeekW);
    if (targetIdx < 0) return;

    // Get all weeks from target to end that have content for this course
    const newWeekData = [...state.weekData.map((w) => ({ ...w, lessons: { ...w.lessons } }))];

    // Collect lessons to shift (from end backwards to avoid overwriting)
    // Find all weeks at or after target that have content
    const weekMap = new Map(newWeekData.map((w) => [w.w, w]));

    // Work backwards: move each lesson to the next available slot
    const relevantWeeks = weekOrder.slice(targetIdx);
    const entries: (LessonEntry | null)[] = relevantWeeks.map((wk) => {
      const week = weekMap.get(wk);
      return week?.lessons[courseCol] || null;
    });

    // Shift: insert null at position 0, pop last
    entries.unshift(null); // empty slot at target
    // Last entry gets dropped (or we could warn)

    // Write back
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
        ...state.undoStack.slice(-9), // keep last 10
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
