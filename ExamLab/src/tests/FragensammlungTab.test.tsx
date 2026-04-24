import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LueckentextBulkToggle from '../components/settings/fragensammlung/LueckentextBulkToggle'
import * as api from '../services/fragensammlungApi'

describe('LueckentextBulkToggle', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('zeigt Admin-Only-Hinweis wenn istAdmin=false', () => {
    render(<LueckentextBulkToggle email="x@y" istAdmin={false} />)
    expect(screen.getByText(/nur für Admins/i)).toBeInTheDocument()
  })

  it('ruft API mit modus=freitext auf nach Klick + Bestätigung', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const spy = vi
      .spyOn(api, 'bulkSetzeLueckentextModus')
      .mockResolvedValue({ total: 253, geaendert: 253, alleBereits: false })
    render(<LueckentextBulkToggle email="admin@gym" istAdmin={true} />)
    fireEvent.click(screen.getByRole('button', { name: /Alle auf Freitext/i }))
    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith('admin@gym', 'freitext'),
    )
    await waitFor(() =>
      expect(screen.getByText(/253 von 253/)).toBeInTheDocument(),
    )
  })

  it('bricht ab wenn Bestätigung verneint', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const spy = vi.spyOn(api, 'bulkSetzeLueckentextModus')
    render(<LueckentextBulkToggle email="admin@gym" istAdmin={true} />)
    fireEvent.click(screen.getByRole('button', { name: /Alle auf Dropdown/i }))
    expect(spy).not.toHaveBeenCalled()
  })
})
