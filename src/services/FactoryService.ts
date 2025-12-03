import { Octokit } from 'octokit';
import { generateConfigFileContent } from '@/lib/factory/config-generator';
import { MasterConfig } from '@/types/config';

// Definim una interfície mínima per a la resposta de getContent
// GitHub pot retornar un objecte o un array, nosaltres volem l'objecte amb SHA.
interface GitHubFileResponse {
  sha: string;
  content?: string;
}

export class FactoryService {
  private octokit: Octokit;
  private templateOwner: string;
  private templateRepo: string;

  constructor() {
    const token = process.env.GITHUB_ACCESS_TOKEN;
    if (!token) throw new Error("❌ Error Crític: Manca GITHUB_ACCESS_TOKEN a les variables d'entorn.");
    
    this.octokit = new Octokit({ auth: token });
    this.templateOwner = process.env.GITHUB_TEMPLATE_OWNER!;
    this.templateRepo = process.env.GITHUB_TEMPLATE_REPO!;

    if (!this.templateOwner || !this.templateRepo) {
        throw new Error("❌ Error Crític: Falten les variables d'entorn del Template (OWNER/REPO).");
    }
  }

  async createRepository(repoName: string, description: string) {
    console.log(`🏭 [Factory] Iniciant creació de ${repoName}...`);
    
    try {
      const { data } = await this.octokit.rest.repos.createUsingTemplate({
        template_owner: this.templateOwner,
        template_repo: this.templateRepo,
        name: repoName,
        description: description,
        owner: this.templateOwner,
        private: true,
        include_all_branches: false
      });
      
      console.log(`✅ [Factory] Repo creat: ${data.html_url}`);
      return data;
    } catch (error: unknown) {
      // Gestió d'errors tipada
      const err = error as { status?: number; message: string; response?: { data: unknown } };
      
      console.error("❌ [Factory] Error creant repo:", err.response?.data || err.message);
      
      if (err.status === 422) {
          throw new Error(`El nom del repositori '${repoName}' ja existeix o no és vàlid.`);
      }
      throw new Error(`No s'ha pogut crear el repositori: ${err.message}`);
    }
  }

  async injectConfiguration(repoName: string, configData: MasterConfig) {
    console.log(`💉 [Factory] Injectant configuració...`);

    const fileContent = generateConfigFileContent(configData);
    const contentEncoded = Buffer.from(fileContent).toString('base64');
    const path = 'src/config/digitai.config.ts'; 

    try {
      let sha: string | undefined;
      
      try {
          const { data } = await this.octokit.rest.repos.getContent({
            owner: this.templateOwner,
            repo: repoName,
            path: path,
          });
          
          // Type Guard: Si data és un array, no és el que volem (seria un directori)
          if (!Array.isArray(data)) {
             sha = data.sha;
          }
      } catch (e) {
          console.warn("⚠️ Fitxer config no trobat, creant de zero.");
      }

      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.templateOwner,
        repo: repoName,
        path: path,
        message: 'chore(setup): inject client configuration',
        content: contentEncoded,
        sha: sha,
        committer: { name: 'DigitAI Bot', email: 'bot@digitaistudios.com' }
      });

      console.log("✅ Configuració injectada.");
    } catch (error: unknown) {
        const err = error as Error;
        console.error("❌ Error injectant config:", err.message);
        throw new Error("Error tècnic injectant la configuració.");
    }
  }

  async uploadLogo(repoName: string, logoFile: File) {
    console.log(`🖼️ [Factory] Pujant logo...`);
    
    try {
        const arrayBuffer = await logoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentEncoded = buffer.toString('base64');
        const path = 'public/branding/logo.png'; 

        let sha: string | undefined;
        try {
            const { data } = await this.octokit.rest.repos.getContent({
                owner: this.templateOwner,
                repo: repoName,
                path,
            });
            if (!Array.isArray(data)) sha = data.sha;
        } catch (e) { /* Nou fitxer */ }

        await this.octokit.rest.repos.createOrUpdateFileContents({
            owner: this.templateOwner,
            repo: repoName,
            path,
            message: 'chore(branding): upload brand logo',
            content: contentEncoded,
            sha,
            committer: { name: 'DigitAI Bot', email: 'bot@digitaistudios.com' }
        });
        
        console.log("✅ Logo pujat.");
        return "/branding/logo.png"; 

    } catch (error: unknown) {
        const err = error as Error;
        console.error("❌ Error pujant logo:", err.message);
        // Retornem null o fallback, no petem el procés sencer
        return "/logo.png"; 
    }
  }
}