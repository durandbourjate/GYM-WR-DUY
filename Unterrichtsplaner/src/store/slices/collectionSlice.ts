import type { StateCreator } from 'zustand';
import type { PlannerState } from '../plannerStore';
import type { LessonDetail, CollectionItem, CollectionUnit, SequenceBlock } from '../../types';
import { COURSES } from '../../data/courses';

// === CollectionSlice Interface ===

export interface CollectionSlice {
  collection: CollectionItem[];
  addCollectionItem: (item: Omit<CollectionItem, 'id' | 'createdAt'>) => string;
  updateCollectionItem: (id: string, updates: Partial<Pick<CollectionItem, 'title' | 'tags' | 'notes' | 'subjectArea'>>) => void;
  deleteCollectionItem: (id: string) => void;
  archiveBlock: (seqId: string, blockIndex: number, schoolYear?: string) => string;
  archiveSequence: (seqId: string, schoolYear?: string) => string;
  archiveSchoolYear: (courseType: string, cls: string, schoolYear: string) => string;
  archiveCurriculum: (courseType: string, cls: string, schoolYear: string, gymYears: string) => string;
  importFromCollection: (itemId: string, targetCourseId: string, options: { includeNotes: boolean; includeMaterialLinks: boolean }) => string | null;
}

// === CollectionSlice Implementation ===

