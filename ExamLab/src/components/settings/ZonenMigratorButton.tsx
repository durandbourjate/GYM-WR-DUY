import { useState } from 'react'
import { postJson } from '../../services/apiClient'

interface MigrationResponse {
  success?: boolean
  error?: string
  dryRun?: boolean
  sheetFilter?: string | null
  tabs?: { name: string; rows: number; aktualisiert: number; uebersprungen?: number; fehler?: string }[]
  totalSummary?: number
  summary?: { tab: string; row: number; frageId: string; typ: string }[]
  errors?: { tab: string; row?: number; error: string }[]
}

interface Props {
  email: string
}

/**
 * Admin-UI zum Triggern der Zonen-Migration (alte Hotspot/DragDrop-Zonen → Polygon-Format).
 * Kapselt den Apps-Script-Endpoint `admin:migriereZonen` mit Dry-Run + Live-Modus.
 * Einmalige Migrations-Operation; nach Phase 6 Cleanup entfernbar.
 */
export default function ZonenMigratorButton({ email }: Props) {
  const [busy, setBusy] = useState(false)
  const [sheet, setSheet] = useState('BWL')
  const [ergebnis, setErgebnis] = useState<MigrationResponse | null>(null)
  const [fehler, setFehler] = useState<string | null>(null)

  async function migriere(dryRun: boolean) {
    setBusy(true)
    setErgebnis(null)
    setFehler(null)
    try {
      const res = await postJson<MigrationResponse>('admin:migriereZonen', {
        callerEmail: email,
        dryRun,
        sheetName: sheet || undefined,
      })
      if (!res) {
        setFehler('Keine Antwort vom Backend (Apps-Script-URL fehlt?).')
      } else if (res.error) {
        setFehler(res.error)
      } else {
        setErgebnis(res)
      }
    } catch (e: unknown) {
      setFehler(e instanceof Error ? e.message : String(e))
    }
    setBusy(false)
  }

  return (
    <div className="p-4 border border-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg space-y-3">
      <h3 className="font-semibold text-amber-800 dark:text-amber-200">Zonen-Migration (Polygon-Format)</h3>
      <p className="text-xs text-amber-700 dark:text-amber-300">
        Einmalige Migration bestehender Hotspot-Bereiche + DragDrop-Zielzonen ins neue Polygon-Format.
        Idempotent — bereits migrierte Zonen werden übersprungen. Erst Dry-Run, dann live.{' '}
        <strong>Wichtig:</strong> Vorher Backup-Kopie der Fragenbank-Sheets in Drive erstellen.
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-sm text-slate-700 dark:text-slate-200">Sheet:</label>
        <select
          value={sheet}
          onChange={(e) => setSheet(e.target.value)}
          className="px-2 py-1 text-sm border rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
          disabled={busy}
        >
          <option value="BWL">BWL</option>
          <option value="VWL">VWL</option>
          <option value="Recht">Recht</option>
          <option value="Informatik">Informatik</option>
          <option value="">(alle)</option>
        </select>
        <button
          type="button"
          onClick={() => migriere(true)}
          disabled={busy}
          className="px-3 py-1 text-xs rounded border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
        >
          Dry-Run
        </button>
        <button
          type="button"
          onClick={() => {
            if (!confirm('Wirklich live migrieren? Backup-Kopie vorhanden?')) return
            migriere(false)
          }}
          disabled={busy}
          className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          Live migrieren
        </button>
        {busy && <span className="text-xs text-amber-700 dark:text-amber-300">läuft…</span>}
      </div>

      {fehler && (
        <div className="text-xs text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 p-2 rounded">
          Fehler: {fehler}
        </div>
      )}

      {ergebnis && (
        <div className="space-y-2 text-xs">
          <div className="font-medium text-amber-800 dark:text-amber-200">
            {ergebnis.dryRun ? 'Dry-Run' : 'Live-Migration'} abgeschlossen
            {ergebnis.sheetFilter && <> — Sheet: <code>{ergebnis.sheetFilter}</code></>}
          </div>
          {ergebnis.tabs && ergebnis.tabs.length > 0 && (
            <table className="w-full text-xs border border-slate-300 dark:border-slate-600 rounded">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="px-2 py-1 text-left">Tab</th>
                  <th className="px-2 py-1 text-right">Zeilen</th>
                  <th className="px-2 py-1 text-right">Aktualisiert</th>
                  <th className="px-2 py-1 text-right">Übersprungen</th>
                  <th className="px-2 py-1 text-left">Fehler</th>
                </tr>
              </thead>
              <tbody>
                {ergebnis.tabs.map((t, i) => (
                  <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="px-2 py-1">{t.name}</td>
                    <td className="px-2 py-1 text-right">{t.rows}</td>
                    <td className="px-2 py-1 text-right font-medium">{t.aktualisiert}</td>
                    <td className="px-2 py-1 text-right text-slate-500">{t.uebersprungen ?? '—'}</td>
                    <td className="px-2 py-1 text-red-600">{t.fehler ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {ergebnis.summary && ergebnis.summary.length > 0 && (
            <details>
              <summary className="cursor-pointer text-amber-800 dark:text-amber-200">
                Details: {ergebnis.totalSummary ?? ergebnis.summary.length} Zonen
              </summary>
              <pre className="mt-1 p-2 bg-white dark:bg-slate-900 rounded max-h-48 overflow-auto">
                {ergebnis.summary.map(s => `${s.tab} / Zeile ${s.row} / ${s.typ} / ${s.frageId}`).join('\n')}
              </pre>
            </details>
          )}
          {ergebnis.errors && ergebnis.errors.length > 0 && (
            <div className="text-red-600 dark:text-red-400">
              {ergebnis.errors.length} Fehler: {ergebnis.errors.map(e => `${e.tab}${e.row ? ' Zeile ' + e.row : ''}: ${e.error}`).join('; ')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
