import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { processWebAudit} from '@/actions/audit'
import { auditService } from '@/services/container'
import { createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// -------------------------------------------------------------------
// 1. MOCKS GLOBALS
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
  // Definim les funcions mock específiques que volem controlar
  let mockMaybeSingle: Mock;
  let mockQueryBuilder: Record<string, Mock>;

  beforeEach(() => {
    vi.clearAllMocks()

    // Aquest és el truc: Creem un objecte específic per la cadena de consultes
    mockMaybeSingle = vi.fn();

    mockQueryBuilder = {
      from: vi.fn().mockReturnThis(),   // .from() retorna el builder
      select: vi.fn().mockReturnThis(), // .select() retorna el builder
      ilike: vi.fn().mockReturnThis(),  // .ilike() retorna el builder
      eq: vi.fn().mockReturnThis(),     // .eq() retorna el builder
      maybeSingle: mockMaybeSingle,     // .maybeSingle() és el final
    };

    // Quan cridem createAdminClient, retornem directament el builder
    // (A Supabase el client i el builder sovint comparteixen mètodes inicials com .from)
    vi.mocked(createAdminClient).mockReturnValue(
      mockQueryBuilder as unknown as ReturnType<typeof createAdminClient>
    )
  })

  it('hauria de retornar error si la validació falla (URL buida)', async () => {
    const formData = new FormData()
    formData.append('url', '')
    formData.append('email', 'test@test.com')

    const result = await processWebAudit({}, formData)

    expect(result.success).toBe(false)
    expect(auditService.performPublicAudit).not.toHaveBeenCalled()
  })

  it('hauria de processar l\'auditoria i redirigir al LOGIN si l\'usuari JA existeix', async () => {
    // 1. SETUP: Simulem que Supabase troba un usuari
    // IMPORTANT: Retornem l'estructura completa { data: objecte, error: null }
    mockMaybeSingle.mockResolvedValue({
      data: { id: 'user-existent-123' },
      error: null
    })

    vi.mocked(auditService.performPublicAudit).mockResolvedValue('audit-id-123')

    // 2. EXECUCIÓ
    const formData = new FormData()
    formData.append('url', 'https://tevaweb.com')
    formData.append('email', 'client@existent.com')

    await processWebAudit({}, formData)

    // 3. ASSERT
    // Comprovem que ha anat per la branca del Login
    expect(redirect).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login')
    )
  })

  it('hauria de redirigir al REGISTRE si l\'usuari NO existeix', async () => {
    // 1. SETUP: Simulem que Supabase NO troba res (data: null)
    // IMPORTANT: Retornem { data: null, error: null } per evitar errors de destructuring
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: null
    })

    vi.mocked(auditService.performPublicAudit).mockResolvedValue('audit-id-new')

    // 2. EXECUCIÓ
    const formData = new FormData()
    formData.append('url', 'https://novaweb.com')
    formData.append('email', 'nou@client.com')

    await processWebAudit({}, formData)

    // 3. ASSERT
    // Comprovem que ha anat per la branca del Registre
    expect(redirect).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register')
    )
  })

  it('hauria de gestionar errors del servei gracefully (logs a consola)', async () => {
    // Aquest test provocarà un console.error, és normal
    vi.mocked(auditService.performPublicAudit).mockRejectedValue(new Error('API Error'))

    // Assegurem que el mock de Supabase no peti abans
    mockMaybeSingle.mockResolvedValue({ data: null, error: null })

    const formData = new FormData()
    formData.append('url', 'https://error.com')
    formData.append('email', 'test@test.com')

    const result = await processWebAudit({}, formData)

    expect(result.success).toBe(false)
    expect(result.message).toContain('Error tècnic')
  })
})