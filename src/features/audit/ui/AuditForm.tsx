'use client';

import { useActionState } from 'react';
import { processWebAudit } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, AlertCircle } from 'lucide-react';

export function AuditForm() {
  const [state, action, isPending] = useActionState(processWebAudit, { message: '', errors: {} });

  return (
    <div className="w-full">
      {/* CONTENIDOR: Vidre fosc en Dark, Blanc amb ombra en Light */}
      <div className="border border-border rounded-2xl p-8 bg-white/50 dark:bg-white/2 backdrop-blur-xl shadow-xl dark:shadow-2xl transition-all duration-300">
        
        <h3 className="text-xl font-bold text-center text-foreground mb-6 flex items-center justify-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Analitza la teva web en segons
        </h3>
        
        <form action={action} className="space-y-4">
          <div className="space-y-1">
            <Input 
              name="url" 
              placeholder="https://la-teva-web.com" 
              // INPUTS: Adaptats a Light (bg-white) i Dark (bg-white/5)
              className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-foreground h-12 focus:border-primary/50 placeholder:text-muted-foreground transition-all"
            />
            {state.errors?.url && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1">
                <AlertCircle className="w-3 h-3" /> {state.errors.url[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input 
              name="email" 
              placeholder="el-teu@email.com" 
              className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-foreground h-12 focus:border-primary/50 placeholder:text-muted-foreground transition-all"
            />
            {state.errors?.email && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1">
                <AlertCircle className="w-3 h-3" /> {state.errors.email[0]}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isPending} 
            className="w-full h-12 mt-2 text-base font-semibold rounded-lg gradient-bg text-white border-0 hover:opacity-90 shadow-lg shadow-primary/20 transition-all"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analitzant...</>
            ) : (
              'Obtenir Informe Gratuït'
            )}
          </Button>
          
          {state.message && (
            <p className="text-center text-muted-foreground text-sm mt-4 bg-muted/50 p-2 rounded-lg border border-border/50">
              {state.message}
            </p>
          )}
        </form>
      </div>
      
      {/* Text de privacitat petit */}
      <p className="text-center text-xs text-muted-foreground mt-4 opacity-60">
        No compartim les teves dades. Informe 100% gratuït.
      </p>
    </div>
  );
}