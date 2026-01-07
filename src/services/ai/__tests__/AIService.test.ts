import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIService } from '../AIService';

// 1. Definim els espies (Spies)
const mockAnalyzeGemini = vi.fn();
const mockAnalyzeOpenAI = vi.fn();

// 2. MOCKEJEM LES CLASSES (Igual que abans)
vi.mock('../providers/GeminiProvider', () => {
  return {
    GeminiProvider: class {
      providerName = 'MockGemini';
      analyzeBusiness = mockAnalyzeGemini;
      generateContent = vi.fn();
    }
  };
});

vi.mock('../providers/OpenAIProvider', () => {
  return {
    OpenAIProvider: class {
      providerName = 'MockOpenAI';
      analyzeBusiness = mockAnalyzeOpenAI;
      generateContent = vi.fn();
    }
  };
});

describe('AIService (Prompt Engineering Logic)', () => {
  let service: AIService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AIService();
  });

  // TEST 1: Verificar lògica VIP
  it('should inject VIP context AND Anti-Redundancy rules for Prestige URLs', async () => {
    // URL que tens a la config (assegura't que coincideix amb src/config/prestige.ts)
    const vipUrl = 'https://digitaistudios.com'; 
    const pageText = 'Som una agència digital amb botiga online.';

    mockAnalyzeGemini.mockResolvedValue([]);

    await service.analyzeBusinessOpportunity(vipUrl, pageText);

    // Recuperem el prompt enviat
    expect(mockAnalyzeGemini).toHaveBeenCalledTimes(1);
    const promptSent = mockAnalyzeGemini.mock.calls[0][1];

    // ✅ 1. Ha de tenir el context VIP
    expect(promptSent).toContain("CLIENT VIP"); 
    expect(promptSent).toContain("CAS D'ÈXIT");

    // ✅ 2. Ha de tenir la lògica Anti-Lorito (Detecció)
    expect(promptSent).toContain("FASE 1: DETECCIÓ");
    expect(promptSent).toContain("REGLES D'EXCLUSIÓ");
  });

  // TEST 2: Verificar lògica Normal (No VIP)
  it('should inject ONLY Anti-Redundancy rules for normal URLs', async () => {
    const normalUrl = 'https://una-web-qualsevol.com';
    const pageText = 'Text de prova amb paraula cistella.';

    mockAnalyzeGemini.mockResolvedValue([]);

    await service.analyzeBusinessOpportunity(normalUrl, pageText);

    const promptSent = mockAnalyzeGemini.mock.calls[0][1];
    
    // ❌ 1. NO ha de tenir context VIP
    expect(promptSent).not.toContain("CLIENT VIP");

    // ✅ 2. Ha de tenir la lògica Anti-Lorito (Igualment important per webs normals)
    expect(promptSent).toContain("FASE 1: DETECCIÓ");
    expect(promptSent).toContain("REGLES D'EXCLUSIÓ");
    
    // ✅ 3. Verifiquem que el text original hi és
    expect(promptSent).toContain(pageText);
  });
});