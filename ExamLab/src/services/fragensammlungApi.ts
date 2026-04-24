import { postJson } from './apiClient'

/**
 * Backend liefert immer `{ success, data }`. `postJson<T>` returnt das volle
 * Response-Objekt. Dieser Helper unwrappt `.data` und gibt null zurück wenn
 * `success` fehlt, data nicht vorhanden oder falscher Shape.
 *
 * Analog zu kalibrierungApi::unwrap (S130 Hotfix-Pattern).
 */
async function unwrap<T>(
  result: { success?: boolean; data?: unknown } | null,
): Promise<T | null> {
  if (!result || typeof result !== 'object') return null
  if (result.success === false) return null
  if (result.data === undefined || result.data === null) return null
  return result.data as T
}

export interface LueckentextBulkResult {
  total: number
  geaendert: number
  alleBereits: boolean
}

/**
 * Setzt `lueckentextModus` für ALLE Lückentext-Fragen in der Fragensammlung.
 * Admin-only. Idempotent — skippt Fragen die bereits im Ziel-Modus sind.
 *
 * Reversibel: jederzeit aufs andere Modus-Label zurücksetzbar.
 */
export async function bulkSetzeLueckentextModus(
  email: string,
  modus: 'freitext' | 'dropdown',
): Promise<LueckentextBulkResult | null> {
  const r = await postJson<{ success: boolean; data?: LueckentextBulkResult }>(
    'bulkSetzeLueckentextModus',
    { email, modus },
  )
  return unwrap<LueckentextBulkResult>(r)
}
