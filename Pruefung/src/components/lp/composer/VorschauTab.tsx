import type { PruefungsConfig } from '../../../types/pruefung.ts'
import type { Frage, MCFrage, FreitextFrage, LueckentextFrage, ZuordnungFrage, RichtigFalschFrage, BerechnungFrage } from '../../../types/fragen.ts'
import { formatDatum } from '../../../utils/zeit.ts'
import { typLabel, fachbereichFarbe } from '../../../utils/fachbereich.ts'

interface Props {
  pruefung: PruefungsConfig
  fragenMap: Record<string, Frage>
  onSuSVorschau: () => void
}

export default function VorschauTab({ pruefung, fragenMap, onSuSVorschau }: Props) {
  const gesamtFragen = pruefung.abschnitte.reduce((s, a) => s + a.fragenIds.length, 0)

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Kompakte Metadaten-Zeile */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-3">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">
            {pruefung.titel || '(Kein Titel)'}
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {pruefung.klasse || '(Keine Klasse)'} · {formatDatum(pruefung.datum)}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
          <span>{pruefung.dauerMinuten} Min.</span>
          <span>{gesamtFragen} Fragen</span>
          <span>{pruefung.gesamtpunkte} Pkt.</span>
          {pruefung.id && (
            <button
              onClick={onSuSVorschau}
              disabled={gesamtFragen === 0}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Interaktive Vorschau
            </button>
          )}
        </div>
      </div>

      {/* Prüfungs-ID & URL */}
      {pruefung.id && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-3">
          <div className="flex items-center gap-6 text-xs text-slate-400 dark:text-slate-500">
            <span>
              ID: <code className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">{pruefung.id}</code>
            </span>
            <span className="truncate">
              URL: <code className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                {window.location.origin + window.location.pathname}?id={pruefung.id}
              </code>
            </span>
          </div>
        </div>
      )}

      {/* SuS-Vorschau der Fragen */}
      {gesamtFragen === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 dark:text-slate-500">
            Fügen Sie zuerst Fragen hinzu, um die Vorschau zu sehen.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pruefung.abschnitte.map((abschnitt, aIndex) => (
            <div key={aIndex}>
              {/* Abschnitt-Header */}
              {pruefung.abschnitte.length > 1 && (
                <div className="mb-2 mt-4 first:mt-0">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {abschnitt.titel}
                  </h3>
                  {abschnitt.beschreibung && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {abschnitt.beschreibung}
                    </p>
                  )}
                </div>
              )}

              {/* Fragen */}
              {abschnitt.fragenIds.map((frageId, fIndex) => {
                const frage = fragenMap[frageId]
                if (!frage) {
                  return (
                    <div key={frageId} className="px-5 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                      Frage nicht gefunden: {frageId}
                    </div>
                  )
                }

                // Laufende Nummer über alle Abschnitte
                const vorherigeFragen = pruefung.abschnitte
                  .slice(0, aIndex)
                  .reduce((s, a) => s + a.fragenIds.length, 0)
                const frageNr = vorherigeFragen + fIndex + 1

                return (
                  <FrageVorschau key={frageId} frage={frage} nummer={frageNr} />
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Hinweise */}
      {gesamtFragen > 0 && (
        <div className="text-xs text-slate-400 dark:text-slate-500 space-y-0.5 pt-2">
          {pruefung.ruecknavigation && <p>Alle Fragen können in beliebiger Reihenfolge beantwortet werden.</p>}
          <p>Antworten werden automatisch gespeichert.</p>
          {pruefung.sebErforderlich && <p className="text-amber-600 dark:text-amber-400">SEB erforderlich</p>}
        </div>
      )}
    </div>
  )
}

/** Read-only Vorschau einer einzelnen Frage wie SuS sie sehen */
function FrageVorschau({ frage, nummer }: { frage: Frage; nummer: number }) {
  const fragetext = 'fragetext' in frage ? (frage as { fragetext: string }).fragetext : ''

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
          Frage {nummer}
        </span>
        <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${fachbereichFarbe(frage.fachbereich)}`}>
          {frage.fachbereich}
        </span>
        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300">
          {typLabel(frage.typ)}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          {frage.punkte} {frage.punkte === 1 ? 'Punkt' : 'Punkte'}
        </span>
      </div>

      {/* Fragetext */}
      {fragetext && (
        <div className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap mb-3 leading-relaxed">
          {formatFragetext(fragetext)}
        </div>
      )}

      {/* Typ-spezifische Vorschau */}
      {frage.typ === 'mc' && <MCVorschau frage={frage as MCFrage} />}
      {frage.typ === 'freitext' && <FreitextVorschau frage={frage as FreitextFrage} />}
      {frage.typ === 'lueckentext' && <LueckentextVorschau frage={frage as LueckentextFrage} />}
      {frage.typ === 'zuordnung' && <ZuordnungVorschau frage={frage as ZuordnungFrage} />}
      {frage.typ === 'richtigfalsch' && <RichtigFalschVorschau frage={frage as RichtigFalschFrage} />}
      {frage.typ === 'berechnung' && <BerechnungVorschau frage={frage as BerechnungFrage} />}
    </div>
  )
}

/** Einfache Markdown-Bereinigung für Vorschau (kein dangerouslySetInnerHTML) */
function formatFragetext(text: string): string {
  return text.replace(/\*\*/g, '').replace(/\*/g, '')
}

function MCVorschau({ frage }: { frage: MCFrage }) {
  return (
    <div className="space-y-1.5">
      {frage.optionen.map((option) => (
        <div
          key={option.id}
          className="flex items-start gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg"
        >
          <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-500 shrink-0" />
          <span className="text-sm text-slate-700 dark:text-slate-200">{option.text}</span>
        </div>
      ))}
      {frage.mehrfachauswahl && (
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Mehrere Antworten möglich</p>
      )}
    </div>
  )
}

function FreitextVorschau({ frage }: { frage: FreitextFrage }) {
  const zeilen = frage.laenge === 'kurz' ? 2 : frage.laenge === 'lang' ? 8 : 4
  return (
    <div
      className="w-full border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700/30 px-3 py-2 text-sm text-slate-400 dark:text-slate-500"
      style={{ minHeight: `${zeilen * 1.5}rem` }}
    >
      {frage.hilfstextPlaceholder || 'Antwort eingeben...'}
    </div>
  )
}

function LueckentextVorschau({ frage }: { frage: LueckentextFrage }) {
  // Lücken als unterstrichene Felder anzeigen
  const teile = frage.textMitLuecken.split(/(\{\{\d+\}\})/)
  return (
    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
      {teile.map((teil, i) => {
        if (/^\{\{\d+\}\}$/.test(teil)) {
          return (
            <span key={i} className="inline-block w-24 mx-0.5 border-b-2 border-slate-400 dark:border-slate-500 text-center text-slate-400 dark:text-slate-500 text-xs">
              ...
            </span>
          )
        }
        return <span key={i}>{teil}</span>
      })}
    </p>
  )
}

function ZuordnungVorschau({ frage }: { frage: ZuordnungFrage }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1.5">
        {frage.paare.map((p, i) => (
          <div key={`l-${i}`} className="px-3 py-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-sm text-slate-700 dark:text-slate-200">
            {p.links}
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        {/* Rechte Seite gemischt (in Vorschau einfach in Reihenfolge) */}
        {frage.paare.map((p, i) => (
          <div key={`r-${i}`} className="px-3 py-2 bg-slate-100 dark:bg-slate-600/30 rounded-lg text-sm text-slate-700 dark:text-slate-200 border border-dashed border-slate-300 dark:border-slate-500">
            {p.rechts}
          </div>
        ))}
      </div>
    </div>
  )
}

function RichtigFalschVorschau({ frage }: { frage: RichtigFalschFrage }) {
  return (
    <div className="space-y-1.5">
      {frage.aussagen.map((aussage) => (
        <div key={aussage.id} className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
          <span className="text-sm text-slate-700 dark:text-slate-200 flex-1">{aussage.text}</span>
          <div className="flex gap-2 shrink-0">
            <span className="px-2 py-0.5 text-xs border border-slate-300 dark:border-slate-500 rounded text-slate-500 dark:text-slate-400">R</span>
            <span className="px-2 py-0.5 text-xs border border-slate-300 dark:border-slate-500 rounded text-slate-500 dark:text-slate-400">F</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function BerechnungVorschau({ frage }: { frage: BerechnungFrage }) {
  return (
    <div className="space-y-2">
      {frage.ergebnisse.map((erg) => (
        <div key={erg.id} className="flex items-center gap-2">
          <span className="text-sm text-slate-700 dark:text-slate-200">{erg.label}:</span>
          <div className="w-32 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700/30 px-3 py-1.5 text-sm text-slate-400 dark:text-slate-500">
            ...
          </div>
          {erg.einheit && (
            <span className="text-sm text-slate-500 dark:text-slate-400">{erg.einheit}</span>
          )}
        </div>
      ))}
      {frage.rechenwegErforderlich && (
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Rechenweg:</p>
          <div className="w-full border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700/30 px-3 py-2 text-sm text-slate-400 dark:text-slate-500" style={{ minHeight: '4rem' }}>
            Rechenweg hier eingeben...
          </div>
        </div>
      )}
    </div>
  )
}
