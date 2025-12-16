'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BlogPostDTO } from '@/types/models';
import { DiaryCard } from './DiaryCard';
import { DiaryEmptyState } from './DiaryEmptyState';

export function DiaryStack({ posts }: { posts: BlogPostDTO[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const removeCard = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const resetStack = () => setCurrentIndex(0);

  // Agafem els 4 següents per tenir buffer visual
  const visiblePosts = posts.slice(currentIndex, currentIndex + 4); 

  return (
    // overflow-visible és CRÍTIC perquè les cartes puguin "volar" des de fora
    <div className="relative w-full h-187.5 flex items-center justify-center overflow-visible my-8">
      
   

      {/* CONTENIDOR DE LA PILA */}
      <div className="relative w-full max-w-lg h-150 z-10 perspective-1000">
        <AnimatePresence mode="popLayout">
          
          {currentIndex >= posts.length ? (
            <DiaryEmptyState key="empty" onReset={resetStack} />
          ) : (
            visiblePosts.map((post, i) => {
              const stackIndex = i; 
              
              return (
                <DiaryCard
                  key={post.slug}
                  post={post}
                  index={stackIndex}
                  isFront={stackIndex === 0}
                  totalCards={posts.length}
                  currentCardNumber={currentIndex + stackIndex + 1}
                  onRemove={removeCard}
                />
              );
            }).reverse() 
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}