import type { Sequence } from '../types';

export const SEQUENCES: Record<string, Sequence[]> = {
  // === SF WR Kurse ===

  // c17: 27a28f SF Mi 2L
  c17: [
    { weeks: ['33','34','35','36','37'], label: 'OR AT' },
    { weeks: ['42','43'], label: 'Störung VE' },
    { weeks: ['46','47','48','49','50','51','02','03'], label: 'GA Sozvers.' },
    { weeks: ['04','05','07','08','09'], label: 'Steuern/Reform' },
  ],

  // c31: 29c SF Fr 2L
  c31: [
    { weeks: ['33','34','35','36','37'], label: 'Einf. BWL' },
    { weeks: ['42','43','44','45'], label: 'St. Galler M.' },
    { weeks: ['46','47','48','49','50','51','02'], label: 'Marketing' },
    { weeks: ['03','04','05','07','08','09','10','11','12','13'], label: 'FIBU' },
  ],

  // c19: 28bc29fs SF Mi 2L
  c19: [
    { weeks: ['33','34'], label: 'Rep. FIBU' },
    { weeks: ['36','37','42'], label: 'Grundrechte' },
    { weeks: ['43','44','45','46'], label: 'Mietrecht' },
    { weeks: ['48','49','50','51','02','03','04','05'], label: 'VWL Preis' },
    { weeks: ['07','08','09','10','11','13'], label: 'Markt/Staat' },
    { weeks: ['18','19'], label: 'OR AT' },
  ],

  // c29: 28bc29fs SF Fr 1L
  c29: [
    { weeks: ['33','34'], label: 'Rep. FIBU' },
    { weeks: ['36','37','42'], label: 'Grundrechte' },
    { weeks: ['44','45','46','47','48','49','50','51','02','03'], label: 'Ges.recht' },
    { weeks: ['05','07','08','09'], label: 'VWL Preis' },
  ],

  // c35: 27a28f SF Fr 2L
  c35: [
    { weeks: ['33','34','35','36','37'], label: 'OR AT' },
    { weeks: ['42','43'], label: 'OR AT Störung' },
    { weeks: ['45','46','47','48','49','50','51','02'], label: 'Sozialpolitik' },
    { weeks: ['04','05'], label: 'Staatsfinanzen' },
    { weeks: ['08','09','10','12','13'], label: 'Praktikum OR BT' },
  ],

  // c11: 29c SF Di 1L
  c11: [
    { weeks: ['33','34','35','36','37'], label: 'Einf. BWL' },
    { weeks: ['42','43','44','45'], label: 'St. Galler M.' },
    { weeks: ['47','48'], label: 'Strat./Marketing' },
    { weeks: ['50','51','02'], label: 'Marketing GA' },
    { weeks: ['03','04','05','07','08','09','10','11','12','13'], label: 'FIBU' },
  ],

  // === EWR ===

  // c15: 29fs EWR Di 1L (nur S1)
  c15: [
    { weeks: ['33','34','35','36','37'], label: 'Recht Einf.' },
    { weeks: ['42','43'], label: 'Persönlichkeit' },
    { weeks: ['47'], label: 'Prozessrecht' },
    { weeks: ['50','51','02','03','04','05'], label: 'VWL BIP' },
  ],

  // === Informatik ===

  // c4: 28c IN Mo 1L
  c4: [
    { weeks: ['33','34'], label: 'Rep. Progr.' },
    { weeks: ['42','43','44','45','46','47','48','49','50','51'], label: 'Vorträge RTpP' },
    { weeks: ['07','08','09','10','11','12','13','18','19','20','21','23'], label: 'Projekte S4' },
  ],

  // c6: 29f IN Mo 2L HK
  c6: [
    { weeks: ['33','34','35','36','37'], label: 'Rep. Progr.' },
    { weeks: ['42','43','44','45'], label: 'Grafik' },
    { weeks: ['47','48','49'], label: 'Metadaten' },
    { weeks: ['50','51','02','03','04','05'], label: 'Kryptographie' },
    { weeks: ['09','10','11','12','13'], label: 'Programmieren' },
  ],

  // c13: 28c IN Di 2L HK (nur S1)
  c13: [
    { weeks: ['33','34','35','37'], label: 'Grafik' },
    { weeks: ['42','43','44'], label: 'Vektorgrafik' },
    { weeks: ['46','47'], label: 'Metadaten' },
    { weeks: ['48','49','50','51','02','03','04'], label: 'Kryptographie' },
  ],

  // c24: 30s IN Do 2L
  c24: [
    { weeks: ['33','34','35'], label: 'BYOD' },
    { weeks: ['37'], label: 'Fact-Sheets' },
    { weeks: ['42','43','44'], label: 'RTpP/KI' },
    { weeks: ['07'], label: 'Excel' },
    { weeks: ['08','09','10','11','12','13'], label: 'Programmieren' },
  ],

  // c37: 30s IN Fr 1L — zu wenig Einträge für sinnvolle Sequences
};
