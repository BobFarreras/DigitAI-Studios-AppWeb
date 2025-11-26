'use client'

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { processWebAudit } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AuditForm() {
  const t = useTranslations('HomePage'); // Assegura't que tens les claus al JSON
  
  // Hook de Next.js 16 / React 19 per gestionar Server Actions
  const [state, action, isPending] = useActionState(processWebAudit, {
    message: '',
    errors: {}
  });

  return (
    <Card className="w-full max-w-md mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">{t('form_title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          
          {/* Camp URL */}
          <div className="space-y-2">
            <Input 
              name="url" 
              placeholder="https://la-teva-web.com" 
              disabled={isPending}
              className={state.errors?.url ? "border-red-500" : ""}
            />
            {state.errors?.url && (
              <p className="text-sm text-red-500">{state.errors.url[0]}</p>
            )}
          </div>

          {/* Camp Email */}
          <div className="space-y-2">
            <Input 
              name="email" 
              type="email" 
              placeholder="el-teu@email.com" 
              disabled={isPending}
              className={state.errors?.email ? "border-red-500" : ""}
            />
             {state.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email[0]}</p>
            )}
          </div>

          {/* Missatge d'error general */}
          {state.message && (
            <p className="text-sm text-red-500 text-center">{state.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Analitzant...' : t('cta')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}