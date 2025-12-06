// src/features/blog/ui/AdminPostList.tsx
'use client';

import { BlogPostDTO } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, EyeOff, Calendar, CheckCircle2 } from 'lucide-react'; // 👈 Importat CheckCircle2
import { togglePostStatusAction, deletePostAction } from '../actions/admin-actions';
import { useTransition } from 'react';
import { Link } from '@/routing';

export function AdminPostList({ posts }: { posts: BlogPostDTO[] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (slug: string, currentStatus: boolean) => {
    if (confirm(`Vols canviar l'estat a ${!currentStatus ? 'PUBLICAT' : 'ESBORRANY'}?`)) {
      startTransition(async () => {
         await togglePostStatusAction(slug, currentStatus);
      });
    }
  };

  const handleDelete = (slug: string) => {
    if (confirm('Estàs segur?')) {
      startTransition(async () => {
         await deletePostAction(slug);
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        {/* Capçalera amb colors semàntics */}
        <thead className="bg-muted text-muted-foreground font-medium border-b border-border uppercase text-xs">
          <tr>
            <th className="px-6 py-4">Títol</th>
            <th className="px-6 py-4">Estat</th>
            <th className="px-6 py-4">Data</th>
            <th className="px-6 py-4 text-right">Accions</th>
          </tr>
        </thead>
        
        <tbody className="divide-y divide-border">
          {posts.map((post) => (
            <tr key={post.slug} className="hover:bg-muted/50 transition-colors group">
              
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="font-bold text-foreground line-clamp-1">{post.title}</div>
                    
                    {/* INDICADOR REVISAT A LA LLISTA */}
                    {post.reviewed && (
                        <div className="text-green-500" title="Revisat i aprovat">
                            <CheckCircle2 className="w-4 h-4 fill-green-500/10" />
                        </div>
                    )}
                </div>
                <div className="text-xs text-muted-foreground font-mono">{post.slug}</div>
              </td>
              
              <td className="px-6 py-4">
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border
                    ${post.published 
                      ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400' 
                      : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400'
                    }`}
                >
                  {post.published ? 'Publicat' : 'Esborrany'}
                </span>
              </td>

              <td className="px-6 py-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 opacity-70" />
                  {post.date ? new Date(post.date).toLocaleDateString() : '-'}
                </div>
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleToggle(post.slug, post.published)}
                    disabled={isPending}
                    className="hover:bg-background hover:text-foreground"
                    title={post.published ? "Despublicar" : "Publicar"}
                  >
                    {post.published 
                      ? <Eye className="w-4 h-4 text-green-500" /> 
                      : <EyeOff className="w-4 h-4 text-muted-foreground" />
                    }
                  </Button>

                  <Link href={`/admin/blog/${post.slug}`}>
                      <Button size="icon" variant="ghost" className="hover:bg-background hover:text-blue-500" title="Editar">
                        <Edit className="w-4 h-4" />
                      </Button>
                  </Link>

                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleDelete(post.slug)}
                    disabled={isPending}
                    className="hover:bg-red-500/10 hover:text-red-500"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                
                </div>
              </td>
            </tr>
          ))}
          
          {posts.length === 0 && (
              <tr>
                  <td colSpan={4} className="text-center py-12 text-muted-foreground">
                    No s'han trobat articles.
                  </td>
              </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}