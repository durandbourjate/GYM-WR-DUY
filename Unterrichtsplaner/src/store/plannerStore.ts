import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterType, Week, LessonEntry, Course, LessonDetail, ManagedSequence, SequenceBlock, HKGroup, TaFPhase, CollectionItem } from '../types';
import { INITIAL_LESSON_DETAILS } from '../data/initialLessonDetails';
import { instanceStorageKey } from './instanceStore';
import type { PlannerSettings } from './settingsStore';
import { createUISlice, type Selection, type EditingCell, type InsertDialog } from './slices/uiSlice';
import { createCollectionSlice } from './slices/collectionSlice';
import { createSequenceSlice } from './slices/sequenceSlice';
import { createDataSlice } from './slices/dataSlice';

// v3.91 N3: Zoom-Stufen für Spaltenbreite und Schriftgrösse
export const ZOOM_LEVELS = [
  { colWidth: 120, fontSize: 9 },   // Stufe 1 (min)
  { colWidth: 160, fontSize: 10 },  // Stufe 2
  { colWidth: 200, fontSize: 11 },  // Stufe 3 (default)
  { colWidth: 260, fontSize: 12 },  // Stufe 4
  { colWidth: 340, fontSize: 14 },  // Stufe 5 (max)
] as const;

/** Zoom-Scale Helper: skaliert einen Pixel-Basiswert proportional zur Zoom-Stufe.
 *  Referenz = Stufe 3 (fontSize 11). Bei Stufe 1 ~18% kleiner, Stufe 5 ~27% grösser. */
export function zs(base: number, zoomCfg: typeof ZOOM_LEVELS[number]): number {
  return Math.round(base * zoomCfg.fontSize / 11);
}

export interface PlannerState {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  classFilter: string | null;
  setClassFilter: (c: string | null) => void;
  courseFilter: string | null;
  setCourseFilter: (c: string | null) => void;
  zoomLevel: 1 | 2 | 3;
  setZoomLevel: (z: 1 | 2 | 3) => void;
  autoFitZoom: boolean;
  setAutoFitZoom: (v: boolean) => void;
  columnZoom: number; // 0-4 index into ZOOM_LEVELS
  setColumnZoom: (z: number) => void;
  dimPastWeeks: boolean;
  setDimPastWeeks: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selection: Selection | null;
  setSelection: (s: Selection | null) => void;
  multiSelection: string[];
  lastSelectedKey: string | null;
  toggleMultiSelect: (key: string) => void;
  setMultiSelectionDirect: (keys: string[]) => void;
  selectRange: (toKey: string, allWeeks: string[], courses: Course[], crossDay?: boolean) => void;
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
  // v3.82 E4: Cross-column move
  moveLessonToColumn: (fromCol: number, fromWeek: string, toCol: number, toWeek: string) => void;
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
  sidePanelTab: 'details' | 'sequences' | 'collection' | 'settings';
  setSidePanelTab: (t: 'details' | 'sequences' | 'collection' | 'settings') => void;
  // G6: Doppelklick auf KW → Ferien-Dialog vorausgefüllt
  pendingHolidayKw: string | null;
  setPendingHolidayKw: (kw: string | null) => void;
  hoveredCell: { week: string; col: number } | null;
  setHoveredCell: (c: { week: string; col: number } | null) => void;
  // Empty cell action (double-click or drag-select context menu)
  emptyCellAction: { week: string; courseId: string; course: Course; selectedWeeks?: string[] } | null;
  setEmptyCellAction: (a: { week: string; courseId: string; course: Course; selectedWeeks?: string[] } | null) => void;
  // Drag selection on empty cells
  dragSelectAnchor: { week: string; col: number; courseId: string } | null;
  dragSelectCurrent: { week: string; col: number } | null;
  dragSelectedKeys: string[]; // "week-col" keys
  setDragSelectAnchor: (a: { week: string; col: number; courseId: string } | null) => void;
  setDragSelectCurrent: (c: { week: string; col: number } | null) => void;
  setDragSelectedKeys: (keys: string[]) => void;
  // Sequences CRUD
  sequences: ManagedSequence[];
  sequencesMigrated: boolean;
  sequenceTitlesFixed: boolean;
  migrateStaticSequences: () => void;
  fixSequenceTitles: () => void;
  addSequence: (seq: Omit<ManagedSequence, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateSequence: (id: string, updates: Partial<Pick<ManagedSequence, 'title' | 'subjectArea' | 'blocks' | 'color' | 'courseId' | 'courseIds' | 'multiDayMode' | 'links' | 'notes' | 'sol'>>) => void;
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
  // Collection (Materialsammlung)
  collection: CollectionItem[];
  addCollectionItem: (item: Omit<CollectionItem, 'id' | 'createdAt'>) => string;
  updateCollectionItem: (id: string, updates: Partial<Pick<CollectionItem, 'title' | 'tags' | 'notes' | 'subjectArea'>>) => void;
  deleteCollectionItem: (id: string) => void;
  archiveBlock: (seqId: string, blockIndex: number, schoolYear?: string) => string;
  archiveSequence: (seqId: string, schoolYear?: string) => string;
  archiveSchoolYear: (courseType: string, cls: string, schoolYear: string) => string;
  archiveCurriculum: (courseType: string, cls: string, schoolYear: string, gymYears: string) => string;
  importFromCollection: (itemId: string, targetCourseId: string, options: { includeNotes: boolean; includeMaterialLinks: boolean }) => string | null;
  // Undo
  undoStack: Week[][];
  pushUndo: () => void;
  undo: () => void;
  // Planner Settings (per-instance: courses, holidays, special weeks)
  plannerSettings: PlannerSettings | null;
  setPlannerSettings: (s: PlannerSettings) => void;
  // Settings UI
  settingsOpen: boolean;
  setSettingsOpen: (v: boolean) => void;
  settingsEditCourseId: string | null;
  setSettingsEditCourseId: (id: string | null) => void;
  panelWidth: number;
  setPanelWidth: (w: number) => void;
  // Note column expansion (per course column)
  expandedNoteCols: Record<string, boolean>; // course IDs with expanded note columns
  toggleNoteCol: (courseId: string) => void;
  noteColWidth: number; // shared width for all note columns
  setNoteColWidth: (w: number) => void;
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (...a) => ({
  ...createUISlice(...a),
  ...createCollectionSlice(...a),
  ...createDataSlice(...a),
  ...createSequenceSlice(...a),
  }),
    {
      name: 'unterrichtsplaner-storage',
      version: 3,
      partialize: (state) => ({
        weekData: state.weekData,
        lessonDetails: state.lessonDetails,
        sequences: state.sequences,
        sequencesMigrated: state.sequencesMigrated,
        sequenceTitlesFixed: state.sequenceTitlesFixed,
        hkOverrides: state.hkOverrides,
        hkStartGroups: state.hkStartGroups,
        tafPhases: state.tafPhases,
        collection: state.collection,
        plannerSettings: state.plannerSettings,
      }),
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          return { ...state, sequences: [], sequencesMigrated: false, sequenceTitlesFixed: false };
        }
        if (version < 3) {
          // Merge initial lesson details (from Excel) without overwriting user edits
          const existing = (state.lessonDetails || {}) as Record<string, unknown>;
          const merged = { ...INITIAL_LESSON_DETAILS };
          // User edits take precedence
          for (const [key, val] of Object.entries(existing)) {
            if (val && typeof val === 'object') {
              merged[key] = { ...(merged[key] || {}), ...val } as typeof merged[string];
            }
          }
          return { ...state, lessonDetails: merged };
        }
        return persisted;
      },
    }
  )
);

