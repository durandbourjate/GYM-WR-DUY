import type { HotspotBereich, DragDropBildZielzone } from '../../types/fragen-storage'
import type { Punkt } from './polygon'

const KREIS_POLYGON_PUNKTE = 12

/**
 * Konvertiert eine Alt-Format-Hotspot-Zone ins neue Polygon-Format.
 * Idempotent: wenn bereits `punkte[]` vorhanden, wird unverändert zurückgegeben.
 *
 * Alt-Format:
 *  - Rechteck: { form: 'rechteck', koordinaten: { x, y, breite, hoehe }, ... }
 *  - Kreis:    { form: 'kreis',    koordinaten: { x, y, radius },        ... }
 * Feld `punkte` (number) wird zu `punktzahl` umbenannt.
 */
export function migriereHotspotBereichAlt(alt: unknown): HotspotBereich {
  const obj = (alt && typeof alt === 'object' ? alt : {}) as Record<string, unknown>
  if (Array.isArray(obj.punkte) && obj.punkte.length >= 3) {
    return obj as unknown as HotspotBereich
  }

  const k = (obj.koordinaten && typeof obj.koordinaten === 'object'
    ? obj.koordinaten
    : {}) as Record<string, unknown>
  let form: 'rechteck' | 'polygon'
  let punkte: Punkt[]

  const numOr = (v: unknown, d: number): number => (typeof v === 'number' ? v : d)

  if (obj.form === 'kreis') {
    form = 'polygon'
    punkte = kreisZuPolygon(numOr(k.x, 50), numOr(k.y, 50), numOr(k.radius, 5), KREIS_POLYGON_PUNKTE)
  } else {
    form = 'rechteck'
    punkte = rechteckZuPolygon(numOr(k.x, 0), numOr(k.y, 0), numOr(k.breite, 0), numOr(k.hoehe, 0))
  }

  return {
    id: typeof obj.id === 'string' ? obj.id : '',
    form,
    punkte,
    label: typeof obj.label === 'string' ? obj.label : '',
    punktzahl:
      typeof obj.punktzahl === 'number' ? obj.punktzahl
      : typeof obj.punkte === 'number' ? obj.punkte
      : 1,
  } as HotspotBereich
}

/**
 * Konvertiert eine Alt-Format-DragDrop-Zielzone ins neue Polygon-Format.
 * Idempotent. Hebt Pre-Bundle-J-`korrektesLabel` auf das neue
 * `korrekteLabels: string[]` Format.
 * Alt-Format: { position: { x, y, breite, hoehe }, korrektesLabel?, id }
 */
export function migriereDragDropZielzoneAlt(alt: unknown): DragDropBildZielzone {
  const obj = (alt && typeof alt === 'object' ? alt : {}) as Record<string, unknown>
  if (Array.isArray(obj.punkte) && obj.punkte.length >= 3 && Array.isArray(obj.korrekteLabels)) {
    return obj as unknown as DragDropBildZielzone
  }

  const p = (obj.position && typeof obj.position === 'object'
    ? obj.position
    : {}) as Record<string, unknown>
  const korrekteLabels: string[] = Array.isArray(obj.korrekteLabels)
    ? obj.korrekteLabels.map((s: unknown) => String(s ?? ''))
    : obj.korrektesLabel
      ? [String(obj.korrektesLabel)]
      : []
  const numOr = (v: unknown, d: number): number => (typeof v === 'number' ? v : d)
  return {
    id: typeof obj.id === 'string' ? obj.id : '',
    form: 'rechteck',
    punkte: Array.isArray(obj.punkte) && obj.punkte.length >= 3
      ? (obj.punkte as Punkt[])
      : rechteckZuPolygon(numOr(p.x, 0), numOr(p.y, 0), numOr(p.breite, 0), numOr(p.hoehe, 0)),
    korrekteLabels,
  }
}

/**
 * True wenn die Zone das neue Format hat (punkte[] mit ≥3 Punkten).
 * Genutzt im Frontend-Error-Boundary für die Migrations-Fenster-Übergangs-Phase.
 */
export function istZoneWohlgeformt(zone: unknown): boolean {
  if (!zone || typeof zone !== 'object') return false
  const punkte = (zone as { punkte?: unknown }).punkte
  return Array.isArray(punkte) && punkte.length >= 3
}

// --- interne Helfer ---

function rechteckZuPolygon(x: number, y: number, b: number, h: number): Punkt[] {
  return [
    { x, y },
    { x: x + b, y },
    { x: x + b, y: y + h },
    { x, y: y + h },
  ]
}

function kreisZuPolygon(cx: number, cy: number, r: number, n: number): Punkt[] {
  const punkte: Punkt[] = []
  for (let i = 0; i < n; i++) {
    const theta = (2 * Math.PI * i) / n
    punkte.push({
      x: cx + r * Math.cos(theta),
      y: cy + r * Math.sin(theta),
    })
  }
  return punkte
}
