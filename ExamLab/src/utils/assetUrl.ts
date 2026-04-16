/**
 * Konvertiert relative Asset-URLs zu absoluten URLs relativ zum App-Base-Path.
 *
 * Hintergrund: In den Daten-Dateien (einrichtungsPruefung.ts etc.) sind URLs als
 * `./materialien/xy.pdf` oder `./demo-bilder/xy.svg` gespeichert. Browser lösen
 * relative URLs relativ zur aktuellen Seite auf. Bei einer SPA-Route wie
 * `/ExamLab/sus/ueben/einrichtung-pruefung` würde `./materialien/xy.pdf` fälschlich
 * zu `/ExamLab/sus/ueben/materialien/xy.pdf` (404) statt `/ExamLab/materialien/xy.pdf`.
 *
 * Diese Funktion verwendet `import.meta.env.BASE_URL` (z.B. `/ExamLab/`) und hängt
 * den relativen Pfad korrekt an. Absolute URLs (http/https/blob/data) werden
 * unverändert zurückgegeben.
 */
export function toAssetUrl(url: string): string {
  if (!url) return ''
  // Absolute URL → unverändert (http, https, blob, data, #, //)
  if (/^([a-z]+:|\/\/|#)/i.test(url)) return url
  const base = import.meta.env.BASE_URL || '/'
  // Leading ./ oder / entfernen, damit keine doppelten Slashes entstehen
  const cleaned = url.replace(/^\.?\//, '')
  return base + cleaned
}
