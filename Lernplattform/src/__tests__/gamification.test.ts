import { describe, it, expect } from 'vitest'
import { berechneSterne, berechneStreak, zufaelligesLob, zufaelligerTrost } from '../utils/gamification'

describe('berechneSterne', () => {
  it('0 Sterne bei 0% Mastery', () => {
    expect(berechneSterne(0)).toBe(0)
  })

  it('1 Stern bei 25% Mastery', () => {
    expect(berechneSterne(25)).toBe(1)
  })

  it('1 Stern bei 33%', () => {
    expect(berechneSterne(33)).toBe(1)
  })

  it('2 Sterne bei 50% Mastery', () => {
    expect(berechneSterne(50)).toBe(2)
  })

  it('2 Sterne bei 74%', () => {
    expect(berechneSterne(74)).toBe(2)
  })

  it('3 Sterne bei 75% Mastery', () => {
    expect(berechneSterne(75)).toBe(3)
  })

  it('3 Sterne bei 100%', () => {
    expect(berechneSterne(100)).toBe(3)
  })
})

describe('berechneStreak', () => {
  it('0 bei leerer Session-Liste', () => {
    expect(berechneStreak([])).toBe(0)
  })

  it('1 bei einer Session heute', () => {
    const jetzt = new Date().toISOString()
    expect(berechneStreak([jetzt])).toBe(1)
  })

  it('zaehlt aufeinanderfolgende Sessions', () => {
    const d1 = new Date('2026-04-03T10:00:00').toISOString()
    const d2 = new Date('2026-04-03T14:00:00').toISOString()
    const d3 = new Date('2026-04-02T10:00:00').toISOString()
    expect(berechneStreak([d1, d2, d3])).toBe(3)
  })

  it('bricht Streak nach 14 Tagen Pause ab', () => {
    const alt = new Date('2026-03-01T10:00:00').toISOString()
    const neu = new Date('2026-04-03T10:00:00').toISOString()
    expect(berechneStreak([neu, alt])).toBe(1)
  })
})

describe('Feedback-Texte', () => {
  it('zufaelligesLob gibt String zurueck', () => {
    const lob = zufaelligesLob()
    expect(typeof lob).toBe('string')
    expect(lob.length).toBeGreaterThan(0)
  })

  it('zufaelligerTrost gibt String zurueck', () => {
    const trost = zufaelligerTrost()
    expect(typeof trost).toBe('string')
    expect(trost.length).toBeGreaterThan(0)
  })
})
