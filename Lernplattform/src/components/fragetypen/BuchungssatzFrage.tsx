import { useState } from 'react'
import type { FrageKomponenteProps } from './index'
import type { BuchungssatzZeile } from '../../types/fragen'
import FeedbackBox from './FeedbackBox'
import KontenSelect from './shared/KontenSelect'

interface Zeile {
  soll: string
  haben: string
  betrag: string
}

export default function BuchungssatzFrage({ frage, onAntwort, disabled, feedbackSichtbar, korrekt }: FrageKomponenteProps) {
  const konten = frage.konten || []
  const anzahlKorrekt = frage.buchungssatzKorrekt?.length || 1

  const [zeilen, setZeilen] = useState<Zeile[]>(
    Array.from({ length: anzahlKorrekt }, () => ({ soll: '', haben: '', betrag: '' }))
  )

  const updateZeile = (index: number, feld: keyof Zeile, wert: string) => {
    if (disabled) return
    const neu = [...zeilen]
    neu[index] = { ...neu[index], [feld]: wert }
    setZeilen(neu)
  }

  const zeileHinzufuegen = () => {
    if (disabled) return
    setZeilen([...zeilen, { soll: '', haben: '', betrag: '' }])
  }

  const zeileEntfernen = (index: number) => {
    if (disabled || zeilen.length <= 1) return
    setZeilen(zeilen.filter((_, i) => i !== index))
  }

  const istVollstaendig = zeilen.some(z => z.soll && z.haben && z.betrag)

  const handleAbsenden = () => {
    if (!istVollstaendig || disabled) return
    const antwortZeilen: BuchungssatzZeile[] = zeilen
      .filter(z => z.soll && z.haben && z.betrag)
      .map(z => ({ soll: z.soll, haben: z.haben, betrag: parseFloat(z.betrag) || 0 }))
    onAntwort({ typ: 'buchungssatz', zeilen: antwortZeilen })
  }

  const korrekteDaten = frage.buchungssatzKorrekt || []

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid grid-cols-[1fr_auto_1fr_100px_auto] gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-1">
        <span>Soll</span>
        <span></span>
        <span>Haben</span>
        <span>Betrag</span>
        <span></span>
      </div>

      {/* Zeilen */}
      {zeilen.map((z, i) => {
        const korrZ = feedbackSichtbar && korrekteDaten[i]
        const sollOk = korrZ && z.soll === korrZ.soll
        const habenOk = korrZ && z.haben === korrZ.haben
        const betragOk = korrZ && Math.abs(parseFloat(z.betrag) - korrZ.betrag) < 0.01

        return (
          <div key={i} className="grid grid-cols-[1fr_auto_1fr_100px_auto] gap-2 items-center">
            <div className={feedbackSichtbar ? (sollOk ? 'ring-2 ring-green-400 rounded-lg' : 'ring-2 ring-red-400 rounded-lg') : ''}>
              <KontenSelect konten={konten} value={z.soll} onChange={(v) => updateZeile(i, 'soll', v)} disabled={disabled} placeholder="Soll" />
            </div>
            <span className="text-gray-400 text-sm text-center">an</span>
            <div className={feedbackSichtbar ? (habenOk ? 'ring-2 ring-green-400 rounded-lg' : 'ring-2 ring-red-400 rounded-lg') : ''}>
              <KontenSelect konten={konten} value={z.haben} onChange={(v) => updateZeile(i, 'haben', v)} disabled={disabled} placeholder="Haben" />
            </div>
            <input
              type="number"
              value={z.betrag}
              onChange={(e) => updateZeile(i, 'betrag', e.target.value)}
              disabled={disabled}
              placeholder="CHF"
              className={`p-2 rounded-lg border text-sm min-h-[44px] w-full dark:bg-gray-800 dark:text-white text-right
                ${feedbackSichtbar ? (betragOk ? 'border-green-400 ring-2 ring-green-400' : 'border-red-400 ring-2 ring-red-400') : 'border-gray-300 dark:border-gray-600'}
              `}
            />
            {zeilen.length > 1 && !disabled && (
              <button onClick={() => zeileEntfernen(i)} className="text-red-400 hover:text-red-600 min-w-[44px] min-h-[44px] flex items-center justify-center" title="Zeile entfernen">
                ✕
              </button>
            )}
            {zeilen.length <= 1 && <span className="w-[44px]" />}
          </div>
        )
      })}

      {/* Zeile hinzufügen */}
      {!disabled && !feedbackSichtbar && (
        <button onClick={zeileHinzufuegen} className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400">
          + Zeile hinzufuegen
        </button>
      )}

      {/* Korrekte Lösung bei Feedback */}
      {feedbackSichtbar && !korrekt && korrekteDaten.length > 0 && (
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-sm">
          <p className="font-medium text-green-800 dark:text-green-200 mb-1">Korrekte Buchung:</p>
          {korrekteDaten.map((z, i) => {
            const sollName = konten.find(k => k.nr === z.soll)
            const habenName = konten.find(k => k.nr === z.haben)
            return (
              <p key={i} className="text-green-700 dark:text-green-300">
                {sollName ? `${z.soll} ${sollName.name}` : z.soll} an {habenName ? `${z.haben} ${habenName.name}` : z.haben} CHF {z.betrag.toLocaleString('de-CH')}
              </p>
            )
          })}
        </div>
      )}

      {!disabled && istVollstaendig && !feedbackSichtbar && (
        <button onClick={handleAbsenden} className="w-full bg-blue-500 text-white rounded-xl py-3 font-medium min-h-[48px]">
          Pruefen
        </button>
      )}

      {feedbackSichtbar && korrekt !== null && <FeedbackBox korrekt={korrekt} erklaerung={frage.erklaerung} />}
    </div>
  )
}
