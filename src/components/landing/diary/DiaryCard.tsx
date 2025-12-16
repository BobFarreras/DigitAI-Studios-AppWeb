'use client';

import { useMotionValue, useTransform, motion, PanInfo, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Cpu, ExternalLink, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/routing';
import { BlogPostDTO } from '@/types/models';

interface DiaryCardProps {
  post: BlogPostDTO;
  index: number;
  isFront: boolean;
  totalCards: number;
  currentCardNumber: number;
  onRemove: () => void;
}

export function DiaryCard({ post, index, isFront, onRemove, currentCardNumber, totalCards }: DiaryCardProps) {
  const [exitX, setExitX] = useState<number | null>(null);

  const x = useMotionValue(0);
  // Reduïm la rotació en mòbil perquè sigui més estable
  const rotate = useTransform(x, [-200, 0, 200], [-5, 0, 5]); 
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0, 1, 1, 1, 0]);

  const deterministicExitX = post.title.length % 2 === 0 ? 500 : -500;
  const visualIndex = Math.min(index, 2);

  // Simplifiquem posicions inicials

  const initialY = visualIndex * 10; 

  useEffect(() => {
    // Només animem l'entrada si és la primera carta i estem en desktop (opcional)
    // O ho fem molt suau
    if (isFront) {
      const controls = animate(x, [0, 0], { duration: 0 }); // Evitem "salts" estranys al principi
      return () => controls.stop();
    }
  }, [isFront, x]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      setExitX(info.offset.x > 0 ? 500 : -500);
      onRemove();
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate: isFront ? rotate : 0,
        zIndex: 100 - index,
        opacity: isFront ? opacity : 1,
        // Forcem l'ús de la GPU per evitar pixelat
        transformPerspective: 1000,
        willChange: 'transform, opacity' 
      }}
      initial={{
        y: initialY + 10,
        opacity: 0,
        scale: 0.95
      }}
      animate={{ // Canviem whileInView per animate directe per evitar retards
        x: 0,
        y: visualIndex * 15, // Separació vertical
        scale: 1 - (visualIndex * 0.05),
        opacity: index > 2 ? 0 : 1,
        rotate: index % 2 === 0 ? 1 : -1,
      }}
      transition={{ type: "spring", damping: 25, stiffness: 120 }} // Més ràpid i menys "bouncy"
      exit={{
        x: exitX ?? deterministicExitX,
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.3 }
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: -1000, right: 1000 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing", scale: 1.01 }}
      className={`
        absolute top-0 w-full h-137.5 md:h-150 
        rounded-4xl 
        border border-border/50
        /* 🚀 OPTIMITZACIÓ CLAU: Fons sòlid a mòbil, Blur només a Desktop (md) */
        bg-card md:bg-card/90 md:backdrop-blur-xl 
        shadow-xl md:shadow-2xl 
        overflow-hidden flex flex-col origin-bottom
        ${isFront ? 'cursor-grab' : 'pointer-events-none brightness-95'}
        touch-none /* Important per evitar scroll de pàgina mentre arrossegues */
      `}
    >
      {/* 🖼️ IMATGE */}
      <div className="h-[55%] relative bg-muted select-none pointer-events-none overflow-hidden">
        
        {/* Badge Tech */}
        {(post.totalReactions || 0) > 0 && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 
                        bg-black/60 backdrop-blur-md 
                        px-3 py-1 rounded-full 
                        text-cyan-400 text-xs font-bold font-mono border border-white/10">
            <Cpu className="w-3.5 h-3.5" />
            <span className="h-3 w-px bg-white/20 mx-0.5"></span>
            {post.totalReactions}
          </div>
        )}

        <div className="absolute top-4 right-4 z-20 bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
          {post.date ? new Date(post.date).toLocaleDateString() : 'AVUI'}
        </div>

        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            // 🚀 OPTIMITZACIÓ: Carrega la imatge de la primera carta amb prioritat
            priority={isFront} 
            // 🚀 OPTIMITZACIÓ: Mides correctes per no descarregar 4K en mòbil
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover transition-transform duration-700 hover:scale-105"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-4xl font-black opacity-10">BLOG</span>
          </div>
        )}
        
        {/* Gradient simple en lloc de complex */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-90" />
      </div>

      {/* 📝 CONTINGUT */}
      <div className="h-[45%] p-5 md:p-8 flex flex-col justify-between relative">
        <div className="space-y-2 relative z-10">
          <div className="flex justify-between items-start">
             <span className="inline-flex px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase border border-primary/20">
               {post.tags[0] || 'GENERAL'}
             </span>
             {isFront && <GripVertical className="text-muted-foreground/30 w-5 h-5 animate-pulse" />}
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight line-clamp-2">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-xs md:text-sm line-clamp-3 leading-relaxed">
            {post.description}
          </p>
        </div>

        {/* BOTÓ */}
        <div className="pt-2 mt-auto">
          <Link href={`/blog/${post.slug}`} className="w-full block" onClick={(e) => e.stopPropagation()}>
            <Button
              className="w-full h-11 rounded-xl text-sm font-bold shadow-md"
              tabIndex={isFront ? 0 : -1}
              disabled={!isFront}
            >
              Llegir Article <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <div className="flex justify-between items-center mt-3 px-1 text-[10px] text-muted-foreground font-medium">
             <span>{currentCardNumber} / {totalCards}</span>
             <span>{isFront ? "Llisca >>" : "En cua..."}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}