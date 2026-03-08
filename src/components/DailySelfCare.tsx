import { useState, useMemo, useCallback } from 'react';
import { getData, saveData } from '@/lib/storage';
import { Check } from 'lucide-react';
import { hapticTap } from '@/lib/haptics';

interface SelfCareTask {
  id: string;
  emoji: string;
  label: string;
  category: 'body' | 'mind' | 'connect';
}

// Gentle, kind micro-tasks — inspired by Finch's approach
// Rotates daily so it feels fresh
const allTasks: SelfCareTask[] = [
  // Body
  { id: 'water', emoji: '💧', label: 'Drink a glass of water', category: 'body' },
  { id: 'stretch', emoji: '🧘', label: 'Stretch for 2 minutes', category: 'body' },
  { id: 'walk', emoji: '🚶', label: 'Take a short walk', category: 'body' },
  { id: 'snack', emoji: '🍎', label: 'Eat something nourishing', category: 'body' },
  { id: 'rest', emoji: '😌', label: 'Close your eyes for 1 minute', category: 'body' },
  { id: 'fresh-air', emoji: '🌤', label: 'Step outside for fresh air', category: 'body' },
  { id: 'posture', emoji: '🪑', label: 'Check your posture', category: 'body' },
  { id: 'face-wash', emoji: '🫧', label: 'Wash your face', category: 'body' },
  // Mind
  { id: 'kind-word', emoji: '💛', label: 'Say something kind to yourself', category: 'mind' },
  { id: 'deep-breath', emoji: '🌬', label: 'Take 3 deep breaths', category: 'mind' },
  { id: 'gratitude', emoji: '🙏', label: 'Name one thing you\'re grateful for', category: 'mind' },
  { id: 'let-go', emoji: '🎈', label: 'Let go of one worry', category: 'mind' },
  { id: 'smile', emoji: '😊', label: 'Smile, even for a moment', category: 'mind' },
  { id: 'present', emoji: '🕊', label: 'Notice 3 things around you', category: 'mind' },
  { id: 'celebrate', emoji: '🎉', label: 'Celebrate one small win', category: 'mind' },
  { id: 'forgive', emoji: '💚', label: 'Forgive yourself for something small', category: 'mind' },
  // Connect
  { id: 'text-friend', emoji: '💬', label: 'Text someone you care about', category: 'connect' },
  { id: 'listen', emoji: '🎵', label: 'Listen to a song you love', category: 'connect' },
  { id: 'comfort', emoji: '🧸', label: 'Hold something comforting', category: 'connect' },
  { id: 'nature', emoji: '🌿', label: 'Notice something in nature', category: 'connect' },
];

// Pick 5 tasks for today based on date seed (so they're stable throughout the day)
function getTodaysTasks(): SelfCareTask[] {
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
  const shuffled = [...allTasks].sort((a, b) => {
    const hashA = (seed * 31 + a.id.charCodeAt(0)) % 100;
    const hashB = (seed * 31 + b.id.charCodeAt(0)) % 100;
    return hashA - hashB;
  });
  // Pick 1-2 from each category for balance
  const body = shuffled.filter(t => t.category === 'body').slice(0, 2);
  const mind = shuffled.filter(t => t.category === 'mind').slice(0, 2);
  const connect = shuffled.filter(t => t.category === 'connect').slice(0, 1);
  return [...body, ...mind, ...connect];
}

const DailySelfCare = () => {
  const today = new Date().toISOString().split('T')[0];
  const tasks = useMemo(() => getTodaysTasks(), []);
  const data = getData();
  const todayCompleted = data.selfCareTasks
    ?.filter(t => t.date === today)
    .map(t => t.taskId) || [];
  
  const [completed, setCompleted] = useState<string[]>(todayCompleted);

  const toggleTask = useCallback((taskId: string) => {
    const currentData = getData();
    const isCompleted = completed.includes(taskId);
    
    if (isCompleted) {
      // Remove
      currentData.selfCareTasks = (currentData.selfCareTasks || [])
        .filter(t => !(t.date === today && t.taskId === taskId));
      setCompleted(prev => prev.filter(id => id !== taskId));
    } else {
      // Add
      currentData.selfCareTasks = [...(currentData.selfCareTasks || []), { date: today, taskId }];
      setCompleted(prev => [...prev, taskId]);
    }
    saveData(currentData);
  }, [completed, today]);

  const completedCount = completed.length;
  const totalCount = tasks.length;

  return (
    <div className="bg-card rounded-card p-grid-3 card-shadow">
      <div className="flex items-center justify-between mb-grid-2">
        <h2 className="text-base font-semibold text-foreground">Daily Self-Care 🌸</h2>
        <span className="text-xs text-muted-foreground font-medium">
          {completedCount}/{totalCount}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-grid-2">
        Small acts of kindness toward yourself. No pressure — do what feels right.
      </p>
      <div className="space-y-1">
        {tasks.map(task => {
          const isDone = completed.includes(task.id);
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full flex items-center gap-grid-2 px-grid-2 py-grid rounded-xl text-left min-h-[44px] transition-all ${
                isDone
                  ? 'bg-primary/8 text-foreground/60'
                  : 'hover:bg-muted/50 text-foreground'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isDone
                    ? 'bg-primary text-primary-foreground'
                    : 'border-2 border-border'
                }`}
              >
                {isDone && <Check size={14} strokeWidth={3} />}
              </div>
              <span className="text-lg flex-shrink-0">{task.emoji}</span>
              <span className={`text-sm font-medium ${isDone ? 'line-through opacity-60' : ''}`}>
                {task.label}
              </span>
            </button>
          );
        })}
      </div>
      {completedCount === totalCount && totalCount > 0 && (
        <div className="mt-grid-2 text-center animate-fade-in">
          <p className="text-sm text-primary font-semibold">
            🌟 You took care of yourself today. Breeze is proud!
          </p>
        </div>
      )}
    </div>
  );
};

export default DailySelfCare;
