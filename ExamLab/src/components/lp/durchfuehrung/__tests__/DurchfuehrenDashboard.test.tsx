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
