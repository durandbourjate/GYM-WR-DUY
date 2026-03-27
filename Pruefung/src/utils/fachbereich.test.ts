import { describe, it, expect } from 'vitest'
import { fachbereichFarbe, typLabel, bloomLabel, istWRFachschaft, defaultFachbereich, zeigeFachbereichBadge } from './fachbereich'

describe('fachbereichFarbe', () => {
  it('gibt orange Klassen für VWL', () => {
    expect(fachbereichFarbe('VWL')).toContain('orange')
  })

  it('gibt blaue Klassen für BWL', () => {
    expect(fachbereichFarbe('BWL')).toContain('blue')
  })

  it('gibt grüne Klassen für Recht', () => {
    expect(fachbereichFarbe('Recht')).toContain('green')
  })

  it('gibt graue Klassen für Informatik', () => {
    expect(fachbereichFarbe('Informatik')).toContain('gray')
  })

  it('gibt slate Klassen für unbekannte Fachbereiche', () => {
    expect(fachbereichFarbe('Allgemein')).toContain('slate')
    expect(fachbereichFarbe('xyz')).toContain('slate')
  })
})

describe('zeigeFachbereichBadge', () => {
  it('gibt true für WR-Fachbereiche', () => {
    expect(zeigeFachbereichBadge('VWL')).toBe(true)
    expect(zeigeFachbereichBadge('BWL')).toBe(true)
    expect(zeigeFachbereichBadge('Recht')).toBe(true)
  })

  it('gibt false für nicht-WR-Fachbereiche', () => {
    expect(zeigeFachbereichBadge('Informatik')).toBe(false)
    expect(zeigeFachbereichBadge('Allgemein')).toBe(false)
    expect(zeigeFachbereichBadge('')).toBe(false)
  })
})

describe('istWRFachschaft', () => {
  it('gibt true für WR', () => {
    expect(istWRFachschaft('WR')).toBe(true)
  })

  it('gibt false für andere Fachschaften', () => {
    expect(istWRFachschaft('IN')).toBe(false)
    expect(istWRFachschaft(undefined)).toBe(false)
    expect(istWRFachschaft('')).toBe(false)
  })
})

describe('defaultFachbereich', () => {
  it('gibt VWL für WR', () => {
    expect(defaultFachbereich('WR')).toBe('VWL')
  })

  it('gibt Informatik für IN', () => {
    expect(defaultFachbereich('IN')).toBe('Informatik')
    expect(defaultFachbereich('Informatik')).toBe('Informatik')
  })

  it('gibt Allgemein für andere', () => {
    expect(defaultFachbereich('DE')).toBe('Allgemein')
    expect(defaultFachbereich(undefined)).toBe('Allgemein')
  })
})

describe('typLabel', () => {
  it.each([
    ['mc', 'Multiple Choice'],
    ['freitext', 'Freitext'],
    ['lueckentext', 'Lückentext'],
    ['zuordnung', 'Zuordnung'],
    ['richtigfalsch', 'Richtig/Falsch'],
    ['berechnung', 'Berechnung'],
    ['buchungssatz', 'Buchungssatz'],
    ['tkonto', 'T-Konto'],
    ['kontenbestimmung', 'Kontenbestimmung'],
    ['bilanzstruktur', 'Bilanz/ER'],
    ['aufgabengruppe', 'Aufgabengruppe'],
    ['visualisierung', 'Zeichnen'],
    ['pdf', 'PDF-Annotation'],
  ])('gibt "%s" → "%s"', (typ, label) => {
    expect(typLabel(typ)).toBe(label)
  })

  it('gibt den Typ selbst für unbekannte zurück', () => {
    expect(typLabel('xyz')).toBe('xyz')
  })
})

describe('bloomLabel', () => {
  it.each([
    ['K1', 'Wissen'],
    ['K2', 'Verstehen'],
    ['K3', 'Anwenden'],
    ['K4', 'Analysieren'],
    ['K5', 'Beurteilen'],
    ['K6', 'Erschaffen'],
  ])('gibt "%s" → "%s"', (stufe, label) => {
    expect(bloomLabel(stufe)).toBe(label)
  })

  it('gibt leeren String für unbekannte Stufen', () => {
    expect(bloomLabel('K7')).toBe('')
    expect(bloomLabel('')).toBe('')
  })
})
