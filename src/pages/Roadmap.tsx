import { ArrowLeft, ThumbsUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Status = 'under_consideration' | 'planned' | 'in_progress' | 'released';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: Status;
  emoji: string;
  vote_count: number;
  user_voted: boolean;
}

const statusConfig: Record<Status, { label: string; emoji: string; color: string }> = {
  under_consideration: { label: 'Under Consideration', emoji: '💭', color: 'bg-muted text-muted-foreground border-border' },
  planned: { label: 'Planned', emoji: '📋', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  in_progress: { label: 'In Progress', emoji: '🚧', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
  released: { label: 'Released', emoji: '✅', color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' },
};

const columns: Status[] = ['under_consideration', 'planned', 'in_progress', 'released'];

const Roadmap = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingIds, setVotingIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      const { data: roadmapItems, error } = await supabase
        .from('roadmap_items')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to load roadmap:', error);
        setLoading(false);
        return;
      }

      // Get vote counts
      const { data: votes } = await supabase
        .from('roadmap_votes')
        .select('item_id, user_id');

      const voteCounts: Record<string, number> = {};
      const userVotes = new Set<string>();
      (votes ?? []).forEach(v => {
        voteCounts[v.item_id] = (voteCounts[v.item_id] || 0) + 1;
        if (user && v.user_id === user.id) userVotes.add(v.item_id);
      });

      setItems((roadmapItems ?? []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: item.status as Status,
        emoji: item.emoji,
        vote_count: voteCounts[item.id] || 0,
        user_voted: userVotes.has(item.id),
      })));
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleVote = async (itemId: string) => {
    if (!userId) {
      toast.info('Sign in to vote on features', { duration: 3000 });
      return;
    }
    if (votingIds.has(itemId)) return;

    const item = items.find(i => i.id === itemId);
    if (!item) return;

    setVotingIds(prev => new Set([...prev, itemId]));

    if (item.user_voted) {
      // Remove vote
      const { error } = await supabase
        .from('roadmap_votes')
        .delete()
        .eq('item_id', itemId)
        .eq('user_id', userId);

      if (!error) {
        setItems(prev => prev.map(i => i.id === itemId
          ? { ...i, vote_count: i.vote_count - 1, user_voted: false }
          : i
        ));
      }
    } else {
      // Add vote
      const { error } = await supabase
        .from('roadmap_votes')
        .insert({ item_id: itemId, user_id: userId });

      if (!error) {
        setItems(prev => prev.map(i => i.id === itemId
          ? { ...i, vote_count: i.vote_count + 1, user_voted: true }
          : i
        ));
      }
    }

    setVotingIds(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const grouped = columns.reduce((acc, status) => {
    acc[status] = items
      .filter(i => i.status === status)
      .sort((a, b) => b.vote_count - a.vote_count);
    return acc;
  }, {} as Record<Status, RoadmapItem[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Roadmap</h1>
          <p className="text-xs text-muted-foreground">Vote on what we build next</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
        </div>
      ) : (
        <>
          {/* Mobile: stacked columns */}
          <div className="md:hidden max-w-2xl mx-auto px-4 py-5 space-y-6">
            {columns.map(status => (
              <ColumnSection
                key={status}
                status={status}
                items={grouped[status]}
                onVote={handleVote}
                votingIds={votingIds}
              />
            ))}
          </div>

          {/* Desktop: horizontal Kanban */}
          <div className="hidden md:flex gap-4 px-4 py-5 overflow-x-auto max-w-7xl mx-auto">
            {columns.map(status => (
              <div key={status} className="flex-1 min-w-[260px]">
                <ColumnSection
                  status={status}
                  items={grouped[status]}
                  onVote={handleVote}
                  votingIds={votingIds}
                />
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-xs text-muted-foreground text-center py-6 px-4">
        Have a feature idea? Share it in the{' '}
        <button onClick={() => navigate('/community')} className="text-primary underline">
          Breeze Circle
        </button>.
      </p>
    </div>
  );
};

const ColumnSection = ({
  status,
  items,
  onVote,
  votingIds,
}: {
  status: Status;
  items: RoadmapItem[];
  onVote: (id: string) => void;
  votingIds: Set<string>;
}) => {
  const config = statusConfig[status];

  return (
    <section>
      <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-xl border ${config.color}`}>
        <span>{config.emoji}</span>
        <h2 className="text-sm font-semibold">{config.label}</h2>
        <span className="ml-auto text-xs opacity-70">{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6 italic">No items yet</p>
        )}
        {items.map(item => (
          <div
            key={item.id}
            className="bg-card rounded-xl p-3 border border-border flex items-start gap-3 hover:shadow-sm transition-shadow"
          >
            <button
              onClick={() => onVote(item.id)}
              disabled={votingIds.has(item.id) || status === 'released'}
              className={`flex flex-col items-center gap-0.5 min-w-[44px] py-1.5 rounded-lg text-xs font-semibold transition-all ${
                item.user_voted
                  ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              } ${status === 'released' ? 'opacity-50 cursor-default' : 'cursor-pointer'}`}
            >
              <ThumbsUp size={13} className={item.user_voted ? 'fill-current' : ''} />
              {item.vote_count}
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm leading-snug">
                {item.emoji} {item.title}
              </p>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Roadmap;
