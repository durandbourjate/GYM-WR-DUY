import { useState } from 'react'
import type { FrageKomponenteProps } from './index'
import FeedbackBox from './FeedbackBox'

export default function BilanzFrage({ frage, onAntwort, disabled, feedbackSichtbar, korrekt }: FrageKomponenteProps) {
  const kontenMitSaldi = frage.kontenMitSaldi || []
  const bilanzKorrekt = frage.bilanzKorrekt
  const istBilanz = frage.bilanzModus !== 'erfolgsrechnung'
  const linksLabel = istBilanz ? 'Aktiven' : 'Aufwand'
  const rechtsLabel = istBilanz ? 'Passiven' : 'Ertrag'

  const [links, setLinks] = useState<string[]>([])
  const [rechts, setRechts] = useState<string[]>([])
  const [bilanzsumme, setBilanzsumme] = useState('')

  const toggleKonto = (nr: string) => {
    if (disabled) return
    // Konto auf eine Seite zuordnen oder zwischen Seiten wechseln
    if (links.includes(nr)) {
      setLinks(links.filter(n => n !== nr))
      setRechts([...rechts, nr])
    } else if (rechts.includes(nr)) {
      setRechts(rechts.filter(n => n !== nr))
    } else {
      setLinks([...links, nr])
    }
  }

  const getSeite = (nr: string): 'links' | 'rechts' | 'none' => {
    if (links.includes(nr)) return 'links'
    if (rechts.includes(nr)) return 'rechts'
    return 'none'
  }

  const handleAbsenden = () => {
    if (disabled) return
    onAntwort({
      typ: 'bilanz',
      aktiven: links,
      passiven: rechts,
      bilanzsumme: parseFloat(bilanzsumme) || 0,
    })
  }

  const alleZugeordnet = kontenMitSaldi.every(k => links.includes(k.nr) || rechts.includes(k.nr))

  return (
    <div className="space-y-4">
      {/* Konten-Liste zum Zuordnen */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Klicke auf ein Konto: 1× = {linksLabel}, 2× = {rechtsLabel}, 3× = entfernen
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {kontenMitSaldi.map((k) => {
            const seite = getSeite(k.nr)
            const korrektSeite = feedbackSichtbar && bilanzKorrekt
              ? (bilanzKorrekt.aktiven.includes(k.nr) ? 'links' : bilanzKorrekt.passiven.includes(k.nr) ? 'rechts' : null)
              : null
            const istRichtig = feedbackSichtbar && korrektSeite === seite

            return (
              <button
                key={k.nr}
                onClick={() => toggleKonto(k.nr)}
                disabled={disabled}
                className={`p-3 rounded-lg border-2 text-left text-sm min-h-[48px] flex justify-between items-center transition-colors
                  ${seite === 'links' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30' : ''}
                  ${seite === 'rechts' ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/30' : ''}
                  ${seite === 'none' ? 'border-gray-200 dark:border-gray-600' : ''}
                  ${feedbackSichtbar && istRichtig ? 'ring-2 ring-green-400' : ''}
                  ${feedbackSichtbar && !istRichtig && seite !== 'none' ? 'ring-2 ring-red-400' : ''}
                  ${disabled ? 'cursor-default' : 'cursor-pointer hover:border-gray-400'}
                `}
              >
                <span className="dark:text-white">
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400 mr-2">{k.nr}</span>
                  {k.name}
                </span>
                <span className="font-mono text-sm dark:text-white">{k.saldo.toLocaleString('de-CH')}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Legende */}
      <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-400 inline-block" /> {linksLabel}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-orange-400 inline-block" /> {rechtsLabel}
        </span>
      </div>

      {/* Bilanzsumme */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {istBilanz ? 'Bilanzsumme' : 'Total'}:
        </label>
        <input
          type="number"
          value={bilanzsumme}
          onChange={(e) => setBilanzsumme(e.target.value)}
          disabled={disabled}
          placeholder="CHF"
          className={`w-32 p-2 rounded-lg border text-sm text-right min-h-[44px] dark:bg-gray-800 dark:text-white
            ${feedbackSichtbar && bilanzKorrekt
              ? (parseFloat(bilanzsumme) === bilanzKorrekt.bilanzsumme ? 'border-green-400 ring-2 ring-green-400' : 'border-red-400 ring-2 ring-red-400')
              : 'border-gray-300 dark:border-gray-600'}
          `}
        />
      </div>

      {!disabled && alleZugeordnet && bilanzsumme && !feedbackSichtbar && (
        <button onClick={handleAbsenden} className="w-full bg-blue-500 text-white rounded-xl py-3 font-medium min-h-[48px]">
          Pruefen
        </button>
      )}

      {feedbackSichtbar && korrekt !== null && <FeedbackBox korrekt={korrekt} erklaerung={frage.erklaerung} />}
    </div>
  )
}
