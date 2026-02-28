import { useState, useCallback, useEffect, useRef } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { TYPE_BADGES, getSequenceInfoFromStore } from '../utils/colors';
import { COURSES } from '../data/courses';
import { WEEKS } from '../data/weeks';
import { CurriculumGoalPicker } from './CurriculumGoalPicker';
import { SequencePanel } from './SequencePanel';
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

function PillSelect<T extends string>({
  options, value, onChange, renderOption,
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
          <button key={opt} onClick={() => onChange(active ? undefined : opt)}
            className="px-1.5 py-0.5 rounded text-[9px] font-medium border cursor-pointer transition-all"
            style={{
              background: active ? (color || '#3b82f6') + '30' : 'transparent',
              borderColor: active ? (color || '#3b82f6') : '#374151',
              color: active ? '#e5e7eb' : '#6b7280',
            }}>
            {icon && <span className="mr-0.5">{icon}</span>}{label}
          </button>
        );
      })}
    </div>
  );
}

function MaterialLinks({ links, onChange }: { links: string[]; onChange: (links: string[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [newLink, setNewLink] = useState('');
  const handleAdd = () => {
    if (newLink.trim()) { onChange([...links, newLink.trim()]); setNewLink(''); setAdding(false); }
  };
  return (
    <div className="space-y-1">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-1 group">
          <a href={link} target="_blank" rel="noopener noreferrer"
            className="text-[9px] text-blue-400 hover:text-blue-300 truncate flex-1">
            {link.length > 50 ? link.slice(0, 50) + '…' : link}
          </a>
          <button onClick={() => onChange(links.filter((_, j) => j !== i))}
            className="text-[9px] text-red-400 opacity-0 group-hover:opacity-100 cursor-pointer">✕</button>
        </div>
      ))}
      {adding ? (
        <div className="flex gap-1">
          <input autoFocus value={newLink} onChange={(e) => setNewLink(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }}
            placeholder="URL eingeben…"
            className="flex-1 bg-slate-700 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400" />
          <button onClick={handleAdd} className="text-[9px] text-green-400 cursor-pointer">✓</button>
          <button onClick={() => setAdding(false)} className="text-[9px] text-gray-500 cursor-pointer">✕</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="text-[9px] text-gray-500 hover:text-gray-300 cursor-pointer">
          + Link hinzufügen
        </button>
      )}
    </div>
  );
}

