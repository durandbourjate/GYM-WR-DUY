import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Frage } from '../types/fragen.ts'
import type { PruefungsConfig } from '../types/pruefung.ts'
import type { Antwort } from '../types/antworten.ts'

export type AppPhase = 'start' | 'pruefung' | 'uebersicht' | 'abgegeben'

interface PruefungState {
  // Prüfungsdaten
  config: PruefungsConfig | null
  fragen: Frage[]

  // Navigation
  aktuelleFrageIndex: number
  phase: AppPhase

  // Antworten
  antworten: Record<string, Antwort>
  markierungen: Record<string, boolean>

  // Status
  startzeit: string | null
  abgegeben: boolean
  verbindungsstatus: 'online' | 'offline' | 'syncing'
  letzterSave: string | null
  autoSaveCount: number

  // Actions
  setAntwort: (frageId: string, antwort: Antwort) => void
  toggleMarkierung: (frageId: string) => void
  navigiere: (index: number) => void
  naechsteFrage: () => void
  vorherigeFrage: () => void
  setPhase: (phase: AppPhase) => void
  pruefungStarten: (config: PruefungsConfig, fragen: Frage[]) => void
  pruefungAbgeben: () => void
  setVerbindungsstatus: (status: 'online' | 'offline' | 'syncing') => void
  setLetzterSave: (timestamp: string) => void
  incrementAutoSaveCount: () => void
  zuruecksetzen: () => void
}

const initialState = {
  config: null,
  fragen: [],
  aktuelleFrageIndex: 0,
  phase: 'start' as AppPhase,
  antworten: {},
  markierungen: {},
  startzeit: null,
  abgegeben: false,
  verbindungsstatus: 'online' as const,
  letzterSave: null,
  autoSaveCount: 0,
}

export const usePruefungStore = create<PruefungState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAntwort: (frageId, antwort) =>
        set((state) => ({
          antworten: { ...state.antworten, [frageId]: antwort },
        })),

      toggleMarkierung: (frageId) =>
        set((state) => ({
          markierungen: {
            ...state.markierungen,
            [frageId]: !state.markierungen[frageId],
          },
        })),

      navigiere: (index) => {
        const { fragen } = get()
        if (index >= 0 && index < fragen.length) {
          set({ aktuelleFrageIndex: index })
        }
      },

      naechsteFrage: () => {
        const { aktuelleFrageIndex, fragen } = get()
        if (aktuelleFrageIndex < fragen.length - 1) {
          set({ aktuelleFrageIndex: aktuelleFrageIndex + 1 })
        }
      },

      vorherigeFrage: () => {
        const { aktuelleFrageIndex } = get()
        if (aktuelleFrageIndex > 0) {
          set({ aktuelleFrageIndex: aktuelleFrageIndex - 1 })
        }
      },

      setPhase: (phase) => set({ phase }),

      pruefungStarten: (config, fragen) =>
        set({
          config,
          fragen,
          aktuelleFrageIndex: 0,
          phase: 'pruefung',
          antworten: {},
          markierungen: {},
          startzeit: new Date().toISOString(),
          abgegeben: false,
          autoSaveCount: 0,
        }),

      pruefungAbgeben: () =>
        set({
          abgegeben: true,
          phase: 'abgegeben',
        }),

      setVerbindungsstatus: (status) => set({ verbindungsstatus: status }),
      setLetzterSave: (timestamp) => set({ letzterSave: timestamp }),
      incrementAutoSaveCount: () =>
        set((state) => ({ autoSaveCount: state.autoSaveCount + 1 })),

      zuruecksetzen: () => set(initialState),
    }),
    {
      name: 'pruefung-state',
      partialize: (state) => ({
        config: state.config,
        fragen: state.fragen,
        aktuelleFrageIndex: state.aktuelleFrageIndex,
        phase: state.phase,
        antworten: state.antworten,
        markierungen: state.markierungen,
        startzeit: state.startzeit,
        abgegeben: state.abgegeben,
        letzterSave: state.letzterSave,
        autoSaveCount: state.autoSaveCount,
      }),
    }
  )
)
