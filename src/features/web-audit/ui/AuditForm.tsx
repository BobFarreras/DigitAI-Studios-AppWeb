'use client';

import { useActionState } from 'react';
import { processWebAudit } from '../actions'; // Comprova la ruta
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AuditForm() {
  const [state, action, isPending] = useActionState(processWebAudit, { message: '', errors: {} });

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="border border-white/10 rounded-xl p-8 bg-transparent">
        <h3 className="text-xl font-bold text-center text-white mb-6">
          Analitza la teva web en segons
        </h3>
        
        <form action={action} className="space-y-4">
          <Input 
            name="url" 
            placeholder="https://la-teva-web.com" 
            className="bg-transparent border-white/10 text-white h-12 focus:border-white/30 placeholder:text-slate-600"
          />
          {state.errors?.url && <p className="text-red-400 text-xs">{state.errors.url[0]}</p>}

          <Input 
            name="email" 
            placeholder="el-teu@email.com" 
            className="bg-transparent border-white/10 text-white h-12 focus:border-white/30 placeholder:text-slate-600"
          />
          {state.errors?.email && <p className="text-red-400 text-xs">{state.errors.email[0]}</p>}

          <Button type="submit" disabled={isPending} className="w-full bg-transparent hover:bg-white/5 text-white border border-white/10 h-12 mt-2 font-medium">
            {isPending ? 'Analitzant...' : 'Auditoria Gratuïta'}
          </Button>
          
          {state.message && <p className="text-center text-slate-400 text-sm mt-2">{state.message}</p>}
        </form>
      </div>
    </div>
  );
}