export type LernenRolle = 'admin' | 'lernend' | 'unbekannt'

export interface LernenAuthUser {
  email: string
  name: string
  vorname: string
  nachname: string
  bild?: string
  rolle: LernenRolle
  sessionToken?: string
  loginMethode: 'google' | 'code'
}

export interface GooglePayload {
  email: string
  name: string
  given_name?: string
  family_name?: string
  picture?: string
}

export interface CodeLoginResponse {
  erfolg: boolean
  email?: string
  name?: string
  fehler?: string
}
