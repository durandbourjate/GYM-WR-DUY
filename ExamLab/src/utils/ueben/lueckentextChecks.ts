import type { Frage } from '../../types/fragen'
import type { Antwort } from '../../types/antworten'

/**
 * Liefert die Anzahl der noch offenen (leeren) Lücken in einer Lückentext-Antwort.
 * Bei nicht-Lückentext-Fragen oder fehlender Antwort: 0 für nicht-Lückentext,
 * Anzahl-aller-Lücken wenn antwort fehlt aber frage Lückentext ist.
 *
 * Als „leer" zählt: undefined, null, '' oder reiner Whitespace.
 */
export function anzahlOffeneLuecken(frage: Frage, antwort: Antwort | null): number {
  if (frage.typ !== 'lueckentext') return 0
  const luecken = frage.luecken ?? []
  if (luecken.length === 0) return 0
  if (!antwort || antwort.typ !== 'lueckentext') return luecken.length
  const eintraege = antwort.eintraege ?? {}
  return luecken.filter(l => !(eintraege[l.id]?.trim())).length
}

/**
 * True, wenn alle Lücken einer Lückentext-Frage gefüllt sind (oder die Frage
 * kein Lückentext ist — dann gibt es nichts zu prüfen).
 */
export function alleLueckenGefuellt(frage: Frage, antwort: Antwort | null): boolean {
  return anzahlOffeneLuecken(frage, antwort) === 0
}
