'use client';

import { 
  Palette, Layout, Layers, ShoppingBag, Calendar, BookOpen, Lock, LayoutDashboard,
  Megaphone, Star, Wrench, Users, MessageCircle, Mail, HelpCircle
} from 'lucide-react';
import { FormSection } from './FormSection';
import { motion } from 'framer-motion';

const MODULES = [
  { id: 'booking', label: 'Reserves', icon: Calendar, desc: 'Sistema de cites' },
  { id: 'blog', label: 'Blog', icon: BookOpen, desc: 'Notícies i SEO' },
  { id: 'inventory', label: 'Inventari', icon: Layers, desc: 'Gestió d\'estoc' },
  { id: 'accessControl', label: 'Zona Privada', icon: Lock, desc: 'Login clients' },
  { id: 'chatbot', label: 'Assistent IA', icon: MessageCircle, desc: 'Atenció 24/7' },
];

// ✅ MILLORA: Configurem cada secció amb una icona representativa
const SECTIONS_CONFIG = [
    { id: 'hero', label: 'Hero / Intro', icon: Megaphone },
    { id: 'features', label: 'Destacats', icon: Star },
    { id: 'services', label: 'Serveis', icon: Wrench },
    { id: 'about', label: 'Equip', icon: Users },
    { id: 'testimonials', label: 'Ressenyes', icon: MessageCircle },
    { id: 'contact', label: 'Contacte', icon: Mail },
    { id: 'faq', label: 'Preguntes', icon: HelpCircle },
];

export function DesignSection({ defaultColor }: { defaultColor?: string }) {
  return (
    <FormSection 
      title="Disseny i Funcionalitat" 
      description="Personalitza l'aspecte, les seccions i els mòduls."
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
                        defaultValue={defaultColor || "#7c3aed"} 
                        className="h-10 w-10 rounded-lg cursor-pointer border-0 bg-transparent" 
                    />
                    <div className="text-xs text-slate-500">
                        Color de marca principal.
                    </div>
                </div>
            </div>

            {/* Layout */}
            <div>
                <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Estructura Web</label>
                <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer group">
                        <input type="radio" name="layoutVariant" value="modern" defaultChecked className="peer hidden" />
                        <div className="p-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 transition-all text-center group-hover:border-blue-200">
                            <Layout className="w-6 h-6 mx-auto mb-2 text-slate-400 peer-checked:text-blue-600" />
                            <span className="text-xs font-bold block">Corporativa</span>
                        </div>
                    </label>
                    <label className="cursor-pointer group">
                        <input type="radio" name="layoutVariant" value="shop" className="peer hidden" />
                        <div className="p-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 transition-all text-center group-hover:border-blue-200">
                            <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-slate-400 peer-checked:text-blue-600" />
                            <span className="text-xs font-bold block">Botiga</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>

        {/* --- SECCIONS DE LA LANDING (ARA VISUALS) --- */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-sm font-medium mb-4 text-slate-700 dark:text-slate-300 items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Seccions de la Pàgina d'Inici
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {SECTIONS_CONFIG.map((sec) => (
                    <label key={sec.id} className="cursor-pointer group relative">
                        <input 
                            type="checkbox" 
                            name="landing_sections" 
                            value={sec.id}
                            defaultChecked={['hero', 'services', 'contact'].includes(sec.id)} 
                            className="peer hidden" 
                        />
                        
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all
                                border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800
                                text-slate-500 dark:text-slate-400
                                
                                peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20
                                peer-checked:text-blue-700 dark:peer-checked:text-blue-300
                            `}
                        >
                            <sec.icon className="w-6 h-6 mb-2" />
                            <span className="text-xs font-bold capitalize">{sec.label}</span>
                        </motion.div>

                        {/* Petit check flotant per confirmar selecció */}
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </label>
                ))}
            </div>
        </div>

        {/* Mòduls */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-sm font-medium mb-4 text-slate-700 dark:text-slate-300">Mòduls Funcionals</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {MODULES.map((mod) => (
                    <label key={mod.id} className="relative cursor-pointer group">
                        <input type="checkbox" name={`module_${mod.id}`} className="peer hidden" />
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 transition-all h-full"
                        >
                            <mod.icon className="w-5 h-5 mb-2 text-slate-400 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400" />
                            <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">{mod.label}</span>
                            <span className="text-[10px] text-slate-500 leading-tight block mt-1">{mod.desc}</span>
                        </motion.div>
                    </label>
                ))}
            </div>
        </div>
    </FormSection>
  );
}