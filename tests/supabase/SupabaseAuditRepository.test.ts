import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseAuditRepository } from '@/repositories/supabase/SupabaseAuditRepository'; // Ajusta el path si cal
// 1. Definim els mocks finals (els que assertarem)
const mockSingle = vi.fn();

// 2. Definim les cadenes intermitges per separat per evitar conflictes
// Cadena per a SELECT: eq(...) -> retorna objecte amb .single()
const mockEqSelect = vi.fn().mockReturnValue({
  single: mockSingle,
  order: vi.fn().mockResolvedValue({ data: [], error: null })
});

// Cadena per a DELETE: eq(...) -> retorna resultat final directament
const mockEqDelete = vi.fn().mockReturnValue({
  error: null
});

// 3. Mockejem el mòdul sencer
vi.mock('@/lib/supabase/server', () => ({
  // Client Normal
  createClient: vi.fn(() => ({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: mockEqSelect, // Usem la versió de Select
        order: vi.fn().mockResolvedValue({ data: [], error: null }) 
      })
    })
  })),

  // Client Admin
  createAdminClient: vi.fn(() => ({
    from: vi.fn().mockReturnValue({
      // Lògica SELECT (necessita .single)
      select: vi.fn().mockReturnValue({
        eq: mockEqSelect // Usem la versió de Select
      }),
      
      // Lògica DELETE (NO té .single, retorna error directament)
      delete: vi.fn().mockReturnValue({
        eq: mockEqDelete // Usem la versió de Delete
      }),

      // Lògica INSERT
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
            single: mockSingle
        })
      })
    })
  }))
}));

describe('SupabaseAuditRepository (Admin Mode)', () => {
  let repo: SupabaseAuditRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repo = new SupabaseAuditRepository();
  });

  it('should fetch an audit by ID using Admin Client and map correctly', async () => {
    // ARRANGE: Simulem una fila de la DB (snake_case)
    const mockDbRow = { 
        id: '123', 
        url: 'https://test.com', 
        status: 'completed',
        email: 'admin@test.com',
        seo_score: 90,
        performance_score: 85,
        created_at: '2023-01-01T12:00:00Z',
        report_data: { foo: 'bar' }
    };
    
    // Simulem que .single() retorna aquesta fila
    mockSingle.mockResolvedValue({ data: mockDbRow, error: null });

    // ACT
    const result = await repo.getAuditByIdAdmin('123');

    // ASSERT
    // Verifiquem la TRANSFORMACIÓ (DB -> DTO)
    expect(result).toEqual({
        id: '123',
        url: 'https://test.com',
        status: 'completed',
        email: 'admin@test.com',
        seoScore: 90,           
        performanceScore: 85,   
        createdAt: new Date('2023-01-01T12:00:00Z'), 
        reportData: { foo: 'bar' }
    });
  });

  it('should delete an audit using Admin Client', async () => {
      // ARRANGE
      // mockEqDelete ja està configurat a dalt per retornar { error: null }

      // ACT
      await repo.deleteAudit('audit-id-tobedeleted');

      // ASSERT
      // Verifiquem que s'ha cridat al eq() específic del delete
      expect(mockEqDelete).toHaveBeenCalledWith('id', 'audit-id-tobedeleted');
  });
});