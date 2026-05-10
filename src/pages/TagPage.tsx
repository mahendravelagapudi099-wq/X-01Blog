import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag } from 'lucide-react';
import { usePostsByTag } from '@/hooks/useGhost';
import { PostCard, PostCardSkeleton } from '@/components/PostCard';

export function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const { data: posts, isLoading, error } = usePostsByTag(tag!);

  const displayTag = tag?.replace(/-/g, ' ') ?? '';

  return (
    <>
      <Helmet>
        <title>{displayTag} Articles | Mahendra Velagapudi</title>
        <meta name="description" content={`Articles tagged with ${displayTag} by Mahendra Velagapudi.`} />
      </Helmet>

      {/* Header */}
      <section className="mb-10 fade-in">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          All Articles
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center glow-primary">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold capitalize">
            <span className="bg-gradient-primary bg-clip-text text-transparent">{displayTag}</span>
          </h1>
        </div>
        {!isLoading && posts && (
          <p className="text-muted-foreground text-sm ml-[52px]">
            {posts.length} article{posts.length !== 1 ? 's' : ''}
          </p>
        )}
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(n => <PostCardSkeleton key={n} />)}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground text-sm">Could not load posts for this tag.</p>
        </div>
      )}

      {/* Posts */}
      {!isLoading && !error && posts && posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in delay-100">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && posts?.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">No articles in this topic yet.</p>
          <Link
            to="/"
            className="text-sm text-primary hover:underline"
          >
            Browse all articles →
          </Link>
        </div>
      )}
    </>
  );
}
