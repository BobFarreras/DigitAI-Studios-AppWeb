import * as React from 'react';
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
} from '@react-email/components';

interface AuditReadyEmailProps {
  url: string;
  seoScore: number;
  perfScore: number;
  auditId: string;
}

// Estils base (Els correus necessiten estils en línia antics)
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
};

const box = {
  padding: '0 48px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const scoreBox = {
  textAlign: 'center' as const,
  padding: '20px',
  borderRadius: '8px',
  backgroundColor: '#f0fdf4', // Verd molt suau
  border: '1px solid #bbf7d0',
};

const scoreNumber = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#15803d', // Verd fort
  margin: '0',
};

const scoreLabel = {
  color: '#64748b',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  marginTop: '8px',
};

const button = {
  backgroundColor: '#7c3aed', // El teu lila de marca (primary)
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
  marginTop: '20px',
};

export const AuditReadyEmail = ({
  url,
  seoScore,
  perfScore,
  auditId,
}: AuditReadyEmailProps) => (
  <Html>
    <Head />
    <Preview>L'informe de {url} ja està llest - DigitAI Studios</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading as="h2" style={{ color: '#1e293b', textAlign: 'center' }}>
            DigitAI Studios
          </Heading>
          <Hr style={hr} />
          
          <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#334155' }}>
            Hola! 👋
          </Text>
          <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#334155' }}>
            La nostra Intel·ligència Artificial ha acabat d'analitzar la teva web <strong>{url}</strong>. Aquí tens un resum ràpid dels resultats:
          </Text>

          {/* GRID DE PUNTUACIONS */}
          <Section style={{ marginTop: '24px', marginBottom: '24px' }}>
            <Row>
              <Column>
                <div style={scoreBox}>
                    <p style={scoreNumber}>{seoScore}/100</p>
                    <p style={scoreLabel}>SEO</p>
                </div>
              </Column>
              <Column style={{ width: '20px' }} />
              <Column>
                <div style={{ ...scoreBox, backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                    <p style={{ ...scoreNumber, color: '#1d4ed8' }}>{perfScore}/100</p>
                    <p style={scoreLabel}>Rendiment</p>
                </div>
              </Column>
            </Row>
          </Section>

          <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#334155' }}>
            Hem detectat algunes àrees de millora crítiques que podrien estar afectant les teves vendes.
          </Text>

          <Button 
            style={button} 
            href={`https://la-teva-web.com/dashboard/audits/${auditId}`}
          >
            Veure Informe Complet
          </Button>
          
          <Hr style={hr} />
          <Text style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
            © 2024 DigitAI Studios. Automatització i IA per a empreses.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AuditReadyEmail;