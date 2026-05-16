import { Octokit } from '@octokit/rest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Definim tipus estrictes per als resultats
export interface DestructionResult {
  vercel: string;
  github: string;
  supabase: string;
  success: boolean;
}

interface ApiError {
  status?: number;
  message?: string;
}

// Interfície mínima per la resposta de Vercel
interface VercelProjectResponse {
  id: string;
  name: string;
}

export class DestructionService {
  private octokit: Octokit;
  private supabase: SupabaseClient;
  
  // Variables d'entorn
  private readonly GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
  private readonly TARGET_ORG = process.env.GITHUB_TARGET_ORG;
  private readonly SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  private readonly SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  private readonly VERCEL_TOKEN = process.env.VERCEL_TOKEN;

  constructor() {
    if (!this.GITHUB_TOKEN || !this.SUPABASE_URL || !this.SUPABASE_SERVICE_KEY || !this.VERCEL_TOKEN) {
      throw new Error("❌ Error Fatal: Falten variables d'entorn al servidor.");
    }

    this.octokit = new Octokit({ auth: this.GITHUB_TOKEN });
    this.supabase = createClient(this.SUPABASE_URL, this.SUPABASE_SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }

  // Mètode principal que orquestra tot
  async destroyClient(repoName: string): Promise<DestructionResult> {
    const vercelLog = await this.destroyVercel(repoName);
    const githubLog = await this.destroyGitHub(repoName);
    const supabaseLog = await this.destroySupabase(repoName);

    return {
      success: true,
      vercel: vercelLog,
      github: githubLog,
      supabase: supabaseLog
    };
  }

  // --- MÈTODES PRIVATS (Lògica del teu script adaptada) ---

  private async destroyVercel(name: string): Promise<string> {
    try {
      // 1. Buscar projecte
      const getRes = await fetch(`https://api.vercel.com/v9/projects/${name}`, {
        headers: { 'Authorization': `Bearer ${this.VERCEL_TOKEN}` }
      });

      if (getRes.status === 404) return "🔸 No existeix a Vercel.";
      
      // Cast segur
      const project = (await getRes.json()) as VercelProjectResponse;

      // 2. Eliminar projecte
      const delRes = await fetch(`https://api.vercel.com/v9/projects/${project.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${this.VERCEL_TOKEN}` }
      });

      if (delRes.ok) return "✅ Eliminat de Vercel.";
      return `❌ Error Vercel: ${await delRes.text()}`;
    } catch (error: unknown) {
      return `❌ Error Connexió Vercel: ${this.formatError(error)}`;
    }
  }

  private async destroyGitHub(name: string): Promise<string> {
    try {
      await this.octokit.repos.delete({
        owner: this.TARGET_ORG!,
        repo: name
      });
      return "✅ Eliminat de GitHub.";
    } catch (error: unknown) {
      const e = error as ApiError; // Type Assertion controlada
      if (e.status === 404) return "🔸 No existeix a GitHub.";
      return `❌ Error GitHub: ${e.message || 'Desconegut'}`;
    }
  }

  private async destroySupabase(slug: string): Promise<string> {
    try {
      // 1. Buscar Organització
      const { data: org } = await this.supabase
        .from('organizations')
        .select('id')
        .eq('slug', slug)
        .single();

      if (!org) return "⚠️ No s'ha trobat l'organització a Supabase.";

      const orgId = org.id;
      
      // 2. Neteja en cascada (Llista del teu script)
      const dependentTables = [
        'order_items', 'orders', 'bookings', 'services', 
        'products', 'posts', 'profiles', 'projects'
      ];

      const logs: string[] = [];

      for (const table of dependentTables) {
        const { error } = await this.supabase
          .from(table)
          .delete()
          .eq('organization_id', orgId);
        
        if (error) logs.push(`Error ${table}: ${error.message}`);
      }

      // 3. Esborrar el pare
      const { error: orgError } = await this.supabase
        .from('organizations')
        .delete()
        .eq('id', orgId);

      if (orgError) return `❌ Error Fatal Supabase: ${orgError.message}`;
      
      return "✅ Dades i Organització eliminades.";
    } catch (error: unknown) {
      return `❌ Error Inesperat Supabase: ${this.formatError(error)}`;
    }
  }

  // Helper per evitar 'any' als catch
  private formatError(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }
}