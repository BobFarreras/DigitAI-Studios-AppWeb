import { Octokit } from '@octokit/rest';
import { MasterConfig } from '@/types/config';

export class InfrastructureService {
  private octokit: Octokit;

  constructor() {
    const token = process.env.GITHUB_ACCESS_TOKEN;
    if (!token) throw new Error("❌ Missing GITHUB_ACCESS_TOKEN");
    this.octokit = new Octokit({ auth: token });
  }

  /**
   * 🛡️ SANITITZACIÓ CRÍTICA
   * Neteja la descripció per complir les regles estrictes de GitHub:
   * 1. Màxim 350 caràcters.
   * 2. Sense salts de línia ni caràcters de control.
   */
  private sanitizeGitHubDescription(description: string): string {
    if (!description) return "DigitAI PWA Project";
    
    return description
      .replace(/[\r\n\t\x00-\x1F\x7F]+/g, " ") // Reemplaça controls per espais
      .trim()
      .substring(0, 349); // Talla de seguretat
  }

  async createRepository(slug: string, rawDescription: string) {
    console.log(`🏭 [Infra] Clonant repo ${slug}...`);

    // Apliquem la neteja abans d'enviar a GitHub
    const safeDescription = this.sanitizeGitHubDescription(rawDescription);

    try {
      const { data } = await this.octokit.repos.createUsingTemplate({
        template_owner: process.env.GITHUB_TEMPLATE_OWNER!,
        template_repo: process.env.GITHUB_TEMPLATE_REPO!,
        owner: process.env.GITHUB_TARGET_ORG!,
        name: slug,
        private: false, // 🔒 Recomanat TRUE per defecte
        description: safeDescription,
        include_all_branches: false
      });

      return { id: data.id, html_url: data.html_url };
    } catch (error: unknown) {
      // Gestió d'errors tipada
      const errorMessage = error instanceof Error ? error.message : "Unknown GitHub Error";
      console.error(`❌ [GitHub] Error creant repo: ${errorMessage}`);
      throw new Error(`GitHub Create Failed: ${errorMessage}`);
    }
  }

  async waitForRepoReady(slug: string, attempts = 20): Promise<boolean> {
    const owner = process.env.GITHUB_TARGET_ORG!;

    for (let i = 0; i < attempts; i++) {
      try {
        // Intentem llegir el package.json per confirmar que s'ha clonat
        await this.octokit.repos.getContent({
          owner,
          repo: slug,
          path: 'package.json'
        });
        return true;
      } catch (e: unknown) {console.log(e)
        // Ignorem l'error mentre esperem
        console.log(`⏳ [Infra] Esperant GitHub... (${i + 1}/${attempts})`);
        await new Promise(r => setTimeout(r, 4000)); // 4 segons d'espera
      }
    }
    return false;
  }

  async uploadLogo(slug: string, file: File) {
    if (!file || file.size === 0) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const owner = process.env.GITHUB_TARGET_ORG!;
      const path = 'public/branding/logo.png';

      // Obtenim SHA si existeix (per fer update)
      let sha: string | undefined;
      try {
        const { data } = await this.octokit.repos.getContent({ owner, repo: slug, path });
        // TypeScript guard: comprovem que no sigui un array
        if (!Array.isArray(data)) {
          sha = data.sha;
        }
      } catch (e) {console.log(e)
        // Si falla és que no existeix, continuem sense SHA
      }

      await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo: slug,
        path,
        message: 'branding: update logo',
        content: buffer.toString('base64'),
        sha,
        committer: { name: 'DigitAI Bot', email: 'bot@digitai.studios' },
        author: { name: 'DigitAI Bot', email: 'bot@digitai.studios' }
      });
      console.log(`🖼️ [Infra] Logo pujat correctament.`);
    } catch (error: unknown) {
      console.error("⚠️ [Infra] Error pujant logo (no crític):", error);
    }
  }

  async injectConfig(slug: string, config: MasterConfig) {
    const configContent = `
import { MasterConfig } from '@/types/config';

export const CONFIG: MasterConfig = ${JSON.stringify(config, null, 2)};
`;
    const owner = process.env.GITHUB_TARGET_ORG!;
    const path = 'src/config/digitai.config.ts';
    
    let sha: string | undefined;
    try {
      const { data } = await this.octokit.repos.getContent({ owner, repo: slug, path });
      if (!Array.isArray(data)) sha = data.sha;
    } catch (e) { console.log(e) }

    try {
      await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo: slug,
        path,
        message: 'setup: inject configuration',
        content: Buffer.from(configContent).toString('base64'),
        sha,
        committer: { name: 'DigitAI Bot', email: 'bot@digitai.studios' },
        author: { name: 'DigitAI Bot', email: 'bot@digitai.studios' }
      });
      console.log(`⚙️ [Infra] Config injectada.`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown Error";
      throw new Error(`Config Injection Failed: ${msg}`);
    }
  }

  async deployToVercel(slug: string, orgId: string, repoId: number) {
    console.log(`🚀 [Infra] Desplegant a Vercel...`);

    const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;

    // 1. Definim variables d'entorn
    // Utilitzem Record<string, string> per evitar tipus 'any'
    const envVars: Record<string, string> = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      NEXT_PUBLIC_ORG_ID: orgId, // ✅ CRÍTIC
    };

    // Afegim opcionals només si existeixen
    if (process.env.CLIENT_RESEND_API_KEY) envVars['RESEND_API_KEY'] = process.env.CLIENT_RESEND_API_KEY;
    if (process.env.CLIENT_GEMINI_API_KEY) envVars['GEMINI_API_KEY'] = process.env.CLIENT_GEMINI_API_KEY;
    if (process.env.CLIENT_STRIPE_SECRET_KEY) envVars['STRIPE_SECRET_KEY'] = process.env.CLIENT_STRIPE_SECRET_KEY;
    if (process.env.CLIENT_STRIPE_WEBHOOK_SECRET) envVars['STRIPE_WEBHOOK_SECRET'] = process.env.CLIENT_STRIPE_WEBHOOK_SECRET;

    // 2. Crear Projecte a Vercel
    const createRes = await fetch('https://api.vercel.com/v9/projects', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${VERCEL_TOKEN}` },
      body: JSON.stringify({
        name: slug,
        framework: 'nextjs',
        gitRepository: { type: 'github', repo: `${process.env.GITHUB_TARGET_ORG}/${slug}` },
        environmentVariables: Object.entries(envVars).map(([key, value]) => ({
          key, value, target: ['production', 'preview', 'development'], type: 'encrypted'
        })),
      })
    });

    if (!createRes.ok) {
      const err = await createRes.json() as { error?: { code: string, message: string } };
      // Si el projecte ja existeix, no volem que peti tot el procés
      if (err.error?.code === 'project_already_exists') {
        console.warn(`⚠️ [Vercel] El projecte '${slug}' ja existeix. Continuem amb el deploy.`);
      } else {
        throw new Error(`Error Vercel Create: ${err.error?.message}`);
      }
    }

    // 3. Forçar Build (Deploy)
    const deployRes = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${VERCEL_TOKEN}` },
      body: JSON.stringify({
        name: slug,
        gitSource: { type: 'github', repoId: repoId, ref: 'main' },
        projectSettings: { framework: 'nextjs' }
      })
    });

    if (!deployRes.ok) {
      const err = await deployRes.json() as { error?: { message: string } };
      throw new Error(`Error Vercel Deploy: ${err.error?.message}`);
    }

    console.log(`✅ [Infra] Desplegament iniciat a Vercel.`);
  }
}

// Exportem una instància única
export const infrastructureService = new InfrastructureService();