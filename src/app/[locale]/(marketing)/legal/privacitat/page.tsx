import LegalLayout from '@/components/layout/LegalLayout';

export const metadata = {
  title: 'Política de Privacitat | DigitAI Studios',
  description: 'Com tractem les teves dades personals a DigitAI Studios.',
};

export default function PrivacitatPage() {
  return (
    <LegalLayout>
      <h1>Política de Privacitat</h1>
      <p className="lead">
        A DigitAI Studios ens prenem molt seriosament la teva privacitat. Aquesta política detalla com recollim, utilitzem i protegim les teves dades personals d'acord amb el Reglament General de Protecció de Dades (RGPD).
      </p>

      <h2>1. Responsable del Tractament</h2>
      <p>
        Les dades recollides són responsabilitat de <strong>DigitAI Studios</strong> (veure dades a l'Avís Legal).
      </p>

      <h2>2. Quines dades recollim?</h2>
      <p>Recollim les dades mínimes necessàries per oferir els nostres serveis:</p>
      <ul>
        <li><strong>Formulari d'Auditoria:</strong> URL de la web a analitzar i correu electrònic per enviar l'informe.</li>
        <li><strong>Registre d'Usuari:</strong> Correu electrònic i contrasenya (encriptada) per accedir al Dashboard.</li>
        <li><strong>Dades de Navegació:</strong> Adreça IP, tipus de dispositiu i navegador (mitjançant cookies tècniques).</li>
      </ul>

      <h2>3. Finalitat del Tractament</h2>
      <p>Utilitzem les teves dades per a les següents finalitats:</p>
      <ul>
        <li><strong>Realitzar l'auditoria web:</strong> Processar la URL amb l'API de Google PageSpeed Insights i enviar-te els resultats.</li>
        <li><strong>Gestió del compte:</strong> Permetre l'accés al teu panell privat i guardar l'històric d'auditories.</li>
        <li><strong>Comunicacions:</strong> Enviar-te l'informe sol·licitat i, si ens has donat consentiment, informació sobre els nostres serveis.</li>
      </ul>

      <h2>4. Serveis de Tercers (Subencarregats)</h2>
      <p>Per oferir els nostres serveis, compartim dades estrictament necessàries amb proveïdors tecnològics de confiança que compleixen amb el RGPD:</p>
      <ul>
        <li><strong>Supabase (Base de Dades):</strong> Allotjament segur de les dades d'usuari i auditories.</li>
        <li><strong>Google Cloud (PageSpeed API):</strong> Per realitzar l'anàlisi tècnica de les webs.</li>
        <li><strong>Resend (Email):</strong> Per a l'enviament automatitzat de correus electrònics transaccionals.</li>
        <li><strong>Vercel (Hosting):</strong> Proveïdor d'allotjament web i infraestructura.</li>
      </ul>

      <h2>5. Drets de l'Usuari</h2>
      <p>Tens dret a:</p>
      <ul>
        <li>Accedir a les teves dades.</li>
        <li>Rectificar dades inexactes.</li>
        <li>Sol·licitar la supressió (dret a l'oblit) quan ja no siguin necessàries.</li>
        <li>Oposar-te al tractament o limitar-lo.</li>
      </ul>
      <p>
        Pots exercir aquests drets enviant un correu a <a href="mailto:info@digitaistudios.com">info@digitaistudios.com</a>.
      </p>

      <h2>6. Seguretat</h2>
      <p>
        Apliquem mesures de seguretat tècniques i organitzatives (encriptació SSL, contrasenyes segures a la base de dades) per protegir les teves dades contra pèrdues o accessos no autoritzats.
      </p>
    </LegalLayout>
  );
}