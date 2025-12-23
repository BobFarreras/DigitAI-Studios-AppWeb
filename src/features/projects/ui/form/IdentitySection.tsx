'use client';

import { Github, Globe, Upload, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { FormSection } from './FormSection';
import { RefObject, useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';

interface Props {
  defaultName?: string;
  defaultSlug?: string;
  slugRef: RefObject<HTMLInputElement | null>;
}

export function IdentitySection({ defaultName, defaultSlug, slugRef }: Props) {
  const [fileStatus, setFileStatus] = useState<'idle' | 'compressing' | 'success' | 'error'>('idle');
  const [fileMessage, setFileMessage] = useState<string>('');
  const [preview, setPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (slugRef.current) {
        const currentSlug = slugRef.current.value;
        if (!currentSlug || currentSlug.startsWith('client-')) {
            const generated = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            slugRef.current.value = generated ? `client-${generated}` : '';
        }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
        setFileStatus('idle');
        setFileMessage('');
        setPreview(null);
        return;
    }

    if (!file.type.startsWith('image/')) {
        setFileStatus('error');
        setFileMessage('Només s\'accepten imatges (JPG, PNG, WEBP).');
        e.target.value = ''; 
        return;
    }

    setFileStatus('compressing');
    setFileMessage(`Optimitzant imatge (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);

    try {
        const options = {
            maxSizeMB: 1, 
            maxWidthOrHeight: 1200,
            useWebWorker: true,
            fileType: file.type as string
        };

        const compressedFile = await imageCompression(file, options);

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(new File([compressedFile], file.name, { type: file.type }));
        if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files;
        }

        setFileStatus('success');
        setFileMessage(`Llest! Reduït a ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
        setPreview(URL.createObjectURL(compressedFile));

    } catch (error) {
        console.error("Error comprimint:", error);
        setFileStatus('error');
        setFileMessage('No s\'ha pogut processar la imatge.');
    }
  };

  return (
    <FormSection 
      title="Identitat Digital" 
      description="Defineix com es dirà el negoci i el seu domini."
      icon={<Globe className="w-5 h-5" />}
      delay={0.1}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nom del Negoci</label>
            <input 
                name="businessName" 
                required 
                defaultValue={defaultName} 
                onChange={handleNameChange}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="Ex: Restaurant Can Roca" 
            />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Identificador (URL)</label>
            <div className="relative group">
                <Github className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    name="slug" 
                    required 
                    ref={slugRef}
                    defaultValue={defaultSlug}
                    className="w-full pl-9 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="client-nom-negoci" 
                />
            </div>
            <p className="text-[10px] text-slate-400">Es crearà un repo a GitHub amb aquest nom.</p>
        </div>
      </div>

      <div 
        className={`
            relative p-4 border-2 border-dashed rounded-xl transition-all group overflow-hidden
            ${fileStatus === 'error' ? 'border-red-300 bg-red-50' : 
              fileStatus === 'success' ? 'border-green-300 bg-green-50 dark:bg-green-900/10' : 
              'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
        `}
      >
        <label className="flex items-center gap-4 cursor-pointer relative z-10">
            
            <div className={`
                p-3 rounded-full shrink-0 transition-transform group-hover:scale-105
                ${fileStatus === 'error' ? 'bg-red-100 text-red-500' : 
                  fileStatus === 'success' ? 'bg-green-100 text-green-600' : 
                  fileStatus === 'compressing' ? 'bg-blue-100 text-blue-600' :
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}
            `}>
                {fileStatus === 'compressing' ? <Loader2 className="w-6 h-6 animate-spin" /> :
                 fileStatus === 'success' ? <CheckCircle2 className="w-6 h-6" /> :
                 fileStatus === 'error' ? <AlertCircle className="w-6 h-6" /> :
                 <Upload className="w-6 h-6" />}
            </div>

            <div className="flex-1 min-w-0">
                <span className={`block text-sm font-medium ${fileStatus === 'error' ? 'text-red-600' : 'text-slate-700 dark:text-slate-200'}`}>
                    {fileStatus === 'compressing' ? 'Optimitzant imatge...' :
                     fileStatus === 'success' ? 'Imatge llesta per pujar' :
                     fileStatus === 'error' ? 'Error al fitxer' :
                     'Pujar Logotip'}
                </span>
                
                <span className="text-xs text-slate-500 truncate block">
                    {fileMessage || "Formats: PNG, JPG, WEBP. Automàticament comprimit."}
                </span>
            </div>

            <input 
                ref={fileInputRef}
                type="file" 
                name="logo" 
                required={!preview} 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
                onChange={handleFileChange}
            />

            {/* 👇 AQUÍ ESTAVA L'ERROR. Usem <img> normal, no <Image> */}
            {preview && (
                <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden shrink-0 relative bg-white">
                    <img 
                        src={preview} 
                        alt="Logo Preview" 
                        className="w-full h-full object-cover" 
                    />
                </div>
            )}
        </label>
      </div>
    </FormSection>
  );
}