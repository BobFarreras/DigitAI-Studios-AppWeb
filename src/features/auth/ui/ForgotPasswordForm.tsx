// =================== FILE: src/features/auth/ui/ForgotPasswordForm.tsx ===================

'use client'

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { requestPasswordReset } from '../actions/reset-password';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordForm() {
  const t = useTranslations('Auth'); // Assegura't de tenir les traduccions
  
  const [state, action, isPending] = useActionState(requestPasswordReset, {
    message: '',
    errors: {}
  });

  if (state.success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
          <p className="text-green-800 font-medium">{state.message}</p>
          <p className="text-sm text-green-700">Revisa la teva safata d'entrada.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="tu@exemple.com"
              className={state.errors?.email ? "border-red-500" : ""}
            />
            {state.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email[0]}</p>
            )}
          </div>

          {state.message && !state.success && (
            <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">{state.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enviar enllaç de recuperació"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}