import LegalLayout from '@/components/layout/LegalLayout';
import { Building2, Mail, MapPin, Fingerprint, AlertTriangle, Gavel } from 'lucide-react';

export const metadata = {
  title: 'Avís Legal | DigitAI Studios',
  description: 'Informació legal i condicions d\'ús de DigitAI Studios.',
};

export default function AvisLegalPage() {
  return (
    <LegalLayout>
      <div className="border-b border-border pb-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Avís Legal</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          La transparència és la nostra prioritat. Aquí tens tota la informació legal sobre qui som i les regles d'aquest lloc web.
        </p>
        <p className="text-sm text-muted-foreground mt-4">Última actualització: {new Date().toLocaleDateString()}</p>
      </div>

      {/* SECCIÓ 1: DADES IDENTIFICATIVES (GRID VISUAL) */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            1. Dades Identificatives
        </h2>
        <p className="mb-6">
           En compliment de la Llei 34/2002 (LSSI-CE), informem que el titular del lloc web és:
        </p>
        
        <div className="grid sm:grid-cols-2 gap-4 not-prose">
           <InfoCard 
              icon={Building2} 
              label="Raó Social / Nom" 
              value="[EL TEU NOM EMPRESA]" 
           />
           <InfoCard 
              icon={Fingerprint} 
              label="NIF / CIF" 
              value="[EL TEU NIF]" 
           />
           <InfoCard 
              icon={MapPin} 
              label="Domicili Social" 
              value="[Carrer Exemple 123], Girona, Espanya" 
           />
           <InfoCard 
              icon={Mail} 
              label="Contacte" 
              value="info@digitaistudios.com" 
           />
        </div>
      </section>

      {/* SECCIÓ 2: OBJECTE */}
      <section className="mb-12">
        <h2>2. Condicions d'Ús</h2>
        <p>
          L'accés a aquest lloc web és lliure i gratuït. El simple accés no implica l'establiment de cap relació comercial entre <strong>DigitAI Studios</strong> i l'usuari.
        </p>
        <p>
          L'usuari es compromet a utilitzar el lloc web de conformitat amb la llei i el present Avís Legal, abstenint-se d'utilitzar-lo amb finalitats il·lícites o que puguin danyar els interessos de tercers.
        </p>
      </section>

      {/* SECCIÓ 3: PROPIETAT INTEL·LECTUAL */}
      <section className="mb-12">
        <h2>3. Propietat Intel·lectual i Industrial</h2>
        <div className="bg-muted/30 p-6 rounded-xl border-l-4 border-primary not-prose">
            <p className="text-sm text-muted-foreground">
                Tots els continguts (marques, logotips, textos, fotografies, icones, imatges, etc.), així com el disseny gràfic, codi font i software, són propietat exclusiva de <strong>DigitAI Studios</strong> o de tercers que han autoritzat el seu ús, estant protegits per la legislació nacional i internacional.
            </p>
        </div>
      </section>

      {/* SECCIÓ 4: RESPONSABILITAT */}
      <section className="mb-12">
         <h2 className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" /> Exempció de Responsabilitat
         </h2>
         <p>DigitAI Studios no es fa responsable de:</p>
         <ul>
            <li>Les possibles fallades de seguretat que es puguin produir ni dels possibles danys al sistema informàtic de l'usuari (virus, malware, etc.).</li>
            <li>La informació i continguts emmagatzemats en fòrums, xarxes socials o qualsevol altre mitjà que permeti a tercers publicar continguts de forma independent.</li>
            <li>La precisió exacta de les auditories automàtiques, que són orientatives i basades en l'API de Google Lighthouse.</li>
         </ul>
      </section>

      {/* SECCIÓ 5: LLEI */}
      <section>
         <h2 className="flex items-center gap-2">
            <Gavel className="w-6 h-6 text-primary" /> Llei Aplicable i Jurisdicció
         </h2>
         <p>
            Per a la resolució de totes les controvèrsies relacionades amb el present lloc web, serà d'aplicació la legislació espanyola, a la qual se sotmeten expressament les parts, sent competents per a la resolució de tots els conflictes els Jutjats i Tribunals de la ciutat de Girona.
         </p>
      </section>

    </LegalLayout>
  );
}

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