/**
 * @file src/features/projects/actions/create-project-support.ts
 * @updated 2026-05-08
 * @summary Suport per la creacio de projectes (fallback, skeleton i seeding).
 * @scope Constants i helpers purs/infra auxiliars per createProjectAction.
 */

import { I18nSchema } from '@/types/i18n';

export const BASE_SKELETON = {
  Navbar: {
    links: { home: 'Inici', services: 'Serveis', blog: 'Blog', shop: 'Botiga', contact: 'Contacte', about: 'Nosaltres' },
    cta: 'Accés Clients',
    actions: { login: 'Entrar', cart: 'Cistella', menu: 'Menú' },
  },
  Footer: {
    description: 'Transformem idees en realitats digitals.',
    rights_reserved: 'Tots els drets reservats.',
    legal: { privacy: 'Privacitat', cookies: 'Cookies', terms: 'Termes' },
  },
  Booking: {
    title: 'Reserva la teva cita',
    subtitle: "Selecciona el servei i l'hora.",
    steps: {
      services: { title: 'Serveis', select: 'Seleccionar', duration: 'min' },
      datetime: { select_day_title: 'Tria dia', select_time_title: 'Tria hora', loading: 'Cercant...', back: 'Enrere', empty_state_day: 'Selecciona dia', empty_state_slots: 'No hi ha hores' },
      form: { title: 'Dades', subtitle: 'Completa la reserva', personal_info: 'Info', labels: { name: 'Nom', email: 'Email' }, submit: 'Confirmar', submitting: 'Enviant...' },
      success: { title: 'Reserva Confirmada!', message: 'Rebràs un email.', home_button: 'Inici' },
    },
    errors: { load_slots: 'Error horaris', required_field: 'Obligatori' },
  },
  Shop: { featuredTitle: 'Destacats', featuredSubtitle: 'Selecció exclusiva', addToCart: 'Afegir', outOfStock: 'Esgotat' },
  featured_products: { title: 'Selecció', subtitle: 'Els nostres millors productes', limit: 4 },
  Blog: { title: 'Blog', subtitle: 'Notícies i consells', readMore: 'Llegir més', empty: 'No hi ha articles' },
};

export function buildFallbackContent(businessName: string, description: string): I18nSchema {
  return {
    ...BASE_SKELETON,
    hero: { title: businessName, subtitle: description, cta: 'Contactar', image_prompt: '' },
    about: { badge: 'Info', title: 'Sobre nosaltres', description, image_prompt: '', stats: { label1: 'Exp', value1: '+1', label2: 'Clients', value2: '+10', label3: 'Servei', value3: '24/7' } },
    services: { badge: 'Serveis', title: 'Serveis', subtitle: 'El que oferim', items: [] },
    testimonials: { badge: 'Opinions', title: 'Opinions', subtitle: '', reviews: [] },
    featured_products: { title: 'Productes Destacats', subtitle: 'La nostra millor selecció', limit: 4 },
    map: { title: 'On Som', subtitle: 'Vine a visitar-nos.' },
    cta_banner: { heading: 'Impulsa el teu negoci', subheading: "Contacta'ns", buttonText: 'Contactar' },
    faq: { title: 'FAQ', subtitle: '', items: [] },
    contact: { title: 'Contacte', description: "Parlem-ne.", button: 'Enviar' },
  } as I18nSchema;
}
