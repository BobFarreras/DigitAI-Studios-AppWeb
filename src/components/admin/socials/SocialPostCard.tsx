'use client'

import { useState, useRef } from 'react';
import { type Database } from '@/types/database.types';
import { publishSocialPost, changeSocialStatus } from '@/actions/social-media';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Send, CheckCircle, ImagePlus, X, Save } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Assumint que tens la utilitat cn de shadcn, sino esborra-la i fes strings normals

type SocialPost = Database['public']['Tables']['social_posts']['Row'];
type PostStatus = 'draft' | 'approved' | 'published' | 'failed';

interface SocialPostCardProps {
  post: SocialPost;
  onSave: (id: string, content: string, mediaUrl?: string) => void;
  isSaving: boolean;
}

// 🎨 ESTILS ADAPTATIUS (Light & Dark)
// Fem servir colors amb transparència (/10, /20) perquè quedin bé sobre fons foscos
const PLATFORM_STYLES: Record<string, string> = {
  linkedin: 'border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500',
  facebook: 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-400',
  instagram: 'border-pink-500 bg-pink-50/50 dark:bg-pink-900/10 dark:border-pink-500'
};

const PLATFORM_ICONS: Record<string, string> = {
  linkedin: '💼', facebook: '📘', instagram: '📸'
};

// 🎨 ESTATS ADAPTATIUS
const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
  approved: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  published: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  failed: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

export function SocialPostCard({ post, onSave, isSaving }: SocialPostCardProps) {
  const [content, setContent] = useState(post.content);
  const [mediaUrl, setMediaUrl] = useState<string | null>(post.media_url);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const deleteImageFromStorage = async (urlToDelete: string) => {
    if (!urlToDelete) return;
    try {
      // Convertim la URL completa en el path relatiu
      // Ex: https://.../storage/v1/object/public/social-media/carpeta/foto.jpg -> carpeta/foto.jpg
      const urlParts = urlToDelete.split('/social-media/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1]; // Agafem la part després del nom del bucket

        console.log("🗑️ Intentant esborrar:", filePath);

        const { error } = await supabase
          .storage
          .from('social-media')
          .remove([filePath]); // IMPORTANT: Passar com array

        if (error) {
          console.error("Error Supabase Delete:", error);
        } else {
          console.log("✅ Esborrat correctament");
        }
      }
    } catch (error) {
      console.error("Error esborrant imatge:", error);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as PostStatus;
    // Petit hack per no demanar confirmació si només estem jugant, però recomanable
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

    // 1. Si ja hi ha una imatge, l'esborrem primer per no acumular brossa
    if (mediaUrl) {
      await deleteImageFromStorage(mediaUrl);
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${post.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('social-media').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('social-media').getPublicUrl(filePath);

      setMediaUrl(publicUrl);
      setIsDirty(true);
      // Guardem immediatament per no perdre la referència si l'usuari tanca
      onSave(post.id, content, publicUrl);
      setIsDirty(false);

    } catch (error) {
      alert('Error pujant imatge');
      console.error(error);
    } finally {
      setIsUploading(false);
      // Resetem l'input per poder pujar la mateixa imatge si cal
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!mediaUrl) return;
    if (!confirm("Segur que vols eliminar la imatge?")) return;

    // 1. Esborrem del Storage
    await deleteImageFromStorage(mediaUrl);

    // 2. Actualitzem estat local
    setMediaUrl(null);
    setIsDirty(true);

    // 3. Actualitzem DB (passem string buit o lògica de null al pare)
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

    // Guardem per si de cas, però la màgia la farem a la línia següent
    if (isDirty) await onSave(post.id, content, mediaUrl || '');

    setIsPublishing(true);
    try {
      // 🔥 CLAU MÀGICA: Li passem 'mediaUrl' (l'estat local) directament a la funció!
      // Així no importa si la DB és lenta, el servidor rebrà la foto sí o sí.
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
      "flex flex-col h-full border-l-4 rounded-r-lg shadow-sm p-4 transition-all duration-200",
      "bg-white dark:bg-zinc-900", // Fons base Light/Dark
      PLATFORM_STYLES[post.platform] || 'border-gray-300 dark:border-zinc-700'
    )}>

      {/* --- HEADER --- */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h3 className="font-bold capitalize flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <span className="text-xl">{PLATFORM_ICONS[post.platform]}</span>
          {post.platform}
        </h3>

        <div className="relative">
          <select
            value={post.status}
            onChange={handleStatusChange}
            disabled={isPublishing}
            className={cn(
              "text-[10px] uppercase font-bold px-2 py-1 rounded-full border appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500",
              STATUS_COLORS[post.status]
            )}
          >
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* --- MEDIA AREA (Responsive Height) --- */}
      {mediaUrl && (
        <div className="relative mb-4 w-full aspect-video rounded-md overflow-hidden border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 group">
          {mediaUrl.match(/\.(mp4|mov|webm)$/i) ? (
            <video src={mediaUrl} className="w-full h-full object-contain" controls />
          ) : (
            <Image src={mediaUrl} alt="Preview" fill className="object-cover" />
          )}

          {!isPublished && (
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-sm z-10"
              title="Eliminar arxiu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* --- TEXT AREA --- */}
      <textarea
        value={content}
        onChange={handleContentChange}
        disabled={isPublished}
        className="w-full flex-1 min-h-30 p-3 border rounded-md text-sm font-sans 
                   text-gray-700 bg-white border-gray-200 
                   dark:text-gray-200 dark:bg-zinc-950 dark:border-zinc-800 
                   focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4"
        placeholder={`Escriu el teu post per a ${post.platform}...`}
      />

      {/* --- FOOTER (Actions) --- */}
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">

        {/* Botó Pujar (Visible només si no està publicat) */}
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
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors
                               text-gray-600 hover:bg-gray-100 hover:text-blue-600
                               dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
              <span>{mediaUrl ? 'Canviar' : 'Multimèdia'}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs font-bold px-2">
            <CheckCircle className="w-4 h-4" /> Publicat
          </div>
        )}

        {/* Botons Guardar/Publicar */}
        <div className="flex items-center gap-2 ml-auto">
          {isDirty && !isPublished && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-md border transition-colors
                               bg-white border-gray-300 text-gray-700 hover:bg-gray-50
                               dark:bg-zinc-900 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Guardar</span>
            </button>
          )}

          {!isPublished && (
            <button
              onClick={handlePublish}
              disabled={isPublishing || isSaving}
              className="flex items-center gap-2 text-xs px-4 py-2 rounded-md font-medium shadow-sm transition-all
                               bg-gray-900 text-white hover:bg-black
                               dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white
                               disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> <span className="hidden sm:inline">Publicant...</span></>
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