Aquí tens la Guia Tècnica Completa en format Markdown. Pots copiar aquest bloc sencer i passar-lo directament al teu equip de desenvolupament o al teu agent d'IA perquè implementi la lògica dins del SaaS.

Markdown

# 🏭 Especificació Tècnica: DigitAI Factory Core (SaaS Integration)

**Objectiu:** Implementar el motor de creació automàtica de clients ("The Factory") dins de l'aplicació principal `digitaistudios.com`.
**Estat Actual:** Lògica validada via scripts locals (`test-factory-clone.ts`).
**Destí:** Migració a Next.js App Router (`Service Layer` + `API Route`).

---

## 1. Variables d'Entorn Requerides

Aquestes variables s'han de configurar a **Vercel** (projecte `digitaistudios`) i al fitxer `.env` local per al desenvolupament.

```env
# --- 🛠️ INFRAESTRUCTURA (PODERS D'ADMIN) ---
# GitHub: Per clonar i modificar el template
GITHUB_ACCESS_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_TEMPLATE_OWNER=DigitAI-Clients
GITHUB_TEMPLATE_REPO=digitai-master-template
GITHUB_TARGET_ORG=DigitAI-Clients

# Vercel: Per crear projectes i desplegar
VERCEL_TOKEN=xxxxxxxxxxxx

# Supabase: Per gestionar la Base de Dades Multi-tenant
# ⚠️ Ha de ser la clau SERVICE_ROLE per poder crear usuaris admin programàticament
NEXT_PUBLIC_SUPABASE_URL=[https://xxxxxxxx.supabase.co](https://xxxxxxxx.supabase.co)
SUPABASE_SERVICE_ROLE_KEY=eyJh...... 

# --- 🔑 CLAUS PER INJECTAR ALS NOUS CLIENTS ---
# Aquestes s'injectaran automàticament als projectes fills
CLIENT_RESEND_API_KEY=re_xxxxxx
CLIENT_GEMINI_API_KEY=AIzaSyxxxxxx
CLIENT_STRIPE_SECRET_KEY=sk_test_xxxx
CLIENT_STRIPE_WEBHOOK_SECRET=whsec_xxxx
CLIENT_EMAIL_FROM="no-reply@digitai.app"
2. Service Layer (src/lib/factory/factory.service.ts)
Aquest servei encapsula tota la lògica de negoci. Separar-ho del controlador permet reutilitzar-ho (ex: via Webhook de Stripe o via Formulari Intern).
```
TypeScript

import { Octokit } from '@octokit/rest';
import { createClient } from '@supabase/supabase-js';

// 1. Inicialització de Clients
const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

// Utilitzem Service Role per saltar-nos les RLS i crear usuaris
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

interface ProvisionOptions {
  clientName: string;
  adminEmail: string;
}

export class FactoryService {
  
