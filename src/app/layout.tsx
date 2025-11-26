// src/app/layout.tsx
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Aquest component només existeix perquè Next.js no es queixi.
// El middleware s'encarrega d'enviar l'usuari a /[locale]/..., 
// per tant, l'usuari mai veurà aquest HTML "buit".
export default function RootLayout({ children }: Props) {
  return children;
}