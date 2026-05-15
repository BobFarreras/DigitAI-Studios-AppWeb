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

  const servicesLinks = [
    { label: 'Automatitzacions i IA', href: '/#automatitzacions' },
    { label: 'Software a mida', href: '/#software-a-mida' },
    { label: 'Formació per equips', href: '/#formacio' },
  ];
  const companyLinks = [
    { label: t('about'), href: '/#inici' },
    { label: t('contact'), href: '/#contacte' },
  ];
  const legalLinks = [
    { label: t('legal_notice'), href: '/legal/avis-legal' },
    { label: t('privacy'), href: '/legal/privacitat' },
    { label: t('cookies'), href: '/legal/cookies' },
  ];

  return (
    <footer className="border-t border-[#d0d6e0] bg-white/44 py-6 text-[#08090a] backdrop-blur-[2px] transition-colors duration-300 dark:border-[#23252a] dark:bg-[#08090a]/44 dark:text-[#f7f8f8] md:py-8">
      <div className="container mx-auto px-4 md:px-14">
        <div className="mb-5 grid gap-5 md:mb-7 md:grid-cols-2 md:gap-8 lg:grid-cols-[1.7fr_1fr_1fr]">
          <div className="space-y-3 text-center md:space-y-4 md:text-left">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold tracking-tight text-[#08090a] dark:text-[#f7f8f8]">
                DigitAI <span className="gradient-text">Studios</span>
              </span>
            </Link>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#62666d] dark:text-[#8a8f98] md:mx-0">
              {t('description')}
            </p>
            <div className="flex flex-col items-center gap-2 md:items-start">
              <SocialLinks />
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                <ContactPill icon={<Mail className="h-3.5 w-3.5 text-[#8b5cf6]" />} href="mailto:info@digitaistudios.com" label="info@digitaistudios.com" />
                <ContactPill icon={<MapPin className="h-3.5 w-3.5 text-[#8b5cf6]" />} label="Girona" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:contents">
            <LinkColumn title={t('services_title')} links={servicesLinks} />
            <LinkColumn title={t('company_title')} links={companyLinks} />
          </div>

          <div className="space-y-2.5 text-center md:col-span-2 lg:col-span-3">
            <h4 className="text-sm font-bold text-[#08090a] dark:text-[#f7f8f8]">{t('legal_title')}</h4>
            <div className="grid grid-cols-3 gap-2">
              {legalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="px-1 text-center text-[11px] font-[590] leading-tight text-[#62666d] transition-colors hover:text-[#8b5cf6] dark:text-[#8a8f98] md:text-sm">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center border-t border-[#d0d6e0] pt-5 text-sm text-[#62666d] dark:border-[#23252a] dark:text-[#8a8f98]">
          <p className="text-center">© {currentYear} DigitAI Studios. {t('rights_reserved')}</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLinks() {
  return <div className="flex gap-2">{SOCIALS.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#d0d6e0] bg-white/62 text-[#62666d] transition-colors hover:border-[#8b5cf6]/45 hover:text-[#8b5cf6] dark:border-[#323334] dark:bg-[#161718]/70 dark:text-[#8a8f98]"><social.icon className="h-4 w-4" /></a>)}</div>;
}

function ContactPill({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) {
  const content = <><span>{icon}</span><span className="truncate">{label}</span></>;
  const className = 'inline-flex h-8 max-w-[180px] items-center gap-1.5 rounded-[6px] border border-[#d0d6e0] bg-white/62 px-2 text-[11px] font-[590] text-[#62666d] dark:border-[#323334] dark:bg-[#161718]/70 dark:text-[#8a8f98]';
  return href ? <a href={href} className={`${className} hover:text-[#08090a] dark:hover:text-[#f7f8f8]`}>{content}</a> : <span className={className}>{content}</span>;
}

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return <div className="space-y-2.5 text-center md:space-y-3 md:text-left"><h4 className="text-sm font-bold text-[#08090a] dark:text-[#f7f8f8]">{title}</h4><ul className="space-y-1.5 md:space-y-2">{links.map((link) => <li key={link.label}><Link href={link.href} className="group mx-auto flex w-fit items-center gap-2 text-[13px] text-[#62666d] transition-colors hover:text-[#8b5cf6] dark:text-[#8a8f98] md:mx-0 md:text-sm"><span className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6]/0 transition-colors duration-300 group-hover:bg-[#8b5cf6]" />{link.label}</Link></li>)}</ul></div>;
}
