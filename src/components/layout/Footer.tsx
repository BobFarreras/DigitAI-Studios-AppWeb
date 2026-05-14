'use client';

import { Link } from '@/routing';
import { Facebook, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

const SOCIALS = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/digitai-studios-105a0136a/", label: 'LinkedIn' },
  { icon: Instagram, href: "https://www.instagram.com/digitaistudios/", label: 'Instagram' },
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61576974390567", label: 'Facebook' },
];

export function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  const FOOTER_LINKS = [
    {
      title: t('services_title'),
      links: [
        { label: 'Automatitzacions i IA', href: '/#automatitzacions' },
        { label: 'Software a mida', href: '/#software-a-mida' },
        { label: 'Formació per equips', href: '/#formacio' },
      ],
    },
    {
      title: t('company_title'),
      links: [
        { label: t('about'), href: '/#inici' },
        { label: t('contact'), href: '/#contacte' },
      ],
    },
    {
      title: t('legal_title'),
      links: [
        { label: t('legal_notice'), href: '/legal/avis-legal' },
        { label: t('privacy'), href: '/legal/privacitat' },
        { label: t('cookies'), href: '/legal/cookies' },
      ],
    },
  ];

  return (
    <footer className="border-t border-[#d0d6e0] bg-white/44 py-8 text-[#08090a] backdrop-blur-[2px] transition-colors duration-300 dark:border-[#23252a] dark:bg-[#08090a]/44 dark:text-[#f7f8f8]">
      <div className="container mx-auto px-6 md:px-14">
        
        <div className="mb-7 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
          
          {/* COLUMNA 1: MARCA & INFO */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold tracking-tight text-[#08090a] dark:text-[#f7f8f8]">
                DigitAI <span className="gradient-text">Studios</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[#62666d] dark:text-[#8a8f98]">
              {t('description')}
            </p>
            
            <div className="flex gap-3">
              {SOCIALS.map((social, i) => (
                <a 
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#d0d6e0] bg-white/62 text-[#62666d] transition-colors hover:border-[#8b5cf6]/45 hover:text-[#8b5cf6] dark:border-[#323334] dark:bg-[#161718]/70 dark:text-[#8a8f98]"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <div className="space-y-2 pt-1">
                <div className="group flex items-center gap-3 text-sm text-[#62666d] dark:text-[#8a8f98]">
                    <Mail className="h-4 w-4 text-[#8b5cf6] transition-transform group-hover:scale-110" />
                    <a href="mailto:info@digitaistudios.com" className="transition-colors hover:text-[#08090a] dark:hover:text-[#f7f8f8]">
                        info@digitaistudios.com
                    </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#62666d] dark:text-[#8a8f98]">
                    <MapPin className="h-4 w-4 text-[#8b5cf6]" />
                    <span>Girona, Catalunya</span>
                </div>
            </div>
          </div>

          {/* COLUMNS DINÀMIQUES DE LINKS */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-sm font-bold text-[#08090a] dark:text-[#f7f8f8]">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="group flex w-fit items-center gap-2 text-sm text-[#62666d] transition-colors hover:text-[#8b5cf6] dark:text-[#8a8f98]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6]/0 transition-colors duration-300 group-hover:bg-[#8b5cf6]"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* COPYRIGHT */}
        <div className="flex items-center justify-center border-t border-[#d0d6e0] pt-5 text-sm text-[#62666d] dark:border-[#23252a] dark:text-[#8a8f98]">
          <p>© {currentYear} DigitAI Studios. {t('rights_reserved')}</p>
        </div>

      </div>
    </footer>
  );
}
