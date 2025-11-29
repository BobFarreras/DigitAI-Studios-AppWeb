// =================== FILE: src/features/auth/ui/ResetPasswordForm.tsx ===================

'use client'

import { useActionState } from 'react';
import { updatePassword } from '../actions/reset-password';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function ResetPasswordForm() {
  const [state, action, isPending] = useActionState(updatePassword, {
    message: '',
    errors: {}
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Nova Contrasenya</label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              className={state.errors?.password ? "border-red-500" : ""}
            />
            {state.errors?.password && (
              <p className="text-sm text-red-500">{state.errors.password[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Contrasenya</label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              className={state.errors?.confirmPassword ? "border-red-500" : ""}
            />
            {state.errors?.confirmPassword && (
              <p className="text-sm text-red-500">{state.errors.confirmPassword[0]}</p>
            )}
          </div>

          {state.message && (
            <p className="text-sm text-red-500 text-center">{state.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Guardar nova contrasenya"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}