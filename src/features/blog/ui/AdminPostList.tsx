/**
 * @file src/features/blog/ui/AdminPostList.tsx
 * @updated 2026-05-09
 * @summary Taula administrativa d'articles del blog amb accions.
 * @scope Orquestracio de callbacks UI i composicio de files/paginacio.
 */
'use client';

import { useTransition } from 'react';
import { useRouter } from '@/routing';
import { togglePostStatusAction, deletePostAction } from '../actions/admin-actions';
import { AdminPostPagination } from './admin-post-list/AdminPostPagination';
import { AdminPostRow } from './admin-post-list/AdminPostRow';
import { AdminPostListProps } from './admin-post-list/types';

export function AdminPostList({ posts, currentPage, totalPages }: AdminPostListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRowClick = (slug: string) => router.push(`/admin/blog/${slug}`);
  const handlePageChange = (newPage: number) => router.push(`/admin/blog?page=${newPage}`);

  const handleToggle = (e: React.MouseEvent, slug: string, currentStatus: boolean) => {
    e.stopPropagation();
    if (confirm(`Vols canviar l'estat a ${!currentStatus ? 'PUBLICAT' : 'ESBORRANY'}?`)) {
      startTransition(async () => {
        await togglePostStatusAction(slug, currentStatus);
      });
    }
  };

  const handleDelete = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    if (confirm("Estàs segur?")) {
      startTransition(async () => {
        await deletePostAction(slug);
      });
    }
  };

  return (
    <div className="flex flex-col min-h-150">
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
            {posts.map((post) => (
              <AdminPostRow
                key={post.slug}
                post={post}
                isPending={isPending}
                onRowClick={handleRowClick}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
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
      <AdminPostPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
