import { describe, it, expect } from 'vitest'
import { t } from '../utils/anrede'

describe('anrede', () => {
  it('gibt Sie-Form zurueck', () => {
    expect(t('richtig', 'sie')).toBe('Korrekt.')
    expect(t('falsch', 'sie')).toBe('Leider nicht korrekt.')
  })
  it('gibt Du-Form zurueck', () => {
    expect(t('richtig', 'du')).toBe('Super, richtig!')
    expect(t('falsch', 'du')).toContain('nicht ganz')
  })
})
