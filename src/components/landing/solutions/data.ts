import { 
  QrCode, CreditCard, CalendarCheck, BarChart4, 
  Wifi, LucideIcon 
} from 'lucide-react';

export interface SolutionItem {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  tags: string[];
  color: string;
}

export const SOLUTIONS: SolutionItem[] = [
  {
    id: 'iot',
    title: 'Smart Spaces & IoT',
    icon: Wifi,
    description: 'Controla el món físic des del digital. Obre portes, encén llums i monitoritza espais amb tecnologia Shelly i QR.',
    tags: ['Accés QR', 'Domòtica', 'Sensors', 'Control Remot'],
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'finance',
    title: 'Finances Automatitzades',
    icon: CreditCard,
    description: 'Deixa que la IA gestioni els diners. Facturació, cobraments recurrents i control de despeses sense errors humans.',
    tags: ['Stripe', 'Auto-Facturació', 'Rebuts OCR', 'Signatura Digital'],
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'booking',
    title: 'Gestió de Clients & Cites',
    icon: CalendarCheck,
    description: 'La teva agenda s\'omple sola. Sistema de reserves intel·ligent, recordatoris automàtics i fidelització.',
    tags: ['Booking Engine', 'WhatsApp Bots', 'Digital Wallet', 'CRM'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'growth',
    title: 'Growth & Analítica',
    icon: BarChart4,
    description: 'Pren decisions basades en dades reals. Quadres de comandament en temps real i màrqueting automàtic.',
    tags: ['Social Auto-Post', 'Business Intelligence', 'KPIs en viu', 'Leads'],
    color: 'from-orange-500 to-red-500'
  }
];