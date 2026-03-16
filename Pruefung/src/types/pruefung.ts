export interface PruefungsConfig {
  id: string;
  titel: string;

  // Zuordnung
  klasse: string;
  gefaess: 'SF' | 'EF' | 'EWR';
  semester: string;
  fachbereiche: string[];
  datum: string;

  // Prüfungsparameter
  typ: 'summativ' | 'formativ';
  modus: 'pruefung' | 'uebung';
  dauerMinuten: number;
  gesamtpunkte: number;

  // Authentifizierung
  erlaubteKlasse: string;
  erlaubteEmails?: string[];

  // SEB-Konfiguration
  sebErforderlich: boolean;
  sebCustomUserAgent?: string;

  // Fragen
  abschnitte: PruefungsAbschnitt[];

  // Navigation & Darstellung
  zufallsreihenfolgeFragen: boolean;
  ruecknavigation: boolean;
  zeitanzeigeTyp: 'countdown' | 'verstricheneZeit' | 'keine';

  // Auto-Save
  autoSaveIntervallSekunden: number;
  heartbeatIntervallSekunden: number;

  // KI-Korrektur
  korrektur: {
    aktiviert: boolean;
    modus: 'sofort' | 'batch';
    systemPrompt?: string;
  };

  // Feedback
  feedback: {
    zeitpunkt: 'sofort' | 'nach-review' | 'manuell';
    format: 'in-app-und-pdf' | 'pdf' | 'in-app';
    detailgrad: 'nur-punkte' | 'punkte-und-kommentar' | 'vollstaendig';
  };

  vorlageVon?: string;
}

export interface PruefungsAbschnitt {
  titel: string;
  beschreibung?: string;
  fragenIds: string[];
  punkteOverrides?: Record<string, number>;
}
