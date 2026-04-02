import { useUebungsStore } from '../store/uebungsStore'
import { berechneSterne, sterneText } from '../utils/gamification'

interface Props {
  onZurueck: () => void
  onNochmal: () => void
}

export default function Zusammenfassung({ onZurueck, onNochmal }: Props) {
  const { session, berechneErgebnis } = useUebungsStore()
  if (!session) return null

  const ergebnis = berechneErgebnis()
  const quoteGerundet = Math.round(ergebnis.quote)
  const sterne = berechneSterne(quoteGerundet)

  const motivationsText = quoteGerundet >= 80
    ? 'Hervorragend!'
    : quoteGerundet >= 60
    ? 'Gut gemacht!'
    : quoteGerundet >= 40
    ? 'Weiter ueben, du wirst besser!'
    : 'Nicht aufgeben, uebung macht den Meister!'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        {/* Sterne */}
        <div className="text-4xl mb-2 tracking-widest">
          {sterneText(sterne)}
        </div>

        <h2 className="text-2xl font-bold mb-1 dark:text-white">
          {ergebnis.richtig} von {ergebnis.anzahlFragen} richtig
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-4">{motivationsText}</p>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div
            className={`h-3 rounded-full transition-all ${quoteGerundet >= 80 ? 'bg-green-500' : quoteGerundet >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${quoteGerundet}%` }}
          />
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {session.fach} — {session.thema}
        </p>

        {/* Detail-Liste */}
        <div className="text-left space-y-2 mb-6">
          {ergebnis.details.map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className={`mt-0.5 flex-shrink-0 ${d.korrekt ? 'text-green-500' : 'text-red-500'}`}>
                {d.korrekt ? '✓' : '✗'}
              </span>
              <span className="dark:text-gray-300">{d.frage}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <button
            onClick={onNochmal}
            className="w-full bg-blue-500 text-white rounded-xl py-3 font-medium min-h-[48px] text-base"
          >
            Nochmal ueben
          </button>
          <button
            onClick={onZurueck}
            className="w-full bg-gray-100 dark:bg-gray-700 dark:text-white rounded-xl py-3 font-medium min-h-[48px] text-base"
          >
            Zurueck zum Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
