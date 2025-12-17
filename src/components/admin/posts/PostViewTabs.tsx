'use client';

import { useState } from 'react';
import { SocialsManager } from '@/components/admin/socials/SocialManager';
import { FileText, Share2 } from 'lucide-react';
import { type Database } from '@/types/database.types';
import { cn } from '@/lib/utils';

type SocialPost = Database['public']['Tables']['social_posts']['Row'];

interface PostViewTabsProps {
  postId: string;
  socialPosts: SocialPost[];
  children: React.ReactNode;
}

type TabKey = 'content' | 'social';

export function PostViewTabs({ postId, socialPosts, children }: PostViewTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('content');

  return (
    <div className="space-y-6">
      {/* CONTAINER NAVEGACIÓ:
        - Mòbil: Fons gris suau (muted), padding, cantonades arrodonides.
        - Desktop (sm): Fons transparent, sense padding, vora inferior standard.
      */}
      <div className="sm:border-b sm:border-border">
        <nav 
          className={cn(
            "grid grid-cols-2 p-1 bg-muted rounded-xl gap-1", // Estil Mòbil (Segmented Control)
            "sm:flex sm:bg-transparent sm:p-0 sm:gap-8 sm:rounded-none" // Estil Desktop (Tabs clàssics)
          )}
          aria-label="Gestió de l'article" 
          role="tablist"
        >
          {/* Tab: Contingut */}
          <ResponsiveTabButton
            id="content"
            isActive={activeTab === 'content'}
            onClick={() => setActiveTab('content')}
            icon={<FileText className="w-4 h-4" />}
            label="Contingut"
            desktopLabel="Contingut de l'Article"
          />

          {/* Tab: Social */}
          <ResponsiveTabButton
            id="social"
            isActive={activeTab === 'social'}
            onClick={() => setActiveTab('social')}
            icon={<Share2 className="w-4 h-4" />}
            label="Social IA"
            desktopLabel="Distribució Social (IA)"
            badgeCount={socialPosts.length > 0 ? socialPosts.length : undefined}
            activeColorClass="text-purple-600 sm:border-purple-500"
          />
        </nav>
      </div>

      {/* AREA DE CONTINGUT */}
      <div 
        className="min-h-[500px] animate-in fade-in slide-in-from-bottom-2 duration-300"
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === 'content' ? (
          <section aria-label="Editor de contingut">
            {children}
          </section>
        ) : (
          <section aria-label="Gestor de xarxes socials" className="max-w-4xl">
            <SocialsManager postId={postId} existingPosts={socialPosts} />
          </section>
        )}
      </div>
    </div>
  );
}

// 🧩 Subcomponent que canvia d'estil radicalment segons la pantalla
interface ResponsiveTabButtonProps {
  id: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string; // Text curt per mòbil
  desktopLabel: string; // Text llarg per desktop
  badgeCount?: number;
  activeColorClass?: string;
}

function ResponsiveTabButton({ 
  id,
  isActive, 
  onClick, 
  icon, 
  label, 
  desktopLabel,
  badgeCount, 
  activeColorClass = 'text-primary sm:border-primary' 
}: ResponsiveTabButtonProps) {
  return (
    <button
      id={`tab-${id}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      onClick={onClick}
      className={cn(
        // ESTILS BASE (Comuns)
        "flex items-center justify-center gap-2 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        
        // 📱 ESTILS MÒBIL (Pill / Button shape)
        "rounded-lg py-2.5",
        isActive 
          ? "bg-background text-foreground shadow-sm" // Actiu mòbil: blanc amb ombra
          : "text-muted-foreground hover:bg-background/50 hover:text-foreground", // Inactiu mòbil

        // 💻 ESTILS DESKTOP (Tab shape)
        "sm:rounded-t-md sm:rounded-b-none sm:bg-transparent sm:py-4 sm:shadow-none sm:px-1 sm:border-b-2 sm:border-transparent sm:justify-start",
        isActive 
          ? cn("sm:bg-transparent", activeColorClass) // Actiu desktop: vora de color
          : "sm:hover:border-border sm:hover:text-foreground"
      )}
    >
      {icon}
      
      {/* Text: Mostrem el curt en mòbil, el llarg en desktop */}
      <span className="block sm:hidden">{label}</span>
      <span className="hidden sm:block">{desktopLabel}</span>

      {badgeCount !== undefined && (
        <span className={cn(
          "ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold sm:text-xs sm:font-medium",
          isActive 
            ? "bg-primary/10 text-primary" 
            : "bg-muted-foreground/20 text-muted-foreground"
        )}>
          {badgeCount}
        </span>
      )}
    </button>
  );
}