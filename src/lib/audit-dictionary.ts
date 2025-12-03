// src/lib/audit-dictionary.ts

export const AUDIT_TRANSLATIONS: Record<
  string, // id de l'auditoria
  Record<
    string, // locale, p.ex. 'ca', 'es', 'en'
    { title: string; description: string }
  >
> = {
  // AQUESTA ÉS L'ESTRUCTURA CORRECTA AMB KEY DE LOCALE:
  'is-on-https': {
    ca: {
      title: 'El lloc web no utilitza HTTPS segur',
      description: 'La teva web no és segura. Això espanta els clients i Google et penalitza greument.'
    },
    es: {
      title: 'El sitio web no usa HTTPS seguro',
      description: 'Tu web no es segura. Esto asusta a los clientes y Google te penaliza.'
    },
    en: {
      title: 'Website is not using secure HTTPS',
      description: 'Your website is not secure. This scares users and Google may penalize you.'
    }
  },
  // ⚠️ CORRECCIÓ: ESTRUCTURA DE FALLBACK SIMPLE REQUEREIX CLAU 'ca' EXPLÍCITA
  'meta-description': {
    ca: { 
        title: 'Manca la Meta Descripció',
        description: 'Google no sap de què tracta la teva web. Necessites un resum atractiu per aparèixer als resultats de cerca.'
    }
  },
  'document-title': {
    ca: {
        title: 'La pàgina no té títol',
        description: 'El títol és l\'element més important per al SEO. Sense ell, és invisible.'
    }
  },
  'image-alt': {
    ca: {
        title: 'Imatges sense text alternatiu',
        description: 'Les imatges necessiten una descripció perquè Google les pugui "veure" i indexar.'
    }
  },
  'viewport': {
    ca: {
        title: 'No està adaptada a mòbils',
        description: 'La web no té l\'etiqueta viewport correcta, fent que es vegi malament en dispositius mòbils.'
    }
  },
  'server-response-time': {
    ca: {
        title: 'El servidor és massa lent',
        description: 'El temps de resposta inicial és alt. Considera canviar de hosting o optimitzar el backend.'
    }
  },
  'render-blocking-resources': {
    ca: {
        title: 'Recursos que bloquegen la visualització',
        description: 'Hi ha CSS o JS que impedeixen que la web es mostri ràpidament. S\'han de diferir.'
    }
  },
  'unminified-css': {
    ca: {
        title: 'CSS no optimitzat',
        description: 'Els fitxers d\'estil són massa grans. Minificar-los milloraria la velocitat.'
    }
  },
  'unminified-javascript': {
    ca: {
        title: 'JavaScript no optimitzat',
        description: 'El codi script és massa pesat. Cal comprimir-lo per accelerar la càrrega.'
    }
  },
  'uses-optimized-images': {
    ca: {
        title: 'Imatges massa pesades',
        description: 'Les imatges no estan optimitzades. Utilitza formats moderns com WebP per estalviar dades.'
    }
  },
  'largest-contentful-paint': {
    ca: {
        title: 'Càrrega del contingut principal (LCP) lenta',
        description: 'L\'element més gran de la web triga massa a aparèixer. Això frustra els usuaris.'
    }
  },
  'cumulative-layout-shift': {
    ca: {
        title: 'La web es "mou" mentre carrega (CLS)',
        description: 'Els elements canvien de lloc sobtadament, causant una mala experiència d\'usuari.'
    }
  }
};

export function translateIssue(
  id: string,
  defaultTitle: string,
  defaultDesc: string,
  locale: string = 'ca'
) {
  const translationForId = AUDIT_TRANSLATIONS[id];
  if (translationForId) {
    const translationForLocale = translationForId[locale];
    if (translationForLocale) return translationForLocale;
  }

  // Si no troba la traducció, torna al text per defecte (en anglès de Google)
  return {
    title: defaultTitle,
    description: (defaultDesc || '').split('[')[0].replace(/\.$/, '')
  };
}