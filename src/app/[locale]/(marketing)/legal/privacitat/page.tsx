import LegalLayout from '@/components/layout/LegalLayout';
import { ShieldCheck, Server, Lock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: 'Política de Privacitat | DigitAI Studios',
};

export default async function PrivacitatPage() {
  const t = await getTranslations('Legal.privacitat');
  return (
    <LegalLayout>
      <div className="border-b border-border pb-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{t('title')}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      <div className="space-y-12">
          
          {/* BLOC 1: RESPONSABLE */}
          <section>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                  <ShieldCheck className="text-green-500" /> {t('section1_title')}
              </h2>
              <div className="bg-muted/30 p-6 rounded-xl border border-border">
                  <p className="m-0">
                      {t.rich('section1_text', {
                          strong: (chunks) => <strong>{chunks}</strong>,
                          link: (chunks) => <a href="mailto:dpd@digitaistudios.com">{chunks}</a>
                      })}
                  </p>
              </div>
          </section>

          {/* BLOC 2: QUINES DADES */}
          <section>
              <h2>{t('section2_title')}</h2>
              <p>{t('section2_desc')}</p>
              <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
                  <div className="p-4 rounded-lg border border-border bg-card">
                      <h4 className="font-bold text-lg mb-2 flex items-center gap-2">🔍 {t('data_audit_title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('data_audit_desc')}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                      <h4 className="font-bold text-lg mb-2 flex items-center gap-2">👤 {t('data_account_title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('data_account_desc')}</p>
                  </div>
              </div>
          </section>

          {/* BLOC 3: TERCERS */}
          <section>
              <h2 className="flex items-center gap-2"><Server className="text-blue-500" /> {t('section3_title')}</h2>
              <p>{t('section3_desc')}</p>
              <ul className="not-prose space-y-2 mt-4">
                  <li className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span><strong>{t('provider_supabase')}</strong></span>
                  </li>
                  <li className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span><strong>{t('provider_resend')}</strong></span>
                  </li>
                  <li className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span><strong>{t('provider_google')}</strong></span>
                  </li>
              </ul>
          </section>

          {/* BLOC 4: DRETS */}
          <section>
              <h2 className="flex items-center gap-2"><Lock className="text-primary" /> {t('section4_title')}</h2>
              <p>{t('section4_p1')}</p>
              <ul>
                  <li>{t('rights_list_1')}</li>
                  <li>{t('rights_list_2')}</li>
                  <li>{t('rights_list_3')}</li>
                  <li>{t('rights_list_4')}</li>
              </ul>
              <p>{t.rich('rights_contact', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
          </section>

      </div>
    </LegalLayout>
  );
}