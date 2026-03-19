import type { Frage } from '../../../types/fragen.ts'
import type { PruefungsConfig, PruefungsAbschnitt } from '../../../types/pruefung.ts'

interface Props {
  pruefung: PruefungsConfig
  fragenMap: Record<string, Frage>
  onAddAbschnitt: () => void
  onRemoveAbschnitt: (index: number) => void
  onMoveAbschnitt: (index: number, richtung: 'hoch' | 'runter') => void
  onUpdateAbschnitt: (index: number, partial: Partial<PruefungsAbschnitt>) => void
  onRemoveFrage: (abschnittIndex: number, frageId: string) => void
  onMoveFrage: (abschnittIndex: number, frageIndex: number, richtung: 'hoch' | 'runter') => void
  onFragenBrowser: (abschnittIndex: number) => void
  onEditFrage: (frageId: string) => void
}

export default function AbschnitteTab({
  pruefung,
  fragenMap,
  onAddAbschnitt,
  onRemoveAbschnitt,
  onMoveAbschnitt,
  onUpdateAbschnitt,
  onRemoveFrage,
  onMoveFrage,
  onFragenBrowser,
  onEditFrage,
}: Props) {
  if (pruefung.abschnitte.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          Noch keine Abschnitte. Fügen Sie mindestens einen Abschnitt hinzu, um Fragen zuzuordnen.
        </p>
        <button
          onClick={onAddAbschnitt}
          className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-800 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-100 transition-colors cursor-pointer"
        >
          + Abschnitt hinzufügen
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pruefung.abschnitte.map((abschnitt, aIndex) => (
        <div
          key={aIndex}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          {/* Abschnitt-Header */}
          <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <div className="flex gap-1">
              <button
                onClick={() => onMoveAbschnitt(aIndex, 'hoch')}
                disabled={aIndex === 0}
                className="w-7 h-7 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                title="Nach oben"
              >↑</button>
              <button
                onClick={() => onMoveAbschnitt(aIndex, 'runter')}
                disabled={aIndex === pruefung.abschnitte.length - 1}
                className="w-7 h-7 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                title="Nach unten"
              >↓</button>
            </div>
            <input
              type="text"
              value={abschnitt.titel}
              onChange={(e) => onUpdateAbschnitt(aIndex, { titel: e.target.value })}
              className="flex-1 font-semibold text-slate-800 dark:text-slate-100 bg-transparent border-none outline-none focus:ring-2 focus:ring-slate-400 rounded px-2 py-1"
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {abschnitt.fragenIds.length} {abschnitt.fragenIds.length === 1 ? 'Frage' : 'Fragen'}
            </span>
            <button
              onClick={() => onRemoveAbschnitt(aIndex)}
              className="w-7 h-7 text-xs text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded cursor-pointer transition-colors"
              title="Abschnitt löschen"
            >×</button>
          </div>

          {/* Beschreibung */}
          <div className="px-5 pt-3">
            <input
              type="text"
              value={abschnitt.beschreibung || ''}
              onChange={(e) => onUpdateAbschnitt(aIndex, { beschreibung: e.target.value || undefined })}
              placeholder="Optionale Beschreibung für die SuS..."
              className="w-full text-sm text-slate-600 dark:text-slate-300 bg-transparent border-none outline-none placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-slate-400 rounded px-2 py-1"
            />
          </div>

          {/* Fragen-Liste */}
          <div className="px-5 py-3">
            {abschnitt.fragenIds.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 italic py-2">
                Noch keine Fragen in diesem Abschnitt.
              </p>
            ) : (
              <div className="space-y-1.5">
                {abschnitt.fragenIds.map((frageId, fIndex) => {
                  const frage = fragenMap[frageId]
                  const fragetext = frage && 'fragetext' in frage ? (frage as { fragetext: string }).fragetext : ''
                  const vorschau = fragetext.length > 60 ? fragetext.slice(0, 60) + '...' : fragetext
                  return (
                  <div
                    key={frageId}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-sm"
                  >
                    <span className="text-xs text-slate-400 dark:text-slate-500 w-5 text-center tabular-nums shrink-0">
                      {fIndex + 1}.
                    </span>
                    <button
                      onClick={() => onEditFrage(frageId)}
                      className="flex-1 text-left cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600/50 rounded px-1 -mx-1 min-w-0"
                      title="In Fragenbank öffnen"
                    >
                      <span className="block text-slate-700 dark:text-slate-200 font-mono text-xs underline decoration-slate-300 dark:decoration-slate-600">
                        {frageId}
                      </span>
                      {vorschau && (
                        <span className="block text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {vorschau}
                        </span>
                      )}
                    </button>
                    <div className="flex gap-0.5">
                      <button
                        onClick={() => onMoveFrage(aIndex, fIndex, 'hoch')}
                        disabled={fIndex === 0}
                        className="w-6 h-6 text-xs text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >↑</button>
                      <button
                        onClick={() => onMoveFrage(aIndex, fIndex, 'runter')}
                        disabled={fIndex === abschnitt.fragenIds.length - 1}
                        className="w-6 h-6 text-xs text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >↓</button>
                      <button
                        onClick={() => onRemoveFrage(aIndex, frageId)}
                        className="w-6 h-6 text-xs text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded cursor-pointer"
                        title="Frage entfernen"
                      >×</button>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}

            <button
              onClick={() => onFragenBrowser(aIndex)}
              className="mt-3 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
              + Fragen hinzufügen
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={onAddAbschnitt}
        className="w-full py-3 text-sm font-medium text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        + Neuen Abschnitt hinzufügen
      </button>
    </div>
  )
}
