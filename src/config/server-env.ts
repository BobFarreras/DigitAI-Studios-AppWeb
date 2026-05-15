/**
 * @file src/config/server-env.ts
 * @updated 2026-05-10
 * @summary Contracte d'entorn de servidor validat amb Zod.
 * @scope Lectura centralitzada de variables critiques i fail-fast en runtime server.
 */
import { z } from 'zod';

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_MAIN_ORG_ID: z.string().uuid(),
  NEXT_PUBLIC_APP_URL: z.url().optional(),
  ADMIN_EMAIL: z.email().optional(),
});

let cachedEnv: z.infer<typeof serverEnvSchema> | null = null;

export function getServerEnv() {
  if (cachedEnv) return cachedEnv;

  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`[server-env] Variables invalides o inexistents: ${issues}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
