import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BreathingAnimation from '@/components/BreathingAnimation';
import GroundingExercise from '@/components/GroundingExercise';
import MoodSelector from '@/components/MoodSelector';
import { affirmations, type PatternId } from '@/lib/data';
import { moodOptions } from '@/lib/data';
import { addSOSSession, addMoodEntry, getData } from '@/lib/storage';

type Stage = 'breathing' | 'grounding' | 'complete' | 'mood';

const SOSFlow = () => {
  const navigate = useNavigate();
  const defaultPattern = getData().settings.defaultBreathingPattern as PatternId;
  const [stage, setStage] = useState<Stage>('breathing');
  const [pattern, setPattern] = useState<PatternId>(defaultPattern || '4-7-8');
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const affirmation = useMemo(() => 
    affirmations[Math.floor(Math.random() * affirmations.length)], 
  [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBreathingComplete = (cycles: number) => {
    setCyclesCompleted(cycles);
    setStage('grounding');
  };

  const handleGroundingDone = () => {
    addSOSSession({
      date: new Date().toISOString(),
      pattern,
      cyclesCompleted,
      groundingCompleted: true,
    });
    setStage('complete');
  };

  const handleSkipGrounding = () => {
    addSOSSession({
      date: new Date().toISOString(),
      pattern,
      cyclesCompleted,
      groundingCompleted: false,
    });
    setStage('complete');
  };

  const handleSaveMood = () => {
    if (selectedMood) {
      const opt = moodOptions.find(o => o.value === selectedMood);
      addMoodEntry({
        date: new Date().toISOString(),
        mood: selectedMood,
        moodLabel: opt?.label || '',
        source: 'sos',
      });
    }
    navigate('/');
  };

  if (stage === 'breathing') {
    return (
      <BreathingAnimation
        patternId={pattern}
        totalCycles={6}
        darkMode
        onComplete={handleBreathingComplete}
        onPatternChange={setPattern}
      />
    );
  }

  if (stage === 'grounding') {
    return (
      <GroundingExercise
        darkMode
        onComplete={handleGroundingDone}
        onSkip={handleSkipGrounding}
      />
    );
  }

  if (stage === 'mood') {
    return (
      <div className="fixed inset-0 z-[100] bg-sos-bg flex flex-col items-center justify-center gap-grid-4 px-grid-3">
        <p className="text-xl text-sos-text font-light">How are you feeling now?</p>
        <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />
        <button
          onClick={handleSaveMood}
          disabled={!selectedMood}
          className="mt-grid-2 px-grid-4 py-grid-2 rounded-button bg-primary text-primary-foreground font-medium min-h-[48px] disabled:opacity-40"
        >
          Save & finish
        </button>
      </div>
    );
  }

  // Complete
  return (
    <div className="fixed inset-0 z-[100] bg-sos-bg flex flex-col items-center justify-center gap-grid-4 px-grid-3">
      <div className="text-5xl mb-grid-2">🌿</div>
      <p className="text-xl text-sos-text text-center font-light max-w-[320px] leading-relaxed">
        {affirmation}
      </p>
      <div className="flex flex-col gap-grid-2 w-full max-w-[320px] mt-grid-4">
        <button
          onClick={() => navigate('/daily-calm')}
          className="w-full py-grid-2 rounded-button bg-primary text-primary-foreground font-medium min-h-[48px]"
        >
          Start a Daily Calm
        </button>
        <button
          onClick={() => setStage('mood')}
          className="w-full py-grid-2 rounded-button bg-sos-text/10 text-sos-text border border-sos-text/20 font-medium min-h-[48px]"
        >
          Save how I'm feeling
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full py-grid-2 rounded-button text-sos-text/60 font-medium min-h-[48px]"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SOSFlow;
