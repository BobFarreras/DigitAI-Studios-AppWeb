/**
 * @file src/components/admin/leads-table/types.ts
 * @updated 2026-05-09
 * @summary Tipus compartits per la taula de leads admin.
 * @scope Contractes de dades i props entre variants mobile/desktop.
 */

export type Lead = {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string;
  service: string | null;
  message: string | null;
  source: string | null;
};

export interface LeadsViewProps {
  leads: Lead[];
  isPending: boolean;
  onRequestDelete: (id: string) => void;
}
