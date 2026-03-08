import { ArrowLeft, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type Status = 'planned' | 'in-progress' | 'shipped';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: Status;
  votes: number;
  emoji: string;
}

const initialItems: RoadmapItem[] = [
  { id: '1', title: 'Guided journaling prompts', description: 'AI-powered prompts tailored to your mood and patterns.', status: 'in-progress', votes: 42, emoji: '📝' },
  { id: '2', title: 'Sleep stories', description: 'Calming bedtime stories narrated with ambient sounds.', status: 'planned', votes: 67, emoji: '🌙' },
  { id: '3', title: 'Therapist recommendations', description: 'Connect with licensed therapists directly from the app.', status: 'planned', votes: 35, emoji: '🩺' },
  { id: '4', title: 'Widget for home screen', description: 'Quick-access breathing widget without opening the app.', status: 'planned', votes: 89, emoji: '📱' },
  { id: '5', title: 'Community support circles', description: 'Join small groups for shared accountability and support.', status: 'shipped', votes: 54, emoji: '🤝' },
  { id: '6', title: 'Mood insights & AI analysis', description: 'Weekly mood reports powered by AI to spot patterns.', status: 'shipped', votes: 73, emoji: '📊' },
  { id: '7', title: 'Ambient sound mixer', description: 'Mix and match calming sounds to create your own atmosphere.', status: 'shipped', votes: 61, emoji: '🎵' },
  { id: '8', title: 'Apple Watch app', description: 'Breathing exercises and panic button on your wrist.', status: 'planned', votes: 112, emoji: '⌚' },
];

const statusConfig: Record<Status, { label: string; color: string }> = {
  'planned': { label: 'Planned', color: 'bg-muted text-muted-foreground' },
  'in-progress': { label: 'In Progress', color: 'bg-primary/15 text-primary' },
  'shipped': { label: 'Shipped', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

const Roadmap = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialItems);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const handleVote = (id: string) => {
    if (votedIds.has(id)) return;
    setVotedIds(new Set([...votedIds, id]));
    setItems(items.map(item => item.id === id ? { ...item, votes: item.votes + 1 } : item));
  };

  const grouped: Record<Status, RoadmapItem[]> = {
    'in-progress': items.filter(i => i.status === 'in-progress'),
    'planned': items.filter(i => i.status === 'planned').sort((a, b) => b.votes - a.votes),
    'shipped': items.filter(i => i.status === 'shipped'),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-foreground">Roadmap</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        <p className="text-sm text-muted-foreground">Vote on what we build next. Your voice shapes Breeze.</p>

        {(['in-progress', 'planned', 'shipped'] as Status[]).map(status => (
          <section key={status}>
            <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[status].color}`}>
                {statusConfig[status].label}
              </span>
            </h2>
            <div className="space-y-3">
              {grouped[status].map(item => (
                <div key={item.id} className="bg-card rounded-2xl p-4 border border-border flex items-start gap-3">
                  <button
                    onClick={() => handleVote(item.id)}
                    disabled={votedIds.has(item.id) || item.status === 'shipped'}
                    className={`flex flex-col items-center gap-0.5 min-w-[48px] py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      votedIds.has(item.id) ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                    } ${item.status === 'shipped' ? 'opacity-50 cursor-default' : ''}`}
                  >
                    <ThumbsUp size={14} />
                    {item.votes}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">
                      {item.emoji} {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <p className="text-xs text-muted-foreground text-center pt-4">
          Have a feature idea? Share it in the <button onClick={() => navigate('/community')} className="text-primary underline">Breeze Circle</button>.
        </p>
      </div>
    </div>
  );
};

export default Roadmap;
