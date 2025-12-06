'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo, animate } from 'framer-motion';
import { BlogPostDTO } from '@/types/models';
import { Link } from '@/routing';
import Image from 'next/image';
import { ArrowRight, GripVertical, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DiaryStack({ posts }: { posts: BlogPostDTO[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const removeCard = () => {
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 200);
  };

  const resetStack = () => setCurrentIndex(0);

  return (
    <div className="relative w-full h-[550px] flex items-center justify-center perspective-1000">
      
      {/* BACKGROUND TEXT */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h3 className="text-[12rem] font-black text-foreground/5 opacity-50 dark:opacity-20 rotate-[-10deg] tracking-tighter transition-colors">
          BLOG
        </h3>
      </div>

      <div className="relative w-full max-w-md h-[500px]">
        <AnimatePresence>
          {/* END STATE */}
          {currentIndex >= posts.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-card/50 backdrop-blur-md border border-dashed border-border rounded-3xl z-0"
            >
              <h3 className="text-2xl font-bold text-foreground mb-4">Tot llegit! 🤓</h3>
              <p className="text-muted-foreground mb-8">Has vist les últimes novetats. Vols veure l'arxiu complet?</p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={resetStack}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Repassar
                </Button>
                <Link href="/blog">
                  <Button>Veure Tot el Blog</Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* RENDER CARDS */}
          {[...posts].reverse().map((post, i) => {
            const originalIndex = posts.length - 1 - i;
            
            // Optimization: Only render necessary cards
            if (originalIndex < currentIndex) return null;
            if (originalIndex > currentIndex + 2) return null;

            const isFront = originalIndex === currentIndex;
            const stackIndex = originalIndex - currentIndex;
            
            return (
              <DiaryCard
                key={post.slug}
                post={post}
                isFront={isFront}
                index={stackIndex}
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

// INDIVIDUAL CARD COMPONENT
function DiaryCard({ 
  post, 
  isFront, 
  index, 
  onRemove,
  originalIndex,
  totalCards
}: { 
  post: BlogPostDTO; 
  isFront: boolean; 
  index: number; 
  onRemove: () => void;
  originalIndex: number;
  totalCards: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  // ✅ PURE RENDERING: Deterministic random rotation based on title length
  const randomRotate = isFront ? 0 : (post.title.length % 2 === 0 ? 3 : -3);
  
  // ✅ PURE RENDERING: Deterministic exit direction based on slug length
  const exitX = post.slug.length % 2 === 0 ? 500 : -500;

  // 1. NUDGE ANIMATION
  useEffect(() => {
    if (isFront) {
      const delay = index === 0 ? 1.5 : 0.5; 
      
      const controls = animate(x, [0, 40, 0], {
        delay: delay,
        duration: 0.8,
        ease: "easeInOut",
        times: [0, 0.5, 1]
      });

      return () => controls.stop();
    }
  }, [isFront, x, index]);

  // ✅ CORRECT TYPE: PanInfo
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
        onRemove();
    }
  };

  return (
    <motion.div
      style={{ 
        x: isFront ? x : 0, 
        rotate: isFront ? rotate : randomRotate, 
        opacity: isFront ? opacity : 1, // ✅ Used opacity here
        zIndex: 100 - index 
      }}
      // 2. ENTRANCE ANIMATION
      initial={{ 
        y: 200, 
        scale: 0.9, 
        opacity: 0 
      }}
      animate={{ 
        scale: isFront ? 1 : 0.95 - (index * 0.05),
        y: isFront ? 0 : -15 * index,
        opacity: index > 2 ? 0 : 1,
      }}
      transition={{ 
        delay: index === originalIndex ? (totalCards - originalIndex) * 0.15 : 0, 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
      
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      
      // Exit animation
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.3 } }}
      
      className={`
        absolute top-0 left-0 w-full h-full 
        rounded-3xl border border-border shadow-2xl 
        bg-card overflow-hidden flex flex-col origin-bottom
        ${isFront ? 'cursor-grab active:cursor-grabbing hover:shadow-primary/10' : 'pointer-events-none brightness-90'}
      `}
    >
      {/* TOP IMAGE */}
      <div className="h-1/2 relative bg-muted select-none pointer-events-none">
        {post.coverImage ? (
          <Image 
            src={post.coverImage} 
            alt={post.title} 
            fill 
            className="object-cover" 
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center">
            <span className="text-4xl font-black text-foreground/5 tracking-tighter">DIARY</span>
          </div>
        )}
        
        {/* Date Badge */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur text-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-border shadow-sm -rotate-2">
          {post.date ? new Date(post.date).toLocaleDateString() : 'AVUI'}
        </div>
      </div>

      {/* BOTTOM CONTENT */}
      <div className="h-1/2 p-6 flex flex-col justify-between bg-card relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/grid-pattern.svg')] bg-center" />

        <div className="relative z-10 space-y-3">
          <div className="flex justify-between items-start">
             <span className="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                {post.tags[0] || 'GENERAL'}
             </span>
             {isFront && <GripVertical className="text-muted-foreground/30 w-5 h-5 animate-pulse" />}
          </div>
          
          <h3 className="text-2xl font-bold text-foreground leading-tight line-clamp-3">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {post.description}
          </p>
        </div>

        <div className="relative z-10 pt-4 border-t border-border/50 flex justify-between items-center">
          <span className="text-xs text-muted-foreground/70 italic flex items-center gap-1">
            {isFront ? (
                <>Llisca <ArrowRight className="w-3 h-3 animate-bounce-x" /></>
            ) : "Següent..."}
          </span>
          
          <Link href={`/blog/${post.slug}`}>
            <Button size="sm" className="rounded-full px-5 h-9 group" disabled={!isFront} tabIndex={isFront ? 0 : -1}>
              Llegir <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}