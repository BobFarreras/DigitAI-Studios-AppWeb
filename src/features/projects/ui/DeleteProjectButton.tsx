'use client';

import { useActionState, useState } from 'react';
import { destroyProjectAction } from '../actions/destroy-actions';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

interface Props {
  repoName: string; // El nom del repo/slug del client
}

export function DestructionButton({ repoName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  
  // Hook de React 19/Next 15 per gestionar formularis
  const [state, formAction, isPending] = useActionState(destroyProjectAction, {
    success: false,
    message: '',
  });

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-bold border border-red-200 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Destruir Client
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-2xl border border-red-500 overflow-hidden">
        
        {/* Header vermell */}
        <div className="bg-red-600 p-4 flex items-center justify-between text-white">
          <h2 className="font-bold flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5" />
            ZONA DE PERILL
          </h2>
          <button onClick={() => setIsOpen(false)} className="hover:bg-red-700 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contingut */}
        <div className="p-6 space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            Estàs a punt d'<strong>ELIMINAR PER SEMPRE</strong> el client:
            <br />
            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-red-600 font-mono mt-1 block w-fit">
              {repoName}
            </code>
          </p>
          
          <ul className="text-sm text-slate-500 list-disc pl-5 space-y-1">
            <li>S'eliminarà el projecte de <strong>Vercel</strong>.</li>
            <li>S'esborrarà el repositori de <strong>GitHub</strong>.</li>
            <li>Es destruirà tota la <strong>Base de Dades</strong> (Supabase).</li>
          </ul>

          {/* Missatge d'error si falla */}
          {state.message && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium border border-red-100">
              {state.message}
            </div>
          )}

          {/* Formulari */}
          <form action={formAction} className="space-y-4 mt-4">
            <input type="hidden" name="repoName" value={repoName} />
            
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Escriu "SI" per confirmar:
              </label>
              <input 
                type="text" 
                name="confirmation"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="SI"
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent focus:ring-2 focus:ring-red-500 outline-none"
                autoComplete="off"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                disabled={isPending}
              >
                Cancel·lar
              </button>
              
              <button
                type="submit"
                disabled={confirmInput !== 'SI' || isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold flex items-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? 'Destruint...' : 'CONFIRMAR DESTRUCCIÓ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}