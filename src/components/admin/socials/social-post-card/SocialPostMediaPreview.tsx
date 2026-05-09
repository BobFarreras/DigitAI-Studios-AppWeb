/**
 * @file src/components/admin/socials/social-post-card/SocialPostMediaPreview.tsx
 * @updated 2026-05-09
 * @summary Preview d'imatge/vídeo per post social.
 * @scope Render multimèdia i acció d'eliminar arxiu.
 */
'use client';

import { X } from 'lucide-react';
import Image from 'next/image';

interface Props {
  mediaUrl: string | null;
  isPublished: boolean;
  onRemoveImage: () => void;
}

export function SocialPostMediaPreview({ mediaUrl, isPublished, onRemoveImage }: Props) {
  if (!mediaUrl) return null;

  return (
    <div className="relative w-full aspect-video bg-black/5 dark:bg-black/40 group/media">
      {mediaUrl.match(/\.(mp4|mov|webm)$/i) ? (
        <video src={mediaUrl} className="w-full h-full object-contain" controls />
      ) : (
        <Image src={mediaUrl} alt="Preview" fill className="object-cover transition-opacity duration-500" />
      )}
      {!isPublished && (
        <button
          onClick={onRemoveImage}
          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover/media:opacity-100 transition-all backdrop-blur-sm"
          title="Eliminar arxiu"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
