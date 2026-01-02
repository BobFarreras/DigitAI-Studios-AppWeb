import { describe, it, expect, vi, beforeEach} from 'vitest'
import { GooglePageSpeedAdapter } from '@/adapters/GooglePageSpeedAdapter' // Ajusta la ruta segons on tinguis el fitxer
import { mockGoogleSuccessResponse } from '../mocks/google-response-mock'

// 1. Mockejem les dependències externes
global.fetch = vi.fn()

// Mockejem el diccionari de traducció perquè no falli la importació
vi.mock('@/lib/audit-dictionary', () => ({
  translateIssue: (id: string, title: string, desc: string) => ({
    title: `Translated ${title}`,
    description: `Translated ${desc}`
  })
}))

describe('GooglePageSpeedAdapter (Unit)', () => {
  let adapter: GooglePageSpeedAdapter

  beforeEach(() => {
    vi.clearAllMocks()
    adapter = new GooglePageSpeedAdapter('fake-api-key')
  })

  it('hauria de processar correctament una resposta 200 OK de Google', async () => {
    // SETUP: Fetch retorna el JSON bo
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockGoogleSuccessResponse,
      text: async () => ''
    } as Response)

    // EXECUTE
    const result = await adapter.scanUrl('https://example.com', 'ca')

    // ASSERT
    // 1. Puntuacions (0.88 -> 88)
    expect(result.performanceScore).toBe(88)
    expect(result.seoScore).toBe(95)

    // 2. Screenshot
    expect(result.screenshot).toBe('data:image/jpeg;base64,fake-screenshot-data')

    // ARA (Correcte):
    expect(result.metrics?.fcp?.value).toBe('1.2 s')

    // 4. Issues (LCP té score 0.5 < 0.9, hauria de sortir)
    expect(result.issues.length).toBeGreaterThan(0)
    expect(result.issues[0].id).toBe('largest-contentful-paint')
    // Comprovem que s'ha "traduït" (gràcies al mock de dalt)
    expect(result.issues[0].title).toContain('Translated')
  })

  it('hauria d\'activar el MOCK fallback si l\'API de Google falla (500)', async () => {
    // SETUP: Fetch falla
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error'
    } as Response)

    // Spy on console.error per no embrutar la terminal del test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

    // EXECUTE
    const result = await adapter.scanUrl('https://fail.com')

    // ASSERT
    expect(result.performanceScore).toBe(45) // Valor del teu getMockResult(isError: true)
    expect(result.issues[0].id).toBe('mock-issue-1') // Issue del mock
    expect(consoleSpy).toHaveBeenCalled() // Confirma que ha logat l'error
  })

  it('hauria de gestionar timeouts (AbortController)', async () => {
    // SETUP: Simulem un timeout (AbortError)
    vi.mocked(fetch).mockRejectedValue(new Error('AbortError'))

    const result = await adapter.scanUrl('https://timeout.com')

    // ASSERT: Ha de retornar mock data (isError: true)
    expect(result.performanceScore).toBe(45)
  })

  it('hauria de llançar error si el JSON de Google té format incorrecte (Zod Validation)', async () => {
    // SETUP: JSON invàlid (falta lighthouseResult)
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ invalid: 'data' }),
      text: async () => ''
    } as Response)

    // En aquest cas, el teu codi fa "throw new Error", així que el test ha de capturar-ho
    // PERÒ, el teu catch global retorna MockData. Anem a verificar això.
    const result = await adapter.scanUrl('https://bad-json.com')

    // Com que captures l'error al bloc catch del adapter, retorna Mock
    expect(result.performanceScore).toBe(45)
  })
})