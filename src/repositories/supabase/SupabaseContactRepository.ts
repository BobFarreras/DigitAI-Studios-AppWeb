import { createClient } from '@/lib/supabase/server';
import { ContactFormData } from '@/lib/validations/contact';
// Si tens la interfície creada, la importem:
// import { IContactRepository } from '@/repositories/interfaces/IContactRepository';

export class SupabaseContactRepository { // implements IContactRepository
  async create(data: ContactFormData) {
    const supabase = await createClient();

    const { data: inserted, error } = await supabase
      .from('contact_leads') // Taula correcta
      .insert({
        full_name: data.fullName, // 👈 Mapeig: fullName -> full_name
        email: data.email,
        service: data.service,
        message: data.message,
        source: 'landing_contact_form',
        // 'privacy' no cal guardar-ho a DB normalment, ja sabem que ha acceptat
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error Supabase:', error);
      throw new Error('Error guardant el lead a la base de dades');
    }

    return inserted;
  }

  async getAll() {
    console.log('🔍 [REPO] Iniciant lectura de contact_leads...'); // LOG 1
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('contact_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [REPO] Error Supabase:', error.message); // LOG ERROR
      throw new Error('No s\'han pogut carregar els missatges.');
    }

    console.log(`✅ [REPO] Dades recuperades: ${data?.length || 0} files.`); // LOG 2
    return data;
  }
  // 👇 NOU MÈTODE AMB PAGINACIÓ
  async getPaginated(page: number, limit: number) {
    const supabase = await createClient();

    // Calculem el rang (Supabase utilitza índex 0)
    // Pàgina 1 (limit 15): 0 a 14
    // Pàgina 2 (limit 15): 15 a 29
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    console.log(`🔍 [REPO] Paginació: de ${from} a ${to}`);

    const { data, count, error } = await supabase
      .from('contact_leads')
      .select('*', { count: 'exact' }) // 'exact' ens torna el total real de files
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('❌ [REPO] Error paginació:', error.message);
      throw new Error('No s\'han pogut carregar els missatges.');
    }

    return {
      data: data || [],
      total: count || 0
    };
  }
  async getById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('contact_leads')
      .select('*')
      .eq('id', id)
      .single(); // .single() és important: retorna 1 objecte, no un array

    if (error) {
      console.error(`❌ [REPO] Error recuperant lead ${id}:`, error.message);
      return null;
    }

    return data;
  }
  async delete(id: string) {
    console.log(`🗑️ [REPO] Intentant eliminar lead: ${id}`); // LOG INICI
    const supabase = await createClient();

    const { error, status, statusText } = await supabase
      .from('contact_leads')
      .delete()
      .eq('id', id);

    // Mirem què ha passat
    console.log(`🔍 [REPO] Resultat Supabase: Status ${status} (${statusText})`);

    if (error) {
      console.error(`❌ [REPO] Error eliminant lead ${id}:`, error.message); // LOG ERROR
      throw new Error('Error eliminant el missatge de la base de dades.');
    }

    console.log(`✅ [REPO] Lead ${id} eliminat correctament.`);
    return true;
  }
}