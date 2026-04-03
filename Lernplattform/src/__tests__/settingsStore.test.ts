import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '../store/settingsStore'

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({ einstellungen: null, ladeStatus: 'idle' })
  })

  it('setzt Defaults fuer Gym', () => {
    useSettingsStore.getState().setzeDefaults('gym')
    const e = useSettingsStore.getState().einstellungen!
    expect(e.anrede).toBe('sie')
    expect(e.feedbackStil).toBe('sachlich')
  })

  it('setzt Defaults fuer Familie', () => {
    useSettingsStore.getState().setzeDefaults('familie')
    const e = useSettingsStore.getState().einstellungen!
    expect(e.anrede).toBe('du')
    expect(e.feedbackStil).toBe('ermutigend')
  })

  it('aktualisiert einzelne Felder', () => {
    useSettingsStore.getState().setzeDefaults('gym')
    useSettingsStore.getState().aktualisiereEinstellungen({ anrede: 'du' })
    expect(useSettingsStore.getState().einstellungen!.anrede).toBe('du')
    expect(useSettingsStore.getState().einstellungen!.feedbackStil).toBe('sachlich')
  })
})
