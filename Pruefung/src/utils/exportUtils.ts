import type { PruefungsKorrektur } from '../types/korrektur.ts'
import type { Frage } from '../types/fragen.ts'
import type { SchuelerStatus } from '../types/monitoring.ts'
import type { PruefungsConfig } from '../types/pruefung.ts'
import { effektivePunkte, berechneNote } from './korrekturUtils.ts'

/**
 * Exportiert Korrektur-Daten als CSV (Semikolon-getrennt, UTF-8 BOM für Excel).
 * Spalten: Name; E-Mail; [Frage-IDs mit Max-Punkten]; Total; Max; Note
 */
export function exportiereAlsCSV(korrektur: PruefungsKorrektur, fragen: Frage[]): string {
  if (korrektur.schueler.length === 0) return ''

  // Alle Frage-IDs aus den Bewertungen sammeln (konsistente Reihenfolge)
  const frageIds = ermittleFrageIds(korrektur)

  // Fragen-Map für Titel-Lookup
  const fragenMap = new Map(fragen.map((f) => [f.id, f]))

  // Header-Zeile: Name; E-Mail; Frage1 (max X); Frage2 (max Y); ...; Total; Max; Note
  const header = [
    'Name',
    'E-Mail',
    ...frageIds.map((id) => {
      const frage = fragenMap.get(id)
      const maxPkt = korrektur.schueler[0]?.bewertungen[id]?.maxPunkte ?? frage?.punkte ?? 0
      return `${id} (max ${maxPkt})`
    }),
    'Total',
    'Max',
    'Note',
  ]

  // Daten-Zeilen
  const zeilen = korrektur.schueler.map((schueler) => {
    const punkteProFrage = frageIds.map((id) => {
      const bewertung = schueler.bewertungen[id]
      return bewertung ? String(effektivePunkte(bewertung)) : '0'
    })

    const total = frageIds.reduce((sum, id) => {
      const bewertung = schueler.bewertungen[id]
      return sum + (bewertung ? effektivePunkte(bewertung) : 0)
    }, 0)

    const maxPunkte = frageIds.reduce((sum, id) => {
      const bewertung = schueler.bewertungen[id]
      return sum + (bewertung?.maxPunkte ?? 0)
    }, 0)

    const note = berechneNote(total, maxPunkte)

    return [
      escapeCSV(schueler.name),
      escapeCSV(schueler.email),
      ...punkteProFrage,
      String(total),
      String(maxPunkte),
      String(note),
    ]
  })

  // CSV zusammenbauen (Semikolon als Trennzeichen, europäischer Standard)
  const csvZeilen = [header.join(';'), ...zeilen.map((z) => z.join(';'))]
  return csvZeilen.join('\n')
}

/**
 * Löst einen CSV-Download im Browser aus.
 * Fügt UTF-8 BOM hinzu für korrekte Excel-Darstellung.
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()

  // Cleanup
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** Alle eindeutigen Frage-IDs aus den Bewertungen ermitteln (stabile Reihenfolge) */
function ermittleFrageIds(korrektur: PruefungsKorrektur): string[] {
  const ids = new Set<string>()
  for (const schueler of korrektur.schueler) {
    for (const id of Object.keys(schueler.bewertungen)) {
      ids.add(id)
    }
  }
  return Array.from(ids)
}

/**
 * Exportiert Teilnahme-Übersicht als CSV (für BeendetPhase, vor der Korrektur).
 * Spalten: Name; E-Mail; Klasse; Status; Startzeit; Abgabezeit; Beantwortet; Gesamt; Unterbrechungen
 */
export function exportiereTeilnahmeCSV(
  config: PruefungsConfig,
  schuelerStatus: SchuelerStatus[],
): string {
  if (schuelerStatus.length === 0) return ''

  const header = [
    'Name',
    'E-Mail',
    'Klasse',
    'Status',
    'Startzeit',
    'Abgabezeit',
    'Beantwortet',
    'Gesamt',
    'Unterbrechungen',
  ]

  const statusLabel: Record<string, string> = {
    'aktiv': 'Aktiv',
    'inaktiv': 'Inaktiv',
    'abgegeben': 'Abgegeben',
    'nicht-gestartet': 'Nicht erschienen',
    'beendet-lp': 'Erzwungen beendet',
  }

  const formatZeit = (iso: string | null): string => {
    if (!iso) return ''
    try {
      return new Date(iso).toLocaleString('de-CH', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return iso
    }
  }

  const zeilen = schuelerStatus
    .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email))
    .map((s) => [
      escapeCSV(s.name || ''),
      escapeCSV(s.email),
      escapeCSV(s.klasse || ''),
      statusLabel[s.status] || s.status,
      formatZeit(s.startzeit),
      formatZeit(s.abgabezeit),
      String(s.beantworteteFragen),
      String(s.gesamtFragen),
      String(s.unterbrechungen?.length ?? 0),
    ])

  const titelZeile = `Prüfung: ${escapeCSV(config.titel || config.id)}`
  const csvZeilen = [titelZeile, header.join(';'), ...zeilen.map((z) => z.join(';'))]
  return csvZeilen.join('\n')
}

/** CSV-Feld escapen: Semikolon, Anführungszeichen, Zeilenumbrüche */
function escapeCSV(wert: string): string {
  if (wert.includes(';') || wert.includes('"') || wert.includes('\n')) {
    return `"${wert.replace(/"/g, '""')}"`
  }
  return wert
}
