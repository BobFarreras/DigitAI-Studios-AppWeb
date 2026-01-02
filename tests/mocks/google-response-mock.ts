export const mockGoogleSuccessResponse = {
  lighthouseResult: {
    categories: {
      performance: { score: 0.88 },
      seo: { score: 0.95 },
      accessibility: { score: 1 },
      'best-practices': { score: 0.80 }
    },
    audits: {
      'final-screenshot': {
        id: 'final-screenshot', // 👈 AFEGIT: Faltava aquest camp obligatori!
        details: { data: 'data:image/jpeg;base64,fake-screenshot-data' }
      },
      'first-contentful-paint': {
        id: 'first-contentful-paint',
        title: 'FCP',
        displayValue: '1.2 s',
        score: 0.8
      },
      'largest-contentful-paint': {
        id: 'largest-contentful-paint',
        score: 0.5,
        title: 'LCP',
        description: 'LCP description',
        displayValue: '3.5 s'
      }
    }
  }
};