// fitxer: src/features/tests/ui/TaskManager.tsx

'use client';

import { useActionState, useRef } from 'react';
import { TestTaskDTO } from '@/types/models';
// Importem el tipus que hem definit abans
import { addTaskAction, deleteTaskAction, TaskActionState } from '../actions/task-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// 1. CORRECCIÓ: Eliminem CardContent que no es feia servir
import { Plus, Trash2, ListChecks } from 'lucide-react';
import { toast } from 'sonner';

const initialState: TaskActionState = { success: false, message: '' };

export function TaskManager({ campaignId, tasks }: { campaignId: string, tasks: TestTaskDTO[] }) {
    const formRef = useRef<HTMLFormElement>(null);

    // 2. CORRECCIÓ: Tipem 'prev' i usem '_' per 'state' si no el pintem a la UI
    // (O millor, fem servir state.message si volem mostrar errors en text vermell)
    // De moment, per treure l'error de "unused", el renomenem a "_state"
    const [_state, action, isPending] = useActionState(async (prev: TaskActionState, formData: FormData) => {
        const result = await addTaskAction(prev, formData);
        if (result.success) {
            formRef.current?.reset();
            toast.success("Tasca afegida!");
        } else {
            toast.error(result.message);
        }
        return result;
    }, initialState);

    const handleDelete = async (taskId: string) => {
        if(!confirm("Segur que vols esborrar aquesta tasca?")) return;
        const res = await deleteTaskAction(taskId, campaignId);
        if(res.success) toast.success("Esborrada");
        else toast.error(res.message);
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* COLUMNA 1: LLISTAT DE TASQUES EXISTENTS */}
            <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-blue-500" /> 
                    Llista de Verificació ({tasks.length})
                </h3>
                
                {tasks.length === 0 && (
                    <div className="p-8 border-2 border-dashed border-slate-800 rounded-xl text-center text-slate-500">
                        No hi ha tasques definides. Afegeix la primera a la dreta 👉
                    </div>
                )}

                <div className="space-y-2">
                    {tasks.map((task, index) => (
                        <div key={task.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-start justify-between group hover:border-slate-700 transition-colors">
                            <div className="flex gap-3">
                                <span className="bg-slate-800 text-slate-400 w-6 h-6 flex items-center justify-center rounded text-xs font-mono mt-0.5">
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="font-medium text-slate-200">{task.title}</p>
                                    {task.description && (
                                        <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                                    )}
                                </div>
                            </div>
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDelete(task.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* COLUMNA 2: FORMULARI PER AFEGIR (Sticky) */}
            <div className="lg:col-span-1">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl sticky top-6">
                    <h3 className="font-bold text-white mb-4">Nova Tasca</h3>
                    <form ref={formRef} action={action} className="space-y-4">
                        <input type="hidden" name="campaignId" value={campaignId} />
                        
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Títol (Acció)</label>
                            <Input 
                                name="title" 
                                placeholder="Ex: Verificar registre..." 
                                className="bg-black border-slate-700 text-white mt-1" 
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Detalls (Opcional)</label>
                            <Textarea 
                                name="description" 
                                placeholder="Ex: L'usuari hauria de rebre un correu..." 
                                className="bg-black border-slate-700 text-white mt-1 resize-none" 
                                rows={3}
                            />
                        </div>

                        <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="w-4 h-4 mr-2" /> Afegir a la Llista
                        </Button>
                    </form>
                </div>
            </div>

        </div>
    );
}