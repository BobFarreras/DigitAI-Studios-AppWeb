import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

// 👇 Afegeix el genèric <Database> aquí
export async function updateSession(
  request: NextRequest, 
  response: NextResponse // ✅ Rebem la resposta del i18n
) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Això refresca el token si és necessari
  const { data: { user } } = await supabase.auth.getUser()

  // 🛡️ PROTECCIÓ DE RUTES
  // Si intenta accedir a /dashboard sense usuari -> Login
  if (request.nextUrl.pathname.includes('/dashboard') && !user) {
    // Detectem el locale actual de la URL per redirigir al login correcte
    const locale = request.nextUrl.pathname.split('/')[1] || 'ca';
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = `/${locale}/auth/login`
    return NextResponse.redirect(loginUrl)
  }

  return response
}