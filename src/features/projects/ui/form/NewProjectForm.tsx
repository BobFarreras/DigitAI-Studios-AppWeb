'use client';

import { useActionState, useRef } from 'react';
import { createProjectAction } from '@/features/projects/actions';
import { ActionResult } from '@/types/actions';
import { Rocket, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Importem els nostres components atòmics
import { IdentitySection } from './IdentitySection';
import { AISection } from './AISection';
import { DesignSection } from './DesignSection';
import { SubmitButton } from './SubmitButton'; // 👈 El nou botó

const initialState: ActionResult = { success: false, error: '', fields: {} };

export function NewProjectForm() {
  const [state, formAction, isPending] = useActionState(createProjectAction, initialState);
  
  // Ref inicialitzat a null, compatible amb la nova interfície de IdentitySection
  const slugRef = useRef<HTMLInputElement>(null);

  return (
    <div className="max-w-3xl mx-auto pb-32"> {/* pb-32 per deixar espai al botó flotant */}
      
      {/* Header Visual */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center p-4 bg-slate-900 rounded-2xl shadow-2xl mb-4">
            <Rocket className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Crear Nou Projecte</h1>
        <p className="text-slate-500">Configura la identitat, la IA i l'estructura en uns segons.</p>
      </motion.div>

      <form action={formAction} className="space-y-6">
        
        {/* PAS 1 */}
        <IdentitySection 
            defaultName={state.fields?.businessName} 
            defaultSlug={state.fields?.slug}
            slugRef={slugRef}
        />

        {/* PAS 2 */}
        <AISection 
            defaultValue={state.fields?.description} 
        />

        {/* PAS 3 */}
        <DesignSection 
            defaultColor={state.fields?.primaryColor} 
        />

        {/* BOTÓ FLOTANT */}
        <SubmitButton isPending={isPending} />

        {/* FEEDBACK MESSAGES (Alertes) */}
        <AnimatePresence>
            {state?.error && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center gap-3"
                >
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div>
                        <p className="font-bold text-sm">Hi ha hagut un error</p>
                        <p className="text-xs">{state.error}</p>
                    </div>
                </motion.div>
            )}
            
            {state?.success && state.repoUrl && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-green-50 text-green-800 border border-green-200 rounded-xl text-center"
                >
                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-600" />
                    <h3 className="text-xl font-bold mb-1">Projecte Enlairat! 🛸</h3>
                    <p className="mb-4 text-sm opacity-80">El repositori i el desplegament estan en marxa.</p>
                    <a href={state.repoUrl} target="_blank" className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-colors">
                        Veure Repositori
                    </a>
                </motion.div>
            )}
        </AnimatePresence>

      </form>
    </div>
  );
}