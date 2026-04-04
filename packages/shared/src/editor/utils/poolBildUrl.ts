/**
 * Löst relative Pool-Bild-Pfade (img/...) zu absoluten GitHub-Pages-URLs auf.
 * Pool-importierte Fragen speichern Bilder oft als relative Pfade.
 */
const POOL_IMG_BASE_URL = 'https://durandbourjate.github.io/GYM-WR-DUY/Uebungen/Uebungspools/'

/**
 * Prüft ob eine URL relativ ist (Pool-Bild) und löst sie ggf. auf.
 * Absolute URLs (https://, data:, blob:) werden unverändert zurückgegeben.
 */
export function resolvePoolBildUrl(url: string): string {
  if (!url) return url
  // Bereits absolut
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }
  // Relative Pool-Pfade (img/... oder pool-bilder/...)
  if (url.startsWith('img/') || url.startsWith('pool-bilder/')) {
    return POOL_IMG_BASE_URL + url
  }
  // Sonstige relative Pfade — auch auflösen
  return POOL_IMG_BASE_URL + url
}
