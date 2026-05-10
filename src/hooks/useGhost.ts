import { useQuery } from '@tanstack/react-query';
import { ghostClient } from '@/lib/ghost';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      ghostClient.posts.browse({
        limit: 'all',
        include: ['tags', 'authors'],
        order: 'published_at DESC',
      }),
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () =>
      ghostClient.posts.read(
        { slug },
        { include: ['tags', 'authors'] }
      ),
    enabled: !!slug,
  });
}

export function usePostsByTag(tag: string) {
  return useQuery({
    queryKey: ['posts', 'tag', tag],
    queryFn: () =>
      ghostClient.posts.browse({
        limit: 'all',
        include: ['tags', 'authors'],
        filter: `tag:${tag}`,
        order: 'published_at DESC',
      }),
    enabled: !!tag,
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () =>
      ghostClient.tags.browse({
        limit: 'all',
        include: ['count.posts'],
        order: 'count.posts DESC',
      }),
  });
}
