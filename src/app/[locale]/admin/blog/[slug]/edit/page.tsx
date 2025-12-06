// src/app/[locale]/admin/blog/[slug]/edit/page.tsx

import { requireAdmin } from '@/lib/auth/admin-guard';
import { postRepository } from '@/services/container';
import { notFound } from 'next/navigation';
import { EditPostForm } from '@/features/blog/ui/EditPostForm'; // 👈 El component que acabem de fer

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function EditPostPage({ params }: Props) {
    await requireAdmin();
    const { slug } = await params;

    // Busquem el post (incloent esborranys)
    const post = await postRepository.getAdminPostBySlug(slug);

    if (!post) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <EditPostForm post={post} />
        </div>
    );
}