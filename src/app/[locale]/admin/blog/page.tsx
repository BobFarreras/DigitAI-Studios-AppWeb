import { requireAdmin } from '@/lib/auth/admin-guard';
import { postRepository } from '@/services/container';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Eye, Pencil } from 'lucide-react';

export default async function AdminBlogPage() {
  await requireAdmin();
  const posts = await postRepository.getAllPosts();

  return (
    // 1. SAFEGUARD: overflow-x-hidden al contenidor principal per evitar scroll horitzontal global
    <div className="w-full max-w-[100vw] overflow-x-hidden p-3 sm:p-6 md:p-8">
      
      <div className="max-w-6xl mx-auto w-full">
        {/* CAPÇALERA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-white break-words">Gestió del Blog</h1>
            <p className="text-slate-400 text-sm">
              Total: <span className="text-white font-medium">{posts.length}</span> articles.
            </p>
          </div>
          
          <Link href="/admin/blog/new" className="w-full sm:w-auto">
              <Button className="gradient-bg text-white border-0 w-full">
                  <Plus className="w-4 h-4 mr-2" /> Nou Article
              </Button>
          </Link>
        </div>

        {/* LLISTAT */}
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            // 2. TARGETA: w-full i max-w-full són crítics aquí
            <div 
              key={post.slug} 
              className="w-full max-w-full flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl gap-4"
            >
              
              {/* ZONA INFO: min-w-0 és la màgia que evita el desbordament en Flexbox */}
              <div className="flex items-start gap-3 min-w-0 w-full">
                  {/* Icona */}
                  <div className="shrink-0 p-2 bg-slate-800 rounded-lg text-blue-400">
                      <FileText className="w-5 h-5" />
                  </div>

                  {/* Text: overflow-hidden necessari pel truncate */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                      {/* Títol: truncate talla el text amb punts suspensius (...) */}
                      <h3 className="font-semibold text-slate-200 text-base truncate block w-full">
                          {post.title}
                      </h3>
                      
                      {/* Metadades */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className={`px-2 py-0.5 rounded-full font-bold shrink-0 ${
                              post.published 
                                  ? 'bg-green-500/10 text-green-400' 
                                  : 'bg-yellow-500/10 text-yellow-400'
                          }`}>
                              {post.published ? 'PUB' : 'DRAFT'}
                          </span>
                          <span className="truncate">
                            {new Date(post.date || new Date()).toLocaleDateString()}
                          </span>
                      </div>
                  </div>
              </div>
              
              {/* ZONA ACCIONS: Grid en mòbil per assegurar que els botons ocupen l'ample correcte */}
              <div className="grid grid-cols-[1fr,auto] gap-2 w-full md:w-auto md:flex border-t border-slate-800 pt-3 md:border-0 md:pt-0">
                  <Link href={`/admin/blog/${post.slug}`} className="w-full md:w-auto">
                      <Button variant="secondary" size="sm" className="w-full bg-slate-800 text-slate-300 hover:text-white">
                          <Pencil className="w-3.5 h-3.5 mr-2" /> Editar
                      </Button>
                  </Link>
                  
                  {post.published && (
                      <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-400">
                              <Eye className="w-4 h-4" />
                          </Button>
                      </Link>
                  )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}