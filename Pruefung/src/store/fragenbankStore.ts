import { create } from 'zustand'
import type { Frage } from '../types/fragen.ts'
import { ladeFragenbank } from '../services/fragenbankApi.ts'

interface FragenbankStore {
  fragen: Frage[]
  fragenMap: Record<string, Frage>
  status: 'idle' | 'laden' | 'fertig' | 'fehler'
  /** Fragenbank vom Backend laden (nur wenn noch nicht geladen oder force=true) */
  lade: (email: string, force?: boolean) => Promise<void>
  /** Einzelne Frage im lokalen State aktualisieren (nach Speichern/Import) */
  aktualisiereFrage: (frage: Frage) => void
  /** Frage entfernen (nach Löschen) */
  entferneFrage: (frageId: string) => void
  /** Mehrere Fragen hinzufügen (z.B. nach Pool-Import) */
  fuegeFragenHinzu: (neueFragen: Frage[]) => void
  /** Komplette Fragenbank ersetzen (z.B. nach Refresh) */
  setFragen: (fragen: Frage[]) => void
  /** Zurücksetzen beim Logout */
  reset: () => void
}

function bauFragenMap(fragen: Frage[]): Record<string, Frage> {
  const map: Record<string, Frage> = {}
  for (const f of fragen) map[f.id] = f
  return map
}

export const useFragenbankStore = create<FragenbankStore>((set, get) => ({
  fragen: [],
  fragenMap: {},
  status: 'idle',

  lade: async (email: string, force = false) => {
    const { status } = get()
    // Nicht doppelt laden, ausser force
    if (status === 'laden' || (status === 'fertig' && !force)) return

    set({ status: 'laden' })
    const result = await ladeFragenbank(email)
    if (result) {
      // Duplikate entfernen
      const gesehen = new Set<string>()
      const eindeutig = result.filter((f: Frage) => {
        if (gesehen.has(f.id)) return false
        gesehen.add(f.id)
        return true
      })
      set({ fragen: eindeutig, fragenMap: bauFragenMap(eindeutig), status: 'fertig' })
    } else {
      set({ status: 'fehler' })
    }
  },

  aktualisiereFrage: (frage: Frage) => {
    set(state => {
      const fragen = state.fragen.map(f => f.id === frage.id ? frage : f)
      // Falls neue Frage (nicht in Liste), hinzufügen
      if (!state.fragenMap[frage.id]) fragen.unshift(frage)
      return { fragen, fragenMap: bauFragenMap(fragen) }
    })
  },

  entferneFrage: (frageId: string) => {
    set(state => {
      const fragen = state.fragen.filter(f => f.id !== frageId)
      return { fragen, fragenMap: bauFragenMap(fragen) }
    })
  },

  fuegeFragenHinzu: (neueFragen: Frage[]) => {
    set(state => {
      const fragen = [...neueFragen, ...state.fragen]
      return { fragen, fragenMap: bauFragenMap(fragen) }
    })
  },

  setFragen: (fragen: Frage[]) => {
    set({ fragen, fragenMap: bauFragenMap(fragen), status: 'fertig' })
  },

  reset: () => {
    set({ fragen: [], fragenMap: {}, status: 'idle' })
  },
}))
