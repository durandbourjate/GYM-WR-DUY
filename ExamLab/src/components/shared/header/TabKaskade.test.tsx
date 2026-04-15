import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TabKaskade } from './TabKaskade'
import type { TabKaskadeConfig } from './types'

function makeConfig(overrides?: Partial<TabKaskadeConfig>): TabKaskadeConfig {
  return {
    l1Tabs: [
      { id: 'favoriten', label: 'Favoriten', onClick: vi.fn() },
      {
        id: 'pruefung',
        label: 'Prüfen',
        onClick: vi.fn(),
        l2: [
          { id: 'durchfuehren', label: 'Durchführen', onClick: vi.fn() },
          { id: 'analyse', label: 'Analyse', onClick: vi.fn() },
        ],
      },
      { id: 'fragensammlung', label: 'Fragensammlung', onClick: vi.fn() },
    ],
    aktivL1: 'pruefung',
    aktivL2: 'durchfuehren',
    ...overrides,
  }
}

describe('TabKaskade', () => {
  it('rendert alle L1-Tabs', () => {
    render(<TabKaskade config={makeConfig()} />)
    expect(screen.getByText('Favoriten')).toBeInTheDocument()
    expect(screen.getByText('Prüfen')).toBeInTheDocument()
    expect(screen.getByText('Fragensammlung')).toBeInTheDocument()
  })

  it('markiert aktives L1 mit aria-selected', () => {
    render(<TabKaskade config={makeConfig()} />)
    const pruefen = screen.getByRole('tab', { name: 'Prüfen' })
    expect(pruefen).toHaveAttribute('aria-selected', 'true')
  })

  it('rendert L2-Gruppe direkt nach aktivem L1', () => {
    render(<TabKaskade config={makeConfig()} />)
    expect(screen.getByRole('tab', { name: 'Durchführen' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Analyse' })).toBeInTheDocument()
  })

  it('rendert L2-Gruppe nicht, wenn kein L1 aktiv', () => {
    render(<TabKaskade config={makeConfig({ aktivL1: null, aktivL2: null })} />)
    expect(screen.queryByRole('tab', { name: 'Durchführen' })).not.toBeInTheDocument()
  })

  it('zeigt L3-Dropdown wenn aktives L2 eine L3-Config mit Auswahl hat', () => {
    const config = makeConfig()
    config.l1Tabs[1].l2![0].l3 = {
      mode: 'single',
      items: [{ id: 'a', label: 'SF WR 29c' }],
      selectedIds: ['a'],
      onSelect: vi.fn(),
    }
    render(<TabKaskade config={config} />)
    expect(screen.getByRole('combobox')).toHaveTextContent('SF WR 29c')
  })

  it('ruft onClick bei L1-Tab-Klick', () => {
    const config = makeConfig()
    render(<TabKaskade config={config} />)
    fireEvent.click(screen.getByText('Favoriten'))
    expect(config.l1Tabs[0].onClick).toHaveBeenCalled()
  })

  it('L1-Container hat role="tablist" mit aria-label', () => {
    render(<TabKaskade config={makeConfig()} />)
    const mainList = screen.getByRole('tablist', { name: /Hauptnavigation/i })
    expect(mainList).toBeInTheDocument()
  })

  it('L2-Container hat role="tablist" mit kontext-spezifischem aria-label', () => {
    render(<TabKaskade config={makeConfig()} />)
    const l2List = screen.getByRole('tablist', { name: /Ansichten für Prüfen/i })
    expect(l2List).toBeInTheDocument()
  })

  it('Pfeiltasten navigieren zwischen L1-Tabs (WAI-ARIA Authoring Practices)', () => {
    const config = makeConfig()
    render(<TabKaskade config={config} />)
    const favoriten = screen.getByRole('tab', { name: 'Favoriten' })
    favoriten.focus()
    fireEvent.keyDown(favoriten, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Prüfen' }))
  })
})
