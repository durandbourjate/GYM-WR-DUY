import { useState } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { COURSES } from '../data/courses';
import { SEQUENCE_COLORS } from '../utils/colors';
import type { SubjectArea, ManagedSequence, SequenceBlock } from '../types';

const SUBJECT_AREAS: { key: SubjectArea; label: string; color: string }[] = [
  { key: 'BWL', label: 'BWL', color: '#3b82f6' },
  { key: 'VWL', label: 'VWL', color: '#f97316' },
  { key: 'RECHT', label: 'Recht', color: '#22c55e' },
  { key: 'IN', label: 'Informatik', color: '#06b6d4' },
  { key: 'INTERDISZ', label: 'Interdisziplinär', color: '#a855f7' },
];
function BlockEditor({
  block,
  index,
  seqId: _seqId,
  onUpdate,
  onRemove,
}: {
  block: SequenceBlock;
  index: number;
  seqId: string;
  onUpdate: (idx: number, b: Partial<SequenceBlock>) => void;
  onRemove: (idx: number) => void;
}) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [editingWeeks, setEditingWeeks] = useState(false);
  const [labelText, setLabelText] = useState(block.label);
  const [weeksText, setWeeksText] = useState(block.weeks.join(', '));

  const saveLabel = () => {
    onUpdate(index, { label: labelText });
    setEditingLabel(false);
  };

  const saveWeeks = () => {
    const parsed = weeksText
      .split(/[,;\s]+/)
      .map((w) => w.trim().replace(/^0+/, '').padStart(2, '0'))
      .filter((w) => w && /^\d{2}$/.test(w));
    onUpdate(index, { weeks: parsed });
    setEditingWeeks(false);
  };

  return (
    <div className="bg-slate-800 rounded px-2 py-1.5 border border-slate-700 group">
      <div className="flex items-center justify-between gap-1">
        {editingLabel ? (
          <input
            autoFocus
            value={labelText}
            onChange={(e) => setLabelText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') saveLabel(); if (e.key === 'Escape') setEditingLabel(false); }}
            onBlur={saveLabel}
            className="flex-1 bg-slate-700 text-slate-200 border border-blue-400 rounded px-1.5 py-0.5 text-[10px] outline-none"
          />
        ) : (
          <span
            className="text-[10px] font-medium text-gray-200 cursor-pointer hover:text-blue-300 flex-1"
            onDoubleClick={() => setEditingLabel(true)}
            title="Doppelklick zum Bearbeiten"
          >
            {block.label}
          </span>
        )}
        <span className="text-[8px] text-gray-500">{block.weeks.length}W</span>
        <button
          onClick={() => onRemove(index)}
          className="text-[9px] text-red-400 opacity-0 group-hover:opacity-100 cursor-pointer px-1"
          title="Block entfernen"
        >
          ✕
        </button>
      </div>
      {editingWeeks ? (
        <div className="mt-1">
          <input
            autoFocus
            value={weeksText}
            onChange={(e) => setWeeksText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') saveWeeks(); if (e.key === 'Escape') setEditingWeeks(false); }}
            onBlur={saveWeeks}
            placeholder="33, 34, 35, 36..."
            className="w-full bg-slate-700 text-slate-200 border border-blue-400 rounded px-1.5 py-0.5 text-[9px] outline-none font-mono"
          />
        </div>
      ) : (
        <div
          className="text-[8px] text-gray-500 mt-0.5 cursor-pointer hover:text-gray-300 font-mono"
          onDoubleClick={() => { setWeeksText(block.weeks.join(', ')); setEditingWeeks(true); }}
          title="Doppelklick zum Bearbeiten"
        >
          KW {block.weeks.join(', ')}
        </div>
      )}
    </div>
  );
}
function SequenceCard({ seq }: { seq: ManagedSequence }) {
  const {
    updateSequence, deleteSequence,
    updateBlockInSequence, removeBlockFromSequence, addBlockToSequence,
    editingSequenceId, setEditingSequenceId,
  } = usePlannerStore();

  const isExpanded = editingSequenceId === seq.id;
  const course = COURSES.find((c) => c.id === seq.courseId);
  const totalWeeks = seq.blocks.reduce((sum, b) => sum + b.weeks.length, 0);

  const [editTitle, setEditTitle] = useState(false);
  const [titleText, setTitleText] = useState(seq.title);

  const handleSaveTitle = () => {
    updateSequence(seq.id, { title: titleText });
    setEditTitle(false);
  };

  const handleDelete = () => {
    if (confirm(`Sequenz "${seq.title}" wirklich löschen?`)) {
      deleteSequence(seq.id);
    }
  };

  const handleAddBlock = () => {
    addBlockToSequence(seq.id, { weeks: [], label: 'Neuer Block' });
  };

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="px-2.5 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-slate-800/50"
        onClick={() => setEditingSequenceId(isExpanded ? null : seq.id)}
      >
        <div
          className="w-1 h-6 rounded-full shrink-0"
          style={{ background: seq.color || '#16a34a' }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-gray-200 truncate">{seq.title}</span>
            {course && (
              <span className="text-[8px] px-1 py-px rounded bg-slate-700 text-gray-400 shrink-0">
                {course.cls}
              </span>
            )}
          </div>
          <div className="text-[8px] text-gray-500">
            {seq.blocks.length} Blöcke · {totalWeeks} Wochen
            {seq.subjectArea && ` · ${seq.subjectArea}`}
          </div>
        </div>
        <span className="text-[9px] text-gray-500">{isExpanded ? '▾' : '▸'}</span>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-2.5 pb-2.5 pt-1 border-t border-slate-700 space-y-2">
          {/* Title edit */}
          <div className="flex gap-1 items-center">
            {editTitle ? (
              <input
                autoFocus
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTitle(); if (e.key === 'Escape') setEditTitle(false); }}
                onBlur={handleSaveTitle}
                className="flex-1 bg-slate-700 text-slate-200 border border-blue-400 rounded px-1.5 py-0.5 text-[10px] outline-none"
              />
            ) : (
              <span
                className="flex-1 text-[10px] text-gray-300 cursor-pointer hover:text-blue-300"
                onDoubleClick={() => setEditTitle(true)}
              >
                {seq.title}
              </span>
            )}
          </div>

          {/* Subject area + color */}
          <div className="flex gap-1 flex-wrap">
            {SUBJECT_AREAS.map((sa) => (
              <button
                key={sa.key}
                onClick={() => updateSequence(seq.id, { subjectArea: seq.subjectArea === sa.key ? undefined : sa.key })}
                className="px-1.5 py-0.5 rounded text-[8px] font-medium border cursor-pointer transition-all"
                style={{
                  background: seq.subjectArea === sa.key ? sa.color + '30' : 'transparent',
                  borderColor: seq.subjectArea === sa.key ? sa.color : '#374151',
                  color: seq.subjectArea === sa.key ? '#e5e7eb' : '#6b7280',
                }}
              >
                {sa.label}
              </button>
            ))}
          </div>

          {/* Color picker */}
          <div className="flex gap-1 items-center">
            <span className="text-[8px] text-gray-500">Farbe:</span>
            {SEQUENCE_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => updateSequence(seq.id, { color })}
                className="w-3.5 h-3.5 rounded-full cursor-pointer border-2 transition-all"
                style={{
                  background: color,
                  borderColor: seq.color === color ? '#fff' : 'transparent',
                  transform: seq.color === color ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          {/* Blocks */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-gray-500 font-medium">Blöcke</span>
              <button
                onClick={handleAddBlock}
                className="text-[9px] text-green-400 hover:text-green-300 cursor-pointer"
              >
                + Block
              </button>
            </div>
            {seq.blocks.map((block, i) => (
              <BlockEditor
                key={i}
                block={block}
                index={i}
                seqId={seq.id}
                onUpdate={(idx, b) => updateBlockInSequence(seq.id, idx, b)}
                onRemove={(idx) => removeBlockFromSequence(seq.id, idx)}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-1 border-t border-slate-700">
            <button
              onClick={handleDelete}
              className="text-[9px] text-red-400 hover:text-red-300 cursor-pointer px-2 py-0.5"
            >
              🗑 Löschen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SequencePanel() {
  const {
    sequences, sequencePanelOpen, setSequencePanelOpen,
    addSequence,
  } = usePlannerStore();

  const [filterCourse, setFilterCourse] = useState<string>('ALL');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState(COURSES[0]?.id || '');

  if (!sequencePanelOpen) return null;

  // Group sequences by course
  const filteredSequences = filterCourse === 'ALL'
    ? sequences
    : sequences.filter((s) => s.courseId === filterCourse);

  // Courses that have sequences
  const coursesWithSeq = [...new Set(sequences.map((s) => s.courseId))];

  const handleCreateSequence = () => {
    if (!newTitle.trim() || !newCourseId) return;
    addSequence({
      courseId: newCourseId,
      title: newTitle.trim(),
      blocks: [],
    });
    setNewTitle('');
    setShowNewForm(false);
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[320px] bg-slate-900 border-l border-slate-700 z-[65] flex flex-col shadow-[-4px_0_16px_rgba(0,0,0,0.4)]">
      {/* Header */}
      <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-200">▧ Sequenzen</span>
          <span className="text-[9px] text-gray-500">{sequences.length}</span>
        </div>
        <button
          onClick={() => setSequencePanelOpen(false)}
          className="text-gray-500 hover:text-gray-300 cursor-pointer text-xs px-1"
        >
          ✕
        </button>
      </div>

      {/* Filter */}
      <div className="px-3 py-1.5 border-b border-slate-800 flex gap-1 flex-wrap shrink-0">
        <button
          onClick={() => setFilterCourse('ALL')}
          className={`px-1.5 py-0.5 rounded text-[8px] border cursor-pointer ${
            filterCourse === 'ALL'
              ? 'bg-blue-500/20 border-blue-500 text-blue-300'
              : 'border-gray-700 text-gray-500'
          }`}
        >
          Alle
        </button>
        {coursesWithSeq.map((cid) => {
          const course = COURSES.find((c) => c.id === cid);
          return (
            <button
              key={cid}
              onClick={() => setFilterCourse(cid)}
              className={`px-1.5 py-0.5 rounded text-[8px] border cursor-pointer ${
                filterCourse === cid
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                  : 'border-gray-700 text-gray-500'
              }`}
            >
              {course?.cls || cid}
            </button>
          );
        })}
      </div>

      {/* Sequence list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {filteredSequences.length === 0 ? (
          <div className="text-[10px] text-gray-500 text-center py-4">
            Keine Sequenzen{filterCourse !== 'ALL' ? ' für diesen Kurs' : ''}
          </div>
        ) : (
          filteredSequences.map((seq) => (
            <SequenceCard key={seq.id} seq={seq} />
          ))
        )}
      </div>

      {/* New sequence form */}
      <div className="px-3 py-2 border-t border-slate-700 shrink-0">
        {showNewForm ? (
          <div className="space-y-1.5">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateSequence(); if (e.key === 'Escape') setShowNewForm(false); }}
              placeholder="Titel der Sequenz…"
              className="w-full bg-slate-800 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400"
            />
            <select
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400"
            >
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.cls} ({c.typ} {c.day} {c.from})
                </option>
              ))}
            </select>
            <div className="flex gap-1 justify-end">
              <button
                onClick={() => setShowNewForm(false)}
                className="px-2 py-0.5 rounded text-[9px] text-gray-400 border border-gray-700 cursor-pointer hover:text-gray-200"
              >
                Abbrechen
              </button>
              <button
                onClick={handleCreateSequence}
                className="px-2 py-0.5 rounded text-[9px] text-white bg-green-600 border border-green-500 cursor-pointer hover:bg-green-500"
              >
                Erstellen
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNewForm(true)}
            className="w-full px-2 py-1.5 rounded text-[10px] text-green-400 border border-dashed border-green-700 cursor-pointer hover:bg-green-900/20 hover:text-green-300"
          >
            + Neue Sequenz
          </button>
        )}
      </div>
    </div>
  );
}
