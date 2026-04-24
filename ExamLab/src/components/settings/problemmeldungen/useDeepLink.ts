import { useCallback } from 'react'
import { useLPNavigation } from '../../../hooks/useLPNavigation'
import type { DeepLinkZiel } from './filterLogik'

export function useDeepLink(schliesseEinstellungen: () => void) {
  const nav = useLPNavigation()
  return useCallback((ziel: DeepLinkZiel | null) => {
    if (!ziel) return
    schliesseEinstellungen()
    switch (ziel.art) {
      case 'frage':
        nav.navigiereZuFrageneditor(ziel.id)
        break
      case 'pruefung':
      case 'gruppe':
        // Composer öffnet sowohl Prüfung als auch Übung (prefix aus Pfad abgeleitet)
        nav.navigiereZuComposer('', ziel.id)
        break
      case 'ort':
        // Nur Info, kein Navigate
        break
    }
  }, [nav, schliesseEinstellungen])
}
