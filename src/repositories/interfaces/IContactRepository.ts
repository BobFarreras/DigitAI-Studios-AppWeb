import { createClient } from '@/lib/supabase/server';
import { ContactFormData } from '@/lib/validations/contact';

export class ContactRepository {
  async create(data: ContactFormData) {
    const supabase = await createClient();

    // 1. Mapeig correcte:
    // data.fullName (Zod) -> full_name (Supabase)
    const { data: inserted, error } = await supabase
      .from('contact_leads') 
      .insert({
        full_name: data.fullName, // ✅ Corregit (era name)
        email: data.email,
        service: data.service,    // ✅ Afegit (faltava al teu codi anterior, però Zod el té)
        message: data.message,
        source: 'web_form',
        
        // ⚠️ He tret 'phone' i 'status' perquè l'error deia que no existeixen 
        // a la definició de tipus de 'contact_leads'. 
        // Si vols guardar-los, has d'afegir-los primer al schema Zod i a la taula Supabase.
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error guardant a DB:', error);
      throw new Error('Database insertion failed');
    }

    return inserted;
  }
}