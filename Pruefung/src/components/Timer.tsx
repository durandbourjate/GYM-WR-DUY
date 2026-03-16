import { useState, useEffect, useRef } from 'react'
import { usePruefungStore } from '../store/pruefungStore.ts'
import { berechneRestzeit, formatZeit } from '../utils/zeit.ts'

export default function Timer() {
  const config = usePruefungStore((s) => s.config)
  const startzeit = usePruefungStore((s) => s.startzeit)
  const abgegeben = usePruefungStore((s) => s.abgegeben)
  const pruefungAbgeben = usePruefungStore((s) => s.pruefungAbgeben)
  const [restSekunden, setRestSekunden] = useState<number | null>(null)
  const abgegebenRef = useRef(false)

  useEffect(() => {
    if (!config || !startzeit || abgegeben) return

    const update = () => {
      const rest = berechneRestzeit(startzeit, config.dauerMinuten)
      setRestSekunden(rest)
      if (rest <= 0 && !abgegebenRef.current) {
        abgegebenRef.current = true
        pruefungAbgeben()
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [config, startzeit, abgegeben, pruefungAbgeben])

  if (!config || restSekunden === null) return null

  const istCountdown = config.zeitanzeigeTyp === 'countdown'
  const anzeige = istCountdown
    ? formatZeit(restSekunden)
    : formatZeit(config.dauerMinuten * 60 - restSekunden)

  const warnungStufe =
    restSekunden <= 300 ? 'kritisch' : restSekunden <= 900 ? 'warnung' : 'normal'

  return (
    <div
      className={`font-mono text-lg font-semibold tabular-nums ${
        warnungStufe === 'kritisch'
          ? 'text-red-600 dark:text-red-400 animate-pulse'
          : warnungStufe === 'warnung'
            ? 'text-orange-600 dark:text-orange-400'
            : 'text-slate-700 dark:text-slate-200'
      }`}
    >
      {istCountdown ? '' : '+'}{anzeige}
    </div>
  )
}
