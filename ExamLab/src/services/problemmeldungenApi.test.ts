import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listeProblemmeldungen, toggleProblemmeldung } from './problemmeldungenApi'
import * as apiClient from './apiClient'

describe('problemmeldungenApi', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('unwrappt listeProblemmeldungen-Response', async () => {
    vi.spyOn(apiClient, 'postJson').mockResolvedValue({
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: [{ id: 'm1', typ: 'problem', comment: 'x' } as any],
    })
    const result = await listeProblemmeldungen('a@b.ch')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('m1')
  })

  it('gibt leeres Array bei success=false', async () => {
    vi.spyOn(apiClient, 'postJson').mockResolvedValue({ success: false, error: 'x' })
    const result = await listeProblemmeldungen('a@b.ch')
    expect(result).toEqual([])
  })

  it('gibt leeres Array bei null/undefined Response', async () => {
    vi.spyOn(apiClient, 'postJson').mockResolvedValue(null)
    const result = await listeProblemmeldungen('a@b.ch')
    expect(result).toEqual([])
  })

  it('toggleProblemmeldung liefert true bei success', async () => {
    vi.spyOn(apiClient, 'postJson').mockResolvedValue({ success: true })
    const ok = await toggleProblemmeldung('a@b.ch', 'm1', true)
    expect(ok).toBe(true)
  })

  it('toggleProblemmeldung liefert false bei success=false', async () => {
    vi.spyOn(apiClient, 'postJson').mockResolvedValue({ success: false, error: 'x' })
    const ok = await toggleProblemmeldung('a@b.ch', 'm1', true)
    expect(ok).toBe(false)
  })
})
