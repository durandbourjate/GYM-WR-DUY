import { describe, expect, it } from 'vitest'
import { gruppiereStacks, naechsteFreieLabelId } from './dragdropBildUtils'

describe('gruppiereStacks', () => {
  it('gruppiert Pool-Tokens nach Text mit Counter und Resten', () => {
    const labels = [
      { id: 'a', text: 'Aktiva' },
      { id: 'b', text: 'Aktiva' },
      { id: 'c', text: 'Passiva' },
    ]
    const zuordnungen = { 'a': 'z1' }
    const stacks = gruppiereStacks(labels, zuordnungen)
    expect(stacks).toEqual([
      { text: 'Aktiva', anzahl: 1, freieIds: ['b'] },
      { text: 'Passiva', anzahl: 1, freieIds: ['c'] },
    ])
  })

  it('Stacks mit anzahl=0 werden gefiltert', () => {
    const labels = [{ id: 'a', text: 'Aktiva' }]
    const zuordnungen = { 'a': 'z1' }
    expect(gruppiereStacks(labels, zuordnungen)).toEqual([])
  })
})

describe('naechsteFreieLabelId', () => {
  it('liefert kleinsten Index unter freien IDs', () => {
    const labels = [
      { id: 'a', text: 'Aktiva' },
      { id: 'b', text: 'Aktiva' },
      { id: 'c', text: 'Aktiva' },
    ]
    expect(naechsteFreieLabelId(labels, 'Aktiva', { 'a': 'z1' })).toBe('b')
    expect(naechsteFreieLabelId(labels, 'Aktiva', { 'a': 'z1', 'b': 'z2' })).toBe('c')
    expect(naechsteFreieLabelId(labels, 'Aktiva', { 'a': 'z1', 'b': 'z2', 'c': 'z3' })).toBeNull()
  })
})
