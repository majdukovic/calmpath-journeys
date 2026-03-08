import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, X, Lock } from 'lucide-react';
import { createSoundGenerator } from '@/lib/soundEngine';
import { usePremium } from '@/contexts/PremiumContext';
import { useNavigate } from 'react-router-dom';

interface SoundOption {
  id: string;
  emoji: string;
  label: string;
  description: string;
  premium?: boolean;
}

const soundOptions: SoundOption[] = [
  { id: 'rain', emoji: '🌧', label: 'Rain', description: 'Gentle rainfall with droplets' },
  { id: 'ocean', emoji: '🌊', label: 'Ocean', description: 'Rolling waves on shore' },
  { id: 'forest', emoji: '🌲', label: 'Forest', description: 'Birds & rustling leaves', premium: true },
  { id: 'wind', emoji: '💨', label: 'Wind', description: 'Gusting breeze', premium: true },
  { id: 'night', emoji: '🌙', label: 'Night', description: 'Crickets & quiet dark', premium: true },
];

const AmbientSounds = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const generatorRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  const stopSound = () => {
    if (generatorRef.current) {
      generatorRef.current.stop();
      generatorRef.current = null;
    }
    if (ctxRef.current) {
      setTimeout(() => {
        ctxRef.current?.close();
        ctxRef.current = null;
      }, 1200);
    }
    setActiveSound(null);
  };

  const playSound = (soundId: string) => {
    if (generatorRef.current) {
      generatorRef.current.stop();
      generatorRef.current = null;
      if (ctxRef.current) {
        ctxRef.current.close();
        ctxRef.current = null;
      }
    }

    if (activeSound === soundId) {
      setActiveSound(null);
      return;
    }

    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const gen = createSoundGenerator(ctx, soundId);
    generatorRef.current = gen;
    gen.start();
    setActiveSound(soundId);
  };

  useEffect(() => {
    return () => {
      if (generatorRef.current) {
        try { generatorRef.current.stop(); } catch {}
      }
      if (ctxRef.current) {
        try { ctxRef.current.close(); } catch {}
      }
    };
  }, []);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full bg-card rounded-card p-grid-2 card-shadow text-left min-h-[48px] transition-all hover:card-shadow-hover flex items-center gap-grid-2"
      >
        <span className="text-2xl">🎧</span>
        <div>
          <span className="text-sm font-semibold text-foreground block">Calm Sounds</span>
          <span className="text-xs text-muted-foreground">Ambient sounds for focus & relaxation</span>
        </div>
      </button>
    );
  }

  const activeInfo = soundOptions.find(s => s.id === activeSound);

  return (
    <div className="bg-card rounded-card p-grid-3 card-shadow">
      <div className="flex items-center justify-between mb-grid-2">
        <h2 className="text-base font-semibold text-foreground">Calm Sounds 🎧</h2>
        <button
          onClick={() => {
            stopSound();
            setExpanded(false);
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close sounds"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {soundOptions.map(sound => {
          const isActive = activeSound === sound.id;
          const isLocked = sound.premium && !isPremium;
          return (
            <button
              key={sound.id}
              onClick={() => {
                if (isLocked) {
                  navigate('/upgrade');
                  return;
                }
                playSound(sound.id);
              }}
              className={`flex items-center gap-1.5 px-grid-2 py-grid rounded-button text-sm font-medium min-h-[40px] transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : isLocked
                    ? 'bg-muted/50 text-muted-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
              title={sound.description}
            >
              <span>{sound.emoji}</span>
              <span>{sound.label}</span>
              {isActive && <Volume2 size={14} />}
              {isLocked && <Lock size={12} />}
            </button>
          );
        })}
      </div>
      {activeSound && activeInfo && (
        <div className="mt-grid-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{activeInfo.description}</span>
          <button
            onClick={stopSound}
            className="flex items-center gap-grid text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[32px]"
          >
            <VolumeX size={14} />
            <span>Stop</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AmbientSounds;
