// FILE: src/app/layout.tsx
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Aquest layout ha de ser "invisible". 
// Next.js es queixarà si li falta <html> en desenvolupament, 
// però com que el middleware redirigeix sempre a /[locale], mai es veurà.
export default function RootLayout({ children }: Props) {
  return children;
}