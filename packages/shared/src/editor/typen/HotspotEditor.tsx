import { useState, useCallback, useRef, useEffect } from 'react'
import type { HotspotBereich } from '../../types/fragen'
import BildMitGenerator from '../components/BildMitGenerator'
import { resolvePoolBildUrl } from '../utils/poolBildUrl'

interface Props {
  bildUrl: string
  setBildUrl: (v: string) => void
  bereiche: HotspotBereich[]
  setBereiche: React.Dispatch<React.SetStateAction<HotspotBereich[]>>
  mehrfachauswahl: boolean
  setMehrfachauswahl: (v: boolean) => void
}

type DragState = { bereichId: string; offsetX: number; offsetY: number } | null

export default function HotspotEditor({ bildUrl, setBildUrl, bereiche, setBereiche, mehrfachauswahl, setMehrfachauswahl }: Props) {
  const [ersteEcke, setErsteEcke] = useState<{ x: number; y: number } | null>(null)
  const [editLabel, setEditLabel] = useState<string | null>(null)
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
    // Nur auf Container-Hintergrund reagieren, nicht auf Bereiche
    const target = e.target as HTMLElement
    if (target.closest('[data-bereich]')) return

    const p = bildKoordinaten(e)
    if (!p) return

    if (!ersteEcke) {
      setErsteEcke(p)
    } else {
      const minX = Math.min(ersteEcke.x, p.x)
      const minY = Math.min(ersteEcke.y, p.y)
      const breite = Math.abs(p.x - ersteEcke.x)
      const hoehe = Math.abs(p.y - ersteEcke.y)
      const neuerBereich: HotspotBereich = {
        id: `b${Date.now()}`,
        form: 'rechteck',
        koordinaten: { x: minX, y: minY, breite, hoehe },
        label: `Bereich ${bereiche.length + 1}`,
        punkte: 1,
      }
      setBereiche(prev => [...prev, neuerBereich])
      setErsteEcke(null)
      setEditLabel(neuerBereich.id)
    }
  }, [ersteEcke, bereiche.length, setBereiche, drag])

  function handleBereichEntfernen(id: string) {
    setBereiche(prev => prev.filter(b => b.id !== id))
  }

  function handleBereichAendern<K extends keyof HotspotBereich>(id: string, feld: K, wert: HotspotBereich[K]) {
    setBereiche(prev => prev.map(b => (b.id === id ? { ...b, [feld]: wert } : b)))
  }

  function handleKoordAendern(id: string, feld: 'x' | 'y' | 'breite' | 'hoehe' | 'radius', wert: number) {
    setBereiche(prev => prev.map(b => (b.id === id ? { ...b, koordinaten: { ...b.koordinaten, [feld]: wert } } : b)))
  }

  function handleFormAendern(id: string, form: 'rechteck' | 'kreis') {
    setBereiche(prev => prev.map(b => {
      if (b.id !== id) return b
      if (form === 'kreis') {
        const r = b.koordinaten.radius ?? Math.min(b.koordinaten.breite ?? 10, b.koordinaten.hoehe ?? 10) / 2
        return { ...b, form, koordinaten: { x: b.koordinaten.x, y: b.koordinaten.y, radius: r } }
      }
      const br = b.koordinaten.breite ?? (b.koordinaten.radius ?? 5) * 2
      const hh = b.koordinaten.hoehe ?? (b.koordinaten.radius ?? 5) * 2
      return { ...b, form, koordinaten: { x: b.koordinaten.x, y: b.koordinaten.y, breite: br, hoehe: hh } }
    }))
  }

  function handleBereichPointerDown(bereich: HotspotBereich, e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    const p = bildKoordinaten(e)
    if (!p) return
    const refX = bereich.form === 'kreis' ? bereich.koordinaten.x : bereich.koordinaten.x
    const refY = bereich.form === 'kreis' ? bereich.koordinaten.y : bereich.koordinaten.y
    setDrag({ bereichId: bereich.id, offsetX: p.x - refX, offsetY: p.y - refY })
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  useEffect(() => {
    if (!drag) return
    function onMove(e: PointerEvent) {
      const p = bildKoordinaten(e)
      if (!p) return
      setBereiche(prev => prev.map(b => {
        if (b.id !== drag!.bereichId) return b
        const newX = Math.max(0, Math.min(100, p.x - drag!.offsetX))
        const newY = Math.max(0, Math.min(100, p.y - drag!.offsetY))
        return { ...b, koordinaten: { ...b.koordinaten, x: newX, y: newY } }
      }))
    }
    function onUp() { setDrag(null) }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [drag, setBereiche])

  return (
    <div className="space-y-4">
      <BildMitGenerator bildUrl={bildUrl} setBildUrl={setBildUrl} fragetyp="hotspot" />

      {bildUrl && (
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            {ersteEcke
              ? 'Klicke auf die zweite Ecke des Rechtecks'
              : 'Klicke aufs Bild für neuen Bereich, Bereich ziehen zum Verschieben'}
          </p>
          <div ref={containerRef} className="relative block w-full max-w-2xl cursor-crosshair" onClick={handleBildKlick}>
            <img
              src={resolvePoolBildUrl(bildUrl)}
              alt="Hotspot-Vorschau"
              className="block w-full h-auto rounded-lg select-none"
              style={{ objectFit: 'contain', maxHeight: '400px' }}
              draggable={false}
            />

            {ersteEcke && (
              <div
                className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-violet-500 border-2 border-white shadow-md pointer-events-none"
                style={{ left: `${ersteEcke.x}%`, top: `${ersteEcke.y}%` }}
              />
            )}

            {bereiche.map((bereich, i) => {
              const k = bereich.koordinaten
              if (bereich.form === 'kreis') {
                const r = k.radius ?? 5
                return (
                  <div
                    key={bereich.id}
                    data-bereich={bereich.id}
                    onPointerDown={(e) => handleBereichPointerDown(bereich, e)}
                    className="absolute border-2 border-violet-500 bg-violet-500/20 rounded-full cursor-move"
                    style={{
                      left: `${k.x - r}%`,
                      top: `${k.y - r}%`,
                      width: `${r * 2}%`,
                      height: `${r * 2}%`,
                      touchAction: 'none',
                    }}
                  >
                    <span className="absolute -top-5 left-0 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-1 rounded shadow pointer-events-none">
                      {i + 1}
                    </span>
                  </div>
                )
              }
              return (
                <div
                  key={bereich.id}
                  data-bereich={bereich.id}
                  onPointerDown={(e) => handleBereichPointerDown(bereich, e)}
                  className="absolute border-2 border-violet-500 bg-violet-500/20 rounded cursor-move"
                  style={{
                    left: `${k.x}%`,
                    top: `${k.y}%`,
                    width: `${k.breite ?? 0}%`,
                    height: `${k.hoehe ?? 0}%`,
                    touchAction: 'none',
                  }}
                >
                  <span className="absolute -top-5 left-0 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-1 rounded shadow pointer-events-none">
                    {i + 1}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {bereiche.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
            Definierte Bereiche ({bereiche.length})
          </p>
          <div className="space-y-2">
            {bereiche.map((bereich, i) => {
              const k = bereich.koordinaten
              return (
                <div key={bereich.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      value={bereich.label}
                      onChange={(e) => handleBereichAendern(bereich.id, 'label', e.target.value)}
                      autoFocus={editLabel === bereich.id}
                      onFocus={() => setEditLabel(null)}
                      className="flex-1 px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:border-slate-500 focus:outline-none"
                      placeholder="Label"
                    />
                    <select
                      value={bereich.form}
                      onChange={(e) => handleFormAendern(bereich.id, e.target.value as 'rechteck' | 'kreis')}
                      className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                      title="Form"
                    >
                      <option value="rechteck">Rechteck</option>
                      <option value="kreis">Kreis</option>
                    </select>
                    <input
                      type="number"
                      value={bereich.punkte}
                      onChange={(e) => handleBereichAendern(bereich.id, 'punkte', Number(e.target.value))}
                      min={0}
                      step={0.5}
                      className="w-16 px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:border-slate-500 focus:outline-none text-center"
                      title="Punkte"
                    />
                    <span className="text-xs text-slate-400">Pkt</span>
                    <button
                      onClick={() => handleBereichEntfernen(bereich.id)}
                      className="px-2 py-1 text-xs rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 cursor-pointer"
                      title="Bereich entfernen"
                    >
                      {'\u2715'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>x:</span>
                    <input type="number" value={Math.round(k.x)} onChange={(e) => handleKoordAendern(bereich.id, 'x', Number(e.target.value))} min={0} max={100} className="w-14 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center" />
                    <span>y:</span>
                    <input type="number" value={Math.round(k.y)} onChange={(e) => handleKoordAendern(bereich.id, 'y', Number(e.target.value))} min={0} max={100} className="w-14 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center" />
                    {bereich.form === 'rechteck' ? (
                      <>
                        <span>b:</span>
                        <input type="number" value={Math.round(k.breite ?? 0)} onChange={(e) => handleKoordAendern(bereich.id, 'breite', Number(e.target.value))} min={0} max={100} className="w-14 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center" />
                        <span>h:</span>
                        <input type="number" value={Math.round(k.hoehe ?? 0)} onChange={(e) => handleKoordAendern(bereich.id, 'hoehe', Number(e.target.value))} min={0} max={100} className="w-14 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center" />
                      </>
                    ) : (
                      <>
                        <span>r:</span>
                        <input type="number" value={Math.round(k.radius ?? 0)} onChange={(e) => handleKoordAendern(bereich.id, 'radius', Number(e.target.value))} min={1} max={50} className="w-14 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center" />
                      </>
                    )}
                    <span className="ml-1 italic">%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={mehrfachauswahl}
          onChange={(e) => setMehrfachauswahl(e.target.checked)}
          className="rounded border-slate-300 dark:border-slate-600"
        />
        <span className="text-sm text-slate-700 dark:text-slate-200">
          Mehrfachauswahl (SuS kann mehrere Bereiche anklicken)
        </span>
      </label>
    </div>
  )
}
