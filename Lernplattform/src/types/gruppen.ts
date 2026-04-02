export interface Gruppe {
  id: string
  name: string
  typ: 'privat' | 'schule'
  adminEmail: string
  fragebankSheetId: string
  analytikSheetId: string
  mitglieder: string[]
}

export interface Mitglied {
  email: string
  name: string
  rolle: 'admin' | 'lernend'
  code?: string
  beigetreten: string
}
