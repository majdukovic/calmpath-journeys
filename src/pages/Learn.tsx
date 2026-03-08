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
          {article.content.split('\n\n').map((block, i) => {
            if (block.startsWith('**') && block.endsWith('**')) {
              return <h3 key={i} className="text-base font-semibold text-foreground mt-grid-3 mb-grid">{block.replace(/\*\*/g, '')}</h3>;
            }
            if (block.startsWith('- ')) {
              const items = block.split('\n').filter(l => l.startsWith('- '));
              return (
                <ul key={i} className="list-disc list-inside space-y-1 mb-grid-2 text-sm leading-relaxed text-foreground/90">
                  {items.map((item, j) => (
                    <li key={j}>{renderBold(item.slice(2))}</li>
                  ))}
                </ul>
              );
            }
            if (block.startsWith('*') && !block.startsWith('**')) {
              // Italic intro lines
              const lines = block.split('\n');
              return (
                <div key={i} className="mb-grid-2">
                  {lines.map((line, j) => {
                    const cleaned = line.replace(/^\*/, '').replace(/\*$/, '');
                    if (line.startsWith('*') && line.endsWith('*')) {
                      return <p key={j} className="text-sm italic text-foreground/80 mb-1">{renderBold(cleaned)}</p>;
                    }
                    return <p key={j} className="text-sm leading-relaxed text-foreground/90 mb-1">{renderBold(line)}</p>;
                  })}
                </div>
              );
            }
            return (
              <p key={i} className="text-sm leading-relaxed text-foreground/90 mb-grid-2">
                {renderBold(block)}
              </p>
            );
          })}
        </div>

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

export default Learn;
