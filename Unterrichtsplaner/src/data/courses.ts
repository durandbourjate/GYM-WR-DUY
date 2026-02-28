import type { Course } from '../types';

// Stundenplan SJ 25/26 — gemäss DUY-Angaben (28.02.2026)
// Klassenbezeichnungen: 27a28f (nicht 27abcd8f), 28bc29fs (nicht 28bc9f9s)
// SF bleibt übers Jahr gleich (Di + Do). Kein Unterricht am Freitag.
// IN/EWR kann sich je Phase/Semester ändern (TaF-Phasenunterricht).
// col-Nummern beibehalten für Kompatibilität mit bestehenden weekData.

export const COURSES: Course[] = [
  // === SF (ganzjährig, Di + Do) ===
  // 29c: Di L2 (1L) + Do L3-4 (2L)
  { id: 'c11', col: 11, cls: '29c', typ: 'SF', day: 'Di', from: '09:00', to: '09:45', les: 1, hk: false, semesters: [1, 2] },
  { id: 'c31', col: 31, cls: '29c', typ: 'SF', day: 'Do', from: '10:05', to: '11:45', les: 2, hk: false, semesters: [1, 2] },
  // 27a28f: Di L7-8 (2L) + Do L7-8 (2L)
  { id: 'c17', col: 17, cls: '27a28f', typ: 'SF', day: 'Di', from: '13:40', to: '15:20', les: 2, hk: false, semesters: [1, 2] },
  { id: 'c35', col: 35, cls: '27a28f', typ: 'SF', day: 'Do', from: '13:40', to: '15:20', les: 2, hk: false, semesters: [1, 2] },
  // 28bc29fs: Di L9-10 (2L) + Do L2 (1L)
  { id: 'c19', col: 19, cls: '28bc29fs', typ: 'SF', day: 'Di', from: '15:35', to: '17:10', les: 2, hk: false, semesters: [1, 2] },
  { id: 'c29', col: 29, cls: '28bc29fs', typ: 'SF', day: 'Do', from: '09:00', to: '09:45', les: 1, hk: false, semesters: [1, 2] },

  // === KS ===
  // 27a: S1 Mo L3, S2 Do L10
  { id: 'c2', col: 2, cls: '27a', typ: 'KS', day: 'Mo', from: '10:05', to: '10:50', les: 1, hk: false, semesters: [1] },
  { id: 'c2b', col: 2, cls: '27a', typ: 'KS', day: 'Do', from: '16:25', to: '17:10', les: 1, hk: false, semesters: [2] },

  // === IN (phasenabhängig) ===
  // 28c: S1 Di L7 (1L) + Di L3-4 Praktikum (2L); S2 Mo L3-4 (2L)
  { id: 'c4', col: 4, cls: '28c', typ: 'IN', day: 'Di', from: '13:40', to: '14:25', les: 1, hk: false, semesters: [1] },
  { id: 'c13', col: 13, cls: '28c', typ: 'IN', day: 'Di', from: '10:05', to: '11:45', les: 2, hk: true, semesters: [1], note: 'Praktikum' },
  { id: 'c4s2', col: 4, cls: '28c', typ: 'IN', day: 'Mo', from: '10:05', to: '11:45', les: 2, hk: true, semesters: [2] },
  // 29f: S1 Di L8-9 (2L, Praktikum); S2 Di L7 (1L)
  { id: 'c6', col: 6, cls: '29f', typ: 'IN', day: 'Di', from: '14:35', to: '16:20', les: 2, hk: true, semesters: [1], note: 'Praktikum' },
  { id: 'c6s2', col: 6, cls: '29f', typ: 'IN', day: 'Di', from: '13:40', to: '14:25', les: 1, hk: false, semesters: [2] },
  // 30s: Mi L1-2 (phasenabhängig — nicht in jeder Phase Unterricht)
  { id: 'c24', col: 24, cls: '30s', typ: 'IN', day: 'Mi', from: '08:05', to: '09:45', les: 2, hk: false, semesters: [1, 2], note: 'Phasenunterricht' },

  // === EWR ===
  // 29fs: S1 Di L6 (1L); S2 Do L6 (1L)
  { id: 'c15', col: 15, cls: '29fs', typ: 'EWR', day: 'Di', from: '12:50', to: '13:35', les: 1, hk: false, semesters: [1], note: '+1L Auftrag' },
  { id: 'c15s2', col: 15, cls: '29fs', typ: 'EWR', day: 'Do', from: '12:50', to: '13:35', les: 1, hk: false, semesters: [2] },
];

// Alias for backward compat
export const ALL_COURSES = COURSES;

/**
 * Find all courses with the same class + type (linked courses for multi-day sequences).
 * e.g. for 29c SF: returns c11 (Di) + c31 (Do)
 */
export function getLinkedCourseIds(courseId: string): string[] {
  const course = COURSES.find(c => c.id === courseId);
  if (!course) return [courseId];
  return COURSES
    .filter(c => c.cls === course.cls && c.typ === course.typ)
    .map(c => c.id);
}
