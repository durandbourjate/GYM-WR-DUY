import { useState, useCallback, useRef, useEffect } from 'react'
import type { DragDropBildZielzone } from '../../types/fragen'
import BildMitGenerator from '../components/BildMitGenerator'
import { resolvePoolBildUrl } from '../utils/poolBildUrl'

interface Props {
  bildUrl: string
  setBildUrl: (v: string) => void
  zielzonen: DragDropBildZielzone[]
  setZielzonen: React.Dispatch<React.SetStateAction<DragDropBildZielzone[]>>
  labels: string[]
  setLabels: React.Dispatch<React.SetStateAction<string[]>>
}

type DragState = { zoneId: string; offsetX: number; offsetY: number } | null

export default function DragDropBildEditor({ bildUrl, setBildUrl, zielzonen, setZielzonen, labels, setLabels }: Props) {
  const [ersteEcke, setErsteEcke] = useState<{ x: number; y: number } | null>(null)
  const [editZone, setEditZone] = useState<string | null>(null)
  const [labelsText, setLabelsText] = useState((labels ?? []).join(', '))
  const [drag, setDrag] = useState<DragState>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  function bildKoordinaten(e: { clientX: number; clientY: number }): { x: number; y: number } | null {
    const container = containerRef.current
    if (!container) return null
    const rect = container.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    }
  }

  const handleBildKlick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (drag) return
    const target = e.target as HTMLElement
    if (target.closest('[data-zone]')) return
    const p = bildKoordinaten(e)
    if (!p) return

    if (!ersteEcke) {
      setErsteEcke(p)
    } else {
      const minX = Math.min(ersteEcke.x, p.x)
      const minY = Math.min(ersteEcke.y, p.y)
      const breite = Math.abs(p.x - ersteEcke.x)
      const hoehe = Math.abs(p.y - ersteEcke.y)
      const neueZone: DragDropBildZielzone = {
        id: `z${Date.now()}`,
        position: { x: minX, y: minY, breite, hoehe },
        korrektesLabel: `Label ${zielzonen.length + 1}`,
      }
      setZielzonen(prev => [...prev, neueZone])
      setErsteEcke(null)
      setEditZone(neueZone.id)
    }
  }, [ersteEcke, zielzonen.length, setZielzonen, drag])

  const handleLabelAendern = useCallback((id: string, label: string) => {
    setZielzonen(prev => prev.map(z => z.id === id ? { ...z, korrektesLabel: label } : z))
  }, [setZielzonen])

  const handleZoneLoeschen = useCallback((id: string) => {
    setZielzonen(prev => prev.filter(z => z.id !== id))
    if (editZone === id) setEditZone(null)
  }, [setZielzonen, editZone])

  const handleLabelsAktualisieren = useCallback((text: string) => {
    setLabelsText(text)
    setLabels(text.split(',').map(l => l.trim()).filter(Boolean))
  }, [setLabels])

  function handlePositionAendern(id: string, feld: 'x' | 'y' | 'breite' | 'hoehe', wert: number) {
    setZielzonen(prev => prev.map(z => (z.id === id ? { ...z, position: { ...z.position, [feld]: wert } } : z)))
  }

  function handleZonePointerDown(zone: DragDropBildZielzone, e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    const p = bildKoordinaten(e)
    if (!p) return
    setDrag({ zoneId: zone.id, offsetX: p.x - zone.position.x, offsetY: p.y - zone.position.y })
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setEditZone(zone.id)
  }

  useEffect(() => {
    if (!drag) return
    function onMove(e: PointerEvent) {
      const p = bildKoordinaten(e)
      if (!p) return
      setZielzonen(prev => prev.map(z => {
        if (z.id !== drag!.zoneId) return z
        const newX = Math.max(0, Math.min(100 - z.position.breite, p.x - drag!.offsetX))
        const newY = Math.max(0, Math.min(100 - z.position.hoehe, p.y - drag!.offsetY))
        return { ...z, position: { ...z.position, x: newX, y: newY } }
      }))
    }
    function onUp() { setDrag(null) }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [drag, setZielzonen])

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Drag & Drop auf Bild
      </h4>

      <BildMitGenerator bildUrl={bildUrl} setBildUrl={setBildUrl} fragetyp="dragdrop_bild" />

      {bildUrl && (
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            {ersteEcke
              ? 'Klicke fuer die zweite Ecke des Rechtecks.'
              : 'Klicke auf zwei Ecken im Bild fuer neue Zone, Zone ziehen zum Verschieben.'}
          </p>
          <div
            ref={containerRef}
            className="relative block w-full max-w-2xl cursor-crosshair border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden"
            onClick={handleBildKlick}
          >
            <img
              src={resolvePoolBildUrl(bildUrl)}
              alt="Drag & Drop Bild"
              className="block w-full h-auto"
              draggable={false}
            />

            {ersteEcke && (
              <div
                className="absolute w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                style={{ left: `${ersteEcke.x}%`, top: `${ersteEcke.y}%` }}
              />
            )}

            {zielzonen.map((zone, i) => (
              <div
                key={zone.id}
                data-zone={zone.id}
                onPointerDown={(e) => handleZonePointerDown(zone, e)}
                className={`absolute bg-violet-500/20 border-2 flex items-center justify-center cursor-move ${
                  editZone === zone.id ? 'border-violet-600 dark:border-violet-300' : 'border-violet-500 dark:border-violet-400'
                }`}
                style={{
                  left: `${zone.position.x}%`,
                  top: `${zone.position.y}%`,
                  width: `${zone.position.breite}%`,
                  height: `${zone.position.hoehe}%`,
                  touchAction: 'none',
                }}
              >
                <span className="text-xs font-bold text-violet-800 dark:text-violet-200 bg-white/80 dark:bg-slate-800/80 px-1 rounded pointer-events-none">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {zielzonen.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Zielzonen ({zielzonen.length})
          </h5>
          {zielzonen.map((zone, i) => (
            <div
              key={zone.id}
              className={`p-2 rounded-lg border space-y-2 ${
                editZone === zone.id
                  ? 'border-slate-400 dark:border-slate-500 bg-slate-100 dark:bg-slate-800'
                  : 'border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full shrink-0">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={zone.korrektesLabel}
                  onChange={(e) => handleLabelAendern(zone.id, e.target.value)}
                  placeholder="Korrektes Label"
                  className="flex-1 px-2 py-1 text-sm border rounded bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => handleZoneLoeschen(zone.id)}
                  className="w-7 h-7 text-red-400 hover:text-red-600 dark:hover:text-red-300 cursor-pointer text-sm shrink-0"
                  title="Zone loeschen"
                >
                  x
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>x:</span>
                <input type="number" value={Math.round(zone.position.x)} onChange={(e) => handlePositionAendern(zone.id, 'x', Number(e.target.value))} min={0} max={100} className="w-14 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center" />
                <span>y:</span>
                <input type="number" value={Math.round(zone.position.y)} onChange={(e) => handlePositionAendern(zone.id, 'y', Number(e.target.value))} min={0} max={100} className="w-14 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center" />
                <span>b:</span>
                <input type="number" value={Math.round(zone.position.breite)} onChange={(e) => handlePositionAendern(zone.id, 'breite', Number(e.target.value))} min={1} max={100} className="w-14 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center" />
                <span>h:</span>
                <input type="number" value={Math.round(zone.position.hoehe)} onChange={(e) => handlePositionAendern(zone.id, 'hoehe', Number(e.target.value))} min={1} max={100} className="w-14 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center" />
                <span className="ml-1 italic">%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="text-xs text-slate-500 dark:text-slate-400">
          Label-Pool (kommasepariert, inkl. Distraktoren)
        </label>
        <input
          type="text"
          value={labelsText}
          onChange={(e) => handleLabelsAktualisieren(e.target.value)}
          placeholder="Label 1, Label 2, Distraktor 1, ..."
          className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-white"
        />
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Muss alle korrekten Labels der Zielzonen enthalten. Zusaetzliche Labels dienen als Distraktoren.
        </p>
      </div>

      {zielzonen.length > 0 && (labels ?? []).length > 0 && (
        (() => {
          const fehlend = zielzonen.filter(z => !(labels ?? []).includes(z.korrektesLabel))
          if (fehlend.length === 0) return null
          return (
            <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
              Warnung: Folgende korrekte Labels fehlen im Pool: {fehlend.map(z => z.korrektesLabel).join(', ')}
            </div>
          )
        })()
      )}
    </div>
  )
}
