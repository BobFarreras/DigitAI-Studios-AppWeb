import { Octokit } from '@octokit/rest';
import { MasterConfig } from '@/types/config';

export class InfrastructureService {
  // 1. Canviem a propietat privada nullable (Lazy Loading)
  private _octokit: Octokit | null = null;

  constructor() {
    // 2. CONSTRUCTOR BUIT: Així no peta en arrencar el servidor/script
  }

  // 3. GETTER MÀGIC: Es connecta només quan realment ho necessites
  private get octokit(): Octokit {
    if (!this._octokit) {
      const token = process.env.GITHUB_ACCESS_TOKEN;
      if (!token) throw new Error("❌ Missing GITHUB_ACCESS_TOKEN: Revisa .env.local");
      this._octokit = new Octokit({ auth: token });
    }
    return this._octokit;
  }

  /**
   * 🛡️ SANITITZACIÓ CRÍTICA
   * Neteja la descripció per complir les regles estrictes de GitHub
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

    const safeDescription = this.sanitizeGitHubDescription(rawDescription);

    try {
      // 'this.octokit' crida al getter automàticament
      const { data } = await this.octokit.repos.createUsingTemplate({
        template_owner: process.env.GITHUB_TEMPLATE_OWNER!,
        template_repo: process.env.GITHUB_TEMPLATE_REPO!,
        owner: process.env.GITHUB_TARGET_ORG!, // O GITHUB_ORG segons el teu env
        name: slug,
        private: false, // 🔒 Recomanat TRUE per defecte (abans tenies false)
        description: safeDescription,
        include_all_branches: false
      });

      return { id: data.id, html_url: data.html_url };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown GitHub Error";
      console.error(`❌ [GitHub] Error creant repo: ${errorMessage}`);
      throw new Error(`GitHub Create Failed: ${errorMessage}`);
    }
  }

  async waitForRepoReady(slug: string, attempts = 20): Promise<boolean> {
    const owner = process.env.GITHUB_TARGET_ORG || process.env.GITHUB_ORG!;

    for (let i = 0; i < attempts; i++) {
      try {
        await this.octokit.repos.getContent({
          owner,
          repo: slug,
          path: 'package.json'
        });
        return true;
      } catch (e: unknown) {
        console.log(e)
        // Ignorem l'error mentre esperem
        console.log(`⏳ [Infra] Esperant GitHub... (${i + 1}/${attempts})`);
        await new Promise(r => setTimeout(r, 4000));
      }
    }
    return false;
  }

  async uploadLogo(slug: string, file: File) {
    if (!file || file.size === 0) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const owner = process.env.GITHUB_TARGET_ORG || process.env.GITHUB_ORG!;
      const path = 'public/branding/logo.png';

      let sha: string | undefined;
      try {
        const { data } = await this.octokit.repos.getContent({ owner, repo: slug, path });
        if (!Array.isArray(data)) {
          sha = data.sha;
        }
      } catch (e) {
           console.log(e)
        // Ignorem si no existeix
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

  // Mètode Legacy (per compatibilitat, tot i que usarem commitFiles)
  async injectConfig(slug: string, config: MasterConfig) {
    const configContent = `
import { MasterConfig } from '@/types/config';

export const CONFIG: MasterConfig = ${JSON.stringify(config, null, 2)};
`;
    const owner = process.env.GITHUB_TARGET_ORG || process.env.GITHUB_ORG!;
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

    const envVars: Record<string, string> = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      NEXT_PUBLIC_ORG_ID: orgId,
    };

    if (process.env.CLIENT_RESEND_API_KEY) envVars['RESEND_API_KEY'] = process.env.CLIENT_RESEND_API_KEY;
    if (process.env.CLIENT_GEMINI_API_KEY) envVars['GEMINI_API_KEY'] = process.env.CLIENT_GEMINI_API_KEY;
    if (process.env.CLIENT_STRIPE_SECRET_KEY) envVars['STRIPE_SECRET_KEY'] = process.env.CLIENT_STRIPE_SECRET_KEY;
    if (process.env.CLIENT_STRIPE_WEBHOOK_SECRET) envVars['STRIPE_WEBHOOK_SECRET'] = process.env.CLIENT_STRIPE_WEBHOOK_SECRET;

    const createRes = await fetch('https://api.vercel.com/v9/projects', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${VERCEL_TOKEN}` },
      body: JSON.stringify({
        name: slug,
        framework: 'nextjs',
        gitRepository: { type: 'github', repo: `${process.env.GITHUB_TARGET_ORG || process.env.GITHUB_ORG}/${slug}` },
        environmentVariables: Object.entries(envVars).map(([key, value]) => ({
          key, value, target: ['production', 'preview', 'development'], type: 'encrypted'
        })),
      })
    });

    if (!createRes.ok) {
      const err = await createRes.json() as { error?: { code: string, message: string } };
      if (err.error?.code === 'project_already_exists') {
        console.warn(`⚠️ [Vercel] El projecte '${slug}' ja existeix. Continuem amb el deploy.`);
      } else {
        throw new Error(`Error Vercel Create: ${err.error?.message}`);
      }
    }

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

  /**
   * ✅ NOU MÈTODE: Puja múltiples fitxers al GitHub d'una tacada.
   */
  async commitFiles(slug: string, files: Record<string, string>): Promise<void> {
    const owner = process.env.GITHUB_ORG || process.env.GITHUB_TARGET_ORG;
    if (!owner) throw new Error("GITHUB_ORG no definit");

    console.log(`📦 [INFRA] Pujant ${Object.keys(files).length} fitxers al repo: ${slug}...`);

    for (const [path, content] of Object.entries(files)) {
      try {
        let sha: string | undefined;
        try {
          const { data } = await this.octokit.repos.getContent({
            owner,
            repo: slug,
            path,
          });
          if (!Array.isArray(data) && data.sha) {
            sha = data.sha;
          }
        } catch (e) {
             console.log(e)
          // Ignorem 404
        }

        await this.octokit.repos.createOrUpdateFileContents({
          owner,
          repo: slug,
          path,
          message: `feat(factory): update ${path} generated by AI`,
          content: Buffer.from(content).toString('base64'),
          sha,
        });

        console.log(`   ✅ Fitxer creat: ${path}`);
      } catch (error) {
        console.error(`   ❌ Error pujant ${path}:`, error);
        throw new Error(`Error escrivint al GitHub: ${path}`);
      }
    }
  }
}