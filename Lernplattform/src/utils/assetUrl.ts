/** Löst relative Asset-Pfade korrekt auf (berücksichtigt Vite base path) */
export function resolveAssetUrl(pfad: string): string {
  if (!pfad) return pfad
  // Bereits absolute URL (http/https/blob/data) → unverändert
  if (/^(https?:|blob:|data:)/.test(pfad)) return pfad
  // Führenden Slash entfernen (falls noch vorhanden)
  const bereinigt = pfad.replace(/^\//, '')
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${bereinigt}`
}
