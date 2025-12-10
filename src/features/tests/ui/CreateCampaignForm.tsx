'use client';

import { useActionState } from 'react';
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

export function CreateCampaignForm({ projects }: { projects: ProjectSummary[] }) {
  const [state, action, isPending] = useActionState(createCampaignAction, initialState);

  return (
    <form action={action} className="space-y-6">
        
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Projecte</label>
            <select name="projectId" required className="w-full p-3 rounded-lg bg-background border border-input text-foreground focus:ring-2 focus:ring-ring outline-none">
                <option value="">Selecciona...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Títol</label>
            <Input name="title" required className="bg-background border-input text-foreground" />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Descripció</label>
            <Input name="description" className="bg-background border-input text-foreground" />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Instruccions Inicials</label>
            <textarea name="instructions" rows={4} className="w-full p-3 rounded-lg bg-background border border-input text-foreground focus:ring-2 focus:ring-ring outline-none" />
        </div>
        
        {state.message && !state.success && (
            <div className="text-red-500 text-sm flex gap-2 font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded">
                <AlertCircle className="w-4 h-4"/> {state.message}
            </div>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Crear</>}
        </Button>
    </form>
  );
}