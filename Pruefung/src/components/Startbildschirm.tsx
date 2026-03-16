import type { PruefungsConfig } from '../types/pruefung.ts'
import type { Frage } from '../types/fragen.ts'
import { usePruefungStore } from '../store/pruefungStore.ts'

interface Props {
  config: PruefungsConfig
  fragen: Frage[]
  wiederhergestellt: boolean
}

export default function Startbildschirm({ config, fragen, wiederhergestellt }: Props) {
  const pruefungStarten = usePruefungStore((s) => s.pruefungStarten)
  const setPhase = usePruefungStore((s) => s.setPhase)

  function handleStart() {
    if (wiederhergestellt) {
      // Sitzung wiederherstellen — nicht neu starten
      setPhase('pruefung')
    } else {
      pruefungStarten(config, fragen)
    }
  }

  const gesamtFragen = config.abschnitte.reduce((sum, a) => sum + a.fragenIds.length, 0)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
        {/* Logo / Titel */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">WR</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            {config.titel}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {config.klasse} · {config.datum}
          </p>
        </div>

        {/* Wiederherstellungs-Hinweis */}
        {wiederhergestellt && (
          <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-200">
            Gespeicherte Sitzung gefunden. Ihre bisherigen Antworten werden wiederhergestellt.
          </div>
        )}

        {/* Infos */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <InfoCard label="Dauer" wert={`${config.dauerMinuten} Minuten`} />
          <InfoCard label="Fragen" wert={`${gesamtFragen}`} />
          <InfoCard label="Punkte" wert={`${config.gesamtpunkte}`} />
          <InfoCard label="Typ" wert={config.typ === 'summativ' ? 'Summativ' : 'Formativ'} />
        </div>

        {/* Abschnitte */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Aufbau</h3>
          <div className="space-y-1.5">
            {config.abschnitte.map((a) => (
              <div
                key={a.titel}
                className="flex justify-between text-sm text-slate-700 dark:text-slate-300 py-1.5 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              >
                <span>{a.titel}</span>
                <span className="text-slate-500 dark:text-slate-400">{a.fragenIds.length} Fragen</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hinweise */}
        <div className="mb-8 text-sm text-slate-500 dark:text-slate-400 space-y-1">
          {config.ruecknavigation && (
            <p>Alle Fragen können in beliebiger Reihenfolge beantwortet werden.</p>
          )}
          <p>Antworten werden automatisch gespeichert.</p>
        </div>

        {/* Start-Button */}
        <button
          onClick={handleStart}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-colors cursor-pointer"
        >
          {wiederhergestellt ? 'Sitzung fortsetzen' : 'Prüfung starten'}
        </button>
      </div>
    </div>
  )
}

function InfoCard({ label, wert }: { label: string; wert: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{label}</div>
      <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">{wert}</div>
    </div>
  )
}
