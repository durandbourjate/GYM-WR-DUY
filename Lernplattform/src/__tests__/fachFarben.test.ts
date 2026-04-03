import { describe, it, expect } from 'vitest'
import { getFachFarbe } from '../utils/fachFarben'

describe('fachFarben', () => {
  it('gibt Standard-Farbe zurueck', () => {
    expect(getFachFarbe('VWL', {})).toBe('#f97316')
    expect(getFachFarbe('BWL', {})).toBe('#3b82f6')
  })
  it('gibt konfigurierte Farbe zurueck', () => {
    expect(getFachFarbe('VWL', { VWL: '#ff0000' })).toBe('#ff0000')
  })
  it('gibt Fallback fuer unbekanntes Fach', () => {
    expect(getFachFarbe('Deutsch', {})).toBe('#6b7280')
  })
})
