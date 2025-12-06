'use client';

import { useActionState, useRef, useEffect } from 'react';
import { TestTaskDTO } from '@/types/models';
import { addTaskAction, deleteTaskAction, TaskActionState } from '../actions/task-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ArrowDown, GripVertical, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const initialState: TaskActionState = { success: false, message: '' };

export function VisualFlowBuilder({ campaignId, tasks }: { campaignId: string, tasks: TestTaskDTO[] }) {
    const formRef = useRef<HTMLFormElement>(null);
    
    // Hook per gestionar l'acció de crear
    const [state, action, isPending] = useActionState(async (prev: TaskActionState, formData: FormData) => {
        const result = await addTaskAction(prev, formData);
        if (result.success) {
            formRef.current?.reset();
            toast.success("Pas afegit al flux!");
            // Fem scroll automàtic al final per veure el nou pas
            setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 300);
        } else {
            toast.error(result.message);
        }
        return result;
    }, initialState);

    const handleDelete = async (taskId: string) => {
        if(!confirm("Segur que vols eliminar aquest pas del flux?")) return;
        const res = await deleteTaskAction(taskId, campaignId);
        if(res.success) toast.success("Pas eliminat");
        else toast.error(res.message);
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            
            {/* CAPÇALERA DEL DIAGRAMA */}
            <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-white mb-2">Flux de Navegació (User Journey)</h3>
                <p className="text-slate-400 text-sm">Defineix el camí exacte que ha de seguir el tester.</p>
            </div>

            <div className="relative space-y-0">
                {/* LÍNIA CENTRAL CONNECTORA */}
                {tasks.length > 0 && (
                    <div className="absolute left-1/2 top-4 bottom-20 w-0.5 bg-slate-800 -translate-x-1/2 z-0"></div>
                )}

                {/* --- LLISTAT DE PASSOS (NODES) --- */}
                <AnimatePresence>
                    {tasks.map((task, index) => (
                        <motion.div 
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative z-10 flex flex-col items-center"
                        >
                            {/* Targeta del Pas */}
                            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-xl p-5 shadow-xl hover:border-purple-500/50 transition-colors group relative">
                                
                                {/* Número de Pas (Badge) */}
                                <div className="absolute -left-4 -top-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-slate-950">
                                    {index + 1}
                                </div>

                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                        <CheckSquare className="w-5 h-5 text-green-500" />
                                        {task.title}
                                    </h4>
                                    <button 
                                        onClick={() => handleDelete(task.id)}
                                        className="text-slate-500 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {task.description && (
                                    <p className="text-slate-400 text-sm bg-black/20 p-3 rounded-lg border border-white/5">
                                        {task.description}
                                    </p>
                                )}
                            </div>

                            {/* Fletxa Connectora (Excepte l'últim si estem editant) */}
                            <div className="h-12 flex items-center justify-center">
                                <ArrowDown className="text-slate-600 w-6 h-6 animate-pulse" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* --- FORMULARI PER AFEGIR (NODE FINAL) --- */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-slate-950 border-2 border-dashed border-slate-700 w-full max-w-md rounded-xl p-6 shadow-inner">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">
                            Afegir Següent Pas
                        </h4>
                        
                        <form ref={formRef} action={action} className="space-y-4">
                            <input type="hidden" name="campaignId" value={campaignId} />
                            
                            <div>
                                <Input 
                                    name="title" 
                                    placeholder="Ex: Clicar al botó 'Registrar-se'" 
                                    className="bg-slate-900 border-slate-700 text-white focus:ring-purple-500" 
                                    required
                                    autoComplete="off"
                                />
                            </div>

                            <div>
                                <Textarea 
                                    name="description" 
                                    placeholder="Detalls: L'usuari hauria de veure un modal de confirmació..." 
                                    className="bg-slate-900 border-slate-700 text-white resize-none text-xs" 
                                    rows={2}
                                />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isPending} 
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
                            >
                                {isPending ? 'Afegint...' : <><Plus className="w-4 h-4 mr-2" /> Afegir Pas al Diagrama</>}
                            </Button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}