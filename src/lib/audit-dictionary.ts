// src/lib/audit-dictionary.ts

export const AUDIT_TRANSLATIONS: Record<string, { title: string; description: string }> = {
  'is-on-https': {
    title: 'El lloc web no utilitza HTTPS segur',
    description: 'La teva web no és segura. Això espanta els clients i Google et penalitza greument.'
  },
  'meta-description': {
    title: 'Manca la Meta Descripció',
    description: 'Google no sap de què tracta la teva web. Necessites un resum atractiu per aparèixer als resultats de cerca.'
  },
  'document-title': {
    title: 'La pàgina no té títol',
    description: 'El títol és l\'element més important per al SEO. Sense ell, és invisible.'
  },
  'image-alt': {
    title: 'Imatges sense text alternatiu',
    description: 'Les imatges necessiten una descripció perquè Google les pugui "veure" i indexar.'
  },
  'viewport': {
    title: 'No està adaptada a mòbils',
    description: 'La web no té l\'etiqueta viewport correcta, fent que es vegi malament en dispositius mòbils.'
  },
  'server-response-time': {
    title: 'El servidor és massa lent',
    description: 'El temps de resposta inicial és alt. Considera canviar de hosting o optimitzar el backend.'
  },
  'render-blocking-resources': {
    title: 'Recursos que bloquegen la visualització',
    description: 'Hi ha CSS o JS que impedeixen que la web es mostri ràpidament. S\'han de diferir.'
  },
  'unminified-css': {
    title: 'CSS no optimitzat',
    description: 'Els fitxers d\'estil són massa grans. Minificar-los milloraria la velocitat.'
  },
  'unminified-javascript': {
    title: 'JavaScript no optimitzat',
    description: 'El codi script és massa pesat. Cal comprimir-lo per accelerar la càrrega.'
  },
  'uses-optimized-images': {
    title: 'Imatges massa pesades',
    description: 'Les imatges no estan optimitzades. Utilitza formats moderns com WebP per estalviar dades.'
  },
  'largest-contentful-paint': {
    title: 'Càrrega del contingut principal (LCP) lenta',
    description: 'L\'element més gran de la web triga massa a aparèixer. Això frustra els usuaris.'
  },
  'cumulative-layout-shift': {
    title: 'La web es "mou" mentre carrega (CLS)',
    description: 'Els elements canvien de lloc sobtadament, causant una mala experiència d\'usuari.'
  }
};

// Funció helper per traduir
export function translateIssue(id: string, defaultTitle: string, defaultDesc: string) {
  const translation = AUDIT_TRANSLATIONS[id];
  if (translation) {
    return { ...translation };
  }
  // Si no tenim traducció, intentem netejar el text de Google (treure enllaços markdown [Learn more]...)
  return {
    title: defaultTitle,
    description: defaultDesc.split('[')[0].replace(/\.$/, '') // Neteja bàsica
  };
}