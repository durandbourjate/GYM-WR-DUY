import { useState, useCallback, useMemo } from 'react';
import type { CourseType, DayOfWeek, Semester } from '../types';
import { usePlannerStore } from '../store/plannerStore';
import {
  loadSettings, saveSettings, getDefaultSettings, generateId,
  importCurrentCourses, importCurrentHolidays, importCurrentSpecialWeeks,
  applySettingsToWeekData,
  type PlannerSettings, type CourseConfig, type SpecialWeekConfig, type HolidayConfig,
} from '../store/settingsStore';

const DAYS: DayOfWeek[] = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];
const COURSE_TYPES: { key: CourseType; label: string }[] = [
  { key: 'SF', label: 'SF' }, { key: 'EWR', label: 'EWR' },
  { key: 'EF', label: 'EF' }, { key: 'KS', label: 'KS' }, { key: 'IN', label: 'IN' },
];

// === Helper Components ===
function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 text-left text-[11px] font-semibold text-gray-200 bg-slate-800 hover:bg-slate-750 cursor-pointer flex items-center justify-between">
        {title}
        <span className="text-gray-400">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="p-3 space-y-2 bg-slate-900/50">{children}</div>}
    </div>
  );
}

function SmallInput({ value, onChange, placeholder, className = '', type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string; type?: string;
}) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type}
      className={`bg-slate-700 text-slate-200 border border-slate-600 rounded px-1.5 py-0.5 text-[9px] outline-none focus:border-blue-400 ${className}`} />
  );
}

function SmallSelect<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void; options: { key: T; label: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)}
      className="bg-slate-700 text-slate-200 border border-slate-600 rounded px-1 py-0.5 text-[9px] outline-none focus:border-blue-400 cursor-pointer">
      {options.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
    </select>
  );
}

