// src/features/blog/ui/AdminPostList.tsx
'use client';

import { BlogPostDTO } from '@/types/models';
import { Button } from '@/components/ui/button';
import {
  Edit, Trash2, Eye, EyeOff, Calendar,
  CheckCircle2, Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { togglePostStatusAction, deletePostAction } from '../actions/admin-actions';
import { useTransition } from 'react';
import { Link, useRouter } from '@/routing'; // 👈 Importem useRouter
import { cn } from '@/lib/utils';

interface AdminPostListProps {
  posts: BlogPostDTO[];
  currentPage: number; // 👈 Nou prop
  totalPages: number;  // 👈 Nou prop
}

export function AdminPostList({ posts, currentPage, totalPages }: AdminPostListProps) {
  const router = useRouter(); // Assegura't de tenir això importat de '@/routing' o 'next/navigation'
  const [isPending, startTransition] = useTransition();

  // Navegació principal al fer clic a la fila
  const handleRowClick = (slug: string) => {
    router.push(`/admin/blog/${slug}`);
  };
  const handlePageChange = (newPage: number) => {
    // Naveguem a la nova URL, Next.js farà el refresh de dades automàtic
    router.push(`/admin/blog?page=${newPage}`);
  };

  const handleToggle = (e: React.MouseEvent, slug: string, currentStatus: boolean) => {
    e.stopPropagation(); // 🛑 Evita que s'obri la fila quan cliquem el botó
    if (confirm(`Vols canviar l'estat a ${!currentStatus ? 'PUBLICAT' : 'ESBORRANY'}?`)) {
      startTransition(async () => {
        await togglePostStatusAction(slug, currentStatus);
      });
    }
  };

  const handleDelete = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation(); // 🛑 Evita que s'obri la fila
    if (confirm('Estàs segur?')) {
      startTransition(async () => {
        await deletePostAction(slug);
      });
    }
  };

  // Helper per calcular estat social
  const getSocialStatus = (socials: BlogPostDTO['social_posts']) => {
    if (!socials || socials.length === 0) return 'none';
    const hasPublished = socials.some(p => p.status === 'published' || p.status === 'scheduled');
    return hasPublished ? 'published' : 'draft';
  };

  return (
    <div className="flex flex-col min-h-150"> {/* Altura mínima per evitar salts */}

      {/* TAULA (Amb flex-grow per ocupar espai) */}
      <div className="overflow-x-auto grow">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium border-b border-border uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Títol</th>
              <th className="px-6 py-4">Estat Web</th>
              <th className="px-6 py-4 text-center">Social (IA)</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4 text-right">Accions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {posts.map((post) => {
              const socialStatus = getSocialStatus(post.social_posts);
              const socialCount = post.social_posts?.length || 0;

              return (
                <tr
                  key={post.slug}
                  // 👇 MAGIA AQUÍ: Tota la fila és clicable
                  onClick={() => handleRowClick(post.slug)}
                  className="hover:bg-muted/50 transition-colors group cursor-pointer"
                >

                  {/* TÍTOL */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {post.title}
                      </div>
                      {post.reviewed && (
                        <div className="text-green-500" title="Revisat i aprovat">
                          <CheckCircle2 className="w-4 h-4 fill-green-500/10" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">{post.slug}</div>
                  </td>

                  {/* ESTAT WEB */}
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        post.published
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                      )}
                    >
                      {post.published ? 'Publicat' : 'Esborrany'}
                    </span>
                  </td>

                  {/* ESTAT SOCIAL */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {socialStatus === 'none' && (
                        <div title="Sense contingut social generat" className="opacity-20">
                          <Share2 className="w-5 h-5" />
                        </div>
                      )}

                      {socialStatus === 'draft' && (
                        <div title={`${socialCount} Posts generats (Esborranys)`} className="relative text-orange-500">
                          <Share2 className="w-5 h-5" />
                          <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-100 text-[9px] font-bold border border-orange-200">
                            {socialCount}
                          </span>
                        </div>
                      )}

                      {socialStatus === 'published' && (
                        <div title="Distribució Social Activa" className="relative text-purple-600">
                          <Share2 className="w-5 h-5 fill-purple-100" />
                          <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-px">
                            <CheckCircle2 className="w-3 h-3 text-purple-600 fill-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* DATA */}
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 opacity-70" />
                      {post.date ? new Date(post.date).toLocaleDateString() : '-'}
                    </div>
                  </td>

                  {/* ACCIONS */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">

                      {/* PUBLICAR / DESPUBLICAR */}
                      <Button
                        size="icon"
                        variant="ghost"
                        // Passem l'event 'e' per fer stopPropagation
                        onClick={(e) => handleToggle(e, post.slug, post.published)}
                        disabled={isPending}
                        className="hover:bg-background hover:text-foreground relative z-10"
                        title={post.published ? "Despublicar" : "Publicar"}
                      >
                        {post.published
                          ? <Eye className="w-4 h-4 text-green-500" />
                          : <EyeOff className="w-4 h-4 text-muted-foreground" />
                        }
                      </Button>

                      {/* EDITAR (Encara que la fila ho fa, el mantenim per claredat visual) */}
                      <Link href={`/admin/blog/${post.slug}`} onClick={(e) => e.stopPropagation()}>
                        <Button size="icon" variant="ghost" className="hover:bg-background hover:text-blue-500 relative z-10" title="Editar">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>

                      {/* ELIMINAR */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => handleDelete(e, post.slug)}
                        disabled={isPending}
                        className="hover:bg-red-500/10 hover:text-red-500 relative z-10"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                    </div>
                  </td>
                </tr>
              )
            })}

            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground">
                  No s'han trobat articles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* PEU DE PÀGINA AMB PAGINACIÓ */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <div className="text-xs text-muted-foreground">
            Pàgina <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 px-3"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 px-3"
            >
              Següent <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}