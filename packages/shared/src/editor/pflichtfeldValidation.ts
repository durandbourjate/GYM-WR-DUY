import type { Frage } from '../types/fragen'

export type FeldStatus = 'pflicht-leer' | 'empfohlen-leer' | 'ok'

export interface ValidationResult {
  pflichtErfuellt: boolean
  empfohlenErfuellt: boolean
  felderStatus: Record<string, FeldStatus>
  pflichtLeerFelder: string[]
  empfohlenLeerFelder: string[]
}

const DEFAULT_OK: ValidationResult = {
  pflichtErfuellt: true,
  empfohlenErfuellt: true,
  felderStatus: {},
  pflichtLeerFelder: [],
  empfohlenLeerFelder: [],
}

const DEFAULT_KONSERVATIV: ValidationResult = {
  ...DEFAULT_OK,
  empfohlenErfuellt: false,
}

function strNonEmpty(s: unknown): boolean {
  return typeof s === 'string' && s.trim().length > 0
}

export function validierePflichtfelder(frage: Frage | null | undefined): ValidationResult {
  if (!frage || typeof frage !== 'object') return DEFAULT_OK

  try {
    switch ((frage as any).typ) {
      case 'mc':
        return validiereMC(frage as any)
      case 'richtigfalsch':
        return validiereRichtigFalsch(frage as any)
      case 'lueckentext':
        return validiereLueckentext(frage as any)
      case 'sortierung':
        return validiereSortierung(frage as any)
      case 'zuordnung':
        return validiereZuordnung(frage as any)
      case 'bildbeschriftung':
        return validiereBildbeschriftung(frage as any)
      case 'dragdrop_bild':
        return validiereDragDropBild(frage as any)
      case 'hotspot':
        return validiereHotspot(frage as any)
      case 'freitext':
        return validiereFreitext(frage as any)
      case 'berechnung':
        return validiereBerechnung(frage as any)
      case 'audio':
        return DEFAULT_OK
      default:
        console.warn(`[pflichtfeldValidation] Unbekannter typ: ${(frage as any).typ}`)
        return DEFAULT_KONSERVATIV
    }
  } catch (err) {
    console.error('[pflichtfeldValidation] crash:', err)
    return DEFAULT_OK
  }
}

function validiereRichtigFalsch(frage: any): ValidationResult {
  const fragetextOk = strNonEmpty(frage.fragetext)
  const aussagen = Array.isArray(frage.aussagen) ? frage.aussagen : []
  const mitText = aussagen.filter((a: any) => strNonEmpty(a?.text))
  const mind2 = mitText.length >= 2
  const alleKorrektGeflaggt =
    aussagen.length > 0 && aussagen.every((a: any) => a?.korrekt === true || a?.korrekt === false)
  const erklaerungenAlle = aussagen.length > 0 && aussagen.every((a: any) => strNonEmpty(a?.erklaerung))

  const pflichtLeer: string[] = []
  if (!fragetextOk) pflichtLeer.push('Frage-Text')
  if (!mind2) pflichtLeer.push('Mind. 2 Aussagen mit Text')
  if (!alleKorrektGeflaggt) pflichtLeer.push('Jede Aussage richtig/falsch markieren')

  const empfohlenLeer: string[] = []
  if (!erklaerungenAlle) empfohlenLeer.push('Erklärung pro Aussage')

  return {
    pflichtErfuellt: pflichtLeer.length === 0,
    empfohlenErfuellt: empfohlenLeer.length === 0,
    felderStatus: {
      fragetext: fragetextOk ? 'ok' : 'pflicht-leer',
      aussagen: mind2 && alleKorrektGeflaggt ? 'ok' : 'pflicht-leer',
      erklaerungen: erklaerungenAlle ? 'ok' : 'empfohlen-leer',
    },
    pflichtLeerFelder: pflichtLeer,
    empfohlenLeerFelder: empfohlenLeer,
  }
}

