'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteUserFromOrg } from '@/app/actions/delete-user';

export function UserDeleteButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteUserFromOrg(userId);
      if (!result.success) {
        alert(result.message); // O usa un toast si en tens
      }
      setShowConfirm(false);
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-200">
        <span className="text-xs text-red-500 font-medium hidden sm:inline">Segur?</span>
        <Button 
          size="sm" 
          variant="destructive" 
          onClick={handleDelete}
          disabled={isPending}
          className="h-8 px-3"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Si, esborra'}
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="h-8 w-8 p-0"
        >
          ✕
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
      onClick={() => setShowConfirm(true)}
      title="Eliminar de l'organització"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}