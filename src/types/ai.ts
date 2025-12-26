export interface BusinessSuggestion {
  title: string;      // Ex: "Passarel·la de Pagament"
  description: string; // Ex: "Cobra per avançat i evita impagats."
  icon: 'calendar' | 'shop' | 'user' | 'chart' | 'settings';
  impact: 'high' | 'medium';
}