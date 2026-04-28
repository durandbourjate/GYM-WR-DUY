/**
 * Kanonisches Speicherformat für DragDrop-Bild-Antworten:
 *   zuordnungen: { [labelText]: zoneId }
 *
 * Ein Label kann in maximal einer Zone liegen; eine Zone kann beliebig viele Labels halten.
 * Dieses Format unterstützt Mehrfach-Labels pro Zone (S118-Refactor) und ist konsistent mit
 * DragDropBildFrage.tsx (SuS-Store) und utils/ueben/korrektur.ts (Übungs-Korrektur).
 */

/** Alle Labels, die in der gegebenen Zone platziert wurden. */
export function labelsInZone(zuordnungen: Record<string, string> | undefined, zoneId: string): string[] {
  if (!zuordnungen) return []
  return Object.entries(zuordnungen)
    .filter(([, zId]) => zId === zoneId)
    .map(([label]) => label)
}

/** Prüft, ob in der Zone mindestens ein Label mit dem korrekten Text liegt (case-insensitive). */
export function zoneKorrektBelegt(
  zuordnungen: Record<string, string> | undefined,
  zoneId: string,
  korrektesLabel: string,
): boolean {
  const soll = korrektesLabel.trim().toLowerCase()
  return labelsInZone(zuordnungen, zoneId).some(l => l.trim().toLowerCase() === soll)
}

import type { DragDropBildLabel } from '../types/ueben/fragen'

export interface DragDropBildStack {
  text: string
  anzahl: number
  freieIds: string[]
}

/**
 * Gruppiert Pool-Tokens nach Text und filtert platzierte heraus.
 * Output ist die SuS-Pool-Anzeige (Stack mit Counter).
 */
export function gruppiereStacks(
  labels: DragDropBildLabel[],
  zuordnungen: Record<string, string>,
): DragDropBildStack[] {
  const map = new Map<string, string[]>()
  for (const l of labels) {
    if (zuordnungen[l.id]) continue
    if (!map.has(l.text)) map.set(l.text, [])
    map.get(l.text)!.push(l.id)
  }
  return [...map.entries()]
    .map(([text, freieIds]) => ({ text, anzahl: freieIds.length, freieIds }))
    .filter(s => s.anzahl > 0)
}

/**
 * Deterministische ID-Auswahl: kleinster Index in `labels` mit gegebenem Text,
 * dessen ID nicht in `zuordnungen` vorkommt.
 */
export function naechsteFreieLabelId(
  labels: DragDropBildLabel[],
  text: string,
  zuordnungen: Record<string, string>,
): string | null {
  for (const l of labels) {
    if (l.text === text && !zuordnungen[l.id]) return l.id
  }
  return null
}
