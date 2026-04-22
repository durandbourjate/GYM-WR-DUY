/**
 * C9 Phase 3 Task 24 — Teilerklärungs-Kontext für MusterloesungSection.
 *
 * Kapselt pro Fragetyp:
 *  - welches Sub-Array im `generiereMusterloesung`-Request mitgeschickt wird,
 *  - Metadaten (label + bestehendeErklaerung) für die Preview-UI,
 *  - einen Writeback-Callback, der übernommene Teilerklärungen in den State schreibt.
 *
 * SharedFragenEditor baut den Kontext je nach `typ` (siehe Factory-Funktionen unten) und
 * reicht ihn an MusterloesungSection durch.
 */
import type {
  MusterloesungsFeld,
  MusterloesungsTeilerklaerung,
} from './musterloesungNormalizer'

export interface TeilerklaerungsKontext {
  /** Feld-Name im Apps-Script-Request + Normalizer-Antwort (z.B. 'optionen'). */
  feld: MusterloesungsFeld
  /** Sub-Array-Inhalt, der in den KI-Request fliesst. */
  subArrayFuerRequest: unknown
  /** Map id → {label, bestehendeErklaerung} für Preview-Anzeige + Default-Policy. */
  elementeInfo: Record<string, { label: string; bestehendeErklaerung: string }>
  /** Schreibt übernommene Teilerklärungen in den jeweiligen State zurück. */
  uebernimmErklaerungen: (teilerklaerungen: MusterloesungsTeilerklaerung[]) => void
}

/**
 * Generischer Builder: kennt Feld-Name + Item-Shape + Setter und produziert
 * einen vollständigen TeilerklaerungsKontext. Wird pro Fragetyp im SharedFragenEditor
 * aufgerufen.
 */
export function baueTeilerklaerungsKontext<T>(params: {
  feld: MusterloesungsFeld
  items: T[]
  /** Extrahiert die ID aus einem Item (für MC = option.id, für BilanzER = konto.kontonummer). */
  getId: (item: T, index: number) => string
  /** Kurz-Label für die Preview-Liste. */
  getLabel: (item: T, index: number) => string
  /** Liefert die vorhandene LP-Erklärung (leer wenn keine). */
  getErklaerung: (item: T) => string | undefined
  /** Setzt `erklaerung` im Item unveränderlich (Spread + Patch). */
  setzeErklaerung: (item: T, erklaerung: string) => T
  /** State-Setter des SharedFragenEditors (z.B. setOptionen, setAussagen …). */
  setItems: (updater: (items: T[]) => T[]) => void
}): TeilerklaerungsKontext {
  const { feld, items, getId, getLabel, getErklaerung, setzeErklaerung, setItems } = params

  const elementeInfo: Record<string, { label: string; bestehendeErklaerung: string }> = {}
  items.forEach((item, idx) => {
    const id = getId(item, idx)
    if (!id) return
    elementeInfo[id] = {
      label: getLabel(item, idx),
      bestehendeErklaerung: getErklaerung(item) ?? '',
    }
  })

  return {
    feld,
    subArrayFuerRequest: items,
    elementeInfo,
    uebernimmErklaerungen: (teilerklaerungen) => {
      if (teilerklaerungen.length === 0) return
      const byId = new Map<string, string>()
      teilerklaerungen.forEach((t) => {
        if (t.feld === feld) byId.set(t.id, t.text)
      })
      if (byId.size === 0) return
      setItems((prev) =>
        prev.map((item, idx) => {
          const id = getId(item, idx)
          const neueErklaerung = byId.get(id)
          return neueErklaerung !== undefined ? setzeErklaerung(item, neueErklaerung) : item
        }),
      )
    },
  }
}
