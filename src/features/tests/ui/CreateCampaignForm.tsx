'use client';

import { useActionState } from 'react';
import { createCampaignAction, ActionState } from '@/features/tests/actions/admin-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Loader2, AlertCircle } from 'lucide-react';

// Estat inicial
const initialState: ActionState = {
  success: false,
  message: '',
};

type ProjectSummary = {
    id: string;
    name: string;
};

export function CreateCampaignForm({ projects }: { projects: ProjectSummary[] }) {
  // Hook per connectar el Server Action amb el formulari
  const [state, action, isPending] = useActionState(createCampaignAction, initialState);

  return (
    <form action={action} className="space-y-6">
        
        {/* Projecte */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Projecte</label>
            <select 
                name="projectId" 
                required 
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
                <option value="">Selecciona un projecte...</option>
                {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
        </div>

        {/* Títol */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Títol de la Campanya</label>
            <Input name="title" placeholder="Ex: Beta v2.0 - Android" required className="bg-slate-900 border-slate-700 text-white" />
        </div>

        {/* Descripció */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Descripció Curta</label>
            <Input name="description" placeholder="Objectiu principal del test..." className="bg-slate-900 border-slate-700 text-white" />
        </div>

        {/* Instruccions */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Instruccions Detallades (Markdown)</label>
            <textarea 
                name="instructions" 
                rows={6}
                placeholder="Instruccions per als testers (com instal·lar, credencials, etc.)"
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
            />
        </div>

        {/* Missatge d'Error */}
        {!state.success && state.message && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" /> {state.message}
            </div>
        )}

        {/* Botó Submit */}
        <Button type="submit" disabled={isPending} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-12">
            {isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creant...</>
            ) : (
                <><Save className="w-4 h-4 mr-2" /> Crear i Afegir Tasques</>
            )}
        </Button>
    </form>
  );
}