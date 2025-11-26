import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Crea un client de Supabase pel navegador.
  // Utilitza les variables d'entorn públiques.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}