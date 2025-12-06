'use client';

import { useMotionValue, useTransform, motion, PanInfo, animate } from 'framer-motion';
import { useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/routing';
import { BlogPostDTO } from '@/types/models';

interface DiaryCardProps {
  post: BlogPostDTO;
  index: number;
  isFront: boolean;
  totalCards: number;
  originalIndex: number;
  onRemove: () => void;
}

export function DiaryCard({ post, index, isFront, totalCards, originalIndex, onRemove }: DiaryCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  // Lògica Determinista (NO Math.random)
  const isEvenTitle = post.title.length % 2 === 0;
  const isEvenSlug = post.slug.length % 2 === 0;
  
  // Rotació inicial (les de darrere estan girades, la de davant recta)
  const randomRotate = isFront ? 0 : (isEvenTitle ? 4 : -4);
  
  // Direcció de sortida (dreta o esquerra segons el slug)
  const exitX = isEvenSlug ? 500 : -500;

  // Animació "Pista" (Nudge)
  useEffect(() => {
    if (isFront) {
      const delay = index === 0 ? 1 : 0.2;
      const controls = animate(x, [0, 50, 0], {
        delay: delay,
        duration: 0.6,
        ease: "easeInOut",
      });
      return () => controls.stop();
    }
  }, [isFront, x, index]);

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
        opacity: isFront ? opacity : 1, // Si no és la de davant, opacitat fixa
        zIndex: 100 - index,
      }}
      initial={{ y: 200, scale: 0.9, opacity: 0 }}
      whileInView={{
        scale: isFront ? 1 : 1 - (index * 0.04), // Escalat progressiu
        y: isFront ? 0 : -35 * index, // Apilament vertical visible
        opacity: index > 2 ? 0 : 1, // Amaguem a partir de la 3ra
        transition: {
          delay: index === 0 ? 0.1 : (totalCards - originalIndex) * 0.1,
          type: "spring",
          stiffness: 200,
          damping: 20
        }
      }}
      viewport={{ once: true }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.3 } }}
      
      className={`
        absolute top-0 left-0 w-full h-full 
        rounded-2xl border border-border shadow-2xl 
        bg-card overflow-hidden flex flex-col origin-bottom
        ${isFront ? 'cursor-grab active:cursor-grabbing hover:shadow-primary/20' : 'pointer-events-none brightness-95'}
      `}
    >
      {/* 🖼️ PART SUPERIOR: IMATGE */}
      <div className="h-[55%] relative bg-muted select-none pointer-events-none">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
            <span className="text-5xl font-black text-foreground/10 tracking-tighter">POST</span>
          </div>
        )}
        
        {/* DATA STICKER */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md text-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-border shadow-sm rounded-md">
          {post.date ? new Date(post.date).toLocaleDateString() : 'AVUI'}
        </div>
      </div>

      {/* 📝 PART INFERIOR: TEXT (Fons sòlid, no transparent) */}
      <div className="h-[45%] p-6 flex flex-col justify-between bg-card relative">
        <div className="relative z-10 space-y-3">
          <div className="flex justify-between items-start">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              {post.tags[0] || 'BLOG'}
            </span>
            {isFront && <GripVertical className="text-muted-foreground/40 w-5 h-5 animate-pulse" />}
          </div>

          <h3 className="text-2xl font-bold text-foreground leading-tight line-clamp-2" title={post.title}>
            {post.title}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {post.description}
          </p>
        </div>

        <div className="relative z-10 pt-4 flex justify-between items-center mt-auto">
          <span className="text-xs text-muted-foreground italic font-medium">
            {isFront ? "Arrossega →" : `${index} de ${totalCards}`}
          </span>

          <Link href={`/blog/${post.slug}`}>
            <Button size="sm" className="rounded-full px-6 shadow-md" disabled={!isFront} tabIndex={isFront ? 0 : -1}>
              Llegir <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}