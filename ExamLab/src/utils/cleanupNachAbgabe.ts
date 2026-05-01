import { clearIndexedDB } from '../services/autoSave'
import { usePruefungStore } from '../store/pruefungStore'

/**
 * Räumt localStorage und IndexedDB nach erfolgreicher Prüfungsabgabe auf.
 * Async wegen IndexedDB-Clear: tx.oncomplete muss awaiten bevor potenzielle
 * Hard-Nav (Logout, Tab-Close) folgt — sonst bricht Browser die IDB-Tx beim
 * Page-Unload ab (S149-Lehre, .claude/rules/safety-pwa.md).
 * Muss in ALLEN Abgabe-Pfaden aufgerufen werden:
 * - Freiwillige Abgabe (AbgabeDialog)
 * - Demo-Abgabe (AbgabeDialog, Demo-Pfad)
 * - LP-erzwungenes Beenden (Timer autoAbgabe)
 */
export async function cleanupNachAbgabe(storeKey: string): Promise<void> {
  await clearIndexedDB(storeKey)
  // Zustand persist-Storage leeren (verhindert dass persist den Key sofort wieder schreibt)
  usePruefungStore.persist.clearStorage()
  try {
    localStorage.removeItem(`pruefung-abgabe-${storeKey}`)
  } catch {
    // ignorieren — localStorage könnte in SEB eingeschränkt sein
  }
}
