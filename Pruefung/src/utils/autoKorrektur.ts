/**
 * Auto-Korrektur-Engine für deterministische Fragetypen.
 * Nicht-deterministische Typen (freitext, visualisierung, pdf) → null (manuelle Korrektur).
 */
import type { Frage, MCFrage, RichtigFalschFrage, LueckentextFrage, ZuordnungFrage, BerechnungFrage } from '../types/fragen'
import type { Antwort } from '../types/antworten'
import { korrigiereBuchungssatz, korrigiereTKonto, korrigiereKontenbestimmung, korrigiereBilanzER } from './fibuAutoKorrektur'
export type { KorrekturErgebnis, KorrekturDetail } from './fibuAutoKorrektur'
import type { KorrekturErgebnis, KorrekturDetail } from './fibuAutoKorrektur'

/** Fragetypen, die automatisch korrigiert werden können */
const AUTO_TYPEN = new Set([
  'mc', 'richtigfalsch', 'lueckentext', 'zuordnung', 'berechnung',
  'buchungssatz', 'tkonto', 'kontenbestimmung', 'bilanzstruktur',
])

/** Prüft ob ein Fragetyp automatisch korrigierbar ist */
export function istAutoKorrigierbar(typ: string): boolean {
  return AUTO_TYPEN.has(typ)
}

/** Auto-Korrektur für eine Frage. Gibt null zurück bei nicht-auto-korrigierbaren Typen oder Fehlern. */
export function autoKorrigiere(frage: Frage, antwort: Antwort | undefined): KorrekturErgebnis | null {
  try {
    if (!istAutoKorrigierbar(frage.typ)) return null

    // Keine Antwort → 0 Punkte
    if (!antwort) {
      return {
        erreichtePunkte: 0,
        maxPunkte: frage.punkte,
        details: [{ bezeichnung: 'Keine Antwort', korrekt: false, erreicht: 0, max: frage.punkte }],
      }
    }

    // Typ-Mismatch zwischen Frage und Antwort
    if (frage.typ !== antwort.typ) {
      console.warn(`[autoKorrektur] Typ-Mismatch: Frage=${frage.typ}, Antwort=${antwort.typ}`)
      return null
    }

    switch (frage.typ) {
      case 'mc':
        return korrigiereMC(frage, antwort as Extract<Antwort, { typ: 'mc' }>)
      case 'richtigfalsch':
        return korrigiereRichtigFalsch(frage, antwort as Extract<Antwort, { typ: 'richtigfalsch' }>)
      case 'lueckentext':
        return korrigiereLueckentext(frage, antwort as Extract<Antwort, { typ: 'lueckentext' }>)
      case 'zuordnung':
        return korrigiereZuordnung(frage, antwort as Extract<Antwort, { typ: 'zuordnung' }>)
      case 'berechnung':
        return korrigiereBerechnung(frage, antwort as Extract<Antwort, { typ: 'berechnung' }>)
      case 'buchungssatz':
        return korrigiereBuchungssatz(frage, (antwort as Extract<Antwort, { typ: 'buchungssatz' }>).buchungen)
      case 'tkonto':
        return korrigiereTKonto(frage, (antwort as Extract<Antwort, { typ: 'tkonto' }>).konten)
      case 'kontenbestimmung':
        return korrigiereKontenbestimmung(frage, (antwort as Extract<Antwort, { typ: 'kontenbestimmung' }>).aufgaben)
      case 'bilanzstruktur':
        return korrigiereBilanzER(frage, antwort as Extract<Antwort, { typ: 'bilanzstruktur' }>)
      default:
        return null
    }
  } catch (err) {
    console.warn(`[autoKorrektur] Fehler bei Frage ${frage.id} (${frage.typ}):`, err)
    return null
  }
}

// === MC ===

function korrigiereMC(
  frage: MCFrage,
  antwort: Extract<Antwort, { typ: 'mc' }>
): KorrekturErgebnis {
  const details: KorrekturDetail[] = []
  const korrekteIds = new Set(frage.optionen.filter(o => o.korrekt).map(o => o.id))
  const gewaehlteIds = new Set(antwort.gewaehlteOptionen)

  if (!frage.mehrfachauswahl) {
    // Single-Choice: alles oder nichts
    const korrekt = korrekteIds.size === gewaehlteIds.size
      && [...korrekteIds].every(id => gewaehlteIds.has(id))
    details.push({
      bezeichnung: 'Antwort',
      korrekt,
      erreicht: korrekt ? frage.punkte : 0,
      max: frage.punkte,
    })
  } else {
    // Multiple-Choice: Teilpunkte (korrekte Auswahlen / Anzahl Optionen)
    let korrekteAuswahlen = 0
    for (const option of frage.optionen) {
      const gewaehlt = gewaehlteIds.has(option.id)
      const sollGewaehlt = option.korrekt
      const richtig = gewaehlt === sollGewaehlt
      if (richtig) korrekteAuswahlen++
      details.push({
        bezeichnung: option.text,
        korrekt: richtig,
        erreicht: richtig ? frage.punkte / frage.optionen.length : 0,
        max: frage.punkte / frage.optionen.length,
        kommentar: richtig ? undefined : (gewaehlt ? 'Falsch angekreuzt' : 'Nicht angekreuzt'),
      })
    }
  }

  const erreicht = details.reduce((s, d) => s + d.erreicht, 0)
  return {
    erreichtePunkte: Math.round(erreicht * 100) / 100,
    maxPunkte: frage.punkte,
    details,
  }
}

