export type MasteryStufe = 'neu' | 'ueben' | 'gefestigt' | 'gemeistert'

export interface FragenFortschritt {
  fragenId: string
  email: string
  versuche: number
  richtig: number
  richtigInFolge: number
  sessionIds: string[]
  letzterVersuch: string
  mastery: MasteryStufe
}

export interface Dauerbaustelle {
  thema: string
  fach: string
  email: string
  gesamtVersuche: number
  aktuelleQuote: number
}

export interface ThemenFortschritt {
  fach: string
  thema: string
  gesamt: number
  neu: number
  ueben: number
  gefestigt: number
  gemeistert: number
  quote: number
}
