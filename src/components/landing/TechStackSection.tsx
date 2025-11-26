'use client';
import { motion } from 'framer-motion';

const TECHS = ["Next.js 16", "Supabase", "TypeScript", "OpenAI", "React Native", "Vercel"];

export function TechStackSection() {
  return (
    <section className="py-10 border-y border-white/5 bg-white/[0.01]">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
          Potenciat per l'stack tecnològic del futur
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {TECHS.map((tech, i) => (
            <motion.span 
              key={tech}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-lg md:text-xl font-bold text-slate-300 hover:text-primary cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}