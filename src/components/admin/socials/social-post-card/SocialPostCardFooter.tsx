/**
 * @file src/components/admin/socials/social-post-card/SocialPostCardFooter.tsx
 * @updated 2026-05-09
 * @summary Footer d'accions de la targeta social.
 * @scope Upload de media, guardat manual i trigger de publicació.
 */
'use client';

import { CheckCircle, ImagePlus, Loader2, Save, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isPublished: boolean;
  isUploading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  isPublishing: boolean;
  mediaUrl: string | null;
  onPickMedia: () => void;
  onSave: () => void;
  onPublish: () => void;
}

export function SocialPostCardFooter({
  isPublished,
  isUploading,
  isSaving,
  isDirty,
  isPublishing,
  mediaUrl,
  onPickMedia,
  onSave,
  onPublish,
}: Props) {
  return (
    <div className="p-3 bg-white/50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 flex justify-between items-center backdrop-blur-sm">
      {!isPublished ? (
        <button
          onClick={onPickMedia}
          disabled={isUploading || isSaving}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4 group-hover:scale-110 transition-transform" />}
          <span>{mediaUrl ? 'Canviar' : 'Afegir Media'}</span>
        </button>
      ) : (
        <div className="flex items-center gap-1 text-green-600 text-xs font-bold px-2 py-1 bg-green-50 rounded-md">
          <CheckCircle className="w-3.5 h-3.5" /> Publicat
        </div>
      )}

      <div className="flex items-center gap-2">
        {isDirty && !isPublished && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 rounded-lg transition-all active:scale-95"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Guardar
          </button>
        )}
        {!isPublished && (
          <button
            onClick={onPublish}
            disabled={isPublishing || isSaving}
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95',
              isPublishing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-linear-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 dark:from-white dark:to-gray-200 dark:text-black',
            )}
          >
            {isPublishing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Publicant...</> : <><Send className="w-3.5 h-3.5" /> Publicar</>}
          </button>
        )}
      </div>
    </div>
  );
}
