'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BlogPostDTO } from '@/types/models';
import { DiaryCard } from './DiaryCard';
import { DiaryEmptyState } from './DiaryEmptyState';

export function DiaryStack({ posts }: { posts: BlogPostDTO[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const removeCard = () => {
    // Petit delay perquè l'usuari vegi l'acció abans de canviar l'estat
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 200);
  };

  const resetStack = () => setCurrentIndex(0);

  return (
    <div className="relative w-full h-[650px] flex items-center justify-center overflow-hidden">
      
      {/* TEXT DECORATIU DE FONS */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h3 className="text-[12rem] md:text-[15rem] font-black text-foreground/5 rotate-[-5deg] tracking-tighter">
          BLOG
        </h3>
      </div>

      {/* CONTENIDOR DE LA PILA */}
      <div className="relative w-full max-w-[400px] md:max-w-md h-[550px]">
        <AnimatePresence>
          
          {/* ESTAT BUIT (Quan s'acaben les cartes) */}
          {currentIndex >= posts.length && (
            <DiaryEmptyState onReset={resetStack} />
          )}

          {/* RENDERITZAT DE LES CARTES */}
          {[...posts].reverse().map((post, i) => {
            const originalIndex = posts.length - 1 - i;
            
            // Optimització: Només renderitzem les 3 cartes superiors
            if (originalIndex < currentIndex) return null;
            if (originalIndex > currentIndex + 2) return null;

            const isFront = originalIndex === currentIndex;
            const stackIndex = originalIndex - currentIndex; // 0, 1, 2...

            return (
              <DiaryCard
                key={post.slug}
                post={post}
                index={stackIndex}
                isFront={isFront}
                totalCards={posts.length}
                originalIndex={originalIndex}
                onRemove={removeCard}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}