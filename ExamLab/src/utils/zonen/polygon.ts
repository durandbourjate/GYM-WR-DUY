/**
 * Ray-Casting Point-in-Polygon Test.
 * Funktioniert für konvexe und konkave Polygone.
 * Prozent-Koordinaten (0-100), aber unabhängig von der Einheit.
 *
 * Konvention: ein Polygon mit <3 Punkten ist degenerate → immer false.
 * Punkte exakt auf einer Kante/Ecke: Ergebnis nicht definiert
 * (Floating-Point-abhängig). Für Hotspot-Korrektur mit Prozent-Koordinaten
 * in der Praxis irrelevant.
 */
export interface Punkt {
  x: number
  y: number
}

export function istPunktInPolygon(p: Punkt, polygon: readonly Punkt[]): boolean {
  if (polygon.length < 3) return false
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y
    const xj = polygon[j].x, yj = polygon[j].y
    const intersect =
      ((yi > p.y) !== (yj > p.y)) &&
      (p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}
