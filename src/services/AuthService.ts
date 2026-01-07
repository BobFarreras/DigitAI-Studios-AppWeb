import { createClient } from '@/lib/supabase/server';
import { SupabaseProfileRepository } from '@/repositories/supabase/SupabaseProfileRepository';
import { AUTH_ERRORS, mapSupabaseError } from '@/lib/auth/errors';

export class AuthService {
  constructor(private profileRepo: SupabaseProfileRepository) {}

  // ==========================================================
  // 1️⃣ LOGIC DE LOGIN (Filtratge per Org)
  // ==========================================================
  async login(formData: FormData, orgId: string) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    // A. Autenticació Tècnica (Supabase Global)
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, error: mapSupabaseError(error.message) };
    }

    // B. Autorització de Negoci (La nostra taula Profiles)
    // Comprovem si aquest email té accés a l'organització actual
    const profile = await this.profileRepo.findByEmailAndOrg(email, orgId);

    if (!profile) {
      // ⛔ CRÍTIC: Està loguejat a Supabase, però no té perfil en aquesta Org.
      // El fem fora immediatament.
      await supabase.auth.signOut(); 
      return { success: false, error: AUTH_ERRORS.USER_NOT_IN_ORG };
    }

    // ✅ Tot correcte
    return { success: true };
  }

  // ==========================================================
  // 2️⃣ LOGIC DE REGISTER (Gestió Mult-Tenancy)
  // ==========================================================
  async register(formData: FormData, orgId: string) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('full_name') as string;
    
    const supabase = await createClient();

    // A. Comprovar si JA existeix en AQUESTA organització
    const existingLocalProfile = await this.profileRepo.findByEmailAndOrg(email, orgId);
    if (existingLocalProfile) {
      return { success: false, error: AUTH_ERRORS.EMAIL_TAKEN_IN_ORG };
    }

    // B. Intentar crear l'usuari a Supabase (Global)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          org_id: orgId, // Això activarà el trigger de Postgres (si en tens)
          role: 'client'
        }
      }
    });

    // CAS ESPECIAL: L'usuari ja existeix globalment (user retornat, identitats buides o error específic)
    if (data.user && data.user.identities && data.user.identities.length === 0) {
       // L'usuari existeix a Auth, però no en aquesta Org (perquè hem passat el check A).
       // 🚨 NO PODEM REGISTRAR-LO DIRECTAMENT PERQUÈ NO SABEM LA SEVA CONTRASENYA ANTIGA.
       // Solució: El redirigim al login perquè posi la seva contrasenya i (idealment) fem el linkatge allà.
       // Per ara, li diem que faci login.
       return { 
         success: false, 
         error: AUTH_ERRORS.ACCOUNT_EXISTS_GLOBAL, 
         redirectToLogin: true 
       };
    }

    if (error) {
      return { success: false, error: mapSupabaseError(error.message) };
    }

    return { success: true };
  }

  
}