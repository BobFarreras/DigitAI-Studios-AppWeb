import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  const t = useTranslations('HomePage');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <Button variant="outline">Prova Botó</Button>
    </div>
  );
}