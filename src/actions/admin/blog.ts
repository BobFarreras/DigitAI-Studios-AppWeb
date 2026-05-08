/**
 * @file src/actions/admin/blog.ts
 * @updated 2026-05-08
 * @summary Server actions per src/actions/admin/blog.ts
 * @scope Operacions de servidor, validacio i orquestracio de capa aplicacio.
 */
'use server';

import { postRepository } from '@/services/container';

export async function getAdminPostDetail(slug: string) {
  const post = await postRepository.getAdminPostBySlug(slug);
  if (!post) return { success: false as const, post: null, socialPosts: [] };

  const socialPosts = await postRepository.getSocialPostsByPostId(post.id);
  return { success: true as const, post, socialPosts };
}

