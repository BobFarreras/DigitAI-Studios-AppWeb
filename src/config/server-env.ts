/**
 * @file src/config/server-env.ts
 * @updated 2026-05-25
 * @summary Contracte d'entorn de servidor validat amb Zod. Variables opcionals no bloquegen les crítiques.
 * @scope Lectura centralitzada de variables critiques i fail-fast en runtime server.
 */
import { z } from 'zod';

const optionalUrl = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.url().optional(),
);

const optionalEmail = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.email().optional(),
);

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_MAIN_ORG_ID: z.string().uuid(),
  NEXT_PUBLIC_APP_URL: optionalUrl,
  ADMIN_EMAIL: optionalEmail,
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
