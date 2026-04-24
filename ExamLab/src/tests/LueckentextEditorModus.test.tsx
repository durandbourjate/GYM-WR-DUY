import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LueckentextEditor from '@shared/editor/typen/LueckentextEditor'

// LueckentextEditor nutzt nur Props (kein EditorContext, kein Store) — minimaler Setup reicht.

function renderEditor(overrides: {
  textMitLuecken?: string
  luecken?: Array<{ id: string; korrekteAntworten: string[]; caseSensitive: boolean; dropdownOptionen?: string[] }>
  lueckentextModus?: 'freitext' | 'dropdown'
  setTextMitLuecken?: (v: string) => void
  setLuecken?: (v: any) => void
  setLueckentextModus?: (v: 'freitext' | 'dropdown') => void
} = {}) {
  const setTextMitLuecken = overrides.setTextMitLuecken ?? (() => {})
  const setLuecken = overrides.setLuecken ?? (() => {})
  const setLueckentextModus = overrides.setLueckentextModus ?? (() => {})
  render(
    <LueckentextEditor
      textMitLuecken={overrides.textMitLuecken ?? 'Die Hauptstadt ist {{1}}.'}
      setTextMitLuecken={setTextMitLuecken}
      luecken={overrides.luecken ?? [{ id: '1', korrekteAntworten: ['Bern'], caseSensitive: false }]}
      setLuecken={setLuecken as any}
      lueckentextModus={overrides.lueckentextModus ?? 'freitext'}
      setLueckentextModus={setLueckentextModus}
    />
  )
}

describe('LueckentextEditor — Modus-Toggle', () => {
  it('zeigt Toggle Freitext/Dropdown oberhalb der Lücken-Liste', () => {
    renderEditor({ lueckentextModus: 'freitext' })
    const freitextBtn = screen.getByRole('button', { name: /^Freitext$/i })
    const dropdownBtn = screen.getByRole('button', { name: /^Dropdown$/i })
    expect(freitextBtn).toBeTruthy()
    expect(dropdownBtn).toBeTruthy()
    // Freitext ist aktiv
    expect(freitextBtn.getAttribute('aria-pressed')).toBe('true')
    expect(dropdownBtn.getAttribute('aria-pressed')).toBe('false')
  })

  it('wechselt lueckentextModus beim Toggle-Klick auf dropdown', () => {
    const setLueckentextModus = vi.fn()
    renderEditor({ lueckentextModus: 'freitext', setLueckentextModus })
    fireEvent.click(screen.getByRole('button', { name: /^Dropdown$/i }))
    expect(setLueckentextModus).toHaveBeenCalledWith('dropdown')
  })

  it('dimmt dropdownOptionen-Feld im Freitext-Modus mit Label „inaktiv"', () => {
    renderEditor({ lueckentextModus: 'freitext' })
    const dropdownInput = screen.getByPlaceholderText(/Dropdown-Optionen/i)
    // Container ist der Wrapper (parent), der die Dimming-Klasse trägt
    const dropdownWrapper = dropdownInput.closest('[data-modus-feld="dropdown"]')
    expect(dropdownWrapper).toBeTruthy()
    expect(dropdownWrapper!.className).toContain('opacity-50')
    // Label „inaktiv" sichtbar
    expect(screen.getByText(/inaktiv im Freitext-Modus/i)).toBeTruthy()
  })

  it('dimmt korrekteAntworten-Feld im Dropdown-Modus mit Label „inaktiv"', () => {
    renderEditor({ lueckentextModus: 'dropdown' })
    const freitextInput = screen.getByPlaceholderText(/Korrekte Antworten/i)
    const freitextWrapper = freitextInput.closest('[data-modus-feld="freitext"]')
    expect(freitextWrapper).toBeTruthy()
    expect(freitextWrapper!.className).toContain('opacity-50')
    expect(screen.getByText(/inaktiv im Dropdown-Modus/i)).toBeTruthy()
  })

  it('dimmt inaktives Feld NICHT via pointer-events-none (LP soll editieren können)', () => {
    renderEditor({ lueckentextModus: 'freitext' })
    const dropdownInput = screen.getByPlaceholderText(/Dropdown-Optionen/i)
    const dropdownWrapper = dropdownInput.closest('[data-modus-feld="dropdown"]')!
    expect(dropdownWrapper.className).not.toContain('pointer-events-none')
  })
})
