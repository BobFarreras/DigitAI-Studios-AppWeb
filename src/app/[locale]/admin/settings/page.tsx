import { createClient } from '@/lib/supabase/server'; // Revisa ruta
import { ConnectSocials } from '@/components/admin/socials/ConnectSocials';

export default async function SettingsPage() {
  const supabase = await createClient();

  // 1. Obtenim l'usuari actual
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div>No autoritzat</div>;

  // 2. Busquem la seva organització
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  // 3. RECUPEREM LES CONNEXIONS ACTIVES 🟢
  const { data: connections } = await supabase
    .from('social_connections')
    .select('*')
    .eq('organization_id', profile!.organization_id);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configuració i Integracions</h1>
      
      {/* Passem les connexions reals al component */}
      <ConnectSocials connections={connections || []} />
    </div>
  );
}