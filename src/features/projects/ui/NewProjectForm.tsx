'use client';

import { useActionState, useRef } from 'react';
import { createProjectAction } from '@/features/projects/actions';
import { Loader2, Wand2, Github, LayoutTemplate } from 'lucide-react';
import { ActionResult } from '@/types/actions';

const initialState: ActionResult = {
  success: false,
  error: '',
  fields: {} 
};

export function NewProjectForm() {
  const [state, formAction, isPending] = useActionState(createProjectAction, initialState);
  
  // ✅ SOLUCIÓ: Usem refs en lloc de state per evitar re-renders innecessaris i conflictes
  const slugInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    
    // Lògica automàtica: Si l'usuari escriu el nom, actualitzem l'slug
    // només si l'slug està buit o comença per 'client-' (per no matxacar canvis manuals)
    if (slugInputRef.current) {
        const currentSlug = slugInputRef.current.value;
        if (!currentSlug || currentSlug.startsWith('client-')) {
            const generated = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            slugInputRef.current.value = generated ? `client-${generated}` : '';
        }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="p-3 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30">
            <LayoutTemplate className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Generador de PWA</h2>
            <p className="text-slate-500 text-sm">Crea una nova web a partir del Master Template</p>
          </div>
        </div>
      
      <form action={formAction} className="space-y-8">
        
        {/* SECCIÓ 1: IDENTITAT */}
        <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">1. Identitat del Negoci</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Nom del Negoci</label>
                    <input 
                        name="businessName" 
                        required 
                        // Persistència via defaultValue
                        defaultValue={state.fields?.businessName} 
                        onChange={handleNameChange}
                        // 🎨 Estils per evitar text transparent
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-gray-400" 
                        placeholder="Ex: Restaurant Can Roca" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Identificador (Repo Slug)</label>
                    <div className="relative">
                        <Github className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input 
                            name="slug" 
                            required 
                            ref={slugInputRef}
                            // ✅ TRUC MESTRE: 'key' força el component a refrescar-se si el servidor torna un valor nou
                            key={state.fields?.slug || 'slug-input'} 
                            defaultValue={state.fields?.slug}
                            className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white placeholder:text-gray-400" 
                            placeholder="client-nom-negoci" 
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Logotip (Imatge)</label>
                <input 
                    type="file" 
                    name="logo" 
                    // Només obligatori si no hi ha errors previs (per no haver de tornar a pujar)
                    required={!state.fields}
                    accept="image/png, image/jpeg, image/webp"
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer" 
                />
            </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* SECCIÓ 2: IA */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
                <Wand2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-blue-800 dark:text-blue-200">Generació de Contingut (IA)</span>
            </div>
            <label className="block text-sm text-blue-700 dark:text-blue-300 mb-2">
                Descriu el negoci. Gemini escriurà el Hero, el "Sobre Nosaltres" i els Serveis automàticament.
            </label>
            <textarea 
                name="description" 
                rows={4} 
                defaultValue={state.fields?.description}
                className="w-full p-3 border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400" 
                placeholder="Ex: Som un gimnàs de barri especialitzat en CrossFit i Yoga..." 
                required
            />
        </section>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* SECCIÓ 3: CONFIGURACIÓ */}
        <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">3. Configuració</h3>
            
            <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Color Corporatiu</label>
                <div className="flex items-center gap-3">
                    <input 
                        type="color" 
                        name="primaryColor" 
                        defaultValue={state.fields?.primaryColor || "#7c3aed"} 
                        className="h-12 w-20 rounded cursor-pointer border border-gray-200 p-1 bg-white" 
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Mòduls</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['booking', 'blog', 'inventory'].map((mod) => (
                        <label key={mod} className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
                            <input type="checkbox" name={`module_${mod}`} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                            <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{mod}</span>
                        </label>
                    ))}
                </div>
            </div>
        </section>

        <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center gap-3 shadow-xl transition-all"
        >
            {isPending ? (
                <>
                    <Loader2 className="animate-spin w-6 h-6" /> Creant Projecte...
                </>
            ) : (
                '🚀 INICIAR CONSTRUCCIÓ'
            )}
        </button>

        {/* FEEDBACK */}
        {state?.error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-center animate-in fade-in slide-in-from-top-2">
                ❌ <strong>Error:</strong> {state.error}
            </div>
        )}
        
        {state?.success && state.repoUrl && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 p-6 rounded-xl text-center animate-in zoom-in duration-300">
                <h3 className="text-xl font-bold mb-2">🎉 Projecte Generat!</h3>
                <p className="mb-6">El repositori s'ha creat correctament.</p>
                <a 
                    href={state.repoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition-colors shadow-lg"
                >
                    <Github className="w-5 h-5" /> Veure Codi a GitHub
                </a>
            </div>
        )}
      </form>
      </div>
    </div>
  );
}