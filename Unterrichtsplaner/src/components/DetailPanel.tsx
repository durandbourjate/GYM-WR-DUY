import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { TYPE_BADGES, getSequenceInfoFromStore } from '../utils/colors';
import { CurriculumGoalPicker } from './CurriculumGoalPicker';
import { SequencePanel } from './SequencePanel';
import { suggestGoals } from '../utils/autoSuggest';
import type { SubjectArea, BlockCategory, LessonDetail, SolDetails } from '../types';

const SUBJECT_AREAS: { key: SubjectArea; label: string; color: string }[] = [
  { key: 'BWL', label: 'BWL', color: '#3b82f6' },
  { key: 'VWL', label: 'VWL', color: '#f97316' },
  { key: 'RECHT', label: 'Recht', color: '#22c55e' },
  { key: 'IN', label: 'Informatik', color: '#6b7280' },
  { key: 'INTERDISZ', label: 'Interdisziplinär', color: '#a855f7' },
];

// === Block-Kategorie / Untertyp-System ===
interface CategoryDef {
  key: BlockCategory;
  label: string;
  labelShort: string;
  icon: string;
  color: string;
}

interface SubtypeDef {
  key: string;
  label: string;
  labelShort: string;
  icon: string;
  custom?: boolean;
}

const CATEGORIES: CategoryDef[] = [
  { key: 'LESSON', label: 'Lektion', labelShort: 'Lekt.', icon: '📖', color: '#3b82f6' },
  { key: 'ASSESSMENT', label: 'Beurteilung', labelShort: 'Beurt.', icon: '📝', color: '#ef4444' },
  { key: 'EVENT', label: 'Event', labelShort: 'Event', icon: '📅', color: '#f59e0b' },
  { key: 'HOLIDAY', label: 'Ferien/Frei', labelShort: 'Frei', icon: '🏖', color: '#6b7280' },
];

const DEFAULT_SUBTYPES: Record<BlockCategory, SubtypeDef[]> = {
  LESSON: [
    { key: 'einfuehrung', label: 'Einführung', labelShort: 'Einf.', icon: '🚀' },
    { key: 'theorie', label: 'Theorie', labelShort: 'Theo.', icon: '📘' },
    { key: 'uebung', label: 'Übung', labelShort: 'Übg.', icon: '✏️' },
    { key: 'sol', label: 'Selbstorganisiertes Lernen', labelShort: 'SOL', icon: '📚' },
    { key: 'diskussion', label: 'Diskussion', labelShort: 'Disk.', icon: '💬' },
  ],
  ASSESSMENT: [
    { key: 'pruefung', label: 'Prüfung schriftlich', labelShort: 'Prüf.', icon: '📝' },
    { key: 'pruefung_muendlich', label: 'Prüfung mündlich', labelShort: 'Mdl.', icon: '🎤' },
    { key: 'praesentation', label: 'Präsentation', labelShort: 'Präs.', icon: '🎯' },
    { key: 'projektabgabe', label: 'Projektabgabe', labelShort: 'Proj.', icon: '📦' },
  ],
  EVENT: [
    { key: 'exkursion', label: 'Exkursion', labelShort: 'Exk.', icon: '🚌' },
    { key: 'tag_offen', label: 'Tag der offenen Tür', labelShort: 'TdoT', icon: '🏫' },
    { key: 'ausfall', label: 'Ausfall', labelShort: 'Ausf.', icon: '❌' },
    { key: 'auftrag', label: 'Auftrag', labelShort: 'Auftr.', icon: '📋' },
  ],
  HOLIDAY: [],
};

// Custom subtypes persistence
const CUSTOM_SUBTYPES_KEY = 'unterrichtsplaner-custom-subtypes';

function loadCustomSubtypes(): Record<string, SubtypeDef[]> {
  try {
    const data = localStorage.getItem(CUSTOM_SUBTYPES_KEY);
    return data ? JSON.parse(data) : {};
  } catch { return {}; }
}

function saveCustomSubtypes(custom: Record<string, SubtypeDef[]>) {
  localStorage.setItem(CUSTOM_SUBTYPES_KEY, JSON.stringify(custom));
}

function getSubtypesForCategory(category: BlockCategory): SubtypeDef[] {
  const defaults = DEFAULT_SUBTYPES[category] || [];
  const custom = loadCustomSubtypes();
  const customForCat = (custom[category] || []).map(s => ({ ...s, custom: true }));
  return [...defaults, ...customForCat];
}

