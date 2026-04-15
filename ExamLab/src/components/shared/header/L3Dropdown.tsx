import { useState, useRef, useEffect } from 'react'
import type { L3Mode, L3Item } from './types'

interface Props {
  mode: L3Mode
  items: L3Item[]
  selectedIds: string[]
  onSelect: (ids: string[]) => void
  onAddNew?: () => void
  addNewLabel?: string
  placeholder?: string
}

const MAX_LABEL_LEN = 37

export function L3Dropdown({ mode, items, selectedIds, onSelect, onAddNew, addNewLabel, placeholder }: Props) {
  const [offen, setOffen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!offen) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOffen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOffen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [offen])

  if (mode === 'none') return null
  // selectedIds empty → placeholder mode (shown when items exist but none selected)
  const keinItemGewaehlt = selectedIds.length === 0

  const primary = keinItemGewaehlt ? undefined : items.find((i) => i.id === selectedIds[0])
  const rawLabel = primary?.label ?? '—'
  const truncated = rawLabel.length > MAX_LABEL_LEN ? rawLabel.slice(0, MAX_LABEL_LEN) + '…' : rawLabel
  const extraCount = !keinItemGewaehlt && mode === 'multi' ? Math.max(0, selectedIds.length - 1) : 0

  function toggle(id: string) {
    if (mode === 'single') {
      onSelect([id])
      setOffen(false)
    } else {
      const next = selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]
      onSelect(next)
    }
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={offen}
        onClick={() => setOffen((o) => !o)}
        className="px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100 cursor-pointer border border-violet-300 dark:border-violet-700 rounded bg-white dark:bg-slate-800 hover:border-violet-500 flex items-center gap-1.5"
      >
        {keinItemGewaehlt ? (
          <span className="italic text-slate-500 dark:text-slate-400">{placeholder ?? 'Auswählen …'}</span>
        ) : (
          <>
            <span>{truncated}</span>
            {extraCount > 0 && (
              <span className="bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                +{extraCount}
              </span>
            )}
          </>
        )}
        <span className="text-violet-500 text-[10px]">▾</span>
      </button>
      {offen && (
        <div role="listbox" className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg min-w-[220px] p-1 z-20">
          {items.map((it) => {
            const sel = selectedIds.includes(it.id)
            return (
              <button
                key={it.id}
                type="button"
                role="option"
                aria-selected={sel}
                onClick={() => toggle(it.id)}
                className={`w-full text-left px-2.5 py-1.5 text-sm rounded flex items-center gap-2 cursor-pointer ${
                  sel ? 'bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-medium' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {mode === 'multi' && (
                  <span className={`w-3.5 h-3.5 border rounded-sm flex-shrink-0 flex items-center justify-center text-[9px] text-white ${sel ? 'bg-violet-600 border-violet-600' : 'border-slate-300 dark:border-slate-600'}`}>
                    {sel && '✓'}
                  </span>
                )}
                <span className="flex-1">{it.label}</span>
                {it.meta && <span className="text-xs text-slate-400">{it.meta}</span>}
              </button>
            )
          })}
          {onAddNew && (
            <>
              <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
              <button
                type="button"
                role="option"
                onClick={() => {
                  onAddNew()
                  setOffen(false)
                }}
                className="w-full text-left px-2.5 py-1.5 text-sm rounded text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950 cursor-pointer"
              >
                {addNewLabel ?? '+ Neu'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
