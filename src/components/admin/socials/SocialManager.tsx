'use client'

import { useState } from 'react';
import { SocialPostCard } from './SocialPostCard';
import { generateSocialsForPost, updateSocialPostContent } from '@/actions/social-media';
import { type Database } from '@/types/database.types';

type SocialPost = Database['public']['Tables']['social_posts']['Row'];

interface SocialsManagerProps {
    postId: string;
    existingPosts: SocialPost[];
}

export function SocialsManager({ postId, existingPosts }: SocialsManagerProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Botó per generar si no n'hi ha
    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await generateSocialsForPost(postId);
            if (!res.success) alert(res.message);
            // La revalidatePath del server action actualitzarà la vista automàticament
        } catch (e) {
            console.error(e);
            alert("Error inesperat generant socials");
        } finally {
            setIsGenerating(false);
        }
    };

    // Funció per guardar edicions (ARA ACCEPTA MEDIA URL)
    const handleUpdate = async (id: string, content: string, mediaUrl?: string) => {
        setIsSaving(true);
        try {
            // Passem el 3r paràmetre
            await updateSocialPostContent(id, content, mediaUrl);
        } catch (e) {
            console.error(e);
            alert("Error guardant");
        } finally {
            setIsSaving(false);
        }
    };

    if (existingPosts.length === 0) {
        return (
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Aquest post encara no té contingut social</h3>
                <p className="text-sm text-gray-500 mb-6">Genera automàticament esborranys per a LinkedIn, Facebook i Instagram.</p>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 mx-auto"
                >
                    {isGenerating ? '✨ La IA està treballant...' : '✨ Generar Socials amb IA'}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">📲 Distribució Social</h2>
                <button
                    onClick={handleGenerate}
                    className="text-xs text-indigo-600 hover:underline"
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Regenerant...' : '🔄 Regenerar de nou'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Ordenem per tenir sempre el mateix ordre visual */}
                {existingPosts
                    .sort((a, b) => a.platform.localeCompare(b.platform))
                    .map((post) => (
                        <SocialPostCard
                            key={post.id}
                            post={post}
                            onSave={handleUpdate}
                            isSaving={isSaving}
                        />
                    ))}
            </div>
        </div>
    );
}