/**
 * @file src/components/admin/socials/SocialPostCard.tsx
 * @updated 2026-05-09
 * @summary Targeta d'edició/publicació per post social.
 * @scope Estat local i orquestració d'accions media/status/publish.
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { changeSocialStatus, publishSocialPost, removeSocialMedia, uploadSocialMedia } from '@/actions/social-media';
import { cn } from '@/lib/utils';
import { PLATFORM_THEMES, STATUS_CONFIG } from './social-post-card/constants';
import { SocialPostCardFooter } from './social-post-card/SocialPostCardFooter';
import { SocialPostCardHeader } from './social-post-card/SocialPostCardHeader';
import { SocialPostMediaPreview } from './social-post-card/SocialPostMediaPreview';
import { PostStatus, SocialPostCardProps } from './social-post-card/types';

export function SocialPostCard({ post, onSave, isSaving }: SocialPostCardProps) {
  const [content, setContent] = useState(post.content);
  const [mediaUrl, setMediaUrl] = useState<string | null>(post.media_url);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const theme = PLATFORM_THEMES[post.platform] || PLATFORM_THEMES.linkedin, isPublished = post.status === 'published';

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [content]);

  const deleteImageFromStorage = async (urlToDelete: string) => {
    if (!urlToDelete) return;
    try {
      await removeSocialMedia(urlToDelete);
    } catch (error) {
      console.error('Error esborrant imatge:', error);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as PostStatus;
    if (newStatus === 'published') return alert('Per passar a Published fes servir el botó de Publicar.');
    try {
      await changeSocialStatus(post.id, newStatus);
    } catch (error) {
      console.error(error);
      alert("Error canviant l'estat");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (mediaUrl) await deleteImageFromStorage(mediaUrl);
    setIsUploading(true);
    try {
      const uploadResult = await uploadSocialMedia(post.id, file, mediaUrl);
      setMediaUrl(uploadResult.publicUrl);
      setIsDirty(true);
      onSave(post.id, content, uploadResult.publicUrl);
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
    if (!mediaUrl || !confirm('Segur que vols eliminar la imatge?')) return;
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
    if (post.platform === 'instagram' && !mediaUrl) return alert('⚠️ Instagram requereix imatge.');
    if (!confirm(`Publicar a ${post.platform}?`)) return;
    if (isDirty) await onSave(post.id, content, mediaUrl || '');
    setIsPublishing(true);
    try {
      const res = await publishSocialPost(post.id, mediaUrl || undefined);
      alert(res.success ? '🚀 Publicat!' : `❌ ${res.message}`);
    } catch (e) {
      console.error(e);
      alert('Error inesperat.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className={cn('group relative flex flex-col h-full rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border bg-white dark:bg-zinc-900/50 overflow-hidden', theme.border, theme.bg)}>
      <SocialPostCardHeader
        platform={post.platform}
        icon={theme.icon}
        textClassName={theme.text}
        status={post.status}
        statusClassName={STATUS_CONFIG[post.status]}
        isPublishing={isPublishing}
        onStatusChange={handleStatusChange}
      />

      <div className="flex-1 p-0 flex flex-col">
        <SocialPostMediaPreview mediaUrl={mediaUrl} isPublished={isPublished} onRemoveImage={handleRemoveImage} />
        <div className="relative flex-1 p-4">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsDirty(true);
            }}
            disabled={isPublished}
            className="w-full h-full min-h-37.5 bg-transparent resize-none outline-none text-sm text-gray-700 dark:text-gray-200 leading-relaxed placeholder-gray-400 font-medium"
            placeholder={`Escriu alguna cosa brillant per a ${post.platform}...`}
            style={{ overflow: 'hidden' }}
          />
          <div className="absolute bottom-2 right-4 text-[10px] text-gray-400 font-mono opacity-50 select-none">{content.length} chars</div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleImageUpload} />
      <SocialPostCardFooter
        isPublished={isPublished}
        isUploading={isUploading}
        isSaving={isSaving}
        isDirty={isDirty}
        isPublishing={isPublishing}
        mediaUrl={mediaUrl}
        onPickMedia={() => fileInputRef.current?.click()}
        onSave={handleSave}
        onPublish={handlePublish}
      />
    </div>
  );
}
