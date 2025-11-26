import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';

/**
 * Aquesta funció actua com un tallafocs.
 * Si l'usuari no és l'Admin, atura l'execució i llança un 404.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  
  // 1. Obtenim l'usuari
  const { data: { user }, error } = await supabase.auth.getUser();

  // 2. Si no està loguejat -> Al login
  if (error || !user) {
    redirect('/auth/login');
  }

  // 3. VERIFICACIÓ MESTRA
  // Comparem l'email de l'usuari amb la variable d'entorn
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error("❌ ERROR CRÍTIC: No s'ha configurat ADMIN_EMAIL al .env");
    // Per seguretat, si no hi ha config, bloquegem tothom
    notFound(); 
  }

  if (user.email !== adminEmail) {
    console.warn(`⚠️ ALERTA DE SEGURETAT: L'usuari ${user.email} ha intentat accedir a l'admin.`);
    // 4. Si no és l'admin, mostrem un 404 (Not Found).
    // Així ni tan sols saben que la pàgina existeix.
    notFound();
  }

  // Si arriba aquí, ets tu. Benvingut, cap.
  return user;
}