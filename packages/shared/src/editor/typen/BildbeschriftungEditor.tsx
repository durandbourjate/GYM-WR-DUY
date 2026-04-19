import { useState, useCallback, useRef, useEffect } from 'react'
import type { BildbeschriftungLabel } from '../../types/fragen'
import BildMitGenerator from '../components/BildMitGenerator'
import { resolvePoolBildUrl } from '../utils/poolBildUrl'

interface Props {
  bildUrl: string
  setBildUrl: (v: string) => void
  beschriftungen: BildbeschriftungLabel[]
  setBeschriftungen: React.Dispatch<React.SetStateAction<BildbeschriftungLabel[]>>
}

type DragState = { labelId: string; offsetX: number; offsetY: number } | null

export default function BildbeschriftungEditor({ bildUrl, setBildUrl, beschriftungen, setBeschriftungen }: Props) {
  const [editId, setEditId] = useState<string | null>(null)
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
    if (target.closest('[data-label]')) return
    const p = bildKoordinaten(e)
    if (!p) return
    const neuesBeschriftung: BildbeschriftungLabel = {
      id: `l${Date.now()}`,
      position: p,
      korrekt: [''],
    }
    setBeschriftungen(prev => [...prev, neuesBeschriftung])
    setEditId(neuesBeschriftung.id)
  }, [setBeschriftungen, drag])

  function handleEntfernen(id: string) {
    setBeschriftungen(prev => prev.filter(b => b.id !== id))
  }

  function handleKorrektAendern(id: string, text: string) {
    setBeschriftungen(prev => prev.map(b =>
      b.id === id ? { ...b, korrekt: text.split(',').map(t => t.trim()).filter(Boolean) } : b
    ))
  }

  function handlePositionAendern(id: string, feld: 'x' | 'y', wert: number) {
    setBeschriftungen(prev => prev.map(b => (b.id === id ? { ...b, position: { ...b.position, [feld]: wert } } : b)))
  }

  function handleLabelPointerDown(label: BildbeschriftungLabel, e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    const p = bildKoordinaten(e)
    if (!p) return
    setDrag({ labelId: label.id, offsetX: p.x - label.position.x, offsetY: p.y - label.position.y })
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  useEffect(() => {
    if (!drag) return
    function onMove(e: PointerEvent) {
      const p = bildKoordinaten(e)
      if (!p) return
      setBeschriftungen(prev => prev.map(b => {
        if (b.id !== drag!.labelId) return b
        const newX = Math.max(0, Math.min(100, p.x - drag!.offsetX))
        const newY = Math.max(0, Math.min(100, p.y - drag!.offsetY))
        return { ...b, position: { x: newX, y: newY } }
      }))
    }
    function onUp() { setDrag(null) }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [drag, setBeschriftungen])

  return (
    <div className="space-y-4">
      <BildMitGenerator bildUrl={bildUrl} setBildUrl={setBildUrl} fragetyp="bildbeschriftung" />

      {bildUrl && (
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            Klicke aufs Bild fürs neues Label, Label ziehen zum Verschieben
          </p>
          <div ref={containerRef} className="relative block w-full max-w-2xl cursor-crosshair" onClick={handleBildKlick}>
            <img
              src={resolvePoolBildUrl(bildUrl)}
              alt="Bildbeschriftung-Vorschau"
              className="block w-full h-auto rounded-lg select-none"
              style={{ objectFit: 'contain', maxHeight: '400px' }}
              draggable={false}
            />

            {beschriftungen.map((b, i) => (
              <div
                key={b.id}
                data-label={b.id}
                onPointerDown={(e) => handleLabelPointerDown(b, e)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-move"
                style={{ left: `${b.position.x}%`, top: `${b.position.y}%`, touchAction: 'none' }}
              >
                <div className="w-7 h-7 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-slate-800">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {beschriftungen.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
            Label-Punkte ({beschriftungen.length})
          </p>
          <div className="space-y-2">
            {beschriftungen.map((b, i) => (
              <div key={b.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
                      Akzeptierte Antworten (kommagetrennt)
                    </label>
                    <input
                      type="text"
                      value={b.korrekt.join(', ')}
                      onChange={(e) => handleKorrektAendern(b.id, e.target.value)}
                      autoFocus={editId === b.id}
                      onFocus={() => setEditId(null)}
                      className="w-full px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:border-violet-500 focus:outline-none"
                      placeholder="Antwort 1, Antwort 2, ..."
                    />
                  </div>
                  <button
                    onClick={() => handleEntfernen(b.id)}
                    className="px-2 py-1 text-xs rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 cursor-pointer"
                    title="Label entfernen"
                  >
                    {'\u2715'}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>x:</span>
                  <input type="number" value={Math.round(b.position.x)} onChange={(e) => handlePositionAendern(b.id, 'x', Number(e.target.value))} min={0} max={100} className="w-14 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center" />
                  <span>y:</span>
                  <input type="number" value={Math.round(b.position.y)} onChange={(e) => handlePositionAendern(b.id, 'y', Number(e.target.value))} min={0} max={100} className="w-14 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center" />
                  <span className="ml-1 italic">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
