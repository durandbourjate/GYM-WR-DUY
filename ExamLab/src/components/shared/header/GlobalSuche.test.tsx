import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GlobalSuche } from './GlobalSuche'
import type { SucheErgebnis } from '../../../hooks/useGlobalSuche.shared'

describe('GlobalSuche', () => {
  function mkErgebnis(istLadend = false): SucheErgebnis {
    return {
      istLadend,
      gruppen: [
        {
          id: 'kontext',
          label: 'Im aktiven Kontext',
          kontextTag: 'Üben · SF WR 29c',
          treffer: [
            { id: 't1', kategorie: 'thema', titel: 'Konjunkturzyklus', meta: 'VWL · 14 Fragen', onOpen: vi.fn() },
          ],
        },
        {
          id: 'fragen',
          label: 'Fragensammlung',
          treffer: [
            { id: 'f1', kategorie: 'frage', titel: 'Was ist die SNB?', meta: 'VWL', onOpen: vi.fn() },
          ],
        },
      ],
    }
  }

  it('zeigt Placeholder wenn Input leer', () => {
    render(<GlobalSuche suchen="" onSuchen={() => {}} ergebnis={{ gruppen: [], istLadend: false }} />)
    expect(screen.getByRole('searchbox')).toHaveValue('')
  })

  it('zeigt Gruppen-Label + Kontext-Tag', () => {
    render(<GlobalSuche suchen="konj" onSuchen={() => {}} ergebnis={mkErgebnis()} istFokussiert />)
    expect(screen.getByText('Im aktiven Kontext')).toBeInTheDocument()
    expect(screen.getByText('Üben · SF WR 29c')).toBeInTheDocument()
  })

  it('zeigt Lade-Hinweis bei istLadend', () => {
    render(<GlobalSuche suchen="x" onSuchen={() => {}} ergebnis={mkErgebnis(true)} istFokussiert />)
    expect(screen.getByText(/Lade Daten/i)).toBeInTheDocument()
  })

  it('Enter auf erstem Treffer öffnet ihn', () => {
    const erg = mkErgebnis()
    render(<GlobalSuche suchen="konj" onSuchen={() => {}} ergebnis={erg} istFokussiert />)
    const input = screen.getByRole('searchbox')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(erg.gruppen[0].treffer[0].onOpen).toHaveBeenCalled()
  })

  it('ESC löscht Input und entfokussiert', () => {
    const onSuchen = vi.fn()
    render(<GlobalSuche suchen="xyz" onSuchen={onSuchen} ergebnis={mkErgebnis()} istFokussiert />)
    const input = screen.getByRole('searchbox')
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(onSuchen).toHaveBeenCalledWith('')
  })
})
