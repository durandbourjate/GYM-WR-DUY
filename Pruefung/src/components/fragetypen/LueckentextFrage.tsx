import { usePruefungStore } from '../../store/pruefungStore.ts'
import type { LueckentextFrage as LueckentextFrageType } from '../../types/fragen.ts'
import { renderMarkdown } from '../../utils/markdown.ts'
import { fachbereichFarbe } from '../FragenNavigation.tsx'

interface Props {
  frage: LueckentextFrageType
}

export default function LueckentextFrage({ frage }: Props) {
  const antworten = usePruefungStore((s) => s.antworten)
  const setAntwort = usePruefungStore((s) => s.setAntwort)
  const abgegeben = usePruefungStore((s) => s.abgegeben)

  const aktuelleAntwort = antworten[frage.id]
  const eintraege: Record<string, string> =
    aktuelleAntwort?.typ === 'lueckentext' ? aktuelleAntwort.eintraege : {}

  function handleChange(lueckenId: string, wert: string) {
    if (abgegeben) return
    const neueEintraege = { ...eintraege, [lueckenId]: wert }
    setAntwort(frage.id, { typ: 'lueckentext', eintraege: neueEintraege })
  }

  // Text mit Lücken rendern
  const teile = frage.textMitLuecken.split(/(\{\{\d+\}\})/)

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${fachbereichFarbe(frage.fachbereich)}`}>
          {frage.fachbereich}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {frage.bloom}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {frage.punkte} {frage.punkte === 1 ? 'Punkt' : 'Punkte'}
        </span>
      </div>

      {/* Fragetext */}
      <div
        className="text-base leading-relaxed text-slate-800 dark:text-slate-200"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(frage.fragetext) }}
      />

      {/* Text mit Inline-Inputs */}
      <div className="text-base leading-loose text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        {teile.map((teil, i) => {
          const match = teil.match(/^\{\{(\d+)\}\}$/)
          if (match) {
            const lueckenId = match[1]
            const wert = eintraege[lueckenId] ?? ''
            return (
              <input
                key={i}
                type="text"
                value={wert}
                onChange={(e) => handleChange(lueckenId, e.target.value)}
                disabled={abgegeben}
                placeholder={`Lücke ${lueckenId}`}
                className={`inline-block mx-1 px-3 py-1 w-48 text-base border-b-2 bg-transparent outline-none transition-colors
                  ${abgegeben
                    ? 'border-slate-300 dark:border-slate-600 opacity-75'
                    : wert
                      ? 'border-blue-500 dark:border-blue-400'
                      : 'border-slate-400 dark:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400'
                  }
                `}
              />
            )
          }
          // Normaler Text — via dangerouslySetInnerHTML weil er Markdown enthalten kann
          return <span key={i} dangerouslySetInnerHTML={{ __html: renderMarkdown(teil) }} />
        })}
      </div>
    </div>
  )
}
