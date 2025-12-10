'use client';

import { useActionState, useEffect } from 'react';
import { TestCampaignDTO } from '@/types/models';
import { updateCampaignAction, ActionState } from '@/features/tests/actions/admin-actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const initialState: ActionState = { success: false, message: '' };

export function CampaignDetailsForm({ campaign }: { campaign: TestCampaignDTO }) {
    const [stateGeneral, actionGeneral, isPendingGeneral] = useActionState(updateCampaignAction, initialState);
    const [stateDocs, actionDocs, isPendingDocs] = useActionState(updateCampaignAction, initialState);

    useEffect(() => {
        if (stateGeneral.success) toast.success(stateGeneral.message);
        else if (stateGeneral.message) toast.error(stateGeneral.message);
    }, [stateGeneral]);

    useEffect(() => {
        if (stateDocs.success) toast.success(stateDocs.message);
        else if (stateDocs.message) toast.error(stateDocs.message);
    }, [stateDocs]);

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            
            {/* --- CONFIGURACIÓ GENERAL --- */}
            <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6">
                    <form action={actionGeneral} className="space-y-4">
                        <input type="hidden" name="id" value={campaign.id} />
                        
                        <h3 className="text-lg font-bold text-foreground mb-4">Configuració General</h3>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Títol de la Campanya</label>
                            <Input 
                                name="title"
                                defaultValue={campaign.title} 
                                className="bg-background border-input text-foreground" 
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Estat</label>
                            <select 
                                name="status"
                                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                defaultValue={campaign.status}
                            >
                                <option value="active">Activa (Visible)</option>
                                <option value="draft">Esborrany (Oculta)</option>
                                <option value="completed">Tancada</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Descripció Curta</label>
                            <Input 
                                name="description"
                                defaultValue={campaign.description || ''} 
                                className="bg-background border-input text-foreground" 
                            />
                        </div>

                        <Button disabled={isPendingGeneral} className="w-full mt-4">
                            {isPendingGeneral ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Guardar Configuració
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* --- DOCUMENTACIÓ --- */}
            <Card className="bg-card border-border shadow-sm flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col h-full">
                    <form action={actionDocs} className="contents">
                        <input type="hidden" name="id" value={campaign.id} />

                        <div className="mb-2">
                            <h3 className="text-lg font-bold text-foreground">Documentació per al Tester</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Aquest text apareixerà a la part esquerra de la pantalla del tester.
                            </p>
                        </div>
                        
                        <Textarea 
                            name="instructions"
                            className="bg-background border-input text-foreground font-mono text-sm flex-1 min-h-[300px] resize-none leading-relaxed p-4 mb-4" 
                            defaultValue={campaign.instructions || ''}
                            placeholder="# Guia de Proves..."
                        />
                        
                        <Button disabled={isPendingDocs} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            {isPendingDocs ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Guardar Documentació
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}