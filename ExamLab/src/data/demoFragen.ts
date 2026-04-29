/**
 * Demo-Fragen = Einführungsprüfung
 * Keine separate Datenpflege — Re-Export der Einrichtungsfragen.
 */
import type { Frage } from '../types/fragen-storage'
import { einrichtungsFragen } from './einrichtungsFragen.ts'

export const demoFragen: Frage[] = einrichtungsFragen
