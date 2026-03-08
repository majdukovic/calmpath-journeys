import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, MessageSquare, Check, Clock, Sparkles, Rocket, ArrowLeft } from 'lucide-react';
import appIcon from '/app-icon.png';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'shipped' | 'building' | 'planned' | 'considering';
  votes: number;
  category: string;
}

const roadmapData: RoadmapItem[] = [
  // Shipped
  { id: '1', title: 'SOS Panic Relief', description: '2-tap access to guided breathing during panic attacks', status: 'shipped', votes: 847, category: 'Core' },
  { id: '2', title: 'Gratitude Journal', description: 'Daily gratitude prompts with mood tracking', status: 'shipped', votes: 623, category: 'Journal' },
  { id: '3', title: 'Growth Garden', description: 'Visual garden that grows with your calm streaks', status: 'shipped', votes: 512, category: 'Engagement' },
  { id: '4', title: 'AI Mood Insights', description: 'Weekly AI-powered analysis of your mood patterns', status: 'shipped', votes: 489, category: 'Plus' },
  { id: '5', title: 'Breeze Circle Community', description: 'Anonymous, AI-moderated community for support', status: 'shipped', votes: 734, category: 'Plus' },
  { id: '6', title: 'Dark Mode', description: 'Beautiful dark theme for night use', status: 'shipped', votes: 921, category: 'Design' },
  // Building
  { id: '7', title: 'Sleep Stories', description: 'Calming audio stories narrated by AI to help you drift off', status: 'building', votes: 1203, category: 'Plus' },
  { id: '8', title: 'Anxiety Patterns Detector', description: 'AI identifies your anxiety triggers from journal entries', status: 'building', votes: 987, category: 'Plus' },
  // Planned
  { id: '9', title: 'Apple Watch Companion', description: 'Quick breathing exercises from your wrist + heart rate integration', status: 'planned', votes: 1567, category: 'Platform' },
  { id: '10', title: 'Guided CBT Exercises', description: 'Interactive cognitive behavioral therapy exercises', status: 'planned', votes: 876, category: 'Core' },
  { id: '11', title: 'Family & Friends Mode', description: 'Share your progress with trusted people', status: 'planned', votes: 654, category: 'Social' },
  // Considering
  { id: '12', title: 'Wearable Integration', description: 'Connect Fitbit, Garmin, Oura to correlate stress data', status: 'considering', votes: 432, category: 'Platform' },
  { id: '13', title: 'Therapist Dashboard', description: 'Share your Breeze data with your therapist', status: 'considering', votes: 389, category: 'Pro' },
  { id: '14', title: 'Group Breathing Sessions', description: 'Live group breathing with other Breeze users', status: 'considering', votes: 298, category: 'Social' },
];

const statusConfig = {
  shipped: { label: '✅ Shipped', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', dotColor: 'bg-emerald-500' },
  building: { label: '🔨 Building Now', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', dotColor: 'bg-amber-500' },
  planned: { label: '📋 Planned', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', dotColor: 'bg-blue-500' },
  considering: { label: '💭 Considering', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', dotColor: 'bg-purple-500' },
};

const Roadmap = () => {
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('all');
  const [items, setItems] = useState(roadmapData);

  const handleVote = (id: string) => {
    if (votedItems.has(id)) return;
    setVotedItems(prev => new Set(prev).add(id));
    setItems(prev => prev.map(item => item.id === id ? { ...item, votes: item.votes + 1 } : item));
  };

  const statuses: Array<RoadmapItem['status']> = ['building', 'planned', 'considering', 'shipped'];
  const filteredItems = filter === 'all' ? items : items.filter(i => i.status === filter);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={appIcon} alt="Breeze" className="w-8 h-8 rounded-xl" />
            <span className="text-lg font-bold text-foreground">Breeze</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Home</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <Rocket size={12} />
            Built in Public
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            What we're building next
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Breeze is built by one person, for millions. Vote on what matters to you — your voice directly shapes what gets built.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            All
          </button>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === s ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              {statusConfig[s].label}
            </button>
          ))}
        </div>

        {/* Roadmap cards */}
        <div className="space-y-3">
          {statuses.filter(s => filter === 'all' || filter === s).map(status => {
            const statusItems = filteredItems
              .filter(i => i.status === status)
              .sort((a, b) => b.votes - a.votes);
            if (statusItems.length === 0) return null;

            return (
              <div key={status}>
                <div className="flex items-center gap-2 mb-3 mt-8 first:mt-0">
                  <div className={`w-2.5 h-2.5 rounded-full ${statusConfig[status].dotColor}`} />
                  <h2 className="text-lg font-semibold text-foreground">{statusConfig[status].label}</h2>
                  <span className="text-xs text-muted-foreground">({statusItems.length})</span>
                </div>
                <div className="space-y-2">
                  {statusItems.map(item => (
                    <div key={item.id} className="bg-card rounded-2xl p-4 border border-border hover:border-primary/20 transition-colors flex gap-4 items-start">
                      {/* Vote button */}
                      <button
                        onClick={() => handleVote(item.id)}
                        disabled={item.status === 'shipped'}
                        className={`flex flex-col items-center gap-0.5 min-w-[50px] py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                          votedItems.has(item.id)
                            ? 'bg-primary/15 text-primary border border-primary/30'
                            : item.status === 'shipped'
                            ? 'bg-muted text-muted-foreground cursor-default'
                            : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer'
                        }`}
                      >
                        <ArrowUp size={14} className={votedItems.has(item.id) ? 'text-primary' : ''} />
                        <span>{item.votes}</span>
                      </button>
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusConfig[item.status].color}`}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      </div>
                      {item.status === 'shipped' && <Check size={18} className="text-emerald-500 flex-shrink-0 mt-1" />}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggest feature CTA */}
        <div className="mt-16 bg-card rounded-3xl p-8 border border-border text-center">
          <MessageSquare size={32} className="text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Have an idea?</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            We build what our community needs. Send your feature request and it might end up on this roadmap!
          </p>
          <a
            href="mailto:hello@breezeapp.co?subject=Feature%20Request%20for%20Breeze&body=Hey!%20I%27d%20love%20to%20see%20this%20feature%20in%20Breeze%3A%0A%0A"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <MessageSquare size={16} />
            Suggest a Feature
          </a>
        </div>

        {/* Build in public note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Breeze is built in public by a solo founder. Follow the journey on{' '}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">X/Twitter</a>
            {' '}and{' '}
            <a href="https://www.producthunt.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Product Hunt</a>.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={appIcon} alt="Breeze" className="w-5 h-5 rounded-lg" />
            <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Breeze. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/changelog" className="hover:text-foreground transition-colors">Changelog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Roadmap;
