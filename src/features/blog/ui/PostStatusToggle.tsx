'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Globe, EyeOff } from 'lucide-react';
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
      // Opcional: forçar refresh del router client
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
        size="sm" 
        onClick={handleToggle} 
        disabled={isLoading}
        className="border-yellow-600/50 text-yellow-500 hover:bg-yellow-900/20 hover:text-yellow-400"
      >
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <EyeOff className="w-4 h-4 mr-2" />}
        Passar a Esborrany
      </Button>
    );
  }

  return (
    <Button 
      size="sm" 
      onClick={handleToggle} 
      disabled={isLoading}
      className="bg-green-600 hover:bg-green-700 text-white border-0"
    >
      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
      Publicar Ara
    </Button>
  );
}