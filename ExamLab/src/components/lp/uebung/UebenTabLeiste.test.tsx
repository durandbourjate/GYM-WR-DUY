import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UebenTabLeiste } from './UebenTabLeiste'

describe('UebenTabLeiste', () => {
  const noop = () => {}
  const gruppen = [
    { id: 'sf-wr-29c', name: 'SF WR 29c' },
    { id: 'in-28c', name: 'IN 28c' },
  ]

  it('rendert Haupttabs ohne Kurs-Tabs wenn Übungen inaktiv', () => {
    render(
      <UebenTabLeiste
        aktiv="durchfuehren"
        gruppen={gruppen}
        onDurchfuehren={noop}
        onUebungen={noop}
        onAnalyse={noop}
        onKursWaehle={noop}
      />
    )
    expect(screen.getByRole('button', { name: /Übung durchführen/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /^Übungen$/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Analyse/i })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /SF WR 29c/i })).toBeNull()
  })

  it('rendert Kurs-Tabs wenn Übungen aktiv', () => {
    render(
      <UebenTabLeiste
        aktiv="uebungen"
        aktiverKursId="sf-wr-29c"
        gruppen={gruppen}
        onDurchfuehren={noop}
        onUebungen={noop}
        onAnalyse={noop}
        onKursWaehle={noop}
      />
    )
    expect(screen.getByRole('button', { name: /SF WR 29c/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /IN 28c/i })).toBeTruthy()
  })

  it('Klick auf Kurs-Tab ruft onKursWaehle mit kursId', () => {
    const onKursWaehle = vi.fn()
    render(
      <UebenTabLeiste
        aktiv="uebungen"
        aktiverKursId="sf-wr-29c"
        gruppen={gruppen}
        onDurchfuehren={noop}
        onUebungen={noop}
        onAnalyse={noop}
        onKursWaehle={onKursWaehle}
      />
    )
    screen.getByRole('button', { name: /IN 28c/i }).click()
    expect(onKursWaehle).toHaveBeenCalledWith('in-28c')
  })

  it('markiert aktiven Kurs-Tab', () => {
    render(
      <UebenTabLeiste
        aktiv="uebungen"
        aktiverKursId="sf-wr-29c"
        gruppen={gruppen}
        onDurchfuehren={noop}
        onUebungen={noop}
        onAnalyse={noop}
        onKursWaehle={noop}
      />
    )
    const aktiv = screen.getByRole('button', { name: /SF WR 29c/i })
    expect(aktiv.className).toMatch(/filter-btn-active/)
  })

  it('rendert keine Kurs-Tabs wenn gruppen leer', () => {
    render(
      <UebenTabLeiste
        aktiv="uebungen"
        gruppen={[]}
        onDurchfuehren={noop}
        onUebungen={noop}
        onAnalyse={noop}
        onKursWaehle={noop}
      />
    )
    expect(screen.queryByRole('button', { name: /SF WR 29c/i })).toBeNull()
  })
})
