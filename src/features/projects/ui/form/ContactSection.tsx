'use client';

import { Mail, Phone, MapPin, Share2, Instagram, Linkedin, Twitter } from 'lucide-react';
import { FormSection } from './FormSection';

export function ContactSection() {
  return (
    <FormSection 
      title="Dades de Contacte i Xarxes" 
      description="Aquesta informació apareixerà al Footer i a la pàgina de Contacte."
      icon={<Share2 className="w-5 h-5" />}
      delay={0.2}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* COLUMNA 1: CONTACTE DIRECTE */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-500" /> Contacte
          </h3>
          
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Email Públic</label>
            <div className="relative">
              <input 
                type="email" 
                name="publicEmail" 
                placeholder="hola@elmeunegoci.com"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Telèfon</label>
            <div className="relative">
              <input 
                type="tel" 
                name="phone" 
                placeholder="+34 600 000 000"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Adreça Física</label>
            <div className="relative">
              <input 
                type="text" 
                name="address" 
                placeholder="Carrer Exemple, 123, Barcelona"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* COLUMNA 2: XARXES SOCIALS */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-500" /> Xarxes Socials
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Instagram (URL)</label>
            <div className="relative">
              <input 
                type="url" 
                name="instagram" 
                placeholder="https://instagram.com/..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <Instagram className="w-4 h-4 text-pink-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">LinkedIn (URL)</label>
            <div className="relative">
              <input 
                type="url" 
                name="linkedin" 
                placeholder="https://linkedin.com/in/..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <Linkedin className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Twitter / X (URL)</label>
            <div className="relative">
              <input 
                type="url" 
                name="twitter" 
                placeholder="https://twitter.com/..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <Twitter className="w-4 h-4 text-sky-500 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

      </div>
    </FormSection>
  );
}