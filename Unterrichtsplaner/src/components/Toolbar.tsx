import { usePlannerStore } from '../store/plannerStore';
import type { FilterType } from '../types';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'ALL', label: 'Alle' },
  { key: 'SF', label: 'SF' },
  { key: 'EWR', label: 'EWR' },
  { key: 'IN', label: 'IN' },
  { key: 'KS', label: 'KS' },
];

export function AppHeader() {
  const { filter, setFilter, showHelp, toggleHelp, undoStack, undo } = usePlannerStore();

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 sticky top-0 z-[60] flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-baseline gap-2">
        <span className="text-base font-bold text-gray-50">
          <span className="text-blue-400">⊞</span> Unterrichtsplaner
        </span>
        <span className="text-[10px] text-gray-500">SJ 25/26 · DUY · v1.0</span>
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
        <button
          onClick={toggleHelp}
          className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
            showHelp ? 'bg-slate-800 border-gray-600 text-gray-300' : 'border-gray-700 text-gray-500'
          }`}
        >
          ?
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
      <b>⌘Z</b> = Rückgängig · 2L grösser als 1L · Grüne Balken = Sequenz
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

// DetailPanel has moved to ./DetailPanel.tsx

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
