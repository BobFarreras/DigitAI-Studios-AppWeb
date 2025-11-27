import LegalLayout from '@/components/layout/LegalLayout';
import { Cookie, Settings, BarChart3, XCircle } from 'lucide-react';

export const metadata = {
  title: 'Política de Cookies | DigitAI Studios',
  description: 'Informació sobre l\'ús de cookies a DigitAI Studios.',
};

export default function CookiesPage() {
  return (
    <LegalLayout>
      <div className="border-b border-border pb-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Política de Cookies</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Utilitzem galetes (cookies) per assegurar que la web funcioni correctament i per entendre com podem millorar-la. Aquí tens tots els detalls.
        </p>
      </div>

      <div className="space-y-12">

        {/* BLOC 1: DEFINICIÓ */}
        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
            <Cookie className="text-orange-500" /> 1. Què són les Cookies?
          </h2>
          <div className="bg-muted/30 p-6 rounded-xl border border-border">
            <p className="m-0">
              Una cookie és un petit fitxer de text que s'emmagatzema al teu navegador quan visites gairebé qualsevol pàgina web. La seva utilitat és que la web sigui capaç de recordar la teva visita quan tornis a navegar per aquesta pàgina, o mantenir la teva sessió oberta.
            </p>
          </div>
        </section>

        {/* BLOC 2: TIPUS DE COOKIES (GRID) */}
        <section>
          <h2>2. Quines cookies utilitzem?</h2>
          <p>Aquesta web utilitza els següents tipus de cookies:</p>
          
          <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
             {/* Cookies Tècniques */}
             <div className="p-5 rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                   <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Settings className="w-5 h-5" />
                   </div>
                   <h4 className="font-bold text-lg">Necessàries (Tècniques)</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                   Són imprescindibles per al funcionament de la web. Sense elles, no podries iniciar sessió ni navegar correctament.
                </p>
                <ul className="space-y-2 text-sm">
                   <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      <strong>Supabase Auth:</strong> Gestiona la sessió segura.
                   </li>
                   <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      <strong>Next-Intl:</strong> Recorda l'idioma preferit.
                   </li>
                </ul>
             </div>

             {/* Cookies Analítiques */}
             <div className="p-5 rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                   <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                      <BarChart3 className="w-5 h-5" />
                   </div>
                   <h4 className="font-bold text-lg">Analítiques</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                   Ens permeten quantificar el nombre d'usuaris i analitzar la utilització que fan del servei per millorar-lo.
                </p>
                <ul className="space-y-2 text-sm">
                   <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      <strong>Analytics Propi:</strong> Estadístiques anònimes respectuoses amb la privacitat (sense rastreig invasiu de Google).
                   </li>
                </ul>
             </div>
          </div>
        </section>

        {/* BLOC 3: DESACTIVACIÓ */}
        <section>
           <h2 className="flex items-center gap-2">
              <XCircle className="text-red-500" /> 3. Com desactivar-les?
           </h2>
           <p>
             Pots permetre, bloquejar o eliminar les cookies instal·lades al teu equip mitjançant la configuració de les opcions del navegador:
           </p>
           
           <div className="flex flex-wrap gap-4 not-prose mt-4">
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:border-primary transition-colors">
                 Google Chrome
              </a>
              <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener" className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:border-primary transition-colors">
                 Safari
              </a>
              <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener" className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:border-primary transition-colors">
                 Firefox
              </a>
              <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c23d-37fd-6b7ac978ce4a" target="_blank" rel="noopener" className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:border-primary transition-colors">
                 Microsoft Edge
              </a>
           </div>
        </section>

      </div>
    </LegalLayout>
  );
}