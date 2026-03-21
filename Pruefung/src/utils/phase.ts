import type { PruefungsConfig } from '../types/pruefung'
import type { SchuelerStatus, PruefungsPhase } from '../types/monitoring'

/**
 * Bestimmt die aktuelle Prüfungsphase deterministisch aus dem Zustand.
 * Evaluationsreihenfolge (höchste Priorität zuerst):
 * 1. beendetUm gesetzt → beendet
 * 2. freigeschaltet → aktiv
 * 3. teilnehmer gesetzt + mind. 1 SuS eingeloggt → lobby
 * 4. sonst → vorbereitung
 */
export function bestimmePhase(
  config: PruefungsConfig,
  schuelerStatus: SchuelerStatus[],
): PruefungsPhase {
  if (config.beendetUm) return 'beendet'
  if (config.freigeschaltet) return 'aktiv'
  if (
    config.teilnehmer &&
    config.teilnehmer.length > 0 &&
    schuelerStatus.some((s) => s.status !== 'nicht-gestartet')
  ) {
    return 'lobby'
  }
  return 'vorbereitung'
}

/**
 * Berechnet den Zeitpunkt der letzten Aktivität eines SuS.
 * Abgeleitet aus max(letzterHeartbeat, letzterSave).
 * Gibt 0 zurück wenn keine Aktivität vorhanden.
 */
export function letzteAktivitaet(schueler: SchuelerStatus): number {
  return Math.max(
    new Date(schueler.letzterHeartbeat ?? 0).getTime(),
    new Date(schueler.letzterSave ?? 0).getTime(),
  )
}

/**
 * Bestimmt die Inaktivitäts-Stufe anhand der letzten Aktivität.
 * Gibt null zurück wenn SuS nicht aktiv (abgegeben, nicht gestartet).
 */
export function inaktivitaetsStufe(
  schueler: SchuelerStatus,
): 'gelb' | 'orange' | 'rot' | null {
  if (schueler.status !== 'aktiv') return null
  const letzte = letzteAktivitaet(schueler)
  if (letzte === 0) return null
  const diff = (Date.now() - letzte) / 1000 / 60 // Minuten
  if (diff > 5) return 'rot'
  if (diff > 3) return 'orange'
  if (diff > 1) return 'gelb'
  return null
}
