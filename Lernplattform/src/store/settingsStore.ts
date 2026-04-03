import { create } from 'zustand'
import type { GruppenEinstellungen } from '../types/settings'
import { defaultEinstellungen } from '../types/settings'

interface SettingsState {
  einstellungen: GruppenEinstellungen | null
  ladeStatus: 'idle' | 'laden' | 'fertig' | 'fehler'
  setzeDefaults: (typ: 'gym' | 'familie') => void
  setzeEinstellungen: (e: GruppenEinstellungen) => void
  aktualisiereEinstellungen: (partial: Partial<GruppenEinstellungen>) => void
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  einstellungen: null,
  ladeStatus: 'idle',
  setzeDefaults: (typ) => {
    set({ einstellungen: defaultEinstellungen(typ), ladeStatus: 'fertig' })
  },
  setzeEinstellungen: (e) => {
    set({ einstellungen: e, ladeStatus: 'fertig' })
  },
  aktualisiereEinstellungen: (partial) => {
    const aktuell = get().einstellungen
    if (!aktuell) return
    set({ einstellungen: { ...aktuell, ...partial } })
  },
}))
