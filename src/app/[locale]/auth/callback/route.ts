import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SupabaseProfileRepository } from '@/repositories/supabase/SupabaseProfileRepository';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  
  // Assegura't de tenir l'ID de l'organització disponible
  const MAIN_ORG_ID = process.env.NEXT_PUBLIC_MAIN_ORG_ID;

  if (code) {
    const supabase = await createClient();
    
    // 1. Intercanviem el codi per la sessió (Auth Global)
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // ✅ NOVA LÒGICA: AUTO-JOIN PER A OAUTH (GOOGLE)
      if (MAIN_ORG_ID) {
        try {
          // A. Recuperem l'usuari que acaba d'entrar
          const { data: { user } } = await supabase.auth.getUser();

          if (user && user.email) {
            const profileRepo = new SupabaseProfileRepository();
            
            // B. Comprovem si té perfil en aquesta Org
            const existingProfile = await profileRepo.findByEmailAndOrg(user.email, MAIN_ORG_ID);

            if (!existingProfile) {
              console.log(`⚠️ OAuth Login: Usuari ${user.email} sense perfil. Creant vincle automàtic...`);
              
              // C. Creem el perfil automàticament
              // Google sol tenir el nom a user_metadata.full_name o .name
              const fullName = user.user_metadata.full_name || user.user_metadata.name || user.email.split('@')[0];
              
              await profileRepo.createProfile(user.id, user.email, MAIN_ORG_ID, fullName);
            }
          }
        } catch (profileError) {
          console.error("❌ Error en Auto-Join OAuth:", profileError);
          // Opcional: Podríem redirigir a error, però millor deixar que entri i que el middleware o dashboard gestionin l'error si falta el perfil.
        }
      }

      // Redirecció final
      return NextResponse.redirect(`${origin}/ca${next}`);
    }
  }

  // Error en l'intercanvi de codi
  return NextResponse.redirect(`${origin}/ca/auth/login?error=auth-code-error`);
}