function validiereLueckentext(frage: any): ValidationResult {
  const fragetextOk = strNonEmpty(frage.fragetext)
  const text = typeof frage.textMitLuecken === 'string' ? frage.textMitLuecken : ''
  const platzhalterOk = text.includes('{{') || text.includes('{')
  const luecken = Array.isArray(frage.luecken) ? frage.luecken : []
  const modus = frage.lueckentextModus === 'dropdown' ? 'dropdown' : 'freitext'

  const allLueckenOk =
    luecken.length > 0 &&
    luecken.every((l: any) => {
      if (modus === 'freitext') {
        const antworten = Array.isArray(l?.korrekteAntworten) ? l.korrekteAntworten : []
        return antworten.some((a: any) => strNonEmpty(a))
      }
      const dropdown = Array.isArray(l?.dropdownOptionen) ? l.dropdownOptionen : []
      const korrekt = Array.isArray(l?.korrekteAntworten) ? l.korrekteAntworten : []
      return dropdown.length >= 2 && korrekt.some((a: any) => strNonEmpty(a))
    })

  const pflichtLeer: string[] = []
  if (!fragetextOk) pflichtLeer.push('Frage-Text')
  if (!platzhalterOk) pflichtLeer.push('Lücken-Platzhalter im Text ({{1}})')
  if (!allLueckenOk) {
    pflichtLeer.push(
      modus === 'freitext'
        ? 'Pro Lücke mind. 1 korrekte Antwort'
        : 'Pro Lücke mind. 2 Dropdown-Optionen + 1 korrekt markiert',
    )
  }

  return {
    pflichtErfuellt: pflichtLeer.length === 0,
    empfohlenErfuellt: true,
    felderStatus: {
      fragetext: fragetextOk ? 'ok' : 'pflicht-leer',
      textMitLuecken: platzhalterOk ? 'ok' : 'pflicht-leer',
      luecken: allLueckenOk ? 'ok' : 'pflicht-leer',
    },
    pflichtLeerFelder: pflichtLeer,
    empfohlenLeerFelder: [],
  }
}

function validiereSortierung(frage: any): ValidationResult {
  const fragetextOk = strNonEmpty(frage.fragetext)
  const elemente = Array.isArray(frage.elemente) ? frage.elemente : []
  const mind2 = elemente.filter((e: any) => strNonEmpty(e)).length >= 2

  const pflichtLeer: string[] = []
  if (!fragetextOk) pflichtLeer.push('Frage-Text')
  if (!mind2) pflichtLeer.push('Mind. 2 Elemente mit Text')

  return {
    pflichtErfuellt: pflichtLeer.length === 0,
    empfohlenErfuellt: true,
    felderStatus: {
      fragetext: fragetextOk ? 'ok' : 'pflicht-leer',
      elemente: mind2 ? 'ok' : 'pflicht-leer',
    },
    pflichtLeerFelder: pflichtLeer,
    empfohlenLeerFelder: [],
  }
}

function validiereZuordnung(frage: any): ValidationResult {
  const fragetextOk = strNonEmpty(frage.fragetext)
  const paare = Array.isArray(frage.paare) ? frage.paare : []
  const vollstaendig = paare.filter((p: any) => strNonEmpty(p?.links) && strNonEmpty(p?.rechts))
  const mind2 = vollstaendig.length >= 2

  const pflichtLeer: string[] = []
  if (!fragetextOk) pflichtLeer.push('Frage-Text')
  if (!mind2) pflichtLeer.push('Mind. 2 vollständige Paare')

  return {
    pflichtErfuellt: pflichtLeer.length === 0,
    empfohlenErfuellt: true,
    felderStatus: {
      fragetext: fragetextOk ? 'ok' : 'pflicht-leer',
      paare: mind2 ? 'ok' : 'pflicht-leer',
    },
    pflichtLeerFelder: pflichtLeer,
    empfohlenLeerFelder: [],
  }
}

