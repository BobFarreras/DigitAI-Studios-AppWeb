// Dades falses per poder dissenyar la UI de l'informe
export const MOCK_REPORT = {
  scores: {
    seo: 85,
    performance: 62,
    accessibility: 90,
    best_practices: 75
  },
  issues: [
    { type: 'error', message: 'Falta l\'etiqueta H1 a la pàgina principal', impact: 'high' },
    { type: 'warning', message: 'Imatges sense atribut ALT detectades', impact: 'medium' },
    { type: 'success', message: 'Certificat SSL vàlid i actiu', impact: 'none' }
  ],
  technologies: ['Next.js', 'Tailwind CSS', 'Vercel']
};