  /**
   * PAS 1: Configurar Base de Dades i Usuari
   */
  async setupDatabase(name: string, slug: string, email: string) {
    console.log(`[Factory] 1. DB Setup for ${slug}`);
    
    // A. Crear Organització
    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert([{ name, slug, created_at: new Date().toISOString() }])
      .select('id')
      .single();
      
    if (orgError) throw new Error(`Supabase Org Error: ${orgError.message}`);

    // B. Crear Usuari Admin
    const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!';
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: `Admin ${name}` }
    });

    if (userError) throw new Error(`Supabase Auth Error: ${userError.message}`);

    // C. Vincular Usuari a Organització (Opcional: depèn de la teva taula 'members')
    // await supabaseAdmin.from('members').insert({ user_id: user.user.id, organization_id: org.id, role: 'owner' });

    return { orgId: org.id, userId: user.user.id, tempPassword };
  }

  /**
   * PAS 2: Clonar Repositori des del Template
   */
  async cloneRepository(repoName: string) {
    console.log(`[Factory] 2. Cloning to ${repoName}`);
    
    const { data } = await octokit.repos.createUsingTemplate({
      template_owner: process.env.GITHUB_TEMPLATE_OWNER!,
      template_repo: process.env.GITHUB_TEMPLATE_REPO!,
      owner: process.env.GITHUB_TARGET_ORG!,
      name: repoName,
      private: false, // Canviar a true si tens Vercel Pro
      include_all_branches: false
    });
    
    return { repoId: data.id, htmlUrl: data.html_url };
  }

  /**
   * PAS 3: Injectar Configuració Personalitzada (Type-Safe)
   */
  async injectConfig(repoName: string, orgId: string, clientName: string) {
    console.log(`[Factory] 3. Injecting Config`);
    const FILE_PATH = 'src/config/digitai.config.ts';
    const domain = clientName.toLowerCase().replace(/[^a-z0-9]/g, '-') + ".digitai.app";
    const year = new Date().getFullYear();

    // Generació del contingut del fitxer
    const configContent = `
import { MasterConfig } from '@/types/config';

export const CONFIG: MasterConfig = {
  organizationId: "${orgId}",
  identity: {
    name: "${clientName}",
    description: "Web oficial de ${clientName}",
    logoUrl: "/logo.png",
    faviconUrl: "/favicon.ico",
    contactEmail: "info@${domain}",
    address: "Carrer de la Tecnologia, 123"
  },
  branding: {
    colors: {
      primary: "#2563eb", secondary: "#f59e0b",
      background: "#ffffff", foreground: "#0f172a",
    },
    radius: 0.5,
  },
  modules: {
    layout: { variant: 'modern', stickyHeader: true },
    landing: { active: true, sections: ['hero', 'features', 'contact'] },
    auth: { active: true, allowPublicRegistration: false, redirects: { admin: '/dashboard', client: '/my-account' } },
    dashboard: true, booking: true, ecommerce: false, blog: true, inventory: false, accessControl: true
  },
  i18n: { locales: ['ca', 'es'], defaultLocale: 'ca' },
  footer: {
    columns: [
      { title: "Legal", links: [{ label: "Privacitat", href: "/privacy" }] }
    ],
    socials: { twitter: "[https://twitter.com](https://twitter.com)" },
    bottomText: "© ${year} ${clientName}. Powered by DigitAI."
  }
};`;

    // Buscar SHA actual per fer update
    let currentSha: string | undefined;
    try {
        // Petita espera per consistència de GitHub API
        await new Promise(r => setTimeout(r, 2000));
        const { data } = await octokit.repos.getContent({
            owner: process.env.GITHUB_TARGET_ORG!,
            repo: repoName,
            path: FILE_PATH
        });
        if (!Array.isArray(data) && data.sha) currentSha = data.sha;
    } catch (e) { /* Ignorar 404 si és nou */ }

    // Escriure fitxer
    await octokit.repos.createOrUpdateFileContents({
        owner: process.env.GITHUB_TARGET_ORG!,
        repo: repoName,
        path: FILE_PATH,
        message: '⚙️ Setup: Injecció de configuració',
        content: Buffer.from(configContent).toString('base64'),
        sha: currentSha,
        committer: { name: 'DigitAI Bot', email: 'bot@digitai.studios' },
        author: { name: 'DigitAI Bot', email: 'bot@digitai.studios' }
    });
  }

  /**
   * PAS 4: Desplegar a Vercel
   */
  async deploy(repoName: string, orgId: string, repoId: number) {
    console.log(`[Factory] 4. Vercel Deploy`);
    
    // Variables d'entorn injectades al client
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // O la clau específica del client
      NEXT_PUBLIC_ORG_ID: orgId,
      RESEND_API_KEY: process.env.CLIENT_RESEND_API_KEY!,
      EMAIL_FROM_ADDRESS: process.env.CLIENT_EMAIL_FROM!,
      GEMINI_API_KEY: process.env.CLIENT_GEMINI_API_KEY!,
      GOOGLE_GENERATIVE_AI_API_KEY: process.env.CLIENT_GEMINI_API_KEY!, // Doble check per SDKs
      STRIPE_SECRET_KEY: process.env.CLIENT_STRIPE_SECRET_KEY!,
      STRIPE_WEBHOOK_SECRET: process.env.CLIENT_STRIPE_WEBHOOK_SECRET!
    };

    // A. Crear Projecte
    const createRes = await fetch('[https://api.vercel.com/v9/projects](https://api.vercel.com/v9/projects)', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.VERCEL_TOKEN}` },
        body: JSON.stringify({
            name: repoName,
            framework: 'nextjs',
            gitRepository: { type: 'github', repo: `${process.env.GITHUB_TARGET_ORG}/${repoName}` },
            environmentVariables: Object.entries(envVars).map(([key, value]) => ({
                key, value, target: ['production', 'preview', 'development'], type: 'encrypted'
            })),
        })
    });
    
    if (!createRes.ok) throw new Error(`Vercel Create Error: ${await createRes.text()}`);

    // B. Trigger Build
    const deployRes = await fetch('[https://api.vercel.com/v13/deployments](https://api.vercel.com/v13/deployments)', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.VERCEL_TOKEN}` },
        body: JSON.stringify({
            name: repoName,
            gitSource: { type: 'github', repoId: repoId, ref: 'main' },
            projectSettings: { framework: 'nextjs' }
        })
    });

    if (!deployRes.ok) throw new Error(`Vercel Deploy Error: ${await deployRes.text()}`);
    
    return await deployRes.json();
  }
}
3. API Route Handler (src/app/api/provision/route.ts)
Punt d'entrada que connecta el Frontend (Formulari) amb el Service Layer.

