'use client'

import { Button } from '@/components/ui/button';
import { type Database } from '@/types/database.types';

// Assumim que rebrem les connexions existents per mostrar "Connectat" o no
type Connection = Database['public']['Tables']['social_connections']['Row'];

interface ConnectSocialsProps {
  connections: Connection[];
}

export function ConnectSocials({ connections }: ConnectSocialsProps) {
  
  const handleConnect = (provider: 'linkedin' | 'facebook') => {
    // Redirigim a la nostra API d'inici
    window.location.href = `/api/oauth/init?provider=${provider}`;
  };

  const linkedinConnected = connections.find(c => c.provider === 'linkedin');
  const facebookConnected = connections.find(c => c.provider === 'facebook');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      
      {/* LINKEDIN CARD */}
      <div className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 text-white rounded flex items-center justify-center font-bold">
            in
          </div>
          <div>
            <h3 className="font-bold text-sm">LinkedIn</h3>
            <p className="text-xs text-gray-500">
              {linkedinConnected 
                ? `Connectat com: ${linkedinConnected.provider_page_name || 'Usuari'}` 
                : 'No connectat'}
            </p>
          </div>
        </div>
        <Button 
          variant={linkedinConnected ? "outline" : "default"}
          onClick={() => handleConnect('linkedin')}
          disabled={!!linkedinConnected} // Deshabilitem si ja està connectat (per ara)
        >
          {linkedinConnected ? '✅ Connectat' : 'Connectar'}
        </Button>
      </div>

      {/* FACEBOOK CARD */}
      <div className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded flex items-center justify-center font-bold">
            f
          </div>
          <div>
            <h3 className="font-bold text-sm">Facebook / Instagram</h3>
            <p className="text-xs text-gray-500">
               {facebookConnected 
                ? `Pàgina: ${facebookConnected.provider_page_name}` 
                : 'No connectat'}
            </p>
          </div>
        </div>
        <Button 
          variant={facebookConnected ? "outline" : "default"}
          onClick={() => handleConnect('facebook')}
          disabled={!!facebookConnected}
        >
           {facebookConnected ? '✅ Connectat' : 'Connectar'}
        </Button>
      </div>

    </div>
  );
}