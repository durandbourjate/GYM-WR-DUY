import { useEffect, useRef } from 'react'
import { useThemenSichtbarkeitStore } from '../../store/ueben/themenSichtbarkeitStore'

/**
 * Liest Deep-Link-Parameter (?fach=...&thema=...) aus der URL
 * und aktiviert das Thema automatisch für den aktuellen SuS.
 *
 * Bereinigt die URL nach erfolgreicher Aktivierung (history.replaceState).
 * Läuft nur einmal pro Page-Load.
 */
export function useDeepLinkAktivierung(
  gruppeId: string | undefined,
  email: string | undefined,
  istAngemeldet: boolean
) {
  const verarbeitet = useRef(false)
  const { setzeStatus } = useThemenSichtbarkeitStore()

  useEffect(() => {
    if (verarbeitet.current || !gruppeId || !email || !istAngemeldet) return

    const params = new URLSearchParams(window.location.search)
    const fach = params.get('fach')
    const thema = params.get('thema')

    if (!fach || !thema) return

    verarbeitet.current = true

    // Thema aktivieren (async, Fehler still schlucken)
    setzeStatus(gruppeId, fach, thema, 'aktiv', email, 'deeplink')
      .then(erfolg => {
        if (erfolg) {
          console.log(`[DeepLink] Thema aktiviert: ${fach} / ${thema}`)
        } else {
          console.warn(`[DeepLink] Thema-Aktivierung fehlgeschlagen: ${fach} / ${thema}`)
        }
      })
      .catch(err => {
        console.warn('[DeepLink] Fehler bei Thema-Aktivierung:', err)
      })

    // URL bereinigen (fach/thema entfernen, andere Params behalten)
    params.delete('fach')
    params.delete('thema')
    const neueUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname
    window.history.replaceState({}, '', neueUrl)
  }, [gruppeId, email, istAngemeldet, setzeStatus])
}
