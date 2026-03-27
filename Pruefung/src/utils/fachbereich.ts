/** Fachbereich-Badge-Farben (Tailwind-Klassen) */
export function fachbereichFarbe(fachbereich: string): string {
  switch (fachbereich) {
    case 'VWL': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    case 'BWL': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'Recht': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'Informatik': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
  }
}

/** WR-Fachbereiche die als Badge angezeigt werden sollen */
const WR_FACHBEREICHE = new Set(['VWL', 'BWL', 'Recht'])

/** Prüft ob ein Fachbereich als Badge angezeigt werden soll (nur WR-spezifische) */
export function zeigeFachbereichBadge(fachbereich: string): boolean {
  return WR_FACHBEREICHE.has(fachbereich)
}

/** Prüft ob Fachbereich für die gegebene Fachschaft relevant ist (WR = VWL/BWL/Recht) */
export function istWRFachschaft(fachschaft?: string): boolean {
  return fachschaft === 'WR'
}

/** Standard-Fachbereich für eine Fachschaft */
export function defaultFachbereich(fachschaft?: string): import('../types/fragen').Fachbereich {
  if (fachschaft === 'WR') return 'VWL'
  if (fachschaft === 'IN' || fachschaft === 'Informatik') return 'Informatik'
  return 'Allgemein'
}

/** Menschenlesbares Label fuer Fragetypen */
export function typLabel(typ: string): string {
  switch (typ) {
    case 'mc': return 'Multiple Choice'
    case 'freitext': return 'Freitext'
    case 'lueckentext': return 'Lückentext'
    case 'zuordnung': return 'Zuordnung'
    case 'richtigfalsch': return 'Richtig/Falsch'
    case 'berechnung': return 'Berechnung'
    case 'buchungssatz': return 'Buchungssatz'
    case 'tkonto': return 'T-Konto'
    case 'kontenbestimmung': return 'Kontenbestimmung'
    case 'bilanzstruktur': return 'Bilanz/ER'
    case 'aufgabengruppe': return 'Aufgabengruppe'
    case 'visualisierung': return 'Zeichnen'
    case 'pdf': return 'PDF-Annotation'
    default: return typ
  }
}

/** Bloom-Stufen-Label */
export function bloomLabel(stufe: string): string {
  switch (stufe) {
    case 'K1': return 'Wissen'
    case 'K2': return 'Verstehen'
    case 'K3': return 'Anwenden'
    case 'K4': return 'Analysieren'
    case 'K5': return 'Beurteilen'
    case 'K6': return 'Erschaffen'
    default: return ''
  }
}
