import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Tag, TrendingUp, BookOpen, PenLine } from 'lucide-react';
import type { PostOrPage } from '@tryghost/content-api';
import { usePosts, useTags } from '@/hooks/useGhost';
import { PostCard, PostCardSkeleton } from '@/components/PostCard';

export function Home() {
  const { data: posts, isLoading, error } = usePosts();
  const { data: tags } = useTags();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo((): PostOrPage[] => {
    if (!posts) return [];
    let filtered: PostOrPage[] = [...posts];

    if (selectedTag) {
      filtered = filtered.filter(p => p.tags?.some(t => t.slug === selectedTag));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.tags?.some(t => t.name?.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [posts, selectedTag, searchQuery]);

  const featuredPost = useMemo(
    (): PostOrPage | undefined => posts?.find(p => p.featured) ?? posts?.[0],
    [posts]
  );

  const gridPosts = useMemo((): PostOrPage[] => {
    if (!filteredPosts) return [];
    if (!selectedTag && !searchQuery && featuredPost) {
      return filteredPosts.filter(p => p.id !== featuredPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost, selectedTag, searchQuery]);

  const isFiltering = !!selectedTag || !!searchQuery;

  // ── Empty / Coming Soon State ──────────────────────────────────────────────
  const ComingSoon = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center fade-in">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center glow-primary">
          <PenLine className="h-10 w-10 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary animate-ping opacity-40" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-orbitron font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
        First Article Coming Soon
      </h2>
      <p className="text-muted-foreground max-w-md text-sm sm:text-base leading-relaxed mb-8">
        I'm working on my first articles on AI, Data Science, and Web Development.
        Subscribe via RSS to be notified when I publish.
      </p>
      <div className="flex items-center gap-3">
        <a
          href="/rss.xml"
          className="px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all duration-200 hover:glow-primary"
        >
          Subscribe via RSS
        </a>
        <a
          href="https://mahendraa.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl border border-border/50 text-sm font-medium hover:border-primary/40 hover:text-primary transition-all duration-200"
        >
          Visit Portfolio
        </a>
      </div>
    </div>
  );

  const NoResults = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Search className="h-12 w-12 text-muted-foreground/40 mb-4" />
      <h3 className="text-lg font-semibold mb-2">No articles found</h3>
      <p className="text-muted-foreground text-sm mb-6">
        Try a different tag or search term
      </p>
      <button
        onClick={() => { setSelectedTag(null); setSearchQuery(''); }}
        className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm hover:bg-primary/20 transition-all duration-200"
      >
        Clear filters
      </button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Articles | Mahendra Velagapudi</title>
        <meta name="description" content="Insights, tutorials, and thoughts on AI, Data Science, and Web Development." />
      </Helmet>

      {/* Hero */}
      <section className="mb-12 sm:mb-16 fade-in">
        <div className="flex items-center gap-2 text-xs font-medium text-primary mb-4 tracking-wider uppercase">
          <TrendingUp className="h-3.5 w-3.5" />
          Latest Insights
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-orbitron font-bold mb-4 leading-tight">
          <span className="bg-gradient-primary bg-clip-text text-transparent">Articles</span>
          <br />
          <span className="text-foreground/80 text-3xl sm:text-4xl md:text-5xl font-normal">& Thoughts</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed">
          Deep dives into AI, Data Science, and modern Web Development. No fluff — just signal.
        </p>

        {/* Stats bar */}
        {posts && posts.length > 0 && (
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 text-primary" />
              <span><span className="text-foreground font-medium">{posts.length}</span> articles</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4 text-secondary" />
              <span><span className="text-foreground font-medium">{tags?.length ?? 0}</span> topics</span>
            </div>
          </div>
        )}
      </section>

      {/* Search + Tag Filters */}
      {(posts && posts.length > 0) && (
        <section className="mb-10 fade-in delay-100">
          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full sm:max-w-sm pl-10 pr-4 py-2.5 rounded-xl border border-border/50 bg-background/60 backdrop-blur text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200 placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Tag Pills */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  !selectedTag
                    ? 'bg-primary text-background border-primary glow-primary'
                    : 'border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary'
                }`}
              >
                All
              </button>
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(selectedTag === tag.slug ? null : tag.slug ?? null)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border flex items-center gap-1.5 ${
                    selectedTag === tag.slug
                      ? 'bg-secondary/20 text-secondary border-secondary/50 glow-secondary'
                      : 'border-border/50 text-muted-foreground hover:border-secondary/50 hover:text-secondary'
                  }`}
                >
                  {tag.name}
                  {(tag as any).count?.posts !== undefined && (
                    <span className="text-xs opacity-60">({(tag as any).count.posts})</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-8">
          <div className="glass-card h-64 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(n => <PostCardSkeleton key={n} />)}
          </div>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="glass-card p-8 text-center border-destructive/30">
          <h2 className="text-xl font-semibold text-destructive mb-2">Couldn't load articles</h2>
          <p className="text-muted-foreground text-sm">Ghost CMS is not connected yet. Check your .env config.</p>
        </div>
      )}

      {/* No posts at all → Coming Soon */}
      {!isLoading && !error && posts?.length === 0 && <ComingSoon />}

      {/* Posts loaded */}
      {!isLoading && !error && posts && posts.length > 0 && (
        <>
          {/* Featured post (only on unfiltered homepage) */}
          {!isFiltering && featuredPost && (
            <section className="mb-8 fade-in delay-200">
              <PostCard post={featuredPost} featured />
            </section>
          )}

          {/* Grid */}
          {gridPosts.length === 0 ? (
            <NoResults />
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in delay-300">
              {gridPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </section>
          )}
        </>
      )}
    </>
  );
}
