import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
  emoji: string;
}

const entries: ChangelogEntry[] = [
  {
    version: '1.4.0',
    date: 'March 8, 2026',
    title: 'Public Roadmap & Share',
    emoji: '🗺️',
    changes: [
      'Added public roadmap with feature voting',
      'Added "Share Breeze" referral button',
      'Added changelog page',
      'Improved landing page with roadmap & changelog links',
    ],
  },
  {
    version: '1.3.0',
    date: 'March 1, 2026',
    title: 'Mood Insights',
    emoji: '📊',
    changes: [
      'Weekly mood pattern analysis with trend charts',
      'Activity correlations: see what lifts your mood',
      'Mood insights card on home screen',
      'Advanced charts unlocked with Breeze Pro',
    ],
  },
  {
    version: '1.2.0',
    date: 'February 20, 2026',
    title: 'Growth Garden & Self-Care',
    emoji: '🌿',
    changes: [
      'Growth Garden visualization with 11 unlockable elements',
      'Daily self-care checklist with custom tasks',
      'Ambient sound mixer with 5 nature sounds',
    ],
  },
  {
    version: '1.1.0',
    date: 'February 10, 2026',
    title: 'Anchor & Breathing',
    emoji: '🆘',
    changes: [
      'Anchor panic relief flow with grounding exercises',
      'Guided breathing animations (4-7-8 pattern)',
      'Haptic feedback support on mobile',
      'Voice-guided meditation option',
    ],
  },
  {
    version: '1.0.0',
    date: 'January 28, 2026',
    title: 'Hello, World 🌍',
    emoji: '🎉',
    changes: [
      'Daily 3-minute calm routine',
      'Mood check-in with emoji selector',
      'Gratitude journaling',
      'Weekly streak tracking',
      'Personalized mascot companion',
    ],
  },
];

const Changelog = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-foreground">What's New</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {entries.map((entry, i) => (
          <div key={entry.version} className="relative">
            {/* Timeline connector */}
            {i < entries.length - 1 && (
              <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-border" />
            )}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-lg shrink-0 relative z-10">
                {entry.emoji}
              </div>
              <div className="flex-1 min-w-0 pb-6">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full">v{entry.version}</span>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                </div>
                <h3 className="font-semibold text-foreground mt-1">{entry.title}</h3>
                <ul className="mt-2 space-y-1">
                  {entry.changes.map((change, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Changelog;
