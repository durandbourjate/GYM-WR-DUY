import { describe, it, expect } from 'vitest'
import { istPunktInPolygon } from './polygon'

describe('istPunktInPolygon', () => {
  it('Rechteck: Punkt innen', () => {
    const poly = [{x:10,y:10},{x:20,y:10},{x:20,y:20},{x:10,y:20}]
    expect(istPunktInPolygon({x:15,y:15}, poly)).toBe(true)
  })
  it('Rechteck: Punkt ausserhalb', () => {
    const poly = [{x:10,y:10},{x:20,y:10},{x:20,y:20},{x:10,y:20}]
    expect(istPunktInPolygon({x:5,y:15}, poly)).toBe(false)
  })
  it('Dreieck: Punkt innen', () => {
    const poly = [{x:0,y:0},{x:10,y:0},{x:5,y:10}]
    expect(istPunktInPolygon({x:5,y:3}, poly)).toBe(true)
  })
  it('Dreieck: Punkt ausserhalb', () => {
    const poly = [{x:0,y:0},{x:10,y:0},{x:5,y:10}]
    expect(istPunktInPolygon({x:5,y:11}, poly)).toBe(false)
  })
  it('Konkaves L-Polygon: Punkt in Ausbuchtung ausserhalb L-Körper', () => {
    const poly = [{x:0,y:0},{x:10,y:0},{x:10,y:5},{x:5,y:5},{x:5,y:10},{x:0,y:10}]
    expect(istPunktInPolygon({x:7,y:7}, poly)).toBe(false)
  })
  it('Konkaves L-Polygon: Punkt im L-Körper', () => {
    const poly = [{x:0,y:0},{x:10,y:0},{x:10,y:5},{x:5,y:5},{x:5,y:10},{x:0,y:10}]
    expect(istPunktInPolygon({x:2,y:8}, poly)).toBe(true)
  })
  it('Leeres Polygon: immer false', () => {
    expect(istPunktInPolygon({x:5,y:5}, [])).toBe(false)
  })
  it('Zwei-Punkt-Polygon (degenerate): immer false', () => {
    expect(istPunktInPolygon({x:5,y:5}, [{x:0,y:0},{x:10,y:10}])).toBe(false)
  })
})
