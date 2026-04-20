import type { PointerEvent as ReactPointerEvent } from 'react'

export interface ZoneMitKontext {
  id: string
  punkte: { x: number; y: number }[]
  label?: string
  /** 'violett' = Editor (default), 'gruen' = korrekt (Korrektur-Ansicht), 'rot' = Distraktor/falsch */
  akzent?: 'violett' | 'gruen' | 'rot'
}

interface Props {
  zonen: ZoneMitKontext[]
  /** Ausgewählte Zone: Handles werden sichtbar, Drag-Callbacks auf Punkte aktiv */
  selectedId?: string | null
  /** Aktiver Polygon-Zeichnen-Modus: unfertige Punkte (werden als Linie + Punkte gerendert) */
  zeichnePunkte?: { x: number; y: number }[]
  /** Aktuelle Maus-Position für die Vorschau-Linie im Zeichnen-Modus */
  mausPosition?: { x: number; y: number } | null
  /** Hover-Radius (%): Cursor näher als r zum ersten Punkt → erster Punkt visuell hervorheben. */
  ersterPunktHitRadius?: number
  onZonePointerDown?: (id: string, e: ReactPointerEvent) => void
  onPunktPointerDown?: (zoneId: string, punktIndex: number, e: ReactPointerEvent) => void
  onPunktDoppelKlick?: (zoneId: string, punktIndex: number) => void
  /** Hover-Plus-Icon zwischen zwei Punkten: Klick fügt Punkt an position (mitte der Kante) ein. */
  onKantenKlick?: (zoneId: string, nachPunktIndex: number) => void
  readOnly?: boolean
}

function fillFuer(akzent: ZoneMitKontext['akzent']): string {
  if (akzent === 'gruen') return 'rgba(34,197,94,0.2)'
  if (akzent === 'rot') return 'rgba(239,68,68,0.2)'
  return 'rgba(139,92,246,0.2)'
}
function strokeFuer(akzent: ZoneMitKontext['akzent']): string {
  if (akzent === 'gruen') return '#22c55e'
  if (akzent === 'rot') return '#ef4444'
  return '#8b5cf6'
}

/**
 * Gemeinsames SVG-Overlay für Zonen-Rendering (Editor + Korrektur-Ansicht).
 * viewBox 0 0 100 100 (Prozent-Koordinaten).
 * Strokes via `vectorEffect="non-scaling-stroke"` damit Linienbreite skalierungs-unabhängig ist.
 */
export default function ZonenOverlay({
  zonen,
  selectedId,
  zeichnePunkte,
  mausPosition,
  ersterPunktHitRadius = 2,
  onZonePointerDown,
  onPunktPointerDown,
  onPunktDoppelKlick,
  onKantenKlick,
  readOnly,
}: Props) {
  const ersterNah = Boolean(
    zeichnePunkte && zeichnePunkte.length >= 3 && mausPosition &&
    Math.hypot(mausPosition.x - zeichnePunkte[0].x, mausPosition.y - zeichnePunkte[0].y) < ersterPunktHitRadius
  )

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {zonen.map(z => {
        const isSelected = z.id === selectedId
        const fill = fillFuer(z.akzent)
        const stroke = strokeFuer(z.akzent)
        return (
          <g key={z.id}>
            <polygon
              points={z.punkte.map(p => `${p.x},${p.y}`).join(' ')}
              fill={fill}
              stroke={stroke}
              strokeWidth={isSelected ? '0.6' : '0.4'}
              vectorEffect="non-scaling-stroke"
              style={{ pointerEvents: readOnly ? 'none' : 'auto', cursor: readOnly ? 'default' : 'move' }}
              onPointerDown={readOnly ? undefined : (e) => onZonePointerDown?.(z.id, e)}
            />

            {/* Kanten-Plus (für "Punkt einfügen"): nur bei selected + genügend Punkte */}
            {!readOnly && isSelected && onKantenKlick && z.punkte.length >= 3 && z.punkte.map((p, i) => {
              const next = z.punkte[(i + 1) % z.punkte.length]
              const mx = (p.x + next.x) / 2, my = (p.y + next.y) / 2
              return (
                <g key={`kante-${i}`} style={{ cursor: 'copy' }}>
                  {/* Transparente Hit-Zone für den Klick */}
                  <circle
                    cx={mx} cy={my} r="1.5"
                    fill="transparent"
                    stroke="#8b5cf6"
                    strokeWidth="0.3"
                    strokeDasharray="0.4,0.3"
                    vectorEffect="non-scaling-stroke"
                    onPointerDown={(e) => { e.stopPropagation(); onKantenKlick?.(z.id, i) }}
                  />
                </g>
              )
            })}

            {/* Punkt-Handles nur bei selected */}
            {!readOnly && isSelected && z.punkte.map((p, i) => (
              <circle
                key={i}
                cx={p.x} cy={p.y} r="1.2"
                fill="#8b5cf6"
                stroke="white"
                strokeWidth="0.3"
                vectorEffect="non-scaling-stroke"
                style={{ cursor: 'grab' }}
                onPointerDown={(e) => { e.stopPropagation(); onPunktPointerDown?.(z.id, i, e) }}
                onDoubleClick={(e) => { e.stopPropagation(); onPunktDoppelKlick?.(z.id, i) }}
              />
            ))}
          </g>
        )
      })}

      {/* Aktiver Polygon-Zeichnen-Modus */}
      {zeichnePunkte && zeichnePunkte.length > 0 && (
        <g>
          {/* Vorschau-Linie: vorhandene Punkte + aktuelle Maus */}
          <polyline
            points={
              zeichnePunkte.map(p => `${p.x},${p.y}`).join(' ') +
              (mausPosition ? ` ${mausPosition.x},${mausPosition.y}` : '')
            }
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="0.4"
            strokeDasharray="1,0.8"
            vectorEffect="non-scaling-stroke"
          />
          {/* Punkte — erster grösser wenn Cursor nah dran (visuelle Affordance) */}
          {zeichnePunkte.map((p, i) => (
            <circle
              key={i}
              cx={p.x} cy={p.y}
              r={i === 0 && ersterNah ? 2 : 1}
              fill="#8b5cf6"
              stroke="white"
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      )}
    </svg>
  )
}
