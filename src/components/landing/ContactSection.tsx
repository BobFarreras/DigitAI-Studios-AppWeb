'use client';

import { ContactInfo } from '@/components/landing/contact/contact-info';
import { ContactForm } from '@/components/landing/contact/contact-form';

export function ContactSection() {
  return (
    <section id="contacte" className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
      
      {/* FONS DECORATIU */}
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/5 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-20" />

      <div className="container mx-auto px-6 md:px-10 lg:px-14 grid lg:grid-cols-2 gap-16 items-start relative z-10">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
}