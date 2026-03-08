import { useMemo, useEffect } from 'react';
import mascotHappy from '@/assets/mascot-happy.png';
import mascotProud from '@/assets/mascot-proud.png';
import mascotSleepy from '@/assets/mascot-sleepy.png';
import mascotWave from '@/assets/mascot-wave.png';
import { getGardenStats, getMascotMood, getMascotMessage, type MascotMood } from '@/lib/garden';
import { getData, getDaysSinceLastOpen, markAppOpened, getTotalCalmDays } from '@/lib/storage';

const mascotImages: Record<MascotMood, string> = {
  happy: mascotHappy,
  proud: mascotProud,
  sleepy: mascotSleepy,
  wave: mascotWave,
};

const MascotCompanion = () => {
  const stats = useMemo(() => getGardenStats(), []);
  const mood = getMascotMood(stats);
  const name = getData().settings.name;
  const daysSinceLastOpen = getDaysSinceLastOpen();
  const totalDays = getTotalCalmDays();
  const message = getReturnAwareMessage(stats, name || undefined, daysSinceLastOpen, totalDays);

  // Mark app as opened on mount
  useEffect(() => {
    markAppOpened();
  }, []);

  return (
    <div className="flex items-start gap-grid-2">
      <div className="w-16 h-16 flex-shrink-0 animate-float">
        <img
          src={mascotImages[mood]}
          alt={`Breeze the fox is feeling ${mood}`}
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>
      <div className="flex-1 gradient-calm rounded-2xl p-grid-2 card-shadow relative">
        <div
          className="absolute left-[-6px] top-4 w-3 h-3 rotate-45 bg-primary-light"
        />
        <div
          className="absolute left-[-4px] top-[14px] w-3 h-4 z-10 bg-primary-light"
        />
        <p className="text-sm text-foreground leading-relaxed relative z-10 font-medium">{message}</p>
      </div>
    </div>
  );
};

/** Enhanced message that accounts for return-welcome */
function getReturnAwareMessage(
  stats: Parameters<typeof getMascotMessage>[0],
  name: string | undefined,
  daysSinceLastOpen: number,
  totalDays: number,
): string {
  const greeting = name ? `${name}, ` : '';

  // Return welcome — user hasn't opened app in 2+ days
  if (daysSinceLastOpen >= 5) {
    const longAway = [
      `${greeting}welcome back! 💚 I've been here, tending the garden. No rush — I'm just happy to see you.`,
      `${greeting}you're here! 🦊 That's all that matters. The garden waited patiently for you.`,
      `Hey ${greeting}it's so good to see you again! Your garden kept growing while you rested 🌱`,
    ];
    return longAway[Math.floor(Date.now() / 86400000) % longAway.length];
  }

  if (daysSinceLastOpen >= 2) {
    const shortAway = [
      `${greeting}welcome back! 🦊 Taking breaks is part of the journey too.`,
      `${greeting}I missed you! But rest is important. Ready for a gentle moment? 💚`,
      `${greeting}you're back! 🌿 Every return is a small act of kindness to yourself.`,
    ];
    return shortAway[Math.floor(Date.now() / 86400000) % shortAway.length];
  }

  // If they have a nice total days count, mention it sometimes
  if (totalDays > 0 && totalDays % 5 === 0 && stats.daysSinceLastActivity <= 1) {
    return `${greeting}${totalDays} days of showing up! That's something to be proud of 🌟`;
  }

  // Fall through to normal mascot message
  return getMascotMessage(stats, name);
}

export default MascotCompanion;
