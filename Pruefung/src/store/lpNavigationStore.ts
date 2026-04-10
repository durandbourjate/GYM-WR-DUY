import { create } from 'zustand'

export type LPModus = 'pruefung' | 'uebung' | 'fragensammlung'
export type LPAnsicht = 'dashboard' | 'composer'

export interface BreadcrumbEintrag {
  label: string
  aktion?: () => void
}

interface LPNavigationState {
  // Aktuelle Ansicht
  ansicht: LPAnsicht
  modus: LPModus
  vorherigerModus: 'pruefung' | 'uebung'

  // History für Zurück-Navigation
  ansichtHistory: LPAnsicht[]

  // Breadcrumb-Daten
  breadcrumbs: BreadcrumbEintrag[]

  // Aktionen
  navigiereZuComposer: (titel: string) => void
  zurueckZumDashboard: () => void
  setModus: (m: LPModus) => void
  kannZurueck: () => boolean
  zurueck: () => void
  setBreadcrumbs: (crumbs: BreadcrumbEintrag[]) => void
  reset: () => void
}

const MODUS_KEY = 'lp-modus'

function gespeicherterModus(): LPModus {
  try {
    const val = sessionStorage.getItem(MODUS_KEY)
    if (val === 'pruefung' || val === 'uebung' || val === 'fragensammlung') return val
  } catch { /* ignore */ }
  return 'pruefung'
}

export const useLPNavigationStore = create<LPNavigationState>((set, get) => ({
  ansicht: 'dashboard',
  modus: gespeicherterModus(),
  vorherigerModus: 'pruefung',
  ansichtHistory: [],
  breadcrumbs: [],

  navigiereZuComposer: (titel) => {
    set(state => ({
      ansichtHistory: [...state.ansichtHistory, state.ansicht],
      ansicht: 'composer',
      breadcrumbs: [
        { label: state.modus === 'uebung' ? 'Üben' : 'Prüfen', aktion: () => get().zurueckZumDashboard() },
        { label: titel },
      ],
    }))
  },

  zurueckZumDashboard: () => {
    set({ ansicht: 'dashboard', ansichtHistory: [], breadcrumbs: [] })
  },

  setModus: (m) => {
    const state = get()
    const vorherigerModus = m === 'fragensammlung'
      ? state.vorherigerModus
      : (m === 'pruefung' || m === 'uebung' ? m : state.vorherigerModus)
    try { sessionStorage.setItem(MODUS_KEY, m) } catch { /* ignore */ }
    set({
      modus: m,
      vorherigerModus,
      // Fragensammlung schliesst Composer
      ...(m === 'fragensammlung' && state.ansicht === 'composer' ? { ansicht: 'dashboard', ansichtHistory: [] } : {}),
    })
  },

  kannZurueck: () => get().ansichtHistory.length > 0,

  zurueck: () => {
    const { ansichtHistory, modus, vorherigerModus } = get()
    // Fragensammlung: zurück zum vorherigen Modus
    if (modus === 'fragensammlung') {
      try { sessionStorage.setItem(MODUS_KEY, vorherigerModus) } catch { /* ignore */ }
      set({ modus: vorherigerModus })
      return
    }
    // Composer: zurück zum Dashboard
    if (ansichtHistory.length > 0) {
      const vorherige = ansichtHistory[ansichtHistory.length - 1]
      set({
        ansicht: vorherige,
        ansichtHistory: ansichtHistory.slice(0, -1),
        breadcrumbs: [],
      })
      return
    }
  },

  setBreadcrumbs: (crumbs) => set({ breadcrumbs: crumbs }),

  reset: () => set({
    ansicht: 'dashboard',
    modus: 'pruefung',
    vorherigerModus: 'pruefung',
    ansichtHistory: [],
    breadcrumbs: [],
  }),
}))
