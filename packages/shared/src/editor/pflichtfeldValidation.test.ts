import { describe, it, expect } from 'vitest'
import { validierePflichtfelder } from './pflichtfeldValidation'

describe('validierePflichtfelder — Defensiv-Verhalten', () => {
  it('liefert pflichtErfuellt=true für unbekannten typ (kein Save-Block)', () => {
    const r = validierePflichtfelder({ id: 'x', typ: 'mcc' as any, fragetext: 'q' } as any)
    expect(r.pflichtErfuellt).toBe(true)
    expect(r.empfohlenErfuellt).toBe(false) // konservativ
  })
  it('liefert ok bei null/undefined-Frage', () => {
    expect(validierePflichtfelder(null as any).pflichtErfuellt).toBe(true)
    expect(validierePflichtfelder(undefined as any).pflichtErfuellt).toBe(true)
  })
  it('crasht nicht bei null in Array-Feld (mc.optionen=null)', () => {
    const r = validierePflichtfelder({ id: 'x', typ: 'mc', fragetext: 'q', optionen: null } as any)
    expect(r).toBeDefined()
    expect(r.pflichtErfuellt).toBe(false) // ≥2 Optionen Pflicht
  })
  it('liefert immer ein gültiges ValidationResult', () => {
    const r = validierePflichtfelder({ id: 'x', typ: 'mc', fragetext: 'q' } as any)
    expect(typeof r.felderStatus).toBe('object')
    expect(Array.isArray(r.pflichtLeerFelder)).toBe(true)
    expect(Array.isArray(r.empfohlenLeerFelder)).toBe(true)
  })
  it('throws nie', () => {
    expect(() => validierePflichtfelder(undefined as any)).not.toThrow()
    expect(() => validierePflichtfelder({} as any)).not.toThrow()
  })
})

describe('validierePflichtfelder — mc', () => {
  const minimalGueltig = {
    id: 'm1',
    typ: 'mc',
    fragetext: 'q',
    optionen: [
      { id: 'o1', text: 'A', korrekt: true, erklaerung: 'e1' },
      { id: 'o2', text: 'B', korrekt: false, erklaerung: 'e2' },
    ],
  }
  it('alle erfüllt', () => {
    const r = validierePflichtfelder(minimalGueltig as any)
    expect(r.pflichtErfuellt).toBe(true)
    expect(r.empfohlenErfuellt).toBe(true)
  })
  it('pflicht-leer ohne Frage-Text', () => {
    const r = validierePflichtfelder({ ...minimalGueltig, fragetext: '' } as any)
    expect(r.pflichtErfuellt).toBe(false)
    expect(r.pflichtLeerFelder).toContain('Frage-Text')
  })
  it('pflicht-leer mit nur 1 Option', () => {
    const r = validierePflichtfelder({ ...minimalGueltig, optionen: [minimalGueltig.optionen[0]] } as any)
    expect(r.pflichtErfuellt).toBe(false)
  })
  it('pflicht-leer ohne korrekt-markierte Option', () => {
    const r = validierePflichtfelder({
      ...minimalGueltig,
      optionen: minimalGueltig.optionen.map((o) => ({ ...o, korrekt: false })),
    } as any)
    expect(r.pflichtErfuellt).toBe(false)
  })
  it('empfohlen-leer ohne Erklärungen', () => {
    const r = validierePflichtfelder({
      ...minimalGueltig,
      optionen: minimalGueltig.optionen.map((o) => ({ ...o, erklaerung: '' })),
    } as any)
    expect(r.pflichtErfuellt).toBe(true)
    expect(r.empfohlenErfuellt).toBe(false)
  })
})

describe('validierePflichtfelder — richtigfalsch', () => {
  const gueltig = {
    id: 'r1',
    typ: 'richtigfalsch',
    fragetext: 'q',
    aussagen: [
      { id: 'a1', text: 'A1', korrekt: true, erklaerung: 'e1' },
      { id: 'a2', text: 'A2', korrekt: false, erklaerung: 'e2' },
    ],
  }
  it('alle erfüllt', () => {
    const r = validierePflichtfelder(gueltig as any)
    expect(r.pflichtErfuellt).toBe(true)
    expect(r.empfohlenErfuellt).toBe(true)
  })
  it('pflicht-leer mit nur 1 Aussage', () => {
    const r = validierePflichtfelder({ ...gueltig, aussagen: [gueltig.aussagen[0]] } as any)
    expect(r.pflichtErfuellt).toBe(false)
  })
  it('pflicht-leer wenn Aussage ohne korrekt-flag (null)', () => {
    const r = validierePflichtfelder({
      ...gueltig,
      aussagen: [
        { id: 'a1', text: 'A1', korrekt: null, erklaerung: 'e1' },
        { id: 'a2', text: 'A2', korrekt: false, erklaerung: 'e2' },
      ],
    } as any)
    expect(r.pflichtErfuellt).toBe(false)
  })
  it('empfohlen-leer ohne Erklärungen', () => {
    const r = validierePflichtfelder({
      ...gueltig,
      aussagen: gueltig.aussagen.map((a) => ({ ...a, erklaerung: '' })),
    } as any)
    expect(r.pflichtErfuellt).toBe(true)
    expect(r.empfohlenErfuellt).toBe(false)
  })
})

