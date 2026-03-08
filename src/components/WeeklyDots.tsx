import { getWeeklyProgress, getWeeklyCount } from '@/lib/storage';

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const WeeklyDots = () => {
  const progress = getWeeklyProgress();
  const count = getWeeklyCount();

  return (
    <div className="flex flex-col items-center gap-grid">
      <div className="flex gap-grid-2">
        {progress.map((done, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full border-2 transition-colors ${
                done
                  ? 'bg-accent border-accent'
                  : 'border-border bg-transparent'
              }`}
              aria-label={`${dayLabels[i]}: ${done ? 'completed' : 'not completed'}`}
            />
            <span className="text-[10px] text-muted-foreground">{dayLabels[i]}</span>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {count} of 7 this week — every session counts
      </p>
    </div>
  );
};

export default WeeklyDots;
