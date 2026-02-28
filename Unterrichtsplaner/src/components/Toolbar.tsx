import { useState, useRef, useEffect, useCallback } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { StatsPanel } from './StatsPanel';
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
  const { filter, setFilter, showHelp, toggleHelp, undoStack, undo, sequencePanelOpen, setSequencePanelOpen } = usePlannerStore();
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 sticky top-0 z-[60] flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-baseline gap-2">
        <span className="text-base font-bold text-gray-50">
          <span className="text-blue-400">⊞</span> Unterrichtsplaner
        </span>
        <span className="text-[10px] text-gray-500">SJ 25/26 · DUY · v2.0</span>
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
          >
            {f.label}
          </button>
        ))}
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
          onClick={toggleHelp}
          className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
            showHelp ? 'bg-slate-800 border-gray-600 text-gray-300' : 'border-gray-700 text-gray-500'
          }`}
        >
          ?
        </button>
        <button
          onClick={() => setSequencePanelOpen(!sequencePanelOpen)}
          className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
            sequencePanelOpen ? 'bg-green-900 border-green-600 text-green-300' : 'border-gray-700 text-gray-500 hover:border-green-700 hover:text-green-400'
          }`}
          title="Sequenzen verwalten"
        >
          ▧ Seq
        </button>
      </div>
    </div>
  );
}

export function HelpBar() {
  const { showHelp } = usePlannerStore();
  if (!showHelp) return null;

  return (
    <div className="bg-slate-800 border-b border-gray-700 px-4 py-2 text-[10px] text-slate-400 leading-relaxed">
      <b className="text-gray-200">Bedienung:</b> Klick = Detail ·{' '}
      <b>⇧/⌘+Klick</b> = Mehrfachauswahl · <b>Doppelklick</b> = Titel bearbeiten ·{' '}
      <b>⌘Z</b> = Rückgängig · 2L grösser als 1L · Grüne Balken = Sequenz ·{' '}
      <b>💾</b> = Backup exportieren/importieren
      <br />
      <b className="text-amber-400">⚠ 1L↔2L:</b> Bei Kursen mit alternierenden Slots warnt das Tool bei
      Verschiebungskonflikten.
    </div>
  );
}

export function MultiSelectToolbar() {
  const { multiSelection, clearMultiSelect } = usePlannerStore();
  if (multiSelection.length === 0) return null;

  return (
    <div className="bg-indigo-950 border-b-2 border-indigo-500 px-4 py-1.5 flex items-center gap-3 text-[10px] sticky top-9 z-[55]">
      <span className="font-bold text-indigo-200">{multiSelection.length} markiert</span>
      <button className="px-2 py-0.5 rounded bg-indigo-600 text-white border-none text-[9px] font-semibold cursor-pointer hover:bg-indigo-500">
        ↓ Verschieben (+1)
      </button>
      <button className="px-2 py-0.5 rounded bg-indigo-600 text-white border-none text-[9px] font-semibold cursor-pointer hover:bg-indigo-500">
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
