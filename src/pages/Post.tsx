import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePost } from '@/hooks/useGhost';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Check } from 'lucide-react';

function readingTime(html: string | null | undefined): string {
  if (!html) return '1 min read';
  const wordCount = html.replace(/<[^>]+>/g, '').split(/\s+/).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

export function Post() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = usePost(slug!);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-8 py-4">
        <div className="h-8 w-2/3 bg-muted/30 rounded" />
        <div className="h-5 w-1/3 bg-muted/30 rounded" />
        <div className="h-72 bg-muted/30 rounded-2xl" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} className={`h-4 bg-muted/30 rounded ${n % 3 === 0 ? 'w-4/5' : 'w-full'}`} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="glass-card p-10">
          <h2 className="text-2xl font-orbitron font-bold text-destructive mb-3">Post Not Found</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            The article you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm hover:bg-primary/20 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Mahendra's Articles</title>
        <meta name="description" content={post.custom_excerpt || post.excerpt || ''} />
        {post.og_image && <meta property="og:image" content={post.og_image} />}
        {post.feature_image && !post.og_image && (
          <meta property="og:image" content={post.feature_image} />
        )}
      </Helmet>

      {/* Reading progress bar */}
      <div
        className="fixed top-16 left-0 z-50 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <article className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-10 fade-in">
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags?.map(tag => (
              <Link
                key={tag.id}
                to={`/tag/${tag.slug}`}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <Tag className="h-3 w-3" />
                {tag.name}
              </Link>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {post.custom_excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-6 border-l-2 border-primary/40 pl-4">
              {post.custom_excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border/30">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {post.primary_author?.profile_image && (
                <img
                  src={post.primary_author.profile_image}
                  alt={post.primary_author.name ?? ''}
                  className="w-8 h-8 rounded-full object-cover border border-border/50"
                />
              )}
              <span className="font-medium text-foreground">
                {post.primary_author?.name ?? 'Mahendra'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {post.published_at ? format(new Date(post.published_at), 'MMMM d, yyyy') : ''}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readingTime(post.html)}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-border/50 hover:border-primary/40"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </header>

        {/* Feature image */}
        {post.feature_image && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl fade-in delay-100">
            <img
              src={post.feature_image}
              alt={post.title ?? ''}
              className="w-full h-auto object-cover max-h-[480px]"
            />
          </div>
        )}

        {/* Body */}
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-orbitron prose-headings:font-bold
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-code:text-secondary prose-code:bg-muted/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-muted/20 prose-pre:border prose-pre:border-border/30 prose-pre:rounded-xl
            prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
            prose-img:rounded-xl prose-img:shadow-lg
            prose-hr:border-border/30
            fade-in delay-200"
          dangerouslySetInnerHTML={{ __html: post.html || '' }}
        />

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-border/30 fade-in delay-300">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to all articles
          </Link>
        </div>
      </article>
    </>
  );
}
