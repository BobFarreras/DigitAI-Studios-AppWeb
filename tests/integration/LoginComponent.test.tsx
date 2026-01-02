import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'

// -------------------------------------------------------------------------
// Component Mock amb tipatge explícit
// -------------------------------------------------------------------------

interface LoginFormProps {
  onLogin: (formData: FormData) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  // Tipem explícitament l'argument de la funció action
  const handleSubmit = (formData: FormData) => {
    onLogin(formData)
  }

  return (
    <form action={handleSubmit} aria-label="login-form">
      <label htmlFor="email">Email</label>
      <input id="email" name="email" placeholder="Email" required />
      <button type="submit">Entrar</button>
    </form>
  )
}

// -------------------------------------------------------------------------
// EL TEST
// -------------------------------------------------------------------------

describe('LoginForm Integration', () => {
  it('hauria de cridar l\'acció al fer submit', () => {
    const mockLoginAction = vi.fn()

    render(<LoginForm onLogin={mockLoginAction} />)
    
    const input = screen.getByPlaceholderText('Email')
    const button = screen.getByText('Entrar')
    
    // Simulem l'escriptura
    fireEvent.change(input, { target: { value: 'admin@digitai.com' } })
    
    // Simulem el click
    fireEvent.click(button)
    
    // Validació
    expect(mockLoginAction).toHaveBeenCalled()
  })
})