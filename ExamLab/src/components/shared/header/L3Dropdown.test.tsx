import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { L3Dropdown } from './L3Dropdown'

describe('L3Dropdown', () => {
  const itemsBase = [
    { id: 'a', label: 'SF WR 29c', meta: '3 Themen' },
    { id: 'b', label: 'SF WR 28bc29fs', meta: '5 Themen' },
  ]

  it('rendert Trigger mit Label des ersten ausgewählten Items', () => {
    render(<L3Dropdown mode="single" items={itemsBase} selectedIds={['a']} onSelect={() => {}} />)
    expect(screen.getByRole('combobox')).toHaveTextContent('SF WR 29c')
  })

  it('öffnet Dropdown bei Klick auf Trigger', () => {
    render(<L3Dropdown mode="single" items={itemsBase} selectedIds={['a']} onSelect={() => {}} />)
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })

  it('single mode: Auswahl ersetzt aktiven Item', () => {
    const onSelect = vi.fn()
    render(<L3Dropdown mode="single" items={itemsBase} selectedIds={['a']} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('SF WR 28bc29fs'))
    expect(onSelect).toHaveBeenCalledWith(['b'])
  })

  it('multi mode: toggelt Items, zeigt +N Pill im Trigger', () => {
    const onSelect = vi.fn()
    render(<L3Dropdown mode="multi" items={itemsBase} selectedIds={['a', 'b']} onSelect={onSelect} />)
    expect(screen.getByRole('combobox')).toHaveTextContent(/SF WR 29c.*\+1/)
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('SF WR 28bc29fs'))
    expect(onSelect).toHaveBeenCalledWith(['a'])
  })

  it('zeigt "+ Neu"-Option wenn onAddNew gesetzt', () => {
    const onAddNew = vi.fn()
    render(
      <L3Dropdown
        mode="single"
        items={itemsBase}
        selectedIds={[]}
        onSelect={() => {}}
        onAddNew={onAddNew}
        addNewLabel="+ Neuer Kurs"
      />,
    )
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('+ Neuer Kurs'))
    expect(onAddNew).toHaveBeenCalled()
  })

  it('begrenzt Trigger-Label auf 40 Zeichen mit Ellipsis', () => {
    const longItem = { id: 'x', label: 'Einrichtungsprüfung-mit-extrem-langem-Titel-der-über-40-Zeichen-geht' }
    render(<L3Dropdown mode="single" items={[longItem]} selectedIds={['x']} onSelect={() => {}} />)
    const trigger = screen.getByRole('combobox')
    expect(trigger.textContent?.length).toBeLessThanOrEqual(41)
    expect(trigger.textContent).toContain('…')
  })

  it('multi: Uncheck der primären → nächste aktive wird primär', () => {
    const onSelect = vi.fn()
    render(<L3Dropdown mode="multi" items={itemsBase} selectedIds={['a', 'b']} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('SF WR 29c'))
    expect(onSelect).toHaveBeenCalledWith(['b'])
  })

  it('multi: Uncheck letzter aktiver → onSelect mit leerem Array', () => {
    const onSelect = vi.fn()
    render(<L3Dropdown mode="multi" items={itemsBase} selectedIds={['a']} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('SF WR 29c'))
    expect(onSelect).toHaveBeenCalledWith([])
  })
})