function DetailsTab() {
  const {
    selection,
    lessonDetails, updateLessonDetail,
    weekData, sequences,
    setSelection, setSidePanelOpen,
  } = usePlannerStore();

  const c = selection?.course;
  const detailKey = selection && c ? `${selection.week}-${c.col}` : '';
  const detail: LessonDetail = (detailKey && lessonDetails[detailKey]) || {};
  const currentWeek = selection ? weekData.find((w) => w.w === selection.week) : undefined;
  const currentLesson = c ? currentWeek?.lessons[c.col] : undefined;

  // Block inheritance: find parent block for this week and merge as defaults
  const parentBlock = selection && c ? (() => {
    for (const seq of sequences) {
      if (seq.courseId !== c.id) continue;
      for (const block of seq.blocks) {
        if (block.weeks.includes(selection.week)) return block;
      }
    }
    return null;
  })() : null;

  // Effective detail = own detail with block defaults for empty fields
  const effectiveDetail: LessonDetail = {
    topicMain: detail.topicMain || parentBlock?.topicMain,
    topicSub: detail.topicSub || parentBlock?.topicSub,
    subjectArea: detail.subjectArea || parentBlock?.subjectArea,
    curriculumGoal: detail.curriculumGoal || parentBlock?.curriculumGoal,
    taxonomyLevel: detail.taxonomyLevel || parentBlock?.taxonomyLevel,
    blockType: detail.blockType,
    description: detail.description || parentBlock?.description,
    materialLinks: detail.materialLinks?.length ? detail.materialLinks : parentBlock?.materialLinks,
    learningviewUrl: detail.learningviewUrl,
    notes: detail.notes,
  };

  const updateField = useCallback(
    <K extends keyof LessonDetail>(field: K, value: LessonDetail[K]) => {
      if (!selection || !c) return;
      updateLessonDetail(selection.week, c.col, { [field]: value });
    },
    [selection?.week, c?.col, updateLessonDetail]
  );

  // Auto-detect subjectArea from LessonType
  useEffect(() => {
    if (!selection || !c || detail.subjectArea || !currentLesson) return;
    const autoMap: Record<number, SubjectArea> = { 1: 'BWL', 2: 'RECHT', 3: 'IN' };
    const detected = autoMap[currentLesson.type];
    if (detected) updateLessonDetail(selection.week, c.col, { subjectArea: detected });
  }, [selection?.week, c?.col, currentLesson?.type, detail.subjectArea]);

  if (!selection || !c) {
    return (
      <div className="flex-1 flex items-center justify-center text-[10px] text-gray-500 p-4">
        Wähle eine Lektion aus, um Details zu bearbeiten.
      </div>
    );
  }

  const badge = TYPE_BADGES[c.typ];
  const seqInfo = getSequenceInfoFromStore(c.id, selection.week, sequences);
  const parentSeq = seqInfo ? sequences.find(s => s.id === seqInfo.sequenceId) : null;

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {/* Header info */}
      <div>
        <div className="flex gap-2 items-center mb-1">
          <span className="text-xs font-bold text-gray-100">{c.cls}</span>
          <span className="text-[9px] px-1.5 py-px rounded text-white" style={{ background: badge?.bg }}>{c.typ}</span>
          <span className="text-[9px] text-gray-500">{c.day} {c.from}–{c.to} · KW {selection.week}</span>
        </div>
        <div className="text-sm text-gray-200">{selection.title}</div>
        {/* Tags */}
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {effectiveDetail.subjectArea && (
            <span className={`text-[8px] px-1 py-px rounded border ${!detail.subjectArea && parentBlock?.subjectArea ? 'opacity-60' : ''}`}
              style={{ borderColor: SUBJECT_AREAS.find(s => s.key === effectiveDetail.subjectArea)?.color, color: SUBJECT_AREAS.find(s => s.key === effectiveDetail.subjectArea)?.color }}
              title={!detail.subjectArea && parentBlock?.subjectArea ? 'Vom Block geerbt' : undefined}>
              {effectiveDetail.subjectArea}
            </span>
          )}
          {effectiveDetail.taxonomyLevel && <span className={`text-[8px] px-1 py-px rounded border border-amber-600 text-amber-400 ${!detail.taxonomyLevel && parentBlock?.taxonomyLevel ? 'opacity-60' : ''}`}>{effectiveDetail.taxonomyLevel}</span>}
          {detail.blockType && detail.blockType !== 'LESSON' && (
            <span className="text-[8px] px-1 py-px rounded border border-gray-600 text-gray-400">
              {BLOCK_TYPES.find(b => b.key === detail.blockType)?.icon} {BLOCK_TYPES.find(b => b.key === detail.blockType)?.label}
            </span>
          )}
          {seqInfo && (
            <span className="text-[8px] px-1 py-px rounded border cursor-pointer hover:opacity-80"
              style={{ borderColor: seqInfo.color || '#16a34a', color: seqInfo.color || '#4ade80' }}
              onClick={() => {
                if (parentSeq) {
                  usePlannerStore.getState().setEditingSequenceId(parentSeq.id);
                  usePlannerStore.getState().setSidePanelTab('sequences');
                }
              }}
              title="Zur Sequenz wechseln">
              ▧ {seqInfo.label} ({seqInfo.index + 1}/{seqInfo.total})
            </span>
          )}
        </div>
      </div>
      <hr className="border-slate-700" />
      {/* Form fields */}
      <div className="space-y-2.5">
        <div>
          <label className="text-[9px] text-gray-500 font-medium mb-1 block">Fachbereich</label>
          <PillSelect options={SUBJECT_AREAS.map(s => s.key)} value={detail.subjectArea}
            onChange={(v) => updateField('subjectArea', v)}
            renderOption={(v) => { const s = SUBJECT_AREAS.find(x => x.key === v)!; return { label: s.label, color: s.color }; }} />
        </div>
        <div>
          <label className="text-[9px] text-gray-500 font-medium mb-1 block">Block-Typ</label>
          <PillSelect options={BLOCK_TYPES.map(b => b.key)} value={detail.blockType}
            onChange={(v) => updateField('blockType', v)}
            renderOption={(v) => { const b = BLOCK_TYPES.find(x => x.key === v)!; return { label: b.label, icon: b.icon }; }} />
        </div>
        <div>
          <label className="text-[9px] text-gray-500 font-medium mb-1 block">Taxonomiestufe</label>
          <PillSelect options={TAXONOMY_LEVELS.map(t => t.key)} value={detail.taxonomyLevel}
            onChange={(v) => updateField('taxonomyLevel', v)}
            renderOption={(v) => { const t = TAXONOMY_LEVELS.find(x => x.key === v)!; return { label: t.label, color: '#d97706' }; }} />
        </div>
        <div>
          <label className="text-[9px] text-gray-500 font-medium mb-1 block">Thema</label>
          {parentBlock?.topicMain && !detail.topicMain && (
            <div className="text-[8px] text-blue-400/60 mb-0.5">↳ Block: {parentBlock.topicMain}</div>
          )}
          <input value={detail.topicMain || ''} onChange={(e) => updateField('topicMain', e.target.value)}
            placeholder={effectiveDetail.topicMain || 'Hauptthema…'}
            className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400" />
          <input value={detail.topicSub || ''} onChange={(e) => updateField('topicSub', e.target.value)}
            placeholder={effectiveDetail.topicSub || 'Unterthema (optional)…'}
            className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400 mt-1" />
        </div>
        <div>
          <label className="text-[9px] text-gray-500 font-medium mb-1 block">Lehrplanziel (LP17)</label>
          {parentBlock?.curriculumGoal && !detail.curriculumGoal && (
            <div className="text-[8px] text-blue-400/60 mb-0.5">↳ Block: {parentBlock.curriculumGoal}</div>
          )}
          <CurriculumGoalPicker value={detail.curriculumGoal || effectiveDetail.curriculumGoal} onChange={(v) => updateField('curriculumGoal', v)} subjectArea={effectiveDetail.subjectArea} />
        </div>
        <div>
          <label className="text-[9px] text-gray-500 font-medium mb-1 block">LearningView</label>
          <div className="flex gap-1">
            <input value={detail.learningviewUrl || ''} onChange={(e) => updateField('learningviewUrl', e.target.value)}
              placeholder="https://learningview.org/…"
              className="flex-1 bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400" />
            {detail.learningviewUrl && (
              <a href={detail.learningviewUrl} target="_blank" rel="noopener noreferrer"
                className="px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[9px] shrink-0 no-underline" title="In LearningView öffnen">↗</a>
            )}
          </div>
        </div>
        <div>
          <label className="text-[9px] text-gray-500 font-medium mb-1 block">Material</label>
          <MaterialLinks links={detail.materialLinks || []} onChange={(links) => updateField('materialLinks', links)} />
        </div>
        <div>
          <label className="text-[9px] text-gray-500 font-medium mb-1 block">Notizen</label>
          <textarea value={detail.notes || ''} onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Notizen, Hinweise…" rows={3}
            className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400 resize-y" />
        </div>
      </div>
    </div>
  );
}

