'use client';

import { 
  Palette, Layout, Layers, ShoppingBag, Calendar, BookOpen, Lock, LayoutDashboard,
  Star, Wrench, Users, MessageCircle, Mail, HelpCircle,
  MapPin, BarChart3, Rocket, Tag, Store
} from 'lucide-react';
import { FormSection } from './FormSection';
import { motion } from 'framer-motion';

// 1. MÒDULS FUNCIONALS (Feature Flags)
// Hem afegit 'ecommerce' que faltava
const MODULES = [
  { id: 'booking', label: 'Reserves', icon: Calendar, desc: 'Sistema de cites' },
  { id: 'ecommerce', label: 'Botiga Online', icon: Store, desc: 'Venda de productes' }, // 👈 AFEGIT
  { id: 'blog', label: 'Blog', icon: BookOpen, desc: 'Notícies i SEO' },
  { id: 'inventory', label: 'Inventari', icon: Layers, desc: "Gestió d'estoc" },
  { id: 'accessControl', label: 'Zona Privada', icon: Lock, desc: 'Login clients' },
  { id: 'chatbot', label: 'Assistent IA', icon: MessageCircle, desc: 'Atenció 24/7' },
];

// 2. SECCIONS DE LA LANDING (Visuals)
// Sincronitzat amb ConfigLandingSection del Master Template
const SECTIONS_CONFIG = [
    { id: 'hero', label: 'Hero / Intro', icon: Layout },
    { id: 'stats', label: 'Estadístiques', icon: BarChart3 },      // 👈 AFEGIT
    { id: 'services', label: 'Serveis', icon: Wrench },
    { id: 'about', label: 'Nosaltres', icon: Users },              // 👈 AFEGIT (Ja el tenies, però renomenat)
    { id: 'featured_products', label: 'Top Vendes', icon: Tag },   // 👈 AFEGIT
    { id: 'cta_banner', label: 'Crida Acció', icon: Rocket },      // 👈 AFEGIT
    { id: 'testimonials', label: 'Ressenyes', icon: Star },
    { id: 'map', label: 'Ubicació', icon: MapPin },                // 👈 AFEGIT
    { id: 'faq', label: 'Preguntes', icon: HelpCircle },
    { id: 'contact', label: 'Contacte', icon: Mail },
];

export function DesignSection({ defaultColor }: { defaultColor?: string }) {
  return (
    <FormSection 
      title="Disseny i Funcionalitat" 
      description="Personalitza l'aspecte, les seccions visibles i els mòduls actius."
      icon={<Palette className="w-5 h-5" />}
      delay={0.3}
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Color */}
            <div>
                <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Color Primari</label>
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <input 
                        type="color" 
                        name="primaryColor" 
                        defaultValue={defaultColor || "#6366f1"} 
                        className="h-10 w-10 rounded-lg cursor-pointer border-0 bg-transparent" 
                    />
                    <div className="text-xs text-slate-500">
                        Defineix la personalitat de la marca.
                    </div>
                </div>
            </div>

            {/* Layout */}
            <div>
                <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Tipus de Web</label>
                <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer group">
                        <input type="radio" name="layoutVariant" value="modern" defaultChecked className="peer hidden" />
                        <div className="p-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 transition-all text-center group-hover:border-indigo-200">
                            <Layout className="w-6 h-6 mx-auto mb-2 text-slate-400 peer-checked:text-indigo-600" />
                            <span className="text-xs font-bold block">Corporativa</span>
                        </div>
                    </label>
                    <label className="cursor-pointer group">
                        <input type="radio" name="layoutVariant" value="shop" className="peer hidden" />
                        <div className="p-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 transition-all text-center group-hover:border-indigo-200">
                            <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-slate-400 peer-checked:text-indigo-600" />
                            <span className="text-xs font-bold block">E-Commerce</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>

        {/* --- SECCIONS DE LA LANDING (ARA COMPLETES) --- */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 mt-6">
            <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-indigo-500" /> 
                    Blocs de la Pàgina d'Inici
                </label>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-md">Drag & Drop (Coming Soon)</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {SECTIONS_CONFIG.map((sec) => (
                    <label key={sec.id} className="cursor-pointer group relative">
                        <input 
                            type="checkbox" 
                            name="landing_sections" 
                            value={sec.id}
                            // Hero, Services i Contact marcats per defecte
                            defaultChecked={['hero', 'services', 'contact', 'about'].includes(sec.id)} 
                            className="peer hidden" 
                        />
                        
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all h-24
                                border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800
                                text-slate-500 dark:text-slate-400 shadow-sm
                                
                                peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20
                                peer-checked:text-indigo-700 dark:peer-checked:text-indigo-300
                                peer-checked:shadow-md
                            `}
                        >
                            <sec.icon className="w-6 h-6 mb-2" />
                            <span className="text-[11px] font-bold capitalize text-center leading-tight">{sec.label}</span>
                        </motion.div>

                        {/* Indicador de selecció */}
                        <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-indigo-500 scale-0 peer-checked:scale-100 transition-transform shadow-sm" />
                    </label>
                ))}
            </div>
        </div>

        {/* Mòduls Funcionals */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 mt-6">
            <label className="block text-sm font-medium mb-4 text-slate-700 dark:text-slate-300">
                Mòduls de Gestió (Backend)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MODULES.map((mod) => (
                    <label key={mod.id} className="relative cursor-pointer group">
                        <input type="checkbox" name={`module_${mod.id}`} className="peer hidden" />
                        <motion.div 
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 transition-all h-full shadow-sm hover:shadow-md bg-white dark:bg-slate-800"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <mod.icon className="w-6 h-6 text-slate-400 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400" />
                                <div className="w-4 h-4 rounded border border-slate-300 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-colors flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">{mod.label}</span>
                            <span className="text-xs text-slate-500 leading-tight block mt-1">{mod.desc}</span>
                        </motion.div>
                    </label>
                ))}
            </div>
        </div>
    </FormSection>
  );
}