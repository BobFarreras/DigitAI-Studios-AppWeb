'use client';

import { useState } from 'react';
import { deleteCampaignAction } from '@/features/tests/actions/admin-actions';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  campaignId: string;
  projectId: string;
}

export function DeleteCampaignButton({ campaignId, projectId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("⚠️ ATENCIÓ: Estàs segur que vols eliminar aquesta campanya?\n\nS'esborraran totes les tasques, resultats i assignacions de forma permanent.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCampaignAction(campaignId, projectId);
      // Nota: Si l'acció fa redirect, el codi d'aquí sota potser no s'arriba a executar, 
      // però el toast ajuda si hi ha retard.
      toast.success("Campanya eliminada");
    } catch (error) {
      console.error(error);
      toast.error("Error eliminant la campanya");
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 transition-colors"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
      Eliminar Test
    </Button>
  );
}