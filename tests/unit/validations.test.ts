import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// 1. Definim l'schema aquí mateix per aïllar el test (o l'importes de lib/)
const contactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10, "El missatge ha de tenir mínim 10 caràcters"),
})

describe('Validacions de Contacte (Unit)', () => {
  it('hauria de validar un email correcte', () => {
    const result = contactSchema.safeParse({
      email: 'test@digitai.com',
      message: 'Missatge de prova prou llarg'
    })
    
    // Validació estricta
    expect(result.success).toBe(true)
  })

  it('hauria de fallar si el missatge és curt', () => {
    const result = contactSchema.safeParse({
      email: 'test@digitai.com',
      message: 'Curt'
    })

    // TypeScript necessita aquest guard:
    expect(result.success).toBe(false)

    // Ara TypeScript sap que 'result' és del tipus SafeParseError
    if (!result.success) {
      // ZodError conté 'issues' o 'errors'. Accedim a issues[0]
      expect(result.error.issues[0].path).toContain('message')
      expect(result.error.issues[0].message).toBe("El missatge ha de tenir mínim 10 caràcters")
    }
  })
})