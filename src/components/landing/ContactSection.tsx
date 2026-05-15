'use client';

import { ContactInfo } from '@/components/landing/contact/contact-info';
import { ContactForm } from '@/components/landing/contact/contact-form';

export function ContactSection() {
  return (
    <section id="contacte" className="linear-shell px-6 py-16 md:px-10 lg:px-14">
      <div className="linear-surface-1 mx-auto grid max-w-7xl gap-8 rounded-[6px] p-5 lg:grid-cols-2 lg:items-start lg:p-8">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
}
