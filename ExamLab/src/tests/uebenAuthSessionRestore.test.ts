import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useUebenAuthStore } from '../store/ueben/authStore'
import { uebenApiClient } from '../services/ueben/apiClient'

const STORAGE_KEY = 'ueben-auth'

function gespeicherterUser() {
  return {
    email: 'sus@stud.gymhofwil.ch',
    name: 'Test SuS',
    vorname: 'Test',
    nachname: 'SuS',
    rolle: 'lernend',
    sessionToken: 'token-abc',
    loginMethode: 'code',
  }
}

describe('useUebenAuthStore.sessionWiederherstellen', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    useUebenAuthStore.setState({ user: null, istAngemeldet: false, ladeStatus: 'idle', fehler: null })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('haelt den User eingeloggt, wenn Backend {success:true} liefert', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gespeicherterUser()))
    vi.spyOn(uebenApiClient, 'post').mockResolvedValue({ success: true } as unknown as null)

    await useUebenAuthStore.getState().sessionWiederherstellen()

    const state = useUebenAuthStore.getState()
    expect(state.istAngemeldet).toBe(true)
    expect(state.user?.sessionToken).toBe('token-abc')
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('loggt den User aus, wenn Backend {success:false} liefert', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gespeicherterUser()))
    vi.spyOn(uebenApiClient, 'post').mockResolvedValue({ success: false } as unknown as null)

    await useUebenAuthStore.getState().sessionWiederherstellen()

    const state = useUebenAuthStore.getState()
    expect(state.istAngemeldet).toBe(false)
    expect(state.user).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('loggt den User aus, wenn Backend null liefert (Netzwerk-Fehler)', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gespeicherterUser()))
    vi.spyOn(uebenApiClient, 'post').mockResolvedValue(null)

    await useUebenAuthStore.getState().sessionWiederherstellen()

    const state = useUebenAuthStore.getState()
    expect(state.istAngemeldet).toBe(false)
    expect(state.user).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('macht nichts, wenn localStorage leer ist', async () => {
    const postSpy = vi.spyOn(uebenApiClient, 'post')

    await useUebenAuthStore.getState().sessionWiederherstellen()

    expect(postSpy).not.toHaveBeenCalled()
    expect(useUebenAuthStore.getState().istAngemeldet).toBe(false)
  })
})
