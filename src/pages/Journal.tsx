import { useState, useMemo, useRef, useEffect } from 'react';
import { getData, addFreewriteEntry, type FreewriteEntry } from '@/lib/storage';
import { moodOptions } from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';

// Science-backed nudges about why journaling helps — rotates daily
interface JournalingNudge {
  emoji: string;
  title: string;
  body: string;
  source?: string;
  sourceUrl?: string;
}

const journalingNudges: JournalingNudge[] = [
  {
    emoji: '🧠',
    title: 'Get it out of your head',
    body: 'Writing down worries moves them from your amygdala (the alarm center) to your prefrontal cortex, where you can actually process them. It literally calms your brain.',
    source: 'Torre & Lieberman, 2018 — "Affect Labeling"',
    sourceUrl: 'https://doi.org/10.1177/1754073917742706',
  },
  {
    emoji: '📝',
    title: 'See it on paper, lighten the load',
    body: 'Research shows that naming emotions in writing reduces their intensity by up to 50%.',
    source: 'Lieberman et al., 2007 — "Putting Feelings Into Words"',
    sourceUrl: 'https://doi.org/10.1111/j.1467-9280.2007.01916.x',
  },
  {
    emoji: '💭',
    title: 'Your mind isn\'t a filing cabinet',
    body: 'Holding thoughts inside takes mental energy. Journaling frees up working memory — like closing extra browser tabs so your brain can breathe.',
    source: 'Klein & Boals, 2001 — "Expressive Writing and Working Memory"',
    sourceUrl: 'https://doi.org/10.1037/0096-3445.130.3.520',
  },
  {
    emoji: '🔍',
    title: 'Spot patterns you can\'t see from inside',
    body: 'After a week of entries, you\'ll start noticing what triggers stress and what lifts you up. Self-awareness is the first step to feeling better.',
    source: 'Ullrich & Lutgendorf, 2002 — "Journaling About Stressful Events"',
    sourceUrl: 'https://doi.org/10.1207/S15324796ABM2403_10',
  },
  {
    emoji: '🫧',
    title: 'No rules, no judgment',
    body: 'This isn\'t school. Spelling doesn\'t matter. Grammar doesn\'t matter. Just let the words fall out — even one sentence counts.',
  },
  {
    emoji: '🌊',
    title: 'Ride the wave, don\'t fight it',
    body: 'Expressive writing for just 15 minutes has been shown to lower cortisol and improve immune function. Your journal is medicine without side effects.',
    source: 'Pennebaker & Beall, 1986 — "Expressive Writing & Health"',
    sourceUrl: 'https://doi.org/10.1037/0021-843X.95.3.274',
  },
];

function getDailyNudge() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return journalingNudges[dayOfYear % journalingNudges.length];
}

