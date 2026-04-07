import { useMemo, useRef, useState, useCallback } from 'react'
import { usePruefungStore } from '../../store/pruefungStore.ts'
import type { SortierungFrage as SortierungFrageType } from '../../types/fragen.ts'
import { renderMarkdown } from '../../utils/markdown.ts'
import { fachbereichFarbe } from '../../utils/fachUtils.ts'

interface Props {
  frage: SortierungFrageType
}

/** Mische ein Array deterministisch (Fisher-Yates mit seed aus frage.id) */
function mischen(arr: string[], seed: string): string[] {
  const result = [...arr]
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0
  }
  for (let i = result.length - 1; i > 0; i--) {
    h = ((h << 5) - h + i) | 0
    const j = Math.abs(h) % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function SortierungFrage({ frage }: Props) {
  const antworten = usePruefungStore((s) => s.antworten)
  const setAntwort = usePruefungStore((s) => s.setAntwort)
  const abgegeben = usePruefungStore((s) => s.abgegeben)

  // Gemischte Anfangsreihenfolge (einmalig berechnet)
  const gemischt = useRef<string[]>(mischen((frage.elemente ?? []), frage.id))

  const aktuelleAntwort = antworten[frage.id]
  const reihenfolge: string[] = useMemo(() => {
    if (aktuelleAntwort?.typ === 'sortierung' && aktuelleAntwort.reihenfolge.length > 0) {
      return aktuelleAntwort.reihenfolge
    }
    return gemischt.current
  }, [aktuelleAntwort])

  function verschieben(index: number, richtung: 'hoch' | 'runter') {
    if (abgegeben) return
    const neueReihenfolge = [...reihenfolge]
    const zielIndex = richtung === 'hoch' ? index - 1 : index + 1
    if (zielIndex < 0 || zielIndex >= neueReihenfolge.length) return
    ;[neueReihenfolge[index], neueReihenfolge[zielIndex]] = [neueReihenfolge[zielIndex], neueReihenfolge[index]]
    setAntwort(frage.id, { typ: 'sortierung', reihenfolge: neueReihenfolge })
  }

  // Drag & Drop State
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = useCallback((index: number) => {
    if (abgegeben) return
    setDragIndex(index)
  }, [abgegeben])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, zielIndex: number) => {
    e.preventDefault()
    setDragOverIndex(null)
    if (dragIndex === null || dragIndex === zielIndex || abgegeben) {
      setDragIndex(null)
      return
    }
    // Element von dragIndex nach zielIndex verschieben
    const neueReihenfolge = [...reihenfolge]
    const [element] = neueReihenfolge.splice(dragIndex, 1)
    neueReihenfolge.splice(zielIndex, 0, element)
    setAntwort(frage.id, { typ: 'sortierung', reihenfolge: neueReihenfolge })
    setDragIndex(null)
  }, [dragIndex, abgegeben, reihenfolge, setAntwort, frage.id])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
    setDragOverIndex(null)
  }, [])

  // Touch-DnD (iPad/Mobile — HTML5 DnD funktioniert nicht auf iOS)
  const touchStartY = useRef<number>(0)
  const touchCurrentIndex = useRef<number | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: React.PointerEvent, index: number) => {
    if (abgegeben || e.pointerType === 'mouse') return // Maus nutzt HTML5-DnD
    touchStartY.current = e.clientY
    touchCurrentIndex.current = index
    setDragIndex(index)
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }, [abgegeben])

  const handleTouchMove = useCallback((e: React.PointerEvent) => {
    if (touchCurrentIndex.current === null || e.pointerType === 'mouse') return
    e.preventDefault()
    if (!listRef.current) return
    const items = listRef.current.querySelectorAll('[data-sort-item]')
    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect()
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        setDragOverIndex(i)
        return
      }
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (touchCurrentIndex.current === null) return
    const von = touchCurrentIndex.current
    const nach = dragOverIndex
    if (nach !== null && von !== nach && !abgegeben) {
      const neueReihenfolge = [...reihenfolge]
      const [element] = neueReihenfolge.splice(von, 1)
      neueReihenfolge.splice(nach, 0, element)
      setAntwort(frage.id, { typ: 'sortierung', reihenfolge: neueReihenfolge })
    }
    touchCurrentIndex.current = null
    setDragIndex(null)
    setDragOverIndex(null)
  }, [dragOverIndex, abgegeben, reihenfolge, setAntwort, frage.id])

  return (
    <div className="flex flex-col gap-5">
      {/* Header: Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${fachbereichFarbe(frage.fachbereich)}`}>
          {frage.fachbereich}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {frage.bloom}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {frage.punkte} {frage.punkte === 1 ? 'Punkt' : 'Punkte'}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          Sortierung
        </span>
      </div>

      {/* Fragetext */}
      <div
        className="text-base leading-relaxed text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-lg border border-slate-200 dark:border-slate-700"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(frage.fragetext) }}
      />

      {/* Sortier-Liste mit Drag & Drop (Desktop) + Pointer-DnD (Touch/iPad) */}
      <div
        ref={listRef}
        className={`flex flex-col gap-2 ${!abgegeben && (!aktuelleAntwort || aktuelleAntwort.typ !== 'sortierung') ? 'rounded-xl border-2 border-violet-400 dark:border-violet-500 p-1' : ''}`}
        style={{ touchAction: abgegeben ? 'auto' : 'none' }}
      >
        {reihenfolge.map((element, index) => (
          <div
            key={`${element}-${index}`}
            data-sort-item
            draggable={!abgegeben}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onPointerDown={(e) => handleTouchStart(e, index)}
            onPointerMove={handleTouchMove}
            onPointerUp={handleTouchEnd}
            onPointerCancel={handleTouchEnd}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 bg-white dark:bg-slate-800 transition-all select-none
              ${abgegeben ? 'opacity-75' : 'cursor-grab active:cursor-grabbing'}
              ${dragIndex === index ? 'opacity-40 border-blue-400 dark:border-blue-500' : ''}
              ${dragOverIndex === index && dragIndex !== index
                ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700'
              }
            `}
          >
            {/* Drag-Handle */}
            {!abgegeben && (
              <span className="flex-shrink-0 text-slate-400 dark:text-slate-500 cursor-grab" title="Ziehen zum Sortieren">
                ⠿
              </span>
            )}

            {/* Position */}
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-500 dark:text-slate-400">
              {index + 1}
            </span>

            {/* Element-Text */}
            <span className="flex-1 text-slate-800 dark:text-slate-100">{element}</span>

            {/* Hoch/Runter-Buttons */}
            {!abgegeben && (
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => verschieben(index, 'hoch')}
                  disabled={index === 0}
                  className="px-2 py-0.5 text-sm rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  {'\u2191'}
                </button>
                <button
                  onClick={() => verschieben(index, 'runter')}
                  disabled={index === reihenfolge.length - 1}
                  className="px-2 py-0.5 text-sm rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  {'\u2193'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
