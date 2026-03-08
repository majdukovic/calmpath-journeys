import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BreathingAnimation from '@/components/BreathingAnimation';
import GroundingExercise from '@/components/GroundingExercise';
import MoodSelector from '@/components/MoodSelector';
import { gentleAffirmations, empoweringAffirmations, type PatternId } from '@/lib/data';
import { moodOptions } from '@/lib/data';
import { addSOSSession, addMoodEntry, getData } from '@/lib/storage';
import { Phone } from 'lucide-react';

type SOSMode = 'comfort' | 'empower';
type Stage = 'choose-mode' | 'breathing' | 'grounding' | 'complete' | 'mood' | 'extended-calm';

const SOSFlow = () => {
  const navigate = useNavigate();
  const data = getData();
  const defaultPattern = data.settings.defaultBreathingPattern as PatternId;
  const emergencyContact = data.settings.emergencyContact;
  const [stage, setStage] = useState<Stage>('choose-mode');
  const [sosMode, setSOSMode] = useState<SOSMode>('comfort');
  const [pattern, setPattern] = useState<PatternId>(defaultPattern || '4-7-8');
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const affirmationPool = sosMode === 'comfort' ? gentleAffirmations : empoweringAffirmations;
  const affirmation = useMemo(() =>
    affirmationPool[Math.floor(Math.random() * affirmationPool.length)],
  [stage, sosMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChooseMode = (mode: SOSMode) => {
    setSOSMode(mode);
    setStage('breathing');
  };

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

  // Mode selection screen
  if (stage === 'choose-mode') {
    return (
      <div className="fixed inset-0 z-[100] bg-sos-bg flex flex-col items-center justify-center gap-grid-4 px-grid-3">
        <div className="text-5xl mb-grid">🌿</div>
        <p className="text-xl text-sos-text font-light text-center mb-grid-2">
          How would you like to feel?
        </p>
        <div className="flex flex-col gap-grid-2 w-full max-w-[320px]">
          <button
            onClick={() => handleChooseMode('comfort')}
            className="w-full py-grid-3 rounded-card bg-sos-text/10 border border-sos-text/20 text-sos-text text-left px-grid-3 transition-all hover:bg-sos-text/15"
          >
            <span className="text-2xl block mb-1">🤗</span>
            <span className="text-base font-semibold block">Help me feel okay</span>
            <span className="text-sm text-sos-text/60">Gentle comfort & reassurance</span>
          </button>
          <button
            onClick={() => handleChooseMode('empower')}
            className="w-full py-grid-3 rounded-card bg-sos-text/10 border border-sos-text/20 text-sos-text text-left px-grid-3 transition-all hover:bg-sos-text/15"
          >
            <span className="text-2xl block mb-1">💪</span>
            <span className="text-base font-semibold block">Let's do this</span>
            <span className="text-sm text-sos-text/60">Empowering & strength-building</span>
          </button>
        </div>

        {/* Emergency contact quick access */}
        {emergencyContact?.phone && (
          <a
            href={`tel:${emergencyContact.phone}`}
            className="mt-grid-4 flex items-center gap-grid text-sos-text/50 text-sm hover:text-sos-text/80 transition-colors min-h-[48px]"
          >
            <Phone size={16} />
            <span>Call {emergencyContact.name || 'emergency contact'}</span>
          </a>
        )}
      </div>
    );
  }

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

  // Extended calm mode — ambient loop
  if (stage === 'extended-calm') {
    return (
      <div className="fixed inset-0 z-[100] bg-sos-bg flex flex-col items-center justify-center px-grid-3">
        {/* Ambient breathing circle */}
        <div className="relative flex items-center justify-center mb-grid-4">
          <div
            className="w-40 h-40 rounded-full"
            style={{
              background: 'radial-gradient(circle, hsla(180, 50%, 70%, 0.4), hsla(145, 40%, 55%, 0.2))',
              boxShadow: '0 0 60px 25px hsla(160, 45%, 60%, 0.15)',
              animation: 'breathe-glow 6s ease-in-out infinite, extended-breathe 6s ease-in-out infinite',
            }}
          />
        </div>
        <p className="text-lg text-sos-text/80 font-light text-center mb-grid">
          Just breathe. There's no rush.
        </p>
        <p className="text-sm text-sos-text/40 text-center mb-grid-4">
          Stay as long as you need. This screen is yours.
        </p>

        {/* Rotating gentle affirmations */}
        <ExtendedCalmAffirmation affirmations={affirmationPool} />

        <button
          onClick={() => setStage('complete')}
          className="mt-grid-6 px-grid-4 py-grid-2 rounded-button bg-sos-text/10 text-sos-text border border-sos-text/20 font-medium min-h-[48px]"
        >
          I'm ready to move on
        </button>
      </div>
    );
  }

  // Complete
  return (
    <div className="fixed inset-0 z-[100] bg-sos-bg flex flex-col items-center justify-center gap-grid-4 px-grid-3">
      <div className="text-5xl mb-grid-2">
        {sosMode === 'comfort' ? '🌿' : '⭐'}
      </div>
      <p className="text-xl text-sos-text text-center font-light max-w-[320px] leading-relaxed">
        {affirmation}
      </p>
      <div className="flex flex-col gap-grid-2 w-full max-w-[320px] mt-grid-4">
        <button
          onClick={() => setStage('extended-calm')}
          className="w-full py-grid-2 rounded-button bg-primary text-primary-foreground font-medium min-h-[48px]"
        >
          I need more time
        </button>
        <button
          onClick={() => navigate('/daily-calm')}
          className="w-full py-grid-2 rounded-button bg-sos-text/10 text-sos-text border border-sos-text/20 font-medium min-h-[48px]"
        >
          Start a Daily Calm
        </button>
        <button
          onClick={() => setStage('mood')}
          className="w-full py-grid-2 rounded-button bg-sos-text/10 text-sos-text border border-sos-text/20 font-medium min-h-[48px]"
        >
          Save how I'm feeling
        </button>

        {/* Emergency contact */}
        {emergencyContact?.phone && (
          <a
            href={`tel:${emergencyContact.phone}`}
            className="w-full py-grid-2 rounded-button bg-sos-text/10 text-sos-text border border-sos-text/20 font-medium min-h-[48px] flex items-center justify-center gap-grid"
          >
            <Phone size={16} />
            Call {emergencyContact.name || 'someone'}
          </a>
        )}

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

// Component that slowly rotates through affirmations
const ExtendedCalmAffirmation = ({ affirmations }: { affirmations: string[] }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useState(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % affirmations.length);
        setVisible(true);
      }, 1000);
    }, 8000);
    return () => clearInterval(interval);
  });

  return (
    <p
      className={`text-base text-sos-text/60 text-center font-light max-w-[280px] min-h-[60px] flex items-center transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      "{affirmations[index]}"
    </p>
  );
};

export default SOSFlow;
