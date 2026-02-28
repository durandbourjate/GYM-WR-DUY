import type { Course } from '../types';

export const COURSES: Course[] = [
  { id: 'c2', col: 2, cls: '27a', typ: 'KS', day: 'Mo', from: '10:05', to: '10:50', les: 1, hk: false, semesters: [1, 2] },
  { id: 'c4', col: 4, cls: '28c', typ: 'IN', day: 'Mo', from: '13:40', to: '14:25', les: 1, hk: false, semesters: [1, 2] },
  { id: 'c6', col: 6, cls: '29f', typ: 'IN', day: 'Mo', from: '14:35', to: '16:20', les: 2, hk: true, semesters: [1, 2] },
  { id: 'c11', col: 11, cls: '29c', typ: 'SF', day: 'Di', from: '09:00', to: '09:45', les: 1, hk: false, semesters: [1, 2] },
  { id: 'c13', col: 13, cls: '28c', typ: 'IN', day: 'Di', from: '10:05', to: '11:45', les: 2, hk: true, semesters: [1] },
  { id: 'c15', col: 15, cls: '29fs', typ: 'EWR', day: 'Di', from: '12:50', to: '13:35', les: 1, hk: false, semesters: [1], note: '+1L Auftrag' },
  { id: 'c17', col: 17, cls: '27a28f', typ: 'SF', day: 'Mi', from: '13:40', to: '15:20', les: 2, hk: false, semesters: [1, 2] },
  { id: 'c19', col: 19, cls: '28bc29fs', typ: 'SF', day: 'Mi', from: '15:35', to: '17:10', les: 2, hk: false, semesters: [1, 2] },
  { id: 'c24', col: 24, cls: '30s', typ: 'IN', day: 'Do', from: '08:05', to: '09:45', les: 2, hk: false, semesters: [1, 2] },
  { id: 'c29', col: 29, cls: '28bc29fs', typ: 'SF', day: 'Fr', from: '09:00', to: '09:45', les: 1, hk: false, semesters: [1, 2] },
  { id: 'c31', col: 31, cls: '29c', typ: 'SF', day: 'Fr', from: '10:05', to: '11:45', les: 2, hk: false, semesters: [1, 2] },
  { id: 'c35', col: 35, cls: '27a28f', typ: 'SF', day: 'Fr', from: '13:40', to: '15:20', les: 2, hk: false, semesters: [1, 2] },
  { id: 'c37', col: 37, cls: '30s', typ: 'IN', day: 'Fr', from: '15:35', to: '16:20', les: 1, hk: false, semesters: [1, 2] },
];

// Alias for backward compat
export const ALL_COURSES = COURSES;
