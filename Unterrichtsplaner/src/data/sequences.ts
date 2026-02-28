import type { Sequence } from '../types';

export const SEQUENCES: Record<string, Sequence[]> = {
  c17: [
    { weeks: ['33','34','35','36','37'], label: 'OR AT' },
    { weeks: ['42','43'], label: 'Störung VE' },
    { weeks: ['46','47','48','49','50','51','02','03'], label: 'GA Sozvers.' },
    { weeks: ['04','05','07','08','09'], label: 'Steuern/Reform' },
  ],
  c31: [
    { weeks: ['33','34','35','36','37'], label: 'Einf. BWL' },
    { weeks: ['42','43','44','45'], label: 'St. Galler M.' },
    { weeks: ['46','47','48','49','50','51','02'], label: 'Marketing' },
    { weeks: ['03','04','05','07','08','09','10','11','12','13'], label: 'FIBU' },
  ],
  c19: [
    { weeks: ['33','34'], label: 'Rep. FIBU' },
    { weeks: ['36','37','42'], label: 'Grundrechte' },
    { weeks: ['43','44','45','46'], label: 'Mietrecht' },
    { weeks: ['48','49','50','51','02','03','04','05'], label: 'VWL Preis' },
    { weeks: ['07','08','09','10','11','13'], label: 'Markt/Staat' },
    { weeks: ['18','19'], label: 'OR AT' },
  ],
  c4: [
    { weeks: ['33','34'], label: 'Rep. Progr.' },
    { weeks: ['42','43','44','45','46','47','48','49','50','51'], label: 'Vorträge RTpP' },
    { weeks: ['07','08','09','10','11','12','13','18','19','20','21','23'], label: 'Projekte S4' },
  ],
  c29: [
    { weeks: ['33','34'], label: 'Rep. FIBU' },
    { weeks: ['36','37','42'], label: 'Grundrechte' },
    { weeks: ['44','45','46','47','48','49','50','51','02','03'], label: 'Ges.recht' },
    { weeks: ['05','07','08','09'], label: 'VWL Preis' },
  ],
};
