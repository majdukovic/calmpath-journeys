import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShareBreeze from '@/components/ShareBreeze';
import WeeklyDots from '@/components/WeeklyDots';
import MascotCompanion from '@/components/MascotCompanion';
import GrowthGarden from '@/components/GrowthGarden';
import DailySelfCare from '@/components/DailySelfCare';
import AmbientSounds from '@/components/AmbientSounds';
import MoodInsights from '@/components/MoodInsights';
import { isTodayDailyCalmDone, getData, updateSettings, getTotalCalmDays, getNextMilestone } from '@/lib/storage';
import { X, Info } from 'lucide-react';
import { getContextCue } from '@/lib/psychology';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const Home = () => {
  const navigate = useNavigate();
  const done = isTodayDailyCalmDone();
  const data = getData();
  const name = data.settings.name;
  const [showSOS, setShowSOS] = useState(data.settings.showSOSCard);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  const handleDismissSOS = () => {
    updateSettings({ showSOSCard: false });
    setShowSOS(false);
  };

  return (
    <div className="py-grid-4 flex flex-col gap-grid-3">
      {/* Mascot Companion */}
      <MascotCompanion />

      {/* Habit stacking context cue — attaches to user's natural daily rhythm */}
      {!done && (() => {
        const cue = getContextCue();
        return (
          <button
            onClick={() => cue.action ? navigate('/daily-calm') : undefined}
            className="gradient-calm rounded-card px-grid-3 py-grid-2 flex items-center gap-grid-2 text-left transition-all hover:card-shadow-hover"
          >
            <span className="text-2xl">{cue.emoji}</span>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{cue.suggestion}</p>
          </button>
        );
      })()}

      {/* SOS Card — dismissible */}
      {showSOS && (
        <div className="gradient-peach rounded-card p-grid-3 card-shadow relative">
          {/* Action icons */}
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <button
              onClick={() => setShowInfoTooltip(!showInfoTooltip)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
              aria-label="Info about SOS card"
            >
              <Info size={16} />
            </button>
            <button
              onClick={handleDismissSOS}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
              aria-label="Hide SOS card from home screen"
            >
              <X size={16} />
            </button>
          </div>

          {/* Info tooltip */}
          {showInfoTooltip && (
            <div className="absolute top-12 right-3 bg-card rounded-2xl p-grid-2 card-shadow max-w-[240px] z-10 animate-fade-in">
              <p className="text-xs text-muted-foreground leading-relaxed">
                You can hide this card with the ✕ button. The SOS button is always available in the bottom navigation bar. To bring this card back, go to <span className="font-semibold text-foreground">Settings → Home Screen</span>.
              </p>
            </div>
          )}

          <div className="flex flex-col items-center gap-grid-2 text-center pt-grid">
            <p className="text-sm text-muted-foreground">If you're feeling overwhelmed</p>
            <button
              onClick={() => navigate('/sos')}
              className="w-20 h-20 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg card-shadow transition-transform hover:scale-105"
              aria-label="SOS - I need calm now"
            >
              SOS
            </button>
            <p className="text-base font-semibold text-foreground">I need calm now</p>
          </div>
        </div>
      )}

      {/* Daily Calm Card */}
      {(() => {
        const totalDays = getTotalCalmDays();
        const nextMilestone = getNextMilestone();
        return (
          <div className="bg-card rounded-card p-grid-3 card-shadow">
            <h2 className="text-xl font-semibold text-foreground mb-grid">
              {getGreeting()}{name ? `, ${name}` : ''} 🌿
            </h2>
            {done ? (
              <div className="flex flex-col gap-grid-2">
                <div className="flex items-center gap-grid">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                    <span className="text-primary text-lg">✓</span>
                  </div>
                  <p className="text-foreground font-medium">You showed up today. That matters.</p>
                </div>

                {/* Cumulative progress */}
                {totalDays > 0 && (
                  <div className="flex items-center justify-between bg-primary/5 rounded-2xl px-grid-2 py-grid">
                    <span className="text-sm text-muted-foreground">
                      <span className="text-lg font-bold text-primary">{totalDays}</span> {totalDays === 1 ? 'day' : 'days'} of calm
                    </span>
                    {nextMilestone && (
                      <span className="text-xs text-muted-foreground">
                        {nextMilestone.milestone.emoji} {nextMilestone.milestone.days - nextMilestone.current} to go
                      </span>
                    )}
                  </div>
                )}

                <WeeklyDots />
                <button
                  onClick={() => navigate('/daily-calm')}
                  className="w-full py-grid-2 rounded-button bg-muted text-foreground font-semibold min-h-[48px] mt-grid transition-all hover:card-shadow-hover"
                >
                  Do another session
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-grid-2">
                <p className="text-muted-foreground text-sm">~3 min · Breathing, gratitude & check-in</p>

                {/* Show progress even before today's session */}
                {totalDays > 0 && (
                  <div className="flex items-center justify-between bg-primary/5 rounded-2xl px-grid-2 py-grid">
                    <span className="text-sm text-muted-foreground">
                      <span className="text-lg font-bold text-primary">{totalDays}</span> {totalDays === 1 ? 'day' : 'days'} of calm
                    </span>
                    {nextMilestone && (
                      <span className="text-xs text-muted-foreground">
                        {nextMilestone.milestone.emoji} {nextMilestone.milestone.days - nextMilestone.current} to go
                      </span>
                    )}
                  </div>
                )}

                <button
                  onClick={() => navigate('/daily-calm')}
                  className="w-full py-grid-2 rounded-button bg-primary text-primary-foreground font-semibold min-h-[48px] transition-all hover:opacity-90"
                >
                  Start your 3-minute calm
                </button>
                <WeeklyDots />
              </div>
            )}
          </div>
        );
      })()}

      {/* AI Mood Insights — premium feature */}
      <MoodInsights />

      {/* Daily Self-Care Checklist */}
      <DailySelfCare />

      {/* Growth Garden */}
      <GrowthGarden />

      {/* Calm Sounds */}
      <AmbientSounds />

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-grid-2">
        <button
          onClick={() => navigate('/community')}
          className="bg-card rounded-card p-grid-2 card-shadow text-left min-h-[48px] transition-all hover:card-shadow-hover"
        >
          <span className="text-2xl mb-1 block">🌿</span>
          <span className="text-sm font-semibold text-foreground">Breeze Circle</span>
          <span className="text-[10px] text-muted-foreground block">Community support</span>
        </button>
        <button
          onClick={() => navigate('/learn')}
          className="bg-card rounded-card p-grid-2 card-shadow text-left min-h-[48px] transition-all hover:card-shadow-hover"
        >
          <span className="text-2xl mb-1 block">📖</span>
          <span className="text-sm font-semibold text-foreground">Today's reading</span>
        </button>
        <button
          onClick={() => navigate('/journal')}
          className="bg-card rounded-card p-grid-2 card-shadow text-left min-h-[48px] transition-all hover:card-shadow-hover col-span-2"
        >
          <span className="text-2xl mb-1 block">📓</span>
          <span className="text-sm font-semibold text-foreground">Your journal</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
