import LegalLayout from '@/components/layout/LegalLayout';

export const metadata = {
  title: 'Avís Legal | DigitAI Studios',
  description: 'Informació legal i condicions d\'ús de DigitAI Studios.',
};

export default function AvisLegalPage() {
  return (
    <LegalLayout>
      <h1>Avís Legal i Condicions d'Ús</h1>
      <p className="lead">
        En compliment de la Llei 34/2002, d'11 de juliol, de Serveis de la Societat de la Informació i de Comerç Electrònic (LSSI-CE), informem als usuaris de les dades del propietari d'aquest lloc web.
      </p>

      <h2>1. Dades Identificatives</h2>
      <ul>
        <li><strong>Nom Comercial:</strong> DigitAI Studios</li>
        <li><strong>Titular:</strong> [EL TEU NOM O NOM EMPRESA]</li>
        <li><strong>NIF/CIF:</strong> [EL TEU NIF]</li>
        <li><strong>Domicili Social:</strong> [LA TEVA ADREÇA], Girona, Espanya</li>
        <li><strong>Email de contacte:</strong> info@digitaistudios.com</li>
      </ul>

      <h2>2. Objecte i Àmbit d'Aplicació</h2>
      <p>
        Aquestes condicions regulen l'ús del lloc web <strong>digitaistudios.com</strong>, que ofereix serveis de desenvolupament de programari, auditoria web i consultoria tecnològica. L'accés a la web implica l'acceptació sense reserves d'aquestes condicions.
      </p>

      <h2>3. Propietat Intel·lectual</h2>
      <p>
        Tots els continguts (textos, imatges, codi font, logotips, dissenys) són propietat intel·lectual de DigitAI Studios o de tercers que n'han autoritzat l'ús. Està prohibida la seva reproducció, distribució o modificació sense autorització prèvia.
      </p>

      <h2>4. Responsabilitat</h2>
      <p>
        DigitAI Studios no es fa responsable de:
      </p>
      <ul>
        <li>Interrupcions del servei per manteniment tècnic o causes de força major.</li>
        <li>L'ús incorrecte que els usuaris puguin fer de la web o dels seus continguts.</li>
        <li>Els enllaços externs que puguin aparèixer a la web, ja que no tenim control sobre ells.</li>
      </ul>
      <p>
        L'eina d'auditoria web es proporciona "tal qual" i els resultats són orientatius. No garantim que la implementació de les recomanacions millori automàticament el posicionament o rendiment en tots els casos.
      </p>

      <h2>5. Llei Aplicable i Jurisdicció</h2>
      <p>
        Aquestes condicions es regeixen per la llei espanyola. Per a qualsevol controvèrsia que pugui sorgir, les parts se sotmeten als jutjats i tribunals de la ciutat de Girona, renunciant a qualsevol altre fur que els pogués correspondre.
      </p>
    </LegalLayout>
  );
}