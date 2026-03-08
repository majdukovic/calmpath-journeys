import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateSettings } from '@/lib/storage';

type Stage = 'welcome' | 'name' | 'reminder' | 'ready';

const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('welcome');
  const [name, setName] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');

  const handleSOSNow = () => {
    updateSettings({ onboardingCompleted: true });
    onComplete();
    navigate('/sos');
  };

  const handleSetup = () => {
    setStage('name');
  };

  const handleNameDone = () => {
    if (name.trim()) updateSettings({ name: name.trim() });
    setStage('reminder');
  };

  const handleReminderDone = () => {
    updateSettings({ reminderEnabled: true, reminderTime });
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

  if (stage === 'welcome') {
    return (
      <div className="fixed inset-0 bg-primary-light flex flex-col items-center justify-center gap-grid-4 px-grid-3 z-[200]">
        <div className="text-5xl">🌿</div>
        <h1 className="text-3xl font-semibold text-foreground text-center">Welcome to Breathly</h1>
        <p className="text-base text-muted-foreground text-center max-w-[320px] leading-relaxed">
          Immediate calm in crisis. Gentle daily practice for lasting peace.
        </p>
        <div className="flex flex-col gap-grid-2 w-full max-w-[320px] mt-grid-4">
          <button
            onClick={handleSOSNow}
            className="w-full py-grid-2 rounded-button bg-primary text-primary-foreground font-semibold min-h-[56px] text-base"
          >
            I need help now
          </button>
          <button
            onClick={handleSetup}
            className="w-full py-grid-2 rounded-button bg-card text-foreground font-medium min-h-[56px] text-base card-shadow"
          >
            Set up my Daily Calm
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'name') {
    return (
      <div className="fixed inset-0 bg-primary-light flex flex-col items-center justify-center gap-grid-3 px-grid-3 z-[200]">
        <h2 className="text-2xl font-semibold text-foreground">What should we call you?</h2>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full max-w-[320px] px-grid-2 py-grid-2 rounded-card bg-card border border-border text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="flex gap-grid-2 w-full max-w-[320px]">
          <button
            onClick={() => setStage('reminder')}
            className="flex-1 py-grid-2 rounded-button bg-muted text-muted-foreground font-medium min-h-[48px]"
          >
            Skip
          </button>
          <button
            onClick={handleNameDone}
            className="flex-1 py-grid-2 rounded-button bg-primary text-primary-foreground font-medium min-h-[48px]"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'reminder') {
    return (
      <div className="fixed inset-0 bg-primary-light flex flex-col items-center justify-center gap-grid-3 px-grid-3 z-[200]">
        <h2 className="text-2xl font-semibold text-foreground text-center">When would you like your daily reminder?</h2>
        <p className="text-sm text-muted-foreground text-center">"Your Daily Calm is ready whenever you are"</p>
        <input
          type="time"
          value={reminderTime}
          onChange={e => setReminderTime(e.target.value)}
          className="text-2xl px-grid-3 py-grid-2 rounded-card bg-card border border-border text-foreground text-center"
        />
        <div className="flex gap-grid-2 w-full max-w-[320px]">
          <button
            onClick={() => { setStage('ready'); }}
            className="flex-1 py-grid-2 rounded-button bg-muted text-muted-foreground font-medium min-h-[48px]"
          >
            Skip
          </button>
          <button
            onClick={handleReminderDone}
            className="flex-1 py-grid-2 rounded-button bg-primary text-primary-foreground font-medium min-h-[48px]"
          >
            Set reminder
          </button>
        </div>
      </div>
    );
  }

  // Ready
  return (
    <div className="fixed inset-0 bg-primary-light flex flex-col items-center justify-center gap-grid-4 px-grid-3 z-[200]">
      <div className="text-5xl">✨</div>
      <h2 className="text-2xl font-semibold text-foreground text-center">You're all set</h2>
      <p className="text-base text-muted-foreground text-center max-w-[280px]">
        Your first Daily Calm is ready.
      </p>
      <div className="flex flex-col gap-grid-2 w-full max-w-[320px] mt-grid-2">
        <button
          onClick={handleStartNow}
          className="w-full py-grid-2 rounded-button bg-primary text-primary-foreground font-semibold min-h-[56px] text-base"
        >
          Start now
        </button>
        <button
          onClick={handleFinish}
          className="w-full py-grid-2 rounded-button text-muted-foreground font-medium min-h-[48px]"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
