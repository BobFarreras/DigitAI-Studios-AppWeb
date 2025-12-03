import { Octokit } from 'octokit';
import { generateConfigFileContent } from '@/lib/factory/config-generator';
import { MasterConfig } from '@/types/config';

type OctokitError = {
  status: number;
  message: string;
  response?: { data: unknown };
};

export class FactoryService {
  private octokit: Octokit;
  private templateOwner: string;
  private templateRepo: string;
  private targetOrg: string;

  constructor() {
    const token = process.env.GITHUB_ACCESS_TOKEN;
    if (!token) throw new Error("❌ Error Crític: Manca GITHUB_ACCESS_TOKEN.");
    
    this.octokit = new Octokit({ auth: token });
    this.templateOwner = process.env.GITHUB_TEMPLATE_OWNER!;
    this.templateRepo = process.env.GITHUB_TEMPLATE_REPO!;
    this.targetOrg = process.env.GITHUB_TARGET_ORG || this.templateOwner;

    if (!this.templateOwner || !this.templateRepo) {
        throw new Error("❌ Error Crític: Falten les variables d'entorn del Template.");
    }
  }

  // 1. Crear Repositori
  async createRepository(repoName: string, description: string) {
    console.log(`🏭 [Factory] Creant repo a ${this.targetOrg}/${repoName}...`);
    try {
      const { data } = await this.octokit.rest.repos.createUsingTemplate({
        template_owner: this.templateOwner,
        template_repo: this.templateRepo,
        name: repoName,
        description: description,
        owner: this.targetOrg,
        private: true,
        include_all_branches: false
      });
      console.log(`✅ [Factory] Repo creat: ${data.html_url}`);
      return data;
    } catch (error: unknown) {
      const err = error as OctokitError;
      console.error("❌ [Factory] Error creant repo:", err.response?.data || err.message);
      if (err.status === 422) throw new Error(`El repositori '${repoName}' ja existeix.`);
      throw new Error(`Error API GitHub: ${err.message}`);
    }
  }

  // 2. Helper per obtenir el SHA
  async getFileSha(repoName: string, path: string): Promise<string | undefined> {
    try {
        const { data } = await this.octokit.rest.repos.getContent({
            owner: this.targetOrg,
            repo: repoName,
            path: path,
        });
        
        if (!Array.isArray(data) && 'sha' in data) {
            return data.sha;
        }
    } catch (error: unknown) {
        const err = error as OctokitError;
        if (err.status !== 404) throw err;
    }
    return undefined;
  }

  // 3. Injectar Configuració (AMB RETRY ROBUST)
  async injectConfiguration(repoName: string, configData: MasterConfig) {
    console.log(`💉 [Factory] Injectant config a ${this.targetOrg}/${repoName}...`);

    const fileContent = generateConfigFileContent(configData);
    const contentEncoded = Buffer.from(fileContent).toString('base64');
    const path = 'src/config/digitai.config.ts';

    try {
      // 🔄 LÒGICA DE REINTENT PER OBTENIR EL SHA
      // Sabem que el fitxer existeix (ve del template). Si l'API diu 404, és lag.
      // Insistim fins a 5 vegades (5 segons) per aconseguir el SHA.
      let sha: string | undefined;
      
      for (let i = 0; i < 5; i++) {
          sha = await this.getFileSha(repoName, path);
          
          if (sha) {
              console.log(`🔹 SHA trobat a l'intent ${i + 1}: ${sha.substring(0, 7)}`);
              break; 
          }
          
          console.log(`⏳ Esperant indexació de GitHub per al config... (${i + 1}/5)`);
          await new Promise(resolve => setTimeout(resolve, 1500)); // Esperem 1.5s
      }

      if (!sha) {
          throw new Error("Impossible obtenir el SHA del fitxer de configuració original. GitHub va massa lent.");
      }

      // Ara que tenim el SHA segur, fem l'update
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.targetOrg,
        repo: repoName,
        path: path,
        message: 'chore(setup): inject client configuration',
        content: contentEncoded,
        sha: sha, // AQUI SEMPRE HI HAURÀ VALOR
        committer: { name: 'DigitAI Bot', email: 'bot@digitaistudios.com' }
      });

      console.log("✅ [Factory] Configuració injectada.");
    } catch (error: unknown) {
        const err = error as Error;
        console.error("❌ [Factory] Error injectant config:", err.message);
        throw new Error(`Error injectant config: ${err.message}`);
    }
  }

  // 4. Pujar Logo (També podem aplicar un petit retry si calgués, però normalment falla menys)
  async uploadLogo(repoName: string, logoFile: File) {
    console.log(`🖼️ [Factory] Pujant logo a ${this.targetOrg}/${repoName}...`);
    try {
        const arrayBuffer = await logoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentEncoded = buffer.toString('base64');
        const path = 'public/branding/logo.png'; 

        const sha = await this.getFileSha(repoName, path);

        await this.octokit.rest.repos.createOrUpdateFileContents({
            owner: this.targetOrg,
            repo: repoName,
            path,
            message: 'chore(branding): upload brand logo',
            content: contentEncoded,
            sha,
            committer: { name: 'DigitAI Bot', email: 'bot@digitaistudios.com' }
        });
        
        console.log("✅ [Factory] Logo pujat.");
        return "/branding/logo.png"; 
    } catch (error: unknown) {
        const err = error as Error;
        console.error("❌ [Factory] Error pujant logo:", err.message);
        return "/logo.png"; 
    }
  }
}