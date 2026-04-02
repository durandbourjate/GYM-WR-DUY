import { describe, it, expect } from 'vitest'
import { berechneMastery, aktualisiereFortschritt } from '../utils/mastery'
import type { FragenFortschritt } from '../types/fortschritt'

function macheFortschritt(overrides: Partial<FragenFortschritt> = {}): FragenFortschritt {
  return {
    fragenId: 'f1', email: 'test@mail.com', versuche: 0, richtig: 0,
    richtigInFolge: 0, sessionIds: [], letzterVersuch: '', mastery: 'neu',
    ...overrides,
  }
}

describe('berechneMastery', () => {
  it('neu: 0 Versuche', () => {
    expect(berechneMastery(0, [])).toBe('neu')
  })

  it('ueben: weniger als 3 richtig in Folge', () => {
    expect(berechneMastery(2, ['s1'])).toBe('ueben')
  })

  it('gefestigt: 3 richtig in Folge', () => {
    expect(berechneMastery(3, ['s1'])).toBe('gefestigt')
  })

  it('gefestigt: 4 richtig in Folge, nur 1 Session', () => {
    expect(berechneMastery(4, ['s1'])).toBe('gefestigt')
  })

  it('gemeistert: 5 richtig in Folge ueber 2 Sessions', () => {
    expect(berechneMastery(5, ['s1', 's2'])).toBe('gemeistert')
  })

  it('gemeistert: 7 richtig in Folge ueber 3 Sessions', () => {
    expect(berechneMastery(7, ['s1', 's2', 's3'])).toBe('gemeistert')
  })

  it('nicht gemeistert: 5 richtig aber nur 1 Session', () => {
    expect(berechneMastery(5, ['s1'])).toBe('gefestigt')
  })
})

describe('aktualisiereFortschritt', () => {
  it('erster Versuch richtig: neu → ueben', () => {
    const f = macheFortschritt()
    const result = aktualisiereFortschritt(f, true, 's1')
    expect(result.versuche).toBe(1)
    expect(result.richtig).toBe(1)
    expect(result.richtigInFolge).toBe(1)
    expect(result.mastery).toBe('ueben')
  })

  it('3x richtig in Folge → gefestigt', () => {
    const f = macheFortschritt({ versuche: 2, richtig: 2, richtigInFolge: 2, sessionIds: ['s1'], mastery: 'ueben' })
    const result = aktualisiereFortschritt(f, true, 's1')
    expect(result.richtigInFolge).toBe(3)
    expect(result.mastery).toBe('gefestigt')
  })

  it('5x richtig ueber 2 Sessions → gemeistert', () => {
    const f = macheFortschritt({ versuche: 4, richtig: 4, richtigInFolge: 4, sessionIds: ['s1'], mastery: 'gefestigt' })
    const result = aktualisiereFortschritt(f, true, 's2')
    expect(result.richtigInFolge).toBe(5)
    expect(result.sessionIds).toContain('s2')
    expect(result.mastery).toBe('gemeistert')
  })

  it('falsche Antwort: richtigInFolge zuruecksetzen', () => {
    const f = macheFortschritt({ versuche: 3, richtig: 3, richtigInFolge: 3, sessionIds: ['s1'], mastery: 'gefestigt' })
    const result = aktualisiereFortschritt(f, false, 's1')
    expect(result.richtigInFolge).toBe(0)
    expect(result.mastery).toBe('ueben')
  })

  it('gemeistert falsch → gefestigt', () => {
    const f = macheFortschritt({ versuche: 6, richtig: 5, richtigInFolge: 5, sessionIds: ['s1', 's2'], mastery: 'gemeistert' })
    const result = aktualisiereFortschritt(f, false, 's3')
    expect(result.richtigInFolge).toBe(0)
    expect(result.mastery).toBe('ueben')
  })

  it('Session-ID wird hinzugefuegt wenn neu', () => {
    const f = macheFortschritt({ sessionIds: ['s1'] })
    const result = aktualisiereFortschritt(f, true, 's2')
    expect(result.sessionIds).toEqual(['s1', 's2'])
  })

  it('Session-ID wird nicht dupliziert', () => {
    const f = macheFortschritt({ sessionIds: ['s1'] })
    const result = aktualisiereFortschritt(f, true, 's1')
    expect(result.sessionIds).toEqual(['s1'])
  })
})
