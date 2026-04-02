import type { Mitglied } from '../types/gruppen'
import type { FragenFortschritt, MasteryStufe } from '../types/fortschritt'

export const MOCK_MITGLIEDER: Mitglied[] = [
  { email: 'anna@gmail.com', name: 'Anna Durand', rolle: 'lernend', beigetreten: '2026-03-01' },
  { email: 'leo@gmail.com', name: 'Leo Durand', rolle: 'lernend', beigetreten: '2026-03-01' },
  { email: 'mia@gmail.com', name: 'Mia Durand', rolle: 'lernend', beigetreten: '2026-03-15' },
]

function macheFortschritt(
  fragenId: string, email: string, mastery: MasteryStufe,
  versuche: number, richtig: number, richtigInFolge: number, sessions: string[]
): FragenFortschritt {
  return {
    fragenId, email, versuche, richtig, richtigInFolge,
    sessionIds: sessions, letzterVersuch: '2026-04-02', mastery,
  }
}

// Mock-Fortschritte fuer alle 3 Kinder
export const MOCK_MITGLIEDER_FORTSCHRITTE: Record<string, FragenFortschritt[]> = {
  'anna@gmail.com': [
    macheFortschritt('math-add-1', 'anna@gmail.com', 'gemeistert', 8, 7, 5, ['s1', 's2', 's3']),
    macheFortschritt('math-add-2', 'anna@gmail.com', 'gefestigt', 5, 4, 3, ['s1', 's2']),
    macheFortschritt('math-add-3', 'anna@gmail.com', 'gefestigt', 4, 3, 3, ['s2']),
    macheFortschritt('math-add-4', 'anna@gmail.com', 'ueben', 3, 1, 1, ['s2']),
    macheFortschritt('math-mul-1', 'anna@gmail.com', 'gemeistert', 7, 6, 5, ['s1', 's3']),
    macheFortschritt('math-mul-2', 'anna@gmail.com', 'ueben', 4, 2, 0, ['s3']),
    macheFortschritt('de-wort-1', 'anna@gmail.com', 'gefestigt', 5, 4, 3, ['s1']),
    macheFortschritt('de-wort-2', 'anna@gmail.com', 'ueben', 6, 2, 0, ['s1', 's2']),
    macheFortschritt('de-wort-3', 'anna@gmail.com', 'ueben', 3, 1, 1, ['s2']),
    macheFortschritt('de-satz-1', 'anna@gmail.com', 'neu', 0, 0, 0, []),
    macheFortschritt('de-satz-2', 'anna@gmail.com', 'neu', 0, 0, 0, []),
  ],
  'leo@gmail.com': [
    macheFortschritt('math-add-1', 'leo@gmail.com', 'gefestigt', 5, 4, 3, ['s1']),
    macheFortschritt('math-add-2', 'leo@gmail.com', 'ueben', 3, 1, 0, ['s1']),
    macheFortschritt('math-add-3', 'leo@gmail.com', 'ueben', 2, 1, 1, ['s1']),
    macheFortschritt('math-mul-1', 'leo@gmail.com', 'ueben', 4, 2, 1, ['s1']),
    macheFortschritt('de-wort-1', 'leo@gmail.com', 'gemeistert', 9, 8, 6, ['s1', 's2', 's3']),
    macheFortschritt('de-wort-2', 'leo@gmail.com', 'gefestigt', 6, 5, 4, ['s1', 's2']),
    macheFortschritt('de-wort-3', 'leo@gmail.com', 'gefestigt', 5, 4, 3, ['s2']),
    macheFortschritt('de-satz-1', 'leo@gmail.com', 'ueben', 3, 1, 0, ['s2']),
  ],
  'mia@gmail.com': [
    macheFortschritt('math-add-1', 'mia@gmail.com', 'ueben', 2, 1, 1, ['s1']),
    macheFortschritt('de-wort-1', 'mia@gmail.com', 'ueben', 1, 0, 0, ['s1']),
  ],
}

export const MOCK_SESSIONS: Record<string, { datum: string; fach: string; thema: string; anzahl: number; richtig: number }[]> = {
  'anna@gmail.com': [
    { datum: '2026-04-02', fach: 'Mathe', thema: 'Addition', anzahl: 4, richtig: 3 },
    { datum: '2026-04-01', fach: 'Deutsch', thema: 'Wortarten', anzahl: 3, richtig: 1 },
    { datum: '2026-03-30', fach: 'Mathe', thema: 'Multiplikation', anzahl: 4, richtig: 3 },
    { datum: '2026-03-28', fach: 'Mathe', thema: 'Addition', anzahl: 4, richtig: 4 },
  ],
  'leo@gmail.com': [
    { datum: '2026-04-02', fach: 'Deutsch', thema: 'Satzglieder', anzahl: 3, richtig: 1 },
    { datum: '2026-04-01', fach: 'Deutsch', thema: 'Wortarten', anzahl: 6, richtig: 5 },
    { datum: '2026-03-29', fach: 'Mathe', thema: 'Addition', anzahl: 5, richtig: 3 },
  ],
  'mia@gmail.com': [
    { datum: '2026-04-02', fach: 'Mathe', thema: 'Addition', anzahl: 2, richtig: 1 },
  ],
}
