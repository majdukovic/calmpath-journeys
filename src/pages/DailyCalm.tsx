import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BreathingAnimation from '@/components/BreathingAnimation';
import MoodSelector from '@/components/MoodSelector';
import WeeklyDots from '@/components/WeeklyDots';
import CelebrationOverlay from '@/components/CelebrationOverlay';
import { gratitudePrompts, moodOptions } from '@/lib/data';
import { addDailyCalmSession, addGratitudeEntry, addMoodEntry, getUnusedPromptId, markPromptShown, getTotalCalmDays, getNewlyUnlockedMilestone, getNextMilestone } from '@/lib/storage';
import { hapticTap } from '@/lib/haptics';
import { getIdentityMessage, maybeGetDiscovery, getCuriosityPrompt } from '@/lib/psychology';

type Step = 'breathing' | 'gratitude' | 'mood' | 'complete';

const DailyCalm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('breathing');
  const [gratitudeText, setGratitudeText] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [milestone, setMilestone] = useState<{ emoji: string; label: string } | null>(null);
  const [discovery, setDiscovery] = useState<{ emoji: string; message: string } | null>(null);

  const promptIndex = useMemo(() => getUnusedPromptId(gratitudePrompts.length), []);
  const prompt = gratitudePrompts[promptIndex];

  const identityMessage = useMemo(() => getIdentityMessage(), []);
  const curiosityPrompt = useMemo(() => getCuriosityPrompt(), []);

  const handleBreathingDone = () => {
    hapticTap();
    setStep('gratitude');
  };

  const handleGratitudeDone = () => {
    if (gratitudeText.trim()) {
      addGratitudeEntry({
        date: new Date().toISOString().split('T')[0],
        prompt: prompt.prompt,
        answer: gratitudeText.trim(),
        category: prompt.category,
      });
      markPromptShown(prompt.id);
    }
    hapticTap();
    setStep('mood');
  };

  const handleMoodDone = () => {
    if (selectedMood) {
      const opt = moodOptions.find(o => o.value === selectedMood);
      addMoodEntry({
        date: new Date().toISOString().split('T')[0],
        mood: selectedMood,
        moodLabel: opt?.label || '',
        note: moodNote || undefined,
        source: 'daily_calm',
      });
    }

    addDailyCalmSession({
      date: new Date().toISOString().split('T')[0],
      breathingCompleted: true,
      gratitudeEntry: gratitudeText || undefined,
      moodEntry: selectedMood || undefined,
    });

    // Check for newly unlocked milestone
    const newMilestone = getNewlyUnlockedMilestone();
    if (newMilestone) {
      setMilestone({ emoji: newMilestone.emoji, label: newMilestone.label });
    }
    // Variable reward: maybe show a garden discovery
    setDiscovery(maybeGetDiscovery());
    setShowCelebration(true);
    setStep('complete');
  };

  if (step === 'breathing') {
    return (
      <BreathingAnimation
        patternId="box"
        totalCycles={4}
        darkMode={false}
        onComplete={handleBreathingDone}
      />
    );
  }

  if (step === 'gratitude') {
    return (
      <div className="fixed inset-0 z-[100] bg-primary-light flex flex-col px-grid-3 py-grid-6">
        <div className="flex justify-between items-center mb-grid-4">
          <p className="text-sm text-muted-foreground">Step 2 of 3 — Gratitude</p>
          <button
            onClick={() => { setStep('mood'); }}
            className="text-sm text-primary font-medium min-h-[48px] px-grid"
          >
            Skip
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-grid-3 max-w-[500px] mx-auto w-full">
          <span className="text-xs text-primary font-medium uppercase tracking-wide">{prompt.category}</span>
          <h2 className="text-xl font-medium text-foreground leading-relaxed">{prompt.prompt}</h2>
          <textarea
            value={gratitudeText}
            onChange={e => setGratitudeText(e.target.value.slice(0, 500))}
            placeholder="Write as much or as little as you'd like..."
            className="w-full h-40 p-grid-2 rounded-card bg-card text-foreground border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 text-base"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">{gratitudeText.length}/500</p>
          <button
            onClick={handleGratitudeDone}
            className="w-full py-grid-2 rounded-button bg-primary text-primary-foreground font-medium min-h-[48px] mt-grid-2"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === 'mood') {
    return (
      <div className="fixed inset-0 z-[100] bg-primary-light flex flex-col px-grid-3 py-grid-6">
        <p className="text-sm text-muted-foreground mb-grid-4">Step 3 of 3 — Check-in</p>
        <div className="flex-1 flex flex-col justify-center gap-grid-4 max-w-[500px] mx-auto w-full">
          <h2 className="text-xl font-medium text-foreground text-center">How are you feeling right now?</h2>
          <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />
          <textarea
            value={moodNote}
            onChange={e => setMoodNote(e.target.value.slice(0, 500))}
            placeholder="Anything on your mind? (optional)"
            className="w-full h-24 p-grid-2 rounded-card bg-card text-foreground border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 text-base"
            maxLength={500}
          />
          <button
            onClick={handleMoodDone}
            disabled={!selectedMood}
            className="w-full py-grid-2 rounded-button bg-primary text-primary-foreground font-medium min-h-[48px] disabled:opacity-40"
          >
            Finish
          </button>
        </div>
      </div>
    );
  }

  // Complete — with celebration
  const totalDays = getTotalCalmDays();
  const nextMilestone = getNextMilestone();

  return (
    <div className="fixed inset-0 z-[100] bg-primary-light flex flex-col items-center justify-center gap-grid-4 px-grid-3">
      <CelebrationOverlay show={showCelebration} milestone={milestone} />

      <div className="text-5xl mb-grid animate-soft-pop">✨</div>
      <p className="text-xl text-foreground text-center font-light max-w-[320px] leading-relaxed animate-fade-in">
        {affirmation}
      </p>

      {/* Total days counter */}
      <div className="bg-card rounded-card px-grid-4 py-grid-2 card-shadow animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <p className="text-center">
          <span className="text-2xl font-bold text-primary">{totalDays}</span>
          <span className="text-sm text-muted-foreground ml-2">
            {totalDays === 1 ? 'day' : 'days'} of showing up
          </span>
        </p>
        {nextMilestone && (
          <p className="text-xs text-muted-foreground text-center mt-1">
            {nextMilestone.milestone.emoji} {nextMilestone.milestone.days - nextMilestone.current} more to go
          </p>
        )}
      </div>

      <div className="my-grid-2">
        <WeeklyDots />
      </div>

      <div className="flex flex-col gap-grid-2 w-full max-w-[320px]">
        <button
          onClick={() => navigate('/learn')}
          className="w-full py-grid-2 rounded-button bg-primary text-primary-foreground font-medium min-h-[48px]"
        >
          Explore today's reading
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full py-grid-2 rounded-button bg-muted text-foreground font-medium min-h-[48px]"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default DailyCalm;
