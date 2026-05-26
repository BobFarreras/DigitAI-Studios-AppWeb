/**
 * @file src/components/admin/leads-table/LeadDeleteDialog.tsx
 * @updated 2026-05-09
 * @summary Diàleg de confirmació per eliminar lead.
 * @scope Confirmació d'acció destructiva i estat de càrrega.
 */
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LeadDeleteDialog({ isOpen, isPending, onClose, onConfirm }: Props) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estàs segur?</AlertDialogTitle>
          <AlertDialogDescription>
            Aquesta acció eliminarà permanentment el missatge de la base de dades. No es pot desfer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel·lar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isPending}
          >
            {isPending ? 'Eliminant...' : 'Sí, eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