function validiereBildbeschriftung(frage: any): ValidationResult {
  const fragetextOk = strNonEmpty(frage.fragetext)
  const bildOk = strNonEmpty(frage.bildUrl)
  const beschriftungen = Array.isArray(frage.beschriftungen) ? frage.beschriftungen : []
  const allBeschOk =
    beschriftungen.length > 0 &&
    beschriftungen.every((b: any) => {
      const pos = b?.position
      const posOk = pos && typeof pos.x === 'number' && typeof pos.y === 'number'
      const korrekt = Array.isArray(b?.korrekt) ? b.korrekt : []
      const hatAntwort = korrekt.some((k: any) => strNonEmpty(k))
      return posOk && hatAntwort
    })

  const pflichtLeer: string[] = []
  if (!fragetextOk) pflichtLeer.push('Frage-Text')
  if (!bildOk) pflichtLeer.push('Bild-URL')
  if (!allBeschOk) pflichtLeer.push('Mind. 1 Beschriftung mit Position + korrekt-Antwort')

  return {
    pflichtErfuellt: pflichtLeer.length === 0,
    empfohlenErfuellt: true,
    felderStatus: {
      fragetext: fragetextOk ? 'ok' : 'pflicht-leer',
      bildUrl: bildOk ? 'ok' : 'pflicht-leer',
      beschriftungen: allBeschOk ? 'ok' : 'pflicht-leer',
    },
    pflichtLeerFelder: pflichtLeer,
    empfohlenLeerFelder: [],
  }
}

function validiereDragDropBild(frage: any): ValidationResult {
  const fragetextOk = strNonEmpty(frage.fragetext)
  const bildOk = strNonEmpty(frage.bildUrl)
  const zielzonen = Array.isArray(frage.zielzonen) ? frage.zielzonen : []
  const labelsRaw = Array.isArray(frage.labels) ? frage.labels : []
  const labels: string[] = labelsRaw
    .map((l: any) => (typeof l === 'string' ? l.trim() : typeof l?.text === 'string' ? l.text.trim() : ''))
    .filter((l: string) => l.length > 0)
  const mind1Zone =
    zielzonen.length > 0 && zielzonen.every((z: any) => strNonEmpty(z?.korrektesLabel))
  const alleLabelsImPool =
    mind1Zone &&
    zielzonen.every((z: any) => labels.includes(typeof z?.korrektesLabel === 'string' ? z.korrektesLabel.trim() : ''))

  const pflichtLeer: string[] = []
  if (!fragetextOk) pflichtLeer.push('Frage-Text')
  if (!bildOk) pflichtLeer.push('Bild-URL')
  if (!mind1Zone) pflichtLeer.push('Mind. 1 Zielzone mit korrektesLabel')
  if (mind1Zone && !alleLabelsImPool) pflichtLeer.push('Alle korrektesLabel müssen im Labels-Pool sein')

  return {
    pflichtErfuellt: pflichtLeer.length === 0,
    empfohlenErfuellt: true,
    felderStatus: {
      fragetext: fragetextOk ? 'ok' : 'pflicht-leer',
      bildUrl: bildOk ? 'ok' : 'pflicht-leer',
      zielzonen: mind1Zone && alleLabelsImPool ? 'ok' : 'pflicht-leer',
    },
    pflichtLeerFelder: pflichtLeer,
    empfohlenLeerFelder: [],
  }
}

function validiereHotspot(frage: any): ValidationResult {
  const fragetextOk = strNonEmpty(frage.fragetext)
  const bildOk = strNonEmpty(frage.bildUrl)
  const bereiche = Array.isArray(frage.bereiche)
    ? frage.bereiche
    : Array.isArray((frage as any).hotspots)
      ? (frage as any).hotspots
      : []
  const mind1 = bereiche.length >= 1

  const pflichtLeer: string[] = []
  if (!fragetextOk) pflichtLeer.push('Frage-Text')
  if (!bildOk) pflichtLeer.push('Bild-URL')
  if (!mind1) pflichtLeer.push('Mind. 1 Bereich')

  return {
    pflichtErfuellt: pflichtLeer.length === 0,
    empfohlenErfuellt: true,
    felderStatus: {
      fragetext: fragetextOk ? 'ok' : 'pflicht-leer',
      bildUrl: bildOk ? 'ok' : 'pflicht-leer',
      bereiche: mind1 ? 'ok' : 'pflicht-leer',
    },
    pflichtLeerFelder: pflichtLeer,
    empfohlenLeerFelder: [],
  }
}

