/** Ersetzt {0}, {1} etc. Platzhalter im Fragetext durch Lückenstriche */
export function bereinigePlatzhalter(text: string): string {
  if (!text) return text
  return text.replace(/\{(\d+)\}/g, '___')
}
