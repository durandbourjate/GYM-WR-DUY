/**
 * LP-Verwaltung: Lädt Lehrpersonen-Liste vom Backend
 */

export interface LPInfo {
  email: string
  name: string
  kuerzel: string
  fachschaft: string
  rolle: 'admin' | 'lp'
}

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

/**
 * Lädt alle aktiven Lehrpersonen vom Backend.
 * Wird einmal pro Session aufgerufen und im authStore gecached.
 */
export async function ladeLehrpersonen(): Promise<LPInfo[] | null> {
  if (!APPS_SCRIPT_URL) return null

  try {
    // Dummy-Email für initialen Auth-Check (Backend prüft Domain)
    const url = `${APPS_SCRIPT_URL}?action=ladeLehrpersonen&email=check@gymhofwil.ch`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    return data.lehrpersonen ?? null
  } catch (e) {
    console.warn('[lpApi] Lehrpersonen laden fehlgeschlagen:', e)
    return null
  }
}
