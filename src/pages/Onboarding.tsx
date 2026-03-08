import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateSettings } from '@/lib/storage';
import { requestNotificationPermission, startNotificationScheduler } from '@/lib/notifications';
import mascotWave from '@/assets/mascot-wave.png';
import mascotHappy from '@/assets/mascot-happy.png';
import mascotProud from '@/assets/mascot-proud.png';

/* ── Intro slides: tap-to-advance story flow ── */
const introSlides = [
  {
    emoji: null,
    mascot: mascotWave,
    title: 'Meet Breeze 🦊',
    body: 'Your calm companion — here to help you breathe, reflect, and grow.',
    bg: 'from-primary/10 to-secondary/10',
  },
  {
    emoji: '🫁',
    mascot: null,
    title: 'Breathe',
    body: 'Guided breathing exercises that calm your nervous system in under 3 minutes.',
    bg: 'from-primary/15 to-primary/5',
  },
  {
    emoji: '🌱',
    mascot: null,
    title: 'Grow your garden',
    body: 'Every session plants a seed. Watch your calm garden bloom over time.',
    bg: 'from-accent/10 to-primary/10',
  },
  {
    emoji: null,
    mascot: mascotHappy,
    title: 'No streaks. No guilt.',
    body: 'We count total days — not consecutive ones. Miss a day? Your progress stays.',
    bg: 'from-secondary/10 to-accent/10',
  },
  {
    emoji: '🆘',
    mascot: null,
    title: 'SOS — anytime',
    body: 'Feeling overwhelmed? The SOS button gives you instant calm — always one tap away.',
    bg: 'from-accent/15 to-accent/5',
  },
];

type Stage = 'intro' | 'name' | 'reminder' | 'ready';

