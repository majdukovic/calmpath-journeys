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
      <div className="w-16 h-16 flex-shrink-0 animate-float">
        <img
          src={mascotImages[mood]}
          alt={`Breeze the fox is feeling ${mood}`}
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>
      <div className="flex-1 gradient-calm rounded-2xl p-grid-2 card-shadow relative">
        {/* Speech bubble tail — uses CSS variable for theme awareness */}
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

export default MascotCompanion;
