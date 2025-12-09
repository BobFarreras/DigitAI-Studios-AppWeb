'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin} from 'lucide-react';
import { useTranslations } from 'next-intl';

const SOCIALS = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/digitai-studios-105a0136a/" , label: 'LinkedIn' },
  { icon: Instagram, href: "https://www.instagram.com/digitaistudios/", label: 'Instagram' },
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61576974390567" , label: 'Facebook' },
];

export function Footer() {
  const t = useTranslations('Footer'); // Namespace 'Footer'
  const tNav = useTranslations('Navbar'); // Reutilitzem traduccions de Navbar
  const currentYear = new Date().getFullYear();

  // Definim links DINS del component
  const FOOTER_LINKS = [
    {
      title: t('services_title'),
      links: [
        { label: 'AppWebs & SaaS', href: '#serveis' },
        { label: 'Apps Mòbils', href: '#serveis' },
        { label: 'Automatització IA', href: '#serveis' },
        { label: 'Formació In-Company', href: '#serveis' },
      ],
    },
    {
      title: t('company_title'),
      links: [
        { label: t('about'), href: '#hero' },
        { label: tNav('projects'), href: '/projectes' },
        { label: tNav('blog'), href: '/blog' },
        { label: t('contact'), href: '#contacte' },
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
    <footer className="bg-background border-t border-border pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* COLUMNA 1: MARCA & INFO */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                DigitAI <span className="gradient-text">Studios</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              {t('description')}
            </p>
            
            <div className="flex gap-4">
              {SOCIALS.map((social, i) => (
                <a 
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <div className="space-y-2 pt-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    <a href="mailto:info@digitaistudios.com" className="hover:text-foreground transition-colors">
                        info@digitaistudios.com
                    </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Girona, Catalunya</span>
                </div>
            </div>
          </div>

          {/* COLUMNS DINÀMIQUES DE LINKS */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="font-bold text-foreground">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all duration-300"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} DigitAI Studios. {t('rights_reserved')}</p>
          <div className="flex items-center gap-6">
             <span>{t('made_with_love')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}