// === Multi-Planner Instance Switching ===

/** Extract persistable state from current store */
function extractPersistedState(): Record<string, unknown> {
  const state = usePlannerStore.getState();
  return {
    weekData: state.weekData,
    lessonDetails: state.lessonDetails,
    sequences: state.sequences,
    sequencesMigrated: state.sequencesMigrated,
    sequenceTitlesFixed: state.sequenceTitlesFixed,
    hkOverrides: state.hkOverrides,
    hkStartGroups: state.hkStartGroups,
    tafPhases: state.tafPhases,
    collection: state.collection,
    plannerSettings: state.plannerSettings,
  };
}

/** Save current store state to a specific instance slot */
export function saveToInstance(instanceId: string): void {
  const data = extractPersistedState();
  const wrapped = { state: data, version: 3 };
  localStorage.setItem(instanceStorageKey(instanceId), JSON.stringify(wrapped));
}

/** Load an instance's data into the store (replaces current state) */
export function loadFromInstance(instanceId: string): void {
  const raw = localStorage.getItem(instanceStorageKey(instanceId));
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const data = parsed.state || parsed;
      const isNew = !!data.plannerSettings;
      usePlannerStore.setState({
        weekData: data.weekData || [],
        lessonDetails: data.lessonDetails || {},
        sequences: data.sequences || [],
        sequencesMigrated: data.sequencesMigrated ?? isNew,
        sequenceTitlesFixed: data.sequenceTitlesFixed ?? isNew,
        hkOverrides: data.hkOverrides || {},
        hkStartGroups: data.hkStartGroups || {},
        tafPhases: data.tafPhases || [],
        collection: data.collection || [],
        plannerSettings: data.plannerSettings || null,
        // Reset ALL UI & transient state on switch
        selection: null,
        editing: null,
        insertDialog: null,
        dragSource: null,
        multiSelection: [],
        lastSelectedKey: null,
        undoStack: [],
        editingSequenceId: null,
        emptyCellAction: null,
        dragSelectAnchor: null,
        dragSelectCurrent: null,
        dragSelectedKeys: [],
        hoveredCell: null,
        searchQuery: '',
        courseFilter: null,
        classFilter: null,
        settingsEditCourseId: null,
      });
    } catch (e) {
      console.error('Failed to load instance:', e);
      resetToEmpty();
    }
  } else {
    resetToEmpty();
  }
}

/** Reset store to empty state (new planner) */
export function resetToEmpty(): void {
  usePlannerStore.setState({
    weekData: [],
    lessonDetails: {},
    sequences: [],
    sequencesMigrated: true,
    sequenceTitlesFixed: true,
    hkOverrides: {},
    hkStartGroups: {},
    tafPhases: [],
    collection: [],
    plannerSettings: null,
    selection: null,
    editing: null,
    insertDialog: null,
    dragSource: null,
    multiSelection: [],
  });
}

/** Switch from one instance to another (save current, load new) */
export function switchInstance(fromId: string | null, toId: string): void {
  if (fromId) {
    saveToInstance(fromId);
  }
  loadFromInstance(toId);
}

/** Export instance data as JSON string */
export function exportInstanceData(instanceId: string): string | null {
  // If this is the currently active instance, save first
  const currentData = extractPersistedState();
  const raw = localStorage.getItem(instanceStorageKey(instanceId));
  const data = raw ? JSON.parse(raw)?.state || JSON.parse(raw) : currentData;
  return JSON.stringify(data, null, 2);
}
