import { requireAdmin } from '@/lib/auth/admin-guard';
import { postRepository } from '@/services/container';
import { notFound } from 'next/navigation';
import { MDXContent } from '@/features/blog/ui/MDXContent';
import { Link } from '@/routing';
import { ArrowLeft, Save, Trash2,ExternalLink  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PostStatusToggle } from '@/features/blog/ui/PostStatusToggle';


type Props = {
    params: Promise<{ slug: string }>;
};

export default async function AdminPostDetailPage({ params }: Props) {
    await requireAdmin();
    const { slug } = await params;

    // ⚠️ USEM EL NOU MÈTODE QUE INCLOU ESBORRANYS
    const post = await postRepository.getAdminPostBySlug(slug);

    if (!post) {
        return notFound();
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto text-slate-200">

            {/* CORRECCIÓ HEADER: Eliminat 'sticky top-0' i afegit padding/marges nets */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="min-w-0"> {/* min-w-0 ajuda a truncar text en flex */}
                        <h1 className="text-xl md:text-2xl font-bold truncate">{post.title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-mono px-2 py-0.5 rounded ${post.published ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                {post.published ? 'PUBLICAT' : 'ESBORRANY'}
                            </span>
                            <span className="text-xs text-slate-500 hidden md:inline-block">/ {post.slug}</span>
                        </div>
                    </div>
                </div>

                {/* Dins del HEADER, a la secció de botons a la dreta */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto mt-4 md:mt-0">
                    {/* Botó Esborrar (existent) */}
                    <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Eliminar</span>
                    </Button>

                    {/* Enllaç veure (existent) */}
                    <Link href={`/blog/${post.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="border-slate-700">
                            <ExternalLink className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Veure Web</span>
                        </Button>
                    </Link>

                    {/* 👇 NOU BOTÓ PUBLICAR/DESPUBLICAR */}
                    {/* Nota: el postRepository ha de retornar l'ID del post, assegura't que el DTO el té. 
                Si no el tens al DTO, afegeix-lo al SupabasePostRepository.ts mapToDTO */}
                    <PostStatusToggle postId={post.id || ''} isPublished={post.published} />

                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Save className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Guardar</span>
                    </Button>
                </div>
            </div>

            {/* CONTINGUT PREVIEW */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* COLUMNA PRINCIPAL (PREVIEW MDX) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="aspect-video relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                        {post.coverImage ? (
                            <Image
                                src={post.coverImage}
                                alt="Cover"
                                fill
                                sizes="100vw"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-600">Sense Imatge</div>
                        )}
                    </div>

                    <div className="prose prose-invert max-w-none p-6 bg-slate-900 rounded-xl border border-slate-800">
                        <MDXContent source={post.content || ''} />
                    </div>
                </div>

                {/* SIDEBAR METADADES */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                        <h3 className="font-bold text-slate-400 uppercase text-xs tracking-wider">Detalls SEO</h3>

                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Slug</label>
                            <code className="text-sm bg-black p-2 rounded block w-full text-blue-300 overflow-hidden">{post.slug}</code>
                        </div>

                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Descripció</label>
                            <p className="text-sm text-slate-300 leading-relaxed">{post.description}</p>
                        </div>

                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Tags</label>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}