import { describe, it, expect } from 'vitest'
import DurchfuehrenDashboardSource from '../DurchfuehrenDashboard.tsx?raw'

describe('DurchfuehrenDashboard — Polling-Logik', () => {
  it('Hebel A: Lobby-Phase soll 5s-Polling ausloesen (nicht 15s)', () => {
    const hasLobbyPolling = /\(phase\s*===\s*['"]aktiv['"]\s*\|\|\s*phase\s*===\s*['"]lobby['"]\)/.test(
      DurchfuehrenDashboardSource
    )
    expect(
      hasLobbyPolling,
      'Polling-Konstante fuer Lobby fehlt: phase === "aktiv" || phase === "lobby" nicht gefunden'
    ).toBeTruthy()
  })
})

describe('DurchfuehrenDashboard — Pre-Warm-Trigger Hebel C', () => {
  const code = DurchfuehrenDashboardSource

  it('importiert preWarmKorrektur', () => {
    expect(code).toMatch(/import\s*\{[^}]*preWarmKorrektur[^}]*\}\s*from\s*['"][^'"]*preWarmApi['"]/)
  })

  it('Trigger 1 — Tab-Wechsel via wechsleTab', () => {
    expect(code).toMatch(/G\.d\.1 Trigger Tab-Wechsel/)
    const idx = code.indexOf('G.d.1 Trigger Tab-Wechsel')
    expect(code.substring(idx, idx + 500)).toMatch(/preWarmKorrektur/)
  })

  it('Trigger 2 — Phase-Wechsel zu beendet im Phase-useEffect', () => {
    expect(code).toMatch(/G\.d\.1 Trigger Phase-beendet/)
    const idx = code.indexOf('G.d.1 Trigger Phase-beendet')
    const block = code.substring(idx, idx + 500)
    expect(block).toMatch(/preWarmKorrektur/)
    expect(block).toMatch(/beendet/)
  })

  it('Trigger 3 — Direct-Mount-Edge-Case bei beendet-URL', () => {
    expect(code).toMatch(/G\.d\.1 Trigger Direct-Mount/)
    const idx = code.indexOf('G.d.1 Trigger Direct-Mount')
    expect(code.substring(idx, idx + 500)).toMatch(/preWarmKorrektur/)
  })
})
