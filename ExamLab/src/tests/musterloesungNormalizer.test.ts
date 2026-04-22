import { describe, it, expect } from 'vitest'
import { normalisiereMusterloesungsAntwort } from '@shared/editor/musterloesungNormalizer'

describe('normalisiereMusterloesungsAntwort', () => {
  describe('Input-Validierung (defensive Szenarien)', () => {
    it('liefert leere Antwort bei null', () => {
      expect(normalisiereMusterloesungsAntwort(null)).toEqual({
        musterloesung: '',
        teilerklaerungen: [],
      })
    })

    it('liefert leere Antwort bei undefined', () => {
      expect(normalisiereMusterloesungsAntwort(undefined)).toEqual({
        musterloesung: '',
        teilerklaerungen: [],
      })
    })

    it('liefert leere Antwort bei String statt Objekt', () => {
      expect(normalisiereMusterloesungsAntwort('kaputt')).toEqual({
        musterloesung: '',
        teilerklaerungen: [],
      })
    })

    it('liefert leere Antwort bei Array statt Objekt', () => {
      expect(normalisiereMusterloesungsAntwort([{ musterloesung: 'x' }])).toEqual({
        musterloesung: '',
        teilerklaerungen: [],
      })
    })

    it('liefert leere Antwort bei leerem Objekt', () => {
      expect(normalisiereMusterloesungsAntwort({})).toEqual({
        musterloesung: '',
        teilerklaerungen: [],
      })
    })
  })

  describe('Musterlösungs-Feld (Dual-Write-Kompat)', () => {
    it('übernimmt musterloesung (korrekte Schreibweise)', () => {
      const r = normalisiereMusterloesungsAntwort({ musterloesung: 'Die Lösung ist X.' })
      expect(r.musterloesung).toBe('Die Lösung ist X.')
    })

    it('fällt auf musterlosung (Legacy-Tippo) zurück wenn musterloesung fehlt', () => {
      const r = normalisiereMusterloesungsAntwort({ musterlosung: 'Alt-Feld' })
      expect(r.musterloesung).toBe('Alt-Feld')
    })

    it('bevorzugt musterloesung wenn beide Felder gesetzt sind', () => {
      const r = normalisiereMusterloesungsAntwort({
        musterloesung: 'Neu',
        musterlosung: 'Alt',
      })
      expect(r.musterloesung).toBe('Neu')
    })

    it('ignoriert leeren String in musterloesung und prüft Legacy-Fallback', () => {
      const r = normalisiereMusterloesungsAntwort({
        musterloesung: '',
        musterlosung: 'Fallback',
      })
      expect(r.musterloesung).toBe('Fallback')
    })

    it('ignoriert Nicht-String-Werte in musterloesung', () => {
      const r = normalisiereMusterloesungsAntwort({ musterloesung: 42 })
      expect(r.musterloesung).toBe('')
    })
  })

  describe('Teilerklärungs-Filter', () => {
    it('akzeptiert valide Teilerklärungen mit bekanntem feld', () => {
      const r = normalisiereMusterloesungsAntwort({
        musterloesung: 'x',
        teilerklaerungen: [
          { feld: 'optionen', id: 'opt-a', text: 'Erklärung A' },
          { feld: 'optionen', id: 'opt-b', text: 'Erklärung B' },
        ],
      })
      expect(r.teilerklaerungen).toHaveLength(2)
      expect(r.teilerklaerungen[0]).toEqual({ feld: 'optionen', id: 'opt-a', text: 'Erklärung A' })
    })

    it('liefert [] wenn teilerklaerungen fehlt (Alt-Backend-Deployment)', () => {
      const r = normalisiereMusterloesungsAntwort({ musterloesung: 'x' })
      expect(r.teilerklaerungen).toEqual([])
    })

    it('liefert [] wenn teilerklaerungen kein Array ist', () => {
      const r = normalisiereMusterloesungsAntwort({
        musterloesung: 'x',
        teilerklaerungen: 'kaputt',
      })
      expect(r.teilerklaerungen).toEqual([])
    })

    it('filtert Einträge mit unbekanntem feld', () => {
      const r = normalisiereMusterloesungsAntwort({
        musterloesung: 'x',
        teilerklaerungen: [
          { feld: 'optionen', id: 'opt-a', text: 'gut' },
          { feld: 'halluziniert', id: 'h-1', text: 'ungültig' },
        ],
      })
      expect(r.teilerklaerungen).toHaveLength(1)
      expect(r.teilerklaerungen[0].id).toBe('opt-a')
    })

    it('filtert Einträge mit leerer oder fehlender id', () => {
      const r = normalisiereMusterloesungsAntwort({
        musterloesung: 'x',
        teilerklaerungen: [
          { feld: 'optionen', id: '', text: 'leer' },
          { feld: 'optionen', text: 'kein id-Feld' },
          { feld: 'optionen', id: 'opt-a', text: 'ok' },
        ],
      })
      expect(r.teilerklaerungen).toHaveLength(1)
      expect(r.teilerklaerungen[0].id).toBe('opt-a')
    })

    it('filtert Einträge mit leerem text', () => {
      const r = normalisiereMusterloesungsAntwort({
        musterloesung: 'x',
        teilerklaerungen: [
          { feld: 'optionen', id: 'opt-a', text: '' },
          { feld: 'optionen', id: 'opt-b', text: 'gefuellt' },
        ],
      })
      expect(r.teilerklaerungen).toHaveLength(1)
      expect(r.teilerklaerungen[0].id).toBe('opt-b')
    })

    it('filtert null- und Nicht-Objekt-Einträge im Array', () => {
      const r = normalisiereMusterloesungsAntwort({
        musterloesung: 'x',
        teilerklaerungen: [
          null,
          'string-eintrag',
          { feld: 'optionen', id: 'opt-a', text: 'valide' },
          undefined,
        ],
      })
      expect(r.teilerklaerungen).toHaveLength(1)
      expect(r.teilerklaerungen[0].id).toBe('opt-a')
    })
  })

  describe('Realistische Backend-Responses (S133 Smoke-Test)', () => {
    it('MC-Response aus Task-22-Smoke-Test', () => {
      const raw = {
        musterloesung:
          'Die Current Ratio gehört zur Liquiditätsanalyse. Diese Kennzahl misst das Verhältnis…',
        musterlosung:
          'Die Current Ratio gehört zur Liquiditätsanalyse. Diese Kennzahl misst das Verhältnis…',
        teilerklaerungen: [
          {
            feld: 'optionen',
            id: 'opt-a',
            text: 'Die Current Ratio ist eine klassische Liquiditätskennzahl…',
          },
          {
            feld: 'optionen',
            id: 'opt-b',
            text: 'Die Umsatzrendite ist eine Rentabilitätskennzahl, nicht eine Liquiditätskennzahl…',
          },
        ],
      }
      const r = normalisiereMusterloesungsAntwort(raw)
      expect(r.musterloesung).toContain('Current Ratio')
      expect(r.teilerklaerungen).toHaveLength(2)
      expect(r.teilerklaerungen.every(t => t.feld === 'optionen')).toBe(true)
    })

    it('Freitext-Response (keine Sub-Elemente)', () => {
      const raw = {
        musterloesung: 'Aufwand ist der bewertete Verbrauch…',
        musterlosung: 'Aufwand ist der bewertete Verbrauch…',
        teilerklaerungen: [],
      }
      const r = normalisiereMusterloesungsAntwort(raw)
      expect(r.musterloesung).toContain('Aufwand')
      expect(r.teilerklaerungen).toEqual([])
    })

    it('Bilanzstruktur-Response mit kontenMitSaldi-IDs', () => {
      const raw = {
        musterloesung: 'Die Konten werden nach ihrer wirtschaftlichen Funktion zugeordnet…',
        musterlosung: 'Die Konten werden nach ihrer wirtschaftlichen Funktion zugeordnet…',
        teilerklaerungen: [
          { feld: 'kontenMitSaldi', id: '1000', text: 'Kasse gehört zu Umlaufvermögen…' },
          { feld: 'kontenMitSaldi', id: '1020', text: 'Bank wird als Umlaufvermögen ausgewiesen…' },
          { feld: 'kontenMitSaldi', id: '2000', text: 'Kreditoren sind kurzfristiges Fremdkapital…' },
        ],
      }
      const r = normalisiereMusterloesungsAntwort(raw)
      expect(r.teilerklaerungen).toHaveLength(3)
      expect(r.teilerklaerungen.map(t => t.id)).toEqual(['1000', '1020', '2000'])
    })
  })
})
