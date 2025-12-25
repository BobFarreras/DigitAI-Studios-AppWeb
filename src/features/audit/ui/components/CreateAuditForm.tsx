'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react'; // Treiem 'Globe' perquè posarem text
import { createAuditAction } from '@/actions/audit'; 

export function CreateAuditForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        const result = await createAuditAction(url);
        
        if (result && !result.success) {
            setError(result.message || 'Error desconegut durant l\'auditoria.');
            setIsLoading(false);
        }
    } catch (err) {
        console.error("Error al formulari:", err);
        setError("Error de connexió. Torna-ho a provar.");
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
         <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
            URL del Lloc Web
         </label>
         
         <div className="relative flex items-center">
            {/* 1. PREFIX VISUAL (Igual que a la Landing) */}
            <div className="absolute left-3 pointer-events-none select-none z-10 flex items-center">
               <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">
                 https://
               </span>
            </div>
            
            {/* 2. INPUT ADAPTAT */}
            <Input 
               type="text" // Canviem a 'text' perquè 'url' obligaria a escriure http://
               placeholder="exemple.com" // Placeholder sense protocol
               value={url}
               onChange={(e) => setUrl(e.target.value)}
               required
               disabled={isLoading} 
               // Padding esquerre gran (pl-24) per deixar lloc al prefix "https://"
               className="pl-24 h-12 transition-colors
                          bg-white dark:bg-white/5 
                          border-slate-200 dark:border-white/10 
                          text-slate-900 dark:text-white 
                          placeholder:text-slate-400 dark:placeholder:text-slate-600
                          focus:border-primary focus:ring-primary"
            />
         </div>
      </div>

      {error && (
         <div className="p-3 bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
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
         L'anàlisi pot trigar entre 10 i 30 segons depenent de la velocitat de Google.
      </p>
    </form>
  );
}