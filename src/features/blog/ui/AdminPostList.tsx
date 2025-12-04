'use client';

import { BlogPostDTO } from '@/types/models';
// ❌ Eliminat import { Badge }...
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';
import { togglePostStatusAction, deletePostAction } from '../actions/admin-actions';
import { useTransition } from 'react';
import { Link } from '@/routing';

export function AdminPostList({ posts }: { posts: BlogPostDTO[] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (slug: string, currentStatus: boolean) => {
    if (confirm(`Vols canviar l'estat a ${!currentStatus ? 'PUBLICAT' : 'ESBORRANY'}?`)) {
      // 👇 CORRECCIÓ CLAU: Afegim 'async' i claus '{}' per no retornar el valor
      // startTransition espera void, no un objecte {success, message}
      startTransition(async () => {
         const result = await togglePostStatusAction(slug, currentStatus);
         if (!result.success) alert(result.message); // Opcional: mostrar error
      });
    }
  };

  const handleDelete = (slug: string) => {
    if (confirm('Estàs segur? Aquesta acció és irreversible.')) {
      // 👇 CORRECCIÓ CLAU
      startTransition(async () => {
         const result = await deletePostAction(slug);
         if (!result.success) alert(result.message);
      });
    }
  };

  return (
    <table className="w-full text-sm text-left">
      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700">
        <tr>
          <th className="px-6 py-4">Títol</th>
          <th className="px-6 py-4">Estat</th>
          <th className="px-6 py-4">Data Publicació</th>
          <th className="px-6 py-4 text-right">Accions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {posts.map((post) => (
          <tr key={post.slug} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td className="px-6 py-4">
              <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{post.title}</div>
              <div className="text-xs text-slate-500 font-mono">{post.slug}</div>
            </td>
            <td className="px-6 py-4">
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                  ${post.published 
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                  }`}
              >
                {post.published ? 'Publicat' : 'Esborrany'}
              </span>
            </td>
            <td className="px-6 py-4 text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {post.date ? new Date(post.date).toLocaleDateString() : '-'}
              </div>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                
                {/* Toggle Status */}
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleToggle(post.slug, post.published)}
                  disabled={isPending}
                  title={post.published ? "Passar a esborrany" : "Publicar"}
                >
                  {post.published 
                    ? <Eye className="w-4 h-4 text-green-600" /> 
                    : <EyeOff className="w-4 h-4 text-slate-400" />
                  }
                </Button>

                {/* Edit Link */}
                <Link href={`/admin/blog/${post.slug}`}>
                    <Button size="icon" variant="ghost" title="Editar detalls">
                    <Edit className="w-4 h-4 text-blue-500" />
                    </Button>
                </Link>

                {/* Delete */}
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleDelete(post.slug)}
                  disabled={isPending}
                  className="hover:bg-red-50 hover:text-red-600"
                  title="Eliminar permanentment"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
        {posts.length === 0 && (
            <tr>
                <td colSpan={4} className="text-center py-8 text-slate-500">No hi ha posts.</td>
            </tr>
        )}
      </tbody>
    </table>
  );
}