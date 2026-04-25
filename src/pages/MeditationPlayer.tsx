import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Check, ArrowLeft, Headphones } from 'lucide-react';
import { guidedMeditations, voiceProfiles, formatTime, getAudioPath, type VoiceId } from '@/lib/meditations';
import { meditationPlayer, type AudioPlayerState } from '@/lib/audioPlayer';
import { createSoundGenerator } from '@/lib/soundEngine';
import { addMeditationSession, toLocalDateStr } from '@/lib/storage';
import { hapticTap } from '@/lib/haptics';

type Screen = 'player' | 'complete';

const MeditationPlayer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const meditationId = searchParams.get('id');
  const voiceParam = searchParams.get('voice') as VoiceId | null;

  const meditation = guidedMeditations.find(m => m.id === meditationId);
  const [voice, setVoice] = useState<VoiceId>(voiceParam || meditation?.defaultVoice || 'luna');
  const [screen, setScreen] = useState<Screen>('player');
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    playing: false, currentTime: 0, duration: 0, loading: false, error: null,
  });
  const [ambientOn, setAmbientOn] = useState(true);
  const [seeking, setSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const savedPositionRef = useRef(0);
  const completionTrackedRef = useRef(false);

  // Ambient sound refs
  const ambientCtxRef = useRef<AudioContext | null>(null);
  const ambientGenRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  const startAmbient = useCallback(() => {
    if (!meditation || ambientCtxRef.current) return;
    try {
      const ctx = new AudioContext();
      ambientCtxRef.current = ctx;
      const gen = createSoundGenerator(ctx, meditation.ambientSound);
      ambientGenRef.current = gen;
      gen.start();
    } catch {}
  }, [meditation]);

  const stopAmbient = useCallback(() => {
    if (ambientGenRef.current) {
      try { ambientGenRef.current.stop(); } catch {}
      ambientGenRef.current = null;
    }
    if (ambientCtxRef.current) {
      const ctx = ambientCtxRef.current;
      ambientCtxRef.current = null;
      setTimeout(() => { try { ctx.close(); } catch {} }, 1200);
    }
  }, []);

  // Subscribe to player state
  useEffect(() => {
    return meditationPlayer.subscribe(setPlayerState);
  }, []);

  // Track completion when audio ends
  useEffect(() => {
    if (!meditation) return;
    if (!completionTrackedRef.current && !playerState.playing && playerState.currentTime > 0 && playerState.duration > 0) {
      // Consider complete if played >80% or reached the end
      const ratio = playerState.currentTime / playerState.duration;
      if (ratio >= 0.8) {
        completionTrackedRef.current = true;
        addMeditationSession({
          date: toLocalDateStr(),
          meditationId: meditation.id,
          voice,
          completedAt: new Date().toISOString(),
          durationSecs: Math.round(playerState.currentTime),
        });
        hapticTap();
        setScreen('complete');
        stopAmbient();
      }
    }
  }, [playerState.playing, playerState.currentTime, playerState.duration, meditation, voice, stopAmbient]);

  // Load audio on mount or voice change (preserve position)
  useEffect(() => {
    if (!meditation) return;

    const audioPath = getAudioPath(meditation.id, voice);
    const resumeTime = savedPositionRef.current;

    meditationPlayer.load(audioPath).then(() => {
      if (resumeTime > 0) {
        meditationPlayer.seek(resumeTime);
      }
      meditationPlayer.play();
      if (ambientOn) startAmbient();
    }).catch(() => {
      // Audio file not available
    });

    return () => {
      meditationPlayer.cleanup();
      stopAmbient();
    };
  }, [meditation, voice]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync ambient with play/pause state
  useEffect(() => {
    if (!ambientOn) {
      stopAmbient();
      return;
    }
    if (playerState.playing && !ambientGenRef.current) {
      startAmbient();
    } else if (!playerState.playing && ambientGenRef.current) {
      stopAmbient();
    }
  }, [ambientOn, playerState.playing]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!meditation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Meditation not found</p>
      </div>
    );
  }

  const currentVoice = voiceProfiles.find(v => v.id === voice)!;
  const displayTime = seeking ? seekTime : playerState.currentTime;
  const progress = playerState.duration > 0 ? (displayTime / playerState.duration) * 100 : 0;

  const handleClose = () => {
    meditationPlayer.cleanup();
    stopAmbient();
    navigate(-1);
  };

  const handleVoiceSwitch = () => {
    const otherVoices = meditation.availableVoices.filter(v => v !== voice);
    if (otherVoices.length > 0) {
      // Save current position before switching
      savedPositionRef.current = playerState.currentTime;
      stopAmbient();
      setVoice(otherVoices[0]);
    }
  };

  // ─── Completion screen ─────────────────────────────────────────

  if (screen === 'complete') {
    return (
      <div
        className="min-h-screen bg-background flex flex-col items-center justify-center px-grid-3"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-grid-3">
          <Check size={36} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground text-center">Well done</h1>
        <p className="text-sm text-muted-foreground text-center mt-grid max-w-[280px]">
          You completed <span className="font-semibold text-foreground">{meditation.title}</span>.
          Take this calm with you.
        </p>

        <div className="flex flex-col gap-grid-2 mt-grid-4 w-full max-w-[320px]">
          <button
            onClick={() => navigate('/meditate')}
            className="w-full py-grid-2 rounded-button bg-primary text-primary-foreground font-semibold min-h-[48px] transition-all hover:opacity-90"
          >
            More meditations
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-grid-2 rounded-button bg-muted text-foreground font-semibold min-h-[48px] transition-all hover:card-shadow-hover"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  // ─── Player screen ─────────────────────────────────────────────

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-grid-2 pt-grid-2">
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-grid-3 max-w-[480px] mx-auto w-full">
        {/* Animated visual */}
        <div className="relative mb-grid-4">
          <div
            className="w-40 h-40 rounded-full bg-primary/8 flex items-center justify-center"
            style={{
              animation: playerState.playing ? 'meditationPulse 6s ease-in-out infinite' : 'none',
            }}
          >
            <div
              className="w-28 h-28 rounded-full bg-primary/12 flex items-center justify-center"
              style={{
                animation: playerState.playing ? 'meditationPulse 6s ease-in-out infinite 0.5s' : 'none',
              }}
            >
              <span className="text-5xl">{meditation.emoji}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground text-center">{meditation.title}</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">{meditation.subtitle}</p>

        {/* Progress bar */}
        <div className="w-full mt-grid-4 px-grid">
          <input
            type="range"
            min={0}
            max={playerState.duration || 1}
            step={0.1}
            value={displayTime}
            onChange={(e) => {
              setSeeking(true);
              setSeekTime(parseFloat(e.target.value));
            }}
            onMouseUp={() => {
              meditationPlayer.seek(seekTime);
              setSeeking(false);
            }}
            onTouchEnd={() => {
              meditationPlayer.seek(seekTime);
              setSeeking(false);
            }}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${progress}%, hsl(var(--muted)) ${progress}%)`,
            }}
            aria-label="Seek"
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-muted-foreground tabular-nums">{formatTime(displayTime)}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{formatTime(playerState.duration)}</span>
          </div>
        </div>

        {/* Transport controls */}
        <div className="flex items-center justify-center gap-grid-4 mt-grid-3">
          <button
            onClick={() => meditationPlayer.skip(-15)}
            className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-foreground hover:bg-muted transition-colors"
            aria-label="Rewind 15 seconds"
          >
            <SkipBack size={20} />
            <span className="text-[9px] text-muted-foreground -mt-0.5">15</span>
          </button>
          <button
            onClick={() => meditationPlayer.toggle()}
            className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center card-shadow transition-transform hover:scale-105 active:scale-95"
            aria-label={playerState.playing ? 'Pause' : 'Play'}
          >
            {playerState.playing ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          <button
            onClick={() => meditationPlayer.skip(15)}
            className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-foreground hover:bg-muted transition-colors"
            aria-label="Forward 15 seconds"
          >
            <SkipForward size={20} />
            <span className="text-[9px] text-muted-foreground -mt-0.5">15</span>
          </button>
        </div>

        {/* Voice & ambient controls */}
        <div className="flex items-center justify-center gap-2 mt-grid-4">
          {meditation.availableVoices.length > 1 && (
            <button
              onClick={handleVoiceSwitch}
              className="flex items-center gap-1.5 px-grid-2 py-1.5 rounded-button text-xs font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors min-h-[36px]"
            >
              <Headphones size={13} />
              {currentVoice.name}
            </button>
          )}
          <button
            onClick={() => setAmbientOn(!ambientOn)}
            className={`flex items-center gap-1.5 px-grid-2 py-1.5 rounded-button text-xs font-medium min-h-[36px] transition-colors ${
              ambientOn
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {ambientOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
            Ambient
          </button>
        </div>

        {/* Loading / error states */}
        {playerState.loading && (
          <p className="text-sm text-muted-foreground mt-grid-3 animate-pulse">Loading...</p>
        )}
        {playerState.error && (
          <div className="mt-grid-3 bg-muted rounded-2xl p-grid-2 text-center max-w-[320px]">
            <p className="text-sm text-muted-foreground">Audio not available yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              This meditation's audio is being prepared.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes meditationPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MeditationPlayer;
