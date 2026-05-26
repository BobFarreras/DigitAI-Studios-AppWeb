import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
// 👇 Importem el client bàsic també
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { getServerEnv } from '@/config/server-env'

export async function createClient() {
  const serverEnv = getServerEnv();
  const cookieStore = await cookies()

  return createServerClient<Database>(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
  const serverEnv = getServerEnv();
  return createSupabaseClient<Database>(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