describe('validierePflichtfelder — lueckentext', () => {
  it('Freitext-Modus: alle erfüllt', () => {
    const r = validierePflichtfelder({
      id: 'l1',
      typ: 'lueckentext',
      fragetext: 'q',
      textMitLuecken: 'Das ist ein {{1}} Test',
      lueckentextModus: 'freitext',
      luecken: [{ id: '1', korrekteAntworten: ['Antwort'], caseSensitive: false }],
    } as any)
    expect(r.pflichtErfuellt).toBe(true)
  })
  it('Freitext-Modus: pflicht-leer ohne korrekteAntworten', () => {
    const r = validierePflichtfelder({
      id: 'l1',
      typ: 'lueckentext',
      fragetext: 'q',
      textMitLuecken: '{{1}}',
      lueckentextModus: 'freitext',
      luecken: [{ id: '1', korrekteAntworten: [], caseSensitive: false }],
    } as any)
    expect(r.pflichtErfuellt).toBe(false)
  })
  it('pflicht-leer ohne Lücken-Platzhalter', () => {
    const r = validierePflichtfelder({
      id: 'l1',
      typ: 'lueckentext',
      fragetext: 'q',
      textMitLuecken: 'Kein Platzhalter hier',
      lueckentextModus: 'freitext',
      luecken: [],
    } as any)
    expect(r.pflichtErfuellt).toBe(false)
  })
  it('Dropdown-Modus: alle erfüllt mit korrektem Eintrag', () => {
    const r = validierePflichtfelder({
      id: 'l1',
      typ: 'lueckentext',
      fragetext: 'q',
      textMitLuecken: '{{1}}',
      lueckentextModus: 'dropdown',
      luecken: [
        {
          id: '1',
          korrekteAntworten: ['A'],
          caseSensitive: false,
          dropdownOptionen: ['A', 'B'],
        },
      ],
    } as any)
    expect(r.pflichtErfuellt).toBe(true)
  })
  it('Dropdown-Modus: pflicht-leer mit nur 1 Option', () => {
    const r = validierePflichtfelder({
      id: 'l1',
      typ: 'lueckentext',
      fragetext: 'q',
      textMitLuecken: '{{1}}',
      lueckentextModus: 'dropdown',
      luecken: [
        {
          id: '1',
          korrekteAntworten: ['A'],
          caseSensitive: false,
          dropdownOptionen: ['A'],
        },
      ],
    } as any)
    expect(r.pflichtErfuellt).toBe(false)
  })
})

describe('validierePflichtfelder — sortierung', () => {
  it('alle erfüllt', () => {
    const r = validierePflichtfelder({
      id: 's1',
      typ: 'sortierung',
      fragetext: 'q',
      elemente: ['A', 'B', 'C'],
    } as any)
    expect(r.pflichtErfuellt).toBe(true)
  })
  it('pflicht-leer mit nur 1 Element', () => {
    const r = validierePflichtfelder({
      id: 's1',
      typ: 'sortierung',
      fragetext: 'q',
      elemente: ['A'],
    } as any)
    expect(r.pflichtErfuellt).toBe(false)
  })
  it('pflicht-leer ohne Frage-Text', () => {
    const r = validierePflichtfelder({
      id: 's1',
      typ: 'sortierung',
      fragetext: '',
      elemente: ['A', 'B'],
    } as any)
    expect(r.pflichtErfuellt).toBe(false)
  })
})

describe('validierePflichtfelder — zuordnung', () => {
  it('alle erfüllt', () => {
    const r = validierePflichtfelder({
      id: 'z1',
      typ: 'zuordnung',
      fragetext: 'q',
      paare: [
        { links: 'L1', rechts: 'R1' },
        { links: 'L2', rechts: 'R2' },
      ],
    } as any)
    expect(r.pflichtErfuellt).toBe(true)
  })
  it('pflicht-leer mit nur 1 Paar', () => {
    const r = validierePflichtfelder({
      id: 'z1',
      typ: 'zuordnung',
      fragetext: 'q',
      paare: [{ links: 'L1', rechts: 'R1' }],
    } as any)
    expect(r.pflichtErfuellt).toBe(false)
  })
  it('pflicht-leer mit halbem Paar (rechts leer)', () => {
    const r = validierePflichtfelder({
      id: 'z1',
      typ: 'zuordnung',
      fragetext: 'q',
      paare: [
        { links: 'L1', rechts: 'R1' },
        { links: 'L2', rechts: '' },
      ],
    } as any)
    expect(r.pflichtErfuellt).toBe(false)
  })
})
