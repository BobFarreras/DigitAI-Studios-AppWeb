import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// -------------------------------------------------------------------------
// Component Mock del Formulari de Contacte
// -------------------------------------------------------------------------
interface ContactFormProps {
  onSubmitAction: (formData: FormData) => Promise<void>;
}

const ContactForm = ({ onSubmitAction }: ContactFormProps) => {
  const [status, setStatus] = React.useState<'idle' | 'success'>('idle')

  const handleSubmit = async (formData: FormData) => {
    await onSubmitAction(formData)
    setStatus('success')
  }

  if (status === 'success') {
    return <div>Missatge enviat correctament</div>
  }

  return (
    <form action={handleSubmit} aria-label="contact-form">
      <div>
        <label htmlFor="name">Nom</label>
        <input id="name" name="name" required />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="message">Missatge</label>
        <textarea id="message" name="message" required />
      </div>
      <button type="submit">Enviar Missatge</button>
    </form>
  )
}

// -------------------------------------------------------------------------
// EL TEST
// -------------------------------------------------------------------------
describe('ContactForm Integration', () => {
  it('hauria de permetre omplir els camps i enviar', async () => {
    const mockAction = vi.fn().mockResolvedValue(true)

    render(<ContactForm onSubmitAction={mockAction} />)

    // 1. Omplim els camps
    fireEvent.change(screen.getByLabelText(/Nom/i), { target: { value: 'Client Prova' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'client@test.com' } })
    fireEvent.change(screen.getByLabelText(/Missatge/i), { target: { value: 'Vull una web nova' } })

    // 2. Enviem
    const submitBtn = screen.getByRole('button', { name: /Enviar Missatge/i })
    fireEvent.click(submitBtn)

    // 3. Esperem que l'acció s'hagi cridat
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled()
    })

    // 4. Comprovem feedback visual (UI Optimista o resultat)
    expect(screen.getByText('Missatge enviat correctament')).toBeInTheDocument()
  })
})