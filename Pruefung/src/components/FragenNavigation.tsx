import { usePruefungStore } from '../store/pruefungStore.ts'
import type { PruefungsAbschnitt } from '../types/pruefung.ts'

/** Farbe für Fachbereich-Badge */
function fachbereichFarbe(fachbereich: string): string {
  switch (fachbereich) {
    case 'VWL': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    case 'BWL': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'Recht': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
  }
}

export default function FragenNavigation() {
  const config = usePruefungStore((s) => s.config)
  const fragen = usePruefungStore((s) => s.fragen)
  const aktuelleFrageIndex = usePruefungStore((s) => s.aktuelleFrageIndex)
  const antworten = usePruefungStore((s) => s.antworten)
  const markierungen = usePruefungStore((s) => s.markierungen)
  const navigiere = usePruefungStore((s) => s.navigiere)
  const setPhase = usePruefungStore((s) => s.setPhase)

  if (!config) return null

  // Fragen nach Abschnitten gruppieren
  let globalIndex = 0
  const abschnitteMitIndex: { abschnitt: PruefungsAbschnitt; startIndex: number }[] = []
  for (const abschnitt of config.abschnitte) {
    abschnitteMitIndex.push({ abschnitt, startIndex: globalIndex })
    globalIndex += abschnitt.fragenIds.length
  }

  return (
    <div className="flex flex-col gap-3">
      {abschnitteMitIndex.map(({ abschnitt, startIndex }) => (
        <div key={abschnitt.titel}>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
            {abschnitt.titel}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {abschnitt.fragenIds.map((frageId, i) => {
              const idx = startIndex + i
              const frage = fragen[idx]
              const istAktuell = idx === aktuelleFrageIndex
              const istBeantwortet = !!antworten[frageId]
              const istMarkiert = !!markierungen[frageId]

              return (
                <button
                  key={frageId}
                  onClick={() => navigiere(idx)}
                  title={frage ? `${frage.fachbereich}: ${frage.thema}` : frageId}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all flex items-center justify-center
                    ${istAktuell
                      ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-slate-800'
                      : ''
                    }
                    ${istMarkiert
                      ? 'bg-orange-400 text-white dark:bg-orange-600'
                      : istBeantwortet
                        ? 'bg-green-500 text-white dark:bg-green-600'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }
                    hover:scale-110 cursor-pointer
                  `}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Legende */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700 inline-block" /> Offen
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-500 inline-block" /> Beantwortet
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-orange-400 inline-block" /> Unsicher
        </span>
      </div>

      {/* Übersicht-Button */}
      <button
        onClick={() => setPhase('uebersicht')}
        className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
      >
        Übersicht anzeigen
      </button>

      {/* Fachbereich-Info der aktuellen Frage */}
      {fragen[aktuelleFrageIndex] && (
        <div className="mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full ${fachbereichFarbe(fragen[aktuelleFrageIndex].fachbereich)}`}>
            {fragen[aktuelleFrageIndex].fachbereich}
          </span>
        </div>
      )}
    </div>
  )
}

export { fachbereichFarbe }
