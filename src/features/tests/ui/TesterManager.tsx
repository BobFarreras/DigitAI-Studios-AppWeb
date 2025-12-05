'use client';

import { useState, useMemo } from 'react'; // 👈 Importa useMemo
import { TesterProfile } from '@/types/models';
import { addTesterAction, removeTesterAction } from '@/features/tests/actions/admin-actions'; // 👈 Assegura el path
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2, UserPlus, Search, Check } from 'lucide-react';
import { toast } from 'sonner'; 

interface Props {
  campaignId: string;
  assignedTesters: TesterProfile[];
  availableTesters: TesterProfile[];
}

export function TesterManager({ campaignId, assignedTesters, availableTesters }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, setIsPending] = useState(false);

  // 🛡️ CORRECCIÓ: Usem useMemo per calcular la llista de candidats de forma segura
  const filteredCandidates = useMemo(() => {
    // 1. Creem un Set amb els IDs ja assignats per cerca ràpida O(1)
    const assignedIds = new Set(assignedTesters.map(t => t.id));

    // 2. Filtrem:
    // - Que no estigui ja assignat
    // - Que coincideixi amb el terme de cerca (si n'hi ha)
    // - 🛡️ EXTRA: Ens assegurem que no hi hagi duplicats a la llista 'available' d'origen
    const uniqueCandidates = new Map(); // Use Map to dedup by ID

    availableTesters.forEach(u => {
        if (assignedIds.has(u.id)) return; // Ja assignat
        
        if (searchTerm && !u.email.toLowerCase().includes(searchTerm.toLowerCase())) return; // No coincideix cerca

        if (!uniqueCandidates.has(u.id)) {
            uniqueCandidates.set(u.id, u);
        }
    });

    return Array.from(uniqueCandidates.values());
  }, [assignedTesters, availableTesters, searchTerm]);

  const handleAdd = async (userId: string) => {
    setIsPending(true);
    const res = await addTesterAction(campaignId, userId);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
    setIsPending(false);
  };

  const handleRemove = async (userId: string) => {
    if(!confirm("Segur que vols treure l'accés a aquest usuari?")) return;
    
    setIsPending(true);
    const res = await removeTesterAction(campaignId, userId);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
    setIsPending(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
        
        {/* LLISTA ACTUAL (ASSIGNATS) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" /> Testers Actius ({assignedTesters.length})
            </h3>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {assignedTesters.length === 0 && (
                    <p className="text-sm text-slate-500 italic">No hi ha ningú assignat encara.</p>
                )}
                
                {assignedTesters.map(tester => (
                    // 🛡️ Assegura't que tester.id és únic aquí també
                    <div key={`assigned-${tester.id}`} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={tester.avatar_url || ''} />
                                <AvatarFallback>{tester.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium truncate">{tester.full_name || 'Sense nom'}</p>
                                <p className="text-xs text-slate-500 truncate">{tester.email}</p>
                            </div>
                        </div>
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleRemove(tester.id)}
                            disabled={isPending}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>

        {/* LLISTA CANDIDATS (DISPONIBLES) */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <UserPlus className="w-5 h-5" /> Afegir Testers
            </h3>

            {/* Cercador */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Buscar per email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredCandidates.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">
                        {searchTerm ? 'Cap resultat trobat.' : 'No hi ha candidats disponibles.'}
                    </p>
                ) : (
                    filteredCandidates.map(user => (
                        <div key={`candidate-${user.id}`} className="flex items-center justify-between p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700" onClick={() => handleAdd(user.id)}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center text-xs font-bold">
                                    {user.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{user.email}</p>
                                </div>
                            </div>
                            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-blue-600 font-bold" disabled={isPending}>
                                Assignar
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
  );
}