// Migration helper: old BlockType → new category + subtype
function migrateBlockType(blockType?: string): { category?: BlockCategory; subtype?: string } {
  if (!blockType) return {};
  const map: Record<string, { category: BlockCategory; subtype?: string }> = {
    'LESSON': { category: 'LESSON' },
    'INTRO': { category: 'LESSON', subtype: 'einfuehrung' },
    'SELF_STUDY': { category: 'LESSON', subtype: 'sol' },
    'DISCUSSION': { category: 'LESSON', subtype: 'diskussion' },
    'EXAM': { category: 'ASSESSMENT', subtype: 'pruefung' },
    'EXAM_ORAL': { category: 'ASSESSMENT', subtype: 'pruefung_muendlich' },
    'EXAM_LONG': { category: 'ASSESSMENT', subtype: 'pruefung' },
    'PRESENTATION': { category: 'ASSESSMENT', subtype: 'praesentation' },
    'PROJECT_DUE': { category: 'ASSESSMENT', subtype: 'projektabgabe' },
    'EVENT': { category: 'EVENT' },
    'HOLIDAY': { category: 'HOLIDAY' },
  };
  return map[blockType] || {};
}

// Get effective category/subtype from detail (with migration)
function getEffectiveCategorySubtype(detail: LessonDetail): { category?: BlockCategory; subtype?: string } {
  if (detail.blockCategory) return { category: detail.blockCategory, subtype: detail.blockSubtype };
  return migrateBlockType(detail.blockType);
}

// Format display labels
function getCategoryLabel(category: BlockCategory, long = true): string {
  const cat = CATEGORIES.find(c => c.key === category);
  return cat ? (long ? cat.label : cat.labelShort) : category;
}

function getSubtypeLabel(category: BlockCategory, subtype: string, long = true): string {
  const subtypes = getSubtypesForCategory(category);
  const st = subtypes.find(s => s.key === subtype);
  return st ? (long ? st.label : st.labelShort) : subtype;
}

// Export for use in WeekRows etc.
export { CATEGORIES, getSubtypesForCategory, getEffectiveCategorySubtype, getCategoryLabel, getSubtypeLabel };

// === Duration presets ===
const DURATION_PRESETS = [
  { key: '45 min', label: '45 min' },
  { key: '90 min', label: '90 min' },
  { key: '135 min', label: '135 min' },
  { key: 'Halbtag', label: 'Halbtag' },
  { key: 'Ganztag', label: 'Ganztag' },
];

// === Components ===

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

