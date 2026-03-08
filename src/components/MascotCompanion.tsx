import { useMemo } from 'react';
import mascotHappy from '@/assets/mascot-happy.png';
import mascotProud from '@/assets/mascot-proud.png';
import mascotSleepy from '@/assets/mascot-sleepy.png';
import mascotWave from '@/assets/mascot-wave.png';
import { getGardenStats, getMascotMood, getMascotMessage, type MascotMood } from '@/lib/garden';
import { getData } from '@/lib/storage';

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
  const message = getMascotMessage(stats, name || undefined);

  return (
    <div className="flex items-start gap-grid-2">
      <div className="w-16 h-16 flex-shrink-0 animate-fade-in">
        <img
          src={mascotImages[mood]}
          alt={`Breeze the fox is feeling ${mood}`}
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>
      <div className="flex-1 bg-card rounded-card p-grid-2 card-shadow relative animate-fade-in">
        {/* Speech bubble tail */}
        <div className="absolute left-[-6px] top-4 w-3 h-3 bg-card rotate-45 card-shadow" />
        <div className="absolute left-[-4px] top-[14px] w-3 h-4 bg-card z-10" />
        <p className="text-sm text-foreground leading-relaxed relative z-10">{message}</p>
      </div>
    </div>
  );
};

export default MascotCompanion;
