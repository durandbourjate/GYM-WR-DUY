/**
 * Schweizer KMU-Kontenrahmen — Standardkonten für FiBu-Fragetypen.
 * Basierend auf dem Kontenrahmen KMU (Schweiz), vereinfacht für Gymnasialunterricht.
 */
import type { KontoEintrag } from './kontenrahmen'

const kontenrahmenDaten: KontoEintrag[] = [
  // ══════════════════════════════════════
  // KLASSE 1: AKTIVEN (Bilanz)
  // ══════════════════════════════════════

  // Umlaufvermögen
  { nummer: '1000', name: 'Kasse', kategorie: 'aktiv', gruppe: 'Umlaufvermögen', untergruppe: 'Flüssige Mittel' },
  { nummer: '1010', name: 'Post', kategorie: 'aktiv', gruppe: 'Umlaufvermögen', untergruppe: 'Flüssige Mittel' },
  { nummer: '1020', name: 'Bank', kategorie: 'aktiv', gruppe: 'Umlaufvermögen', untergruppe: 'Flüssige Mittel' },
  { nummer: '1100', name: 'Forderungen aus L+L', kategorie: 'aktiv', gruppe: 'Umlaufvermögen', untergruppe: 'Forderungen' },
  { nummer: '1109', name: 'Delkredere (–)', kategorie: 'aktiv', gruppe: 'Umlaufvermögen', untergruppe: 'Forderungen' },
  { nummer: '1170', name: 'Vorsteuer (Vorsteuer MWST)', kategorie: 'aktiv', gruppe: 'Umlaufvermögen', untergruppe: 'Forderungen' },
  { nummer: '1190', name: 'Sonstige Forderungen', kategorie: 'aktiv', gruppe: 'Umlaufvermögen', untergruppe: 'Forderungen' },
  { nummer: '1200', name: 'Warenvorrat / Handelswaren', kategorie: 'aktiv', gruppe: 'Umlaufvermögen', untergruppe: 'Vorräte' },
  { nummer: '1210', name: 'Rohstoffe', kategorie: 'aktiv', gruppe: 'Umlaufvermögen', untergruppe: 'Vorräte' },
  { nummer: '1260', name: 'Fertigfabrikate', kategorie: 'aktiv', gruppe: 'Umlaufvermögen', untergruppe: 'Vorräte' },
  { nummer: '1300', name: 'Aktive Rechnungsabgrenzung', kategorie: 'aktiv', gruppe: 'Umlaufvermögen', untergruppe: 'Rechnungsabgrenzung' },

  // Anlagevermögen
  { nummer: '1500', name: 'Maschinen und Apparate', kategorie: 'aktiv', gruppe: 'Anlagevermögen', untergruppe: 'Mobile Sachanlagen' },
  { nummer: '1510', name: 'Mobiliar und Einrichtungen', kategorie: 'aktiv', gruppe: 'Anlagevermögen', untergruppe: 'Mobile Sachanlagen' },
  { nummer: '1520', name: 'Büromaschinen / Informatik', kategorie: 'aktiv', gruppe: 'Anlagevermögen', untergruppe: 'Mobile Sachanlagen' },
  { nummer: '1530', name: 'Fahrzeuge', kategorie: 'aktiv', gruppe: 'Anlagevermögen', untergruppe: 'Mobile Sachanlagen' },
  { nummer: '1540', name: 'Werkzeuge und Geräte', kategorie: 'aktiv', gruppe: 'Anlagevermögen', untergruppe: 'Mobile Sachanlagen' },
  { nummer: '1600', name: 'Immobilien (Liegenschaften)', kategorie: 'aktiv', gruppe: 'Anlagevermögen', untergruppe: 'Immobile Sachanlagen' },

  // ══════════════════════════════════════
  // KLASSE 2: PASSIVEN (Bilanz)
  // ══════════════════════════════════════

  // Fremdkapital
  { nummer: '2000', name: 'Verbindlichkeiten aus L+L', kategorie: 'passiv', gruppe: 'Fremdkapital', untergruppe: 'Kurzfristig' },
  { nummer: '2100', name: 'Bankverbindlichkeiten (kurzfr.)', kategorie: 'passiv', gruppe: 'Fremdkapital', untergruppe: 'Kurzfristig' },
  { nummer: '2170', name: 'Umsatzsteuer (MWST-Schuld)', kategorie: 'passiv', gruppe: 'Fremdkapital', untergruppe: 'Kurzfristig' },
  { nummer: '2200', name: 'Geschuldete MWST', kategorie: 'passiv', gruppe: 'Fremdkapital', untergruppe: 'Kurzfristig' },
  { nummer: '2300', name: 'Passive Rechnungsabgrenzung', kategorie: 'passiv', gruppe: 'Fremdkapital', untergruppe: 'Kurzfristig' },
  { nummer: '2400', name: 'Bankdarlehen (langfr.)', kategorie: 'passiv', gruppe: 'Fremdkapital', untergruppe: 'Langfristig' },
  { nummer: '2450', name: 'Hypotheken', kategorie: 'passiv', gruppe: 'Fremdkapital', untergruppe: 'Langfristig' },
  { nummer: '2500', name: 'Rückstellungen', kategorie: 'passiv', gruppe: 'Fremdkapital', untergruppe: 'Langfristig' },

  // Eigenkapital
  { nummer: '2800', name: 'Eigenkapital / Kapital', kategorie: 'passiv', gruppe: 'Eigenkapital', untergruppe: 'Eigenkapital' },
  { nummer: '2850', name: 'Privat', kategorie: 'passiv', gruppe: 'Eigenkapital', untergruppe: 'Eigenkapital' },
  { nummer: '2900', name: 'Gewinnvortrag / Verlustvortrag', kategorie: 'passiv', gruppe: 'Eigenkapital', untergruppe: 'Eigenkapital' },
  { nummer: '2979', name: 'Jahresgewinn / Jahresverlust', kategorie: 'passiv', gruppe: 'Eigenkapital', untergruppe: 'Eigenkapital' },

  // ══════════════════════════════════════
  // KLASSE 3: BETRIEBSERTRAG (ER)
  // ══════════════════════════════════════
  { nummer: '3200', name: 'Warenertrag / Handelserlös', kategorie: 'ertrag', gruppe: 'Betriebsertrag', untergruppe: 'Nettoerlös' },
  { nummer: '3400', name: 'Dienstleistungsertrag', kategorie: 'ertrag', gruppe: 'Betriebsertrag', untergruppe: 'Nettoerlös' },
  { nummer: '3600', name: 'Übriger Betriebsertrag', kategorie: 'ertrag', gruppe: 'Betriebsertrag', untergruppe: 'Nettoerlös' },
  { nummer: '3800', name: 'Erlösminderungen (–)', kategorie: 'ertrag', gruppe: 'Betriebsertrag', untergruppe: 'Abzüge' },
  { nummer: '3805', name: 'Verluste aus Forderungen', kategorie: 'ertrag', gruppe: 'Betriebsertrag', untergruppe: 'Abzüge' },
  { nummer: '3900', name: 'Eigenleistungen / Bestandesänderungen', kategorie: 'ertrag', gruppe: 'Betriebsertrag', untergruppe: 'Bestandesänderung' },

  // ══════════════════════════════════════
  // KLASSE 4: MATERIAL-/WARENAUFWAND (ER)
  // ══════════════════════════════════════
  { nummer: '4000', name: 'Materialaufwand / Warenaufwand', kategorie: 'aufwand', gruppe: 'Warenaufwand', untergruppe: 'Material' },
  { nummer: '4200', name: 'Handelswarenaufwand', kategorie: 'aufwand', gruppe: 'Warenaufwand', untergruppe: 'Handelswaren' },
  { nummer: '4400', name: 'Aufwand für Drittleistungen', kategorie: 'aufwand', gruppe: 'Warenaufwand', untergruppe: 'Drittleistungen' },
  { nummer: '4900', name: 'Bestandesänderungen Vorräte', kategorie: 'aufwand', gruppe: 'Warenaufwand', untergruppe: 'Bestandesänderung' },

  // ══════════════════════════════════════
  // KLASSE 5: PERSONALAUFWAND (ER)
  // ══════════════════════════════════════
  { nummer: '5000', name: 'Lohnaufwand', kategorie: 'aufwand', gruppe: 'Personalaufwand', untergruppe: 'Löhne' },
  { nummer: '5200', name: 'Sozialversicherungsaufwand', kategorie: 'aufwand', gruppe: 'Personalaufwand', untergruppe: 'Sozialleistungen' },
  { nummer: '5800', name: 'Übriger Personalaufwand', kategorie: 'aufwand', gruppe: 'Personalaufwand', untergruppe: 'Übriges' },
  { nummer: '5900', name: 'Leistungen Dritter', kategorie: 'aufwand', gruppe: 'Personalaufwand', untergruppe: 'Übriges' },

  // ══════════════════════════════════════
  // KLASSE 6: ÜBRIGER BETRIEBSAUFWAND (ER)
  // ══════════════════════════════════════
  { nummer: '6000', name: 'Raumaufwand / Miete', kategorie: 'aufwand', gruppe: 'Sonstiger Aufwand', untergruppe: 'Raumaufwand' },
  { nummer: '6100', name: 'Unterhalt und Reparaturen', kategorie: 'aufwand', gruppe: 'Sonstiger Aufwand', untergruppe: 'Unterhalt' },
  { nummer: '6200', name: 'Fahrzeugaufwand', kategorie: 'aufwand', gruppe: 'Sonstiger Aufwand', untergruppe: 'Fahrzeuge' },
  { nummer: '6300', name: 'Versicherungsaufwand', kategorie: 'aufwand', gruppe: 'Sonstiger Aufwand', untergruppe: 'Versicherungen' },
  { nummer: '6400', name: 'Energieaufwand', kategorie: 'aufwand', gruppe: 'Sonstiger Aufwand', untergruppe: 'Energie' },
  { nummer: '6500', name: 'Verwaltungsaufwand', kategorie: 'aufwand', gruppe: 'Sonstiger Aufwand', untergruppe: 'Verwaltung' },
  { nummer: '6570', name: 'Informatikaufwand', kategorie: 'aufwand', gruppe: 'Sonstiger Aufwand', untergruppe: 'Verwaltung' },
  { nummer: '6600', name: 'Werbeaufwand', kategorie: 'aufwand', gruppe: 'Sonstiger Aufwand', untergruppe: 'Werbung' },
  { nummer: '6700', name: 'Sonstiger Betriebsaufwand', kategorie: 'aufwand', gruppe: 'Sonstiger Aufwand', untergruppe: 'Übriges' },
  { nummer: '6800', name: 'Abschreibungen', kategorie: 'aufwand', gruppe: 'Sonstiger Aufwand', untergruppe: 'Abschreibungen' },
  { nummer: '6900', name: 'Finanzaufwand (Zinsaufwand)', kategorie: 'aufwand', gruppe: 'Sonstiger Aufwand', untergruppe: 'Finanzen' },
  { nummer: '6950', name: 'Finanzertrag (Zinsertrag)', kategorie: 'ertrag', gruppe: 'Sonstiger Aufwand', untergruppe: 'Finanzen' },

  // ══════════════════════════════════════
  // KLASSE 7+8: BETRIEBSFREMDES + A.O. (ER)
  // ══════════════════════════════════════
  { nummer: '7000', name: 'Betriebsfremder Ertrag', kategorie: 'ertrag', gruppe: 'Betriebsfremdes', untergruppe: 'Ertrag' },
  { nummer: '7010', name: 'Liegenschaftenertrag', kategorie: 'ertrag', gruppe: 'Betriebsfremdes', untergruppe: 'Ertrag' },
  { nummer: '7500', name: 'Betriebsfremder Aufwand', kategorie: 'aufwand', gruppe: 'Betriebsfremdes', untergruppe: 'Aufwand' },
  { nummer: '7510', name: 'Liegenschaftenaufwand', kategorie: 'aufwand', gruppe: 'Betriebsfremdes', untergruppe: 'Aufwand' },
  { nummer: '8000', name: 'Ausserordentlicher Ertrag', kategorie: 'ertrag', gruppe: 'Ausserordentliches', untergruppe: 'Ertrag' },
  { nummer: '8100', name: 'Ausserordentlicher Aufwand', kategorie: 'aufwand', gruppe: 'Ausserordentliches', untergruppe: 'Aufwand' },
  { nummer: '8900', name: 'Steuern', kategorie: 'aufwand', gruppe: 'Steuern', untergruppe: 'Direkte Steuern' },
]

export default kontenrahmenDaten
