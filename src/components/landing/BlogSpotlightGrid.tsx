'use client';

import { MouseEvent } from 'react';
// 👇 1. Importem MotionValue
import { motion, useMotionTemplate, useMotionValue, MotionValue } from 'framer-motion';
import { BlogPostDTO } from '@/types/models';
import { Link } from '@/routing';
import Image from 'next/image';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';

export function BlogSpotlightGrid({ posts }: { posts: BlogPostDTO[] }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div 
      className="group relative grid grid-cols-1 md:grid-cols-3 gap-6"
      onMouseMove={handleMouseMove}
    >
      {posts.map((post, i) => (
        <SpotlightCard key={post.slug} post={post} index={i} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
}

// 👇 2. Substituïm 'any' per 'MotionValue<number>'
function SpotlightCard({ 
  post, 
  index, 
  mouseX, 
  mouseY 
}: { 
  post: BlogPostDTO; 
  index: number; 
  mouseX: MotionValue<number>; 
  mouseY: MotionValue<number>; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative border border-white/10 bg-white/5 rounded-2xl overflow-hidden group/card hover:border-white/20 transition-colors"
    >
      {/* EFECTE SPOTLIGHT (CAPA DE LLUM) */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover/card:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(124, 58, 237, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* BLOC IMATGE */}
      <div className="aspect-video relative overflow-hidden">
        {post.coverImage ? (
            <Image 
                src={post.coverImage} 
                alt={post.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover/card:scale-110"
            />
        ) : (
            <div className="w-full h-full bg-linear-to-br from-slate-800 to-black flex items-center justify-center">
                <span className="text-white/20 font-bold text-4xl">DIGITAI</span>
            </div>
        )}
        
        {/* Overlay fosc */}
        <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/0 transition-colors" />
        
        {/* Tag flotant */}
        <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                {post.tags[0] || 'TECH'}
            </span>
        </div>
      </div>

      {/* BLOC CONTINGUT */}
      <div className="p-6 relative">
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
            <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.date ? new Date(post.date).toLocaleDateString() : 'Avui'}
            </div>
            <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>5 min</span>
            </div>
        </div>

        <Link href={`/blog/${post.slug}`} className="block">
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover/card:text-primary transition-colors">
                {post.title}
            </h3>
        </Link>

        <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">
            {post.description}
        </p>

        <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover/card:text-primary transition-colors"
        >
            Llegir Article <ArrowUpRight className="w-4 h-4 transition-transform group-hover/card:translate-x-1 group-hover/card:-translate-y-1" />
        </Link>
      </div>
    </motion.div>
  );
}