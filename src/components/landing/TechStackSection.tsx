'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const TECHNOLOGIES = [
  {
    name: "Next.js",
    color: "#000000", // En mode fosc es veurà blanc pel svg, però el text el volem visible
    darkModeColor: "#ffffff",
    icon: (
      <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
          <circle cx="90" cy="90" r="90" className="fill-black dark:fill-white" />
        </mask>
        <g mask="url(#mask0)">
          <circle cx="90" cy="90" r="87" className="stroke-black dark:stroke-white" strokeWidth="6" />
          <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" className="fill-black dark:fill-white" />
          <rect x="115" y="54" width="12" height="72" className="fill-black dark:fill-white" />
        </g>
      </svg>
    )
  },
  {
    name: "Supabase",
    color: "#3ECF8E",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M11.5286 0.179546C11.8331 -0.0812412 12.2919 -0.0533377 12.5643 0.24243L23.6622 12.2932C23.9326 12.5868 23.8877 13.048 23.5614 13.2813L13.3359 20.5925L15.9762 23.1152C16.2584 23.3849 16.0599 23.8673 15.6692 23.8673H11.5286C11.2241 24.1281 10.7653 24.1002 10.4929 23.8044L-0.605008 11.7537C-0.875401 11.46 -0.830532 10.9989 -0.504224 10.7655L9.72131 3.45435L7.08095 0.931661C6.79877 0.661952 6.99727 0.179546 7.38795 0.179546H11.5286Z" fill="#3ECF8E" />
      </svg>
    )
  },
  {
    name: "n8n",
    color: "#EA4B71",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M12.9 8.25h2.2v2.2h-2.2v-2.2zm-2.2 0h-2.2v2.2h2.2v-2.2zm-4.4 0H4.1v2.2h2.2v-2.2zm0 4.4H4.1v2.2h2.2v-2.2zm4.4 0h-2.2v2.2h2.2v-2.2zm2.2 0h2.2v2.2h-2.2v-2.2z" fill="#EA4B71" />
        <path fillRule="evenodd" clipRule="evenodd" d="M14 0H2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2zM2 2h12v12H2V2z" fill="#EA4B71" transform="translate(4 4)" />
      </svg>
    )
  },
  {
    name: "Airtable",
    color: "#F82B60",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M3 10v8l7 -3v-2.6z" fill="#F8D800" />
        <path d="M3 6l9 3l9 -3l-9 -3z" fill="#2D7FF9" />
        <path d="M14 12.3v8.7l7 -3v-8z" fill="#F82B60" />
      </svg>
    )
  },
  {
    name: "React Native",
    color: "#61DAFB",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5Z" fill="none" />
        <circle cx="12" cy="12" r="2" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1.5" fill="none">
           <ellipse cx="12" cy="12" rx="10" ry="4" />
           <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
           <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </g>
      </svg>
    )
  },
  {
    name: "OpenAI",
    color: "#10A37F",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1 .6765 8.1643l-.142-.0805-4.7784-2.7581a.7616.7616 0 0 0-.3927-.6765v-6.7369l.0048-.0048z" className="fill-black dark:fill-white" />
      </svg>
    )
  },
  {
    name: "Gemini",
    color: "#4E75F6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4E75F6" />
            <stop offset="100%" stopColor="#E96C7C" />
          </linearGradient>
        </defs>
        <path d="M12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22Z" fill="url(#gemini-gradient)" />
      </svg>
    )
  },
  {
    name: "TypeScript",
    color: "#3178C6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M2 0h20c1.1 0 2 0.9 2 2v20c0 1.1-0.9 2-2 2H2c-1.1 0-2-0.9-2-2V2c0-1.1 0.9-2 2-2zm13.5 17.9c1.3 0 2.2-0.7 2.6-1.7h-1.7c-0.2 0.4-0.5 0.6-0.9 0.6-0.7 0-1-0.6-1-1.7v-3.3h2.9v-1.4h-2.9v-2.1h-1.7v2.1h-1.4v1.4h1.4v3.6c0 1.6 0.9 2.5 2.7 2.5zm-6.7 0c1.5 0 2.6-0.8 2.8-2h-1.7c-0.2 0.5-0.6 0.8-1.1 0.8-0.8 0-1.2-0.6-1.2-1.6v-3.2h2.8v-1.4h-2.8v-2.1h-1.7v2.1h-1.6v1.4h1.6v3.5c0 1.7 1.1 2.5 2.9 2.5z" fill="#3178C6"/>
      </svg>
    )
  },
  {
    name: "GitHub",
    color: "#000000",
    darkModeColor: "#ffffff",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.65.72.26.98.19 1.12.08.14-.55.28-.94.55-1.15-2.2-.23-4.51-1.1-4.51-4.9 0-1.08.38-1.97 1.01-2.66-.1-.25-.44-1.26.1-2.62 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.36.2 2.37.1 2.62.63.69 1.01 1.58 1.01 2.66 0 3.8-2.32 4.67-4.53 4.89.29.25.55.74.55 1.49 0 1.08-.01 1.95-.01 2.21 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" className="fill-black dark:fill-white"/>
      </svg>
    )
  },
  {
    name: "Vercel",
    color: "#000000",
    darkModeColor: "#ffffff",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M12 1L24 22H0L12 1Z" className="fill-black dark:fill-white"/>
      </svg>
    )
  },
];

export function TechStackSection() {
  const t = useTranslations('TechStack');
  const controls = useAnimationControls();
  const [activeTech, setActiveTech] = useState<string | null>(null);

  // Dupliquem la llista per l'efecte infinit
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
      
      {/* 3. MÀSCARES DE DEGRADAT (FADE EDGES) */}
      <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-slate-50 dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-slate-50 dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

      <div className="container mx-auto px-4 mb-4">
        <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
          {t('subtitle')}
        </p>
      </div>
      
      {/* CORRECCIÓ CLAU: AFEGIT 'py-10' PER DONAR ESPAI VERTICAL AL TEXT ABSOLUT */}
      <div className="flex w-full overflow-hidden py-10">
        <motion.div 
          className="flex items-center gap-12 md:gap-24 px-12"
          animate={controls}
          initial={{ x: 0 }}
        >
          {infiniteTechnologies.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`} 
              // 'items-center' i 'relative' són clau aquí
              className="relative group flex flex-col items-center justify-center min-w-20"
              onMouseEnter={() => handleInteractionStart(tech.name)}
              onMouseLeave={handleInteractionEnd}
              onTouchStart={() => handleInteractionStart(tech.name)}
              onTouchEnd={handleInteractionEnd}
              onClick={() => handleInteractionStart(tech.name)}
            >
              <motion.div 
                className={cn(
                  "w-16 h-16 md:w-20 md:h-20 transition-all duration-300 z-40",
                  activeTech && activeTech !== tech.name ? "opacity-30 grayscale scale-90" : "opacity-70 grayscale",
                  activeTech === tech.name && "opacity-100 grayscale-0 scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                )}
              >
                {tech.icon}
              </motion.div>
              
              {/* Text: el 'top-full mt-4' el posa a sota, i com que el pare té 'py-10', no es talla */}
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: activeTech === tech.name ? 1 : 0, 
                  y: activeTech === tech.name ? 0 : -10 
                }}
                className="absolute top-full mt-4 text-xs font-bold whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg z-20 pointer-events-none"
                // Utilitzem un color de fallback si no hi és
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