export function DetailPanel() {
  const {
    sidePanelOpen, setSidePanelOpen,
    sidePanelTab, setSidePanelTab,
    selection, setSelection,
    sequencePanelOpen,
  } = usePlannerStore();
  const panelRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    if (!sidePanelOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // Don't close if clicking on the main grid (those clicks are handled by grid handlers)
        const target = e.target as HTMLElement;
        if (target.closest('table') || target.closest('.app-header')) return;
        setSidePanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sidePanelOpen, setSidePanelOpen]);

  // Also show panel if old sequencePanelOpen is true (backwards compat)
  const isOpen = sidePanelOpen || sequencePanelOpen;

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="fixed right-0 top-0 bottom-0 w-[340px] bg-slate-900 border-l border-slate-700 z-[65] flex flex-col shadow-[-4px_0_16px_rgba(0,0,0,0.4)]"
    >
      {/* Tab header */}
      <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between shrink-0">
        <div className="flex gap-1">
          <button
            onClick={() => setSidePanelTab('details')}
            className={`px-2.5 py-1 rounded text-[10px] font-semibold border cursor-pointer transition-colors ${
              sidePanelTab === 'details'
                ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                : 'border-gray-700 text-gray-500 hover:text-gray-300'
            }`}
            title="Lektionsdetails anzeigen"
          >
            📖 Details
          </button>
          <button
            onClick={() => setSidePanelTab('sequences')}
            className={`px-2.5 py-1 rounded text-[10px] font-semibold border cursor-pointer transition-colors ${
              sidePanelTab === 'sequences'
                ? 'bg-green-500/20 border-green-500 text-green-300'
                : 'border-gray-700 text-gray-500 hover:text-gray-300'
            }`}
            title="Sequenzen verwalten"
          >
            ▧ Sequenzen
          </button>
        </div>
        <button
          onClick={() => {
            setSidePanelOpen(false);
            usePlannerStore.getState().setSequencePanelOpen(false);
          }}
          className="text-gray-500 hover:text-gray-300 cursor-pointer text-xs px-1"
          title="Panel schliessen (Esc)"
        >
          ✕
        </button>
      </div>

      {/* Tab content */}
      {sidePanelTab === 'details' ? (
        <DetailsTab />
      ) : (
        <SequencePanel embedded />
      )}
    </div>
  );
}
