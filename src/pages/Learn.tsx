import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articles, type Article } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';

const Learn = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (selectedArticle) {
    return <ArticleView article={selectedArticle} onBack={() => setSelectedArticle(null)} />;
  }

  const categories = ['Understanding Anxiety', 'The Science', 'Coping Tools', 'Getting Help'] as const;

  return (
    <div className="py-grid-4">
      <h1 className="text-2xl font-semibold text-foreground mb-grid-3">Learn</h1>
      {categories.map(cat => {
        const catArticles = articles.filter(a => a.category === cat);
        if (catArticles.length === 0) return null;
        return (
          <div key={cat} className="mb-grid-4">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-grid-2">{cat}</h2>
            <div className="flex flex-col gap-grid-2">
              {catArticles.map(article => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-card rounded-card p-grid-2 card-shadow text-left min-h-[48px] w-full"
                >
                  <p className="text-base font-medium text-foreground">{article.title}</p>
                  <div className="flex items-center gap-grid mt-1">
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{article.category}</span>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ArticleView = ({ article, onBack }: { article: Article; onBack: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-background overflow-y-auto">
      <div className="max-w-[600px] mx-auto px-grid-2 py-grid-3">
        <button
          onClick={onBack}
          className="flex items-center gap-grid text-primary mb-grid-3 min-h-[48px]"
          aria-label="Back to articles"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{article.category}</span>
        <h1 className="text-2xl font-semibold text-foreground mt-grid mb-grid">{article.title}</h1>
        <p className="text-xs text-muted-foreground mb-grid-3">{article.readTime}</p>
        
        {article.hasMedDisclaimer && (
          <div className="bg-accent/10 border border-accent/30 rounded-card p-grid-2 mb-grid-3">
            <p className="text-sm text-foreground">
              ⚕️ This information is educational. Always consult your doctor before starting, stopping, or changing medication.
            </p>
          </div>
        )}

        <div className="prose prose-sm max-w-none text-foreground">
          {article.content.split('\n\n').map((block, i) => renderBlock(block, i))}
        </div>

        {article.sources && article.sources.length > 0 && (
          <div className="mt-grid-3 border-t border-border pt-grid-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-grid">Sources & References</p>
            <ul className="space-y-1">
              {article.sources.map((src, i) => (
                <li key={i}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary/80 hover:text-primary underline leading-relaxed"
                  >
                    📎 {src.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onBack}
          className="w-full mt-grid-4 mb-grid-3 py-grid-2 rounded-button bg-primary text-primary-foreground font-semibold min-h-[48px] text-base"
        >
          Done
        </button>
      </div>
    </div>
  );
};

function renderBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
  );
}

type Segment =
  | { type: 'text'; content: string }
  | { type: 'italic'; content: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'numbered'; items: string[] };

function renderBlock(block: string, key: number): React.ReactNode {
  const lines = block.split('\n').filter(l => l.trim() !== '');
  if (lines.length === 0) return null;

  // Pure single-line bold header: **Text**
  if (lines.length === 1 && block.startsWith('**') && block.endsWith('**')) {
    return (
      <h3 key={key} className="text-base font-semibold text-foreground mt-grid-3 mb-grid">
        {block.replace(/\*\*/g, '')}
      </h3>
    );
  }

  // Group lines into segments
  const segments: Segment[] = [];

  for (const line of lines) {
    if (line.startsWith('- ')) {
      const last = segments[segments.length - 1];
      if (last?.type === 'bullets') {
        last.items.push(line.slice(2));
      } else {
        segments.push({ type: 'bullets', items: [line.slice(2)] });
      }
    } else if (/^\d+\.\s/.test(line)) {
      const last = segments[segments.length - 1];
      if (last?.type === 'numbered') {
        last.items.push(line.replace(/^\d+\.\s+/, ''));
      } else {
        segments.push({ type: 'numbered', items: [line.replace(/^\d+\.\s+/, '')] });
      }
    } else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
      segments.push({ type: 'italic', content: line.slice(1, -1) });
    } else {
      segments.push({ type: 'text', content: line });
    }
  }

  // Single plain paragraph — keep it simple
  if (segments.length === 1 && segments[0].type === 'text') {
    return (
      <p key={key} className="text-sm leading-relaxed text-foreground/90 mb-grid-2">
        {renderBold(segments[0].content)}
      </p>
    );
  }

  return (
    <div key={key} className="mb-grid-2">
      {segments.map((seg, j) => {
        if (seg.type === 'bullets') {
          return (
            <ul key={j} className="list-disc list-inside space-y-1 mt-1 mb-1 text-sm leading-relaxed text-foreground/90">
              {seg.items.map((item, k) => <li key={k}>{renderBold(item)}</li>)}
            </ul>
          );
        }
        if (seg.type === 'numbered') {
          return (
            <ol key={j} className="list-decimal list-inside space-y-1 mt-1 mb-1 text-sm leading-relaxed text-foreground/90">
              {seg.items.map((item, k) => <li key={k}>{renderBold(item)}</li>)}
            </ol>
          );
        }
        if (seg.type === 'italic') {
          return (
            <p key={j} className="text-sm italic text-foreground/80 mb-1">
              {renderBold(seg.content)}
            </p>
          );
        }
        return (
          <p key={j} className="text-sm leading-relaxed text-foreground/90 mb-1">
            {renderBold(seg.content)}
          </p>
        );
      })}
    </div>
  );
}

export default Learn;
