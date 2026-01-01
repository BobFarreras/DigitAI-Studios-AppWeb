'use client';

import Link from 'next/link';
import { Eye, Calendar, User, Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteAdminLead } from '@/actions/admin/leads';
import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';

// Imports de Shadcn Alert Dialog
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
 
} from "@/components/ui/alert-dialog";

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
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  // Estat per controlar quin ID estem a punt d'esborrar
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;

    // Tanquem el diàleg immediatament per millor UX
    const id = leadToDelete;
    setLeadToDelete(null); 

    startTransition(async () => {
      console.log(`🗑️ [CLIENT] Confirmada eliminació ID: ${id}`);
      const res = await deleteAdminLead(id);

      if (res.success) {
        console.log("✅ [CLIENT] Eliminat amb èxit. Refrescant...");
        router.refresh(); 
      } else {
        console.error("❌ [CLIENT] Error:", res.error);
        alert(`Error: ${res.error}`);
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ca-ES', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
        <p className="text-muted-foreground">Encara no hi ha missatges de contacte.</p>
      </div>
    );
  }

  return (
    <>
      {/* --- DIÀLEG DE CONFIRMACIÓ (Global per la taula) --- */}
      <AlertDialog open={!!leadToDelete} onOpenChange={(open) => !open && setLeadToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estàs segur?</AlertDialogTitle>
            <AlertDialogDescription>
              Aquesta acció eliminarà permanentment el missatge de la base de dades.
              No es pot desfer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel·lar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isPending}
            >
              {isPending ? 'Eliminant...' : 'Sí, eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 📱 VERSIÓ MÒBIL (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {leads.map((lead) => (
          <div key={lead.id} className={`relative bg-card border border-border rounded-xl p-5 shadow-sm transition-opacity ${isPending ? 'opacity-50' : ''}`}>
            {/* Botó Eliminar Mòbil */}
            <button 
              onClick={() => setLeadToDelete(lead.id)}
              disabled={isPending}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <Link href={`./missatges/${lead.id}`} className="block">
              <div className="flex justify-between items-start mb-3 pr-8">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">{lead.full_name || 'Anònim'}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                 {/* ... detalls ... */}
                 <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{lead.email}</span>
                 </div>
                 <p className="line-clamp-2 text-xs italic">{lead.message}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* 💻 VERSIÓ ESCRIPTORI (Taula) */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border shadow-sm bg-card">
        <table className={`w-full text-sm text-left ${isPending ? 'opacity-70' : ''}`}>
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Servei</th>
              <th className="px-6 py-4">Missatge</th>
              <th className="px-6 py-4 text-right">Accions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr key={lead.id} className="group hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(lead.created_at)}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{lead.full_name || 'Anònim'}</td>
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
                    <Link href={`./missatges/${lead.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    
                    {/* Botó que obre el diàleg */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:bg-red-100 hover:text-red-600"
                      onClick={() => setLeadToDelete(lead.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="w-4 h-4" />
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