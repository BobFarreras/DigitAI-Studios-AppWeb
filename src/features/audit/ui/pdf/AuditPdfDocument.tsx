import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Definim els tipus de dades que necessitem
type Issue = {
  title: string;
  description: string;
};

type Props = {
  url: string;
  date: string;
  scores: { seo: number; perf: number; a11y: number; best: number };
  screenshot?: string;
  issues: Issue[];
};

// ESTILS DEL PDF (Semblant a CSS però en objecte JS)
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#0f111a', // Fons fosc
    color: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  subtitle: { fontSize: 10, color: '#94a3b8', marginTop: 4 },
  brand: { fontSize: 10, color: '#7c3aed', textTransform: 'uppercase' }, // Lila de marca
  
  // Grid de Puntuacions
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 8,
  },
  scoreItem: { alignItems: 'center', width: '25%' },
  scoreValue: { fontSize: 28, fontWeight: 'bold' },
  scoreLabel: { fontSize: 10, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase' },

  // Secció Mòbil
  sectionTitle: { fontSize: 16, marginBottom: 10, color: '#ffffff', marginTop: 10 },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#1e293b',
    borderRadius: 8,
  },
  screenshot: { width: 200, height: 400, borderRadius: 4, objectFit: 'contain' },

  // Llista d'Errors
  issueCard: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#ffffff', // Targetes blanques per contrast de lectura
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444', // Vermell error
  },
  issueTitle: { fontSize: 12, color: '#0f111a', fontWeight: 'bold' },
  issueDesc: { fontSize: 10, color: '#475569', marginTop: 2 },
  
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#64748b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  }
});

// Helper per colors
const getScoreColor = (score: number) => {
  if (score >= 90) return '#4ade80'; // Verd
  if (score >= 50) return '#facc15'; // Groc
  return '#f87171'; // Vermell
};

export const AuditPDFDocument = ({ url, date, scores, screenshot, issues }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* 1. HEADER */}
      <View style={styles.header}>
        <View>
            <Text style={styles.brand}>DigitAI Studios Audit</Text>
            <Text style={styles.title}>Informe d'Auditoria</Text>
            <Text style={styles.subtitle}>{url}</Text>
        </View>
        <View>
            <Text style={styles.subtitle}>{date}</Text>
        </View>
      </View>

      {/* 2. PUNTUACIONS */}
      <View style={styles.scoresContainer}>
        <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: getScoreColor(scores.seo) }]}>{scores.seo}</Text>
            <Text style={styles.scoreLabel}>SEO</Text>
        </View>
        <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: getScoreColor(scores.perf) }]}>{scores.perf}</Text>
            <Text style={styles.scoreLabel}>Rendiment</Text>
        </View>
        <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: getScoreColor(scores.a11y) }]}>{scores.a11y}</Text>
            <Text style={styles.scoreLabel}>Accessibilitat</Text>
        </View>
        <View style={styles.scoreItem}>
            <Text style={[styles.scoreValue, { color: getScoreColor(scores.best) }]}>{scores.best}</Text>
            <Text style={styles.scoreLabel}>Best Practices</Text>
        </View>
      </View>

      {/* 3. CAPTURA DE PANTALLA (Si n'hi ha) */}
      {screenshot && (
        <View style={styles.imageContainer}>
            <Text style={[styles.subtitle, { marginBottom: 10 }]}>Vista Prèvia Dispositiu Mòbil</Text>
            <Image src={screenshot} style={styles.screenshot} />
        </View>
      )}

      {/* 4. LLISTA D'ERRORS */}
      <Text style={styles.sectionTitle}>Accions Recomanades ({issues.length})</Text>
      {issues.slice(0, 8).map((issue, index) => ( // Limitem a 8 per no fer 50 pàgines de cop
        <View key={index} style={styles.issueCard}>
            <Text style={styles.issueTitle}>{issue.title}</Text>
            <Text style={styles.issueDesc}>{issue.description}</Text>
        </View>
      ))}

      {/* 5. FOOTER */}
      <Text style={styles.footer}>
        Generat automàticament per DigitAI Studios. Aquest informe és privat i confidencial.
        Visita'ns a https://digitaistudios.com per a més serveis.
      </Text>

    </Page>
  </Document>
);