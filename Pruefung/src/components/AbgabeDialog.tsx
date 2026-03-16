import { useState } from 'react'
import { usePruefungStore } from '../store/pruefungStore.ts'
import { formatUhrzeit } from '../utils/zeit.ts'

interface Props {
  onSchliessen: () => void
}

export default function AbgabeDialog({ onSchliessen }: Props) {
  const fragen = usePruefungStore((s) => s.fragen)
  const antworten = usePruefungStore((s) => s.antworten)
  const markierungen = usePruefungStore((s) => s.markierungen)
  const pruefungAbgeben = usePruefungStore((s) => s.pruefungAbgeben)
  const [bestaetigt, setBestaetigt] = useState(false)

  const beantwortet = fragen.filter((f) => !!antworten[f.id]).length
  const unbeantwortet = fragen.length - beantwortet
  const markiert = fragen.filter((f) => !!markierungen[f.id]).length

  function handleAbgabe() {
    setBestaetigt(true)
    pruefungAbgeben()
  }

  if (bestaetigt) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Prüfung abgegeben
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Erfolgreich abgegeben um {formatUhrzeit(new Date().toISOString())} Uhr.
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
            Sie können das Fenster schliessen.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          Prüfung abgeben?
        </h2>

        {/* Status */}
        <div className="space-y-2 mb-6">
          <StatusZeile
            label="Beantwortet"
            wert={`${beantwortet} von ${fragen.length}`}
            farbe="text-green-600 dark:text-green-400"
          />
          {unbeantwortet > 0 && (
            <StatusZeile
              label="Nicht beantwortet"
              wert={`${unbeantwortet}`}
              farbe="text-red-600 dark:text-red-400"
            />
          )}
          {markiert > 0 && (
            <StatusZeile
              label="Als unsicher markiert"
              wert={`${markiert}`}
              farbe="text-orange-600 dark:text-orange-400"
            />
          )}
        </div>

        {/* Warnung */}
        {unbeantwortet > 0 && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
            Achtung: Sie haben {unbeantwortet} {unbeantwortet === 1 ? 'Frage' : 'Fragen'} nicht beantwortet!
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onSchliessen}
            className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer font-medium"
          >
            Zurück
          </button>
          <button
            onClick={handleAbgabe}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors cursor-pointer font-medium"
          >
            Definitiv abgeben
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusZeile({
  label,
  wert,
  farbe,
}: {
  label: string
  wert: string
  farbe: string
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-600 dark:text-slate-300">{label}</span>
      <span className={`font-semibold ${farbe}`}>{wert}</span>
    </div>
  )
}
