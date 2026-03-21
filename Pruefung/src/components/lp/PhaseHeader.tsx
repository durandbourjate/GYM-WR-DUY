import { useState, useEffect } from 'react'
import type { PruefungsConfig } from '../../types/pruefung'
import type { PruefungsPhase } from '../../types/monitoring'

const PHASE_CONFIG: Record<PruefungsPhase, { label: string; farbe: string; icon: string }> = {
  vorbereitung: { label: 'Vorbereitung', farbe: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200', icon: '⚙️' },
  lobby: { label: 'Lobby', farbe: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200', icon: '🟡' },
  aktiv: { label: 'Aktiv', farbe: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200', icon: '🟢' },
  beendet: { label: 'Beendet', farbe: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300', icon: '⏹' },
}

interface Props {
  config: PruefungsConfig
  phase: PruefungsPhase
}

export default function PhaseHeader({ config, phase }: Props) {
  const phaseInfo = PHASE_CONFIG[phase]
  const [dauer, setDauer] = useState('')

  // Timer: Laufzeit als Stoppuhr (nur in aktiv-Phase)
  const [startTimestamp] = useState(() => Date.now()) // Lokaler Start-Zeitpunkt
  useEffect(() => {
    if (phase !== 'aktiv') {
      setDauer('')
      return
    }
    const updateDauer = () => {
      const diff = Date.now() - startTimestamp
      setDauer(formatDauer(diff))
    }
    updateDauer()
    const interval = setInterval(updateDauer, 1000)
    return () => clearInterval(interval)
  }, [phase, startTimestamp])

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {config.titel}
        </h2>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${phaseInfo.farbe}`}>
          {phaseInfo.icon} {phaseInfo.label}
        </span>
      </div>

      {/* Timer in aktiver Phase */}
      {phase === 'aktiv' && dauer && (
        <span className="text-sm font-mono text-slate-600 dark:text-slate-300">
          ⏱ {dauer}
        </span>
      )}

      {/* Beendet: Zeitraum anzeigen */}
      {phase === 'beendet' && config.beendetUm && (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Beendet: {new Date(config.beendetUm).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  )
}

function formatDauer(ms: number): string {
  const totalSekunden = Math.floor(ms / 1000)
  const stunden = Math.floor(totalSekunden / 3600)
  const minuten = Math.floor((totalSekunden % 3600) / 60)
  const sekunden = totalSekunden % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return stunden > 0
    ? `${pad(stunden)}:${pad(minuten)}:${pad(sekunden)}`
    : `${pad(minuten)}:${pad(sekunden)}`
}
