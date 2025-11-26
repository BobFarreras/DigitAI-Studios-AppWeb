import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // El mètode `setAll` es va cridar des d'un Server Component.
            // Això pot passar si hi ha middleware refrescant la sessió,
            // però no podem setar cookies en un component de servidor pur 
            // que no sigui una Server Action o Route Handler.
            // Ho ignorem tranquil·lament.
          }
        },
      },
    }
  )
}