export const createCollectionSlice: StateCreator<PlannerState, [], [], CollectionSlice> = (set, get) => ({
  // === Collection (Materialsammlung) ===
  collection: [],

  addCollectionItem: (item) => {
    const id = crypto.randomUUID();
    set((state) => ({
      collection: [...state.collection, { ...item, id, createdAt: new Date().toISOString() }],
    }));
    return id;
  },

  updateCollectionItem: (id, updates) =>
    set((state) => ({
      collection: state.collection.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  deleteCollectionItem: (id) =>
    set((state) => ({
      collection: state.collection.filter((c) => c.id !== id),
    })),

  // Archive a single block as CollectionUnit
  archiveBlock: (seqId, blockIndex, schoolYear) => {
    const state = get();
    const seq = state.sequences.find((s) => s.id === seqId);
    if (!seq || !seq.blocks[blockIndex]) return '';
    const block = seq.blocks[blockIndex];
    const course = COURSES.find((c) => c.id === seq.courseId);

    // Snapshot lesson details for this block's weeks
    const lessonDetails: Record<string, LessonDetail> = {};
    const lessonTitles: string[] = [];
    block.weeks.forEach((w, i) => {
      const col = course?.col;
      if (col !== undefined) {
        const key = `${w}-${col}`;
        if (state.lessonDetails[key]) lessonDetails[String(i)] = { ...state.lessonDetails[key] };
        const weekData = state.weekData.find((wd) => wd.w === w);
        lessonTitles.push(weekData?.lessons[col]?.title || '');
      }
    });

    const unit: CollectionUnit = {
      block: { ...block, weeks: [] }, // Strip weeks
      lessonDetails,
      lessonTitles,
    };

    return get().addCollectionItem({
      type: 'unit',
      title: block.label || seq.title,
      subjectArea: block.subjectArea || seq.subjectArea,
      courseType: course?.typ,
      cls: course?.cls,
      schoolYear,
      sequenceTitle: seq.title,
      sequenceColor: seq.color,
      units: [unit],
    });
  },

  // Archive entire ManagedSequence (all blocks)
  archiveSequence: (seqId, schoolYear) => {
    const state = get();
    const seq = state.sequences.find((s) => s.id === seqId);
    if (!seq) return '';
    const course = COURSES.find((c) => c.id === seq.courseId);

    const units: CollectionUnit[] = seq.blocks.map((block) => {
      const lessonDetails: Record<string, LessonDetail> = {};
      const lessonTitles: string[] = [];
      block.weeks.forEach((w, i) => {
        const col = course?.col;
        if (col !== undefined) {
          const key = `${w}-${col}`;
          if (state.lessonDetails[key]) lessonDetails[String(i)] = { ...state.lessonDetails[key] };
          const weekData = state.weekData.find((wd) => wd.w === w);
          lessonTitles.push(weekData?.lessons[col]?.title || '');
        }
      });
      return { block: { ...block, weeks: [] }, lessonDetails, lessonTitles };
    });

    return get().addCollectionItem({
      type: 'sequence',
      title: seq.title,
      subjectArea: seq.subjectArea,
      courseType: course?.typ,
      cls: course?.cls,
      schoolYear,
      sequenceTitle: seq.title,
      sequenceColor: seq.color,
      units,
    });
  },

  // Archive all sequences for a course type + class in a school year
  archiveSchoolYear: (courseType, cls, schoolYear) => {
    const state = get();
    const matchingCourses = COURSES.filter((c) => c.typ === courseType && c.cls === cls);
    const courseIds = new Set(matchingCourses.map((c) => c.id));
    const matchingSeqs = state.sequences.filter((s) => courseIds.has(s.courseId));

    const units: CollectionUnit[] = [];
    let sa: string | undefined;
    matchingSeqs.forEach((seq) => {
      if (seq.subjectArea && !sa) sa = seq.subjectArea;
      const course = COURSES.find((c) => c.id === seq.courseId);
      seq.blocks.forEach((block) => {
        const lessonDetails: Record<string, LessonDetail> = {};
        const lessonTitles: string[] = [];
        block.weeks.forEach((w, i) => {
          const col = course?.col;
          if (col !== undefined) {
            const key = `${w}-${col}`;
            if (state.lessonDetails[key]) lessonDetails[String(i)] = { ...state.lessonDetails[key] };
            const weekData = state.weekData.find((wd) => wd.w === w);
            lessonTitles.push(weekData?.lessons[col]?.title || '');
          }
        });
        units.push({ block: { ...block, weeks: [] }, lessonDetails, lessonTitles });
      });
    });

    return get().addCollectionItem({
      type: 'schoolyear',
      title: `${courseType} ${cls} – SJ ${schoolYear}`,
      courseType: courseType as any,
      cls,
      schoolYear,
      units,
    });
  },

  // Archive entire curriculum (multi-year)
  archiveCurriculum: (courseType, cls, schoolYear, gymYears) => {
    const state = get();
    // Same as schoolYear but with gymYears metadata
    const matchingCourses = COURSES.filter((c) => c.typ === courseType && c.cls === cls);
    const courseIds = new Set(matchingCourses.map((c) => c.id));
    const matchingSeqs = state.sequences.filter((s) => courseIds.has(s.courseId));

    const units: CollectionUnit[] = [];
    matchingSeqs.forEach((seq) => {
      const course = COURSES.find((c) => c.id === seq.courseId);
      seq.blocks.forEach((block) => {
        const lessonDetails: Record<string, LessonDetail> = {};
        const lessonTitles: string[] = [];
        block.weeks.forEach((w, i) => {
          const col = course?.col;
          if (col !== undefined) {
            const key = `${w}-${col}`;
            if (state.lessonDetails[key]) lessonDetails[String(i)] = { ...state.lessonDetails[key] };
            const weekData = state.weekData.find((wd) => wd.w === w);
            lessonTitles.push(weekData?.lessons[col]?.title || '');
          }
        });
        units.push({ block: { ...block, weeks: [] }, lessonDetails, lessonTitles });
      });
    });

    return get().addCollectionItem({
      type: 'curriculum',
      title: `${courseType} ${cls} – ${gymYears}`,
      courseType: courseType as any,
      cls,
      schoolYear,
      gymYears,
      units,
    });
  },

  // Import from collection → create new sequence
  importFromCollection: (itemId, targetCourseId, options) => {
    const state = get();
    const item = state.collection.find((c) => c.id === itemId);
    if (!item || item.units.length === 0) return null;
    const course = COURSES.find((c) => c.id === targetCourseId);
    if (!course) return null;

    // Create blocks from units (without weeks — user assigns manually)
    const blocks: SequenceBlock[] = item.units.map((u) => ({
      ...u.block,
      weeks: [], // Must be assigned by user
      materialLinks: options.includeMaterialLinks ? u.block.materialLinks : undefined,
    }));

    // Create the sequence
    const seqId = get().addSequence({
      courseId: targetCourseId,
      title: item.title,
      subjectArea: item.subjectArea,
      blocks,
      color: item.sequenceColor,
    });

    // Optionally import lesson detail snapshots (stored for later when weeks are assigned)
    // Note: Since weeks aren't assigned yet, we store the details in notes
    if (options.includeNotes) {
      item.units.forEach((u) => {
        const detailNotes = Object.entries(u.lessonDetails)
          .filter(([, d]) => d.notes)
          .map(([idx, d]) => `[${u.lessonTitles[Number(idx)] || `L${idx}`}] ${d.notes}`)
          .join('\n');
        if (detailNotes && u.block.description === undefined) {
          // Append to block description as reference
          const blockIdx = item.units.indexOf(u);
          get().updateBlockInSequence(seqId, blockIdx, {
            description: (u.block.description || '') + (detailNotes ? '\n--- Notizen (Import) ---\n' + detailNotes : ''),
          });
        }
      });
    }

    return seqId;
  },
});
