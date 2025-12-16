'use client'

import { useState, useRef } from 'react';
import { type Database } from '@/types/database.types';
import { publishSocialPost, changeSocialStatus } from '@/actions/social-media'; // 👈 Importem la nova action
import { createClient } from '@/lib/supabase/client';
import { Loader2, Send, ImagePlus, X, Save, } from 'lucide-react';
import Image from 'next/image';

type SocialPost = Database['public']['Tables']['social_posts']['Row'];
type PostStatus = 'draft' | 'approved' | 'published' | 'failed';

interface SocialPostCardProps {
  post: SocialPost;
  onSave: (id: string, content: string, mediaUrl?: string) => void;
  isSaving: boolean;
}

const PLATFORM_ICONS: Record<string, string> = {
  linkedin: '💼',
  facebook: '📘',
  instagram: '📸'
};

const PLATFORM_STYLES: Record<string, string> = {
  linkedin: 'border-blue-700 bg-blue-50/30',
  facebook: 'border-blue-500 bg-blue-50/30',
  instagram: 'border-pink-500 bg-pink-50/30'
};

// Colors per l'estat
const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
  approved: 'bg-blue-100 text-blue-700 border-blue-200',
  published: 'bg-green-100 text-green-700 border-green-200',
  failed: 'bg-red-100 text-red-700 border-red-200',
};

export function SocialPostCard({ post, onSave, isSaving }: SocialPostCardProps) {
  const [content, setContent] = useState(post.content);
  const [mediaUrl, setMediaUrl] = useState<string | null>(post.media_url);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- GESTIÓ DE CANVI D'ESTAT MANUAL ---
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as PostStatus;
    if (!confirm(`Vols canviar l'estat a "${newStatus}"?`)) return;

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

    setIsUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${post.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('social-media').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('social-media').getPublicUrl(filePath);

      setMediaUrl(publicUrl);
      setIsDirty(true);
      onSave(post.id, content, publicUrl);
      setIsDirty(false);

    } catch (error) {
      console.error(error);
      alert('Error pujant imatge');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setMediaUrl(null);
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave(post.id, content, mediaUrl || '');
    setIsDirty(false);
  };

  const handlePublish = async () => {
    if (post.platform === 'instagram' && !mediaUrl) {
      alert("⚠️ Instagram requereix obligatòriament una imatge.");
      return;
    }
    if (!confirm(`Estàs segur que vols publicar a ${post.platform}?`)) return;

    if (isDirty) await onSave(post.id, content, mediaUrl || '');

    setIsPublishing(true);
    try {
      const res = await publishSocialPost(post.id);
      if (res.success) alert("🚀 Publicat amb èxit!");
      else alert("❌ Error: " + res.message);
    } catch (e) {
      console.error(e);
      alert("Error inesperat publicant.");
    } finally {
      setIsPublishing(false);
    }
  };

  const isPublished = post.status === 'published';

  return (
    <div className={`border-l-4 rounded-r-lg shadow-sm p-4 bg-white flex flex-col h-full transition-all ${PLATFORM_STYLES[post.platform] || 'border-gray-300'}`}>

      {/* CAPÇALERA AMB SELECTOR D'ESTAT */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold capitalize flex items-center gap-2 text-gray-800">
          <span className="text-xl">{PLATFORM_ICONS[post.platform]}</span>
          {post.platform}
        </h3>

        {/* SELECTOR D'ESTAT */}
        <div className="relative">
          <select
            value={post.status}
            onChange={handleStatusChange}
            className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${STATUS_COLORS[post.status] || 'bg-gray-100'}`}
          >
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
          </select>
          {/* Petit indicador visual de canvi */}
        </div>
      </div>

      {/* ÀREA D'IMATGE / VÍDEO */}
      {mediaUrl && (
        <div className="relative mb-3 h-48 w-full rounded-md overflow-hidden border border-gray-200 group bg-gray-50">
          {mediaUrl.match(/\.(mp4|mov|webm)$/i) ? (
            <video src={mediaUrl} className="w-full h-full object-cover" controls />
          ) : (
            <Image src={mediaUrl} alt="Preview" fill className="object-cover" />
          )}

          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500/90 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-sm z-10"
            title="Eliminar arxiu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ÀREA DE TEXT */}
      <textarea
        value={content}
        onChange={handleContentChange}
        className="w-full flex-1 min-h-30 p-3 border rounded-md text-sm font-sans text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4"
        placeholder={`Escriu el teu post per a ${post.platform}...`}
      />

      {/* PEU DE PÀGINA */}
      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">

        {/* BOTÓ PUJAR IMATGE */}
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
            className="text-gray-500 hover:text-blue-600 p-2 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-2 text-xs font-medium"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
            <span>Multimèdia</span>
          </button>
        </div>

        {/* BOTONS ACCIÓ */}
        <div className="flex gap-2">
          {isDirty && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Guardar
            </button>
          )}

          <button
            onClick={handlePublish}
            disabled={isPublishing || isSaving}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-black transition-all disabled:opacity-50 shadow-sm font-medium"
          >
            {isPublishing ? (
              <><Loader2 className="w-3 h-3 animate-spin" /> Publicant...</>
            ) : (
              <><Send className="w-3 h-3" /> Publicar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}