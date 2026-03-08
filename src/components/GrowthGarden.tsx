import { useMemo, useState } from 'react';
import { getGardenStats, getUnlockedElements, getNextElement, gardenElements } from '@/lib/garden';

const GrowthGarden = () => {
  const stats = useMemo(() => getGardenStats(), []);
  const unlocked = getUnlockedElements(stats);
  const nextElement = getNextElement(stats);
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="bg-card rounded-card p-grid-3 card-shadow">
      <div className="flex items-center justify-between mb-grid-2">
        <h2 className="text-base font-semibold text-foreground">Your Garden 🌿</h2>
        <span className="text-xs text-muted-foreground font-medium">
          {unlocked.length}/{gardenElements.length} blooming
        </span>
      </div>

      {/* Garden visualization — gradient background */}
      <div className="gradient-calm rounded-2xl p-grid-3 mb-grid-2 min-h-[90px] flex items-center justify-center">
        {unlocked.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center font-medium">
            Complete your first session to plant a seed 🌱
          </p>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center">
            {unlocked.map((el, i) => (
              <div
                key={el.id}
                className="text-2xl animate-soft-pop"
                style={{ animationDelay: `${i * 100}ms` }}
                title={el.name}
              >
                {el.emoji}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next unlock hint */}
      {nextElement && (
        <div className="flex items-center gap-grid text-xs text-muted-foreground font-medium">
          <span className="opacity-40 text-lg">{nextElement.emoji}</span>
          <span>Next: {nextElement.requirement}</span>
        </div>
      )}

      {/* Expandable milestone list */}
      {unlocked.length > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-primary font-semibold mt-grid-2 min-h-[32px]"
        >
          {showAll ? 'Hide milestones' : 'View all milestones'}
        </button>
      )}

      {showAll && (
        <div className="mt-grid-2 space-y-grid animate-fade-in">
          {gardenElements.map(el => {
            const isUnlocked = unlocked.includes(el);
            return (
              <div
                key={el.id}
                className={`flex items-center gap-grid-2 text-sm py-1.5 rounded-lg px-grid ${
                  isUnlocked ? 'text-foreground bg-primary/5' : 'text-muted-foreground/40'
                }`}
              >
                <span className="text-lg">{el.emoji}</span>
                <div className="flex-1">
                  <span className="font-semibold">{el.name}</span>
                  <span className="text-xs block">
                    {isUnlocked ? el.description : el.requirement}
                  </span>
                </div>
                {isUnlocked && <span className="text-primary text-xs font-bold">✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GrowthGarden;
