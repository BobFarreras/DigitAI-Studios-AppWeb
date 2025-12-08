'use client'; // 👈 Important: Això habilita els hooks

import { useScrollToAnchor } from '@/hooks/use-scroll-to-anchor';

export function ScrollManager() {
  // Activem el hook aquí, on sí que està permès
  useScrollToAnchor();
  
  return null; // No pinta res, només gestiona l'efecte
}