/**
 * IW-Plan (Intensivwochen) Presets für Gym Hofwil.
 * Quelle: IW-Plan SJ 25/26 (Stand 10.07.2025, konsolidiert 04.03.2026)
 *
 * Jeder Eintrag ist eine SpecialWeekConfig mit gymLevel.
 * Wird über den "IW-Plan laden"-Button in den SpecialWeeksEditor eingefügt.
 *
 * Legende:
 *   GYM1 = AK29 (29abcd) + 30fs (TaF GYM1)
 *   GYM2 = AK28 (28abcd) + 29fs (TaF GYM2)
 *   GYM3 = AK27 (27abcd) + 28f (TaF GYM3)
 *   GYM4 = AK26 (26abcd) + 27f (TaF GYM4)
 *   GYM5 = 26f (TaF GYM5)
 *   TaF  = alle TaF-Klassen gemeinsam (z.B. IW46)
 *
 * Wo kein Eintrag: normaler Unterricht gemäss Stundenplan.
 */

import type { SpecialWeekConfig } from '../store/settingsStore';

export const IW_PRESET_2526: SpecialWeekConfig[] = [

  // ── IW 38 ──────────────────────────────────────────────────────────────
  // GYM1: Klassenwoche (TaF: darin 2h tägl. für TaF-Fächer integriert)
  { id: 'iw38-gym1', label: 'IW 38: Klassenwoche', week: '38', type: 'event', gymLevel: 'GYM1' },
  // GYM2: SOL-Projekt Auftrittskompetenz (2 HT); 29f: Mathematik (3 HT); 29s: Englisch (3 HT)
  { id: 'iw38-gym2', label: 'IW 38: SOL Auftrittskomp.', week: '38', type: 'event', gymLevel: 'GYM2' },
  // GYM3: Franzaufenthalt / Kompensation (Studienreise im Klassenverband; Physik 2HT, Deutsch 3HT)
  { id: 'iw38-gym3-regel', label: 'IW 38: Studienreise', week: '38', type: 'event', gymLevel: 'GYM3' },
  // GYM4: Studienreise im Klassenverband (Physik 2HT, MA-Arbeit 3HT; TaF HKB)
  { id: 'iw38-gym4', label: 'IW 38: Studienreise', week: '38', type: 'event', gymLevel: 'GYM4' },

  // ── IW 46 (TaF-Woche) ──────────────────────────────────────────────────
  // Regelklassen: normaler Unterricht gemäss Stundenplan (kein Eintrag nötig)
  // TaF: alle GYM-Stufen; EF/SF-Sport werden besucht, G&K/MU nach Stufe
  { id: 'iw46-taf', label: 'IW 46: TaF-Woche', week: '46', type: 'event', gymLevel: 'TaF' },

  // ── IW 12 ──────────────────────────────────────────────────────────────
  // GYM1 und GYM3: normaler Unterricht (SF-Unterricht für Sportler*innen findet statt)
  // GYM2: Schneesportlager
  { id: 'iw12-gym2', label: 'IW 12: Schneesportlager', week: '12', type: 'event', gymLevel: 'GYM2' },

  // ── IW 14 ──────────────────────────────────────────────────────────────
  // GYM1: Nothilfekurs, Gesundheit, Sicherheit
  { id: 'iw14-gym1', label: 'IW 14: Gesundheit/Nothelfer', week: '14', type: 'event', gymLevel: 'GYM1' },
  // GYM2: Deutsch G&K; alternierend Videoinstallation/Druck; MU TaF; Sport GF BG
  { id: 'iw14-gym2', label: 'IW 14: Deutsch', week: '14', type: 'event', gymLevel: 'GYM2' },
  // GYM3: Ergänzungsfach; G&K alternierend; Sport: Englisch (5 HT) für Sportler*innen
  { id: 'iw14-gym3', label: 'IW 14: Ergänzungsfach', week: '14', type: 'event', gymLevel: 'GYM3' },
  // GYM4: Maturvorbereitung (Deutsch, Mathematik / HKB)
  { id: 'iw14-gym4', label: 'IW 14: Maturvorbereitung', week: '14', type: 'event', gymLevel: 'GYM4' },

  // ── IW 25 ──────────────────────────────────────────────────────────────
  // GYM1: Geografie und Sport
  { id: 'iw25-gym1', label: 'IW 25: Geo + Sport', week: '25', type: 'event', gymLevel: 'GYM1' },
  // GYM2: Wirtschaft und Arbeit (Wirtschaftswoche)
  { id: 'iw25-gym2', label: 'IW 25: Wirtschaftswoche', week: '25', type: 'event', gymLevel: 'GYM2' },
  // GYM3: Maturaarbeit
  { id: 'iw25-gym3', label: 'IW 25: Maturaarbeit', week: '25', type: 'event', gymLevel: 'GYM3' },
  // GYM4 + 27f: Maturprüfung (schriftlich, bis Mi KW26)
  { id: 'iw25-gym4', label: 'IW 25: Maturprüfung (schriftl.)', week: '25', type: 'event', gymLevel: 'GYM4' },

  // ── IW 27 ──────────────────────────────────────────────────────────────
  // GYM1: Medien-Spezialwoche
  { id: 'iw27-gym1', label: 'IW 27: Medien-Spezialwoche', week: '27', type: 'event', gymLevel: 'GYM1' },
  // GYM2: MINT; 29f: Französisch (5 HT) → danach F-Aufenthalt
  { id: 'iw27-gym2', label: 'IW 27: MINT', week: '27', type: 'event', gymLevel: 'GYM2' },
  // GYM3: SF-Woche (Sport: SF-Woche; G&K/MU: Englisch 5 HT)
  { id: 'iw27-gym3', label: 'IW 27: SF-Woche', week: '27', type: 'event', gymLevel: 'GYM3' },
  // GYM5 TaF: Spezial-IW (5 HT); GYM4 Regel: Studienreise
  { id: 'iw27-gym4', label: 'IW 27: Studienreise', week: '27', type: 'event', gymLevel: 'GYM4' },
  { id: 'iw27-gym5-taf', label: 'IW 27: TaF-Spezial (5 HT)', week: '27', type: 'event', gymLevel: 'GYM5' },

];
