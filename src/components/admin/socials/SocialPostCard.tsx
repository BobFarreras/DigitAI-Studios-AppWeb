'use client'

import { useState, useRef, useEffect } from 'react';
import { type Database } from '@/types/database.types';
import { publishSocialPost, changeSocialStatus } from '@/actions/social-media';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Send, CheckCircle, ImagePlus, X, Save } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type SocialPost = Database['public']['Tables']['social_posts']['Row'];
type PostStatus = 'draft' | 'approved' | 'published' | 'failed';

interface SocialPostCardProps {
  post: SocialPost;
  onSave: (id: string, content: string, mediaUrl?: string) => void;
  isSaving: boolean;
}

// 🎨 ESTILS PREMIUM PER PLATAFORMA
const PLATFORM_THEMES: Record<string, { border: string, bg: string, icon: string, text: string }> = {
  linkedin: { 
    border: 'border-blue-700/20', 
    bg: 'bg-blue-50/30 dark:bg-blue-900/10', 
    text: 'text-blue-700 dark:text-blue-400',
    icon: '👔' 
  },
  facebook: { 
    border: 'border-blue-600/20', 
    bg: 'bg-indigo-50/30 dark:bg-indigo-900/10', 
    text: 'text-indigo-700 dark:text-indigo-400',
    icon: '📘' 
  },
  instagram: { 
    border: 'border-pink-500/20', 
    bg: 'bg-pink-50/30 dark:bg-pink-900/10', 
    text: 'text-pink-700 dark:text-pink-400',
    icon: '📸' 
  }
};

const STATUS_CONFIG: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400',
  approved: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
  published: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400',
  failed: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400',
};

