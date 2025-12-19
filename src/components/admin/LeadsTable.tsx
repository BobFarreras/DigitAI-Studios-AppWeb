'use client';

import Link from 'next/link';
import { Eye, Calendar, User, Mail, Trash2 } from 'lucide-react'; // Afegim Trash2
import { Button } from '@/components/ui/button';
import { deleteAdminLead } from '@/actions/admin/leads'; // Importem l'acció nova
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

// ... tipus Lead (el mateix d'abans) ...
type Lead = {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string;
  service: string | null;
  message: string | null;
  source: string | null;
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [isPending, startTransition] = useTransition(); // Hook per gestionar estat de càrrega
  const router = useRouter();

  // Funció per gestionar l'esborrat
  const handleDelete = async (id: string) => {
    // Confirmació nativa (simple i efectiva)
    if (!confirm('Estàs segur que vols eliminar aquest missatge permanentment?')) return;

    startTransition(async () => {
      const result = await deleteAdminLead(id);
      if (!result.success) {
        alert('Error: ' + result.error);
      } else {
        // Opcional: Podem forçar un refresh extra per assegurar
        router.refresh(); 
      }
    });
  };

  if (leads.length === 0) {
    // ... (el mateix codi d'empty state) ...
    return (
      <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
        <p className="text-muted-foreground">Encara no hi ha missatges de contacte.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ca-ES', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      {/* 📱 VERSIÓ MÒBIL (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {leads.map((lead) => (
          <div 
            key={lead.id} 
            className={`relative bg-card border border-border rounded-xl p-5 shadow-sm transition-opacity ${isPending ? 'opacity-50' : ''}`}
          >
             {/* Botó Eliminar (Flotant a dalt a la dreta en mòbil) */}
             <button 
                onClick={(e) => {
                  e.preventDefault(); // Evitem obrir el link del detall
                  handleDelete(lead.id);
                }}
                disabled={isPending}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 transition-colors"
             >
                <Trash2 className="w-4 h-4" />
             </button>

            {/* Enllaç al detall (tota la card excepte el botó eliminar) */}
            <Link href={`./missatges/${lead.id}`} className="block">
                <div className="flex justify-between items-start mb-3 pr-8"> {/* pr-8 per deixar espai a la icona esborrar */}
                  <div className="flex items-center gap-2">
                     <User className="w-4 h-4 text-primary" />
                     <span className="font-semibold text-foreground">{lead.full_name || 'Anònim'}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <span className="text-xs bg-muted px-2 py-1 rounded-md mb-2 inline-block">
                    {formatDate(lead.created_at)}
                  </span>
                  {/* ... resta de camps iguals ... */}
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {lead.service || 'General'}
                    </span>
                  </div>
                </div>
            </Link>
          </div>
        ))}
      </div>

      {/* 💻 VERSIÓ ESCRIPTORI (Taula) */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border shadow-sm bg-card">
        <table className={`w-full text-sm text-left transition-opacity ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Contacte</th>
              <th className="px-6 py-4">Servei</th>
              <th className="px-6 py-4">Missatge</th>
              <th className="px-6 py-4 text-right">Accions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr key={lead.id} className="group hover:bg-muted/30 transition-colors">
                {/* ... columnes de dades (iguals que abans) ... */}
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(lead.created_at)}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  <Link href={`./missatges/${lead.id}`} className="hover:text-primary hover:underline">
                    {lead.full_name || 'Anònim'}
                  </Link>
                </td>
                <td className="px-6 py-4">{lead.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {lead.service || 'General'}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs text-muted-foreground truncate">{lead.message}</td>

                {/* ACCIONS */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Botó Veure */}
                    <Link href={`./missatges/${lead.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                        <Eye className="w-4 h-4" />
                        <span className="sr-only">Veure</span>
                      </Button>
                    </Link>

                    {/* Botó Eliminar (NOU) */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                      onClick={() => handleDelete(lead.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}