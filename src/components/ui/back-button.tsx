'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  projectId?: string; // Opcional: Si el sabem, podem forçar tornar al projecte
}

export function BackButton({ projectId }: BackButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Mirem si venim amb un paràmetre ?source=project
  const source = searchParams.get('source');

  const handleBack = () => {
    if (source === 'project' && projectId) {
      // Si venim explícitament del projecte, tornem al projecte
      router.push(`/admin/projects/${projectId}`);
    } else {
      // Comportament per defecte (historial enrere o llista de tests)
      // Si no hi ha historial, router.back() a vegades no fa res, 
      // així que podríem forçar /admin/tests com a fallback segur.
      router.back();
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleBack}
      className="text-slate-400 hover:text-white hover:bg-white/10 gap-2 pl-0"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="hidden sm:inline">Tornar enrere</span>
      <span className="sm:hidden">Tornar</span>
    </Button>
  );
}