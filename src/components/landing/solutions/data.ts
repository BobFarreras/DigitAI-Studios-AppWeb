import {
    CreditCard, CalendarCheck, BarChart4,
    Wifi, LucideIcon
} from 'lucide-react';

export interface SolutionItem {
    id: string;
    icon: LucideIcon;
    color: string;
    // Guardem les claus dels tags, no el text final
    tagKeys: string[]; 
}

export const SOLUTIONS: SolutionItem[] = [
    {
        id: 'iot',
        icon: Wifi,
        color: 'from-cyan-500 to-blue-500',
        tagKeys: ['qr', 'domotics', 'sensors', 'remote']
    },
    {
        id: 'finance',
        icon: CreditCard,
        color: 'from-green-500 to-emerald-600',
        tagKeys: ['stripe', 'invoicing', 'ocr', 'signature']
    },
    {
        id: 'booking',
        icon: CalendarCheck,
        color: 'from-purple-500 to-pink-500',
        tagKeys: ['engine', 'whatsapp', 'wallet', 'crm']
    },
    {
        id: 'growth',
        icon: BarChart4,
        color: 'from-orange-500 to-red-500',
        tagKeys: ['social', 'bi', 'kpis', 'leads']
    }
];