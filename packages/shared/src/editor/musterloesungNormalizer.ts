/**
 * C9 Phase 3 Task 23 — Normalizer für `generiereMusterloesung`-Responses.
 *
 * Backend (apps-script-code.js `case 'generiereMusterloesung'`) liefert seit Task 22
 * `{musterloesung, teilerklaerungen[]}`. Während des Roll-Outs kann es Zustände geben
 * wo Frontend (neue Version) + Apps-Script (alte Deployment) auseinanderlaufen oder
 * wo Claude-Responses durchschlagen ohne Backend-Normalizer zu durchlaufen. Dieser
 * Client-Seite-Normalizer fängt das strukturell ab, damit Editor-UI nie crasht.
 *
 * Defensive Szenarien (alle → sauberer Fallback-Return):
 *  - `raw === null` / `undefined` → leere Antwort
 *  - `raw` ist Array oder String statt Objekt → leere Antwort
 *  - `musterloesung` fehlt → Legacy `musterlosung` (Tippo) prüfen, sonst ''
 *  - `teilerklaerungen` fehlt oder ist kein Array → []
 *  - Teilerklärungs-Einträge ohne/leere `feld`/`id`/`text` → gefiltert
 */

export type MusterloesungsFeld =
  | 'optionen'
  | 'aussagen'
  | 'paare'
  | 'luecken'
  | 'bereiche'
  | 'zielzonen'
  | 'beschriftungen'
  | 'aufgaben'
  | 'buchungen'
  | 'kontenMitSaldi'

export interface MusterloesungsTeilerklaerung {
  feld: MusterloesungsFeld
  id: string
  text: string
}

export interface MusterloesungsAntwort {
  /** Didaktische Gesamterklärung (2-4 Sätze). */
  musterloesung: string
  /**
   * Pro-Sub-Element-Erklärungen. Leer bei Fragetypen ohne Sub-Struktur
   * (Freitext, Berechnung, Zeichnen, TKonto, Sortierung, …).
   */
  teilerklaerungen: MusterloesungsTeilerklaerung[]
}

const GUELTIGE_FELDER: ReadonlySet<string> = new Set<MusterloesungsFeld>([
  'optionen',
  'aussagen',
  'paare',
  'luecken',
  'bereiche',
  'zielzonen',
  'beschriftungen',
  'aufgaben',
  'buchungen',
  'kontenMitSaldi',
])

function istNichtLeererString(wert: unknown): wert is string {
  return typeof wert === 'string' && wert.length > 0
}

function istTeilerklaerung(wert: unknown): wert is MusterloesungsTeilerklaerung {
  if (!wert || typeof wert !== 'object') return false
  const w = wert as Record<string, unknown>
  return (
    istNichtLeererString(w.feld) &&
    GUELTIGE_FELDER.has(w.feld) &&
    istNichtLeererString(w.id) &&
    istNichtLeererString(w.text)
  )
}

/**
 * Normalisiert eine rohe KI-Response aus `services.kiAssistent('generiereMusterloesung', …)`.
 * Gibt IMMER eine valide `MusterloesungsAntwort` zurück — auch bei null/undefined/Müll-Input.
 */
export function normalisiereMusterloesungsAntwort(raw: unknown): MusterloesungsAntwort {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { musterloesung: '', teilerklaerungen: [] }
  }

  const obj = raw as Record<string, unknown>

  // Musterlösung: `musterloesung` (korrekt) hat Vorrang vor `musterlosung` (Legacy-Tippo).
  let musterloesung = ''
  if (istNichtLeererString(obj.musterloesung)) {
    musterloesung = obj.musterloesung
  } else if (istNichtLeererString(obj.musterlosung)) {
    musterloesung = obj.musterlosung
  }

  // Teilerklärungen: nur valide Einträge mit feld/id/text durchlassen, Rest droppen.
  let teilerklaerungen: MusterloesungsTeilerklaerung[] = []
  if (Array.isArray(obj.teilerklaerungen)) {
    teilerklaerungen = obj.teilerklaerungen.filter(istTeilerklaerung)
  }

  return { musterloesung, teilerklaerungen }
}
