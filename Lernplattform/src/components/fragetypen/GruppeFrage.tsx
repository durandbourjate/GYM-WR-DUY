import { useState } from 'react'
import type { FrageKomponenteProps } from './index'
import type { AntwortTyp } from '../../types/fragen'
import { FRAGETYP_KOMPONENTEN } from './index'
import FeedbackBox from './FeedbackBox'

export default function GruppeFrage({ frage, onAntwort, disabled, feedbackSichtbar, korrekt }: FrageKomponenteProps) {
  const teil = frage.teil || []
  const [teilAntworten, setTeilAntworten] = useState<Record<string, AntwortTyp>>({})

  const handleTeilAntwort = (sub: string, antwort: AntwortTyp) => {
    const neu = { ...teilAntworten, [sub]: antwort }
    setTeilAntworten(neu)
    // Gesamtantwort senden wenn alle Teile beantwortet
    if (Object.keys(neu).length === teil.length) {
      onAntwort({ typ: 'gruppe', teilAntworten: neu })
    }
  }

  return (
    <div className="space-y-4">
      {/* Kontext-Block */}
      {frage.kontext && (
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 italic">
          {frage.kontext}
        </div>
      )}

      {/* Teil-Fragen */}
      {teil.map((t) => {
        const Komponente = FRAGETYP_KOMPONENTEN[t.type]
        if (!Komponente) {
          return (
            <div key={t.sub} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-700 dark:text-amber-300">
              Fragetyp &quot;{t.type}&quot; wird noch nicht unterstuetzt.
            </div>
          )
        }

        // Teil als Pseudo-Frage aufbereiten
        const teilFrage = {
          id: `${frage.id}-${t.sub}`,
          fach: frage.fach,
          thema: frage.thema,
          typ: t.type,
          schwierigkeit: frage.schwierigkeit,
          frage: t.q,
          erklaerung: t.explain,
          uebung: frage.uebung,
          pruefungstauglich: frage.pruefungstauglich,
          // MC/Multi: options → optionen/korrekt
          optionen: t.options?.map(o => o.t),
          korrekt: t.options && t.correct
            ? (Array.isArray(t.correct)
              ? (t.correct as string[]).map(v => t.options!.find(o => o.v === v)?.t || v)
              : t.options.find(o => o.v === t.correct)?.t || t.correct)
            : t.correct,
          // TF
          aussagen: t.aussagen,
          // Fill
          luecken: t.blanks?.map((b, i) => ({ id: String(i), korrekt: b.answer, optionen: b.alts })),
          // Calc
          ...(t.rows ? { korrekt: String(t.rows[0].answer), toleranz: t.rows[0].tolerance, einheit: t.rows[0].unit } : {}),
          // FiBu
          konten: t.konten,
          buchungssatzKorrekt: t.type === 'buchungssatz' ? t.correct as unknown as import('../../types/fragen').BuchungssatzZeile[] : undefined,
        } as import('../../types/fragen').Frage

        const teilKorrekt = feedbackSichtbar ? (teilAntworten[t.sub] ? true : null) : null

        return (
          <div key={t.sub} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold flex items-center justify-center">
                {t.sub}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {t.type}
              </span>
            </div>
            <p className="text-base font-medium dark:text-white mb-2">{t.q}</p>
            <Komponente
              frage={teilFrage}
              onAntwort={(a) => handleTeilAntwort(t.sub, a)}
              disabled={disabled}
              feedbackSichtbar={feedbackSichtbar}
              korrekt={teilKorrekt}
            />
          </div>
        )
      })}

      {feedbackSichtbar && korrekt !== null && <FeedbackBox korrekt={korrekt} erklaerung={frage.erklaerung} />}
    </div>
  )
}
