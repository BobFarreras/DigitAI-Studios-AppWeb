// src/features/tests/ui/CreateCampaignForm.tsx
'use client';

import { useActionState } from 'react';
// IMPORT CRÍTIC: Assegura't que la ruta és correcta
import { createCampaignAction, ActionState } from '@/features/tests/actions/admin-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Loader2, AlertCircle } from 'lucide-react';

const initialState: ActionState = {
  success: false,
  message: '',
};

type ProjectSummary = {
    id: string;
    name: string;
};

// 👇 ASSEGURA'T QUE POSA 'export function', NO 'export default function'
export function CreateCampaignForm({ projects }: { projects: ProjectSummary[] }) {
  const [state, action, isPending] = useActionState(createCampaignAction, initialState);

  return (
    <form action={action} className="space-y-6">
        {/* ... (el teu codi del formulari) ... */}
        {/* Si no tens el codi a mà, copia'l del pas anterior, però la clau és la línia de l'export */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Projecte</label>
            <select name="projectId" required className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-white">
                <option value="">Selecciona...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Títol</label>
            <Input name="title" required className="bg-slate-900 border-slate-700 text-white" />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Descripció</label>
            <Input name="description" className="bg-slate-900 border-slate-700 text-white" />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Instruccions Inicials</label>
            <textarea name="instructions" rows={4} className="w-full p-3 rounded-lg bg-slate-900 border-slate-700 text-white" />
        </div>
        
        {state.message && !state.success && (
            <div className="text-red-400 text-sm flex gap-2"><AlertCircle className="w-4 h-4"/> {state.message}</div>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Crear</>}
        </Button>
    </form>
  );
}