'use client';

import { useActionState, useState, useEffect } from 'react';
import { BlogPostDTO } from '@/types/models';
import { updatePostDetailsAction, ActionState } from '@/features/blog/actions/admin-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Eye, PenTool, ExternalLink, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from '@/routing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const initialState: ActionState = {
    success: false,
    message: '',
};

export function EditPostForm({ post }: { post: BlogPostDTO }) {
    const [state, formAction, isPending] = useActionState(updatePostDetailsAction, initialState);
    
    // Estats locals
    const [content, setContent] = useState(post.content || '');
    const [title, setTitle] = useState(post.title);
    
    // Gestió simplificada de l'estat "Reviewed"
    // Només ens interessa per mostrar/amagar el check visual i l'input hidden
    const [isReviewed, setIsReviewed] = useState<boolean>(!!post.reviewed);

    useEffect(() => {
        if (state.message) {
            state.success ? toast.success(state.message) : toast.error(state.message);
        }
    }, [state]);

    return (
        <form action={formAction} className="max-w-5xl mx-auto pb-20">
            <input type="hidden" name="slug" value={post.slug} />
            
            {/* Input Hidden MANUAL: Aquest és el que realment llegeix el servidor */}
            <input type="hidden" name="reviewed" value={isReviewed ? "on" : "off"} />

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-border">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link href={`/admin/blog/${post.slug}`}>
                        <Button variant="ghost" size="icon" type="button" className="hover:bg-muted text-muted-foreground hover:text-foreground shrink-0">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground leading-tight">Editar Article</h1>
                        <p className="text-muted-foreground text-xs md:text-sm truncate max-w-[200px] md:max-w-md">
                            {post.title}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    {post.published && (
                        <Link href={`/blog/${post.slug}`} target="_blank" className="w-full sm:w-auto">
                            <Button variant="outline" size="sm" type="button" className="w-full gap-2">
                                <ExternalLink className="w-4 h-4" /> 
                                <span className="hidden sm:inline">Veure Web</span>
                                <span className="sm:hidden">Web</span>
                            </Button>
                        </Link>
                    )}
                    
                    <Button type="submit" disabled={isPending} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 gap-2 min-w-[140px]">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isPending ? 'Guardant...' : 'Guardar Canvis'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="edit" className="w-full space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-px">
                    <TabsList className="bg-muted/50 p-1 w-full sm:w-auto grid grid-cols-2 sm:flex">
                        <TabsTrigger value="edit" className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                            <PenTool className="w-4 h-4" /> Edició
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                            <Eye className="w-4 h-4" /> Vista Prèvia
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="edit" className="space-y-8 animate-in fade-in-50 duration-300">
                    <Card className="bg-card border-border shadow-sm">
                        <CardContent className="p-4 md:p-6 space-y-6">
                            
                            {/* Checkbox SAFE MODE */}
                            <div 
                                className="flex items-center space-x-3 p-4 bg-muted/30 hover:bg-muted/50 transition-colors rounded-lg border border-border cursor-pointer select-none" 
                                onClick={() => setIsReviewed(!isReviewed)}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isReviewed ? 'bg-green-600 border-green-600' : 'bg-background border-input'}`}>
                                    {isReviewed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>
                                
                                <div className="grid gap-1 leading-none">
                                    <label className="text-sm font-medium flex items-center gap-2 cursor-pointer pointer-events-none">
                                        <span className={isReviewed ? 'text-green-600 font-bold' : 'text-muted-foreground'}>Marcar com a Revisat</span>
                                    </label>
                                    <p className="text-xs text-muted-foreground hidden sm:block">Aquest article compleix els estàndards de qualitat.</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Títol Principal</label>
                                    <Input
                                        name="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="text-base md:text-lg font-bold h-12 bg-background border-input focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Data de Publicació</label>
                                    <Input
                                        type="datetime-local"
                                        name="date"
                                        defaultValue={post.date ? new Date(post.date).toISOString().slice(0, 16) : ''}
                                        className="h-12 bg-background border-input focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Descripció SEO</label>
                                <Textarea
                                    name="description"
                                    defaultValue={post.description || ''}
                                    rows={3}
                                    className="resize-none bg-background border-input focus:ring-primary/20"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Contingut (Markdown / MDX)</label>
                        <div className="relative rounded-xl border border-input shadow-sm bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <Textarea
                                name="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[500px] w-full p-4 md:p-6 font-mono text-sm leading-relaxed border-0 focus-visible:ring-0 resize-y bg-transparent"
                                placeholder="# Escriu el teu article aquí..."
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="preview" className="animate-in fade-in-50 duration-300">
                    <div className="border border-border rounded-xl bg-background shadow-lg overflow-hidden min-h-[500px]">
                        <div className="bg-muted/50 border-b border-border p-3 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                            </div>
                            <div className="mx-auto text-[10px] text-muted-foreground font-mono bg-background px-3 py-1 rounded border border-border opacity-70">
                                preview mode
                            </div>
                        </div>

                        <div className="p-6 md:p-12 max-w-3xl mx-auto">
                            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-foreground tracking-tight">{title}</h1>
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                                    {content || <span className="text-muted-foreground italic">Comença a escriure per veure el resultat...</span>}
                                </pre>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </form>
    );
}