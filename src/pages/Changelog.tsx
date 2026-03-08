import { Link } from 'react-router-dom';
import { Sparkles, Wind, Heart, Shield, Brain, Palette, Users, Zap } from 'lucide-react';
import appIcon from '/app-icon.png';

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  highlights: string[];
  icon: React.ElementType;
  tag: 'major' | 'feature' | 'improvement';
}

const changelog: ChangelogEntry[] = [
  {
    version: '1.4.0',
    date: 'March 8, 2026',
    title: 'Breeze Circle Community',
    highlights: [
      '🌿 Anonymous community for Breeze Plus members',
      '🤖 AI-moderated posts for a safe, supportive space',
      '❤️ Supportive reactions: Hug, Relate, Strength',
      '💡 Prompt suggestions to get conversations started',
      '📞 Crisis resources always visible',
    ],
    icon: Users,
    tag: 'major',
  },
  {
    version: '1.3.0',
    date: 'March 6, 2026',
    title: 'Breeze Plus & Stripe Payments',
    highlights: [
      '✨ Premium subscription with monthly & yearly plans',
      '🧠 AI-powered weekly mood insights',
      '🌬️ 5 additional breathing patterns (Resonance, Sleep, Energize…)',
      '🔒 Secure checkout via Stripe',
      '⚙️ Subscription management portal',
    ],
    icon: Sparkles,
    tag: 'major',
  },
  {
    version: '1.2.0',
    date: 'March 4, 2026',
    title: 'Growth Garden & Ambient Sounds',
    highlights: [
      '🌱 Visual garden that grows with your calm days',
      '🎵 4 ambient soundscapes (Rain, Ocean, Forest, Wind)',
      '📊 Mood insights with weekly dot visualization',
      '🦊 Fox companion mood-reactive animations',
    ],
    icon: Heart,
    tag: 'feature',
  },
  {
    version: '1.1.0',
    date: 'March 2, 2026',
    title: 'SOS Flow & Daily Calm',
    highlights: [
      '🆘 2-tap panic relief with guided breathing',
      '🧘 3-minute Daily Calm ritual (breathe + gratitude + mood)',
      '📝 Freewrite journaling with prompts',
      '🌙 Grounding exercise (5-4-3-2-1 technique)',
      '📱 Emergency contact quick-dial',
    ],
    icon: Shield,
    tag: 'feature',
  },
  {
    version: '1.0.0',
    date: 'February 28, 2026',
    title: 'Hello, World! 🌬️',
    highlights: [
      '🌬️ 3 science-backed breathing patterns (4-7-8, Box, Sigh)',
      '📓 Gratitude journal with daily prompts',
      '😌 Mood tracking with weekly visualization',
      '🎨 Light & Dark themes',
      '🔔 Daily reminder notifications',
      '📱 Works offline, no account needed',
    ],
    icon: Wind,
    tag: 'major',
  },
];

const tagStyles = {
  major: 'bg-primary/10 text-primary border-primary/20',
  feature: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  improvement: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

const tagLabels = {
  major: '🚀 Major Release',
  feature: '✨ New Feature',
  improvement: '🔧 Improvement',
};

const Changelog = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={appIcon} alt="Breeze" className="w-8 h-8 rounded-xl" />
            <span className="text-lg font-bold text-foreground">Breeze</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/roadmap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roadmap</Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Home</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">What's New in Breeze</h1>
          <p className="text-muted-foreground text-lg">
            Every update, every feature, every little thing we ship — because transparency matters.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-8">
            {changelog.map((entry, i) => (
              <div key={entry.version} className="relative flex gap-6">
                {/* Timeline dot */}
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 z-10 bg-background border border-border">
                    <entry.icon size={20} className="text-primary" />
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 bg-card rounded-2xl p-6 border border-border hover:border-primary/20 transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                      v{entry.version}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${tagStyles[entry.tag]}`}>
                      {tagLabels[entry.tag]}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">{entry.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{entry.title}</h3>
                  <ul className="space-y-1.5">
                    {entry.highlights.map((h, j) => (
                      <li key={j} className="text-sm text-muted-foreground">{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe CTA */}
        <div className="mt-16 bg-card rounded-3xl p-8 border border-border text-center">
          <Zap size={28} className="text-primary mx-auto mb-3" />
          <h3 className="text-lg font-bold text-foreground mb-2">Stay in the loop</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
            Follow us on X/Twitter for real-time updates, dev stories, and the occasional anxiety meme.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Follow on X
            </a>
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 bg-muted text-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-muted/80 transition-colors"
            >
              View Roadmap →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 mt-12">
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={appIcon} alt="Breeze" className="w-5 h-5 rounded-lg" />
            <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Breeze. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Changelog;
