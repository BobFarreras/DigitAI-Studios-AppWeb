import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Row,
  Column,
  Img,
  Link,
} from '@react-email/components';

interface Suggestion {
  title: string;
  description: string;
  icon: string;
  impact: string;
}

interface AuditReadyEmailProps {
  businessName: string;
  url: string;
  seoScore: number;
  perfScore: number;
  auditId: string;
  baseUrl?: string;
  suggestions?: Suggestion[];
}

const getColor = (score: number) => {
  if (score >= 90) return '#22c55e';
  if (score >= 50) return '#eab308';
  return '#ef4444';
};

const getGrade = (score: number) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 60) return 'C';
  return 'D';
};

export const AuditReadyEmail = ({
  businessName = "El teu negoci",
  url = "exemple.com",
  seoScore = 45,
  perfScore = 82,
  baseUrl = "https://digitai-studios.com", 
  suggestions = [],
}: AuditReadyEmailProps) => {
  
  const seoColor = getColor(seoScore);
  const perfColor = getColor(perfScore);

  // 🔧 FIX LOGO: Si estem en localhost, els correus no poden veure la imatge.
  // Posa aquí la URL real del teu logo hostatjat a internet per fer proves
  const logoUrl = baseUrl?.includes('localhost') 
    ? 'https://via.placeholder.com/150x50?text=DigitAI+Logo' // Placeholder per local
    : `${baseUrl}/images/digitai-logo.png`; // URL Producció

  return (
    <Html>
      <Head />
      <Preview>Resultats de l'anàlisi digital de {businessName}</Preview>
      
      <Body style={main}>
        <Container style={container}>
          
          {/* HEADER */}
          <Section style={header}>
            <Img
              src={logoUrl} 
              width="150"
              alt="DigitAI Studios"
              style={logo}
            />
          </Section>

          {/* HERO */}
          <Section style={heroSection}>
            <Heading style={heroTitle}>
              Anàlisi finalitzat
            </Heading>
            <Text style={heroText}>
              Hem analitzat la presència digital de <strong>{url}</strong>.
              Aquí tens el resum del rendiment tècnic actual.
            </Text>
          </Section>

          {/* GRÀFIQUES */}
          <Section style={statsContainer}>
            <Row>
              <Column style={statCard}>
                <Text style={statLabel}>SEO</Text>
                <Heading style={{ ...statNumber, color: seoColor }}>
                  {seoScore} <span style={gradeLabel}>{getGrade(seoScore)}</span>
                </Heading>
                <div style={progressBarBg}>
                  <div style={{ ...progressBarFill, width: `${seoScore}%`, backgroundColor: seoColor }} />
                </div>
              </Column>
              <Column style={{ width: '20px' }} />
              <Column style={statCard}>
                <Text style={statLabel}>VELOCITAT</Text>
                <Heading style={{ ...statNumber, color: perfColor }}>
                  {perfScore} <span style={gradeLabel}>{getGrade(perfScore)}</span>
                </Heading>
                <div style={progressBarBg}>
                  <div style={{ ...progressBarFill, width: `${perfScore}%`, backgroundColor: perfColor }} />
                </div>
              </Column>
            </Row>
          </Section>

          {/* 👇 SECCIÓ MILLORADA VISUALMENT */}
          {suggestions.length > 0 && (
            <Section style={opportunityBox}>
              <Heading as="h3" style={opportunityTitle}>
                🚀 Pla de Creixement
              </Heading>
              <Text style={paragraph}>
                Des de <strong>DigitAI Studios</strong> hem detectat punts clau que podrien augmentar la facturació del teu negoci:
              </Text>
              
              {/* ITERACIÓ DE SUGGERIMENTS */}
              {suggestions.map((item, index) => (
                <Section key={index} style={suggestionRow}>
                  <Row>
                    {/* COLUMNA ICONA (Fixa) */}
                    <Column width="40" style={{ verticalAlign: 'top', paddingTop: '4px' }}>
                      <div style={iconContainer}>
                        {/* Mapeig d'icones més robust */}
                        {item.icon?.includes('calendar') ? '📅' : 
                         item.icon?.includes('shop') ? '🛒' : 
                         item.icon?.includes('user') ? '👥' : 
                         item.icon?.includes('chart') ? '📈' : '💡'}
                      </div>
                    </Column>
                    {/* COLUMNA TEXT (Fluida) */}
                    <Column style={{ paddingLeft: '10px' }}>
                      <Text style={suggestionTitle}>{item.title}</Text>
                      <Text style={suggestionDesc}>{item.description}</Text>
                    </Column>
                  </Row>
                </Section>
              ))}
              
              <Text style={{ ...paragraph, fontSize: '14px', marginTop: '15px', fontStyle: 'italic', color: '#166534', textAlign: 'center' }}>
                Podem implementar aquestes millores en menys de 48h.
              </Text>
            </Section>
          )}

          {/* CTA FINAL */}
          <Section style={contentBox}>
            <Text style={paragraph}>
              Tens l'informe tècnic complet disponible al teu panell. Si vols que t'ajudem a escalar el negoci, parlem.
            </Text>
            <Button
              style={button}
              href={`${baseUrl}/#contact`}
            >
              SOL·LICITAR IMPLEMENTACIÓ →
            </Button>
             <Text style={{ textAlign: 'center', marginTop: '15px' }}>
                <Link href={`${baseUrl}/dashboard`} style={{ fontSize: '14px', color: '#64748b', textDecoration: 'underline' }}>
                  O entrar al teu panell
                </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* FOOTER */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2026 DigitAI Studios. Transformant negocis.
            </Text>
            <Text style={footerText}>
              <Link href={`${baseUrl}/contact`} style={link}>Contacte</Link> • 
              <Link href={`${baseUrl}/privacy`} style={link}> Baixa</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

export default AuditReadyEmail;

// --- ESTILS CSS (AJUSTATS PER EVITAR TALLS) ---

const main = { backgroundColor: '#f1f5f9', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' };
const container = { margin: '0 auto', padding: '0', backgroundColor: '#ffffff', maxWidth: '600px', width: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' };
const header = { padding: '30px 40px', backgroundColor: '#1e293b', textAlign: 'center' as const };
const logo = { margin: '0 auto', display: 'block' }; // display block ajuda a centrar
const heroSection = { padding: '40px 40px 20px', textAlign: 'center' as const };
const heroTitle = { fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 10px' };
const heroText = { fontSize: '16px', color: '#64748b', lineHeight: '24px', margin: '0' };
const statsContainer = { padding: '0 40px 20px' };
const statCard = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', textAlign: 'center' as const, width: '48%' };
const statLabel = { fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: '#94a3b8', margin: '0 0 5px' };
const statNumber = { fontSize: '36px', fontWeight: '800', margin: '0 0 15px', lineHeight: '1' };
const gradeLabel = { fontSize: '16px', color: '#94a3b8', fontWeight: 'normal', verticalAlign: 'top' };
const progressBarBg = { backgroundColor: '#e2e8f0', borderRadius: '99px', height: '8px', width: '100%', overflow: 'hidden', marginBottom: '10px' };
const progressBarFill = { height: '100%', borderRadius: '99px' };
const contentBox = { padding: '0 40px 40px' };
const paragraph = { fontSize: '16px', lineHeight: '26px', color: '#334155', marginBottom: '16px' };
const button = { backgroundColor: '#7c3aed', borderRadius: '8px', color: '#ffffff', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'block', width: '100%', padding: '16px', boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3)' };
const hr = { borderColor: '#e2e8f0', margin: '0' };
const footer = { backgroundColor: '#f8fafc', padding: '24px 40px', textAlign: 'center' as const };
const footerText = { fontSize: '12px', color: '#94a3b8', margin: '5px 0' };
const link = { color: '#7c3aed', textDecoration: 'none' };

// ESTILS OPORTUNITATS (REVISATS)
const opportunityBox = {
  backgroundColor: '#f0fdf4', 
  border: '1px solid #bbf7d0',
  borderRadius: '8px',
  padding: '24px',
  margin: '0 40px 30px', 
  width: 'auto', // Deixa que s'adapti
};

const opportunityTitle = {
  fontSize: '18px',
  color: '#166534', 
  margin: '0 0 16px', // Més espai a sota
};

const suggestionRow = {
  marginBottom: '12px',
  backgroundColor: '#ffffff',
  padding: '12px', // Padding intern per evitar que el text toqui les vores
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  width: '100%', // Força l'amplada completa
};

const iconContainer = {
  fontSize: '24px',
  textAlign: 'center' as const,
};

const suggestionTitle = {
  fontWeight: 'bold',
  color: '#1e293b',
  fontSize: '15px',
  margin: '0 0 4px',
  display: 'block',
};

const suggestionDesc = {
  fontSize: '14px',
  color: '#64748b',
  margin: '0',
  lineHeight: '20px',
  display: 'block',
};
