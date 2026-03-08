import { useState, useMemo } from 'react';
import { getData } from '@/lib/storage';
import { moodOptions } from '@/lib/data';

const Journal = () => {
  const [tab, setTab] = useState<'gratitude' | 'mood'>('gratitude');
  const data = useMemo(() => getData(), []);

  return (
    <div className="py-grid-4">
      <h1 className="text-2xl font-semibold text-foreground mb-grid-3">Journal</h1>

      {/* Tabs */}
      <div className="flex gap-grid bg-muted rounded-button p-1 mb-grid-3">
        {(['gratitude', 'mood'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-grid rounded-button text-sm font-medium min-h-[40px] transition-colors ${
              tab === t ? 'bg-card text-foreground card-shadow' : 'text-muted-foreground'
            }`}
          >
            {t === 'gratitude' ? 'Gratitude' : 'Mood'}
          </button>
        ))}
      </div>

      {tab === 'gratitude' ? (
        <GratitudeTab entries={data.gratitudeEntries} />
      ) : (
        <MoodTab entries={data.moodEntries} />
      )}
    </div>
  );
};

const GratitudeTab = ({ entries }: { entries: ReturnType<typeof getData>['gratitudeEntries'] }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-grid-6 text-muted-foreground">
        <p className="text-3xl mb-grid-2">🌱</p>
        <p>Your gratitude entries will appear here</p>
        <p className="text-sm mt-grid">Complete a Daily Calm to get started</p>
      </div>
    );
  }

  // Group by date
  const grouped: Record<string, typeof entries> = {};
  entries.forEach(e => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });

  return (
    <div className="flex flex-col gap-grid-3">
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

const MoodTab = ({ entries }: { entries: ReturnType<typeof getData>['moodEntries'] }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-grid-6 text-muted-foreground">
        <p className="text-3xl mb-grid-2">📊</p>
        <p>Your mood history will appear here</p>
        <p className="text-sm mt-grid">Complete a Daily Calm to get started</p>
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

  return (
    <div className="flex flex-col gap-grid-3">
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
  const width = 100 / last30.length;

  return (
    <div className="bg-card rounded-card p-grid-2 card-shadow">
      <svg viewBox={`0 0 ${last30.length * 10} ${maxH + 10}`} className="w-full h-24">
        <polyline
          fill="none"
          stroke="hsl(145, 27%, 39%)"
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
            fill="hsl(145, 27%, 39%)"
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
