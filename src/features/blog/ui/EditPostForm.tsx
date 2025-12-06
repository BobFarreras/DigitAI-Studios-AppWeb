'use client';

import { useActionState, useState, useEffect } from 'react'; // 👈 Afegim useEffect
import { BlogPostDTO } from '@/types/models';
import { updatePostDetailsAction, ActionState } from '@/features/blog/actions/admin-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Eye, PenTool, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from '@/routing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner'; // 👈 Usem toast per feedback professional

const initialState: ActionState = {
    success: false,
    message: '',
};

export function EditPostForm({ post }: { post: BlogPostDTO }) {
    const [state, formAction, isPending] = useActionState(updatePostDetailsAction, initialState);
    
    const [content, setContent] = useState(post.content || '');
    const [title, setTitle] = useState(post.title);
    const [isReviewed, setIsReviewed] = useState(post.reviewed);

    // 👂 ESCOLTEM EL RESULTAT DEL SERVIDOR
    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message); // Missatge verd
            } else {
                toast.error(state.message);   // Missatge vermell
            }
        }
    }, [state]);

    return (
        <form action={formAction} className="max-w-5xl mx-auto pb-20">
            <input type="hidden" name="slug" value={post.slug} />

            {/* HEADER ACCIONS */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Editar Article</h1>
                    <p className="text-muted-foreground text-sm">Gestiona el contingut i SEO de l'article.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {post.published && (
                        <Link href={`/blog/${post.slug}`} target="_blank" className="flex-1 sm:flex-none">
                            <Button variant="outline" size="sm" type="button" className="w-full">
                                <ExternalLink className="w-4 h-4 mr-2" /> Veure Web
                            </Button>
                        </Link>
                    )}
                    <div className="flex-1 sm:flex-none">
                        <Button type="submit" disabled={isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {isPending ? 'Guardant...' : 'Guardar Canvis'}
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="edit" className="w-full space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-px">
                    <TabsList className="bg-muted/50 p-1">
                        <TabsTrigger value="edit" className="gap-2">
                            <PenTool className="w-4 h-4" /> Edició
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="gap-2">
                            <Eye className="w-4 h-4" /> Vista Prèvia
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="edit" className="space-y-8 animate-in fade-in-50 duration-300">
                    
                    <Card className="bg-card border-border shadow-sm">
                        <CardContent className="p-6 space-y-6">
                            
                            {/* CHECKBOX REVISAT */}
                            <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg border border-border">
                                <Checkbox 
                                    id="reviewed" 
                                    name="reviewed" 
                                    checked={isReviewed}
                                    onCheckedChange={(c) => setIsReviewed(c as boolean)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label htmlFor="reviewed" className="text-sm font-medium flex items-center gap-2 cursor-pointer select-none">
                                        <CheckCircle2 className={`w-4 h-4 ${isReviewed ? 'text-green-500' : 'text-muted-foreground'}`} />
                                        Marcar com a Revisat
                                    </label>
                                    <p className="text-xs text-muted-foreground">Llest per publicar.</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Títol</label>
                                    <Input
                                        name="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="text-lg font-bold h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Data</label>
                                    <Input
                                        type="datetime-local"
                                        name="date"
                                        defaultValue={post.date ? new Date(post.date).toISOString().slice(0, 16) : ''}
                                        className="h-12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Descripció</label>
                                <Textarea
                                    name="description"
                                    defaultValue={post.description || ''}
                                    rows={3}
                                    className="resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground ml-1">Contingut</label>
                        <div className="relative rounded-xl border border-input shadow-sm bg-background">
                            <Textarea
                                name="content" // CLAU!
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[500px] w-full p-6 font-mono text-sm leading-relaxed border-0 focus-visible:ring-0 resize-y"
                                placeholder="# Comença..."
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="preview">
                    {/* ... (el codi de la preview no cal canviar-lo) ... */}
                    <div className="p-8 border rounded-xl bg-background min-h-[400px]">
                        <h1 className="text-4xl font-bold mb-4">{title}</h1>
                        <pre className="whitespace-pre-wrap font-sans">{content}</pre>
                    </div>
                </TabsContent>
            </Tabs>
        </form>
    );
}