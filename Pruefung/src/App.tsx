import { useEffect, useState } from 'react'
import { usePruefungStore } from './store/pruefungStore.ts'
import { demoPruefung } from './data/demoPruefung.ts'
import { demoFragen } from './data/demoFragen.ts'
import type { Frage } from './types/fragen.ts'
import type { PruefungsConfig } from './types/pruefung.ts'
import Startbildschirm from './components/Startbildschirm.tsx'
import Layout from './components/Layout.tsx'
import FragenUebersicht from './components/FragenUebersicht.tsx'
import ThemeToggle from './components/ThemeToggle.tsx'

// Theme-Store importieren damit er initialisiert wird
import './store/themeStore.ts'

export default function App() {
  const phase = usePruefungStore((s) => s.phase)
  const config = usePruefungStore((s) => s.config)
  const [pruefungsConfig, setPruefungsConfig] = useState<PruefungsConfig | null>(null)
  const [pruefungsFragen, setPruefungsFragen] = useState<Frage[]>([])
  const [wiederhergestellt, setWiederhergestellt] = useState(false)

  useEffect(() => {
    // Prüfung laden (Phase 1: immer Demo)
    const resolvedConfig = demoPruefung
    const resolvedFragen = resolveFragenFuerPruefung(resolvedConfig, demoFragen)
    setPruefungsConfig(resolvedConfig)
    setPruefungsFragen(resolvedFragen)

    // Prüfe ob eine Sitzung wiederhergestellt werden kann
    if (config && config.id === resolvedConfig.id && phase !== 'start') {
      setWiederhergestellt(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!pruefungsConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-slate-500 dark:text-slate-400">Prüfung wird geladen...</p>
      </div>
    )
  }

  // Routing nach Phase
  switch (phase) {
    case 'start':
      return (
        <Startbildschirm
          config={pruefungsConfig}
          fragen={pruefungsFragen}
          wiederhergestellt={wiederhergestellt}
        />
      )
    case 'pruefung':
      return <Layout />
    case 'uebersicht':
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <FragenUebersicht />
        </div>
      )
    case 'abgegeben':
      return <AbgabeBestaetigung />
    default:
      return null
  }
}

/** Löst die Fragen-IDs aus den Abschnitten auf */
function resolveFragenFuerPruefung(config: PruefungsConfig, alleFragen: Frage[]): Frage[] {
  const fragenMap = new Map(alleFragen.map((f) => [f.id, f]))
  const result: Frage[] = []
  for (const abschnitt of config.abschnitte) {
    for (const id of abschnitt.fragenIds) {
      const frage = fragenMap.get(id)
      if (frage) result.push(frage)
    }
  }
  return result
}

function AbgabeBestaetigung() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 dark:bg-slate-300 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white dark:text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Prüfung abgegeben
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Ihre Antworten wurden gespeichert. Sie können das Fenster schliessen.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Bei Fragen wenden Sie sich an Ihre Lehrperson.
        </p>
      </div>
    </div>
  )
}
