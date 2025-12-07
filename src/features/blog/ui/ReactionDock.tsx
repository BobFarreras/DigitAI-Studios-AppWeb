'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleReactionAction } from '../actions';
import { cn } from '@/lib/utils';
import { Plus, Heart } from 'lucide-react'; // Icones del Trigger

// 1. DEFINICIÓ DE TIPUS (Per arreglar l'error 'any')
type ReactionItem = {
    id: string;
    emoji: string;
    label: string;
};

interface ReactionButtonProps {
    reaction: ReactionItem;
    count: number;
    isActive: boolean;
    onReact: (id: string) => void;
}

const REACTIONS: ReactionItem[] = [
    { id: 'like', emoji: '❤️', label: 'Love' },
    { id: 'mindblown', emoji: '🤯', label: 'Wow' },
    { id: 'rocket', emoji: '🚀', label: 'Boost' },
    { id: 'party', emoji: '🎉', label: 'Party' },
];

type Props = {
    slug: string;
    initialCounts: Record<string, number>;
};

export function ReactionDock({ slug, initialCounts }: Props) {
    const [counts, setCounts] = useState(initialCounts);
    const [myReactions, setMyReactions] = useState<Set<string>>(new Set());
    const [visitorId, setVisitorId] = useState<string>('');
    const [isMounted, setIsMounted] = useState(false);
    
    // Estat per obrir/tancar el menú (Unificat Mòbil/PC)
    const [isOpen, setIsOpen] = useState(false);

    // 1. INITIAL SETUP
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

    // 2. LOAD STATE
    useEffect(() => {
        if (!isMounted) return;
        const timer = setTimeout(() => {
            const stored = localStorage.getItem(`react_${slug}`);
            if (stored) {
                try { setMyReactions(new Set(JSON.parse(stored))); } catch { setMyReactions(new Set()); }
            } else {
                setMyReactions(new Set());
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [slug, isMounted]);

    // 3. HANDLER
    const handleReact = async (reactionId: string) => {
        if (!visitorId) return;
        
        // Hàptic Feedback
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate(50); } catch {}
        }

        const isActive = myReactions.has(reactionId);

        setMyReactions(prev => {
            const next = new Set(prev);
            if (isActive) next.delete(reactionId); else next.add(reactionId);
            localStorage.setItem(`react_${slug}`, JSON.stringify(Array.from(next)));
            return next;
        });

        setCounts(prev => ({
            ...prev,
            [reactionId]: Math.max(0, (prev[reactionId] || 0) + (isActive ? -1 : 1))
        }));

        await toggleReactionAction(slug, reactionId, visitorId);
    };

    if (!isMounted) return null;

    return (
        // CONTENIDOR FIX (POSICIÓ RESPONSIVE)
        // Mòbil: bottom-24 (sobre navbar). Escriptori: bottom-8 (cantonada)
        <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 flex flex-col-reverse items-end gap-4">
            
            {/* 1. BOTÓ TRIGGER PRINCIPAL (FAB) */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-xl transition-all duration-500 ease-out z-50",
                    isOpen 
                        ? "bg-slate-900 text-white rotate-[135deg] border-red-500/50" 
                        : "bg-slate-900/80 hover:bg-slate-800 text-cyan-400 hover:scale-110"
                )}
            >
                <Plus className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            {/* 2. LLISTA DESPLEGABLE (Vertical) */}
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col gap-3 pb-2 items-end">
                        {REACTIONS.map((r, i) => (
                            <motion.div
                                key={r.id}
                                initial={{ opacity: 0, y: 20, scale: 0.5, x: 20 }}
                                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                                exit={{ opacity: 0, y: 20, scale: 0.5, transition: { duration: 0.2 } }}
                                transition={{ 
                                    delay: i * 0.05, 
                                    type: "spring", 
                                    stiffness: 300, 
                                    damping: 20 
                                }}
                                className="flex items-center gap-3 justify-end group"
                            >
                                {/* Etiqueta (Tooltip) */}
                                <span className="text-[10px] md:text-xs font-bold text-white bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                    {r.label}
                                </span>
                                
                                {/* Botó de Reacció */}
                                <ReactionButton 
                                    reaction={r} 
                                    count={counts[r.id]} 
                                    isActive={myReactions.has(r.id)} 
                                    onReact={handleReact}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ==========================================
// SUB-COMPONENT BOTÓ (Tipat Correctament)
// ==========================================
function ReactionButton({ reaction: r, count, isActive, onReact }: ReactionButtonProps) {
    return (
        <div className="relative">
            {/* Comptador (Badge) */}
            <AnimatePresence>
                {(count || 0) > 0 && (
                    <motion.div
                        key="count"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -top-2 -left-2 z-20 font-bold text-white bg-cyan-600 px-1.5 py-0.5 min-w-[20px] text-center rounded-full text-[10px] border border-cyan-400 shadow-lg pointer-events-none"
                    >
                        {count}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* El Botó en si */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onReact(r.id)}
                className={cn(
                    "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl md:text-2xl rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 relative overflow-hidden",
                    isActive 
                        ? "bg-slate-800 border-cyan-500/50 shadow-cyan-500/20" 
                        : "bg-slate-900/90 border-slate-700 hover:bg-slate-800"
                )}
            >
                <span className="filter drop-shadow-md select-none relative z-10">{r.emoji}</span>
                
                {isActive && (
                    <motion.div
                        layoutId={`glow-${r.id}`}
                        className="absolute inset-0 bg-cyan-500/20 blur-md"
                    />
                )}
            </motion.button>
        </div>
    );
}