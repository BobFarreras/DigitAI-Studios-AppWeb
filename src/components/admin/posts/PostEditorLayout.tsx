'use client'

import { useState } from 'react';
import { SocialsManager } from '@/components/admin/socials/SocialManager';
import { type Database } from '@/types/database.types';

type Post = Database['public']['Tables']['posts']['Row'];
type SocialPost = Database['public']['Tables']['social_posts']['Row'];

interface PostEditorLayoutProps {
  post: Post;
  socialPosts: SocialPost[];
  children: React.ReactNode; // Aquí hi anirà el formulari d'edició del blog (el que ja tenies)
}

export function PostEditorLayout({ post, socialPosts, children }: PostEditorLayoutProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'social'>('content');

  return (
    <div className="space-y-6">
      {/* Capçalera del Post */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
            <p className="text-sm text-gray-500">Estat: {post.status}</p>
        </div>
        
        {/* Navegació per Pestanyes */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'content' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                📝 Contingut & SEO
            </button>
            <button
                onClick={() => setActiveTab('social')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'social' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                🤖 IA Social Media
            </button>
        </div>
      </div>

      {/* Contingut de les Pestanyes */}
      <div className="min-h-125">
        {activeTab === 'content' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Renderitzem el formulari d'edició normal */}
                {children}
            </div>
        )}

        {activeTab === 'social' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <SocialsManager 
                    postId={post.id} 
                    existingPosts={socialPosts} 
                />
            </div>
        )}
      </div>
    </div>
  );
}