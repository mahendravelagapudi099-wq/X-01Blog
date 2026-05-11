import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Helmet } from 'react-helmet-async';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  feature_image: string;
  published_at: string;
  tags: string[];
  reading_time: string;
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (!error) setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Helmet>
        <title>Articles | Mahendra Velagapudi</title>
        <meta name="description" content="Thoughts on AI, Data Science, and Modern Web Development." />
      </Helmet>

      {/* Hero Header */}
      <header className="relative py-24 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] opacity-50" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Latest Insights
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
              Documenting my journey through the cutting edge of technology, from LLMs to high-performance web systems.
            </p>
          </motion.div>

          <div className="mt-12 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search articles or tags..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <Link to={`/post/${post.slug}`} className="block relative h-64 overflow-hidden">
                  <img 
                    src={post.feature_image} 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                    alt={post.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                </Link>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-mono uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(post.published_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.reading_time}</span>
                  </div>

                  <Link to={`/post/${post.slug}`}>
                    <h2 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-slate-400 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags?.map(tag => (
                      <span key={tag} className="text-[10px] px-3 py-1 rounded-full border border-white/10 bg-white/5 uppercase tracking-tighter text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link to={`/post/${post.slug}`} className="inline-flex items-center text-blue-400 text-sm font-bold group-hover:gap-3 transition-all">
                    Read Article <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>

      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-slate-500 text-sm">© 2026 Mahendra Velagapudi. Built with Supabase & React.</p>
      </footer>
    </div>
  );
};

export default Home;
