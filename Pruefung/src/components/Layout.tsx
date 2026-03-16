import { useState, useEffect, useRef } from 'react'
import { usePruefungStore } from '../store/pruefungStore.ts'
import Timer from './Timer.tsx'
import VerbindungsStatus from './VerbindungsStatus.tsx'
import AutoSaveIndikator from './AutoSaveIndikator.tsx'
import FragenNavigation from './FragenNavigation.tsx'
import AbgabeDialog from './AbgabeDialog.tsx'
import MCFrage from './fragetypen/MCFrage.tsx'
import FreitextFrage from './fragetypen/FreitextFrage.tsx'
import LueckentextFrage from './fragetypen/LueckentextFrage.tsx'
import { saveToIndexedDB } from '../services/autoSave.ts'
import type { MCFrage as MCFrageType, FreitextFrage as FreitextFrageType, LueckentextFrage as LueckentextFrageType } from '../types/fragen.ts'

export default function Layout() {
  const config = usePruefungStore((s) => s.config)
  const fragen = usePruefungStore((s) => s.fragen)
  const aktuelleFrageIndex = usePruefungStore((s) => s.aktuelleFrageIndex)
  const antworten = usePruefungStore((s) => s.antworten)
  const markierungen = usePruefungStore((s) => s.markierungen)
  const startzeit = usePruefungStore((s) => s.startzeit)
  const abgegeben = usePruefungStore((s) => s.abgegeben)
  const naechsteFrage = usePruefungStore((s) => s.naechsteFrage)
  const vorherigeFrage = usePruefungStore((s) => s.vorherigeFrage)
  const toggleMarkierung = usePruefungStore((s) => s.toggleMarkierung)
  const setLetzterSave = usePruefungStore((s) => s.setLetzterSave)
  const incrementAutoSaveCount = usePruefungStore((s) => s.incrementAutoSaveCount)
  const [zeigAbgabeDialog, setZeigAbgabeDialog] = useState(false)

  // IndexedDB Auto-Save alle 15 Sekunden
  const antwortenRef = useRef(antworten)
  antwortenRef.current = antworten

  useEffect(() => {
    if (!config || abgegeben) return

    const interval = setInterval(() => {
      saveToIndexedDB(config.id, antwortenRef.current, startzeit)
      setLetzterSave(new Date().toISOString())
      incrementAutoSaveCount()
    }, 15000)

    return () => clearInterval(interval)
  }, [config, abgegeben, startzeit, setLetzterSave, incrementAutoSaveCount])

  if (!config || fragen.length === 0) return null

  const aktuelleFrage = fragen[aktuelleFrageIndex]
  const istMarkiert = aktuelleFrage ? !!markierungen[aktuelleFrage.id] : false

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
            {config.titel}
          </h1>
          <AutoSaveIndikator />
        </div>
        <div className="flex items-center gap-4">
          <VerbindungsStatus />
          <Timer />
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <aside className="hidden md:block w-56 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4 overflow-auto">
          <FragenNavigation />
        </aside>

        {/* Fragenbereich */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-3xl mx-auto">
            {/* Fragen-Nummer */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Frage {aktuelleFrageIndex + 1} von {fragen.length}
              </span>
              {aktuelleFrage && (
                <button
                  onClick={() => toggleMarkierung(aktuelleFrage.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer
                    ${istMarkiert
                      ? 'bg-orange-100 border-orange-300 text-orange-700 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-300'
                      : 'border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  {istMarkiert ? 'Markiert als unsicher' : 'Als unsicher markieren'}
                </button>
              )}
            </div>

            {/* Frage rendern */}
            {aktuelleFrage && renderFrage(aktuelleFrage)}

            {/* Mobile Navigation (Kacheln) */}
            <div className="md:hidden mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <FragenNavigation />
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={vorherigeFrage}
          disabled={aktuelleFrageIndex === 0}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Zurück
        </button>

        {!abgegeben && (
          <button
            onClick={() => setZeigAbgabeDialog(true)}
            className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            Abgeben
          </button>
        )}

        <button
          onClick={naechsteFrage}
          disabled={aktuelleFrageIndex === fragen.length - 1}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Weiter
        </button>
      </footer>

      {/* Abgabe-Dialog */}
      {zeigAbgabeDialog && (
        <AbgabeDialog onSchliessen={() => setZeigAbgabeDialog(false)} />
      )}
    </div>
  )
}

function renderFrage(frage: MCFrageType | FreitextFrageType | LueckentextFrageType | { typ: string }) {
  switch (frage.typ) {
    case 'mc':
      return <MCFrage frage={frage as MCFrageType} />
    case 'freitext':
      return <FreitextFrage frage={frage as FreitextFrageType} />
    case 'lueckentext':
      return <LueckentextFrage frage={frage as LueckentextFrageType} />
    default:
      return (
        <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 text-center">
          Fragetyp «{frage.typ}» wird in einer späteren Phase implementiert.
        </div>
      )
  }
}
