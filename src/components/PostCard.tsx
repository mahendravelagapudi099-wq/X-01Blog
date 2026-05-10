import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import type { PostOrPage } from '@tryghost/content-api';

interface PostCardProps {
  post: PostOrPage;
  featured?: boolean;
}

function readingTime(html: string | null | undefined): string {
  if (!html) return '1 min read';
  const wordCount = html.replace(/<[^>]+>/g, '').split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(wordCount / 200));
  return `${mins} min read`;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link to={`/post/${post.slug}`} className="group block">
        <article className="relative glass-card overflow-hidden hover:glow-secondary transition-all duration-500 hover:scale-[1.01]">
          <div className="flex flex-col md:flex-row">
            {post.feature_image && (
              <div className="md:w-2/5 h-56 md:h-auto overflow-hidden">
                <img
                  src={post.feature_image}
                  alt={post.title ?? ''}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {post.featured && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
                    ★ Featured
                  </span>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags?.slice(0, 3).map(tag => (
                    <span
                      key={tag.id}
                      className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl sm:text-3xl font-orbitron font-bold mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-muted-foreground line-clamp-3 text-sm sm:text-base leading-relaxed">
                  {post.custom_excerpt || post.excerpt}
                </p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {readingTime(post.html)}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all duration-200">
                  Read <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/post/${post.slug}`} className="group block h-full">
      <article className="glass-card overflow-hidden hover:glow-secondary transition-all duration-500 hover:scale-[1.02] h-full flex flex-col">
        {post.feature_image && (
          <div className="h-44 overflow-hidden">
            <img
              src={post.feature_image}
              alt={post.title ?? ''}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags?.slice(0, 2).map(tag => (
              <span
                key={tag.id}
                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <h3 className="font-orbitron font-semibold text-base mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-snug">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 flex-1 leading-relaxed">
            {post.custom_excerpt || post.excerpt}
          </p>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : ''}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime(post.html)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="h-44 bg-muted/30" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-muted/30 rounded-full" />
          <div className="h-5 w-20 bg-muted/30 rounded-full" />
        </div>
        <div className="h-4 bg-muted/30 rounded w-3/4" />
        <div className="h-4 bg-muted/30 rounded w-full" />
        <div className="h-4 bg-muted/30 rounded w-5/6" />
      </div>
    </div>
  );
}

export function TagFilterSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {[1,2,3,4,5].map(n => (
        <div key={n} className="h-8 w-20 bg-muted/30 rounded-full animate-pulse" />
      ))}
    </div>
  );
}
