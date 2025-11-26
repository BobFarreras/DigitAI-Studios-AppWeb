import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
// 👇 Importem el client bàsic també
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { }
        },
      },
    }
  )
}

// 👇 NOVA FUNCIÓ: Client Admin (Bypass RLS)
// Aquest client NO fa servir cookies, fa servir la clau secreta
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // <--- Aquesta clau és CRÍTICA
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}