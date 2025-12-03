'use client';

import { useActionState } from 'react';
// Importem l'acció i EL TIPUS que acabem de crear
import { inviteClientAction, InviteState } from '@/features/projects/actions';
import { Mail, Send, Loader2 } from 'lucide-react';

// ✅ L'estat inicial ha de coincidir EXACTAMENT amb InviteState
const initialState: InviteState = { 
  success: false, 
  error: null, 
  message: null 
};

export function InviteClientForm({ projectId, orgId }: { projectId: string, orgId: string }) {
  const [state, action, isPending] = useActionState(inviteClientAction, initialState);

  if (state.success) {
      return (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center animate-in zoom-in">
              ✅ <strong>{state.message}</strong><br/>
              El client rebrà un correu per activar el seu compte.
          </div>
      );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="orgId" value={orgId} />
        
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="email@client.com" 
                    className="w-full pl-9 p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <button 
                type="submit" 
                disabled={isPending}
                className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
                {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <><Send className="w-4 h-4" /> Convidar</>}
            </button>
        </div>
        
        {state.error && (
            <p className="text-xs text-red-500 font-medium ml-1">❌ {state.error}</p>
        )}
    </form>
  );
}