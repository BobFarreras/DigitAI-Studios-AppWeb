import { ConnectSocials } from '@/components/admin/socials/ConnectSocials';
import { getAdminSettingsData } from '@/actions/admin/settings';

export default async function SettingsPage() {
  const result = await getAdminSettingsData();
  if (!result.success && result.authRequired) return <div>No autoritzat</div>;
  const connections = result.success ? result.connections : [];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configuració i Integracions</h1>
      
      {/* Passem les connexions reals al component */}
      <ConnectSocials connections={connections} />
    </div>
  );
}
