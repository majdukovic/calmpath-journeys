import { useEffect, useState, useMemo } from 'react';
import { hapticCelebration } from '@/lib/haptics';

interface Props {
  show: boolean;
  milestone?: { emoji: string; label: string } | null;
}

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  drift: number;
}

const COLORS = [
  'hsl(155, 35%, 55%)', // primary sage
  'hsl(20, 80%, 75%)',  // accent peach
  'hsl(245, 30%, 72%)', // secondary lavender
  'hsl(45, 80%, 70%)',  // warm gold
  'hsl(340, 60%, 75%)', // soft pink
];

const CelebrationOverlay = ({ show, milestone }: Props) => {
  const [visible, setVisible] = useState(false);

  const particles: Particle[] = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 1.5 + Math.random() * 1.5,
      color: COLORS[i % COLORS.length],
      size: 4 + Math.random() * 6,
      drift: (Math.random() - 0.5) * 80,
    })),
  []);

  useEffect(() => {
    if (show) {
      setVisible(true);
      hapticCelebration();
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {/* Confetti particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: '-10px',
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            '--drift': `${p.drift}px`,
            transform: `rotate(${Math.random() * 360}deg)`,
          } as React.CSSProperties}
        />
      ))}

      {/* Milestone badge pop-in */}
      {milestone && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex flex-col items-center gap-grid-2 animate-soft-pop"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="text-6xl">{milestone.emoji}</div>
            <div className="bg-card/90 backdrop-blur-sm rounded-card px-grid-3 py-grid-2 card-shadow">
              <p className="text-sm font-semibold text-foreground text-center">{milestone.label}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CelebrationOverlay;