function CategorySubtypeSelector({
  category, subtype, onChangeCategory, onChangeSubtype,
}: {
  category?: BlockCategory;
  subtype?: string;
  onChangeCategory: (v: BlockCategory | undefined) => void;
  onChangeSubtype: (v: string | undefined) => void;
}) {
  const [addingCustom, setAddingCustom] = useState(false);
  const [customLabel, setCustomLabel] = useState('');
  const effectiveCategory = category || 'LESSON';
  const subtypes = getSubtypesForCategory(effectiveCategory);

  const handleAddCustom = () => {
    if (!customLabel.trim()) return;
    const key = customLabel.trim().toLowerCase().replace(/[^a-z0-9äöü]/g, '_');
    const custom = loadCustomSubtypes();
    if (!custom[effectiveCategory]) custom[effectiveCategory] = [];
    custom[effectiveCategory].push({
      key,
      label: customLabel.trim(),
      labelShort: customLabel.trim().slice(0, 5) + '.',
      icon: '🏷️',
    });
    saveCustomSubtypes(custom);
    onChangeSubtype(key);
    setCustomLabel('');
    setAddingCustom(false);
  };

  const handleRemoveCustom = (key: string) => {
    const custom = loadCustomSubtypes();
    if (custom[effectiveCategory]) {
      custom[effectiveCategory] = custom[effectiveCategory].filter(s => s.key !== key);
      saveCustomSubtypes(custom);
      if (subtype === key) onChangeSubtype(undefined);
    }
  };

  return (
    <div className="space-y-2">
      {/* Category row */}
      <div>
        <label className="text-[9px] text-gray-500 font-medium mb-1 block">Kategorie</label>
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((cat) => {
            const active = effectiveCategory === cat.key;
            return (
              <button key={cat.key}
                onClick={() => {
                  onChangeCategory(cat.key === 'LESSON' ? undefined : cat.key);
                  onChangeSubtype(undefined);
                }}
                className="px-1.5 py-0.5 rounded text-[9px] font-medium border cursor-pointer transition-all"
                style={{
                  background: active ? cat.color + '30' : 'transparent',
                  borderColor: active ? cat.color : '#374151',
                  color: active ? '#e5e7eb' : '#6b7280',
                }}>
                <span className="mr-0.5">{cat.icon}</span>{cat.label}
              </button>
            );
          })}
        </div>
      </div>
      {/* Subtype row (only if category has subtypes) */}
      {subtypes.length > 0 && (
        <div>
          <label className="text-[9px] text-gray-500 font-medium mb-1 block">Typ</label>
          <div className="flex flex-wrap gap-1">
            {subtypes.map((st) => {
              const active = subtype === st.key;
              const catDef = CATEGORIES.find(c => c.key === effectiveCategory);
              return (
                <div key={st.key} className="relative group inline-flex">
                  <button
                    onClick={() => onChangeSubtype(active ? undefined : st.key)}
                    className="px-1.5 py-0.5 rounded text-[9px] font-medium border cursor-pointer transition-all"
                    style={{
                      background: active ? (catDef?.color || '#3b82f6') + '20' : 'transparent',
                      borderColor: active ? (catDef?.color || '#3b82f6') + '80' : '#374151',
                      color: active ? '#d1d5db' : '#6b7280',
                    }}>
                    <span className="mr-0.5">{st.icon}</span>{st.label}
                  </button>
                  {st.custom && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveCustom(st.key); }}
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-600 text-white text-[7px] flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Eigenes Label entfernen"
                    >✕</button>
                  )}
                </div>
              );
            })}
            {/* Add custom button */}
            {addingCustom ? (
              <div className="flex gap-0.5 items-center">
                <input autoFocus value={customLabel} onChange={(e) => setCustomLabel(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustom(); if (e.key === 'Escape') setAddingCustom(false); }}
                  placeholder="Neues Label…"
                  className="bg-slate-700 text-slate-200 border border-blue-400 rounded px-1.5 py-0.5 text-[9px] outline-none w-24" />
                <button onClick={handleAddCustom} className="text-[9px] text-green-400 cursor-pointer">✓</button>
                <button onClick={() => setAddingCustom(false)} className="text-[9px] text-gray-500 cursor-pointer">✕</button>
              </div>
            ) : (
              <button onClick={() => setAddingCustom(true)}
                className="px-1.5 py-0.5 rounded text-[9px] border border-dashed border-gray-600 text-gray-500 hover:text-gray-300 hover:border-gray-400 cursor-pointer transition-all">
                + Eigenes
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DurationSelector({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) {
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const isPreset = value && DURATION_PRESETS.some(p => p.key === value);
  const isCustom = value && !isPreset;

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {DURATION_PRESETS.map((preset) => (
        <button key={preset.key}
          onClick={() => onChange(value === preset.key ? undefined : preset.key)}
          className={`px-1.5 py-0.5 rounded text-[9px] font-medium border cursor-pointer transition-all ${
            value === preset.key
              ? 'bg-slate-600/40 border-slate-500 text-gray-200'
              : 'border-gray-700 text-gray-500 hover:text-gray-300'
          }`}>
          {preset.label}
        </button>
      ))}
      {customMode || isCustom ? (
        <div className="flex gap-0.5 items-center">
          <input
            autoFocus={customMode}
            value={isCustom ? value : customValue}
            onChange={(e) => {
              if (isCustom) onChange(e.target.value || undefined);
              else setCustomValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customValue) { onChange(customValue); setCustomMode(false); }
              if (e.key === 'Escape') { setCustomMode(false); setCustomValue(''); }
            }}
            onBlur={() => { if (customValue) { onChange(customValue); } setCustomMode(false); }}
            placeholder="z.B. 60 min"
            className="bg-slate-700 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400 w-20" />
          {isCustom && (
            <button onClick={() => onChange(undefined)} className="text-[9px] text-gray-500 cursor-pointer hover:text-red-400">✕</button>
          )}
        </div>
      ) : (
        <button onClick={() => setCustomMode(true)}
          className="px-1.5 py-0.5 rounded text-[9px] border border-dashed border-gray-600 text-gray-500 hover:text-gray-300 cursor-pointer">
          Andere…
        </button>
      )}
    </div>
  );
}

function SolSection({ sol, onChange }: { sol?: SolDetails; onChange: (s: SolDetails) => void }) {
  const enabled = sol?.enabled ?? false;
  const update = (patch: Partial<SolDetails>) => onChange({ ...sol, enabled: true, ...patch });

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange({ ...sol, enabled: !enabled, topic: sol?.topic, description: sol?.description, materialLinks: sol?.materialLinks, duration: sol?.duration })}
          className={`px-2 py-0.5 rounded text-[9px] font-medium border cursor-pointer transition-all ${
            enabled ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'border-gray-600 text-gray-500 hover:text-gray-300'
          }`}
        >
          📚 {enabled ? 'SOL aktiv' : 'SOL hinzufügen'}
        </button>
        {enabled && sol?.duration && <span className="text-[8px] text-gray-500">{sol.duration}</span>}
      </div>
      {enabled && (
        <div className="pl-2 border-l-2 border-purple-500/30 space-y-1.5">
          <div>
            <label className="text-[8px] text-gray-500 mb-0.5 block">SOL-Thema</label>
            <input value={sol?.topic || ''} onChange={(e) => update({ topic: e.target.value })}
              placeholder="SOL-Thema…"
              className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-0.5 text-[9px] outline-none focus:border-purple-400" />
          </div>
          <div>
            <label className="text-[8px] text-gray-500 mb-0.5 block">SOL-Dauer</label>
            <DurationSelector value={sol?.duration} onChange={(v) => update({ duration: v })} />
          </div>
          <div>
            <label className="text-[8px] text-gray-500 mb-0.5 block">SOL-Beschreibung</label>
            <textarea value={sol?.description || ''} onChange={(e) => update({ description: e.target.value })}
              placeholder="Beschreibung, Auftrag…" rows={2}
              className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-0.5 text-[9px] outline-none focus:border-purple-400 resize-y" />
          </div>
          <div>
            <label className="text-[8px] text-gray-500 mb-0.5 block">SOL-Material</label>
            <MaterialLinks links={sol?.materialLinks || []} onChange={(links) => update({ materialLinks: links })} />
          </div>
        </div>
      )}
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
  } = usePlannerStore();

  const c = selection?.course;
  const detailKey = selection && c ? `${selection.week}-${c.col}` : '';
  const detail: LessonDetail = (detailKey && lessonDetails[detailKey]) || {};
  const currentWeek = selection ? weekData.find((w) => w.w === selection.week) : undefined;
  const currentLesson = c ? currentWeek?.lessons[c.col] : undefined;

  // Block inheritance: find parent block for this week and merge as defaults
  const parentBlock = selection && c ? (() => {
    for (const seq of sequences) {
      const matchesCourse = seq.courseId === c.id ||
        (seq.courseIds && seq.courseIds.includes(c.id));
      if (!matchesCourse) continue;
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
    blockCategory: detail.blockCategory,
    blockSubtype: detail.blockSubtype,
    blockType: detail.blockType,
    description: detail.description || parentBlock?.description,
    materialLinks: detail.materialLinks?.length ? detail.materialLinks : parentBlock?.materialLinks,
    learningviewUrl: detail.learningviewUrl,
    duration: detail.duration,
    notes: detail.notes,
  };

  // Get effective category/subtype (with legacy migration)
  const { category: effectiveCategory, subtype: effectiveSubtype } = getEffectiveCategorySubtype(effectiveDetail);

  const updateField = useCallback(
    <K extends keyof LessonDetail>(field: K, value: LessonDetail[K]) => {
      if (!selection || !c) return;
      updateLessonDetail(selection.week, c.col, { [field]: value });
    },
    [selection?.week, c?.col, updateLessonDetail]
  );

  const handleCategoryChange = useCallback((cat: BlockCategory | undefined) => {
    if (!selection || !c) return;
    updateLessonDetail(selection.week, c.col, {
      blockCategory: cat || 'LESSON',
      blockSubtype: undefined,
      blockType: undefined, // clear legacy
    });
  }, [selection?.week, c?.col, updateLessonDetail]);

  const handleSubtypeChange = useCallback((st: string | undefined) => {
    if (!selection || !c) return;
    updateLessonDetail(selection.week, c.col, {
      blockSubtype: st,
      blockCategory: effectiveCategory || 'LESSON',
      blockType: undefined, // clear legacy
    });
  }, [selection?.week, c?.col, updateLessonDetail, effectiveCategory]);

  // Auto-detect subjectArea from LessonType
  useEffect(() => {
    if (!selection || !c || detail.subjectArea || !currentLesson) return;
    const autoMap: Record<number, SubjectArea> = { 1: 'BWL', 2: 'RECHT', 3: 'IN' };
    const detected = autoMap[currentLesson.type];
    if (detected) updateLessonDetail(selection.week, c.col, { subjectArea: detected });
  }, [selection?.week, c?.col, currentLesson?.type, detail.subjectArea]);

  // Auto-suggest curriculum goals
  const goalSuggestions = useMemo(() => {
    const topic = detail.topicMain || effectiveDetail.topicMain;
    if (!topic || topic.length < 2) return [];
    return suggestGoals(topic, effectiveDetail.subjectArea, 3, 0.2);
  }, [detail.topicMain, effectiveDetail.topicMain, effectiveDetail.subjectArea]);

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
  const catDef = CATEGORIES.find(ct => ct.key === (effectiveCategory || 'LESSON'));
  const subtypes = effectiveCategory ? getSubtypesForCategory(effectiveCategory) : [];
  const subtypeDef = effectiveSubtype ? subtypes.find(s => s.key === effectiveSubtype) : null;

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
          {catDef && catDef.key !== 'LESSON' && (
            <span className="text-[8px] px-1 py-px rounded border" style={{ borderColor: catDef.color + '80', color: catDef.color }}>
              {catDef.icon} {catDef.label}
            </span>
          )}
          {subtypeDef && (
            <span className="text-[8px] px-1 py-px rounded border border-gray-600 text-gray-400">
              {subtypeDef.icon} {subtypeDef.label}
            </span>
          )}
          {effectiveDetail.duration && (
            <span className="text-[8px] px-1 py-px rounded border border-gray-600 text-gray-400">
              ⏱ {effectiveDetail.duration}
            </span>
          )}
          {detail.sol?.enabled && (
            <span className="text-[8px] px-1 py-px rounded border border-purple-500/50 text-purple-400">
              📚 SOL{detail.sol.duration ? ` (${detail.sol.duration})` : ''}
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
        <CategorySubtypeSelector
          category={effectiveCategory}
          subtype={effectiveSubtype}
          onChangeCategory={handleCategoryChange}
          onChangeSubtype={handleSubtypeChange}
        />
        <div>
          <label className="text-[9px] text-gray-500 font-medium mb-1 block">Dauer</label>
          <DurationSelector value={detail.duration} onChange={(v) => updateField('duration', v)} />
        </div>
        <div>
          <label className="text-[9px] text-gray-500 font-medium mb-1 block">SOL (Selbstorganisiertes Lernen)</label>
          <SolSection sol={detail.sol} onChange={(s) => updateField('sol', s)} />
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
          {goalSuggestions.length > 0 && !detail.curriculumGoal && !effectiveDetail.curriculumGoal && (
            <div className="mt-1.5 space-y-0.5">
              <span className="text-[8px] text-amber-500/70">💡 Vorgeschlagene Lehrplanziele:</span>
              {goalSuggestions.map(s => (
                <button key={s.goal.id}
                  onClick={() => updateField('curriculumGoal', `${s.goal.id}: ${s.goal.goal}`)}
                  className="w-full text-left px-1.5 py-1 rounded bg-amber-900/20 hover:bg-amber-900/40 border border-amber-700/30 hover:border-amber-600/50 transition-colors cursor-pointer"
                  title={`${s.matchReason}\nScore: ${(s.score * 100).toFixed(0)}%\n${s.goal.contents.join(', ')}`}>
                  <div className="flex items-center gap-1">
                    <span className="text-[7px] font-mono text-amber-400/80 shrink-0">{s.goal.id}</span>
                    <span className="text-[8px] text-amber-200/80 truncate">{s.goal.topic}</span>
                    <span className="text-[7px] text-amber-600/60 shrink-0 ml-auto">{(s.score * 100).toFixed(0)}%</span>
                  </div>
                </button>
              ))}
            </div>
          )}
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
    sequencePanelOpen,
  } = usePlannerStore();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sidePanelOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (target.closest('table') || target.closest('.app-header')) return;
        setSidePanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sidePanelOpen, setSidePanelOpen]);

  const isOpen = sidePanelOpen || sequencePanelOpen;
  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="fixed right-0 top-0 bottom-0 w-[340px] bg-slate-900 border-l border-slate-700 z-[65] flex flex-col shadow-[-4px_0_16px_rgba(0,0,0,0.4)]"
    >
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
      {sidePanelTab === 'details' ? <DetailsTab /> : <SequencePanel embedded />}
    </div>
  );
}
