import type { SchuelerStatus } from '../../types/monitoring'

interface Props {
  schueler: SchuelerStatus
  onSchliessen: () => void
}

export default function SusDetailPanel({ schueler, onSchliessen }: Props) {
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-lg z-30 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{schueler.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{schueler.email}</p>
          {schueler.klasse && (
            <p className="text-xs text-slate-500 dark:text-slate-400">Klasse: {schueler.klasse}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onSchliessen}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Status-Info */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">Status</span>
            <p className="font-medium text-slate-700 dark:text-slate-200">{statusLabel(schueler.status)}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">Login</span>
            <p className="font-medium text-slate-700 dark:text-slate-200">
              {schueler.startzeit
                ? new Date(schueler.startzeit).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
                : '\u2014'}
            </p>
          </div>
        </div>

        {/* Fortschritt */}
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">Fortschritt</span>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: schueler.gesamtFragen > 0 ? `${(schueler.beantworteteFragen / schueler.gesamtFragen) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {schueler.beantworteteFragen}/{schueler.gesamtFragen}
            </span>
          </div>
        </div>

        {/* Aktuelle Frage */}
        {schueler.aktuelleFrage !== null && schueler.aktuelleFrage !== undefined && (
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">Aktuelle Frage</span>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Frage {schueler.aktuelleFrage + 1} von {schueler.gesamtFragen}
            </p>
          </div>
        )}

        {/* Fragen-Übersicht */}
        {schueler.gesamtFragen > 0 && (
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">Fragen</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {Array.from({ length: schueler.gesamtFragen }, (_, i) => {
                const istAktuell = schueler.aktuelleFrage === i
                const istBeantwortet = i < schueler.beantworteteFragen
                return (
                  <span
                    key={i}
                    className={`w-7 h-7 flex items-center justify-center text-xs rounded
                      ${istAktuell
                        ? 'bg-blue-500 text-white font-bold'
                        : istBeantwortet
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                      }`}
                  >
                    {i + 1}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Technische Details */}
        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Heartbeats</span>
            <span>{schueler.heartbeats}</span>
          </div>
          <div className="flex justify-between">
            <span>Auto-Saves</span>
            <span>{schueler.autoSaveCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Netzwerkfehler</span>
            <span className={schueler.netzwerkFehler > 0 ? 'text-red-500' : ''}>{schueler.netzwerkFehler}</span>
          </div>
          {schueler.unterbrechungen.length > 0 && (
            <div>
              <span>Unterbrechungen: {schueler.unterbrechungen.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function statusLabel(status: SchuelerStatus['status']): string {
  switch (status) {
    case 'aktiv': return 'Aktiv'
    case 'inaktiv': return 'Inaktiv'
    case 'abgegeben': return 'Abgegeben'
    case 'nicht-gestartet': return 'Nicht gestartet'
    case 'beendet-lp': return 'Beendet (LP)'
    default: return status
  }
}
