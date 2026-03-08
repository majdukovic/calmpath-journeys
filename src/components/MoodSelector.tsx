import { moodOptions } from '@/lib/data';

interface Props {
  selected: number | null;
  onSelect: (value: number) => void;
}

const MoodSelector = ({ selected, onSelect }: Props) => {
  return (
    <div className="flex justify-center gap-grid-2">
      {moodOptions.map(opt => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`flex flex-col items-center gap-1 p-grid rounded-card min-w-[56px] min-h-[48px] transition-all ${
            selected === opt.value
              ? 'bg-primary/10 ring-2 ring-primary scale-110'
              : 'hover:bg-muted'
          }`}
          aria-label={opt.label}
        >
          <span className="text-2xl">{opt.emoji}</span>
          <span className="text-[10px] text-muted-foreground">{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
