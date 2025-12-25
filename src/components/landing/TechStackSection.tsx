'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
// 👇 AFEGEIX MakeIcon A L'IMPORT
import { 
  NextjsIcon, SupabaseIcon, N8nIcon, AirtableIcon, 
  ReactIcon, OpenAIIcon, GeminiIcon, TypeScriptIcon, 
  GitHubIcon, VercelIcon, MakeIcon 
} from '@/components/icons/TechIcons';

const TECHNOLOGIES = [
  { name: "Next.js", color: "#000000", Icon: NextjsIcon },
  { name: "Supabase", color: "#3ECF8E", Icon: SupabaseIcon },
  
  // ✅ n8n: El color #FF6D5A és el taronja/vermell oficial.
  // Quan el 'grayscale' desaparegui al hover, es veurà d'aquest color.
  { name: "n8n", color: "#FF6D5A", Icon: N8nIcon },

  // ✅ MAKE: Afegit nou
  { name: "Make", color: "#642191", Icon: MakeIcon },

  { name: "Airtable", color: "#F82B60", Icon: AirtableIcon },
  { name: "React Native", color: "#61DAFB", Icon: ReactIcon },
  { name: "OpenAI", color: "#10A37F", Icon: OpenAIIcon },
  { name: "Gemini", color: "#4E75F6", Icon: GeminiIcon },
  { name: "TypeScript", color: "#3178C6", Icon: TypeScriptIcon },
  { name: "GitHub", color: "#000000", Icon: GitHubIcon },
  { name: "Vercel", color: "#000000", Icon: VercelIcon },
];

export function TechStackSection() {
  const t = useTranslations('TechStack');
  const controls = useAnimationControls();
  const [activeTech, setActiveTech] = useState<string | null>(null);

  const infiniteTechnologies = [...TECHNOLOGIES, ...TECHNOLOGIES];

  useEffect(() => {
    controls.start({
      x: "-50%",
      transition: {
        duration: 30,
        ease: "linear",
        repeat: Infinity,
      }
    });
  }, [controls]);

  const handleInteractionStart = (name: string) => {
    setActiveTech(name);
    controls.stop();
  };

  const handleInteractionEnd = () => {
    setActiveTech(null);
    controls.start({
      x: "-50%",
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
      }
    });
  };

  return (
    <section className="py-6 border-y border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/1 overflow-hidden relative">

      <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-slate-50 dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-slate-50 dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

      <div className="container mx-auto px-4 mb-4">
        <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
          {t('subtitle')}
        </p>
      </div>

      <div className="flex w-full overflow-hidden py-10">
        <motion.div
          className="flex items-center gap-12 md:gap-24 px-12"
          animate={controls}
          initial={{ x: 0 }}
        >
          {infiniteTechnologies.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="relative group flex flex-col items-center justify-center min-w-20"
              onMouseEnter={() => handleInteractionStart(tech.name)}
              onMouseLeave={handleInteractionEnd}
              onTouchStart={() => handleInteractionStart(tech.name)}
              onTouchEnd={handleInteractionEnd}
              onClick={() => handleInteractionStart(tech.name)}
            >
              <motion.div
                className={cn(
                  "w-16 h-16 md:w-20 md:h-20 transition-all duration-300 z-40 flex items-center justify-center",
                  // ESTAT INACTIU: Opacitat al 70% i ESCALA DE GRISOS (B&N)
                  !activeTech && "opacity-70 grayscale",
                  
                  // ESTAT ACTIU (HOVER):
                  // 1. grayscale-0 -> Recupera el color original (Vermell per n8n, Lila per Make)
                  // 2. opacity-100 -> Totalment visible
                  // 3. scale-110 -> Una mica més gran
                  activeTech === tech.name && "opacity-100 grayscale-0 scale-110 drop-shadow-xl",
                  
                  // ESTAT QUAN UN ALTRE ESTÀ ACTIU: Més apagat
                  activeTech && activeTech !== tech.name && "opacity-30 grayscale scale-90"
                )}
              >
                <tech.Icon className="w-full h-full" />
              </motion.div>

              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: activeTech === tech.name ? 1 : 0,
                  y: activeTech === tech.name ? 0 : -10
                }}
                className="absolute top-full mt-4 text-xs font-bold whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg z-20 pointer-events-none"
                style={{ color: activeTech === tech.name ? tech.color : 'inherit' }}
              >
                {tech.name}
              </motion.span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}