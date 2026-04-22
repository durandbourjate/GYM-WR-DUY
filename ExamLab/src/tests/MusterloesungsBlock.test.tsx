import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MusterloesungsBlock } from '@shared/ui/MusterloesungsBlock'

describe('MusterloesungsBlock', () => {
  it('rendert mit korrekt-Styling', () => {
    const { container } = render(
      <MusterloesungsBlock variant="korrekt"><p>Erklärung</p></MusterloesungsBlock>
    )
    expect(container.querySelector('.border-green-600')).toBeInTheDocument()
    expect(screen.getByText('Erklärung')).toBeInTheDocument()
  })
  it('rendert mit falsch-Styling', () => {
    const { container } = render(
      <MusterloesungsBlock variant="falsch"><p>Text</p></MusterloesungsBlock>
    )
    expect(container.querySelector('.border-red-600')).toBeInTheDocument()
  })
  it('nutzt default-Label wenn kein label-Prop', () => {
    render(<MusterloesungsBlock variant="korrekt"><p>X</p></MusterloesungsBlock>)
    expect(screen.getByText(/Richtig beantwortet/i)).toBeInTheDocument()
  })
  it('nutzt custom label', () => {
    render(<MusterloesungsBlock variant="falsch" label="Nicht ganz"><p>X</p></MusterloesungsBlock>)
    expect(screen.getByText(/Nicht ganz/i)).toBeInTheDocument()
  })
})
