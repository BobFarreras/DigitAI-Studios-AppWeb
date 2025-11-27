'use client';

import { useState } from 'react';
// Ja no necessitem useRouter ni router.push!
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Globe } from 'lucide-react';
import { createAuditAction } from '../../actions';

export function CreateAuditForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Cridem a l'acció.
    // Si té èxit, l'acció farà redirect i aquesta funció s'aturarà aquí.
    // Si falla, ens retornarà l'objecte amb l'error.
    const result = await createAuditAction(url);
    
    // Si arribem a aquesta línia, vol dir que NO ha redirigit (per tant, hi ha hagut error)
    if (result && !result.success) {
        setError(result.message || 'Error desconegut');
        setIsLoading(false); // Només parem loading si hi ha error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
         <label className="text-sm font-medium text-slate-300 ml-1">URL del Lloc Web</label>
         <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input 
               type="url" 
               placeholder="https://exemple.com" 
               value={url}
               onChange={(e) => setUrl(e.target.value)}
               required
               disabled={isLoading} // Desactivem mentre carrega
               className="pl-10 bg-white/5 border-white/10 text-white h-12 focus:border-primary focus:ring-primary placeholder:text-slate-600"
            />
         </div>
      </div>

      {error && (
         <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
         </div>
      )}

      <Button 
         type="submit" 
         disabled={isLoading || !url} 
         className="w-full h-12 gradient-bg text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20"
      >
         {isLoading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analitzant Web...</>
         ) : (
            <><Search className="w-4 h-4 mr-2" /> Començar Anàlisi</>
         )}
      </Button>
      
      <p className="text-xs text-center text-slate-500">
         L'anàlisi pot trigar entre 10 i 30 segons. Si us plau, no tanquis la pàgina.
      </p>
    </form>
  );
}