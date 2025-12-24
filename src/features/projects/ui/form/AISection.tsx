'use client';

import { Sparkles, Bot, Briefcase } from 'lucide-react';
import { FormSection } from './FormSection';

interface Props {
  defaultValue?: string;
}

const SECTORS = [
  "Restaurant / Gastronomia",
  "Advocats / Consultoria",
  "Gimnàs / Salut",
  "Immobiliària",
  "E-commerce / Moda",
  "Reformes / Construcció",
  "Màrqueting / Disseny",
  "Altres"
];

export function AISection({ defaultValue }: Props) {
  return (
    <FormSection 
      title="Intel·ligència Artificial" 
      description="La nostra IA redactarà els textos inicials per tu."
      icon={<Bot className="w-5 h-5" />}
      delay={0.2}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Descripció */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" /> Descripció del Negoci
            </label>
            <textarea 
                name="description" 
                required 
                defaultValue={defaultValue}
                rows={4}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm resize-none" 
                placeholder="Ex: Som un restaurant de cuina tradicional catalana amb un toc modern. Fem servir productes de proximitat..." 
            />
        </div>

        {/* Sector (NOU) */}
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-purple-500" /> Sector d'Activitat
                </label>
                <div className="relative">
                    <select 
                        name="sector" 
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm appearance-none cursor-pointer"
                    >
                        {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {/* Fletxa custom */}
                    <div className="absolute right-3 top-3.5 pointer-events-none opacity-50">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                <p className="text-xs text-purple-700 dark:text-purple-300">
                    <strong>Què farà la IA?</strong><br/>
                    Generarà automàticament els títols, les descripcions dels serveis i la història "Sobre Nosaltres" basant-se en el teu sector.
                </p>
            </div>
        </div>

      </div>
    </FormSection>
  );
}