import { L3Dropdown } from './L3Dropdown'
import type { TabKaskadeConfig } from './types'

interface Props {
  config: TabKaskadeConfig
}

export function TabKaskade({ config }: Props) {
  const { l1Tabs, aktivL1, aktivL2 } = config
  const aktivesL1Tab = l1Tabs.find((t) => t.id === aktivL1)
  const indexAktiv = aktivesL1Tab ? l1Tabs.indexOf(aktivesL1Tab) : -1

  function renderL1Tab(t: (typeof l1Tabs)[number]) {
    const aktiv = t.id === aktivL1
    return (
      <button
        key={t.id}
        type="button"
        role="tab"
        data-l1-tab
        aria-selected={aktiv}
        onClick={t.onClick}
        className={`px-2.5 py-1 text-sm whitespace-nowrap cursor-pointer transition-colors ${
          aktiv
            ? 'text-slate-900 dark:text-slate-100 font-semibold bg-violet-50 dark:bg-violet-950 border-b-2 border-violet-500 -mb-[1px] rounded-t'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-b-2 hover:border-slate-300 -mb-[1px] rounded-t'
        }`}
      >
        {t.label}
      </button>
    )
  }

  function renderL2Group() {
    if (!aktivesL1Tab?.l2 || aktivesL1Tab.l2.length === 0) return null
    return (
      <div
        className="inline-flex items-center gap-[1px] pl-1.5 ml-0.5 border-l-2 border-violet-400 dark:border-violet-600"
        role="tablist"
        aria-label={`Ansichten für ${aktivesL1Tab.label}`}
      >
        {aktivesL1Tab.l2.map((t2) => {
          const aktiv = t2.id === aktivL2
          return (
            <span key={t2.id} className="inline-flex items-center">
              <button
                type="button"
                role="tab"
                aria-selected={aktiv}
                onClick={t2.onClick}
                className={`px-2 py-0.5 text-xs whitespace-nowrap cursor-pointer transition-colors ${
                  aktiv
                    ? 'text-violet-700 dark:text-violet-300 font-semibold border-b-2 border-violet-400 -mb-[1px] bg-violet-50 dark:bg-violet-950 rounded-t'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {t2.label}
              </button>
              {aktiv && t2.l3 && t2.l3.items.length > 0 && (
                <L3Dropdown
                  mode={t2.l3.mode}
                  items={t2.l3.items}
                  selectedIds={t2.l3.selectedIds}
                  onSelect={t2.l3.onSelect}
                  onAddNew={t2.l3.onAddNew}
                  addNewLabel={t2.l3.addNewLabel}
                  placeholder={t2.l3.placeholder}
                />
              )}
            </span>
          )
        })}
      </div>
    )
  }

  function onL1KeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[data-l1-tab]'))
    const current = tabs.findIndex((t) => t === document.activeElement)
    if (current < 0) return
    const delta = e.key === 'ArrowRight' ? 1 : -1
    const next = (current + delta + tabs.length) % tabs.length
    tabs[next]?.focus()
    e.preventDefault()
  }

  return (
    <>
      <div
        className="flex items-center gap-[1px] flex-1 flex-nowrap overflow-x-auto"
        role="tablist"
        aria-label="Hauptnavigation"
        onKeyDown={onL1KeyDown}
      >
        {l1Tabs.map((t, i) => (
          <span key={t.id} className="inline-flex items-center">
            {renderL1Tab(t)}
            {i === indexAktiv && renderL2Group()}
          </span>
        ))}
      </div>
      <div role="status" aria-live="polite" className="sr-only">
        {aktivesL1Tab
          ? `Ansicht ${aktivesL1Tab.label} aktiv${aktivesL1Tab.l2 ? `, ${aktivesL1Tab.l2.length} Unter-Ansichten verfügbar` : ''}`
          : ''}
      </div>
    </>
  )
}
