import { useState, useCallback } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { TYPE_BADGES } from '../utils/colors';
import { COURSES } from '../data/courses';
import { WEEKS } from '../data/weeks';
import type { SubjectArea, TaxonomyLevel, BlockType, LessonDetail } from '../types';

const SUBJECT_AREAS: { key: SubjectArea; label: string; color: string }[] = [
  { key: 'BWL', label: 'BWL', color: '#3b82f6' },
  { key: 'VWL', label: 'VWL', color: '#f97316' },
  { key: 'RECHT', label: 'Recht', color: '#22c55e' },
  { key: 'IN', label: 'Informatik', color: '#06b6d4' },
  { key: 'INTERDISZ', label: 'Interdisziplinär', color: '#a855f7' },
];

const TAXONOMY_LEVELS: { key: TaxonomyLevel; label: string }[] = [
  { key: 'K1', label: 'K1 – Wissen' },
  { key: 'K2', label: 'K2 – Verstehen' },
  { key: 'K3', label: 'K3 – Anwenden' },
  { key: 'K4', label: 'K4 – Analysieren' },
  { key: 'K5', label: 'K5 – Synthese' },
  { key: 'K6', label: 'K6 – Beurteilen' },
];
const BLOCK_TYPES: { key: BlockType; label: string; icon: string }[] = [
  { key: 'LESSON', label: 'Lektion', icon: '📖' },
  { key: 'EXAM', label: 'Prüfung', icon: '📝' },
  { key: 'EXAM_ORAL', label: 'Mündl. Prüfung', icon: '🎤' },
  { key: 'EXAM_LONG', label: 'Langprüfung', icon: '📋' },
  { key: 'PRESENTATION', label: 'Präsentation', icon: '🎯' },
  { key: 'PROJECT_DUE', label: 'Projektabgabe', icon: '📦' },
  { key: 'SELF_STUDY', label: 'SOL', icon: '📚' },
  { key: 'INTRO', label: 'Einführung', icon: '🚀' },
  { key: 'DISCUSSION', label: 'Diskussion', icon: '💬' },
  { key: 'EVENT', label: 'Event/Anlass', icon: '📅' },
  { key: 'HOLIDAY', label: 'Ferien/Frei', icon: '🏖' },
];

function findPairedCourses(course: typeof COURSES[0]) {
  return COURSES.filter(
    (c) =>
      c.id !== course.id &&
      c.cls === course.cls &&
      c.typ === course.typ &&
      c.les !== course.les
  );
}

