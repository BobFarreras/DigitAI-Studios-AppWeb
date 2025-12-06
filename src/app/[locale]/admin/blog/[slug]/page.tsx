// src/app/[locale]/admin/blog/[slug]/page.tsx

import { requireAdmin } from '@/lib/auth/admin-guard';
import { postRepository } from '@/services/container';
import { notFound } from 'next/navigation';
import { MDXContent } from '@/features/blog/ui/MDXContent';
import { Link } from '@/routing';
import { ArrowLeft, Save, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PostStatusToggle } from '@/features/blog/ui/PostStatusToggle';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function AdminPostDetailPage({ params }: Props) {
    await requireAdmin();
    const { slug } = await params;

    // Obtenim el post (draft o publicat)
    const post = await postRepository.getAdminPostBySlug(slug);

    if (!post) {
        return notFound();
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog">
                        <Button variant="ghost" size="icon" className="hover:bg-muted text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">{post.title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                                post.published 
                                    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                                    : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                            }`}>
                                {post.published ? 'PUBLICAT' : 'ESBORRANY'}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono hidden md:inline-block">/ {post.slug}</span>
                        </div>
                    </div>
                </div>

                {/* ACCIONS */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Eliminar</span>
                    </Button>

                    <Link href={`/blog/${post.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Veure Web</span>
                        </Button>
                    </Link>

                    {/* Botó toggle estat */}
                    <PostStatusToggle postId={post.id || ''} isPublished={post.published} />

                    <Link href={`/admin/blog/${post.slug}/edit`}>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Save className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Editar</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* CONTINGUT PREVIEW */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* COLUMNA PRINCIPAL (PREVIEW MDX) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Imatge de Portada */}
                    <div className="aspect-video relative rounded-xl overflow-hidden bg-muted border border-border">
                        {post.coverImage ? (
                            <Image
                                src={post.coverImage}
                                alt="Cover"
                                fill
                                sizes="(max-width: 768px) 100vw, 66vw"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-medium">
                                Sense Imatge de Portada
                            </div>
                        )}
                    </div>

                    {/* Contingut del Post */}
                    <Card className="bg-card border-border shadow-sm">
                        <CardContent className="p-6 md:p-8 prose prose-slate dark:prose-invert max-w-none">
                            <MDXContent source={post.content || ''} />
                        </CardContent>
                    </Card>
                </div>

                {/* SIDEBAR METADADES */}
                <div className="space-y-6">
                    <Card className="bg-card border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                Detalls SEO
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            
                            <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Slug URL</label>
                                <code className="text-xs bg-muted p-2 rounded block w-full text-foreground font-mono break-all border border-border">
                                    {post.slug}
                                </code>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Meta Descripció</label>
                                <p className="text-sm text-foreground leading-relaxed">
                                    {post.description || <span className="italic opacity-50">Sense descripció...</span>}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Etiquetes (Tags)</label>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.length > 0 ? (
                                        post.tags.map(tag => (
                                            <span key={tag} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium border border-primary/20">
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">Sense tags</span>
                                    )}
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}