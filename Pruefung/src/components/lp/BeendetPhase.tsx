import type { PruefungsConfig } from '../../types/pruefung'
import type { SchuelerStatus } from '../../types/monitoring'

interface Props {
  config: PruefungsConfig
  schuelerStatus: SchuelerStatus[]
  onExportieren: () => void
}

export default function BeendetPhase({ config, schuelerStatus, onExportieren }: Props) {
  const abgegeben = schuelerStatus.filter((s) => s.status === 'abgegeben')
  const erzwungen = schuelerStatus.filter((s) => s.status === 'beendet-lp')
  const nichtErschienen = schuelerStatus.filter((s) => s.status === 'nicht-gestartet')
  const gesamtTeilnehmer = config.teilnehmer?.length ?? schuelerStatus.length

  return (
    <div className="space-y-6">
      {/* Zusammenfassung */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Teilnehmer" wert={gesamtTeilnehmer} />
        <StatBox label="Abgegeben" wert={abgegeben.length} suffix={`(${Math.round((abgegeben.length / Math.max(gesamtTeilnehmer, 1)) * 100)}%)`} farbe="text-green-600 dark:text-green-400" />
        <StatBox label="Erzwungen" wert={erzwungen.length} farbe="text-amber-600 dark:text-amber-400" />
        <StatBox label="Nicht erschienen" wert={nichtErschienen.length} farbe="text-slate-500 dark:text-slate-400" />
      </div>

      {/* SuS-Liste */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr className="text-left text-xs text-slate-500 dark:text-slate-400 uppercase">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Abgabe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {schuelerStatus
              .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email))
              .map((s) => (
                <tr key={s.email}>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{s.name || s.email}</td>
                  <td className="px-3 py-2 text-xs">
                    {s.status === 'abgegeben' && <span className="text-green-600 dark:text-green-400">✅ Abgegeben</span>}
                    {s.status === 'beendet-lp' && <span className="text-amber-600 dark:text-amber-400">⚠️ Erzwungen</span>}
                    {s.status === 'nicht-gestartet' && <span className="text-slate-400">⚪ Nicht erschienen</span>}
                    {s.status === 'aktiv' && <span className="text-blue-600 dark:text-blue-400">🔵 Noch aktiv</span>}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                    {s.abgabezeit
                      ? new Date(s.abgabezeit).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Aktionen */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onExportieren}
          className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer"
        >
          Ergebnisse exportieren
        </button>
      </div>
    </div>
  )
}

function StatBox({ label, wert, suffix, farbe }: {
  label: string
  wert: number
  suffix?: string
  farbe?: string
}) {
  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">{label}</p>
      <p className={`text-xl font-bold ${farbe ?? 'text-slate-800 dark:text-slate-100'}`}>
        {wert}
        {suffix && <span className="text-xs font-normal ml-1">{suffix}</span>}
      </p>
    </div>
  )
}
