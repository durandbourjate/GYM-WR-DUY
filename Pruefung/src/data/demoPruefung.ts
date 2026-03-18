import type { PruefungsConfig } from '../types/pruefung.ts'

export const demoPruefung: PruefungsConfig = {
  id: 'demo',
  titel: 'Demo-Prüfung WR — Wirtschaft & Recht',

  klasse: '28abcd WR',
  gefaess: 'SF',
  semester: 'S4',
  fachbereiche: ['VWL', 'BWL', 'Recht'],
  datum: '2026-03-16',

  typ: 'summativ',
  modus: 'pruefung',
  dauerMinuten: 45,
  gesamtpunkte: 24,

  erlaubteKlasse: '28abcd WR',

  sebErforderlich: false,

  abschnitte: [
    {
      titel: 'Teil A: Multiple Choice',
      beschreibung: 'Beantworten Sie die folgenden Fragen. Bei Mehrfachauswahl-Fragen können mehrere Antworten korrekt sein.',
      fragenIds: ['vwl-mc-001', 'bwl-mc-001', 'recht-mc-001'],
    },
    {
      titel: 'Teil B: Freitext',
      beschreibung: 'Beantworten Sie die folgenden Fragen in eigenen Worten. Achten Sie auf eine klare Struktur.',
      fragenIds: ['bwl-ft-001', 'vwl-ft-001', 'recht-ft-001'],
    },
    {
      titel: 'Teil C: Lückentext',
      beschreibung: 'Ergänzen Sie die fehlenden Begriffe.',
      fragenIds: ['recht-lt-001'],
    },
    {
      titel: 'Teil D: Zuordnung',
      beschreibung: 'Ordnen Sie die Begriffe korrekt zu. Verwenden Sie die Dropdown-Menüs.',
      fragenIds: ['bwl-zu-001'],
    },
  ],

  zufallsreihenfolgeFragen: false,
  ruecknavigation: true,
  zeitanzeigeTyp: 'countdown',

  freigeschaltet: true,
  autoSaveIntervallSekunden: 30,
  heartbeatIntervallSekunden: 10,

  korrektur: {
    aktiviert: false,
    modus: 'batch',
  },

  feedback: {
    zeitpunkt: 'nach-review',
    format: 'in-app-und-pdf',
    detailgrad: 'vollstaendig',
  },
}
