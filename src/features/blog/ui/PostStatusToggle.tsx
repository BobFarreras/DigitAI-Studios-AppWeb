// src/features/blog/ui/PostStatusToggle.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, EyeOff } from 'lucide-react'; // Canvi icones més clares
import { togglePostStatus } from '../actions';
import { useRouter } from 'next/navigation';

type Props = {
  postId: string;
  isPublished: boolean;
};

export function PostStatusToggle({ postId, isPublished }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await togglePostStatus(postId, isPublished);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error canviant l'estat");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPublished) {
    return (
      <Button 
        variant="outline" 
        onClick={handleToggle} 
        disabled={isLoading}
        className="border-yellow-500/30 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500/50"
      >
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <EyeOff className="w-4 h-4 mr-2" />}
        Despublicar
      </Button>
    );
  }

  return (
    <Button 
      variant="outline"
      onClick={handleToggle} 
      disabled={isLoading}
      className="border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/60"
    >
      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
      Publicar
    </Button>
  );
}