export function SocialPostCard({ post, onSave, isSaving }: SocialPostCardProps) {
  const [content, setContent] = useState(post.content);
  const [mediaUrl, setMediaUrl] = useState<string | null>(post.media_url);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); 
  const supabase = createClient();

  const theme = PLATFORM_THEMES[post.platform] || PLATFORM_THEMES.linkedin;

  // 🪄 AUTO-RESIZE: Ajusta l'alçada del textarea automàticament
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const deleteImageFromStorage = async (urlToDelete: string) => {
    if (!urlToDelete) return;
    try {
      const urlParts = urlToDelete.split('/social-media/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('social-media').remove([filePath]);
      }
    } catch (error) {
      console.error("Error esborrant imatge:", error);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as PostStatus;
    if (newStatus === 'published') {
      alert("Per passar a Published fes servir el botó de Publicar.");
      return;
    }
    try {
      await changeSocialStatus(post.id, newStatus);
    } catch (error) {
      console.error(error);
      alert("Error canviant l'estat");
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (mediaUrl) await deleteImageFromStorage(mediaUrl);

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${post.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('social-media').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('social-media').getPublicUrl(fileName);
      setMediaUrl(publicUrl);
      setIsDirty(true);
      onSave(post.id, content, publicUrl);
      setIsDirty(false);
    } catch (error) {
      console.error(error);
      alert('Error pujant imatge');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!mediaUrl || !confirm("Segur que vols eliminar la imatge?")) return;
    await deleteImageFromStorage(mediaUrl);
    setMediaUrl(null);
    setIsDirty(true);
    onSave(post.id, content, '');
    setIsDirty(false);
  };

  const handleSave = () => {
    onSave(post.id, content, mediaUrl || '');
    setIsDirty(false);
  };

  const handlePublish = async () => {
    if (post.platform === 'instagram' && !mediaUrl) {
      alert("⚠️ Instagram requereix imatge.");
      return;
    }
    if (!confirm(`Publicar a ${post.platform}?`)) return;

    if (isDirty) await onSave(post.id, content, mediaUrl || '');

    setIsPublishing(true);
    try {
      const res = await publishSocialPost(post.id, mediaUrl || undefined);
      if (res.success) alert("🚀 Publicat!");
      else alert("❌ " + res.message);
    } catch (e) {
      console.error(e);
      alert("Error inesperat.");
    } finally {
      setIsPublishing(false);
    }
  };

  const isPublished = post.status === 'published';

  return (
    <div className={cn(
      "group relative flex flex-col h-full rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border bg-white dark:bg-zinc-900/50 overflow-hidden",
      theme.border, theme.bg
    )}>
      
      {/* --- BARRA SUPERIOR (HEADER) --- */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="text-xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform">
            {theme.icon}
          </div>
          <span className={cn("font-bold text-sm tracking-wide capitalize", theme.text)}>
            {post.platform}
          </span>
        </div>

        {/* Selector d'Estat Estilitzat */}
        <div className="relative z-10">
          <select
            value={post.status}
            onChange={handleStatusChange}
            disabled={isPublishing}
            className={cn(
              "appearance-none pl-3 pr-8 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer outline-none transition-all hover:brightness-95 shadow-sm border",
              STATUS_CONFIG[post.status]
            )}
          >
            <option value="draft" className="text-gray-900 bg-white">Draft</option>
            <option value="approved" className="text-gray-900 bg-white">Approved</option>
            <option value="published" className="text-gray-900 bg-white">Published</option>
            <option value="failed" className="text-gray-900 bg-white">Failed</option>
          </select>
          
          {/* Fletxeta custom */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
            <svg width="8" height="6" viewBox="0 0 8 6" fill="currentColor" className="text-current">
               <path d="M4 6L0 0H8L4 6Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* --- COS DE LA TARGETA --- */}
      <div className="flex-1 p-0 flex flex-col">
        
        {/* Àrea Multimèdia */}
        {mediaUrl && (
          <div className="relative w-full aspect-video bg-black/5 dark:bg-black/40 group/media">
            {mediaUrl.match(/\.(mp4|mov|webm)$/i) ? (
               <video src={mediaUrl} className="w-full h-full object-contain" controls />
            ) : (
              <Image src={mediaUrl} alt="Preview" fill className="object-cover transition-opacity duration-500" />
            )}
            
            {!isPublished && (
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover/media:opacity-100 transition-all backdrop-blur-sm"
                title="Eliminar arxiu"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Text Area Intel·ligent */}
        <div className="relative flex-1 p-4">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            disabled={isPublished}
            className="w-full h-full min-h-37.5 bg-transparent resize-none outline-none text-sm text-gray-700 dark:text-gray-200 leading-relaxed placeholder-gray-400 font-medium"
            placeholder={`Escriu alguna cosa brillant per a ${post.platform}...`}
            style={{ overflow: 'hidden' }}
          />
          
          {/* Comptador de caràcters */}
          <div className="absolute bottom-2 right-4 text-[10px] text-gray-400 font-mono opacity-50 select-none">
            {content.length} chars
          </div>
        </div>
      </div>

      {/* --- FOOTER (ACCIONS) --- */}
      <div className="p-3 bg-white/50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 flex justify-between items-center backdrop-blur-sm">
        
        {/* Upload Button */}
        {!isPublished ? (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*"
              onChange={handleImageUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isSaving}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4 group-hover:scale-110 transition-transform" />}
              <span>{mediaUrl ? 'Canviar' : 'Afegir Media'}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-green-600 text-xs font-bold px-2 py-1 bg-green-50 rounded-md">
            <CheckCircle className="w-3.5 h-3.5" /> Publicat
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isDirty && !isPublished && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 rounded-lg transition-all active:scale-95"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Guardar
            </button>
          )}

          {!isPublished && (
            <button
              onClick={handlePublish}
              disabled={isPublishing || isSaving}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95",
                isPublishing 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-linear-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 dark:from-white dark:to-gray-200 dark:text-black"
              )}
            >
              {isPublishing ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Publicant...</>
              ) : (
                <><Send className="w-3.5 h-3.5" /> Publicar</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}