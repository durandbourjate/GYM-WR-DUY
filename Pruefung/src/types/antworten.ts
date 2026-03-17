export interface PruefungsAbgabe {
  pruefungId: string;
  email: string;
  name: string;
  schuelerId?: string;

  startzeit: string;
  abgabezeit: string;

  antworten: Record<string, Antwort>;

  meta: {
    sebVersion?: string;
    browserInfo: string;
    autoSaveCount: number;
    netzwerkFehler: number;
    heartbeats: number;
    unterbrechungen: Unterbrechung[];
  };
}

export interface Unterbrechung {
  zeitpunkt: string;
  dauer_sekunden: number;
  typ: 'heartbeat-ausfall' | 'focus-verloren' | 'seb-warnung';
}

export type Antwort =
  | { typ: 'mc'; gewaehlteOptionen: string[] }
  | { typ: 'freitext'; text: string; formatierung?: string }
  | { typ: 'zuordnung'; zuordnungen: Record<string, string> }
  | { typ: 'lueckentext'; eintraege: Record<string, string> }
  | { typ: 'visualisierung'; daten: string; bildLink?: string }
  | { typ: 'richtigfalsch'; bewertungen: Record<string, boolean> }
  | { typ: 'berechnung'; ergebnisse: Record<string, string>; rechenweg?: string };
