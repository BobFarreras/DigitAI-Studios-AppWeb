'use client';

import { useState } from 'react';
import { ProjectMember } from '@/repositories/supabase/SupabaseProjectRepository'; // Importa el tipus
import { addProjectMemberAction, removeProjectMemberAction } from '../actions/project-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, UserPlus, Shield } from 'lucide-react';
import { toast } from 'sonner';

type Candidate = {
    id: string;
    email: string;
    full_name: string | null;
};

interface Props {
    projectId: string;
    members: ProjectMember[];
    candidates: Candidate[];
}

export function ProjectTeamManager({ projectId, members, candidates }: Props) {
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [isPending, setIsPending] = useState(false);

    const handleAdd = async () => {
        if (!selectedUserId) return;
        setIsPending(true);
        const res = await addProjectMemberAction(projectId, selectedUserId);
        
        if (res.success) {
            toast.success(res.message);
            setSelectedUserId(''); // Reset
        } else {
            toast.error(res.message);
        }
        setIsPending(false);
    };

    const handleRemove = async (userId: string) => {
        if (!confirm("Segur que vols eliminar aquest membre del projecte?")) return;
        setIsPending(true);
        const res = await removeProjectMemberAction(projectId, userId);
        
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
        setIsPending(false);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                <Shield className="w-5 h-5 text-blue-500" /> Equip del Projecte
            </h3>

            {/* AFEGIR MEMBRE */}
            <div className="flex gap-2 mb-6">
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Seleccionar usuari..." />
                    </SelectTrigger>
                    <SelectContent>
                        {candidates.length === 0 ? (
                            <SelectItem value="none" disabled>No hi ha més candidats</SelectItem>
                        ) : (
                            candidates.map(c => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.full_name || 'Sense nom'} ({c.email})
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
                <Button onClick={handleAdd} disabled={isPending || !selectedUserId} className="bg-blue-600 text-white">
                    <UserPlus className="w-4 h-4" />
                </Button>
            </div>

            {/* LLISTA DE MEMBRES */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
                {members.map((m) => (
                    <div key={m.user_id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 group">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                                <AvatarImage src={m.profile.avatar_url || ''} />
                                <AvatarFallback>{m.profile.email[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-200">
                                    {m.profile.full_name || 'Usuari'}
                                </p>
                                <p className="text-xs text-slate-500">{m.profile.email}</p>
                            </div>
                        </div>
                        
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemove(m.user_id)}
                            disabled={isPending}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}

                {members.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm italic">
                        No hi ha ningú vinculat. Afegeix el primer membre.
                    </div>
                )}
            </div>
        </div>
    );
}