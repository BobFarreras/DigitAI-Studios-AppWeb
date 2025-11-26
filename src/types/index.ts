import { Database } from './database.types';

// Exportem el tipus base per als clients de Supabase
export type { Database };

// Helpers per tenir tipus nets als components
// En lloc d'escriure la ruta llarga, faràs servir 'Audit' o 'Profile'
export type Audit = Database['public']['Tables']['web_audits']['Row'];
export type NewAudit = Database['public']['Tables']['web_audits']['Insert']; // Per formularis
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];

// Tipus per als Enums (molt útil per dropdowns)
export type UserRole = Database['public']['Enums']['user_role'];
export type AuditStatus = Database['public']['Enums']['audit_status'];
export type ContactLead = Database['public']['Tables']['contact_leads']['Row'];