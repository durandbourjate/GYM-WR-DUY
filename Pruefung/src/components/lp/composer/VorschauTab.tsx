import type { PruefungsConfig } from '../../../types/pruefung.ts'
import { formatDatum } from '../../../utils/zeit.ts'
import { MiniCard } from './ComposerUI.tsx'

interface Props {
  pruefung: PruefungsConfig
  onSuSVorschau: () => void
}

export default function VorschauTab({ pruefung, onSuSVorschau }: Props) {
  const gesamtFragen = pruefung.abschnitte.reduce((s, a) => s + a.fragenIds.length, 0)

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-slate-800 dark:bg-slate-200 rounded-2xl flex items-center justify-center">
            <span className="text-white dark:text-slate-800 text-xl font-bold">WR</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {pruefung.titel || '(Kein Titel)'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {pruefung.klasse || '(Keine Klasse)'} · {formatDatum(pruefung.datum)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <MiniCard label="Dauer" wert={`${pruefung.dauerMinuten} Min.`} />
          <MiniCard label="Fragen" wert={String(gesamtFragen)} />
          <MiniCard label="Punkte" wert={String(pruefung.gesamtpunkte)} />
          <MiniCard label="Typ" wert={pruefung.typ === 'summativ' ? 'Summativ' : 'Formativ'} />
        </div>

        {pruefung.abschnitte.length > 0 && (
          <div className="space-y-1.5 mb-6">
            {pruefung.abschnitte.map((a) => (
              <div
                key={a.titel}
                className="flex justify-between text-sm text-slate-700 dark:text-slate-300 py-1.5 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              >
                <span>{a.titel}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {a.fragenIds.length} {a.fragenIds.length === 1 ? 'Frage' : 'Fragen'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
          {pruefung.ruecknavigation && <p>Alle Fragen können in beliebiger Reihenfolge beantwortet werden.</p>}
          <p>Antworten werden automatisch gespeichert.</p>
          {pruefung.sebErforderlich && <p className="text-amber-600 dark:text-amber-400">SEB erforderlich</p>}
        </div>

        {pruefung.id && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Prüfungs-ID: <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">{pruefung.id}</code>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              URL für SuS: <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded break-all">
                {window.location.origin + window.location.pathname}?id={pruefung.id}
              </code>
            </p>
          </div>
        )}
      </div>

      {/* SuS-Vorschau Button */}
      <button
        onClick={onSuSVorschau}
        disabled={gesamtFragen === 0}
        className="mt-4 w-full py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        SuS-Ansicht öffnen
      </button>
      {gesamtFragen === 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">
          Fügen Sie zuerst Fragen hinzu, um die SuS-Ansicht zu sehen.
        </p>
      )}
    </div>
  )
}
