'use client'

import { useState } from 'react';
import { SocialsManager } from '@/components/admin/socials/SocialManager'; // El component de la Fase 4
import { FileText, Share2 } from 'lucide-react';
import { type Database } from '@/types/database.types';

type SocialPost = Database['public']['Tables']['social_posts']['Row'];

interface PostViewTabsProps {
  postId: string;
  socialPosts: SocialPost[];
  children: React.ReactNode; // Aquí hi anirà el teu Grid actual de contingut
}

export function PostViewTabs({ postId, socialPosts, children }: PostViewTabsProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'social'>('content');

  return (
    <div className="space-y-6">
      {/* NAVEGACIÓ DE PESTANYES */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('content')}
            className={`
              whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 transition-colors
              ${activeTab === 'content'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
              }
            `}
          >
            <FileText className="w-4 h-4" />
            Contingut de l'Article
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`
              whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 transition-colors
              ${activeTab === 'social'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
              }
            `}
          >
            <Share2 className="w-4 h-4" />
            Distribució Social (IA)
            {socialPosts.length > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                {socialPosts.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* AREA DE CONTINGUT */}
      <div className="min-h-125 animate-in fade-in duration-300">
        {activeTab === 'content' ? (
          // Renderitzem el Grid original que ens passen com a children
          children
        ) : (
          // Renderitzem el gestor de xarxes socials
          <div className="max-w-4xl">
             <SocialsManager postId={postId} existingPosts={socialPosts} />
          </div>
        )}
      </div>
    </div>
  );
}