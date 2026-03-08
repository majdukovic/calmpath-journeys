import { useNavigate } from 'react-router-dom';
import WeeklyDots from '@/components/WeeklyDots';
import MascotCompanion from '@/components/MascotCompanion';
import GrowthGarden from '@/components/GrowthGarden';
import { isTodayDailyCalmDone, getData } from '@/lib/storage';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const Home = () => {
  const navigate = useNavigate();
  const done = isTodayDailyCalmDone();
  const name = getData().settings.name;

  return (
    <div className="py-grid-4 flex flex-col gap-grid-3">
      {/* Mascot Companion */}
      <MascotCompanion />

      {/* SOS Card — warm gradient, inviting not alarming */}
      <div className="gradient-peach rounded-card p-grid-3 card-shadow flex flex-col items-center gap-grid-2 text-center">
        <p className="text-sm text-muted-foreground">If you're feeling overwhelmed</p>
        <button
          onClick={() => navigate('/sos')}
          className="w-20 h-20 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg animate-pulse-soft card-shadow"
          aria-label="SOS - I need calm now"
        >
          SOS
        </button>
        <p className="text-base font-semibold text-foreground">I need calm now</p>
      </div>

      {/* Daily Calm Card */}
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

      {/* Growth Garden */}
      <GrowthGarden />

      {/* Quick links — soft pastel cards */}
      <div className="grid grid-cols-2 gap-grid-2">
        <button
          onClick={() => navigate('/learn')}
          className="bg-card rounded-card p-grid-2 card-shadow text-left min-h-[48px] transition-all hover:card-shadow-hover"
        >
          <span className="text-2xl mb-1 block">📖</span>
          <span className="text-sm font-semibold text-foreground">Today's reading</span>
        </button>
        <button
          onClick={() => navigate('/journal')}
          className="bg-card rounded-card p-grid-2 card-shadow text-left min-h-[48px] transition-all hover:card-shadow-hover"
        >
          <span className="text-2xl mb-1 block">📓</span>
          <span className="text-sm font-semibold text-foreground">Your journal</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
