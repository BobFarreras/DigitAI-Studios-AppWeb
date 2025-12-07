'use client';

import { useMotionValue, useTransform, motion, PanInfo, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Cpu, ExternalLink, GripVertical, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/routing';
import { BlogPostDTO } from '@/types/models';

interface DiaryCardProps {
  post: BlogPostDTO;
  index: number; // L'índex real (0, 1, 2, 3, 4...)
  isFront: boolean;
  totalCards: number;
  currentCardNumber: number;
  onRemove: () => void;
}

export function DiaryCard({ post, index, isFront, onRemove, currentCardNumber, totalCards }: DiaryCardProps) {
  const [exitX, setExitX] = useState<number | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0, 1, 1, 1, 0]);

  const deterministicExitX = post.title.length % 2 === 0 ? 500 : -500;

  // 🌟 FIX CLAU: Tot es basa en visualIndex, no en index real.
  // Així les cartes 3, 4, 5... s'apilen exactament igual que la 2.
  const visualIndex = Math.min(index, 2);

  // Ara calculem la posició inicial usant visualIndex per evitar que surtin disparades
  const initialX = (index % 2 === 0 ? -1 : 1) * (20 + visualIndex * 10); // Molt més subtil
  const initialY = visualIndex * 15; // Coincident amb la posició final
  const initialRotate = (index % 2 === 0 ? 2 : -2); // Rotació subtil, no 15 graus

  useEffect(() => {
    if (isFront) {
      const controls = animate(x, [0, 25, 0], {
        delay: 1,
        duration: 0.6,
        ease: "backOut",
      });
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
        opacity: isFront ? opacity : 1
      }}
      // CORRECCIÓ: Usem valors més controlats per l'entrada
      initial={{
        x: initialX,
        y: initialY + 20, // Un petit offset per fer l'efecte de pujada
        opacity: 0,
        scale: 0.9
      }}
      whileInView={{
        x: 0,
        y: visualIndex * 15,
        scale: 1 - (visualIndex * 0.05),
        // Només mostrem fins a la 3a carta (index 0, 1, 2). La resta opacitat 0.
        opacity: index > 2 ? 0 : 1,
        rotate: index % 2 === 0 ? 1 : -1,
        transition: { type: "spring", damping: 20, stiffness: 100, delay: Math.min(index, 3) * 0.1 }
      }}
      viewport={{ once: true }}
      exit={{
        x: exitX ?? deterministicExitX,
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.4 }
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: -1000, right: 1000 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing", scale: 1.02 }}

      className={`
        absolute top-0 w-full h-[550px] md:h-[600px] 
        rounded-[2rem] border border-white/20 dark:border-white/10
        bg-card/95 backdrop-blur-xl shadow-2xl 
        overflow-hidden flex flex-col origin-bottom
        ${isFront ? 'cursor-grab hover:shadow-primary/20 hover:border-primary/40' : 'pointer-events-none brightness-95'}
        transition-colors duration-300
      `}
    >
      {/* 🖼️ IMATGE */}
      <div className="h-[55%] relative bg-muted select-none pointer-events-none overflow-hidden">

        {/* 🔴 INSÍGNIA DE VALORACIONS (Això faltava al teu codi) */}
        {/* 👇 2. BADGE TECNOLÒGIC RENOVAT */}
        {(post.totalReactions || 0) > 0 && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 
                        bg-slate-900/80 backdrop-blur-md 
                        px-3 py-1 rounded-full 
                        text-cyan-400 text-xs font-bold font-mono
                        shadow-[0_0_15px_rgba(34,211,238,0.3)] 
                        border border-cyan-500/30 
                        animate-in fade-in zoom-in duration-300">

            {/* Icona Tech */}
            <Cpu className="w-3.5 h-3.5" />

            {/* Separador vertical petit */}
            <span className="h-3 w-px bg-cyan-500/30 mx-0.5"></span>

            {post.totalReactions}
          </div>
        )}

        {/* Data */}
        <div className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur text-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-border rounded-lg shadow-sm">
          {post.date ? new Date(post.date).toLocaleDateString() : 'AVUI'}
        </div>

        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-6xl font-black text-foreground/5 tracking-tighter">BLOG</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
      </div>

      {/* 📝 CONTINGUT */}
      <div className="h-[45%] p-6 md:p-8 flex flex-col justify-between relative">
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between items-start">
            <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest border border-primary/20">
              {post.tags[0] || 'GENERAL'}
            </span>
            {isFront && <GripVertical className="text-muted-foreground/30 w-5 h-5 animate-pulse" />}
          </div>

          <h3 className="text-xl md:text-3xl font-bold text-foreground leading-tight line-clamp-2" title={post.title}>
            {post.title}
          </h3>

          <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 leading-relaxed">
            {post.description}
          </p>
        </div>

        {/* BOTÓ */}
        <div className="pt-4 mt-auto">
          <Link href={`/blog/${post.slug}`} className="w-full block" onClick={(e) => e.stopPropagation()}>
            <Button
              className="w-full h-10 md:h-12 rounded-xl text-sm md:text-base font-bold shadow-lg bg-foreground text-background hover:bg-foreground/90 transition-all group relative overflow-hidden"
              tabIndex={isFront ? 0 : -1}
              disabled={!isFront}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="flex items-center gap-2">
                Llegir Article <ExternalLink className="w-4 h-4" />
              </span>
            </Button>
          </Link>

          <div className="flex justify-between items-center mt-3 px-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
              {currentCardNumber} / {totalCards}
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground italic">
              {isFront ? "Llisca per descartar" : "En cua..."}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}