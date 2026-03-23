import { getJson } from './apiClient'

// Typen
export interface ZentralerKurs {
  kursId: string
  label: string
  fach: string
  gefaess: string
  lpEmail: string
  klassen: string
  aktiv: string
}

export interface StundenplanEintrag {
  kursId: string
  wochentag: string
  lektionen: string
  zeit: string
  raum: string
}

export interface KursDetails {
  kurs: ZentralerKurs
  schueler: Array<{ name: string; email: string; klasse: string }>
  stundenplan: StundenplanEintrag[]
  phasen: Array<{ kursId: string; phase: string; startKW: string; endKW: string }>
}

export interface Schuljahr {
  ferien: Array<{ label: string; startKW: string; endKW: string }>
  sonderwochen: Array<{ kw: string; label: string; gymLevel: string; typ: string }>
  semester: Array<{ kursId: string; semester: string; startKW: string; endKW: string }>
  phasen: Array<{ kursId: string; phase: string; startKW: string; endKW: string }>
}

export interface LehrplanDaten {
  lehrplanziele: Array<{ id: string; ebene: string; parentId: string; fach: string; gefaess: string; semester: string; thema: string; text: string; bloom: string }>
  beurteilungsregeln: Array<{ gefaess: string; semester: string; minNoten: string; gewichtung: string; bemerkung: string }>
}

// API-Funktionen
export async function ladeKurse(email: string): Promise<ZentralerKurs[]> {
  const result = await getJson<{ kurse: ZentralerKurs[] }>('ladeKurse', { email })
  return result?.kurse ?? []
}

export async function ladeKursDetails(email: string, kursId: string): Promise<KursDetails | null> {
  return getJson<KursDetails>('ladeKursDetails', { email, kursId })
}

export async function ladeSchuljahr(email: string): Promise<Schuljahr | null> {
  return getJson<Schuljahr>('ladeSchuljahr', { email })
}

export async function ladeLehrplan(email: string, fach?: string, gefaess?: string): Promise<LehrplanDaten | null> {
  return getJson<LehrplanDaten>('ladeLehrplan', { email, fach: fach ?? '', gefaess: gefaess ?? '' })
}
