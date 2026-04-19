import { describe, it, expect } from 'vitest'
import { normalisiereFrageDaten } from './fragetypNormalizer'

describe('normalisiereMc', () => {
  it('setzt fehlendes optionen[].korrekt auf false (Default)', () => {
    const frage: any = { id: 'f1', typ: 'mc', optionen: [{ id: 'o1', text: 'A' }, { id: 'o2', text: 'B' }] }
    const n: any = normalisiereFrageDaten(frage)
    expect(n.optionen.every((o: any) => typeof o.korrekt === 'boolean')).toBe(true)
  })

  it('behält bestehendes optionen[].korrekt', () => {
    const frage: any = { id: 'f1', typ: 'mc', optionen: [{ id: 'o1', text: 'A', korrekt: true }, { id: 'o2', text: 'B', korrekt: false }] }
    const n: any = normalisiereFrageDaten(frage)
    expect(n.optionen[0].korrekt).toBe(true)
    expect(n.optionen[1].korrekt).toBe(false)
  })

  it('handelt fehlendes optionen[] als leeres Array', () => {
    const frage: any = { id: 'f1', typ: 'mc' }
    const n: any = normalisiereFrageDaten(frage)
    expect(Array.isArray(n.optionen)).toBe(true)
    expect(n.optionen.length).toBe(0)
  })
})
