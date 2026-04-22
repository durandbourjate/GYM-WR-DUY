import { describe, it, expect, vi } from 'vitest'
import { baueTeilerklaerungsKontext } from '@shared/editor/musterloesungKontext'

interface TestItem {
  id: string
  text: string
  erklaerung?: string
}

describe('baueTeilerklaerungsKontext', () => {
  function baueMC(items: TestItem[], setItems: (u: (i: TestItem[]) => TestItem[]) => void) {
    return baueTeilerklaerungsKontext({
      feld: 'optionen',
      items,
      getId: (i) => i.id,
      getLabel: (i) => i.text,
      getErklaerung: (i) => i.erklaerung,
      setzeErklaerung: (i, e) => ({ ...i, erklaerung: e }),
      setItems,
    })
  }

  it('baut elementeInfo als Map mit id → label + bestehendeErklaerung', () => {
    const k = baueMC(
      [
        { id: 'a', text: 'Opt A', erklaerung: '' },
        { id: 'b', text: 'Opt B', erklaerung: 'vorhanden' },
      ],
      vi.fn(),
    )
    expect(k.elementeInfo).toEqual({
      a: { label: 'Opt A', bestehendeErklaerung: '' },
      b: { label: 'Opt B', bestehendeErklaerung: 'vorhanden' },
    })
    expect(k.feld).toBe('optionen')
    expect(k.subArrayFuerRequest).toEqual([
      { id: 'a', text: 'Opt A', erklaerung: '' },
      { id: 'b', text: 'Opt B', erklaerung: 'vorhanden' },
    ])
  })

  it('überspringt Items ohne ID in elementeInfo', () => {
    const k = baueMC([{ id: '', text: 'leer' }, { id: 'a', text: 'A' }], vi.fn())
    expect(k.elementeInfo).toEqual({ a: { label: 'A', bestehendeErklaerung: '' } })
  })

  it('uebernimmErklaerungen: schreibt Text in Items mit passender ID', () => {
    let items: TestItem[] = [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B', erklaerung: 'alt' },
    ]
    const setItems = vi.fn((updater: (i: TestItem[]) => TestItem[]) => {
      items = updater(items)
    })
    const k = baueMC(items, setItems)
    k.uebernimmErklaerungen([
      { feld: 'optionen', id: 'a', text: 'neu A' },
      { feld: 'optionen', id: 'b', text: 'neu B' },
    ])
    expect(items).toEqual([
      { id: 'a', text: 'A', erklaerung: 'neu A' },
      { id: 'b', text: 'B', erklaerung: 'neu B' },
    ])
  })

  it('uebernimmErklaerungen: ignoriert Teilerklärungen mit falschem Feld', () => {
    let items: TestItem[] = [{ id: 'a', text: 'A' }]
    const setItems = vi.fn((updater: (i: TestItem[]) => TestItem[]) => {
      items = updater(items)
    })
    const k = baueMC(items, setItems)
    k.uebernimmErklaerungen([
      { feld: 'aussagen', id: 'a', text: 'falsches Feld' },
    ])
    expect(setItems).not.toHaveBeenCalled()
  })

  it('uebernimmErklaerungen: lässt unbetroffene Items unverändert', () => {
    let items: TestItem[] = [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
    ]
    const setItems = vi.fn((updater: (i: TestItem[]) => TestItem[]) => {
      items = updater(items)
    })
    const k = baueMC(items, setItems)
    k.uebernimmErklaerungen([{ feld: 'optionen', id: 'a', text: 'nur A' }])
    expect(items).toEqual([{ id: 'a', text: 'A', erklaerung: 'nur A' }, { id: 'b', text: 'B' }])
  })

  it('uebernimmErklaerungen: no-op bei leerer Liste', () => {
    const setItems = vi.fn()
    const k = baueMC([{ id: 'a', text: 'A' }], setItems)
    k.uebernimmErklaerungen([])
    expect(setItems).not.toHaveBeenCalled()
  })

  it('funktioniert mit custom ID-Extractor (z.B. BilanzER kontonummer)', () => {
    interface Konto {
      kontonummer: string
      name: string
      saldo: number
      erklaerung?: string
    }
    let konten: Konto[] = [{ kontonummer: '1020', name: 'Bank', saldo: 1000 }]
    const k = baueTeilerklaerungsKontext<Konto>({
      feld: 'kontenMitSaldi',
      items: konten,
      getId: (k) => k.kontonummer,
      getLabel: (k) => `${k.kontonummer} ${k.name}`,
      getErklaerung: (k) => k.erklaerung,
      setzeErklaerung: (k, e) => ({ ...k, erklaerung: e }),
      setItems: (u) => {
        konten = u(konten)
      },
    })
    expect(k.elementeInfo).toEqual({ '1020': { label: '1020 Bank', bestehendeErklaerung: '' } })
    k.uebernimmErklaerungen([{ feld: 'kontenMitSaldi', id: '1020', text: 'UV Bank' }])
    expect(konten[0].erklaerung).toBe('UV Bank')
  })
})