const Journal = () => {
  const [tab, setTab] = useState<'freewrite' | 'gratitude' | 'mood'>('freewrite');
  const [data, setData] = useState(() => getData());
  const nudge = useMemo(() => getDailyNudge(), []);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  const refreshData = () => setData(getData());

  return (
    <div className="py-grid-4">
      <h1 className="text-2xl font-semibold text-foreground mb-grid-2">Journal</h1>

      {/* Science nudge banner */}
      {!nudgeDismissed && (
        <div className="bg-primary-light rounded-card p-grid-2 mb-grid-3 relative">
          <button
            onClick={() => setNudgeDismissed(true)}
            className="absolute top-2 right-3 text-muted-foreground text-xs hover:text-foreground"
            aria-label="Dismiss"
          >
            ✕
          </button>
          <div className="flex gap-grid-2 items-start">
            <span className="text-2xl mt-0.5">{nudge.emoji}</span>
            <div className="pr-4">
              <p className="text-sm font-semibold text-foreground mb-0.5">{nudge.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{nudge.body}</p>
              {nudge.source && nudge.sourceUrl && (
                <a
                  href={nudge.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary/70 hover:text-primary underline mt-1 inline-block"
                >
                  📎 {nudge.source}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-grid bg-muted rounded-button p-1 mb-grid-3">
        {(['freewrite', 'gratitude', 'mood'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-grid rounded-button text-sm font-medium min-h-[40px] transition-colors ${
              tab === t ? 'bg-card text-foreground card-shadow' : 'text-muted-foreground'
            }`}
          >
            {t === 'freewrite' ? '✏️ Write' : t === 'gratitude' ? '🙏 Gratitude' : '📊 Mood'}
          </button>
        ))}
      </div>

      {tab === 'freewrite' ? (
        <FreewriteTab entries={data.freewriteEntries} onSave={refreshData} />
      ) : tab === 'gratitude' ? (
        <GratitudeTab entries={data.gratitudeEntries} />
      ) : (
        <MoodTab entries={data.moodEntries} />
      )}
    </div>
  );
};

// ─── FREEWRITE TAB ───
const freewritePrompts = [
  "What's on your mind right now? Just let it out...",
  "How are you really feeling today? No filter needed.",
  "What's one thing you'd like to let go of today?",
  "Describe your day in three words, then keep going...",
  "What would you say to a friend feeling the way you feel?",
  "What's something small that made you feel something today?",
];

function getRandomPrompt() {
  return freewritePrompts[Math.floor(Math.random() * freewritePrompts.length)];
}

const FreewriteTab = ({ entries, onSave }: { entries: FreewriteEntry[]; onSave: () => void }) => {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [placeholder] = useState(() => getRandomPrompt());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2500);
      return () => clearTimeout(t);
    }
  }, [saved]);

  const handleSave = () => {
    if (text.trim().length < 2) return;
    addFreewriteEntry(text.trim());
    setText('');
    setSaved(true);
    onSave();
  };

  // Group past entries by date
  const grouped: Record<string, FreewriteEntry[]> = {};
  entries.forEach(e => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });

  return (
    <div className="flex flex-col gap-grid-3">
      {/* Writing area */}
      <div className="bg-card rounded-card p-grid-2 card-shadow">
        <p className="text-xs text-muted-foreground mb-grid-2 italic">
          Just write. No rules, no judgment — get it out of your head.
        </p>
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="min-h-[140px] bg-transparent border-none resize-none text-sm text-foreground focus-visible:ring-0 p-0 placeholder:text-muted-foreground/60"
        />
        <div className="flex items-center justify-between mt-grid">
          <span className="text-[10px] text-muted-foreground">
            {text.length > 0 ? `${text.split(/\s+/).filter(Boolean).length} words` : ''}
          </span>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs text-primary animate-in fade-in">✓ Saved</span>
            )}
            <button
              onClick={handleSave}
              disabled={text.trim().length < 2}
              className="px-grid-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-button font-medium disabled:opacity-40 transition-opacity"
            >
              Save entry
            </button>
          </div>
        </div>
      </div>

      {/* Past entries */}
      {entries.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-grid-2 uppercase tracking-wide">Past entries</p>
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="mb-grid-3">
              <p className="text-xs text-muted-foreground font-medium mb-grid uppercase tracking-wide">
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
              {items.map(item => (
                <div key={item.id} className="bg-card rounded-card p-grid-2 card-shadow mb-grid-2">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{item.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-grid">
                    {new Date(item.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && text.length === 0 && (
        <div className="text-center py-grid-4 text-muted-foreground">
          <p className="text-3xl mb-grid-2">🫧</p>
          <p className="text-sm font-medium">Your private space to think out loud</p>
          <p className="text-xs mt-grid leading-relaxed max-w-[260px] mx-auto">
          Research shows writing for even 5 minutes helps process emotions by moving worries from your emotional brain to your thinking brain.{' '}
            <a href="https://doi.org/10.1177/1754073917742706" target="_blank" rel="noopener noreferrer" className="text-primary/70 underline">Source</a>
          </p>
        </div>
      )}
    </div>
  );
};

// ─── GRATITUDE TAB ───
const GratitudeTab = ({ entries }: { entries: ReturnType<typeof getData>['gratitudeEntries'] }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-grid-6 text-muted-foreground">
        <p className="text-3xl mb-grid-2">🌱</p>
        <p className="text-sm font-medium">Your gratitude garden starts here</p>
        <p className="text-xs mt-grid leading-relaxed max-w-[260px] mx-auto">
          Gratitude journaling rewires your brain to notice the good — even on hard days. Complete a Daily Calm session to plant your first seed.
        </p>
      </div>
    );
  }

  // Group by date
  const grouped: Record<string, typeof entries> = {};
  entries.forEach(e => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });

  const totalEntries = entries.length;

  return (
    <div className="flex flex-col gap-grid-3">
      {/* Stats pill */}
      <div className="flex gap-grid-2">
        <div className="bg-primary-light rounded-button px-grid-2 py-1.5">
          <span className="text-xs font-medium text-primary">{totalEntries} {totalEntries === 1 ? 'entry' : 'entries'}</span>
        </div>
        <div className="bg-primary-light rounded-button px-grid-2 py-1.5">
          <span className="text-xs font-medium text-primary">{Object.keys(grouped).length} {Object.keys(grouped).length === 1 ? 'day' : 'days'}</span>
        </div>
      </div>

      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <p className="text-xs text-muted-foreground font-medium mb-grid uppercase tracking-wide">
            {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          {items.map(item => (
            <div key={item.id} className="bg-card rounded-card p-grid-2 card-shadow mb-grid-2">
              <p className="text-xs text-primary font-medium mb-1">{item.prompt}</p>
              <p className="text-sm text-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ─── MOOD TAB ───
const MoodTab = ({ entries }: { entries: ReturnType<typeof getData>['moodEntries'] }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-grid-6 text-muted-foreground">
        <p className="text-3xl mb-grid-2">🌤</p>
        <p className="text-sm font-medium">Track how you feel, spot what helps</p>
        <p className="text-xs mt-grid leading-relaxed max-w-[260px] mx-auto">
          Mood tracking helps you see patterns your mind can't — like which days feel harder and what makes the difference. Complete a Daily Calm to log your first mood.
        </p>
      </div>
    );
  }

  // Calendar for current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map mood entries by date
  const moodByDate: Record<string, number> = {};
  entries.forEach(e => {
    const d = e.date.split('T')[0];
    moodByDate[d] = e.mood;
  });

  const cells: (number | null)[] = [];
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const moodEmoji = (val: number) => moodOptions.find(o => o.value === val)?.emoji || '';

  // Mood average for the month
  const monthMoods = Object.values(moodByDate);
  const avgMood = monthMoods.length > 0 ? (monthMoods.reduce((a, b) => a + b, 0) / monthMoods.length).toFixed(1) : null;

  return (
    <div className="flex flex-col gap-grid-3">
      {/* Month summary */}
      {avgMood && (
        <div className="flex gap-grid-2">
          <div className="bg-primary-light rounded-button px-grid-2 py-1.5">
            <span className="text-xs font-medium text-primary">{monthMoods.length} logged days</span>
          </div>
          <div className="bg-primary-light rounded-button px-grid-2 py-1.5">
            <span className="text-xs font-medium text-primary">Avg: {avgMood}/5</span>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-foreground mb-grid-2">
          {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-[10px] text-muted-foreground py-1">{d}</div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const mood = moodByDate[dateStr];
            return (
              <div
                key={i}
                className="aspect-square flex items-center justify-center text-xs rounded-md bg-muted/50"
              >
                {mood ? (
                  <span className="text-base">{moodEmoji(mood)}</span>
                ) : (
                  <span className="text-muted-foreground">{day}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Simple mood trend */}
      <div>
        <p className="text-sm font-medium text-foreground mb-grid-2">Last 30 days</p>
        <MoodChart entries={entries} />
      </div>
    </div>
  );
};

const MoodChart = ({ entries }: { entries: ReturnType<typeof getData>['moodEntries'] }) => {
  const last30 = entries
    .filter(e => {
      const d = new Date(e.date);
      const ago = new Date();
      ago.setDate(ago.getDate() - 30);
      return d >= ago;
    })
    .reverse();

  if (last30.length < 2) {
    return <p className="text-sm text-muted-foreground">Log a few more moods to see trends</p>;
  }

  const maxH = 100;

  return (
    <div className="bg-card rounded-card p-grid-2 card-shadow">
      <svg viewBox={`0 0 ${last30.length * 10} ${maxH + 10}`} className="w-full h-24">
        <polyline
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={last30.map((e, i) => `${i * 10 + 5},${maxH - (e.mood / 5) * maxH + 5}`).join(' ')}
        />
        {last30.map((e, i) => (
          <circle
            key={i}
            cx={i * 10 + 5}
            cy={maxH - (e.mood / 5) * maxH + 5}
            r="2.5"
            fill="hsl(var(--primary))"
          />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
};

export default Journal;
