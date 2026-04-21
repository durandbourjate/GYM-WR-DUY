import { postJson } from './apiClient'

export type KalibrierungsEinstellungen = {
  global: boolean
  aktionenAktiv: {
    generiereMusterloesung: boolean
    klassifiziereFrage: boolean
    bewertungsrasterGenerieren: boolean
    korrigiereFreitext: boolean
  }
  minBeispiele: number
  beispielAnzahl: number
  zeigeQuotaWarnung?: boolean
  letzterQuotaFehler?: string
}

export type KIFeedbackEintragLP = {
  feedbackId: string
  zeitstempel: string
  aktion: string
  fachbereich: string
  bloom?: string
  inputJson: Record<string, unknown>
  kiOutputJson: Record<string, unknown>
  finaleVersionJson: Record<string, unknown>
  diffScore: number
  status: 'offen' | 'geschlossen' | 'ignoriert'
  qualifiziert: boolean
  wichtig: boolean
  aktiv: boolean
}

export type KalibrierungsStatistik = {
  aktionen: Record<string, {
    vorschlaege: number
    unveraendert: number
    leicht: number
    deutlich: number
    verworfen: number
    aktive: number
    wichtige: number
  }>
  zeitraum_tage: number
}

export const kalibrierungApi = {
  ladeEinstellungen: (email: string) =>
    postJson<KalibrierungsEinstellungen>('kalibrierungsEinstellungen', { modus: 'laden', email }),

  speichereEinstellungen: (email: string, konfig: KalibrierungsEinstellungen) =>
    postJson<boolean>('kalibrierungsEinstellungen', { modus: 'speichern', email, konfig }),

  listeFeedbacks: (email: string, filter: Record<string, unknown> = {}, seite = 0, proSeite = 50) =>
    postJson<{ eintraege: KIFeedbackEintragLP[]; gesamt: number }>('listeKIFeedbacks', { email, filter, seite, proSeite }),

  aktualisiereFeedback: (email: string, feedbackId: string, changes: { wichtig?: boolean; aktiv?: boolean }) =>
    postJson<boolean>('aktualisiereKIFeedback', { email, feedbackId, ...changes }),

  loescheFeedback: (email: string, feedbackId: string) =>
    postJson<boolean>('loescheKIFeedback', { email, feedbackId }),

  bulkLoesche: (email: string, filter: Record<string, unknown>) =>
    postJson<{ geloescht: number }>('bulkLoescheKIFeedbacks', { email, filter }),

  statistik: (email: string, zeitraum_tage = 30) =>
    postJson<KalibrierungsStatistik>('kalibrierungsStatistik', { email, zeitraum_tage }),
}
