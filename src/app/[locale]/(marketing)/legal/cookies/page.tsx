import LegalLayout from '@/components/layout/LegalLayout';

export const metadata = {
  title: 'Política de Cookies | DigitAI Studios',
  description: 'Informació sobre l\'ús de cookies a DigitAI Studios.',
};

export default function CookiesPage() {
  return (
    <LegalLayout>
      <h1>Política de Cookies</h1>
      <p className="lead">
        Aquesta web utilitza cookies pròpies i de tercers per millorar l'experiència d'usuari i analitzar el trànsit.
      </p>

      <h2>1. Què són les Cookies?</h2>
      <p>
        Una cookie és un petit fitxer de text que s'emmagatzema al teu navegador quan visites gairebé qualsevol pàgina web. La seva utilitat és que la web sigui capaç de recordar la teva visita quan tornis a navegar per aquesta pàgina.
      </p>

      <h2>2. Tipus de Cookies que utilitzem</h2>
      
      <h3>Cookies Tècniques (Necessàries)</h3>
      <p>
        Són aquelles imprescindibles per al funcionament de la web. Per exemple, per saber si has iniciat sessió al Dashboard o per recordar les teves preferències de consentiment.
      </p>
      <ul>
        <li><strong>Supabase Auth:</strong> Gestiona la sessió de l'usuari.</li>
        <li><strong>Next-Intl:</strong> Recorda l'idioma preferit.</li>
      </ul>

      <h3>Cookies Analítiques</h3>
      <p>
        Ens permeten quantificar el nombre d'usuaris i realitzar l'anàlisi estadística de la utilització que fan del servei ofert.
      </p>
      <ul>
        <li>Utilitzem un sistema d'analítica propi respectuós amb la privacitat (sense Google Analytics invasiu).</li>
      </ul>

      <h2>3. Com desactivar les Cookies?</h2>
      <p>
        Pots permetre, bloquejar o eliminar les cookies instal·lades al teu equip mitjançant la configuració de les opcions del navegador instal·lat al teu ordinador:
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Google Chrome</a></li>
        <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Safari</a></li>
        <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener">Firefox</a></li>
      </ul>
    </LegalLayout>
  );
}