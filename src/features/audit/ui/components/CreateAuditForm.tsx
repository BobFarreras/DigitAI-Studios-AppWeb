'use client';

import { useState } from 'react';
import { useRouter } from '@/routing'; // Importa del teu sistema i18n
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Globe } from 'lucide-react';
import { createAuditAction } from '../../actions'; // Crearem aquesta acció

export function CreateAuditForm({ userId }: { userId: string }) {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Cridem a la Server Action
            const result = await createAuditAction(url, userId);

            if (result.success && result.auditId) {
                // Èxit: Anem a veure l'informe
                router.refresh(); // Refresca per actualitzar les dades del servidor
                router.push(`/dashboard/audits/${result.auditId}`);
            } else {
                setError(result.message || 'Error desconegut');
            }
        } catch (err) {
            console.error(err);
            setError('Ha passat alguna cosa. Torna-ho a provar.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">URL del Lloc Web</label>
                <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                        type="url"
                        placeholder="https://exemple.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="pl-10 bg-white/5 border-white/10 text-white h-12 focus:border-primary focus:ring-primary placeholder:text-slate-600"
                    />
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                disabled={isLoading || !url}
                className="w-full h-12 gradient-bg text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
                {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analitzant Web...</>
                ) : (
                    <><Search className="w-4 h-4 mr-2" /> Començar Anàlisi</>
                )}
            </Button>

            <p className="text-xs text-center text-slate-500">
                L'anàlisi pot trigar entre 10 i 30 segons.
            </p>
        </form>
    );
}