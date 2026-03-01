import { useState, useEffect } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { usePlannerData } from '../hooks/usePlannerData';
import { SUBJECT_AREA_COLORS } from '../utils/colors';
import type { Course, SubjectArea, SequenceBlock } from '../types';

const SUBJECT_AREAS: { key: SubjectArea; label: string; color: string }[] = [
  { key: 'BWL', label: 'BWL', color: '#3b82f6' },
  { key: 'VWL', label: 'VWL', color: '#f97316' },
  { key: 'RECHT', label: 'Recht', color: '#22c55e' },
  { key: 'IN', label: 'Informatik', color: '#6b7280' },
  { key: 'INTERDISZ', label: 'Interdisziplinär', color: '#a855f7' },
];


// === Flat Block Card (new flat view) ===
type FlatBlockInfo = {
  seqId: string;
  seqTitle: string;
  seqColor?: string;
  seqSubjectArea?: SubjectArea;
  block: SequenceBlock;
  blockIndex: number;
  totalBlocks: number;
  courseId: string;
  courseIds?: string[];
  cls: string;
  typ: string;
};

function FlatBlockCard({ fb }: { fb: FlatBlockInfo }) {
  const {
    editingSequenceId, setEditingSequenceId,
    updateBlockInSequence, removeBlockFromSequence,
    sequences, updateSequence,
  } = usePlannerStore();
  const { courses: COURSES } = usePlannerData();
  const [showFields, setShowFields] = useState(false);
  const [showLessons, setShowLessons] = useState(false);
  const [showSeriesFields, setShowSeriesFields] = useState(false);

  // When card becomes active (after re-mount from group change), auto-open fields
  const blockKey = `${fb.seqId}-${fb.blockIndex}`;
  const isActive = editingSequenceId === blockKey;

  // Re-open fields section when component re-mounts while still active
  // (happens when subjectArea change causes group re-assignment)
  useEffect(() => {
    if (isActive && !showFields) setShowFields(true);
  }, []); // only on mount

  const block = fb.block;
  const sa = block.subjectArea || fb.seqSubjectArea;
  const blockColor = sa ? SUBJECT_AREA_COLORS[sa]?.bg : fb.seqColor;
  const kwRange = block.weeks.length > 0
    ? `KW ${block.weeks[0]}–${block.weeks[block.weeks.length - 1]}`
    : '—';

  // Navigate to first lesson in planner
  const navigateToBlock = () => {
    if (block.weeks.length === 0) return;
    const course = COURSES.find(c => c.id === fb.courseId);
    if (!course) return;
    const row = document.querySelector(`tr[data-week="${block.weeks[0]}"]`);
    if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    usePlannerStore.getState().setSelection({
      week: block.weeks[0], courseId: course.id, title: block.label, course,
    });
  };

  // Get parent sequence for series-level editing
  const parentSeq = sequences.find(s => s.id === fb.seqId);

  return (
    <div className="border rounded-lg overflow-hidden transition-colors"
      style={{
        borderColor: isActive ? (blockColor || '#475569') : '#334155',
        background: isActive ? (blockColor ? blockColor + '08' : '#1a2035') : 'transparent',
      }}>
      {/* Compact header — always visible */}
      <div className="px-2 py-1.5 flex items-center gap-1.5 cursor-pointer hover:bg-slate-800/30"
        onClick={() => {
          const willActivate = !isActive;
          setEditingSequenceId(willActivate ? blockKey : null);
          if (willActivate) navigateToBlock();
        }}>
        <div className="w-1 h-5 rounded-full shrink-0" style={{ background: blockColor || fb.seqColor || '#16a34a' }} />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold text-gray-200 truncate">{block.label}</div>
          <div className="text-[8px] text-gray-500 flex items-center gap-1.5">
            <span className="font-mono">{kwRange}</span>
            <span>· {block.weeks.length}W</span>
            {sa && <span style={{ color: SUBJECT_AREA_COLORS[sa]?.fg }}>{sa}</span>}
            <span className="text-gray-600">· {fb.seqTitle}</span>
          </div>
        </div>
        <span className="text-[9px] text-gray-500">{isActive ? '▾' : '▸'}</span>
      </div>

      {/* Expanded content */}
      {isActive && (
        <div className="px-2 pb-2 pt-0.5 border-t border-slate-700/50 space-y-1.5">
          {/* Quick actions + tab-style toggles */}
          <div className="flex gap-0.5 items-center">
            <button onClick={navigateToBlock} className="text-[8px] text-blue-400 hover:text-blue-300 cursor-pointer px-1.5 py-0.5">↗ Im Planer</button>
            <span className="text-slate-700 mx-0.5">│</span>
            <button onClick={() => setShowFields(!showFields)}
              className={`text-[8px] cursor-pointer px-1.5 py-0.5 rounded-t border-b-2 transition-colors ${showFields ? 'text-gray-200 bg-slate-800/50 border-blue-400 font-medium' : 'text-gray-500 hover:text-gray-300 border-transparent'}`}>
              Felder
            </button>
            <button onClick={() => setShowLessons(!showLessons)}
              className={`text-[8px] cursor-pointer px-1.5 py-0.5 rounded-t border-b-2 transition-colors ${showLessons ? 'text-gray-200 bg-slate-800/50 border-blue-400 font-medium' : 'text-gray-500 hover:text-gray-300 border-transparent'}`}>
              Lektionen ({block.weeks.length})
            </button>
            <button onClick={() => setShowSeriesFields(!showSeriesFields)}
              className={`text-[8px] cursor-pointer px-1.5 py-0.5 rounded-t border-b-2 transition-colors ml-auto ${showSeriesFields ? 'text-amber-300 bg-amber-900/20 border-amber-400 font-medium' : 'text-amber-600 hover:text-amber-400 border-transparent'}`}>
              Reihe
            </button>
          </div>

          {/* Block-level fields */}
          {showFields && (
            <div className="space-y-1.5 p-1.5 bg-slate-800/30 rounded">
              <div className="flex gap-1 flex-wrap">
                <span className="text-[8px] text-gray-500 w-full">Fachbereich:</span>
                {SUBJECT_AREAS.map((s) => (
                  <button key={s.key} onClick={() => updateBlockInSequence(fb.seqId, fb.blockIndex, {
                    subjectArea: block.subjectArea === s.key ? undefined : s.key as SubjectArea
                  })}
                    className="px-1.5 py-0.5 rounded text-[8px] font-medium border cursor-pointer"
                    style={{
                      background: block.subjectArea === s.key ? s.color + '30' : 'transparent',
                      borderColor: block.subjectArea === s.key ? s.color : '#374151',
                      color: block.subjectArea === s.key ? '#e5e7eb' : '#6b7280',
                    }}>
                    {s.label}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-[8px] text-gray-500">Oberthema</label>
                <input value={block.topicMain || ''} onChange={(e) => updateBlockInSequence(fb.seqId, fb.blockIndex, { topicMain: e.target.value || undefined })}
                  className="w-full bg-slate-700/50 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-[8px] text-gray-500">Unterthema</label>
                <input value={block.topicSub || ''} onChange={(e) => updateBlockInSequence(fb.seqId, fb.blockIndex, { topicSub: e.target.value || undefined })}
                  className="w-full bg-slate-700/50 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-[8px] text-gray-500">Lehrplanziel</label>
                <input value={block.curriculumGoal || ''} onChange={(e) => updateBlockInSequence(fb.seqId, fb.blockIndex, { curriculumGoal: e.target.value || undefined })}
                  className="w-full bg-slate-700/50 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-[8px] text-gray-500">Beschreibung</label>
                <textarea value={block.description || ''} onChange={(e) => updateBlockInSequence(fb.seqId, fb.blockIndex, { description: e.target.value || undefined })}
                  rows={2} className="w-full bg-slate-700/50 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400 resize-y" />
              </div>
              <div>
                <label className="text-[8px] text-gray-500">Materiallinks</label>
                {(block.materialLinks || []).map((link, li) => (
                  <div key={li} className="flex gap-1 items-center mt-0.5">
                    <input value={link} onChange={(e) => {
                      const updated = [...(block.materialLinks || [])]; updated[li] = e.target.value;
                      updateBlockInSequence(fb.seqId, fb.blockIndex, { materialLinks: updated });
                    }} className="flex-1 bg-slate-700/50 text-slate-200 border border-slate-600 rounded px-1 py-px text-[8px] outline-none font-mono" />
                    <button onClick={() => {
                      const updated = (block.materialLinks || []).filter((_, i) => i !== li);
                      updateBlockInSequence(fb.seqId, fb.blockIndex, { materialLinks: updated.length > 0 ? updated : undefined });
                    }} className="text-[8px] text-red-400 cursor-pointer">✕</button>
                  </div>
                ))}
                <button onClick={() => updateBlockInSequence(fb.seqId, fb.blockIndex, { materialLinks: [...(block.materialLinks || []), ''] })}
                  className="text-[8px] text-blue-400 cursor-pointer mt-0.5">+ Link</button>
              </div>
            </div>
          )}

          {/* Lessons list */}
          {showLessons && (
            <div className="space-y-0.5 p-1.5 bg-slate-800/30 rounded max-h-48 overflow-y-auto">
              {block.weeks.map((weekW, wi) => {
                const course = COURSES.find(c => c.id === fb.courseId);
                const weekData = usePlannerStore.getState().weekData.find(w => w.w === weekW);
                const entry = course && weekData?.lessons[course.col];
                return (
                  <div key={wi} className="flex items-center gap-1 text-[9px] cursor-pointer hover:bg-slate-700/30 px-1 rounded"
                    onClick={() => {
                      if (!course) return;
                      const row = document.querySelector(`tr[data-week="${weekW}"]`);
                      if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      usePlannerStore.getState().setSelection({ week: weekW, courseId: course.id, title: entry?.title || '', course });
                      usePlannerStore.getState().setSidePanelOpen(true);
                      usePlannerStore.getState().setSidePanelTab('details');
                    }}>
                    <span className="text-gray-500 font-mono w-8">KW{weekW}</span>
                    <span className="text-gray-300 truncate">{entry?.title || '—'}</span>
                  </div>
                );
              })}
              {block.weeks.length === 0 && <div className="text-[8px] text-gray-600 italic">Keine Wochen zugewiesen</div>}
            </div>
          )}

          {/* Series-level fields (parent ManagedSequence) */}
          {showSeriesFields && parentSeq && (
            <div className="space-y-1.5 p-1.5 bg-amber-900/10 border border-amber-700/30 rounded">
              <div className="text-[8px] text-amber-400 font-medium">Unterrichtsreihe: {parentSeq.title}</div>
              <div className="flex gap-1 flex-wrap">
                <span className="text-[8px] text-gray-500 w-full">Fachbereich (Reihe):</span>
                {SUBJECT_AREAS.map((s) => (
                  <button key={s.key} onClick={() => updateSequence(fb.seqId, {
                    subjectArea: parentSeq.subjectArea === s.key ? undefined : s.key as SubjectArea
                  })}
                    className="px-1.5 py-0.5 rounded text-[8px] font-medium border cursor-pointer"
                    style={{
                      background: parentSeq.subjectArea === s.key ? s.color + '30' : 'transparent',
                      borderColor: parentSeq.subjectArea === s.key ? s.color : '#374151',
                      color: parentSeq.subjectArea === s.key ? '#e5e7eb' : '#6b7280',
                    }}>
                    {s.label}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-[8px] text-gray-500">Notizen (Reihe)</label>
                <textarea value={parentSeq.notes || ''} onChange={(e) => updateSequence(fb.seqId, { notes: e.target.value || undefined })}
                  rows={2} className="w-full bg-slate-700/50 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400 resize-y" />
              </div>
              <div className="text-[8px] text-gray-500">{parentSeq.blocks.length} Sequenzen in dieser Reihe</div>
            </div>
          )}

          {/* Delete button */}
          <div className="flex justify-end pt-0.5">
            <button onClick={() => {
              if (confirm(`Sequenz "${block.label}" entfernen?`)) {
                removeBlockFromSequence(fb.seqId, fb.blockIndex);
              }
            }} className="text-[8px] text-red-400 hover:text-red-300 cursor-pointer px-1">🗑 Entfernen</button>
          </div>
        </div>
      )}
    </div>
  );
}


// Get unique classes from courses, preserving order
function getUniqueClasses(courses: Course[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const c of courses) {
    if (!seen.has(c.cls)) { seen.add(c.cls); result.push(c.cls); }
  }
  return result;
}

// Get course types for a class
function getCourseTypesForClass(cls: string, courses: Course[]): { typ: string; courseIds: string[] }[] {
  const typMap = new Map<string, string[]>();
  for (const c of courses) {
    if (c.cls !== cls) continue;
    const key = c.typ;
    if (!typMap.has(key)) typMap.set(key, []);
    typMap.get(key)!.push(c.id);
  }
  return [...typMap.entries()].map(([typ, courseIds]) => ({ typ, courseIds }));
}

export function SequencePanel({ embedded = false }: { embedded?: boolean }) {
  const {
    sequences, sequencePanelOpen, setSequencePanelOpen,
    addSequence,
  } = usePlannerStore();
  const { courses: COURSES, getLinkedCourseIds } = usePlannerData();

  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState(COURSES[0]?.id || '');

  if (!embedded && !sequencePanelOpen) return null;

  const uniqueClasses = getUniqueClasses(COURSES);

  // Group sequences by class → course type → subject area


  // Subject area color helper
  const saColor = (sa?: SubjectArea) => sa ? (SUBJECT_AREA_COLORS[sa] || {}).bg || '#1e293b' : '#1e293b';
  const saFg = (sa?: SubjectArea) => sa ? (SUBJECT_AREA_COLORS[sa] || {}).fg || '#94a3b8' : '#94a3b8';

  const handleCreateSequence = () => {
    if (!newTitle.trim() || !newCourseId) return;
    const course = COURSES.find(c => c.id === newCourseId);
    const autoColor: Record<string, string> = { SF: '#16a34a', EWR: '#d97706', IN: '#0ea5e9', KS: '#7c3aed', EF: '#ec4899' };
    const linkedIds = getLinkedCourseIds(newCourseId);
    addSequence({
      courseId: newCourseId,
      courseIds: linkedIds.length > 1 ? linkedIds : undefined,
      title: newTitle.trim(),
      blocks: [],
      color: course ? autoColor[course.typ] || '#16a34a' : '#16a34a',
    });
    setNewTitle(''); setShowNewForm(false);
  };

  // === Flat block listing ===
  // Collect all blocks from all sequences, enriched with parent sequence info
  type FlatBlock = {
    seqId: string;
    seqTitle: string;
    seqColor?: string;
    seqSubjectArea?: SubjectArea;
    block: SequenceBlock;
    blockIndex: number;
    totalBlocks: number;
    courseId: string;
    courseIds?: string[];
    cls: string;
    typ: string;
  };

  const flatBlocks: FlatBlock[] = [];
  for (const seq of sequences) {
    const course = COURSES.find(c => c.id === seq.courseId);
    if (!course) continue;
    // Apply class filter
    if (filterClass !== 'ALL' && course.cls !== filterClass) continue;
    for (let i = 0; i < seq.blocks.length; i++) {
      flatBlocks.push({
        seqId: seq.id,
        seqTitle: seq.title,
        seqColor: seq.color,
        seqSubjectArea: seq.subjectArea,
        block: seq.blocks[i],
        blockIndex: i,
        totalBlocks: seq.blocks.length,
        courseId: seq.courseId,
        courseIds: seq.courseIds,
        cls: course.cls,
        typ: course.typ,
      });
    }
  }

  // Group by class → subject area
  const groupedByClass = new Map<string, Map<string, FlatBlock[]>>();
  for (const fb of flatBlocks) {
    const sa = fb.block.subjectArea || fb.seqSubjectArea || 'ANDERE';
    if (!groupedByClass.has(fb.cls)) groupedByClass.set(fb.cls, new Map());
    const saMap = groupedByClass.get(fb.cls)!;
    if (!saMap.has(sa)) saMap.set(sa, []);
    saMap.get(sa)!.push(fb);
  }

  const renderFlatBlocks = () => {
    const classes = filterClass === 'ALL' ? uniqueClasses : [filterClass];
    return classes.map(cls => {
      const saMap = groupedByClass.get(cls);
      if (!saMap || saMap.size === 0) {
        if (filterClass !== cls && filterClass !== 'ALL') return null;
        return (
          <div key={cls} className="space-y-1">
            <div className="text-[10px] font-bold text-gray-300 px-1">{cls}</div>
            <div className="text-[9px] text-gray-600 ml-2 italic">Keine Sequenzen</div>
          </div>
        );
      }
      return (
        <div key={cls} className="space-y-2">
          <div className="text-[10px] font-bold text-gray-300 px-1 flex items-center gap-2">
            <span>{cls}</span>
            {getCourseTypesForClass(cls, COURSES).map(ct => {
              const course = COURSES.find(c => c.id === ct.courseIds[0]);
              return (
                <span key={ct.typ} className="text-[8px] px-1 py-px rounded bg-slate-800/80 text-gray-500 font-normal">
                  {ct.typ} {course?.day}{ct.courseIds.length > 1 ? `+${COURSES.find(c => c.id === ct.courseIds[1])?.day}` : ''}
                </span>
              );
            })}
          </div>
          {[...saMap.entries()].map(([sa, blocks]) => (
            <div key={sa} className="ml-1">
              {sa !== 'ANDERE' && (
                <div className="text-[8px] font-medium px-1 py-0.5 mb-1 rounded flex items-center gap-1"
                  style={{ color: saFg(sa as SubjectArea), background: saColor(sa as SubjectArea) + '15' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: saFg(sa as SubjectArea) }} />
                  {SUBJECT_AREAS.find(s => s.key === sa)?.label || sa}
                </div>
              )}
              <div className="space-y-1">
                {blocks.map((fb) => (
                  <FlatBlockCard key={`${fb.seqId}-${fb.blockIndex}`} fb={fb} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    });
  };

  const content = (
    <>
      {/* Class filter buttons */}
      <div className="px-3 py-1.5 border-b border-slate-700/50 flex gap-1 flex-wrap shrink-0">
        <button onClick={() => setFilterClass('ALL')}
          className={`px-1.5 py-0.5 rounded text-[8px] border cursor-pointer ${filterClass === 'ALL' ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'border-gray-600 text-gray-400'}`}>
          Alle
        </button>
        {uniqueClasses.map((cls) => (
          <button key={cls} onClick={() => setFilterClass(cls)}
            className={`px-1.5 py-0.5 rounded text-[8px] border cursor-pointer ${filterClass === cls ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'border-gray-600 text-gray-400'}`}>
            {cls}
          </button>
        ))}
      </div>

      {/* Flat block list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {renderFlatBlocks()}
        {flatBlocks.length === 0 && sequences.length === 0 && (
          <div className="text-[10px] text-gray-400 text-center py-4">Noch keine Sequenzen erstellt</div>
        )}
      </div>

      {/* New sequence form */}
      <div className="px-3 py-2 border-t border-slate-600 shrink-0">
        {showNewForm ? (
          <div className="space-y-1.5">
            <input autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateSequence(); if (e.key === 'Escape') setShowNewForm(false); }}
              placeholder="Titel der Sequenz…"
              className="w-full bg-slate-800 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400" />
            <select value={newCourseId} onChange={(e) => {
                setNewCourseId(e.target.value);
                const course = COURSES.find(c => c.id === e.target.value);
                if (course && !newTitle.trim()) setNewTitle(`${course.cls} – `);
              }}
              className="w-full bg-slate-800 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400">
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>{c.cls} – {c.typ} {c.day} {c.from}–{c.to} ({c.les}L)</option>
              ))}
            </select>
            <div className="flex gap-1 justify-end">
              <button onClick={() => setShowNewForm(false)}
                className="px-2 py-0.5 rounded text-[9px] text-gray-400 border border-gray-700 cursor-pointer hover:text-gray-200">Abbrechen</button>
              <button onClick={handleCreateSequence}
                className="px-2 py-0.5 rounded text-[9px] text-white bg-green-600 border border-green-500 cursor-pointer hover:bg-green-500">Erstellen</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowNewForm(true)}
            className="w-full px-2 py-1.5 rounded text-[10px] text-green-400 border border-dashed border-green-700 cursor-pointer hover:bg-green-900/20 hover:text-green-300">
            + Neue Sequenz
          </button>
        )}
      </div>
    </>
  );

  if (embedded) {
    return <div className="flex flex-col flex-1 overflow-hidden">{content}</div>;
  }

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[320px] border-l border-slate-600 z-[65] flex flex-col shadow-[-4px_0_16px_rgba(0,0,0,0.4)]" style={{ background: '#151b2e' }}>
      <div className="px-3 py-2 border-b border-slate-600 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-200">▧ Sequenzen</span>
          <span className="text-[9px] text-gray-500">{sequences.length}</span>
        </div>
        <button onClick={() => setSequencePanelOpen(false)}
          className="text-gray-500 hover:text-gray-300 cursor-pointer text-xs px-1">✕</button>
      </div>
      {content}
    </div>
  );
}
