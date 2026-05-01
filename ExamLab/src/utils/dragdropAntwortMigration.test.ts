import { describe, expect, it } from 'vitest'
import { normalisiereDragDropAntwort } from './ueben/fragetypNormalizer'
import type { DragDropBildFrage } from '../types/ueben/fragen'

const frage = {
  id: 'f1',
  typ: 'dragdrop_bild',
  fragetext: 'Test',
  bildUrl: '',
  punkte: 4,
  zielzonen: [
    { id: 'z1', form: 'rechteck', punkte: [], korrekteLabels: ['Aktiva'] },
    { id: 'z2', form: 'rechteck', punkte: [], korrekteLabels: ['Passiva'] },
  ],
  labels: [
    { id: 'lid-aktiva', text: 'Aktiva' },
    { id: 'lid-passiva', text: 'Passiva' },
  ],
} as unknown as DragDropBildFrage /* Defensive: Test-Mock ohne fragenummer/punktzahl-Felder */

describe('normalisiereDragDropAntwort', () => {
  it('Pre-Migration-Antwort: text-keyed → id-keyed', () => {
    const antwort = { typ: 'dragdrop_bild' as const, zuordnungen: { 'Aktiva': 'z1', 'Passiva': 'z2' } }
    const out = normalisiereDragDropAntwort(antwort, frage)
    expect(out.zuordnungen).toEqual({ 'lid-aktiva': 'z1', 'lid-passiva': 'z2' })
  })

  it('Post-Migration-Antwort: id-keyed bleibt unverändert', () => {
    const antwort = { typ: 'dragdrop_bild' as const, zuordnungen: { 'lid-aktiva': 'z1' } }
    const out = normalisiereDragDropAntwort(antwort, frage)
    expect(out.zuordnungen).toEqual({ 'lid-aktiva': 'z1' })
  })

  it('case-insensitive Text-Match', () => {
    const antwort = { typ: 'dragdrop_bild' as const, zuordnungen: { 'aktiva': 'z1' } }
    const out = normalisiereDragDropAntwort(antwort, frage)
    expect(out.zuordnungen).toEqual({ 'lid-aktiva': 'z1' })
  })

  it('unbekannter Key (weder ID noch Text-Match): defensiv ignoriert', () => {
    const antwort = { typ: 'dragdrop_bild' as const, zuordnungen: { 'Etwas Anderes': 'z1' } }
    const out = normalisiereDragDropAntwort(antwort, frage)
    expect(out.zuordnungen).toEqual({})
  })

  it('leere zuordnungen: leeres Output', () => {
    const antwort = { typ: 'dragdrop_bild' as const, zuordnungen: {} }
    const out = normalisiereDragDropAntwort(antwort, frage)
    expect(out.zuordnungen).toEqual({})
  })

  it('IDB-Restore mappt Pre-Migration-text-keyed zuordnungen auf id-keyed', () => {
    const idbAntwort = { typ: 'dragdrop_bild' as const, zuordnungen: { 'Aktiva': 'z1' } }
    const aktuelleFrage = {
      id: 'f1', typ: 'dragdrop_bild',
      zielzonen: [{ id: 'z1', form: 'rechteck', punkte: [], korrekteLabels: ['Aktiva'] }],
      labels: [{ id: 'sid-aktiva', text: 'Aktiva' }],
    } as unknown as DragDropBildFrage /* Defensive: Test-Mock minimal — IDB-Restore-Pfad braucht nur labels+zielzonen */
    const out = normalisiereDragDropAntwort(idbAntwort, aktuelleFrage)
    expect(out.zuordnungen).toEqual({ 'sid-aktiva': 'z1' })
  })
})
