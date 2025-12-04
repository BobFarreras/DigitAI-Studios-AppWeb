'use client';

import { useActionState, useState } from 'react';
import { BlogPostDTO } from '@/types/models';
import { updatePostDetailsAction, ActionState } from '@/features/blog/actions/admin-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Eye, PenTool } from 'lucide-react';
import { Link } from '@/routing';
// Importem components de pestanyes (si els tens a UI, sinó fem un switch simple)
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Assumint que tens shadcn/ui
// Importem el renderitzador MDX (El mateix que usa la web pública)
import { MDXContent } from '@/features/blog/ui/MDXContent';

const initialState: ActionState = {
    success: false,
    message: '',
};

export function EditPostForm({ post }: { post: BlogPostDTO }) {
    const [state, formAction, isPending] = useActionState(updatePostDetailsAction, initialState);
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    // Estats locals per a la vista prèvia en temps real
    const [content, setContent] = useState(post.content || '');
    const [title, setTitle] = useState(post.title);

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="slug" value={post.slug} />

            <Tabs defaultValue="edit" className="w-full">
                <div className="flex justify-between items-center mb-4">
                    {/* Selector de Tabs manual */}
                    <div className="flex border-b border-border mb-6">
                        <button
                            type="button"
                            onClick={() => setActiveTab('edit')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'edit' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                        >
                            ✏️ Edició
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('preview')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preview' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                        >
                            👁️ Vista Prèvia
                        </button>
                    </div>

                    {/* Botó per veure la versió pública real (si està publicada) */}
                    {post.published && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" type="button">
                                Veure Web Pública ↗
                            </Button>
                        </Link>
                    )}
                </div>

                {/* --- PESTANYA EDICIÓ --- */}
                <TabsContent value="edit" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Títol</label>
                            <Input
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="dark:bg-slate-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Data</label>
                            <Input
                                type="datetime-local"
                                name="date"
                                defaultValue={post.date ? new Date(post.date).toISOString().slice(0, 16) : ''}
                                className="dark:bg-slate-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descripció (SEO)</label>
                        <textarea
                            name="description"
                            defaultValue={post.description || ''}
                            rows={2}
                            className="w-full p-3 rounded-md border border-input bg-background text-sm dark:bg-slate-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contingut (Markdown / MDX)</label>
                        <textarea
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={15}
                            className="w-full p-4 rounded-md border border-input bg-background font-mono text-sm leading-relaxed dark:bg-slate-900"
                            placeholder="# Escriu aquí el teu article..."
                        />
                        <p className="text-xs text-muted-foreground">Pots utilitzar Markdown i components React.</p>
                    </div>
                </TabsContent>

                {/* --- PESTANYA VISTA PRÈVIA --- */}
                <TabsContent value="preview">
                    <div className="border rounded-xl p-8 bg-white dark:bg-slate-950 shadow-sm min-h-[500px]">
                        {/* Simulem la capçalera del blog */}
                        <div className="mb-8 text-center">
                            <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
                            <div className="text-sm text-muted-foreground">Vista prèvia d'administrador</div>
                        </div>

                        {/* Renderitzem el contingut */}
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            {/* Nota: MDXRemote necessita executar-se al servidor normalment. 
                        Per a una preview client-side ràpida, pots usar 'react-markdown' 
                        o simplement mostrar el text si no vols complicar-ho. 
                        
                        Si MDXContent és un Server Component (que ho és al teu projecte), 
                        no el pots renderitzar aquí directament amb l'estat 'content' dinàmic 
                        sense fer un roundtrip al servidor.
                        
                        SOLUCIÓ RÀPIDA: Un iframe o un text simple. 
                        SOLUCIÓ PRO: Un Server Action que renderitzi la preview.
                    */}
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded mb-4 text-sm">
                                ⚠️ Nota: La previsualització exacta de components MDX requereix guardar. Aquí veus el text cru o podries usar una llibreria com `react-markdown`.
                            </div>
                            <pre className="whitespace-pre-wrap font-sans text-base">{content}</pre>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Footer Accions */}
            <div className="pt-6 border-t flex justify-between items-center bg-background sticky bottom-0 z-10 p-4">
                {!state.success && state.message && (
                    <div className="text-red-500 text-sm font-medium">{state.message}</div>
                )}
                <div className="flex gap-3 ml-auto">
                    <Link href="/admin/blog">
                        <Button variant="outline" type="button">Cancel·lar</Button>
                    </Link>
                    <Button type="submit" className="gap-2" disabled={isPending}>
                        <Save className="w-4 h-4" />
                        {isPending ? 'Guardant...' : 'Guardar Canvis'}
                    </Button>
                </div>
            </div>
        </form>
    );
}