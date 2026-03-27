/** Rollen basierend auf E-Mail-Domain */
export type Rolle = 'sus' | 'lp' | 'unbekannt'

/** Authentifizierter Benutzer */
export interface AuthUser {
  email: string
  name: string
  vorname: string
  nachname: string
  bild?: string
  rolle: Rolle
  schuelerId?: string // 4-stelliger Fallback-Code
  fachschaft?: string // LP-Fachschaft (z.B. 'WR')
  adminRolle?: boolean // Admin-LP (sieht alles)
}
