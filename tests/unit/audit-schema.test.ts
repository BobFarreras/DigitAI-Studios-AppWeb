import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { processWebAudit, type FormState } from '@/actions/audit'
import { auditService } from '@/services/container'
import { createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// -------------------------------------------------------------------
// 1. MOCKS
// -------------------------------------------------------------------

vi.mock('@/services/container', () => ({
  auditService: {
    performPublicAudit: vi.fn(),
  }
}))

vi.mock('@/lib/supabase/server', () => ({
  createAdminClient: vi.fn(),
  createClient: vi.fn() 
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}))

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn().mockResolvedValue('ca')
}))

// -------------------------------------------------------------------
// 2. TESTS
// -------------------------------------------------------------------

describe('Action: processWebAudit (Integration)', () => {
  let mockSupabaseAdmin: Record<string, Mock>;

  beforeEach(() => {
    vi.clearAllMocks()

    mockSupabaseAdmin = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn(),
    }

    vi.mocked(createAdminClient).mockReturnValue(
      mockSupabaseAdmin as unknown as ReturnType<typeof createAdminClient>
    )
  })

  it('hauria de retornar error si la validació falla (URL buida)', async () => {
    const prevState: FormState = {}
    const formData = new FormData()
    formData.append('url', '')
    formData.append('email', 'test@test.com')

    const result = await processWebAudit(prevState, formData)

    expect(result.success).toBe(false)
    expect(result.message).toContain('Revisa les dades')
    expect(auditService.performPublicAudit).not.toHaveBeenCalled()
  })

  it('hauria de processar l\'auditoria i redirigir al login si l\'usuari ja existeix', async () => {
    // 1. SETUP: Simulem resposta correcta de Supabase { data: ... }
    mockSupabaseAdmin.maybeSingle.mockResolvedValue({ 
      data: { id: 'user-123' }, // 👈 CORREGIT: Embolcallat amb 'data'
      error: null 
    }) 
    
    vi.mocked(auditService.performPublicAudit).mockResolvedValue('audit-id-123')

    // 2. EXECUCIÓ
    const prevState: FormState = {}
    const formData = new FormData()
    formData.append('url', 'https://tevaweb.com')
    formData.append('email', 'client@existent.com')
    
    await processWebAudit(prevState, formData)

    // 3. ASSERT
    expect(auditService.performPublicAudit).toHaveBeenCalledWith(
      'https://tevaweb.com',
      'client@existent.com',
      'ca'
    )

    expect(redirect).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login')
    )
  })

  it('hauria de redirigir al registre si l\'usuari NO existeix', async () => {
    // 1. SETUP: Simulem que no troba res, però retorna un objecte vàlid
    mockSupabaseAdmin.maybeSingle.mockResolvedValue({ 
      data: null, // 👈 CORREGIT: data és null, però l'objecte existeix
      error: null 
    })
    
    vi.mocked(auditService.performPublicAudit).mockResolvedValue('audit-id-new')

    // 2. EXECUCIÓ
    const formData = new FormData()
    formData.append('url', 'https://novaweb.com')
    formData.append('email', 'nou@client.com')

    await processWebAudit({}, formData)

    // 3. ASSERT
    expect(redirect).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register')
    )
  })

  it('hauria de gestionar errors del servei gracefully', async () => {
    vi.mocked(auditService.performPublicAudit).mockRejectedValue(new Error('API Error'))

    const formData = new FormData()
    formData.append('url', 'https://error.com')
    formData.append('email', 'test@test.com')

    const result = await processWebAudit({}, formData)

    expect(result.success).toBe(false)
    expect(result.message).toContain('Error tècnic')
  })
})