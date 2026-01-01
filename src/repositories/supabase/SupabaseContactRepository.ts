import { createClient } from '@/lib/supabase/server'; // Client estàndard per a lectures (respecta sessió)
import { createClient as createAdminClient } from '@supabase/supabase-js'; // ⚠️ Client Admin per a inserts
import { ContactFormData } from '@/lib/validations/contact';

export class SupabaseContactRepository {

  // 1️⃣ MÈTODE CREATE: Utilitza la clau Mestra (Service Role)
  // Això permet que qualsevol (fins i tot si no està loguejat) pugui enviar el formulari
  // sense xocar amb les polítiques RLS.
  async create(data: ContactFormData) {
    // Creem una instància d'admin al vol
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Assegura't de tenir això al .env.local
    );

    const { data: inserted, error } = await supabaseAdmin
      .from('contact_leads')
      .insert({
        full_name: data.fullName,
        email: data.email,
        service: data.service,
        message: data.message,
        source: 'landing_contact_form',

      })
      .select()
      .single();

    if (error) {
      console.error('❌ [REPO] Error Supabase (Create):', error);
      throw new Error('Error guardant el lead a la base de dades');
    }

    return inserted;
  }

  // 2️⃣ MÈTODES DE LECTURA: Utilitzen el client de sessió (Cookies)
  // Només funcionaran si estàs loguejat al Dashboard. Això és CORRECTE per seguretat.

  async getAll() {
    console.log('🔍 [REPO] Iniciant lectura de contact_leads...');
    const supabase = await createClient(); // Client normal (cookies)

    const { data, error } = await supabase
      .from('contact_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [REPO] Error Supabase (Get All):', error.message);
      throw new Error("No s'han pogut carregar els missatges.");
    }

    console.log(`✅ [REPO] Dades recuperades: ${data?.length || 0} files.`);
    return data;
  }

  async getPaginated(page: number, limit: number) {
    const supabase = await createClient();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    console.log(`🔍 [REPO] Paginació: de ${from} a ${to}`);

    const { data, count, error } = await supabase
      .from('contact_leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('❌ [REPO] Error paginació:', error.message);
      throw new Error("No s'han pogut carregar els missatges.");
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
      .single();

    if (error) {
      console.error(`❌ [REPO] Error recuperant lead ${id}:`, error.message);
      return null;
    }

    return data;
  }

  async delete(id: string) {
    console.log(`🗑️ [REPO] Intentant eliminar lead: ${id} de la taula contact_leads`);
    const supabase = await createClient();

    // Afegim { count: 'exact' } per saber si REALMENT s'ha esborrat
    const { error, count } = await supabase
      .from('contact_leads') // 👈 NOM CORRECTE
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) {
      console.error(`❌ [REPO] Error eliminant lead ${id}:`, error.message);
      throw new Error('Error eliminant el missatge de la base de dades.');
    }

    // Si no hi ha error però count és 0, alguna cosa passa (ID incorrecte o permisos RLS)
    if (count === 0) {
      console.warn(`⚠️ [REPO] Alerta: Supabase ha retornat 0 files eliminades. Revisa RLS.`);
      // Opcional: throw new Error("No tens permís per eliminar o el missatge ja no existeix.");
    }

    console.log(`✅ [REPO] Lead eliminat correctament.`);
    return true;
  }
}