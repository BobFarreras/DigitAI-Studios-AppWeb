/**
 * @file src/features/blog/ui/ReactionDock.tsx
 * @updated 2026-05-09
 * @summary Dock flotant de reaccions per articles del blog.
 * @scope Estat local, persistència visitor/reaccions i orchestration d'accions.
 */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleReactionAction } from '../actions';
import { REACTIONS } from './reaction-dock/constants';
import { ReactionFab } from './reaction-dock/ReactionFab';
import { ReactionMenuItem } from './reaction-dock/ReactionMenuItem';

type Props = {
  slug: string;
  initialCounts: Record<string, number>;
};

export function ReactionDock({ slug, initialCounts }: Props) {
  const [counts, setCounts] = useState(initialCounts);
  const [myReactions, setMyReactions] = useState<Set<string>>(new Set());
  const [visitorId, setVisitorId] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      let vid = localStorage.getItem('digitai_visitor_id');
      if (!vid) {
        vid = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('digitai_visitor_id', vid);
      }
      setVisitorId(vid);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => {
      const stored = localStorage.getItem(`react_${slug}`);
      if (stored) {
        try {
          setMyReactions(new Set(JSON.parse(stored)));
        } catch {
          setMyReactions(new Set());
        }
      } else {
        setMyReactions(new Set());
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [slug, isMounted]);

  const handleReact = async (reactionId: string) => {
    if (!visitorId) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(50);
      } catch {}
    }
    const isActive = myReactions.has(reactionId);
    setMyReactions((prev) => {
      const next = new Set(prev);
      if (isActive) next.delete(reactionId);
      else next.add(reactionId);
      localStorage.setItem(`react_${slug}`, JSON.stringify(Array.from(next)));
      return next;
    });
    setCounts((prev) => ({ ...prev, [reactionId]: Math.max(0, (prev[reactionId] || 0) + (isActive ? -1 : 1)) }));
    await toggleReactionAction(slug, reactionId, visitorId);
  };

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 flex flex-col-reverse items-end gap-4">
      <ReactionFab isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col gap-3 pb-2 items-end">
            {REACTIONS.map((reaction, index) => (
              <motion.div
                key={reaction.id}
                initial={{ opacity: 0, y: 20, scale: 0.5, x: 20 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                exit={{ opacity: 0, y: 20, scale: 0.5, transition: { duration: 0.2 } }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-3 justify-end group"
              >
                <span className="text-[10px] md:text-xs font-bold text-white bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                  {reaction.label}
                </span>
                <ReactionMenuItem reaction={reaction} count={counts[reaction.id]} isActive={myReactions.has(reaction.id)} onReact={handleReact} />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
