'use client';

import { Sparkles, Bot, Briefcase, ListFilter } from 'lucide-react';
import { FormSection } from './FormSection';

interface Props {
  defaultValue?: string;
}

// 🧠 TAXONOMIA EXPANDIDA PER A MILLOR CONTEXT IA
const SECTOR_GROUPS = {
  "Gastronomia i Hosteleria": [
    "Restaurant / Bistro",
    "Cafeteria / Fleca",
    "Bar de Copes / Oci Nocturn",
    "Hotel / Turisme Rural",
    "Càtering / Events"
  ],
  "Salut, Bellesa i Benestar": [
    "Gimnàs / Entrenador Personal",
    "Perruqueria / Barberia",
    "Centre d'Estètica / Spa",
    "Fisioteràpia / Osteopatia",
    "Psicologia / Coaching",
    "Ioga / Pilates",
    "Clínica Dental / Mèdica"
  ],
  "Serveis Professionals": [
    "Advocats / Legal",
    "Assessoria / Gestoria",
    "Consultoria de Negoci",
    "Agència de Màrqueting / Publicitat",
    "Desenvolupament Web / IT",
    "Arquitectura / Interiorisme",
    "Immobiliària"
  ],
  "Oficis i Reformes": [
    "Reformes Integrals",
    "Construcció",
    "Fusteria / Ebenisteria",
    "Electricista / Lampista",
    "Jardineria / Paisatgisme",
    "Neteja i Manteniment",
    "Taller Mecànic"
  ],
  "Comerç i Retail": [
    "Botiga de Roba / Moda",
    "Alimentació / Gourmet",
    "Botiga d'Animals / Veterinària",
    "Floristeria",
    "E-commerce (Només Online)"
  ],
  "Educació i Altres": [
    "Acadèmia / Classes Particulars",
    "Llar d'Infants / Escola",
    "Associació / ONG",
    "Artista / Creatiu",
    "Altres"
  ]
};

export function AISection({ defaultValue }: Props) {
  return (
    <FormSection 
      title="Intel·ligència Artificial" 
      description="Defineix el teu negoci perquè la IA redacti els continguts perfectes."
      icon={<Bot className="w-5 h-5" />}
      delay={0.2}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Input Descripció */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" /> Descripció del Negoci
            </label>
            <div className="relative">
                <textarea 
                    name="description" 
                    required 
                    defaultValue={defaultValue}
                    rows={5}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm resize-none leading-relaxed shadow-sm" 
                    placeholder="Ex: Som una fusteria artesanal a Olot especialitzada en mobles a mida de fusta massissa. Busquem transmetre tradició però amb dissenys moderns..." 
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-400 pointer-events-none">
                    Més detall = Millor web
                </div>
            </div>
        </div>

        {/* Selector de Sector Millorat */}
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-purple-500" /> Sector d'Activitat
                </label>
                <div className="relative">
                    <select 
                        name="sector" 
                        className="w-full p-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm appearance-none cursor-pointer shadow-sm truncate"
                    >
                        {Object.entries(SECTOR_GROUPS).map(([group, sectors]) => (
                            <optgroup key={group} label={group} className="font-bold text-slate-900 dark:text-white">
                                {sectors.map(sector => (
                                    <option key={sector} value={sector} className="font-normal text-slate-600">
                                        {sector}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                    
                    {/* Icona esquerra */}
                    <div className="absolute left-3 top-3.5 pointer-events-none text-slate-400">
                        <ListFilter className="w-4 h-4" />
                    </div>

                    {/* Fletxa custom dreta */}
                    <div className="absolute right-3 top-3.5 pointer-events-none opacity-50">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                </div>
            </div>

            {/* Targeta Informativa */}
            <div className="p-4 bg-linear-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl border border-purple-100 dark:border-purple-800/30">
                <h4 className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-1 flex items-center gap-1">
                    <Bot className="w-3 h-3" /> Màgia en acció
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                    Seleccionant el sector correcte, la IA sabrà quins serveis, preguntes freqüents i estil de text generar per a tu automàticament.
                </p>
            </div>
        </div>

      </div>
    </FormSection>
  );
}