TypeScript

import { NextResponse } from 'next/server';
import { FactoryService } from '@/lib/factory/factory.service';

// ⚠️ Augmentem el timeout perquè el procés pot trigar > 30s
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessName, email } = body;

    // 1. Validació
    if (!businessName || !email) {
      return NextResponse.json({ error: 'Missing businessName or email' }, { status: 400 });
    }

    // 2. Preparació
    const slug = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);
    const factory = new FactoryService();

    // 3. Execució de la Pipeline
    // Pas 1: DB & User
    const { orgId, userId, tempPassword } = await factory.setupDatabase(businessName, slug, email);
    
    // Pas 2: GitHub Repo
    const { repoId } = await factory.cloneRepository(slug);
    
    // Pas 3: Injectar Config
    await factory.injectConfig(slug, orgId, businessName);
    
    // Pas 4: Desplegar a Vercel
    const deployment = await factory.deploy(slug, orgId, repoId);

    // 4. Retorn Final
    return NextResponse.json({
      success: true,
      data: {
        websiteUrl: `https://${slug}.vercel.app`,
        dashboardUrl: `https://${slug}.vercel.app/dashboard`,
        admin: {
            email: email,
            password: tempPassword
        },
        deploymentId: deployment.id
      }
    });

  } catch (error: any) {
    console.error('❌ PROVISIONING FAILED:', error);
    return NextResponse.json({ 
        success: false, 
        error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}
4. Notes d'Implementació
Seguretat: Aquesta API Route (POST /api/provision) ha d'estar protegida. Si és pública, qualsevol podria crear webs infinites. Recomanació: Protegir amb un Middleware que requereixi un "Admin Token" o que només es pugui cridar des del servidor de pagaments (Webhook).

Timeouts: Si utilitzes Vercel Hobby, el límit de les Serverless Functions és de 10 segons. Aquest script en triga uns 45. Necessitaràs Vercel Pro o moure aquesta lògica a Inngest o Trigger.dev (Background Jobs).

Gestió de Correu: En aquest exemple, retornem la contrasenya temporal al JSON. En producció, el millor seria utilitzar Resend per enviar un email al client: "Benvingut! Aquí tens la teva web i la teva contrasenya temporal."