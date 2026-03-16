import type { PruefungsAbgabe } from '../types/antworten.ts'

/** Remote-Save Interface — Implementierung kommt in Phase 2 (Google Apps Script) */
export interface RemoteSaveService {
  save(abgabe: PruefungsAbgabe): Promise<boolean>
}

/** Mock-Implementierung für Phase 1 (Demo-Modus) */
export const mockRemoteSave: RemoteSaveService = {
  async save(abgabe: PruefungsAbgabe): Promise<boolean> {
    console.log('[Mock Remote Save]', {
      pruefungId: abgabe.pruefungId,
      antworten: Object.keys(abgabe.antworten).length,
      timestamp: new Date().toISOString(),
    })
    return true
  },
}
