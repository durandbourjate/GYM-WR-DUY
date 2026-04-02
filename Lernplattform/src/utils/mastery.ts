import type { MasteryStufe, FragenFortschritt } from '../types/fortschritt'

const GEFESTIGT_SCHWELLE = 3
const GEMEISTERT_SCHWELLE = 5
const GEMEISTERT_MIN_SESSIONS = 2

export function berechneMastery(richtigInFolge: number, sessionIds: string[]): MasteryStufe {
  if (richtigInFolge === 0 && sessionIds.length === 0) return 'neu'

  const uniqueSessions = new Set(sessionIds).size

  if (richtigInFolge >= GEMEISTERT_SCHWELLE && uniqueSessions >= GEMEISTERT_MIN_SESSIONS) {
    return 'gemeistert'
  }
  if (richtigInFolge >= GEFESTIGT_SCHWELLE) {
    return 'gefestigt'
  }
  return 'ueben'
}

export function aktualisiereFortschritt(
  fortschritt: FragenFortschritt,
  korrekt: boolean,
  sessionId: string
): FragenFortschritt {
  const sessionIds = fortschritt.sessionIds.includes(sessionId)
    ? fortschritt.sessionIds
    : [...fortschritt.sessionIds, sessionId]

  const richtigInFolge = korrekt ? fortschritt.richtigInFolge + 1 : 0

  const mastery = berechneMastery(richtigInFolge, sessionIds)

  return {
    ...fortschritt,
    versuche: fortschritt.versuche + 1,
    richtig: korrekt ? fortschritt.richtig + 1 : fortschritt.richtig,
    richtigInFolge,
    sessionIds,
    letzterVersuch: new Date().toISOString(),
    mastery,
  }
}

export function istDauerbaustelle(
  versuche: number,
  richtig: number,
  schwelle = 10,
  quoteSchwelle = 0.5
): boolean {
  if (versuche < schwelle) return false
  return (richtig / versuche) < quoteSchwelle
}
