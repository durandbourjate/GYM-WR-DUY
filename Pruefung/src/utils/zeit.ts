/** Formatiert ein Datum-String (z.B. "2026-04-01") als "Mi 01. April 2026" */
export function formatDatum(datumStr: string): string {
  const d = new Date(datumStr + 'T00:00:00')
  if (isNaN(d.getTime())) return datumStr
  return new Intl.DateTimeFormat('de-CH', {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/** Formatiert Sekunden als MM:SS */
export function formatZeit(sekunden: number): string {
  const min = Math.floor(Math.abs(sekunden) / 60)
  const sec = Math.abs(sekunden) % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

/** Formatiert einen ISO-Timestamp als HH:MM */
export function formatUhrzeit(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** Berechnet verbleibende Sekunden ab Startzeit + Dauer */
export function berechneRestzeit(startzeit: string, dauerMinuten: number): number {
  const start = new Date(startzeit).getTime()
  const ende = start + dauerMinuten * 60 * 1000
  const jetzt = Date.now()
  return Math.max(0, Math.floor((ende - jetzt) / 1000))
}
