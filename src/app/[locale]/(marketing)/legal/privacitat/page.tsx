import LegalLayout from '@/components/layout/LegalLayout';
import { ShieldCheck, Server, Eye, Lock } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacitat | DigitAI Studios',
};

export default function PrivacitatPage() {
  return (
    <LegalLayout>
      <div className="border-b border-border pb-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Política de Privacitat</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          La teva privacitat és sagrada. Aquí t'expliquem clarament quines dades recollim, per què, i com les protegim.
        </p>
      </div>

      <div className="space-y-12">
          
          {/* BLOC 1: RESPONSABLE */}
          <section>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                  <ShieldCheck className="text-green-500" /> 1. Qui és el responsable de les teves dades?
              </h2>
              <div className="bg-muted/30 p-6 rounded-xl border border-border">
                  <p className="m-0">
                      El responsable és <strong>DigitAI Studios</strong> (veure Avís Legal per a dades completes). Pots contactar amb el nostre Delegat de Protecció de Dades a: <a href="mailto:dpd@digitaistudios.com">dpd@digitaistudios.com</a>.
                  </p>
              </div>
          </section>

          {/* BLOC 2: QUINES DADES */}
          <section>
              <h2>2. Quines dades recollim?</h2>
              <p>Només recollim les dades estrictament necessàries per oferir els nostres serveis:</p>
              <div className="grid md:grid-cols-2 gap-6 not-prose my-6">
                  <div className="p-4 rounded-lg border border-border bg-card">
                      <h4 className="font-bold text-lg mb-2 flex items-center gap-2">🔍 Auditoria Web</h4>
                      <p className="text-sm text-muted-foreground">La URL de la web que vols analitzar i el teu correu electrònic per enviar-te l'informe.</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                      <h4 className="font-bold text-lg mb-2 flex items-center gap-2">👤 Compte d'Usuari</h4>
                      <p className="text-sm text-muted-foreground">El teu nom, correu electrònic i contrasenya encriptada quan et registres al Dashboard.</p>
                  </div>
              </div>
          </section>

          {/* BLOC 3: TERCERS */}
          <section>
              <h2 className="flex items-center gap-2"><Server className="text-blue-500" /> 3. Amb qui compartim les dades?</h2>
              <p>No venem les teves dades a ningú. Només les compartim amb proveïdors tecnològics necessaris per al funcionament del servei:</p>
              <ul className="not-prose space-y-2 mt-4">
                  <li className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span><strong>Supabase:</strong> Base de dades i autenticació (Allotjat a la UE/AWS).</span>
                  </li>
                  <li className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span><strong>Resend:</strong> Enviament d'emails transaccionals.</span>
                  </li>
                  <li className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span><strong>Google Cloud:</strong> API per processar les auditories web.</span>
                  </li>
              </ul>
          </section>

          {/* BLOC 4: DRETS */}
          <section>
              <h2 className="flex items-center gap-2"><Lock className="text-primary" /> 4. Els teus drets</h2>
              <p>Tens el control total sobre les teves dades. En qualsevol moment pots:</p>
              <ul>
                  <li>Accedir, rectificar o suprimir les teves dades.</li>
                  <li>Limitar el seu tractament.</li>
                  <li>Oposar-te a rebre comunicacions.</li>
                  <li>Sol·licitar la portabilitat de les dades.</li>
              </ul>
              <p>Per exercir-los, envia un email a <strong>info@digitaistudios.com</strong>.</p>
          </section>

      </div>
    </LegalLayout>
  );
}