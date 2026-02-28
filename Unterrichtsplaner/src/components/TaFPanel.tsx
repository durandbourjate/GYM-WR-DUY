import { useState } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { WEEKS } from '../data/weeks';
import type { TaFPhase } from '../types';

const PHASE_COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899'];
const allWeeks = WEEKS.map(w => w.w);

export function TaFPanel({ onClose }: { onClose: () => void }) {
  const { tafPhases, addTaFPhase, updateTaFPhase, deleteTaFPhase } = usePlannerStore();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStart, setNewStart] = useState(allWeeks[0]);
  const [newEnd, setNewEnd] = useState(allWeeks[5]);
  const [newColor, setNewColor] = useState(PHASE_COLORS[0]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addTaFPhase({
      name: newName.trim(),
      startWeek: newStart,
      endWeek: newEnd,
      color: newColor,
      absentClasses: [],
      presentClasses: [],
    });
    setNewName('');
    setShowNew(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center"
      onClick={onClose}>
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-[480px] max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-200">TaF Phasenmodell</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 cursor-pointer text-lg">✕</button>
        </div>

        <div className="p-4 space-y-3">
          {tafPhases.length === 0 && !showNew && (
            <div className="text-[10px] text-gray-500 text-center py-4">
              Noch keine TaF-Phasen definiert.
            </div>
          )}

          {tafPhases.map((phase) => (
            <PhaseRow key={phase.id} phase={phase}
              onUpdate={(u) => updateTaFPhase(phase.id, u)}
              onDelete={() => {
                if (confirm(`Phase "${phase.name}" löschen?`)) deleteTaFPhase(phase.id);
              }}
            />
          ))}

          {showNew ? (
            <div className="bg-slate-750 rounded-lg p-3 border border-slate-600 space-y-2">
              <input value={newName} onChange={(e) => setNewName(e.target.value)}
                placeholder="Phasenname…" autoFocus
                className="w-full bg-slate-700 text-slate-200 border border-slate-600 rounded px-2 py-1 text-[10px] outline-none focus:border-blue-400"
                onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
              />
              <div className="flex gap-3">
                <div className="flex items-center gap-1">
                  <label className="text-[9px] text-gray-400">Von:</label>
                  <select value={newStart} onChange={(e) => setNewStart(e.target.value)}
                    className="text-[9px] bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-gray-200">
                    {allWeeks.map(w => <option key={w} value={w}>KW {w}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-[9px] text-gray-400">Bis:</label>
                  <select value={newEnd} onChange={(e) => setNewEnd(e.target.value)}
                    className="text-[9px] bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-gray-200">
                    {allWeeks.map(w => <option key={w} value={w}>KW {w}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-gray-400">Farbe:</span>
                {PHASE_COLORS.map(c => (
                  <button key={c} onClick={() => setNewColor(c)}
                    className="w-4 h-4 rounded-full cursor-pointer border-2"
                    style={{ background: c, borderColor: newColor === c ? '#fff' : 'transparent' }}
                  />
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={handleAdd}
                  className="text-[9px] bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
                  Hinzufügen
                </button>
                <button onClick={() => setShowNew(false)}
                  className="text-[9px] text-gray-400 hover:text-gray-300 cursor-pointer px-2 py-1">
                  Abbrechen
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowNew(true)}
              className="text-[9px] text-blue-400 hover:text-blue-300 cursor-pointer">
              + Phase hinzufügen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PhaseRow({ phase, onUpdate, onDelete }: {
  phase: TaFPhase;
  onUpdate: (u: Partial<TaFPhase>) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="bg-slate-750 rounded-lg p-2.5 border border-slate-700">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: phase.color }} />
        {editing ? (
          <input value={phase.name} onChange={(e) => onUpdate({ name: e.target.value })}
            onBlur={() => setEditing(false)} autoFocus
            className="flex-1 bg-slate-700 text-slate-200 border border-blue-400 rounded px-1.5 py-0.5 text-[10px] outline-none"
          />
        ) : (
          <span className="text-[10px] font-semibold text-gray-200 flex-1 cursor-pointer"
            onDoubleClick={() => setEditing(true)}>{phase.name}</span>
        )}
        <span className="text-[8px] text-gray-500">KW {phase.startWeek}–{phase.endWeek}</span>
        <button onClick={onDelete}
          className="text-[9px] text-red-400 hover:text-red-300 cursor-pointer px-1">✕</button>
      </div>
      <div className="mt-1.5 flex gap-3">
        <div className="flex items-center gap-1">
          <label className="text-[8px] text-gray-500">Von:</label>
          <select value={phase.startWeek} onChange={(e) => onUpdate({ startWeek: e.target.value })}
            className="text-[8px] bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-gray-300">
            {allWeeks.map(w => <option key={w} value={w}>KW {w}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <label className="text-[8px] text-gray-500">Bis:</label>
          <select value={phase.endWeek} onChange={(e) => onUpdate({ endWeek: e.target.value })}
            className="text-[8px] bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-gray-300">
            {allWeeks.map(w => <option key={w} value={w}>KW {w}</option>)}
          </select>
        </div>
      </div>
      {(phase.absentClasses.length > 0 || phase.presentClasses.length > 0) && (
        <div className="mt-1 text-[8px] text-gray-500">
          {phase.absentClasses.length > 0 && <span>Abwesend: {phase.absentClasses.join(', ')} </span>}
          {phase.presentClasses.length > 0 && <span>Anwesend: {phase.presentClasses.join(', ')}</span>}
        </div>
      )}
    </div>
  );
}
