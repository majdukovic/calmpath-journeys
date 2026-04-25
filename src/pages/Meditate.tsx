import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Clock, Headphones, Play } from 'lucide-react';
import { usePremium } from '@/contexts/PremiumContext';
import {
  guidedMeditations,
  getRecommendedMeditation,
  filterByIntention,
  groupByCategory,
  formatDuration,
  voiceProfiles,
  type Intention,
  type GuidedMeditation,
} from '@/lib/meditations';

const intentions: { id: Intention; emoji: string; label: string }[] = [
  { id: 'calm', emoji: '🧘', label: 'Calm' },
  { id: 'energize', emoji: '⚡', label: 'Energy' },
  { id: 'focus', emoji: '🎯', label: 'Focus' },
  { id: 'release', emoji: '🌊', label: 'Release' },
  { id: 'sleep', emoji: '🌙', label: 'Sleep' },
  { id: 'self-love', emoji: '💜', label: 'Love' },
];

const MeditationCard = ({
  meditation,
  isPremium,
  isRecommended,
  onPlay,
}: {
  meditation: GuidedMeditation;
  isPremium: boolean;
  isRecommended?: boolean;
  onPlay: (id: string, voice: string) => void;
}) => {
  const defaultVoice = voiceProfiles.find(v => v.id === meditation.defaultVoice)!;
  const isLocked = meditation.premium && !isPremium;

  return (
    <button
      onClick={() => onPlay(meditation.id, meditation.defaultVoice)}
      className={`w-full rounded-card p-grid-3 text-left transition-all hover:card-shadow-hover ${
        isRecommended
          ? 'bg-primary/5 border border-primary/20 card-shadow'
          : 'bg-card card-shadow'
      }`}
    >
      <div className="flex items-start gap-grid-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-2xl">{meditation.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-foreground truncate">{meditation.title}</h3>
            {isLocked && <Crown size={14} className="text-amber-500 shrink-0" />}
            {isRecommended && (
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                FOR YOU
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{meditation.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} />
              {formatDuration(meditation.duration)}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Headphones size={12} />
              {defaultVoice.name}
            </span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
          <Play size={14} className="text-primary ml-0.5" />
        </div>
      </div>
    </button>
  );
};

const Meditate = () => {
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const [activeIntention, setActiveIntention] = useState<Intention | null>(null);

  const recommended = getRecommendedMeditation();
  const filtered = filterByIntention(activeIntention);
  const grouped = groupByCategory(filtered);

  const handlePlay = (meditationId: string, voice: string) => {
    const meditation = guidedMeditations.find(m => m.id === meditationId);
    if (!meditation) return;

    if (meditation.premium && !isPremium) {
      navigate('/upgrade');
      return;
    }

    navigate(`/meditation-player?id=${meditationId}&voice=${voice}`);
  };

  return (
    <div className="py-grid-4 flex flex-col gap-grid-3">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Guided Meditations</h1>
        <p className="text-xs text-muted-foreground mt-0.5">AI-voiced sessions with ambient sounds</p>
      </div>

          {/* Intention filter chips */}
          <div>
            <p className="text-sm text-muted-foreground mb-grid">What do you need right now?</p>
            <div className="flex flex-wrap gap-2">
              {intentions.map(intent => {
                const isActive = activeIntention === intent.id;
                return (
                  <button
                    key={intent.id}
                    onClick={() => setActiveIntention(isActive ? null : intent.id)}
                    className={`flex items-center gap-1.5 px-grid-2 py-1.5 rounded-button text-sm font-medium min-h-[36px] transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    <span>{intent.emoji}</span>
                    <span>{intent.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommended — only when no filter active */}
          {!activeIntention && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-grid">
                Recommended right now
              </p>
              <MeditationCard
                meditation={recommended}
                isPremium={isPremium}
                isRecommended
                onPlay={handlePlay}
              />
            </div>
          )}

          {/* Grouped by category */}
          {grouped.map(group => (
            <div key={group.category}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-grid">
                {group.emoji} {group.label}
              </p>
              <div className="flex flex-col gap-grid-2">
                {group.items.map(m => (
                  <MeditationCard
                    key={m.id}
                    meditation={m}
                    isPremium={isPremium}
                    isRecommended={!activeIntention && m.id === recommended.id}
                    onPlay={handlePlay}
                  />
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-grid-4">
              No meditations match this filter yet. More coming soon!
            </p>
          )}

          {/* Premium CTA for free users */}
          {!isPremium && (
            <button
              onClick={() => navigate('/upgrade')}
              className="bg-gradient-to-r from-amber-500/10 to-primary/10 rounded-card p-grid-3 text-center transition-all hover:card-shadow-hover"
            >
              <Crown size={20} className="text-amber-500 mx-auto mb-1" />
              <p className="text-sm font-semibold text-foreground">Unlock all meditations</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {guidedMeditations.length} guided sessions with calming AI voices
              </p>
            </button>
          )}

      {/* Bottom padding for scroll comfort */}
      <div className="h-grid-4" />
    </div>
  );
};

export default Meditate;
