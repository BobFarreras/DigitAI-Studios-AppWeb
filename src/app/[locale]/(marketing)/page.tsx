import { useTranslations } from 'next-intl';
import { AuditForm } from './components/audit-form';

export default function MarketingPage() {
  const t = useTranslations('HomePage');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-5xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground text-xl">
          Descobreix errors de SEO i performance amb IA.
        </p>
      </div>

      {/* Aquí injectem el formulari intel·ligent */}
      <AuditForm />
    </div>
  );
}