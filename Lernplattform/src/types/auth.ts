export type Rolle = 'admin' | 'lernend' | 'unbekannt'

export interface AuthUser {
  email: string
  name: string
  vorname: string
  nachname: string
  bild?: string
  rolle: Rolle
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
