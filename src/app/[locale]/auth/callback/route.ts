import { NextResponse } from 'next/server'
// El client de servidor que hem creat abans
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // si tenim un paràmetre "next", el fem servir per redirigir
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Si tot ha anat bé, redirigim a l'usuari cap al dashboard (o on volgués anar)
      // Afegim el locale per defecte si cal, o detectem.
      // Per ara hardcodegem 'ca', però l'ideal seria guardar-ho en cookie abans.
      return NextResponse.redirect(`${origin}/ca${next}`)
    }
  }

  // Si hi ha error, tornem al login amb un missatge
  return NextResponse.redirect(`${origin}/ca/auth/login?error=auth-code-error`)
}