// src/app/[locale]/admin/blog/page.tsx
import { requireAdmin } from '@/lib/auth/admin-guard';
import { postRepository } from '@/services/container';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
// Importem el llistat client que ja tenim, però el refactoritzarem visualment si calia
// De moment, netegem el contenidor pare.
import { AdminPostList } from '@/features/blog/ui/AdminPostList';

export default async function AdminBlogPage() {
  await requireAdmin();
  const posts = await postRepository.getAllPosts();

  return (
    <div className="space-y-6">
      
      {/* CAPÇALERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Gestió del Blog</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestiona els articles, estats i publicacions ({posts.length} totals).
          </p>
        </div>
        
        <Link href="/admin/blog/new">
            <Button className="gradient-bg text-white shadow-lg border-0">
               <Plus className="w-4 h-4 mr-2" /> Nou Article
            </Button>
        </Link>
      </div>

      {/* LLISTAT (Component Client) */}
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
         <AdminPostList posts={posts} />
      </div>
    </div>
  );
}