import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';

export type Block = 
  | { type: 'text'; content: string }
  | { type: 'code'; code: string; language: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'heading'; text: string; level: 1 | 2 | 3 }
  | { type: 'quote'; text: string; author?: string };

interface BlockRendererProps {
  blocks: Block[];
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
        >
          {renderBlock(block)}
        </motion.div>
      ))}
    </div>
  );
};

const renderBlock = (block: Block) => {
  switch (block.type) {
    case 'heading':
      const headingClass = "text-3xl font-bold font-orbitron my-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent";
      switch (block.level) {
        case 1: return <h1 className={headingClass}>{block.text}</h1>;
        case 3: return <h3 className={headingClass}>{block.text}</h3>;
        default: return <h2 className={headingClass}>{block.text}</h2>;
      }
    case 'text':
      return <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">{block.content}</p>;
    case 'code':
      return (
        <div className="rounded-xl overflow-hidden border border-white/10 my-8 shadow-2xl">
          <SyntaxHighlighter language={block.language} style={vscDarkPlus} customStyle={{ margin: 0, padding: '20px' }}>
            {block.code}
          </SyntaxHighlighter>
        </div>
      );
    case 'image':
      return (
        <figure className="my-10">
          <img src={block.url} alt={block.caption} className="rounded-2xl w-full border border-white/5 shadow-inner" />
          {block.caption && <figcaption className="text-center text-sm text-slate-500 mt-4 italic">{block.caption}</figcaption>}
        </figure>
      );
    case 'quote':
      return (
        <blockquote className="border-l-4 border-blue-500 pl-6 my-10 italic">
          <p className="text-2xl text-slate-100 mb-2">"{block.text}"</p>
          {block.author && <cite className="text-blue-400">— {block.author}</cite>}
        </blockquote>
      );
    default: return null;
  }
};
