import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitContactForm } from '@/actions/contact'

// ---------------------------------------------------------------------------
// 1. MOCKS DELS SERVEIS (Classes constructores)
// ---------------------------------------------------------------------------
vi.mock('@/services/ContactService', () => ({
  ContactService: class {
    processContactForm = vi.fn().mockResolvedValue(true)
  }
}))

vi.mock('@/repositories/supabase/SupabaseContactRepository', () => ({
  SupabaseContactRepository: class {}
}))

vi.mock('@/adapters/nodemailer/NodemailerAdapter', () => ({
  NodemailerAdapter: class {}
}))

// ---------------------------------------------------------------------------
// 2. MOCK DE LA VALIDACIÓ ZOD (Estricte)
// ---------------------------------------------------------------------------
vi.mock('@/lib/validations/contact', async (importOriginal) => {
  return {
    ContactFormSchema: {
      // ✅ FIX: Usem 'unknown' en lloc de 'any'
      safeParse: (data: unknown) => {
        // ✅ FIX: Cast segur a un tipus parcial per llegir la propietat
        const input = data as { fullName?: string };

        // Lògica simulada:
        if (input.fullName === 'Només Nom') {
          return {
            success: false,
            error: {
              flatten: () => ({ fieldErrors: { email: ['Email required'] } })
            }
          }
        }
        // Èxit total
        return {
          success: true,
          data: { ...input, service: 'valid_service_mock', privacy: true }
        }
      }
    }
  }
})

describe('Action: Contact Form (Integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hauria de processar el formulari correctament (Success Flow)', async () => {
    const formData = new FormData()
    formData.append('fullName', 'Client Test') 
    formData.append('email', 'test@client.com')
    formData.append('service', 'qualsevol_cosa')
    formData.append('message', 'Aquest és un missatge de prova vàlid.')
    formData.append('privacy', 'on')

    const result = await submitContactForm(
      { success: false, message: '', errors: {} }, 
      formData
    )

    expect(result.success).toBe(true)
  })

  it('hauria de retornar error si falten camps obligatoris', async () => {
    const formData = new FormData()
    formData.append('fullName', 'Només Nom') 
    // No enviem email

    const result = await submitContactForm(
      { success: false, message: '', errors: {} }, 
      formData
    )

    expect(result.success).toBe(false)
    expect(result.errors).toHaveProperty('email')
  })
})