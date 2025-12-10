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
      className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/30 transition-colors"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
      Eliminar Test
    </Button>
  );
}