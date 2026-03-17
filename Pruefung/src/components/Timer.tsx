import { useState, useEffect, useRef } from 'react'
import { usePruefungStore } from '../store/pruefungStore.ts'
import { useAuthStore } from '../store/authStore.ts'
import { apiService } from '../services/apiService.ts'
import { sebVersion, browserInfo } from '../services/sebService.ts'
import { berechneRestzeit, formatZeit } from '../utils/zeit.ts'

interface Props {
  onZeitAbgelaufen?: () => void
}

export default function Timer({ onZeitAbgelaufen }: Props) {
  const config = usePruefungStore((s) => s.config)
  const startzeit = usePruefungStore((s) => s.startzeit)
  const abgegeben = usePruefungStore((s) => s.abgegeben)
  const antworten = usePruefungStore((s) => s.antworten)
  const autoSaveCount = usePruefungStore((s) => s.autoSaveCount)
  const heartbeats = usePruefungStore((s) => s.heartbeats)
  const netzwerkFehler = usePruefungStore((s) => s.netzwerkFehler)
  const unterbrechungen = usePruefungStore((s) => s.unterbrechungen)
  const pruefungAbgeben = usePruefungStore((s) => s.pruefungAbgeben)

  const user = useAuthStore((s) => s.user)
  const istDemoModus = useAuthStore((s) => s.istDemoModus)

  const [restSekunden, setRestSekunden] = useState<number | null>(null)
  const abgegebenRef = useRef(false)

  // Refs fuer stale-closure Schutz im Interval
  const antwortenRef = useRef(antworten)
  antwortenRef.current = antworten
  const autoSaveCountRef = useRef(autoSaveCount)
  autoSaveCountRef.current = autoSaveCount
  const heartbeatsRef = useRef(heartbeats)
  heartbeatsRef.current = heartbeats
  const netzwerkFehlerRef = useRef(netzwerkFehler)
  netzwerkFehlerRef.current = netzwerkFehler
  const unterbrechungenRef = useRef(unterbrechungen)
  unterbrechungenRef.current = unterbrechungen

  useEffect(() => {
    if (!config || !startzeit || abgegeben) return

    const update = () => {
      const rest = berechneRestzeit(startzeit, config.dauerMinuten)
      setRestSekunden(rest)
      if (rest <= 0 && !abgegebenRef.current) {
        abgegebenRef.current = true

        // Lokal abgeben
        pruefungAbgeben()

        // Callback für Banner-Anzeige
        onZeitAbgelaufen?.()

        // Abgabe-Daten in localStorage sichern (Refs fuer aktuellen Stand)
        try {
          const abgabeObjekt = {
            pruefungId: config.id,
            email: user?.email ?? '',
            name: user?.name ?? 'Unbekannt',
            startzeit,
            abgabezeit: new Date().toISOString(),
            antworten: antwortenRef.current,
            meta: {
              sebVersion: sebVersion(),
              browserInfo: browserInfo(),
              autoSaveCount: autoSaveCountRef.current,
              netzwerkFehler: netzwerkFehlerRef.current,
              heartbeats: heartbeatsRef.current,
              unterbrechungen: unterbrechungenRef.current,
              autoAbgabe: true,
            },
          }
          localStorage.setItem(`pruefung-abgabe-${config.id}`, JSON.stringify(abgabeObjekt))
        } catch {
          // ignorieren
        }

        // Remote senden (fire-and-forget, aktueller Stand via Ref)
        if (apiService.istKonfiguriert() && !istDemoModus && user?.email) {
          apiService.speichereAntworten({
            pruefungId: config.id,
            email: user.email,
            antworten: antwortenRef.current,
            version: -1,
            istAbgabe: true,
          })
        }
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [config, startzeit, abgegeben, pruefungAbgeben, onZeitAbgelaufen, user, istDemoModus])

  if (!config || restSekunden === null) return null

  const istCountdown = config.zeitanzeigeTyp === 'countdown'
  const anzeige = istCountdown
    ? formatZeit(Math.max(0, restSekunden))
    : formatZeit(config.dauerMinuten * 60 - restSekunden)

  const warnungStufe =
    restSekunden <= 0 ? 'abgelaufen' : restSekunden <= 300 ? 'kritisch' : restSekunden <= 900 ? 'warnung' : 'normal'

  return (
    <div
      className={`font-mono text-lg font-semibold tabular-nums ${
        warnungStufe === 'abgelaufen'
          ? 'text-red-700 dark:text-red-300'
          : warnungStufe === 'kritisch'
            ? 'text-red-600 dark:text-red-400 animate-pulse'
            : warnungStufe === 'warnung'
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-slate-700 dark:text-slate-200'
      }`}
      title={`${restSekunden > 0 ? 'Verbleibende Zeit' : 'Zeit abgelaufen'}`}
    >
      {istCountdown ? '' : '+'}{anzeige}
    </div>
  )
}