// === RICHTIG/FALSCH ===

function korrigiereRichtigFalsch(
  frage: RichtigFalschFrage,
  antwort: Extract<Antwort, { typ: 'richtigfalsch' }>
): KorrekturErgebnis {
  const details: KorrekturDetail[] = []
  const punkteProAussage = frage.punkte / Math.max(1, frage.aussagen.length)

  for (const aussage of frage.aussagen) {
    const bewertung = antwort.bewertungen[aussage.id]
    const korrekt = bewertung === aussage.korrekt
    details.push({
      bezeichnung: aussage.text,
      korrekt,
      erreicht: korrekt ? punkteProAussage : 0,
      max: punkteProAussage,
      kommentar: korrekt ? undefined : `Korrekt wäre: ${aussage.korrekt ? 'Richtig' : 'Falsch'}`,
    })
  }

  const erreicht = details.reduce((s, d) => s + d.erreicht, 0)
  return {
    erreichtePunkte: Math.round(erreicht * 100) / 100,
    maxPunkte: frage.punkte,
    details,
  }
}

// === LÜCKENTEXT ===

function korrigiereLueckentext(
  frage: LueckentextFrage,
  antwort: Extract<Antwort, { typ: 'lueckentext' }>
): KorrekturErgebnis {
  const details: KorrekturDetail[] = []
  const punkteProLuecke = frage.punkte / Math.max(1, frage.luecken.length)

  for (const luecke of frage.luecken) {
    const eingabe = (antwort.eintraege[luecke.id] ?? '').trim()
    const korrekt = luecke.korrekteAntworten.some(ka => {
      if (luecke.caseSensitive) {
        return eingabe === ka.trim()
      }
      return eingabe.toLowerCase() === ka.trim().toLowerCase()
    })
    details.push({
      bezeichnung: `Lücke: ${luecke.korrekteAntworten[0] ?? luecke.id}`,
      korrekt,
      erreicht: korrekt ? punkteProLuecke : 0,
      max: punkteProLuecke,
      kommentar: korrekt ? undefined : `Erwartet: ${luecke.korrekteAntworten.join(' / ')}`,
    })
  }

  const erreicht = details.reduce((s, d) => s + d.erreicht, 0)
  return {
    erreichtePunkte: Math.round(erreicht * 100) / 100,
    maxPunkte: frage.punkte,
    details,
  }
}

// === ZUORDNUNG ===

function korrigiereZuordnung(
  frage: ZuordnungFrage,
  antwort: Extract<Antwort, { typ: 'zuordnung' }>
): KorrekturErgebnis {
  const details: KorrekturDetail[] = []
  const punkteProPaar = frage.punkte / Math.max(1, frage.paare.length)

  for (const paar of frage.paare) {
    const zugeordnet = antwort.zuordnungen[paar.links]
    const korrekt = zugeordnet === paar.rechts
    details.push({
      bezeichnung: `${paar.links} → ${paar.rechts}`,
      korrekt,
      erreicht: korrekt ? punkteProPaar : 0,
      max: punkteProPaar,
      kommentar: korrekt ? undefined : (zugeordnet ? `Zugeordnet: ${zugeordnet}` : 'Nicht zugeordnet'),
    })
  }

  const erreicht = details.reduce((s, d) => s + d.erreicht, 0)
  return {
    erreichtePunkte: Math.round(erreicht * 100) / 100,
    maxPunkte: frage.punkte,
    details,
  }
}

// === BERECHNUNG ===

function korrigiereBerechnung(
  frage: BerechnungFrage,
  antwort: Extract<Antwort, { typ: 'berechnung' }>
): KorrekturErgebnis {
  const details: KorrekturDetail[] = []
  const punkteProErgebnis = frage.punkte / Math.max(1, frage.ergebnisse.length)

  for (const ergebnis of frage.ergebnisse) {
    const eingabeStr = (antwort.ergebnisse[ergebnis.id] ?? '').trim()
    const eingabeNum = parseFloat(eingabeStr.replace(/,/g, '.'))

    let korrekt = false
    if (!isNaN(eingabeNum)) {
      korrekt = Math.abs(eingabeNum - ergebnis.korrekt) <= ergebnis.toleranz
    }

    details.push({
      bezeichnung: ergebnis.label,
      korrekt,
      erreicht: korrekt ? punkteProErgebnis : 0,
      max: punkteProErgebnis,
      kommentar: korrekt ? undefined : `Erwartet: ${ergebnis.korrekt}${ergebnis.einheit ? ' ' + ergebnis.einheit : ''}${ergebnis.toleranz > 0 ? ` (±${ergebnis.toleranz})` : ''}`,
    })
  }

  const erreicht = details.reduce((s, d) => s + d.erreicht, 0)
  return {
    erreichtePunkte: Math.round(erreicht * 100) / 100,
    maxPunkte: frage.punkte,
    details,
  }
}