function validiereFreitext(frage: any): ValidationResult {
  const fragetextOk = strNonEmpty(frage.fragetext)
  const musterOk = strNonEmpty(frage.musterlosung) || strNonEmpty(frage.musterloesung)
  const rasterOk =
    (Array.isArray(frage.bewertungsraster) && frage.bewertungsraster.length > 0) ||
    (Array.isArray((frage as any).bewertungskriterien) && (frage as any).bewertungskriterien.length > 0)
  const empfohlenOk = musterOk || rasterOk

  const pflichtLeer: string[] = []
  if (!fragetextOk) pflichtLeer.push('Frage-Text')

  const empfohlenLeer: string[] = []
  if (!empfohlenOk) empfohlenLeer.push('Musterlösung oder Bewertungsraster')

  return {
    pflichtErfuellt: pflichtLeer.length === 0,
    empfohlenErfuellt: empfohlenLeer.length === 0,
    felderStatus: {
      fragetext: fragetextOk ? 'ok' : 'pflicht-leer',
      musterloesung: empfohlenOk ? 'ok' : 'empfohlen-leer',
    },
    pflichtLeerFelder: pflichtLeer,
    empfohlenLeerFelder: empfohlenLeer,
  }
}

function validiereBerechnung(frage: any): ValidationResult {
  const fragetextOk = strNonEmpty(frage.fragetext)
  const ergebnisse = Array.isArray(frage.ergebnisse) ? frage.ergebnisse : []
  const mind1Ergebnis =
    ergebnisse.length > 0 &&
    ergebnisse.every((e: any) => {
      const wert = e?.korrekt ?? e?.korrekteAntwort ?? e?.ergebnis
      return wert !== undefined && wert !== null && wert !== ''
    })
  const allFelderEmpfohlen =
    ergebnisse.length > 0 &&
    ergebnisse.every((e: any) => typeof e?.toleranz === 'number' && strNonEmpty(e?.einheit))
  const erklaerungEmpfohlen = strNonEmpty(frage.erklaerung)

  const pflichtLeer: string[] = []
  if (!fragetextOk) pflichtLeer.push('Frage-Text')
  if (!mind1Ergebnis) pflichtLeer.push('Mind. 1 Ergebnis mit korrekter Antwort')

  const empfohlenLeer: string[] = []
  if (!allFelderEmpfohlen) empfohlenLeer.push('Toleranz + Einheit pro Ergebnis')
  if (!erklaerungEmpfohlen) empfohlenLeer.push('Erklärung')

  return {
    pflichtErfuellt: pflichtLeer.length === 0,
    empfohlenErfuellt: empfohlenLeer.length === 0,
    felderStatus: {
      fragetext: fragetextOk ? 'ok' : 'pflicht-leer',
      ergebnisse: mind1Ergebnis ? 'ok' : 'pflicht-leer',
      toleranz: allFelderEmpfohlen ? 'ok' : 'empfohlen-leer',
      erklaerung: erklaerungEmpfohlen ? 'ok' : 'empfohlen-leer',
    },
    pflichtLeerFelder: pflichtLeer,
    empfohlenLeerFelder: empfohlenLeer,
  }
}

function validiereMC(frage: any): ValidationResult {
  const fragetextOk = strNonEmpty(frage.fragetext)
  const optionen = Array.isArray(frage.optionen) ? frage.optionen : []
  const mind2 = optionen.filter((o: any) => strNonEmpty(o?.text)).length >= 2
  const eineKorrekt = optionen.some((o: any) => o?.korrekt === true)
  const erklaerungenAlle = optionen.length > 0 && optionen.every((o: any) => strNonEmpty(o?.erklaerung))

  const pflichtLeer: string[] = []
  if (!fragetextOk) pflichtLeer.push('Frage-Text')
  if (!mind2) pflichtLeer.push('Mind. 2 Optionen mit Text')
  if (!eineKorrekt) pflichtLeer.push('Mind. 1 korrekte Option markiert')

  const empfohlenLeer: string[] = []
  if (!erklaerungenAlle) empfohlenLeer.push('Erklärung pro Option')

  return {
    pflichtErfuellt: pflichtLeer.length === 0,
    empfohlenErfuellt: empfohlenLeer.length === 0,
    felderStatus: {
      fragetext: fragetextOk ? 'ok' : 'pflicht-leer',
      optionen: mind2 && eineKorrekt ? 'ok' : 'pflicht-leer',
      erklaerungen: erklaerungenAlle ? 'ok' : 'empfohlen-leer',
    },
    pflichtLeerFelder: pflichtLeer,
    empfohlenLeerFelder: empfohlenLeer,
  }
}
