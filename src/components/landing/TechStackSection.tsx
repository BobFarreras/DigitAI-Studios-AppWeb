'use client';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const TECHNOLOGIES = [
  {
    name: "Next.js",
    // Logo oficial (Blanc en fons fosc)
    icon: (
      <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
          <circle cx="90" cy="90" r="90" fill="black" />
        </mask>
        <g mask="url(#mask0)">
          <circle cx="90" cy="90" r="87" stroke="white" strokeWidth="6" />
          <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" />
          <rect x="115" y="54" width="12" height="72" fill="white" />
        </g>
      </svg>
    )
  },
  {
    name: "Supabase",
    // Verd oficial Supabase #3ECF8E
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M11.5286 0.179546C11.8331 -0.0812412 12.2919 -0.0533377 12.5643 0.24243L23.6622 12.2932C23.9326 12.5868 23.8877 13.048 23.5614 13.2813L13.3359 20.5925L15.9762 23.1152C16.2584 23.3849 16.0599 23.8673 15.6692 23.8673H11.5286C11.2241 24.1281 10.7653 24.1002 10.4929 23.8044L-0.605008 11.7537C-0.875401 11.46 -0.830532 10.9989 -0.504224 10.7655L9.72131 3.45435L7.08095 0.931661C6.79877 0.661952 6.99727 0.179546 7.38795 0.179546H11.5286Z" fill="#3ECF8E" />
      </svg>
    )
  },
  {
    name: "React Native",
    // Blau oficial React #61DAFB
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
    // Blanc oficial
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1 .6765 8.1643l-.142-.0805-4.7784-2.7581a.7616.7616 0 0 0-.3927-.6765v-6.7369l.0048-.0048z" fill="white" />
      </svg>
    )
  },
  {
    name: "TypeScript",
    // Blau oficial TS #3178C6
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M2 0h20c1.1 0 2 0.9 2 2v20c0 1.1-0.9 2-2 2H2c-1.1 0-2-0.9-2-2V2c0-1.1 0.9-2 2-2zm13.5 17.9c1.3 0 2.2-0.7 2.6-1.7h-1.7c-0.2 0.4-0.5 0.6-0.9 0.6-0.7 0-1-0.6-1-1.7v-3.3h2.9v-1.4h-2.9v-2.1h-1.7v2.1h-1.4v1.4h1.4v3.6c0 1.6 0.9 2.5 2.7 2.5zm-6.7 0c1.5 0 2.6-0.8 2.8-2h-1.7c-0.2 0.5-0.6 0.8-1.1 0.8-0.8 0-1.2-0.6-1.2-1.6v-3.2h2.8v-1.4h-2.8v-2.1h-1.7v2.1h-1.6v1.4h1.6v3.5c0 1.7 1.1 2.5 2.9 2.5z" fill="#3178C6"/>
      </svg>
    )
  },
  {
    name: "Vercel",
    // Triangle blanc oficial
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M12 1L24 22H0L12 1Z" fill="white"/>
      </svg>
    )
  },
];

export function TechStackSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if(carouselRef.current) {
      // Calculem el límit per fer scroll només si cal
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  return (
    <section className="py-12 border-y border-white/5 bg-white/1 overflow-hidden">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-10">
          Potenciat per l'stack tecnològic del futur
        </p>
        
        {/* WRAPPER PER CENTRAR: "flex justify-center" */}
        <div className="flex justify-center">
          
          {/* CONTENIDOR ARROSSEGABLE */}
          <motion.div 
            ref={carouselRef} 
            className="cursor-grab active:cursor-grabbing overflow-hidden max-w-full"
          >
            <motion.div 
              drag="x" 
              dragConstraints={{ right: 0, left: -width }}
              className="flex items-center gap-12 md:gap-20 w-max px-8 py-2" // ✨ 'py-10' evita que es tallin en fer hover scale
            >
              {TECHNOLOGIES.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex flex-col items-center gap-4 min-w-[80px]"
                >
                  {/* ICONA GRAN: w-20 h-20
                      FILTRE: opacity-70 i grayscale per defecte
                      HOVER: opacity-100, color original i glow
                  */}
                  <div className="w-20 h-20 transition-all duration-500 transform group-hover:scale-110 opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 drop-shadow-2xl">
                    {tech.icon}
                  </div>
                  
                  <span className="text-xs font-medium text-slate-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}