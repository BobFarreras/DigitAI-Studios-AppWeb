import { requireAdmin } from '@/lib/auth/admin-guard';
import { postRepository } from '@/services/container';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AdminPostList } from '@/features/blog/ui/AdminPostList';

// ✅ 1. Definim el tipus com a Promise
interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminBlogPage(props: PageProps) {
  await requireAdmin();

  // ✅ 2. Fem 'await' per desenpaquetar els paràmetres
  const searchParams = await props.searchParams;

  // ✅ 3. Ara ja podem accedir a les propietats de forma segura
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;

  // 4. La resta continua igual...
  const { posts, total } = await postRepository.getPaginatedPosts(page, pageSize);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      
      {/* CAPÇALERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Gestió del Blog</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Mostrant {posts.length} de {total} articles totals.
          </p>
        </div>
        
        <Link href="/admin/blog/new">
            <Button className="gradient-bg text-white shadow-lg border-0">
               <Plus className="w-4 h-4 mr-2" /> Nou Article
            </Button>
        </Link>
      </div>

      {/* LLISTAT I PAGINACIÓ */}
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm flex flex-col">
         <AdminPostList 
            posts={posts} 
            currentPage={page} 
            totalPages={totalPages} 
         />
      </div>
    </div>
  );
}