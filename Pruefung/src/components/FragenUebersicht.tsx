import { usePruefungStore } from '../store/pruefungStore.ts'
import { fachbereichFarbe } from './FragenNavigation.tsx'

export default function FragenUebersicht() {
  const config = usePruefungStore((s) => s.config)
  const fragen = usePruefungStore((s) => s.fragen)
  const antworten = usePruefungStore((s) => s.antworten)
  const markierungen = usePruefungStore((s) => s.markierungen)
  const navigiere = usePruefungStore((s) => s.navigiere)
  const setPhase = usePruefungStore((s) => s.setPhase)

  if (!config) return null

  const beantwortet = fragen.filter((f) => !!antworten[f.id]).length
  const markiert = fragen.filter((f) => !!markierungen[f.id]).length

  let globalIdx = 0

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        Übersicht
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {beantwortet} von {fragen.length} Fragen beantwortet
        {markiert > 0 && ` · ${markiert} als unsicher markiert`}
      </p>

      {config.abschnitte.map((abschnitt) => {
        const startIdx = globalIdx
        return (
          <div key={abschnitt.titel} className="mb-6">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-3">
              {abschnitt.titel}
            </h3>
            <div className="flex flex-col gap-2">
              {abschnitt.fragenIds.map((frageId, i) => {
                const idx = startIdx + i
                if (i === abschnitt.fragenIds.length - 1) globalIdx = idx + 1
                const frage = fragen[idx]
                if (!frage) return null
                const istBeantwortet = !!antworten[frageId]
                const istMarkiert = !!markierungen[frageId]
                const antwort = antworten[frageId]

                // Wortanzahl für Freitext
                let wortInfo = ''
                if (antwort?.typ === 'freitext' && antwort.text) {
                  const plainText = antwort.text.replace(/<[^>]*>/g, '').trim()
                  const woerter = plainText ? plainText.split(/\s+/).length : 0
                  wortInfo = `${woerter} Wörter`
                }

                // Status-Icon und -Farbe
                let statusIcon: string
                let statusColor: string
                if (istMarkiert) {
                  statusIcon = '?'
                  statusColor = 'text-amber-700 dark:text-amber-400'
                } else if (istBeantwortet) {
                  statusIcon = '\u2713'
                  statusColor = 'text-green-700 dark:text-green-400'
                } else {
                  statusIcon = '\u2014' // —
                  statusColor = 'text-slate-400 dark:text-slate-500'
                }

                return (
                  <button
                    key={frageId}
                    onClick={() => { navigiere(idx); setPhase('pruefung') }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 ${statusColor}`}>
                      {statusIcon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          {idx + 1}.
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${fachbereichFarbe(frage.fachbereich)}`}>
                          {frage.fachbereich}
                        </span>
                        <span className="text-sm text-slate-800 dark:text-slate-200 truncate">
                          {frage.thema}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
                      <div>{frage.punkte} P.</div>
                      {wortInfo && <div className="text-slate-400">{wortInfo}</div>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <button
        onClick={() => setPhase('pruefung')}
        className="mt-4 px-5 py-2.5 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-100 transition-colors font-medium cursor-pointer"
      >
        Zurück zur Prüfung
      </button>
    </div>
  )
}
