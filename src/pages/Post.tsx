import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Share2, Tag, Bookmark, Github, Twitter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BlockRenderer, Block } from '@/components/BlockRenderer';
import { Helmet } from 'react-helmet-async';

interface Post {
  title: string;
  excerpt: string;
  feature_image: string;
  published_at: string;
  reading_time: string;
  blocks: Block[];
  tags: string[];
}

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) navigate('/');
      else setPost(data);
      setLoading(false);
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      <Helmet>
        <title>{post.title} | Mahendra's Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 z-50 origin-left" style={{ scaleX }} />

      {/* Navigation Floating */}
      <nav className="fixed top-0 w-full z-40 backdrop-blur-md bg-[#020617]/50 border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Feed
          </Link>
          <div className="flex gap-4">
            <button className="text-slate-400 hover:text-white transition-colors"><Share2 className="h-4 w-4" /></button>
            <button className="text-slate-400 hover:text-white transition-colors"><Bookmark className="h-4 w-4" /></button>
          </div>
        </div>
      </nav>

      <article className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 font-mono">
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(post.published_at).toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {post.reading_time} read</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-10 leading-[1.1] text-white">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags?.map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-slate-400 uppercase tracking-widest">
                #{tag}
              </span>
            ))}
          </div>

          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            <img src={post.feature_image} className="w-full h-full object-cover" alt="" />
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <BlockRenderer blocks={post.blocks} />
        </div>

        {/* Author Footer */}
        <footer className="mt-24 pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white/[0.02] p-10 rounded-3xl border border-white/5">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0" />
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Mahendra Velagapudi</h3>
              <p className="text-slate-400 mb-6 max-w-lg">
                Full-stack developer and AI enthusiast exploring the future of computing. Always building, always learning.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <button className="text-slate-400 hover:text-white transition-colors"><Github className="h-5 w-5" /></button>
                <button className="text-slate-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default PostPage;
