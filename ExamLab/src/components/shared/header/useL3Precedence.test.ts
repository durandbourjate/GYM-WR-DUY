import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useL3Precedence } from './useL3Precedence'

describe('useL3Precedence', () => {
  const navigate = vi.fn()
  const KEY = 'examlab-ueben-letzter-kurs'

  beforeEach(() => {
    localStorage.clear()
    navigate.mockReset()
  })

  it('URL-Wert vorhanden → returnt URL-Wert, schreibt localStorage', () => {
    const { result } = renderHook(() =>
      useL3Precedence({ urlWert: 'sf-wr-29c', storageKey: KEY, aufRedirect: navigate, basePath: '/uebung' }),
    )
    expect(result.current).toBe('sf-wr-29c')
    expect(localStorage.getItem(KEY)).toBe('sf-wr-29c')
    expect(navigate).not.toHaveBeenCalled()
  })

  it('URL leer, localStorage gefüllt → navigate(..., replace) + gibt Storage-Wert zurück', () => {
    localStorage.setItem(KEY, 'in-28c')
    renderHook(() =>
      useL3Precedence({ urlWert: null, storageKey: KEY, aufRedirect: navigate, basePath: '/uebung' }),
    )
    expect(navigate).toHaveBeenCalledWith('/uebung/kurs/in-28c', { replace: true })
  })

  it('URL leer, localStorage leer → kein navigate, return null', () => {
    const { result } = renderHook(() =>
      useL3Precedence({ urlWert: null, storageKey: KEY, aufRedirect: navigate, basePath: '/uebung' }),
    )
    expect(result.current).toBeNull()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('Aktive User-Auswahl schreibt localStorage', () => {
    renderHook(() =>
      useL3Precedence({ urlWert: 'sf-wr-29c', storageKey: KEY, aufRedirect: navigate, basePath: '/uebung' }),
    )
    expect(localStorage.getItem(KEY)).toBe('sf-wr-29c')
  })
})
