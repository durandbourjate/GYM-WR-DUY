import { useState } from 'react'
import { bulkSetzeLueckentextModus } from '../../../services/fragensammlungApi'

interface Props {
  email: string
  istAdmin: boolean
}

/**
 * Bulk-Toggle: Setzt `lueckentextModus` für ALLE Lückentext-Fragen in der
 * Fragensammlung mit einem Klick. Admin-only. LP können pro Frage im Editor
 * abweichen — dies ist ein globaler Default, kein Hard-Override.
 */
export default function LueckentextBulkToggle({ email, istAdmin }: Props) {
  const [loading, setLoading] = useState<'freitext' | 'dropdown' | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleBulk(modus: 'freitext' | 'dropdown') {
    const label = modus === 'freitext' ? 'Freitext' : 'Dropdown'
    const bestaetigung = window.confirm(
      `Alle Lückentext-Fragen auf „${label}"-Modus setzen?\n\n` +
        `Dies betrifft ALLE Fragen in der Fragensammlung (ca. 253). ` +
        `Aktion ist reversibel — du kannst jederzeit wieder umschalten.`,
    )
    if (!bestaetigung) return
    setLoading(modus)
    setError(null)
    setResult(null)
    try {
      const r = await bulkSetzeLueckentextModus(email, modus)
      if (!r) throw new Error('Backend-Antwort ungültig')
      setResult(
        `${r.geaendert} von ${r.total} Fragen auf „${modus}" gesetzt` +
          (r.alleBereits ? ' (alle waren bereits im gewünschten Modus)' : '') +
          '.',
      )
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(null)
    }
  }

  if (!istAdmin) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Diese Funktion ist nur für Admins verfügbar.
      </p>
    )
  }

  return (
    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <p className="text-sm mb-3 text-slate-700 dark:text-slate-300">
        Setzt den Antwort-Modus für <strong>alle</strong> Lückentext-Fragen in
        der Fragensammlung. LP können pro Frage im Editor abweichen.
      </p>
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => handleBulk('freitext')}
          disabled={loading !== null}
          className="px-4 py-2 min-h-[44px] rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 cursor-pointer"
        >
          {loading === 'freitext' ? 'Setze …' : 'Alle auf Freitext'}
        </button>
        <button
          type="button"
          onClick={() => handleBulk('dropdown')}
          disabled={loading !== null}
          className="px-4 py-2 min-h-[44px] rounded-md bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 cursor-pointer"
        >
          {loading === 'dropdown' ? 'Setze …' : 'Alle auf Dropdown'}
        </button>
      </div>
      {result && (
        <p className="mt-3 text-sm text-green-700 dark:text-green-400">
          {result}
        </p>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-700 dark:text-red-400">
          Fehler: {error}
        </p>
      )}
    </div>
  )
}
