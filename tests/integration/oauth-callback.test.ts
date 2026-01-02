import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { GET } from '@/app/api/oauth/callback/route'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// 1. Mock de Next.js Responses
vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>()
  return {
    ...actual,
    NextResponse: {
      redirect: vi.fn(),
    }
  }
})

// 2. Mock de Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn()
}))

// 3. Mock global de fetch
global.fetch = vi.fn()

describe('API: OAuth Callback (Social Media)', () => {
  // Definim les variables dels mocks específics que necessitem controlar
  let mockMaybeSingle: Mock;
  let mockUpsert: Mock;
  let mockAuthGetUser: Mock;
  let mockSupabase: Record<string, unknown>;

  beforeEach(() => {
    vi.clearAllMocks()

    // A. Inicialitzem els mocks individuals
    mockMaybeSingle = vi.fn();
    mockUpsert = vi.fn();
    mockAuthGetUser = vi.fn();

    // B. Construïm l'estructura de Supabase
    mockSupabase = {
      auth: {
        getUser: mockAuthGetUser
      },
      // Mètodes encadenables (retornen 'this')
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      // Mètodes finals (retornen els nostres mocks controlats)
      maybeSingle: mockMaybeSingle,
      upsert: mockUpsert,
    }

    // C. Assignem al client
    vi.mocked(createClient).mockResolvedValue(
        mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>
    )
  })

  it('hauria de gestionar l\'error si no hi ha codi', async () => {
    const req = new NextRequest('http://localhost:3000/api/oauth/callback')
    
    await GET(req)

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.stringContaining('error=auth_failed')
    )
  })

  it('hauria de processar el callback de LinkedIn correctament', async () => {
    // 1. SETUP: Configurem els retorns utilitzant les variables directes
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
    mockMaybeSingle.mockResolvedValue({ data: { organization_id: 'org-1' }, error: null });
    mockUpsert.mockResolvedValue({ error: null });

    // 2. MOCK FETCH
    vi.mocked(fetch)
      .mockResolvedValueOnce({ 
        ok: true,
        json: async () => ({ access_token: 'fake-token', expires_in: 3600 })
      } as Response)
      .mockResolvedValueOnce({ 
        ok: true,
        json: async () => ({ sub: 'linkedin-id', name: 'User Name', picture: 'avatar.jpg' })
      } as Response)

    // 3. REQUEST
    const req = new NextRequest('http://localhost:3000/api/oauth/callback?code=abc&state=linkedin')

    // 4. EXECUTE
    await GET(req)

    // 5. ASSERT
    // Comprovem que s'ha cridat a la DB
    expect(mockSupabase.from).toHaveBeenCalledWith('social_connections')
    
    // Comprovem que s'ha fet l'upsert amb les dades correctes
    expect(mockUpsert).toHaveBeenCalledWith(expect.objectContaining({
      provider: 'linkedin',
      user_id: 'user-123',
      provider_page_name: 'User Name'
    }), expect.anything())

    // Comprovem redirecció final
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.stringContaining('connected=true')
    )
  })
})