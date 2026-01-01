'use client';

import { ContactInfo } from '@/components/landing/contact/contact-info';
import { ContactForm } from '@/components/landing/contact/contact-form';

export function ContactSection() {
  return (
    <section id="contacte" className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
      
      {/* FIX FONS: 
         1. Canviat 'via-primary/2' per 'via-purple-500/1'. 
         L'1% és pràcticament invisible, només trenca el blanc pur sense pintar-ho de lila.
      */}
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-purple-500/1 to-transparent pointer-events-none" />
      
      {/* FIX SPOTLIGHT: 
         1. Reduït 'opacity-30' (Light) a 'opacity-10'. 
         2. Mantingut 'dark:opacity-5'.
         Ara en light mode és gairebé imperceptible.
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/5 blur-[120px] rounded-full pointer-events-none opacity-10 dark:opacity-5" />

      <div className="container mx-auto px-6 md:px-10 lg:px-14 grid lg:grid-cols-2 gap-16 items-start relative z-10">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
}