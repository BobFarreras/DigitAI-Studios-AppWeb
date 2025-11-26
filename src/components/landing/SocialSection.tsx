'use client';

import { Facebook, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const SOCIALS = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/digitai-studios-105a0136a/',
    color: 'hover:text-[#0077b5]', // Color oficial LinkedIn
  },
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://www.instagram.com/digitaistudios/',
    color: 'hover:text-[#E1306C]', // Color oficial Instagram
  },
  {
    name: 'Facebook',
    icon: Facebook,
    href: 'https://www.facebook.com/profile.php?id=61576974390567',
    color: 'hover:text-[#1877F2]', // Color oficial Facebook
  },
];

export function SocialSection() {
  return (
    <section className="py-12 bg-muted/30 border-y border-border/40">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            Segueix la revolució
          </p>
          
          <div className="flex justify-center items-center gap-8 md:gap-12">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Segueix-nos a ${social.name}`}
                className={`transform transition-all duration-300 hover:scale-110 text-muted-foreground ${social.color}`}
              >
                <social.icon className="w-8 h-8 md:w-10 md:h-10" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}