// === Course Editor ===
function CourseEditor({ courses, onChange }: { courses: CourseConfig[]; onChange: (c: CourseConfig[]) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addCourse = () => {
    const newCourse: CourseConfig = {
      id: generateId(), cls: '', typ: 'SF', day: 'Mo',
      from: '08:05', to: '08:50', les: 1, hk: false, semesters: [1, 2],
    };
    onChange([...courses, newCourse]);
    setEditingId(newCourse.id);
  };

  const updateCourse = (id: string, patch: Partial<CourseConfig>) => {
    onChange(courses.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  const removeCourse = (id: string) => {
    if (confirm('Kurs wirklich entfernen?')) {
      onChange(courses.filter(c => c.id !== id));
      if (editingId === id) setEditingId(null);
    }
  };

  // Group by class+type — use stable ID-based group keys to prevent focus loss on edit
  const grouped = useMemo(() => {
    const groups: { key: string; stableKey: string; courses: CourseConfig[] }[] = [];
    const seen = new Map<string, number>();
    for (const c of courses) {
      const groupLabel = `${c.cls}|${c.typ}`;
      if (seen.has(groupLabel)) {
        groups[seen.get(groupLabel)!].courses.push(c);
      } else {
        seen.set(groupLabel, groups.length);
        groups.push({ key: groupLabel, stableKey: c.id, courses: [c] });
      }
    }
    return groups;
  }, [courses]);

  return (
    <div className="space-y-2">
      {grouped.map(({ stableKey, courses: group }) => (
        <div key={stableKey} className="border border-slate-700/50 rounded p-2 space-y-1">
          <div className="text-[9px] font-semibold text-gray-300">
            {group[0].cls || '(neu)'} <span className="text-blue-400">{group[0].typ}</span>
          </div>
          {group.map(c => (
            <div key={c.id}>
              {editingId === c.id ? (
                <div className="space-y-1 bg-slate-800 rounded p-2">
                  <div className="flex gap-1 flex-wrap">
                    <SmallInput value={c.cls} onChange={(v) => updateCourse(c.id, { cls: v })} placeholder="Klasse" className="w-20" />
                    <SmallSelect value={c.typ} onChange={(v) => updateCourse(c.id, { typ: v })} options={COURSE_TYPES} />
                    <SmallSelect value={c.day} onChange={(v) => updateCourse(c.id, { day: v })} options={DAYS.map(d => ({ key: d, label: d }))} />
                  </div>
                  <div className="flex gap-1 items-center">
                    <SmallInput value={c.from} onChange={(v) => updateCourse(c.id, { from: v })} placeholder="08:05" className="w-14" type="time" />
                    <span className="text-[8px] text-gray-400">–</span>
                    <SmallInput value={c.to} onChange={(v) => updateCourse(c.id, { to: v })} placeholder="08:50" className="w-14" type="time" />
                    <SmallSelect value={String(c.les) as any} onChange={(v) => updateCourse(c.id, { les: Number(v) })}
                      options={[{ key: '1', label: '1L' }, { key: '2', label: '2L' }, { key: '3', label: '3L' }]} />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="flex items-center gap-1 text-[8px] text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={c.hk} onChange={(e) => updateCourse(c.id, { hk: e.target.checked })} className="cursor-pointer" />
                      HK
                    </label>
                    <label className="flex items-center gap-1 text-[8px] text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={c.semesters.includes(1)} onChange={(e) => {
                        const s = e.target.checked ? [...new Set([...c.semesters, 1 as Semester])] : c.semesters.filter(x => x !== 1);
                        updateCourse(c.id, { semesters: s });
                      }} className="cursor-pointer" />
                      S1
                    </label>
                    <label className="flex items-center gap-1 text-[8px] text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={c.semesters.includes(2)} onChange={(e) => {
                        const s = e.target.checked ? [...new Set([...c.semesters, 2 as Semester])] : c.semesters.filter(x => x !== 2);
                        updateCourse(c.id, { semesters: s });
                      }} className="cursor-pointer" />
                      S2
                    </label>
                  </div>
                  <SmallInput value={c.note || ''} onChange={(v) => updateCourse(c.id, { note: v || undefined })} placeholder="Bemerkung (optional)" className="w-full" />
                  <div className="flex gap-1 mt-1">
                    <button onClick={() => setEditingId(null)} className="text-[8px] text-blue-400 cursor-pointer">✓ Fertig</button>
                    <button onClick={() => removeCourse(c.id)} className="text-[8px] text-red-400 cursor-pointer ml-auto">Entfernen</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[9px] text-gray-400 hover:text-gray-200 cursor-pointer group"
                  onClick={() => setEditingId(c.id)}>
                  <span className="text-gray-400 font-mono">{c.day}</span>
                  <span>{c.from}–{c.to}</span>
                  <span className="text-gray-500">{c.les}L{c.hk ? ' HK' : ''}</span>
                  <span className="text-gray-500">{c.semesters.map(s => `S${s}`).join('+')}</span>
                  {c.note && <span className="text-amber-600 text-[8px]">{c.note}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      <button onClick={addCourse}
        className="w-full py-1.5 rounded border border-dashed border-gray-600 text-gray-400 hover:text-gray-300 hover:border-gray-400 text-[9px] cursor-pointer transition-all">
        + Kurs hinzufügen
      </button>
    </div>
  );
}

// === Special Weeks Editor ===
function SpecialWeeksEditor({ weeks, courses, onChange }: {
  weeks: SpecialWeekConfig[]; courses: CourseConfig[]; onChange: (w: SpecialWeekConfig[]) => void;
}) {
  const addWeek = () => {
    onChange([...weeks, { id: generateId(), label: '', week: '', type: 'event' }]);
  };

  const update = (id: string, patch: Partial<SpecialWeekConfig>) => {
    onChange(weeks.map(w => w.id === id ? { ...w, ...patch } : w));
  };

  const remove = (id: string) => {
    onChange(weeks.filter(w => w.id !== id));
  };

  return (
    <div className="space-y-1.5">
      <p className="text-[8px] text-gray-400">Sonderwochen gelten standardmässig für alle Kurse. Einzelne Kurse können ausgenommen werden.</p>
      {weeks.map(w => (
        <div key={w.id} className="bg-slate-800 rounded p-2 space-y-1">
          <div className="flex gap-1 items-center">
            <SmallInput value={w.label} onChange={(v) => update(w.id, { label: v })} placeholder="Bezeichnung (z.B. IW, Studienreise)" className="flex-1" />
            <SmallInput value={w.week} onChange={(v) => update(w.id, { week: v })} placeholder="KW" className="w-10" />
            <SmallSelect value={w.type} onChange={(v) => update(w.id, { type: v })}
              options={[{ key: 'event', label: '📅 Event' }, { key: 'holiday', label: '🏖 Frei' }]} />
            <button onClick={() => remove(w.id)} className="text-[8px] text-red-400 cursor-pointer">✕</button>
          </div>
          {courses.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-[7px] text-gray-400">Ausgenommen:</span>
              {courses.map(c => {
                const excluded = w.excludedCourseIds?.includes(c.id);
                return (
                  <button key={c.id} onClick={() => {
                    const current = w.excludedCourseIds || [];
                    update(w.id, {
                      excludedCourseIds: excluded ? current.filter(x => x !== c.id) : [...current, c.id]
                    });
                  }}
                    className={`text-[7px] px-1 py-px rounded cursor-pointer ${excluded ? 'bg-red-900/40 text-red-300 border border-red-500/50' : 'bg-slate-700 text-gray-400 border border-transparent'}`}>
                    {c.cls} {c.day}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
      <button onClick={addWeek}
        className="w-full py-1 rounded border border-dashed border-gray-600 text-gray-400 hover:text-gray-300 text-[9px] cursor-pointer">
        + Sonderwoche hinzufügen
      </button>
    </div>
  );
}

// === Holidays Editor ===
function HolidaysEditor({ holidays, onChange }: { holidays: HolidayConfig[]; onChange: (h: HolidayConfig[]) => void }) {
  const addHoliday = () => {
    onChange([...holidays, { id: generateId(), label: '', startWeek: '', endWeek: '' }]);
  };

  const update = (id: string, patch: Partial<HolidayConfig>) => {
    onChange(holidays.map(h => h.id === id ? { ...h, ...patch } : h));
  };

  const remove = (id: string) => {
    onChange(holidays.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-1.5">
      {holidays.map(h => (
        <div key={h.id} className="flex gap-1 items-center">
          <SmallInput value={h.label} onChange={(v) => update(h.id, { label: v })} placeholder="Name (z.B. Herbstferien)" className="flex-1" />
          <span className="text-[8px] text-gray-400">KW</span>
          <SmallInput value={h.startWeek} onChange={(v) => update(h.id, { startWeek: v })} placeholder="von" className="w-10" />
          <span className="text-[8px] text-gray-400">–</span>
          <SmallInput value={h.endWeek} onChange={(v) => update(h.id, { endWeek: v })} placeholder="bis" className="w-10" />
          <button onClick={() => remove(h.id)} className="text-[8px] text-red-400 cursor-pointer">✕</button>
        </div>
      ))}
      <button onClick={addHoliday}
        className="w-full py-1 rounded border border-dashed border-gray-600 text-gray-400 hover:text-gray-300 text-[9px] cursor-pointer">
        + Ferienperiode hinzufügen
      </button>
    </div>
  );
}

// === Apply Settings to Weeks ===
function ApplySettingsButton({ settings }: { settings: PlannerSettings }) {
  const [result, setResult] = useState<{ holidays: number; specials: number } | null>(null);

  const applyToWeeks = () => {
    const store = usePlannerStore.getState();
    const applied = applySettingsToWeekData(store.weekData, settings);
    store.pushUndo();
    store.setWeekData(applied.weekData);
    setResult({ holidays: applied.holidayWeeks, specials: applied.specialWeeks });
    setTimeout(() => setResult(null), 4000);
  };

  const totalEntries = settings.holidays.length + settings.specialWeeks.length;

  return (
    <div className="space-y-1.5">
      <div className="text-[8px] text-gray-400">
        {settings.holidays.length} Ferienperioden · {settings.specialWeeks.length} Sonderwochen konfiguriert
      </div>
      <p className="text-[8px] text-green-400/70">
        ✓ Ferien und Sonderwochen werden bei der Initialisierung automatisch angewendet.
      </p>
      <button onClick={() => {
        if (totalEntries === 0) { alert('Keine Ferien oder Sonderwochen konfiguriert.'); return; }
        if (confirm(`${totalEntries} Einträge (Ferien + Sonderwochen) erneut in die Planerdaten übernehmen? Bestehende Einträge werden überschrieben. (Undo möglich)`)) {
          applyToWeeks();
        }
      }}
        className="w-full py-1.5 rounded text-[9px] font-medium bg-amber-700 hover:bg-amber-600 text-white cursor-pointer transition-all disabled:bg-slate-700 disabled:text-gray-400 disabled:cursor-not-allowed"
        disabled={totalEntries === 0}>
        🔄 Ferien & Sonderwochen erneut eintragen
      </button>
      {result && (
        <div className="text-[8px] p-1.5 rounded bg-green-900/30 text-green-300">
          ✅ {result.holidays} Ferienwochen und {result.specials} Sonderwochen eingetragen. Undo verfügbar.
        </div>
      )}
    </div>
  );
}

// === Main Settings Panel ===
export function SettingsPanel() {
  const storeSettings = usePlannerStore(s => s.plannerSettings);
  const setPlannerSettings = usePlannerStore(s => s.setPlannerSettings);

  const [settings, setSettings] = useState<PlannerSettings>(() => {
    // Priority: store settings > global settings > defaults
    if (storeSettings) return storeSettings;
    const global = loadSettings();
    if (global) return global;
    return getDefaultSettings();
  });
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateSettings = useCallback((patch: Partial<PlannerSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      return next;
    });
    setDirty(true);
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    // Save to store (per-instance) — this is the primary path
    setPlannerSettings(settings);
    // Also save to global localStorage for backward compat
    saveSettings(settings);
    // Auto-apply holidays & special weeks to weekData
    const store = usePlannerStore.getState();
    if (store.weekData.length > 0 && (settings.holidays.length > 0 || settings.specialWeeks.length > 0)) {
      const applied = applySettingsToWeekData(store.weekData, settings);
      store.pushUndo();
      store.setWeekData(applied.weekData);
    }
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [settings, setPlannerSettings]);

  const handleReset = useCallback(() => {
    if (confirm('Alle Einstellungen zurücksetzen? Die bestehende Planung bleibt erhalten.')) {
      const fresh = getDefaultSettings();
      setSettings(fresh);
      setPlannerSettings(fresh);
      saveSettings(fresh);
      setDirty(false);
    }
  }, [setPlannerSettings]);

  const hasCustomSettings = storeSettings !== null || loadSettings() !== null;

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[11px] font-bold text-gray-200">Einstellungen</h3>
          <p className="text-[8px] text-gray-400 mt-0.5">
            {hasCustomSettings ? 'Eigene Konfiguration aktiv' : 'Standard-Konfiguration (DUY SJ 25/26)'}
          </p>
        </div>
        <div className="flex gap-1">
          {dirty && (
            <button onClick={handleSave}
              className="px-2 py-0.5 rounded text-[9px] font-medium bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-all">
              💾 Speichern
            </button>
          )}
          {saved && <span className="text-[9px] text-green-400">✓ Gespeichert</span>}
        </div>
      </div>

      {/* Import from hardcoded data */}
      {settings.courses.length === 0 && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
          <p className="text-[9px] text-blue-300 mb-2">Keine Kurse konfiguriert. Du kannst den aktuellen Stundenplan importieren oder von Grund auf neu anfangen.</p>
          <button onClick={() => {
            const courses = importCurrentCourses();
            const holidays = importCurrentHolidays();
            const specialWeeks = importCurrentSpecialWeeks();
            updateSettings({ courses, holidays, specialWeeks });
          }}
            className="px-3 py-1 rounded text-[9px] font-medium bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-all">
            📋 Aktuellen Stundenplan (DUY SJ 25/26) importieren
          </button>
        </div>
      )}

      {/* School basics */}
      <Section title="🏫 Schule & Grundeinstellungen" defaultOpen>
        <div className="space-y-1.5">
          <div>
            <label className="text-[8px] text-gray-400 mb-0.5 block">Schulname (optional)</label>
            <SmallInput value={settings.school?.name || ''} onChange={(v) => updateSettings({ school: { ...settings.school!, name: v } })} placeholder="z.B. Gymnasium Hofwil" className="w-full" />
          </div>
          <div>
            <label className="text-[8px] text-gray-400 mb-0.5 block">Standard-Lektionsdauer (Minuten)</label>
            <SmallInput value={String(settings.school?.lessonDurationMin || 45)} onChange={(v) => {
              const n = parseInt(v) || 45;
              updateSettings({ school: { ...settings.school!, lessonDurationMin: n } });
            }} placeholder="45" className="w-16" type="number" />
          </div>
        </div>
      </Section>

      {/* Courses */}
      <Section title={`📚 Kurse / Stundenplan (${settings.courses.length})`}>
        <CourseEditor courses={settings.courses} onChange={(c) => updateSettings({ courses: c })} />
      </Section>

      {/* Special Weeks */}
      <Section title={`📅 Sonderwochen (${settings.specialWeeks.length})`}>
        <SpecialWeeksEditor weeks={settings.specialWeeks} courses={settings.courses} onChange={(w) => updateSettings({ specialWeeks: w })} />
      </Section>

      {/* Holidays */}
      <Section title={`🏖 Ferien (${settings.holidays.length})`}>
        <HolidaysEditor holidays={settings.holidays} onChange={(h) => updateSettings({ holidays: h })} />
      </Section>

      {/* Apply settings to planner */}
      <Section title="⚡ Einstellungen anwenden">
        <div className="space-y-2">
          <p className="text-[8px] text-gray-400">
            Ferien und Sonderwochen aus den Einstellungen in die Planerdaten übernehmen. Bestehende Einträge in betroffenen Wochen werden überschrieben.
          </p>
          <ApplySettingsButton settings={settings} />
        </div>
      </Section>

      {/* Export / Import JSON */}
      <Section title="💾 Daten exportieren / importieren">
        <div className="space-y-3">
          <div>
            <p className="text-[8px] text-gray-400 font-semibold mb-1">Einstellungen (Kurse, Ferien, Sonderwochen)</p>
            <div className="flex gap-1">
              <button onClick={() => {
                const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'unterrichtsplaner-settings.json'; a.click();
                URL.revokeObjectURL(url);
              }}
                className="flex-1 py-1.5 rounded text-[9px] font-medium bg-slate-700 hover:bg-slate-600 text-gray-200 cursor-pointer transition-all">
                ⬇ Export
              </button>
              <label className="flex-1 py-1.5 rounded text-[9px] font-medium bg-slate-700 hover:bg-slate-600 text-gray-200 text-center cursor-pointer transition-all">
                ⬆ Import
                <input type="file" accept=".json" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    try {
                      const imported = JSON.parse(reader.result as string) as PlannerSettings;
                      if (imported.version && imported.courses) {
                        setSettings(imported);
                        setDirty(true);
                      } else {
                        alert('Ungültige Datei: Keine gültigen Einstellungen gefunden.');
                      }
                    } catch { alert('Fehler beim Lesen der Datei.'); }
                  };
                  reader.readAsText(file);
                }} />
              </label>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-2">
            <p className="text-[8px] text-gray-400 font-semibold mb-1">Planerdaten (Lektionen, Sequenzen, Details)</p>
            <div className="flex gap-1">
              <button onClick={() => {
                const json = usePlannerStore.getState().exportData();
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `unterrichtsplaner-daten-${new Date().toISOString().slice(0, 10)}.json`; a.click();
                URL.revokeObjectURL(url);
              }}
                className="flex-1 py-1.5 rounded text-[9px] font-medium bg-slate-700 hover:bg-slate-600 text-gray-200 cursor-pointer transition-all">
                ⬇ Export
              </button>
              <label className="flex-1 py-1.5 rounded text-[9px] font-medium bg-slate-700 hover:bg-slate-600 text-gray-200 text-center cursor-pointer transition-all">
                ⬆ Import
                <input type="file" accept=".json" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    try {
                      const success = usePlannerStore.getState().importData(reader.result as string);
                      if (success) {
                        alert('Planerdaten erfolgreich importiert.');
                      } else {
                        alert('Ungültige Datei: Keine gültigen Planerdaten gefunden.');
                      }
                    } catch { alert('Fehler beim Lesen der Datei.'); }
                  };
                  reader.readAsText(file);
                }} />
              </label>
            </div>
          </div>
        </div>
      </Section>

      {/* Danger zone */}
      <div className="pt-2 border-t border-slate-700">
        <button onClick={handleReset}
          className="text-[9px] text-red-400 hover:text-red-300 cursor-pointer">
          ⚠ Einstellungen zurücksetzen
        </button>
      </div>
    </div>
  );
}
