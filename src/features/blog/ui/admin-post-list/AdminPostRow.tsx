/**
 * @file src/features/blog/ui/admin-post-list/AdminPostRow.tsx
 * @updated 2026-05-09
 * @summary Fila de taula d'article admin amb accions.
 * @scope Render de cel·les i gestio d'interaccions de la fila.
 */
'use client';

import { BlogPostDTO } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, EyeOff, Calendar, CheckCircle2, Share2 } from 'lucide-react';
import { Link } from '@/routing';
import { cn } from '@/lib/utils';
import { formatPostDate, getSocialStatus } from './utils';

interface Props {
  post: BlogPostDTO;
  isPending: boolean;
  onRowClick: (slug: string) => void;
  onToggle: (e: React.MouseEvent, slug: string, currentStatus: boolean) => void;
  onDelete: (e: React.MouseEvent, slug: string) => void;
}

export function AdminPostRow({ post, isPending, onRowClick, onToggle, onDelete }: Props) {
  const socialStatus = getSocialStatus(post.social_posts);
  const socialCount = post.social_posts?.length || 0;

  return (
    <tr key={post.slug} onClick={() => onRowClick(post.slug)} className="hover:bg-muted/50 transition-colors group cursor-pointer">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{post.title}</div>
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
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
            post.published ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
          )}
        >
          {post.published ? 'Publicat' : 'Esborrany'}
        </span>
      </td>

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

      <td className="px-6 py-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 opacity-70" />
          {formatPostDate(post.date)}
        </div>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => onToggle(e, post.slug, post.published)}
            disabled={isPending}
            className="hover:bg-background hover:text-foreground relative z-10"
            title={post.published ? 'Despublicar' : 'Publicar'}
          >
            {post.published ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
          </Button>
          <Link href={`/admin/blog/${post.slug}`} onClick={(e) => e.stopPropagation()}>
            <Button size="icon" variant="ghost" className="hover:bg-background hover:text-blue-500 relative z-10" title="Editar">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => onDelete(e, post.slug)}
            disabled={isPending}
            className="hover:bg-red-500/10 hover:text-red-500 relative z-10"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
