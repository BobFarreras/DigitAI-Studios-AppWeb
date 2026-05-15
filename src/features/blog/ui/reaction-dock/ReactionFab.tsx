/**
 * @file src/features/blog/ui/reaction-dock/ReactionFab.tsx
 * @updated 2026-05-09
 * @summary Botó principal flotant per obrir/tancar el dock.
 * @scope UI del trigger FAB i estats visuals.
 */
'use client';

import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

export function ReactionFab({ isOpen, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-xl transition-all duration-500 ease-out z-50',
        isOpen ? 'bg-slate-900 text-white rotate-[135deg] border-red-500/50' : 'bg-slate-900/80 hover:bg-slate-800 text-cyan-400 hover:scale-110',
      )}
    >
      <Plus className="w-6 h-6 md:w-7 md:h-7" />
    </button>
  );
}