const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('intro');
  const [slideIndex, setSlideIndex] = useState(0);
  const [name, setName] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [slideDirection, setSlideDirection] = useState<'in' | 'out'>('in');

  const isLastSlide = slideIndex === introSlides.length - 1;

  const advanceSlide = useCallback(() => {
    if (isLastSlide) {
      setStage('name');
      return;
    }
    setSlideDirection('out');
    setTimeout(() => {
      setSlideIndex(i => i + 1);
      setSlideDirection('in');
    }, 200);
  }, [isLastSlide]);

  const handleSOSNow = () => {
    updateSettings({ onboardingCompleted: true });
    onComplete();
    navigate('/sos');
  };

  const handleNameDone = () => {
    if (name.trim()) updateSettings({ name: name.trim() });
    setStage('reminder');
  };

  const handleReminderDone = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      updateSettings({ reminderEnabled: true, reminderTime });
      startNotificationScheduler();
    } else {
      updateSettings({ reminderEnabled: false, reminderTime });
    }
    setStage('ready');
  };

  const handleFinish = () => {
    updateSettings({ onboardingCompleted: true });
    onComplete();
  };

  const handleStartNow = () => {
    updateSettings({ onboardingCompleted: true });
    onComplete();
    navigate('/daily-calm');
  };

  /* ── Intro slides ── */
  if (stage === 'intro') {
    const slide = introSlides[slideIndex];
    return (
      <div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-between cursor-pointer select-none"
        onClick={advanceSlide}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-b ${slide.bg} bg-background`} />

        {/* Progress dots */}
        <div className="relative z-10 flex gap-1.5 pt-safe-top px-grid-3 mt-14 w-full max-w-[360px]">
          {introSlides.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < slideIndex
                  ? 'bg-primary'
                  : i === slideIndex
                    ? 'bg-primary/80'
                    : 'bg-muted-foreground/20'
              }`}
            />
          ))}
        </div>

        {/* Slide content */}
        <div
          className={`relative z-10 flex-1 flex flex-col items-center justify-center gap-grid-3 px-grid-3 max-w-[360px] transition-all duration-200 ${
            slideDirection === 'in'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4'
          }`}
        >
          {slide.mascot ? (
            <img
              src={slide.mascot}
              alt="Breeze the fox"
              className="w-28 h-28 object-contain drop-shadow-lg"
            />
          ) : (
            <span className="text-6xl">{slide.emoji}</span>
          )}
          <h1 className="text-2xl font-bold text-foreground text-center">{slide.title}</h1>
          <p className="text-base text-muted-foreground text-center leading-relaxed max-w-[300px]">
            {slide.body}
          </p>
        </div>

        {/* Bottom area */}
        <div className="relative z-10 pb-safe-bottom px-grid-3 mb-6 w-full max-w-[360px] flex flex-col items-center gap-grid-2">
          {isLastSlide ? (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); advanceSlide(); }}
                className="w-full py-grid-2 rounded-button bg-primary text-primary-foreground font-bold min-h-[56px] text-base transition-all hover:opacity-90"
              >
                Let's get started
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleSOSNow(); }}
                className="w-full py-grid-2 rounded-button bg-accent text-accent-foreground font-semibold min-h-[48px] text-sm"
              >
                I need help now
              </button>
            </>
          ) : (
            <p className="text-xs text-muted-foreground/60 animate-pulse">Tap anywhere to continue</p>
          )}
        </div>
      </div>
    );
  }

  /* ── Name step ── */
  if (stage === 'name') {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-grid-3 px-grid-3 z-[200]">
        <img src={mascotProud} alt="Breeze" className="w-20 h-20 object-contain" />
        <h2 className="text-2xl font-bold text-foreground">What should we call you?</h2>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full max-w-[320px] px-grid-2 py-grid-2 rounded-2xl bg-card border border-border text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="flex gap-grid-2 w-full max-w-[320px]">
          <button
            onClick={() => setStage('reminder')}
            className="flex-1 py-grid-2 rounded-button bg-muted text-muted-foreground font-semibold min-h-[48px]"
          >
            Skip
          </button>
          <button
            onClick={handleNameDone}
            className="flex-1 py-grid-2 rounded-button bg-primary text-primary-foreground font-semibold min-h-[48px]"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  /* ── Reminder step ── */
  if (stage === 'reminder') {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-grid-3 px-grid-3 z-[200]">
        <span className="text-5xl">⏰</span>
        <h2 className="text-2xl font-bold text-foreground text-center">Daily reminder?</h2>
        <p className="text-sm text-muted-foreground text-center max-w-[280px]">
          A gentle nudge at the time that works for you
        </p>
        <input
          type="time"
          value={reminderTime}
          onChange={e => setReminderTime(e.target.value)}
          className="text-2xl px-grid-3 py-grid-2 rounded-2xl bg-card border border-border text-foreground text-center"
        />
        <div className="flex gap-grid-2 w-full max-w-[320px]">
          <button
            onClick={() => setStage('ready')}
            className="flex-1 py-grid-2 rounded-button bg-muted text-muted-foreground font-semibold min-h-[48px]"
          >
            Skip
          </button>
          <button
            onClick={handleReminderDone}
            className="flex-1 py-grid-2 rounded-button bg-primary text-primary-foreground font-semibold min-h-[48px]"
          >
            Set reminder
          </button>
        </div>
      </div>
    );
  }

  /* ── Ready ── */
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-grid-4 px-grid-3 z-[200]">
      <div className="text-5xl">✨</div>
      <h2 className="text-2xl font-bold text-foreground text-center">You're all set</h2>
      <p className="text-base text-muted-foreground text-center max-w-[280px]">
        Breeze is ready to grow your garden. Let's begin!
      </p>
      <div className="flex flex-col gap-grid-2 w-full max-w-[320px] mt-grid-2">
        <button
          onClick={handleStartNow}
          className="w-full py-grid-2 rounded-button bg-primary text-primary-foreground font-bold min-h-[56px] text-base transition-all hover:opacity-90"
        >
          Start your first calm
        </button>
        <button
          onClick={handleFinish}
          className="w-full py-grid-2 rounded-button text-muted-foreground font-semibold min-h-[48px]"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
