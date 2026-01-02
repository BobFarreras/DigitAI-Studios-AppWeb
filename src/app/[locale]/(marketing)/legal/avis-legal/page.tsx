import LegalLayout from '@/components/layout/LegalLayout';
import { Building2, Mail, MapPin, Fingerprint, AlertTriangle, Gavel } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server'; // Per la data

export const metadata = {
  title: 'Avís Legal | DigitAI Studios',
  description: 'Informació legal i condicions d\'ús de DigitAI Studios.',
};

export default async function AvisLegalPage() {
  const t = await getTranslations('Legal.avis_legal');
  const tCommon = await getTranslations('Legal.common');
  const locale = await getLocale();

  return (
    <LegalLayout>
      <div className="border-b border-border pb-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{t('title')}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {tCommon('transparency_desc')}
        </p>
        <p className="text-sm text-muted-foreground mt-4">{t('last_update_prefix')} {new Date().toLocaleDateString(locale)}</p>
      </div>

      {/* SECCIÓ 1: DADES IDENTIFICATIVES (GRID VISUAL) */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            {t('section1_title')}
        </h2>
        <p className="mb-6">
           {t('section1_desc')}
        </p>
        
        <div className="grid sm:grid-cols-2 gap-4 not-prose">
           <InfoCard 
              icon={Building2} 
              label={t('data_card_company_label')} 
              value="DigitAI Studios" 
           />
           <InfoCard 
              icon={Fingerprint} 
              label={t('data_card_nif_label')} 
              value="***********" 
           />
           <InfoCard 
              icon={MapPin} 
              label={t('data_card_address_label')} 
              value={"El Morro 54"} 
           />
           <InfoCard 
              icon={Mail} 
              label={t('data_card_contact_label')} 
              value="info@digitaistudios.com" 
           />
        </div>
      </section>

      {/* SECCIÓ 2: OBJECTE */}
      <section className="mb-12">
        <h2>{t('section2_title')}</h2>
        <p>
          {t.rich('section2_p1', {
            strong: (chunks) => <strong>{chunks}</strong>
          })}
        </p>
        <p>
          {t('section2_p2')}
        </p>
      </section>

      {/* SECCIÓ 3: PROPIETAT INTEL·LECTUAL */}
      <section className="mb-12">
        <h2>{t('section3_title')}</h2>
        <div className="bg-muted/30 p-6 rounded-xl border-l-4 border-primary not-prose">
            <p className="text-sm text-muted-foreground">
                {t.rich('section3_quote', {
                  strong: (chunks) => <strong>{chunks}</strong>
                })}
            </p>
        </div>
      </section>

      {/* SECCIÓ 4: RESPONSABILITAT */}
      <section className="mb-12">
         <h2 className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" /> {t('section4_title')}
         </h2>
         <p>{t('section4_p1')}</p>
         <ul>
            <li>{t('section4_list_1')}</li>
            <li>{t('section4_list_2')}</li>
            <li>{t('section4_list_3')}</li>
         </ul>
      </section>

      {/* SECCIÓ 5: LLEI */}
      <section>
         <h2 className="flex items-center gap-2">
            <Gavel className="w-6 h-6 text-primary" /> {t('section5_title')}
         </h2>
         <p>
            {t('section5_p1')}
         </p>
      </section>

    </LegalLayout>
  );
}

// Nota: El component InfoCard es manté igual, ja que les dades que rep (label, value) ja venen traduïdes d'aquí.

// Component petit per a les targetes de dades
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
    return (
        <div className="bg-background border border-border p-4 rounded-lg flex items-start gap-4 shadow-sm hover:border-primary/30 transition-colors">
            <div className="p-2 bg-primary/10 rounded-md shrink-0">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                <p className="text-sm font-bold text-foreground mt-1">{value}</p>
            </div>
        </div>
    )
}