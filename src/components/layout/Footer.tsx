'use client';

// 1️⃣ CANVI IMPORTANT: Fem servir el Link del router internacionalitzat
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
  const tNav = useTranslations('Navbar');
  const currentYear = new Date().getFullYear();

  // 2️⃣ CANVI DE LÒGICA: Afegim '/' davant dels '#'
  // Això li diu al navegador: "Ves a la pàgina d'inici (/) i després busca la secció (#)"
  const FOOTER_LINKS = [
    {
      title: t('services_title'),
      links: [
        { label: 'AppWebs & SaaS', href: '/#serveis' },       // Abans '#serveis'
        { label: 'Apps Mòbils', href: '/#serveis' },          // Abans '#serveis'
        { label: 'Automatització IA', href: '/#serveis' },    // Abans '#serveis'
        { label: 'Formació In-Company', href: '/#serveis' },  // Abans '#serveis'
      ],
    },
    {
      title: t('company_title'),
      links: [
        { label: t('about'), href: '/#hero' },                // Abans '#hero'
        { label: tNav('projects'), href: '/projectes' },      // Rutes absolutes (correcte)
        { label: tNav('blog'), href: '/blog' },
        { label: t('contact'), href: '/#contacte' },          // Abans '#contacte'
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
      <div className="container mx-auto px-6 md:px-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* COLUMNA 1: MARCA & INFO */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                DigitAI <span className="gradient-text">Studios</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm text-sm">
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
                  className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                    <Mail className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
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
              <h4 className="font-bold text-foreground text-base">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group w-fit"
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
          <div className="flex items-center gap-1">
             <span>{t('made_with_love')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}