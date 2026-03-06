/**
 * Holiday presets for Swiss schools (Kanton Bern, Gymnasium Agglomeration Bern).
 * Source: Ferienordnung der öffentlichen Gymnasien der Agglomeration Bern 2025–2028.
 * 
 * Format: Array of { label, startWeek, endWeek } per school year.
 * Weeks are ISO week numbers (KW).
 */

export interface HolidayPreset {
  label: string;
  startWeek: string;  // ISO week number, zero-padded
  endWeek: string;
}

export interface SchoolYearPreset {
  id: string;
  label: string;
  startWeek: number;  // first school week
  startYear: number;
  endWeek: number;    // last school week
  endYear: number;
  semesterBreakWeek: number; // first week of S2
  holidays: HolidayPreset[];
  feiertage: string[]; // special single-day holidays as KW (approximate, since they fall mid-week)
}

export const SCHOOL_YEAR_PRESETS: SchoolYearPreset[] = [
  {
    id: 'gym-bern-2025-26',
    label: 'SJ 2025/26 (Gym Bern)',
    startWeek: 33, startYear: 2025,
    endWeek: 32, endYear: 2026,
    semesterBreakWeek: 7,
    holidays: [
      { label: 'Herbstferien', startWeek: '39', endWeek: '41' },
      { label: 'Winterferien', startWeek: '52', endWeek: '01' },
      { label: 'Sportferien', startWeek: '06', endWeek: '06' },
      { label: 'Frühlingsferien', startWeek: '15', endWeek: '16' },
    ],
    feiertage: ['20'], // Auffahrt KW20
  },
  {
    id: 'gym-bern-2026-27',
    label: 'SJ 2026/27 (Gym Bern)',
    startWeek: 34, startYear: 2026,
    endWeek: 32, endYear: 2027,
    semesterBreakWeek: 7,
    holidays: [
      // Herbstferien: Sa 19.09.2026 – So 11.10.2026 → KW39–41
      { label: 'Herbstferien', startWeek: '39', endWeek: '41' },
      // Winterferien: Do 24.12.2026 – So 10.01.2027 → KW52–01
      { label: 'Winterferien', startWeek: '52', endWeek: '01' },
      // Sportferien: Sa 06.02.2027 – So 14.02.2027 → KW06
      { label: 'Sportferien', startWeek: '06', endWeek: '06' },
      // Frühlingsferien: Sa 10.04.2027 – So 25.04.2027 → KW15–16
      { label: 'Frühlingsferien', startWeek: '15', endWeek: '16' },
    ],
    feiertage: ['18'], // Auffahrt KW18 (06.05.2027)
  },
  {
    id: 'gym-bern-2027-28',
    label: 'SJ 2027/28 (Gym Bern)',
    startWeek: 33, startYear: 2027,
    endWeek: 32, endYear: 2028,
    semesterBreakWeek: 7,
    holidays: [
      // Herbstferien: Sa 25.09.2027 – So 17.10.2027 → KW39–41
      { label: 'Herbstferien', startWeek: '39', endWeek: '41' },
      // Winterferien: Fr 24.12.2027 – So 09.01.2028 → KW52–01
      { label: 'Winterferien', startWeek: '52', endWeek: '01' },
      // Sportferien: Sa 05.02.2028 – So 13.02.2028 → KW06
      { label: 'Sportferien', startWeek: '06', endWeek: '06' },
      // Frühlingsferien: Sa 08.04.2028 – So 23.04.2028 → KW15–16
      { label: 'Frühlingsferien', startWeek: '15', endWeek: '16' },
    ],
    feiertage: ['18'], // Auffahrt KW18 (25.05.2028)
  },
];

/**
 * Get the best matching preset for a given start year.
 */
export function getPresetForYear(startYear: number): SchoolYearPreset | null {
  return SCHOOL_YEAR_PRESETS.find(p => p.startYear === startYear) ?? null;
}
