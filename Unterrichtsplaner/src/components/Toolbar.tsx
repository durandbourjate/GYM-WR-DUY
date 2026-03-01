import { useState, useRef, useEffect, useCallback } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { StatsPanel } from './StatsPanel';
import { TaFPanel } from './TaFPanel';
import { ExcelImport } from './ExcelImport';
import { COURSES } from '../data/courses';
import type { FilterType } from '../types';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'ALL', label: 'Alle' },
  { key: 'SF', label: 'SF' },
  { key: 'EWR', label: 'EWR' },
  { key: 'IN', label: 'IN' },
  { key: 'KS', label: 'KS' },
];

function DataMenu() {
  const { exportData, importData } = usePlannerStore();
  const [open, setOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportStatus, setExportStatus] = useState<'idle' | 'done'>('idle');
  const menuRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleExport = useCallback(() => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `unterrichtsplaner-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportStatus('done');
    setTimeout(() => setExportStatus('idle'), 2000);
  }, [exportData]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(reader.result as string);
      setImportStatus(ok ? 'success' : 'error');
      setTimeout(() => setImportStatus('idle'), 2500);
    };
    reader.readAsText(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  }, [importData]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer transition-colors ${
          open ? 'bg-slate-800 border-gray-600 text-gray-300' : 'border-gray-700 text-gray-500 hover:text-gray-300'
        }`}
        title="Daten verwalten (Export/Import)"
      >
        💾
      </button>

      {open && (
        <div className="absolute right-0 top-8 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-[70] w-56 py-1">
          <div className="px-3 py-1.5 text-[9px] text-gray-500 border-b border-slate-700">
            Daten werden automatisch im Browser gespeichert (localStorage).
            Für ein Backup als Datei: Export nutzen.
          </div>

          {/* Export */}
          <button
            onClick={handleExport}
            className="w-full px-3 py-1.5 text-left text-[10px] hover:bg-slate-700 cursor-pointer flex items-center gap-2 text-gray-200"
          >
            <span>📥</span>
            <span>{exportStatus === 'done' ? '✓ Exportiert!' : 'Backup exportieren (JSON)'}</span>
          </button>

          {/* Import */}
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full px-3 py-1.5 text-left text-[10px] hover:bg-slate-700 cursor-pointer flex items-center gap-2 text-gray-200"
          >
            <span>📤</span>
            <span>
              {importStatus === 'success' ? '✓ Importiert!' :
               importStatus === 'error' ? '✗ Fehler beim Import' :
               'Backup importieren'}
            </span>
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

          {/* Reset warning */}
          <div className="border-t border-slate-700 mt-1 pt-1">
            <button
              onClick={() => {
                if (confirm('Alle Planungsdaten zurücksetzen? (Undo möglich mit ⌘Z)')) {
                  usePlannerStore.getState().pushUndo();
                  localStorage.removeItem('unterrichtsplaner-storage');
                  window.location.reload();
                }
              }}
              className="w-full px-3 py-1.5 text-left text-[10px] hover:bg-red-900/30 cursor-pointer flex items-center gap-2 text-red-400"
            >
              <span>🗑</span>
              <span>Daten zurücksetzen</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AppHeader() {
  const { filter, setFilter, classFilter, setClassFilter, showHelp, toggleHelp, undoStack, undo, setSequencePanelOpen, sidePanelOpen, setSidePanelOpen, setSidePanelTab, zoomLevel, setZoomLevel, searchQuery, setSearchQuery } = usePlannerStore();
  const [showStats, setShowStats] = useState(false);
  const [showTaF, setShowTaF] = useState(false);
  const [showExcel, setShowExcel] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close add menu on outside click
  useEffect(() => {
    if (!showAddMenu) return;
    const handler = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) setShowAddMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showAddMenu]);

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 sticky top-0 z-[60] flex items-center justify-between flex-wrap gap-2 no-print">
      <div className="flex items-baseline gap-2">
        <span className="text-base font-bold text-gray-50">
          <span className="text-blue-400">⊞</span> Unterrichtsplaner
        </span>
        <span className="text-[10px] text-gray-500">SJ 25/26 · DUY · v2.9</span>
      </div>
      <div className="flex gap-1 items-center">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer transition-colors ${
              filter === f.key
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'
            }`}
            title={`Filter: ${f.key === 'ALL' ? 'Alle Kurse anzeigen' : f.key === 'SF' ? 'Nur Schwerpunktfach' : f.key === 'EWR' ? 'Nur Einführung W&R' : f.key === 'IN' ? 'Nur Informatik' : f.key === 'KS' ? 'Nur Klassenstunde' : f.label}`}
          >
            {f.label}
          </button>
        ))}
        {classFilter && (
          <button
            onClick={() => setClassFilter(null)}
            className="px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer bg-amber-500/20 text-amber-300 border-amber-500 hover:bg-amber-500/30"
            title="Klassenfilter aufheben"
          >
            {classFilter} ✕
          </button>
        )}
        {/* Search */}
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Suche…"
            className="w-28 focus:w-44 transition-all px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-gray-700 text-gray-300 outline-none focus:border-blue-400 placeholder-gray-600"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-gray-500 hover:text-gray-300 cursor-pointer"
            >✕</button>
          )}
        </div>
        <span className="w-px h-4 bg-gray-700 mx-1" />
        {/* Zoom Level */}
        <div className="flex items-center border border-gray-700 rounded overflow-hidden">
          {([1, 2, 3] as const).map((z) => (
            <button
              key={z}
              onClick={() => setZoomLevel(z)}
              className={`px-1.5 py-0.5 text-[9px] font-semibold cursor-pointer transition-colors ${
                zoomLevel === z
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
              } ${z < 3 ? 'border-r border-gray-700' : ''}`}
              title={z === 1 ? 'Semester-Übersicht (weit)' : z === 2 ? 'Block-Ansicht (mittel)' : 'Wochen-Ansicht (nah)'}
            >
              {z === 1 ? '◫' : z === 2 ? '▧' : '▦'}
            </button>
          ))}
        </div>
        <span className="w-px h-4 bg-gray-700 mx-1" />
        {undoStack.length > 0 && (
          <button
            onClick={undo}
            className="px-2 py-0.5 rounded text-[10px] border border-gray-700 text-gray-400 cursor-pointer hover:text-gray-200 hover:border-gray-500"
            title="Rückgängig (⌘Z)"
          >
            ↩
          </button>
        )}
        <DataMenu />
        <button
          onClick={() => setShowStats(true)}
          className="px-2 py-0.5 rounded text-[10px] border border-gray-700 text-gray-500 cursor-pointer hover:text-gray-300 hover:border-gray-500"
          title="Statistik"
        >
          📊
        </button>
        {showStats && <StatsPanel onClose={() => setShowStats(false)} />}
        <button
          onClick={() => setShowTaF(true)}
          className="px-2 py-0.5 rounded text-[10px] border border-gray-700 text-gray-500 cursor-pointer hover:text-purple-300 hover:border-purple-700"
          title="TaF Phasenmodell"
        >
          🎓 TaF
        </button>
        {showTaF && <TaFPanel onClose={() => setShowTaF(false)} />}
        <button
          onClick={() => setShowExcel(true)}
          className="px-2 py-0.5 rounded text-[10px] border border-gray-700 text-gray-500 cursor-pointer hover:text-green-300 hover:border-green-700"
          title="Excel-Import"
        >
          📥 Excel
        </button>
        {showExcel && <ExcelImport onClose={() => setShowExcel(false)} />}
        <button
          onClick={toggleHelp}
          className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
            showHelp ? 'bg-slate-800 border-gray-600 text-gray-300' : 'border-gray-700 text-gray-500'
          }`}
        >
          ?
        </button>
        <button
          onClick={() => {
            const isSeqOpen = sidePanelOpen && usePlannerStore.getState().sidePanelTab === 'sequences';
            if (isSeqOpen) {
              setSidePanelOpen(false);
              setSequencePanelOpen(false);
            } else {
              setSidePanelOpen(true);
              setSidePanelTab('sequences');
              setSequencePanelOpen(true);
            }
          }}
          className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
            sidePanelOpen && usePlannerStore.getState().sidePanelTab === 'sequences'
              ? 'bg-green-900 border-green-600 text-green-300'
              : 'border-gray-700 text-gray-500 hover:border-green-700 hover:text-green-400'
          }`}
          title="Sequenzen verwalten"
        >
          ▧ Seq
        </button>
        <div className="relative" ref={addMenuRef}>
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
              showAddMenu
                ? 'bg-blue-900 border-blue-600 text-blue-300'
                : 'border-gray-700 text-gray-500 hover:border-blue-700 hover:text-blue-400'
            }`}
            title="Neue Sequenz erstellen"
          >
            + Neu
          </button>
          {showAddMenu && (
            <div className="absolute right-0 top-8 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-[70] w-52 py-1 max-h-80 overflow-y-auto">
              <div className="px-3 py-1 text-[9px] text-gray-500 border-b border-slate-700 font-medium">
                Neue Sequenz für Kurs:
              </div>
              {COURSES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    const seqId = usePlannerStore.getState().addSequence({
                      courseId: c.id,
                      title: `${c.cls} – Neue Sequenz`,
                      blocks: [{ weeks: [], label: 'Block 1' }],
                    });
                    usePlannerStore.getState().setEditingSequenceId(seqId);
                    setSidePanelOpen(true);
                    setSidePanelTab('sequences');
                    setShowAddMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[10px] hover:bg-slate-700 cursor-pointer flex items-center gap-2 text-gray-200"
                >
                  <span className="font-semibold">{c.cls}</span>
                  <span className="text-gray-500">{c.typ} · {c.day} {c.from}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function HelpBar() {
  const { showHelp } = usePlannerStore();
  if (!showHelp) return null;

  return (
    <div className="bg-slate-800 border-b border-gray-700 px-4 py-2 text-[10px] text-slate-400 leading-relaxed no-print">
      <b className="text-gray-200">Bedienung:</b>{' '}
      <b>1× Klick</b> = Auswählen (Mini-Buttons: + ↓ i) ·{' '}
      <b>2× Klick</b> = Details öffnen ·{' '}
      <b>Hover (2s)</b> = Vorschau ·{' '}
      <b>⇧/⌘+Klick</b> = Mehrfachauswahl ·{' '}
      <b>⌘Z</b> = Rückgängig ·{' '}
      <b>⌘F</b> = Suche ·{' '}
      <b>⌘P</b> = Drucken ·{' '}
      <b>Leere Zelle</b> = Neue Kachel/Sequenz
      <br />
      <b>Zoom:</b> <b>1</b> = Semester-Übersicht · <b>2</b> = Block-Ansicht · <b>3</b> = Wochen-Ansicht
      <br />
      <b className="text-amber-400">⚠ 1L↔2L:</b> Bei Kursen mit alternierenden Slots warnt das Tool bei Verschiebungskonflikten.
    </div>
  );
}

export function MultiSelectToolbar() {
  const { multiSelection, clearMultiSelect, batchShiftDown, batchInsertBefore, weekData,
    addSequence, setEditingSequenceId, setSidePanelOpen, setSidePanelTab } = usePlannerStore();
  if (multiSelection.length === 0) return null;

  const allWeeks = weekData.map(w => w.w);

  // Group selection by courseId and create sequence
  const handleCreateSequence = () => {
    // Parse selection keys: "2026-W09-c11" → { week, courseId }
    const parsed = multiSelection.map(key => {
      const parts = key.split('-');
      const courseId = parts[parts.length - 1];
      const week = parts.slice(0, parts.length - 1).join('-');
      return { week, courseId };
    });

    // Group by courseId
    const byCourse = new Map<string, string[]>();
    for (const { week, courseId } of parsed) {
      if (!byCourse.has(courseId)) byCourse.set(courseId, []);
      byCourse.get(courseId)!.push(week);
    }

    // Use the first (or only) courseId
    const [courseId, weeks] = [...byCourse.entries()][0];
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    // Sort weeks chronologically
    const sortedWeeks = [...weeks].sort();

    // Create single block with all selected weeks
    const seqId = addSequence({
      courseId,
      title: `Neue Sequenz ${course.cls}`,
      blocks: [{ weeks: sortedWeeks, label: 'Neuer Block' }],
    });

    setEditingSequenceId(seqId);
    setSidePanelOpen(true);
    setSidePanelTab('sequences');
    clearMultiSelect();
  };

  // Check if all selections are in the same course column
  const courseIds = new Set(multiSelection.map(key => {
    const parts = key.split('-');
    return parts[parts.length - 1];
  }));
  const singleCourse = courseIds.size === 1;

  return (
    <div className="bg-indigo-950 border-b-2 border-indigo-500 px-4 py-1.5 flex items-center gap-3 text-[10px] sticky top-9 z-[55]">
      <span className="font-bold text-indigo-200">{multiSelection.length} markiert</span>
      {singleCourse && (
        <button
          onClick={handleCreateSequence}
          className="px-2 py-0.5 rounded bg-green-700 text-white border-none text-[9px] font-semibold cursor-pointer hover:bg-green-600"
        >
          ▧ Neue Sequenz
        </button>
      )}
      <button
        onClick={() => batchShiftDown(multiSelection, allWeeks, COURSES)}
        className="px-2 py-0.5 rounded bg-indigo-600 text-white border-none text-[9px] font-semibold cursor-pointer hover:bg-indigo-500"
      >
        ↓ Verschieben (+1)
      </button>
      <button
        onClick={() => batchInsertBefore(multiSelection, allWeeks, COURSES)}
        className="px-2 py-0.5 rounded bg-indigo-600 text-white border-none text-[9px] font-semibold cursor-pointer hover:bg-indigo-500"
      >
        ⊞ Einfügen davor
      </button>
      <button
        onClick={clearMultiSelect}
        className="px-2 py-0.5 rounded bg-transparent text-indigo-300 border border-indigo-500 text-[9px] cursor-pointer"
      >
        ✕ Aufheben
      </button>
    </div>
  );
}

export function Legend() {
  return (
    <div className="px-4 py-1 flex gap-2.5 flex-wrap text-[8px] text-gray-400 border-b border-slate-900/60">
      {[
        ['BWL', '#dbeafe'],
        ['Recht/VWL', '#dcfce7'],
        ['IN', '#e0f2fe'],
        ['Prüfung', '#fee2e2'],
        ['Event', '#fef9c3'],
        ['Ferien', '#fff'],
      ].map(([label, bg]) => (
        <span key={label} className="flex items-center gap-0.5">
          <span
            className="w-2 h-2 rounded-sm border border-black/10"
            style={{ background: bg }}
          />
          {label}
        </span>
      ))}
      <span>│</span>
      <span className="flex items-center gap-0.5">
        <span className="w-[3px] h-2.5 rounded-sm bg-green-600" />
        Sequenz
      </span>
    </div>
  );
}
