import { useState, useEffect, useCallback, useRef } from 'react';
import { breathingPatterns, type PatternId } from '@/lib/data';
import { hapticInhale, hapticExhale, hapticPulse } from '@/lib/haptics';
import { initVoiceGuide, speakOpening, speakPhase, stopVoiceGuide, isVoiceAvailable } from '@/lib/voiceGuide';
import { getData, updateSettings } from '@/lib/storage';
import { Volume2, VolumeX } from 'lucide-react';

interface Props {
  patternId: PatternId;
  totalCycles: number;
  darkMode?: boolean;
  onComplete: (cyclesCompleted: number) => void;
  onPatternChange?: (id: PatternId) => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'holdAfter';

const phaseLabels: Record<Phase, string> = {
  inhale: 'Breathe in',
  hold: 'Hold',
  exhale: 'Breathe out',
  holdAfter: 'Hold',
};

const BreathingAnimation = ({ patternId, totalCycles, darkMode = true, onComplete, onPatternChange }: Props) => {
  const pattern = breathingPatterns.find(p => p.id === patternId) || breathingPatterns[0];
  const [phase, setPhase] = useState<Phase>('inhale');
  const [cycle, setCycle] = useState(1);
  const [maxCycles, setMaxCycles] = useState(totalCycles);
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Voice guide state
  const settings = getData().settings;
  const [voiceEnabled, setVoiceEnabled] = useState(
    settings.voiceGuideEnabled !== false && isVoiceAvailable()
  );
  const voiceEnabledRef = useRef(voiceEnabled);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  // Init voice on mount
  useEffect(() => {
    if (isVoiceAvailable()) {
      initVoiceGuide();
    }
    return () => stopVoiceGuide();
  }, []);

  const getPhaseSequence = useCallback(() => {
    const seq: { phase: Phase; duration: number }[] = [];
    seq.push({ phase: 'inhale', duration: pattern.inhale });
    if (pattern.hold > 0) seq.push({ phase: 'hold', duration: pattern.hold });
    seq.push({ phase: 'exhale', duration: pattern.exhale });
    if (pattern.holdAfter > 0) seq.push({ phase: 'holdAfter', duration: pattern.holdAfter });
    return seq;
  }, [pattern]);

  const phaseIndexRef = useRef(0);
  const cycleRef = useRef(1);

  useEffect(() => {
    if (!isRunning) return;

    const seq = getPhaseSequence();

    const advance = () => {
      phaseIndexRef.current++;
      if (phaseIndexRef.current >= seq.length) {
        phaseIndexRef.current = 0;
        cycleRef.current++;
        setCycle(cycleRef.current);
        if (cycleRef.current > maxCycles) {
          setIsRunning(false);
          stopVoiceGuide();
          onComplete(maxCycles);
          return;
        }
      }
      const next = seq[phaseIndexRef.current];
      setPhase(next.phase);

      // Haptic feedback
      if (next.phase === 'inhale') hapticInhale();
      else if (next.phase === 'exhale') hapticExhale();
      else hapticPulse();

      // Voice cue
      if (voiceEnabledRef.current) {
        speakPhase(next.phase, cycleRef.current);
      }

      timerRef.current = setTimeout(advance, next.duration * 1000);
    };

    // Start first phase
    phaseIndexRef.current = 0;
    cycleRef.current = cycle;
    const first = seq[0];
    setPhase(first.phase);

    // Speak opening cue + first phase
    if (voiceEnabledRef.current) {
      speakOpening();
      // Delay first phase cue slightly so opening finishes
      setTimeout(() => {
        if (voiceEnabledRef.current) speakPhase('inhale', 1);
      }, 2200);
    }

    timerRef.current = setTimeout(advance, first.duration * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, maxCycles, getPhaseSequence]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeepGoing = () => {
    setMaxCycles(prev => prev + 3);
  };

  const handleFeelBetter = () => {
    setIsRunning(false);
    stopVoiceGuide();
    if (timerRef.current) clearTimeout(timerRef.current);
    onComplete(Math.min(cycle, maxCycles));
  };

  const toggleVoice = () => {
    const newVal = !voiceEnabled;
    setVoiceEnabled(newVal);
    if (!newVal) stopVoiceGuide();
    updateSettings({ voiceGuideEnabled: newVal });
  };

  // Scale based on phase
  const scale = phase === 'inhale' ? 1.6 : phase === 'exhale' ? 0.8 : phase === 'hold' ? 1.6 : 0.8;
  const phaseDuration = (() => {
    const seq = getPhaseSequence();
    const current = seq.find(s => s.phase === phase);
    return current?.duration || 4;
  })();

  const bgClass = darkMode ? 'bg-sos-bg' : 'bg-primary-light';
  const textClass = darkMode ? 'text-sos-text' : 'text-foreground';
  const mutedClass = darkMode ? 'text-sos-text/60' : 'text-muted-foreground';

  return (
    <div className={`fixed inset-0 z-[100] ${bgClass} flex flex-col items-center justify-between py-grid-6 px-grid-2`}>
      {/* Top bar: pattern selector + voice toggle */}
      <div className="flex items-center gap-grid-2 w-full max-w-[400px]">
        {onPatternChange && (
          <div className="flex gap-grid bg-foreground/10 rounded-full p-1 flex-1">
            {breathingPatterns.map(p => (
              <button
                key={p.id}
                onClick={() => onPatternChange(p.id)}
                className={`px-grid-2 py-grid text-xs rounded-full transition-colors min-h-[36px] ${
                  p.id === patternId
                    ? darkMode ? 'bg-sos-text/20 text-sos-text' : 'bg-primary text-primary-foreground'
                    : `${mutedClass} hover:opacity-80`
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Voice toggle */}
        {isVoiceAvailable() && (
          <button
            onClick={toggleVoice}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              voiceEnabled
                ? darkMode ? 'bg-sos-text/15 text-sos-text' : 'bg-primary/15 text-primary'
                : darkMode ? 'bg-sos-text/5 text-sos-text/30' : 'bg-muted text-muted-foreground/40'
            }`}
            aria-label={voiceEnabled ? 'Mute voice guide' : 'Enable voice guide'}
          >
            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        )}
      </div>

      {/* Center: breathing circle */}
      <div className="flex-1 flex flex-col items-center justify-center gap-grid-4">
        <div className="relative flex items-center justify-center">
          <div
            className="w-32 h-32 rounded-full"
            style={{
              transform: `scale(${scale})`,
              transition: `transform ${phaseDuration}s ease-in-out`,
              background: 'radial-gradient(circle, hsla(180, 50%, 70%, 0.6), hsla(145, 40%, 55%, 0.4))',
              boxShadow: '0 0 40px 15px hsla(160, 45%, 60%, 0.3)',
              animation: 'breathe-glow 3s ease-in-out infinite',
            }}
          />
        </div>
        <p className={`text-2xl font-light ${textClass} transition-opacity duration-500`}>
          {phaseLabels[phase]}
        </p>
        <p className={`text-sm ${mutedClass}`}>
          Cycle {Math.min(cycle, maxCycles)} of {maxCycles}
        </p>
      </div>

      {/* Bottom buttons */}
      <div className="flex flex-col gap-grid-2 w-full max-w-[400px]">
        <div className="flex gap-grid-2">
          <button
            onClick={handleKeepGoing}
            className={`flex-1 py-grid-2 rounded-button text-sm font-medium min-h-[48px] ${
              darkMode ? 'bg-sos-text/10 text-sos-text border border-sos-text/20' : 'bg-muted text-foreground'
            }`}
          >
            Keep going
          </button>
          <button
            onClick={handleFeelBetter}
            className={`flex-1 py-grid-2 rounded-button text-sm font-medium min-h-[48px] ${
              darkMode ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground'
            }`}
          >
            I feel better
          </button>
        </div>
        <button
          onClick={handleFeelBetter}
          className={`w-full py-grid text-xs font-medium min-h-[36px] rounded-button ${
            darkMode ? 'text-sos-text/40' : 'text-muted-foreground'
          }`}
        >
          Take a break — even a few breaths count 💚
        </button>
      </div>
    </div>
  );
};

export default BreathingAnimation;
