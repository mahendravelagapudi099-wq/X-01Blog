import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft, Rss, ExternalLink } from 'lucide-react';

export function Layout() {
  const location = useLocation();
  const isPostPage = location.pathname.startsWith('/post/');

  return (
    <div className="min-h-screen bg-background font-inter text-foreground">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isPostPage && (
              <Link
                to="/"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                All Articles
              </Link>
            )}
            {!isPostPage && (
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-orbitron font-bold text-sm glow-primary">
                    M
                  </div>
                </div>
                <div>
                  <span className="font-orbitron font-bold text-lg tracking-tight bg-gradient-primary bg-clip-text text-transparent">
                    Articles
                  </span>
                  <span className="text-muted-foreground text-xs block leading-none">by Mahendra</span>
                </div>
              </Link>
            )}
          </div>

          <nav className="flex items-center gap-2 sm:gap-4">
            <a
              href="https://mahendraa.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Portfolio</span>
            </a>
            <a
              href="/rss.xml"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200"
              title="RSS Feed"
            >
              <Rss className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">RSS</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-bold text-xs">
                M
              </div>
              <span className="text-sm text-muted-foreground">
                Mahendra Velagapudi · Articles
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="https://mahendraa.dev" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Portfolio
              </a>
              <a href="https://github.com/mahendravelagapudi099-wq" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                GitHub
              </a>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
