import { useState } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { COURSES, getLinkedCourseIds } from '../data/courses';
import { WEEKS } from '../data/weeks';
import { SEQUENCE_COLORS, SUBJECT_AREA_COLORS } from '../utils/colors';
import type { SubjectArea, ManagedSequence, SequenceBlock } from '../types';

const SUBJECT_AREAS: { key: SubjectArea; label: string; color: string }[] = [
  { key: 'BWL', label: 'BWL', color: '#3b82f6' },
  { key: 'VWL', label: 'VWL', color: '#f97316' },
  { key: 'RECHT', label: 'Recht', color: '#22c55e' },
  { key: 'IN', label: 'Informatik', color: '#6b7280' },
  { key: 'INTERDISZ', label: 'Interdisziplinär', color: '#a855f7' },
];

function BlockEditor({
  block, index, seqId, totalBlocks,
  onUpdate, onRemove, onMoveUp, onMoveDown,
}: {
  block: SequenceBlock; index: number; seqId: string; totalBlocks: number;
  onUpdate: (idx: number, b: Partial<SequenceBlock>) => void;
  onRemove: (idx: number) => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
}) {
  const { setSelection, setSidePanelOpen, setSidePanelTab, sequences } = usePlannerStore();
  const [editingLabel, setEditingLabel] = useState(false);
  const [editingWeeks, setEditingWeeks] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [labelText, setLabelText] = useState(block.label);
  const [weeksText, setWeeksText] = useState(block.weeks.join(', '));

  const saveLabel = () => { onUpdate(index, { label: labelText }); setEditingLabel(false); };
  const saveWeeks = () => {
    const parsed = weeksText.split(/[,;\s]+/).map((w) => w.trim().replace(/^0+/, '').padStart(2, '0')).filter((w) => w && /^\d{2}$/.test(w));
    onUpdate(index, { weeks: parsed }); setEditingWeeks(false);
  };

  // Navigate to first week of this block in the planner
  const navigateToBlock = () => {
    if (block.weeks.length === 0) return;
    const seq = sequences.find(s => s.id === seqId);
    if (!seq) return;
    const weekKey = block.weeks[0];
    const courseId = seq.courseId;
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;
    const row = document.querySelector(`tr[data-week="${weekKey}"]`);
    if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setSelection({ week: weekKey, courseId: course.id, title: block.label, course });
    setSidePanelOpen(true);
    setSidePanelTab('details');
  };

  const subjectColor = block.subjectArea ? (SUBJECT_AREA_COLORS[block.subjectArea] || {}).bg || '#1e293b' : undefined;

  return (
    <div className="bg-slate-800 rounded px-2 py-1.5 border border-slate-700 group"
      style={subjectColor ? { borderLeftColor: subjectColor, borderLeftWidth: 3 } : undefined}>
      <div className="flex items-center justify-between gap-1">
        {editingLabel ? (
          <input autoFocus value={labelText} onChange={(e) => setLabelText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') saveLabel(); if (e.key === 'Escape') setEditingLabel(false); }}
            onBlur={saveLabel}
            className="flex-1 bg-slate-700 text-slate-200 border border-blue-400 rounded px-1.5 py-0.5 text-[10px] outline-none" />
        ) : (
          <span className="text-[10px] font-medium text-gray-200 cursor-pointer hover:text-blue-300 flex-1"
            onClick={navigateToBlock}
            onDoubleClick={(e) => { e.stopPropagation(); setEditingLabel(true); }}
            title={block.weeks.length > 0 ? `Klick: Zur KW ${block.weeks[0]} springen · Doppelklick: Bearbeiten` : 'Doppelklick zum Bearbeiten'}>
            {block.label}
          </span>
        )}
        <span className="text-[8px] text-gray-500">{block.weeks.length}W</span>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100">
          <button onClick={() => onMoveUp(index)} disabled={index === 0}
            className="text-[9px] text-gray-400 hover:text-gray-200 disabled:text-gray-600 cursor-pointer disabled:cursor-default px-0.5" title="Nach oben">↑</button>
          <button onClick={() => onMoveDown(index)} disabled={index === totalBlocks - 1}
            className="text-[9px] text-gray-400 hover:text-gray-200 disabled:text-gray-600 cursor-pointer disabled:cursor-default px-0.5" title="Nach unten">↓</button>
        </div>
        <button onClick={() => onRemove(index)} className="text-[9px] text-red-400 opacity-0 group-hover:opacity-100 cursor-pointer px-1" title="Block entfernen">✕</button>
      </div>
      {editingWeeks ? (
        <div className="mt-1">
          <input autoFocus value={weeksText} onChange={(e) => setWeeksText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') saveWeeks(); if (e.key === 'Escape') setEditingWeeks(false); }}
            onBlur={saveWeeks} placeholder="33, 34, 35, 36..."
            className="w-full bg-slate-700 text-slate-200 border border-blue-400 rounded px-1.5 py-0.5 text-[9px] outline-none font-mono" />
        </div>
      ) : (
        <div className="text-[8px] text-gray-500 mt-0.5 cursor-pointer hover:text-gray-300 font-mono"
          onDoubleClick={() => { setWeeksText(block.weeks.join(', ')); setEditingWeeks(true); }} title="Doppelklick zum Bearbeiten">
          KW {block.weeks.join(', ')}
        </div>
      )}
      <button onClick={() => setShowDetails(!showDetails)}
        className="text-[8px] text-gray-500 hover:text-gray-300 cursor-pointer mt-1 flex items-center gap-0.5">
        {showDetails ? '▾' : '▸'} Details
        {(block.topicMain || block.curriculumGoal) && <span className="text-green-500">●</span>}
      </button>
      {showDetails && (
        <div className="mt-1.5 space-y-1.5 border-t border-slate-700 pt-1.5">
          <div>
            <label className="text-[8px] text-gray-500 block">Oberthema</label>
            <input value={block.topicMain || ''} onChange={(e) => onUpdate(index, { topicMain: e.target.value || undefined })}
              placeholder="z.B. Vertragsentstehung"
              className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-[8px] text-gray-500 block">Unterthema</label>
            <input value={block.topicSub || ''} onChange={(e) => onUpdate(index, { topicSub: e.target.value || undefined })}
              placeholder="optional"
              className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-[8px] text-gray-500 block">Fachbereich</label>
            <div className="flex gap-0.5 flex-wrap">
              {SUBJECT_AREAS.map((sa) => (
                <button key={sa.key} onClick={() => onUpdate(index, { subjectArea: block.subjectArea === sa.key ? undefined : sa.key })}
                  className="px-1 py-px rounded text-[7px] font-medium border cursor-pointer"
                  style={{ background: block.subjectArea === sa.key ? sa.color + '30' : 'transparent', borderColor: block.subjectArea === sa.key ? sa.color : '#374151', color: block.subjectArea === sa.key ? '#e5e7eb' : '#6b7280' }}>
                  {sa.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[8px] text-gray-500 block">Lehrplanziel (LP17)</label>
            <input value={block.curriculumGoal || ''} onChange={(e) => onUpdate(index, { curriculumGoal: e.target.value || undefined })}
              placeholder="z.B. 5.1 OR Grundlagen"
              className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-[8px] text-gray-500 block">Beschreibung</label>
            <textarea value={block.description || ''} onChange={(e) => onUpdate(index, { description: e.target.value || undefined })}
              placeholder="Notizen zum Block…" rows={2}
              className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400 resize-y" />
          </div>
        </div>
      )}
    </div>
  );
}

function SequenceCard({ seq }: { seq: ManagedSequence }) {
  const {
    updateSequence, deleteSequence,
    updateBlockInSequence, removeBlockFromSequence, addBlockToSequence, reorderBlocks,
    editingSequenceId, setEditingSequenceId,
    autoPlaceSequence, getAvailableWeeks,
  } = usePlannerStore();

  const isExpanded = editingSequenceId === seq.id;
  const course = COURSES.find((c) => c.id === seq.courseId);
  const linkedCourses = seq.courseIds
    ? seq.courseIds.map(cid => COURSES.find(c => c.id === cid)).filter(Boolean)
    : course ? [course] : [];
  const totalWeeks = seq.blocks.reduce((sum, b) => sum + b.weeks.length, 0);
  const [editTitle, setEditTitle] = useState(false);
  const [titleText, setTitleText] = useState(seq.title);
  const [showAutoPlace, setShowAutoPlace] = useState(false);
  const [autoPlaceStart, setAutoPlaceStart] = useState(WEEKS[0]?.w || '33');
  const [autoPlaceResult, setAutoPlaceResult] = useState<{ placed: number; skipped: string[] } | null>(null);
  const [compactBlocks, setCompactBlocks] = useState(seq.blocks.length > 6);
  const allWeekOrder = WEEKS.map(w => w.w);

  const handleSaveTitle = () => { updateSequence(seq.id, { title: titleText }); setEditTitle(false); };
  const handleDelete = () => { if (confirm(`Sequenz "${seq.title}" wirklich löschen?`)) deleteSequence(seq.id); };
  const handleAddBlock = () => { addBlockToSequence(seq.id, { weeks: [], label: 'Neuer Block' }); };

  const seqSubjectColor = seq.subjectArea ? SUBJECT_AREA_COLORS[seq.subjectArea]?.bg : undefined;

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden"
      style={seqSubjectColor ? { borderColor: seqSubjectColor + '50', background: seqSubjectColor + '08' } : undefined}>
      <div className="px-2.5 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-slate-800/50"
        onClick={() => setEditingSequenceId(isExpanded ? null : seq.id)}>
        <div className="w-1 h-6 rounded-full shrink-0" style={{ background: seq.color || '#16a34a' }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-gray-200 truncate">{seq.title}</span>
          </div>
          <div className="text-[8px] text-gray-500">
            {seq.blocks.length} Blöcke · {totalWeeks} Wochen
            {seq.subjectArea && ` · ${seq.subjectArea}`}
            {linkedCourses.length > 1 && <span className="text-blue-400"> · {linkedCourses.map(c => c!.day).join('+')}</span>}
          </div>
        </div>
        <span className="text-[9px] text-gray-500">{isExpanded ? '▾' : '▸'}</span>
      </div>

      {isExpanded && (
        <div className="px-2.5 pb-2.5 pt-1 border-t border-slate-700 space-y-2">
          <div className="flex gap-1 items-center">
            {editTitle ? (
              <input autoFocus value={titleText} onChange={(e) => setTitleText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTitle(); if (e.key === 'Escape') setEditTitle(false); }}
                onBlur={handleSaveTitle}
                className="flex-1 bg-slate-700 text-slate-200 border border-blue-400 rounded px-1.5 py-0.5 text-[10px] outline-none" />
            ) : (
              <span className="flex-1 text-[10px] text-gray-300 cursor-pointer hover:text-blue-300"
                onDoubleClick={() => setEditTitle(true)}>{seq.title}</span>
            )}
          </div>
          {/* Multi-Tag linking */}
          {(() => {
            const linked = getLinkedCourseIds(seq.courseId);
            if (linked.length <= 1) return null;
            const isMultiDay = seq.courseIds && seq.courseIds.length > 1;
            const linkedCoursesInfo = linked.map(cid => COURSES.find(c => c.id === cid)).filter(Boolean);
            return (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[8px] text-gray-500">Multi-Tag:</span>
                {!isMultiDay ? (
                  <button onClick={() => updateSequence(seq.id, { courseIds: linked, multiDayMode: 'alternating' })}
                    className="text-[8px] px-1.5 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-700 cursor-pointer hover:bg-blue-800/50">
                    ⊞ {linkedCoursesInfo.map(c => c!.day).join('+')} verknüpfen
                  </button>
                ) : (
                  <>
                    <button onClick={() => updateSequence(seq.id, { multiDayMode: 'alternating' })}
                      className={`text-[8px] px-1.5 py-0.5 rounded cursor-pointer ${seq.multiDayMode === 'alternating' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'}`}>Di↔Do</button>
                    <button onClick={() => updateSequence(seq.id, { multiDayMode: 'separate' })}
                      className={`text-[8px] px-1.5 py-0.5 rounded cursor-pointer ${seq.multiDayMode === 'separate' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'}`}>Di|Do</button>
                    <button onClick={() => updateSequence(seq.id, { courseIds: [seq.courseId], multiDayMode: undefined })}
                      className="text-[8px] px-1 py-0.5 rounded bg-slate-700 text-red-400 cursor-pointer hover:bg-red-900/30" title="Multi-Tag aufheben">✕</button>
                  </>
                )}
              </div>
            );
          })()}
          {/* Subject area + color */}
          <div className="flex gap-1 flex-wrap">
            {SUBJECT_AREAS.map((sa) => (
              <button key={sa.key} onClick={() => updateSequence(seq.id, { subjectArea: seq.subjectArea === sa.key ? undefined : sa.key })}
                className="px-1.5 py-0.5 rounded text-[8px] font-medium border cursor-pointer transition-all"
                style={{ background: seq.subjectArea === sa.key ? sa.color + '30' : 'transparent', borderColor: seq.subjectArea === sa.key ? sa.color : '#374151', color: seq.subjectArea === sa.key ? '#e5e7eb' : '#6b7280' }}>
                {sa.label}
              </button>
            ))}
          </div>
          {/* Color picker */}
          <div className="flex gap-1 items-center flex-wrap">
            <span className="text-[8px] text-gray-500">Farbe:</span>
            {SEQUENCE_COLORS.map((color) => (
              <button key={color} onClick={() => updateSequence(seq.id, { color })}
                className="w-3.5 h-3.5 rounded-full cursor-pointer border-2 transition-all"
                style={{ background: color, borderColor: seq.color === color ? '#fff' : 'transparent', transform: seq.color === color ? 'scale(1.2)' : 'scale(1)' }} />
            ))}
          </div>

          {/* Links */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[8px] text-gray-500">Links</span>
              <button onClick={() => updateSequence(seq.id, { links: [...(seq.links || []), { label: '', url: '' }] })}
                className="text-[8px] text-blue-400 cursor-pointer hover:text-blue-300">+ Link</button>
            </div>
            {(seq.links || []).map((link, li) => (
              <div key={li} className="flex gap-1 items-center">
                <input value={link.label} onChange={(e) => {
                  const updated = [...(seq.links || [])]; updated[li] = { ...updated[li], label: e.target.value };
                  updateSequence(seq.id, { links: updated });
                }} placeholder="Label" className="w-16 bg-slate-700 text-slate-200 border border-slate-600 rounded px-1 py-px text-[8px] outline-none focus:border-blue-400" />
                <input value={link.url} onChange={(e) => {
                  const updated = [...(seq.links || [])]; updated[li] = { ...updated[li], url: e.target.value };
                  updateSequence(seq.id, { links: updated });
                }} placeholder="https://…" className="flex-1 bg-slate-700 text-slate-200 border border-slate-600 rounded px-1 py-px text-[8px] outline-none focus:border-blue-400 font-mono" />
                {link.url && <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[8px] text-blue-400 hover:text-blue-300">↗</a>}
                <button onClick={() => {
                  const updated = (seq.links || []).filter((_, i) => i !== li);
                  updateSequence(seq.id, { links: updated });
                }} className="text-[8px] text-red-400 cursor-pointer">✕</button>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="text-[8px] text-gray-500 block mb-0.5">Notizen</label>
            <textarea value={seq.notes || ''} onChange={(e) => updateSequence(seq.id, { notes: e.target.value || undefined })}
              placeholder="Notizen zur Sequenz…" rows={2}
              className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400 resize-y" />
          </div>

          {/* Blocks */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-gray-500 font-medium">Blöcke ({seq.blocks.length})</span>
              <div className="flex gap-2 items-center">
                {seq.blocks.length > 4 && (
                  <button onClick={() => setCompactBlocks(!compactBlocks)}
                    className="text-[8px] text-gray-500 hover:text-gray-300 cursor-pointer">{compactBlocks ? '⊞ Erweitern' : '⊟ Kompakt'}</button>
                )}
                <button onClick={handleAddBlock} className="text-[9px] text-green-400 hover:text-green-300 cursor-pointer">+ Block</button>
              </div>
            </div>
            {compactBlocks ? (
              <div className="space-y-0.5">
                {seq.blocks.map((block, i) => {
                  const blockColor = block.subjectArea ? SUBJECT_AREA_COLORS[block.subjectArea]?.bg : undefined;
                  return (
                    <div key={i} className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 group/block text-[9px] cursor-pointer hover:border-slate-500"
                      style={blockColor ? { borderLeftColor: blockColor, borderLeftWidth: 2 } : undefined}
                      onClick={() => {
                        if (block.weeks.length > 0) {
                          const course = COURSES.find(c => c.id === seq.courseId);
                          if (course) {
                            const row = document.querySelector(`tr[data-week="${block.weeks[0]}"]`);
                            if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            usePlannerStore.getState().setSelection({ week: block.weeks[0], courseId: course.id, title: block.label, course });
                            usePlannerStore.getState().setSidePanelOpen(true);
                            usePlannerStore.getState().setSidePanelTab('details');
                          }
                        }
                      }}>
                      <span className="text-gray-500 w-4 text-center">{i + 1}</span>
                      <span className="text-gray-200 flex-1 truncate">{block.label}</span>
                      <span className="text-gray-500 text-[8px]">{block.weeks.length}W</span>
                      <span className="text-gray-600 text-[8px] font-mono truncate max-w-[80px]">
                        {block.weeks.length > 0 ? `KW ${block.weeks[0]}–${block.weeks[block.weeks.length - 1]}` : '—'}
                      </span>
                      {(block.topicMain || block.curriculumGoal) && <span className="text-green-500 text-[8px]">●</span>}
                      <span className="text-[7px] text-gray-600 opacity-0 group-hover/block:opacity-100">↗</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              seq.blocks.map((block, i) => (
                <BlockEditor key={i} block={block} index={i} seqId={seq.id} totalBlocks={seq.blocks.length}
                  onUpdate={(idx, b) => updateBlockInSequence(seq.id, idx, b)}
                  onRemove={(idx) => removeBlockFromSequence(seq.id, idx)}
                  onMoveUp={(idx) => reorderBlocks(seq.id, idx, idx - 1)}
                  onMoveDown={(idx) => reorderBlocks(seq.id, idx, idx + 1)} />
              ))
            )}
          </div>
          {/* Actions */}
          <div className="flex justify-between pt-1 border-t border-slate-700">
            <button onClick={() => setShowAutoPlace(!showAutoPlace)}
              className="text-[9px] text-blue-400 hover:text-blue-300 cursor-pointer px-2 py-0.5">▶ Platzieren</button>
            <button onClick={handleDelete}
              className="text-[9px] text-red-400 hover:text-red-300 cursor-pointer px-2 py-0.5">🗑 Löschen</button>
          </div>
          {showAutoPlace && (
            <div className="bg-slate-800 rounded p-2 space-y-2 border border-blue-500/30">
              <div className="text-[9px] font-medium text-blue-300">Auto-Platzierung</div>
              <div className="flex items-center gap-2">
                <label className="text-[8px] text-gray-400">Ab KW:</label>
                <select value={autoPlaceStart} onChange={(e) => { setAutoPlaceStart(e.target.value); setAutoPlaceResult(null); }}
                  className="text-[9px] bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-gray-200">
                  {allWeekOrder.map(w => <option key={w} value={w}>KW {w}</option>)}
                </select>
                <span className="text-[8px] text-gray-500">{getAvailableWeeks(seq.courseId, autoPlaceStart, allWeekOrder).length} frei</span>
              </div>
              <div className="text-[8px] text-gray-500">Benötigt: {totalWeeks} Wochen · Verfügbar: {getAvailableWeeks(seq.courseId, autoPlaceStart, allWeekOrder).length}</div>
              {autoPlaceResult && (
                <div className={`text-[8px] p-1 rounded ${autoPlaceResult.placed > 0 ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                  ✅ {autoPlaceResult.placed} Lektionen platziert{autoPlaceResult.skipped.length > 0 && ` · ${autoPlaceResult.skipped.length} übersprungen`}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => { const result = autoPlaceSequence(seq.id, autoPlaceStart, allWeekOrder); setAutoPlaceResult(result); }}
                  disabled={getAvailableWeeks(seq.courseId, autoPlaceStart, allWeekOrder).length < totalWeeks}
                  className="text-[9px] bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:text-gray-500 text-white px-2 py-0.5 rounded cursor-pointer disabled:cursor-not-allowed">
                  Jetzt platzieren
                </button>
                <button onClick={() => { setShowAutoPlace(false); setAutoPlaceResult(null); }}
                  className="text-[9px] text-gray-400 hover:text-gray-300 cursor-pointer px-2 py-0.5">Abbrechen</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Get unique classes from courses, preserving order
function getUniqueClasses(): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const c of COURSES) {
    if (!seen.has(c.cls)) { seen.add(c.cls); result.push(c.cls); }
  }
  return result;
}

// Get course types for a class
function getCourseTypesForClass(cls: string): { typ: string; courseIds: string[] }[] {
  const typMap = new Map<string, string[]>();
  for (const c of COURSES) {
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

  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState(COURSES[0]?.id || '');

  if (!embedded && !sequencePanelOpen) return null;

  const uniqueClasses = getUniqueClasses();

  // Group sequences by class → course type → subject area
  const getSequencesForCourseIds = (courseIds: string[]) =>
    sequences.filter(s => courseIds.includes(s.courseId) || (s.courseIds && s.courseIds.some(cid => courseIds.includes(cid))));

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

  const renderClassGroup = (cls: string) => {
    const courseTypes = getCourseTypesForClass(cls);
    const allCourseIds = courseTypes.flatMap(ct => ct.courseIds);
    const classSequences = getSequencesForCourseIds(allCourseIds);
    if (classSequences.length === 0 && filterClass !== cls) return null;

    return (
      <div key={cls} className="space-y-1.5">
        <div className="text-[10px] font-bold text-gray-300 px-1 flex items-center gap-2">
          <span>{cls}</span>
          {courseTypes.map(ct => {
            const course = COURSES.find(c => c.id === ct.courseIds[0]);
            return (
              <span key={ct.typ} className="text-[8px] px-1 py-px rounded bg-slate-800 text-gray-500 font-normal">
                {ct.typ} {course?.day}{ct.courseIds.length > 1 ? `+${COURSES.find(c => c.id === ct.courseIds[1])?.day}` : ''}
              </span>
            );
          })}
        </div>
        {/* Group by subject area */}
        {(() => {
          const bySubject = new Map<string, ManagedSequence[]>();
          for (const seq of classSequences) {
            const key = seq.subjectArea || 'ANDERE';
            if (!bySubject.has(key)) bySubject.set(key, []);
            bySubject.get(key)!.push(seq);
          }
          return [...bySubject.entries()].map(([sa, seqs]) => (
            <div key={sa} className="ml-2">
              {sa !== 'ANDERE' && (
                <div className="text-[8px] font-medium px-1 py-0.5 mb-0.5 rounded flex items-center gap-1"
                  style={{ color: saFg(sa as SubjectArea), background: saColor(sa as SubjectArea) + '15' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: saFg(sa as SubjectArea) }} />
                  {SUBJECT_AREAS.find(s => s.key === sa)?.label || sa}
                </div>
              )}
              <div className="space-y-1.5">
                {seqs.map(seq => <SequenceCard key={seq.id} seq={seq} />)}
              </div>
            </div>
          ));
        })()}
        {classSequences.length === 0 && (
          <div className="text-[9px] text-gray-600 ml-2 italic">Keine Sequenzen</div>
        )}
      </div>
    );
  };

  const content = (
    <>
      {/* Class filter buttons */}
      <div className="px-3 py-1.5 border-b border-slate-800 flex gap-1 flex-wrap shrink-0">
        <button onClick={() => setFilterClass('ALL')}
          className={`px-1.5 py-0.5 rounded text-[8px] border cursor-pointer ${filterClass === 'ALL' ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'border-gray-700 text-gray-500'}`}>
          Alle
        </button>
        {uniqueClasses.map((cls) => (
          <button key={cls} onClick={() => setFilterClass(cls)}
            className={`px-1.5 py-0.5 rounded text-[8px] border cursor-pointer ${filterClass === cls ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'border-gray-700 text-gray-500'}`}>
            {cls}
          </button>
        ))}
      </div>

      {/* Sequence list grouped by class */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {filterClass === 'ALL' ? (
          uniqueClasses.map(cls => renderClassGroup(cls))
        ) : (
          renderClassGroup(filterClass)
        )}
        {sequences.length === 0 && (
          <div className="text-[10px] text-gray-500 text-center py-4">Noch keine Sequenzen erstellt</div>
        )}
      </div>

      {/* New sequence form */}
      <div className="px-3 py-2 border-t border-slate-700 shrink-0">
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
    <div className="fixed right-0 top-0 bottom-0 w-[320px] bg-slate-900 border-l border-slate-700 z-[65] flex flex-col shadow-[-4px_0_16px_rgba(0,0,0,0.4)]">
      <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between shrink-0">
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
