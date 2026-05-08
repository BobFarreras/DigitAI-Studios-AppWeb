'use server';

import { postRepository } from '@/services/container';

export async function getAdminPostDetail(slug: string) {
  const post = await postRepository.getAdminPostBySlug(slug);
  if (!post) return { success: false as const, post: null, socialPosts: [] };

  const socialPosts = await postRepository.getSocialPostsByPostId(post.id);
  return { success: true as const, post, socialPosts };
}
