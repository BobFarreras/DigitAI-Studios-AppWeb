'use client';

import { TestCampaignDTO } from '@/types/models';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// Pots reutilitzar la lògica d'actualització de campanya si la tens,
// o crear un 'updateCampaignAction'. Per ara deixem l'estructura visual.

export function CampaignDetailsForm({ campaign }: { campaign: TestCampaignDTO }) {
    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white">Configuració General</h3>
                    
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Títol de la Campanya</label>
                        <Input defaultValue={campaign.title} className="bg-black border-slate-700 text-white" />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Estat</label>
                        <select className="w-full bg-black border border-slate-700 text-white rounded-md p-2 text-sm" defaultValue={campaign.status}>
                            <option value="active">Activa (Visible pels testers)</option>
                            <option value="draft">Esborrany (Oculta)</option>
                            <option value="completed">Tancada</option>
                        </select>
                    </div>

                    <Button className="w-full mt-4">Guardar Canvis Generals</Button>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6 space-y-4 h-full flex flex-col">
                    <h3 className="text-lg font-bold text-white">Documentació per al Tester</h3>
                    <p className="text-xs text-slate-500">
                        Escriu aquí les guies, credencials de prova o passos previs. Suporta Markdown.
                    </p>
                    
                    <Textarea 
                        className="bg-black border-slate-700 text-white font-mono text-sm flex-1 min-h-[200px]" 
                        defaultValue={campaign.instructions || ''}
                        placeholder="# Guia de proves\n\n1. Entra a..."
                    />
                    
                    <Button variant="secondary" className="w-full">Guardar Documentació</Button>
                </CardContent>
            </Card>
        </div>
    )
}