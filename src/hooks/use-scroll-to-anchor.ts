'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useScrollToAnchor() {
  const pathname = usePathname();

  useEffect(() => {
    // Aquesta funció s'executa quan canvia el path o es carrega el component
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      
      if (element) {
        // Petit timeout per donar temps al navegador a renderitzar
        setTimeout(() => {
          const headerOffset = 85;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 100);
      }
    }
  }, [pathname]); // Dependència: s'executa quan canvia la ruta
}