// src/components/animations/Reveal.tsx
'use client';

import { motion, useInView, useAnimation, useReducedMotion } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface RevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  // Nova prop per desactivar desplaçament en mòbil si va molt carregat
  disableMobileMovement?: boolean; 
}

export const Reveal = ({ 
  children, 
  width = 'fit-content', 
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className = "",
  disableMobileMovement = false
}: RevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" }); // Marge relatiu % és millor per mòbil
  const mainControls = useAnimation();
  
  // Respectar preferències d'accessibilitat del sistema (si l'usuari té "Reduir moviment" activat)
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
    }
  }, [isInView, mainControls]);

  // CALCULEM EL MOVIMENT OPTIMITZAT
  // En lloc de moure 75px, en movem menys per evitar "salts" grans en pantalles petites
  const distance = 30; 

  const getHiddenVariant = () => {
    if (shouldReduceMotion) return { opacity: 0, x: 0, y: 0 }; // Només fade-in si demana poc moviment

    switch(direction) {
      // Use 'translate3d' implícitament amb framer-motion per activar GPU
      case 'up': return { opacity: 0, y: distance }; 
      case 'down': return { opacity: 0, y: -distance };
      case 'left': return { opacity: 0, x: distance, y: 0 };
      case 'right': return { opacity: 0, x: -distance, y: 0 };
      default: return { opacity: 0, x: 0, y: 0 };
    }
  };

  return (
    <div 
      ref={ref} 
      className={className}
      style={{ 
        position: 'relative', 
        width, 
        overflow: 'visible',
        // TRUC PER EVITAR PIXELAT EN TEXTOS (Safari/Chrome)
        WebkitFontSmoothing: 'antialiased',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)' 
      }} 
    >
      <motion.div
        variants={{
          hidden: getHiddenVariant(),
          visible: { 
            opacity: 1, 
            x: 0, 
            y: 0,
            transition: { 
                duration: duration, 
                delay: delay,
                // Use 'easeOut' que és més suau per a la GPU que 'spring'
                ease: [0.25, 0.1, 0.25, 1.0] 
            }
          },
        }}
        initial="hidden"
        animate={mainControls}
        // 'willChange' avisa al navegador que prepari la GPU
        style={{ willChange: 'opacity, transform' }} 
      >
        {children}
      </motion.div>
    </div>
  );
};

// Component extra per a llistes (Cards de posts, serveis, etc.)
// Fa que apareguin en cascada (Stagger)
export const StaggerContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15 // 150ms entre cada element
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
    >
      {children}
    </motion.div>
  );
};