function PillSelect<T extends string>({
  options,
  value,
  onChange,
  renderOption,
}: {
  options: T[];
  value: T | undefined;
  onChange: (v: T | undefined) => void;
  renderOption: (v: T) => { label: string; color?: string; icon?: string };
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => {
        const { label, color, icon } = renderOption(opt);
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(active ? undefined : opt)}
            className="px-1.5 py-0.5 rounded text-[9px] font-medium border cursor-pointer transition-all"
            style={{
              background: active ? (color || '#3b82f6') + '30' : 'transparent',
              borderColor: active ? (color || '#3b82f6') : '#374151',
              color: active ? '#e5e7eb' : '#6b7280',
            }}
          >
            {icon && <span className="mr-0.5">{icon}</span>}
            {label}
          </button>
        );
      })}
    </div>
  );
}
function MaterialLinks({
  links,
  onChange,
}: {
  links: string[];
  onChange: (links: string[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [newLink, setNewLink] = useState('');

  const handleAdd = () => {
    if (newLink.trim()) {
      onChange([...links, newLink.trim()]);
      setNewLink('');
      setAdding(false);
    }
  };

  return (
    <div className="space-y-1">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-1 group">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-blue-400 hover:text-blue-300 truncate flex-1"
          >
            {link.length > 60 ? link.slice(0, 60) + '…' : link}
          </a>
          <button
            onClick={() => onChange(links.filter((_, j) => j !== i))}
            className="text-[9px] text-red-400 opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      ))}
      {adding ? (
        <div className="flex gap-1">
          <input
            autoFocus
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }}
            placeholder="URL eingeben…"
            className="flex-1 bg-slate-700 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400"
          />
          <button onClick={handleAdd} className="text-[9px] text-green-400 cursor-pointer">✓</button>
          <button onClick={() => setAdding(false)} className="text-[9px] text-gray-500 cursor-pointer">✕</button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="text-[9px] text-gray-500 hover:text-gray-300 cursor-pointer"
        >
          + Link hinzufügen
        </button>
      )}
    </div>
  );
}
export function DetailPanel() {
  const {
    selection, setSelection,
    setInsertDialog, pushLessons, pushUndo,
    lessonDetails, updateLessonDetail,
    detailPanelExpanded, setDetailPanelExpanded,
  } = usePlannerStore();

  const updateField = useCallback(
    (field: keyof LessonDetail, value: LessonDetail[keyof LessonDetail]) => {
      if (!selection) return;
      updateLessonDetail(selection.week, selection.course.col, { [field]: value });
    },
    [selection, updateLessonDetail]
  );

  if (!selection) return null;

  const c = selection.course;
  const badge = TYPE_BADGES[c.typ];
  const allWeekKeys = WEEKS.map((w) => w.w);
  const detailKey = `${selection.week}-${c.col}`;
  const detail: LessonDetail = lessonDetails[detailKey] || {};

  const handleInsertBefore = () => {
    const paired = findPairedCourses(c);
    setInsertDialog({
      week: selection.week,
      course: c,
      hasMismatch: paired.length > 0,
      pairedCourses: paired,
    });
  };
  const handlePush = () => {
    const paired = findPairedCourses(c);
    if (paired.length > 0) {
      setInsertDialog({
        week: selection.week, course: c,
        hasMismatch: true, pairedCourses: paired,
      });
    } else {
      pushUndo();
      pushLessons(c.col, selection.week, allWeekKeys);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur border-t-2 border-blue-500 z-[58] shadow-[0_-4px_16px_rgba(0,0,0,0.5)] transition-all duration-200"
      style={{ maxHeight: detailPanelExpanded ? '50vh' : '120px' }}
    >
      {/* Compact header – always visible */}
      <div className="px-4 py-2 flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 items-center">
            <span className="text-xs font-bold text-gray-100">{c.cls}</span>
            <span className="text-[9px] px-1.5 py-px rounded text-white" style={{ background: badge?.bg }}>
              {c.typ}
            </span>
            <span className="text-[9px] text-gray-500">
              {c.day} {c.from}–{c.to} · {c.les}L · {c.hk ? 'HK' : 'GK'} · KW {selection.week}
            </span>
          </div>
          <div className="text-sm mt-0.5 text-gray-200 truncate">{selection.title}</div>
          {/* Quick tags from detail */}
          <div className="flex gap-1 mt-1 flex-wrap">
            {detail.subjectArea && (
              <span className="text-[8px] px-1 py-px rounded border"
                style={{
                  borderColor: SUBJECT_AREAS.find(s => s.key === detail.subjectArea)?.color || '#555',
                  color: SUBJECT_AREAS.find(s => s.key === detail.subjectArea)?.color || '#999',
                }}>
                {detail.subjectArea}
              </span>
            )}
            {detail.taxonomyLevel && (
              <span className="text-[8px] px-1 py-px rounded border border-amber-600 text-amber-400">
                {detail.taxonomyLevel}
              </span>
            )}
            {detail.blockType && detail.blockType !== 'LESSON' && (
              <span className="text-[8px] px-1 py-px rounded border border-gray-600 text-gray-400">
                {BLOCK_TYPES.find(b => b.key === detail.blockType)?.icon} {BLOCK_TYPES.find(b => b.key === detail.blockType)?.label}
              </span>
            )}
            {detail.topicMain && (
              <span className="text-[8px] px-1 py-px rounded bg-slate-700 text-gray-300 truncate max-w-[200px]">
                {detail.topicMain}
              </span>
            )}
          </div>
          {/* Action buttons */}
          <div className="mt-1.5 flex gap-1">
            <button onClick={handleInsertBefore}
              className="px-2 py-0.5 rounded bg-gray-700 text-gray-200 border border-gray-600 text-[9px] cursor-pointer hover:bg-gray-600">
              ⊞ Einfügen
            </button>
            <button onClick={handlePush}
              className="px-2 py-0.5 rounded bg-gray-700 text-gray-200 border border-gray-600 text-[9px] cursor-pointer hover:bg-gray-600">
              ↓ Push
            </button>
            <button onClick={() => setDetailPanelExpanded(!detailPanelExpanded)}
              className={`px-2 py-0.5 rounded border text-[9px] cursor-pointer transition-colors ${
                detailPanelExpanded
                  ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500'
                  : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
              }`}>
              {detailPanelExpanded ? '▾ Details ▾' : '▸ Details ▸'}
            </button>
          </div>
        </div>
        <button onClick={() => { setSelection(null); setDetailPanelExpanded(false); }}
          className="bg-gray-700 text-gray-400 border-none rounded px-2 py-0.5 cursor-pointer text-xs hover:text-gray-200 shrink-0">
          ✕
        </button>
      </div>
      {/* Expanded detail fields */}
      {detailPanelExpanded && (
        <div className="px-4 pb-3 overflow-y-auto border-t border-slate-700 pt-2"
          style={{ maxHeight: 'calc(50vh - 120px)' }}>
          <div className="grid grid-cols-[1fr_1fr] gap-x-6 gap-y-3">
            {/* Left column */}
            <div className="space-y-2.5">
              {/* Fachbereich */}
              <div>
                <label className="text-[9px] text-gray-500 font-medium mb-1 block">Fachbereich</label>
                <PillSelect
                  options={SUBJECT_AREAS.map(s => s.key)}
                  value={detail.subjectArea}
                  onChange={(v) => updateField('subjectArea', v)}
                  renderOption={(v) => {
                    const s = SUBJECT_AREAS.find(x => x.key === v)!;
                    return { label: s.label, color: s.color };
                  }}
                />
              </div>

              {/* Block-Typ */}
              <div>
                <label className="text-[9px] text-gray-500 font-medium mb-1 block">Block-Typ</label>
                <PillSelect
                  options={BLOCK_TYPES.map(b => b.key)}
                  value={detail.blockType}
                  onChange={(v) => updateField('blockType', v)}
                  renderOption={(v) => {
                    const b = BLOCK_TYPES.find(x => x.key === v)!;
                    return { label: b.label, icon: b.icon };
                  }}
                />
              </div>
              {/* Taxonomiestufe */}
              <div>
                <label className="text-[9px] text-gray-500 font-medium mb-1 block">Taxonomiestufe</label>
                <PillSelect
                  options={TAXONOMY_LEVELS.map(t => t.key)}
                  value={detail.taxonomyLevel}
                  onChange={(v) => updateField('taxonomyLevel', v)}
                  renderOption={(v) => {
                    const t = TAXONOMY_LEVELS.find(x => x.key === v)!;
                    return { label: t.label, color: '#d97706' };
                  }}
                />
              </div>

              {/* Thema */}
              <div>
                <label className="text-[9px] text-gray-500 font-medium mb-1 block">Thema</label>
                <input
                  value={detail.topicMain || ''}
                  onChange={(e) => updateField('topicMain', e.target.value)}
                  placeholder="Hauptthema…"
                  className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400"
                />
                <input
                  value={detail.topicSub || ''}
                  onChange={(e) => updateField('topicSub', e.target.value)}
                  placeholder="Unterthema (optional)…"
                  className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400 mt-1"
                />
              </div>
            </div>
            {/* Right column */}
            <div className="space-y-2.5">
              {/* Lehrplanziel */}
              <div>
                <label className="text-[9px] text-gray-500 font-medium mb-1 block">Lehrplanziel (LP17)</label>
                <textarea
                  value={detail.curriculumGoal || ''}
                  onChange={(e) => updateField('curriculumGoal', e.target.value)}
                  placeholder="Lehrplanbezug…"
                  rows={2}
                  className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400 resize-y"
                />
              </div>

              {/* LearningView URL */}
              <div>
                <label className="text-[9px] text-gray-500 font-medium mb-1 block">LearningView</label>
                <input
                  value={detail.learningviewUrl || ''}
                  onChange={(e) => updateField('learningviewUrl', e.target.value)}
                  placeholder="https://learningview.org/…"
                  className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400"
                />
              </div>

              {/* Material-Links */}
              <div>
                <label className="text-[9px] text-gray-500 font-medium mb-1 block">Material</label>
                <MaterialLinks
                  links={detail.materialLinks || []}
                  onChange={(links) => updateField('materialLinks', links)}
                />
              </div>
              {/* Notizen */}
              <div>
                <label className="text-[9px] text-gray-500 font-medium mb-1 block">Notizen</label>
                <textarea
                  value={detail.notes || ''}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Notizen, Hinweise…"
                  rows={2}
                  className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400 resize-y"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}