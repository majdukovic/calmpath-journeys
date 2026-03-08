import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';

interface SoundOption {
  id: string;
  emoji: string;
  label: string;
  // We use Web Audio API oscillators to generate ambient sounds
  // No external audio files needed
}

const soundOptions: SoundOption[] = [
  { id: 'rain', emoji: '🌧', label: 'Rain' },
  { id: 'ocean', emoji: '🌊', label: 'Ocean' },
  { id: 'forest', emoji: '🌲', label: 'Forest' },
  { id: 'wind', emoji: '💨', label: 'Wind' },
  { id: 'night', emoji: '🌙', label: 'Night' },
];

// Generate ambient noise using Web Audio API
function createNoiseGenerator(ctx: AudioContext, type: string): { start: () => void; stop: () => void } {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  // Generate white noise base
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gainNode = ctx.createGain();
  gainNode.gain.value = 0;

  // Different filter profiles for different sounds
  const filter = ctx.createBiquadFilter();
  
  switch (type) {
    case 'rain':
      filter.type = 'bandpass';
      filter.frequency.value = 3000;
      filter.Q.value = 0.5;
      gainNode.gain.value = 0.15;
      break;
    case 'ocean':
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      filter.Q.value = 1;
      gainNode.gain.value = 0.2;
      break;
    case 'forest':
      filter.type = 'bandpass';
      filter.frequency.value = 1500;
      filter.Q.value = 0.3;
      gainNode.gain.value = 0.08;
      break;
    case 'wind':
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      filter.Q.value = 0.7;
      gainNode.gain.value = 0.12;
      break;
    case 'night':
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 0.2;
      gainNode.gain.value = 0.06;
      break;
  }

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  return {
    start: () => {
      source.start();
      // Fade in
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(gainNode.gain.value, ctx.currentTime + 1);
    },
    stop: () => {
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      setTimeout(() => {
        try { source.stop(); } catch {}
      }, 600);
    },
  };
}

const AmbientSounds = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const generatorRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  const stopSound = () => {
    if (generatorRef.current) {
      generatorRef.current.stop();
      generatorRef.current = null;
    }
    if (ctxRef.current) {
      setTimeout(() => {
        ctxRef.current?.close();
        ctxRef.current = null;
      }, 700);
    }
    setActiveSound(null);
  };

  const playSound = (soundId: string) => {
    // Stop current
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
    const gen = createNoiseGenerator(ctx, soundId);
    generatorRef.current = gen;
    gen.start();
    setActiveSound(soundId);
  };

  // Cleanup on unmount
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
          return (
            <button
              key={sound.id}
              onClick={() => playSound(sound.id)}
              className={`flex items-center gap-1.5 px-grid-2 py-grid rounded-button text-sm font-medium min-h-[40px] transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              <span>{sound.emoji}</span>
              <span>{sound.label}</span>
              {isActive && <Volume2 size={14} />}
            </button>
          );
        })}
      </div>
      {activeSound && (
        <button
          onClick={stopSound}
          className="mt-grid-2 flex items-center gap-grid text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[32px]"
        >
          <VolumeX size={14} />
          <span>Stop sound</span>
        </button>
      )}
    </div>
  );
};

export default AmbientSounds;
