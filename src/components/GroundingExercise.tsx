import { useState } from 'react';
import { groundingPrompts } from '@/lib/data';

interface Props {
  darkMode?: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const GroundingExercise = ({ darkMode = true, onComplete, onSkip }: Props) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < groundingPrompts.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const current = groundingPrompts[step];
  const bgClass = darkMode ? 'bg-sos-bg' : 'bg-primary-light';
  const textClass = darkMode ? 'text-sos-text' : 'text-foreground';
  const mutedClass = darkMode ? 'text-sos-text/60' : 'text-muted-foreground';

  return (
    <div className={`fixed inset-0 z-[100] ${bgClass} flex flex-col items-center justify-between py-grid-6 px-grid-3`}>
      <div className="flex flex-col items-center gap-grid">
        <p className={`text-sm ${mutedClass}`}>5-4-3-2-1 Grounding</p>
        <div className="flex gap-1">
          {groundingPrompts.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : darkMode ? 'bg-sos-text/20' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-grid-4">
        <div className={`text-6xl font-light ${textClass}`}>{current.count}</div>
        <p className={`text-xl text-center font-light ${textClass} max-w-[300px]`}>
          {current.prompt}
        </p>
        <p className={`text-sm ${mutedClass}`}>Take your time. There's no rush.</p>
      </div>

      <div className="flex flex-col gap-grid-2 w-full max-w-[400px]">
        <div className="flex gap-grid-2">
          <button
            onClick={onSkip}
            className={`flex-1 py-grid-2 rounded-button text-sm font-medium min-h-[48px] ${
              darkMode ? 'bg-sos-text/10 text-sos-text border border-sos-text/20' : 'bg-muted text-foreground'
            }`}
          >
            I'm okay for now
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-grid-2 rounded-button text-sm font-medium min-h-[48px] bg-primary text-primary-foreground"
          >
            {step < groundingPrompts.length - 1 ? 'Next' : 'Done'}
          </button>
        </div>
        <button
          onClick={onSkip}
          className={`w-full py-grid text-xs font-medium min-h-[36px] rounded-button ${
            darkMode ? 'text-sos-text/40' : 'text-muted-foreground'
          }`}
        >
          Take a break — you've already done something brave 💚
        </button>
      </div>
    </div>
  );
};

export default GroundingExercise;
