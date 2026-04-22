import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { KIMusterloesungPreview } from '@shared/editor/ki/KIMusterloesungPreview'

/**
 * C9 Task 24 — Editor-Preview für KI-Musterlösungen.
 * Rendert das normalisierte Ergebnis aus `generiereMusterloesung` (Task 22/23) und lässt
 * die LP pro Teilerklärung entscheiden, ob sie in frage.<feld>[i].erklaerung übernommen wird.
 */
describe('KIMusterloesungPreview', () => {
  const rawResponse = {
    musterloesung: 'Die korrekte Antwort ist A, weil …',
    teilerklaerungen: [
      { feld: 'optionen', id: 'opt-a', text: 'Richtig, weil …' },
      { feld: 'optionen', id: 'opt-b', text: 'Distraktor: typischer Fehler ist …' },
    ],
  }
  const elementeInfo = {
    'opt-a': { label: 'A: Preissenkung', bestehendeErklaerung: '' },
    'opt-b': { label: 'B: Preiserhöhung', bestehendeErklaerung: 'Bereits vorhandene LP-Notiz' },
  }

  it('rendert Musterlösungs-Textarea mit dem KI-Vorschlag', () => {
    render(
      <KIMusterloesungPreview
        rawDaten={rawResponse}
        elementeInfo={elementeInfo}
        onUebernehmen={vi.fn()}
        onVerwerfen={vi.fn()}
      />,
    )
    const ta = screen.getByLabelText(/Musterlösung/i) as HTMLTextAreaElement
    expect(ta).toBeInTheDocument()
    expect(ta.value).toBe('Die korrekte Antwort ist A, weil …')
  })

  it('rendert pro Teilerklärung eine Zeile mit Label + Text-Input', () => {
    render(
      <KIMusterloesungPreview
        rawDaten={rawResponse}
        elementeInfo={elementeInfo}
        onUebernehmen={vi.fn()}
        onVerwerfen={vi.fn()}
      />,
    )
    expect(screen.getByText(/A: Preissenkung/)).toBeInTheDocument()
    expect(screen.getByText(/B: Preiserhöhung/)).toBeInTheDocument()
    const inputA = screen.getByLabelText(/Teilerklärung A: Preissenkung/i) as HTMLInputElement
    expect(inputA.value).toBe('Richtig, weil …')
  })

  it('Default-Checkbox ist aktiv wenn bestehende Erklärung leer, inaktiv wenn LP-gepflegt', () => {
    render(
      <KIMusterloesungPreview
        rawDaten={rawResponse}
        elementeInfo={elementeInfo}
        onUebernehmen={vi.fn()}
        onVerwerfen={vi.fn()}
      />,
    )
    const chkA = screen.getByLabelText(/übernehmen.*Preissenkung/i) as HTMLInputElement
    const chkB = screen.getByLabelText(/übernehmen.*Preiserhöhung/i) as HTMLInputElement
    expect(chkA.checked).toBe(true)
    expect(chkB.checked).toBe(false)
    expect(screen.getByText(/bereits.*LP-gepflegt/i)).toBeInTheDocument()
  })

  it('Übernehmen liefert nur angekreuzte Teilerklärungen + bearbeitete Musterlösung', () => {
    const onUebernehmen = vi.fn()
    render(
      <KIMusterloesungPreview
        rawDaten={rawResponse}
        elementeInfo={elementeInfo}
        onUebernehmen={onUebernehmen}
        onVerwerfen={vi.fn()}
      />,
    )
    // Musterlösung editieren
    const ta = screen.getByLabelText(/Musterlösung/i) as HTMLTextAreaElement
    fireEvent.change(ta, { target: { value: 'Angepasste Gesamterklärung.' } })
    // A bleibt aktiv, B bleibt inaktiv
    fireEvent.click(screen.getByRole('button', { name: /übernehmen/i }))
    expect(onUebernehmen).toHaveBeenCalledTimes(1)
    const payload = onUebernehmen.mock.calls[0][0]
    expect(payload.musterloesung).toBe('Angepasste Gesamterklärung.')
    expect(payload.teilerklaerungen).toEqual([
      { feld: 'optionen', id: 'opt-a', text: 'Richtig, weil …' },
    ])
  })

  it('Aktivieren einer LP-gepflegten Zeile übernimmt KI-Text als Override', () => {
    const onUebernehmen = vi.fn()
    render(
      <KIMusterloesungPreview
        rawDaten={rawResponse}
        elementeInfo={elementeInfo}
        onUebernehmen={onUebernehmen}
        onVerwerfen={vi.fn()}
      />,
    )
    const chkB = screen.getByLabelText(/übernehmen.*Preiserhöhung/i)
    fireEvent.click(chkB)
    fireEvent.click(screen.getByRole('button', { name: /übernehmen/i }))
    const payload = onUebernehmen.mock.calls[0][0]
    const ids = payload.teilerklaerungen.map((t: { id: string }) => t.id)
    expect(ids).toEqual(['opt-a', 'opt-b'])
  })

  it('Edit in Teilerklärungs-Input propagiert in den Payload', () => {
    const onUebernehmen = vi.fn()
    render(
      <KIMusterloesungPreview
        rawDaten={rawResponse}
        elementeInfo={elementeInfo}
        onUebernehmen={onUebernehmen}
        onVerwerfen={vi.fn()}
      />,
    )
    const inputA = screen.getByLabelText(/Teilerklärung A: Preissenkung/i)
    fireEvent.change(inputA, { target: { value: 'Mein eigener Text' } })
    fireEvent.click(screen.getByRole('button', { name: /übernehmen/i }))
    const payload = onUebernehmen.mock.calls[0][0]
    expect(payload.teilerklaerungen[0].text).toBe('Mein eigener Text')
  })

  it('Verwerfen-Button ruft onVerwerfen und NICHT onUebernehmen', () => {
    const onUebernehmen = vi.fn()
    const onVerwerfen = vi.fn()
    render(
      <KIMusterloesungPreview
        rawDaten={rawResponse}
        elementeInfo={elementeInfo}
        onUebernehmen={onUebernehmen}
        onVerwerfen={onVerwerfen}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /verwerfen/i }))
    expect(onVerwerfen).toHaveBeenCalledTimes(1)
    expect(onUebernehmen).not.toHaveBeenCalled()
  })

  it('rendert nur Musterlösung (keine Teilerklärungen-Liste) wenn KI keine liefert', () => {
    render(
      <KIMusterloesungPreview
        rawDaten={{ musterloesung: 'Nur Gesamt.', teilerklaerungen: [] }}
        elementeInfo={{}}
        onUebernehmen={vi.fn()}
        onVerwerfen={vi.fn()}
      />,
    )
    expect(screen.getByDisplayValue('Nur Gesamt.')).toBeInTheDocument()
    expect(screen.queryByText(/Teilerklärungen/i)).not.toBeInTheDocument()
  })

  it('Halluzinierte ID (nicht in elementeInfo) wird trotzdem gerendert, aber Checkbox disabled', () => {
    const raw = {
      musterloesung: 'x',
      teilerklaerungen: [
        { feld: 'optionen', id: 'opt-a', text: 'echt' },
        { feld: 'optionen', id: 'opt-x', text: 'halluziniert' },
      ],
    }
    render(
      <KIMusterloesungPreview
        rawDaten={raw}
        elementeInfo={{ 'opt-a': { label: 'A', bestehendeErklaerung: '' } }}
        onUebernehmen={vi.fn()}
        onVerwerfen={vi.fn()}
      />,
    )
    const chkX = screen.getByLabelText(/übernehmen.*opt-x/i) as HTMLInputElement
    expect(chkX).toBeDisabled()
    expect(chkX.checked).toBe(false)
  })

  it('Stern-Toggle wird angezeigt wenn onWichtigToggle gesetzt', () => {
    const onWichtigToggle = vi.fn()
    render(
      <KIMusterloesungPreview
        rawDaten={rawResponse}
        elementeInfo={elementeInfo}
        onUebernehmen={vi.fn()}
        onVerwerfen={vi.fn()}
        wichtig={false}
        onWichtigToggle={onWichtigToggle}
      />,
    )
    const stern = screen.getByRole('button', { name: /wichtig markieren/i })
    fireEvent.click(stern)
    expect(onWichtigToggle).toHaveBeenCalledTimes(1)
  })

  it('leitet Müll-Input durch Normalizer auf leere Antwort', () => {
    render(
      <KIMusterloesungPreview
        rawDaten={null}
        elementeInfo={{}}
        onUebernehmen={vi.fn()}
        onVerwerfen={vi.fn()}
      />,
    )
    const ta = screen.getByLabelText(/Musterlösung/i) as HTMLTextAreaElement
    expect(ta.value).toBe('')
  })
})
