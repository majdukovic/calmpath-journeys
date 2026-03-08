import { useState, useMemo, useCallback } from 'react';
import { getData, saveData, CustomSelfCareTask, toLocalDateStr } from '@/lib/storage';
import { Check, Pencil, Plus, Trash2, Info, X } from 'lucide-react';
import { hapticTap } from '@/lib/haptics';

interface SelfCareTask {
  id: string;
  emoji: string;
  label: string;
  category: 'body' | 'mind' | 'connect';
}

const allTasks: SelfCareTask[] = [
  { id: 'water', emoji: '💧', label: 'Drink a glass of water', category: 'body' },
  { id: 'stretch', emoji: '🧘', label: 'Stretch for 2 minutes', category: 'body' },
  { id: 'walk', emoji: '🚶', label: 'Take a short walk', category: 'body' },
  { id: 'snack', emoji: '🍎', label: 'Eat something nourishing', category: 'body' },
  { id: 'rest', emoji: '😌', label: 'Close your eyes for 1 minute', category: 'body' },
  { id: 'fresh-air', emoji: '🌤', label: 'Step outside for fresh air', category: 'body' },
  { id: 'posture', emoji: '🪑', label: 'Check your posture', category: 'body' },
  { id: 'face-wash', emoji: '🫧', label: 'Wash your face', category: 'body' },
  { id: 'kind-word', emoji: '💛', label: 'Say something kind to yourself', category: 'mind' },
  { id: 'deep-breath', emoji: '🌬', label: 'Take 3 deep breaths', category: 'mind' },
  { id: 'gratitude', emoji: '🙏', label: 'Name one thing you\'re grateful for', category: 'mind' },
  { id: 'let-go', emoji: '🎈', label: 'Let go of one worry', category: 'mind' },
  { id: 'smile', emoji: '😊', label: 'Smile, even for a moment', category: 'mind' },
  { id: 'present', emoji: '🕊', label: 'Notice 3 things around you', category: 'mind' },
  { id: 'celebrate', emoji: '🎉', label: 'Celebrate one small win', category: 'mind' },
  { id: 'forgive', emoji: '💚', label: 'Forgive yourself for something small', category: 'mind' },
  { id: 'text-friend', emoji: '💬', label: 'Text someone you care about', category: 'connect' },
  { id: 'listen', emoji: '🎵', label: 'Listen to a song you love', category: 'connect' },
  { id: 'comfort', emoji: '🧸', label: 'Hold something comforting', category: 'connect' },
  { id: 'nature', emoji: '🌿', label: 'Notice something in nature', category: 'connect' },
];

function getTodaysTasks(): SelfCareTask[] {
  const today = new Date().toISOString().split('T')[0];
  const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
  const shuffled = [...allTasks].sort((a, b) => {
    const hashA = (seed * 31 + a.id.charCodeAt(0)) % 100;
    const hashB = (seed * 31 + b.id.charCodeAt(0)) % 100;
    return hashA - hashB;
  });
  const body = shuffled.filter(t => t.category === 'body').slice(0, 2);
  const mind = shuffled.filter(t => t.category === 'mind').slice(0, 2);
  const connect = shuffled.filter(t => t.category === 'connect').slice(0, 1);
  return [...body, ...mind, ...connect];
}

const QUICK_EMOJIS = ['⭐', '💪', '📚', '🏃', '🎨', '🧹', '💤', '🥗', '🫂', '✍️', '🧘', '🌊'];

const DailySelfCare = () => {
  const today = new Date().toISOString().split('T')[0];
  const defaultTasks = useMemo(() => getTodaysTasks(), []);
  const data = getData();

  const [customTasks, setCustomTasks] = useState<CustomSelfCareTask[]>(
    data.customSelfCareTasks || []
  );
  const [completed, setCompleted] = useState<string[]>(
    data.selfCareTasks?.filter(t => t.date === today).map(t => t.taskId) || []
  );
  const [editing, setEditing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newEmoji, setNewEmoji] = useState('⭐');

  // Merge default rotation + custom (custom always show)
  const allDisplayTasks = useMemo(() => [
    ...defaultTasks.map(t => ({ ...t, isCustom: false })),
    ...customTasks.map(t => ({ ...t, isCustom: true })),
  ], [defaultTasks, customTasks]);

  const totalCount = allDisplayTasks.length;
  const completedCount = completed.filter(id => allDisplayTasks.some(t => t.id === id)).length;

  const toggleTask = useCallback((taskId: string) => {
    const currentData = getData();
    const isCompleted = completed.includes(taskId);

    if (isCompleted) {
      currentData.selfCareTasks = (currentData.selfCareTasks || [])
        .filter(t => !(t.date === today && t.taskId === taskId));
      setCompleted(prev => prev.filter(id => id !== taskId));
    } else {
      currentData.selfCareTasks = [...(currentData.selfCareTasks || []), { date: today, taskId }];
      setCompleted(prev => [...prev, taskId]);
      hapticTap();
    }
    saveData(currentData);
  }, [completed, today]);

  const addCustomTask = useCallback(() => {
    const label = newLabel.trim();
    if (!label) return;
    const task: CustomSelfCareTask = {
      id: `custom-${Date.now()}`,
      emoji: newEmoji,
      label,
    };
    const currentData = getData();
    const updated = [...(currentData.customSelfCareTasks || []), task];
    currentData.customSelfCareTasks = updated;
    saveData(currentData);
    setCustomTasks(updated);
    setNewLabel('');
    setNewEmoji('⭐');
    hapticTap();
  }, [newLabel, newEmoji]);

  const removeCustomTask = useCallback((taskId: string) => {
    const currentData = getData();
    const updated = (currentData.customSelfCareTasks || []).filter(t => t.id !== taskId);
    currentData.customSelfCareTasks = updated;
    // Also remove completions for this task
    currentData.selfCareTasks = (currentData.selfCareTasks || []).filter(t => t.taskId !== taskId);
    saveData(currentData);
    setCustomTasks(updated);
    setCompleted(prev => prev.filter(id => id !== taskId));
  }, []);

  return (
    <div className="bg-card rounded-card p-grid-3 card-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-grid">
        <h2 className="text-base font-semibold text-foreground">Daily Self-Care 🌸</h2>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground font-medium mr-1">
            {completedCount}/{totalCount}
          </span>
          <button
            onClick={() => { setShowInfo(!showInfo); setEditing(false); }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Info"
          >
            <Info size={15} />
          </button>
          <button
            onClick={() => { setEditing(!editing); setShowInfo(false); }}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              editing
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
            aria-label={editing ? 'Done editing' : 'Edit tasks'}
          >
            {editing ? <X size={15} /> : <Pencil size={15} />}
          </button>
        </div>
      </div>

      {/* Info tooltip */}
      {showInfo && (
        <div className="bg-muted/50 rounded-2xl px-grid-2 py-grid mb-grid-2 animate-fade-in">
          <p className="text-xs text-muted-foreground leading-relaxed">
            5 tasks rotate daily from a curated list. Tap the <Pencil size={11} className="inline" /> icon to <span className="font-semibold text-foreground">add your own goals</span> — they'll always show up alongside the daily rotation.
          </p>
        </div>
      )}

      {!editing && (
        <p className="text-xs text-muted-foreground mb-grid-2">
          Small acts of kindness toward yourself. No pressure — do what feels right.
        </p>
      )}

      {/* Task list */}
      <div className="space-y-1">
        {allDisplayTasks.map(task => {
          const isDone = completed.includes(task.id);
          return (
            <div key={task.id} className="flex items-center gap-1">
              <button
                onClick={() => !editing && toggleTask(task.id)}
                disabled={editing}
                className={`flex-1 flex items-center gap-grid-2 px-grid-2 py-grid rounded-xl text-left min-h-[44px] transition-all ${
                  editing
                    ? 'opacity-70'
                    : isDone
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
                <span className={`text-sm font-medium flex-1 ${isDone ? 'line-through opacity-60' : ''}`}>
                  {task.label}
                </span>
                {task.isCustom && !editing && (
                  <span className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-wide">yours</span>
                )}
              </button>
              {editing && task.isCustom && (
                <button
                  onClick={() => removeCustomTask(task.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                  aria-label={`Remove ${task.label}`}
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add custom task (edit mode) */}
      {editing && (
        <div className="mt-grid-2 pt-grid-2 border-t border-border animate-fade-in">
          <p className="text-xs font-semibold text-foreground mb-grid">Add your own goal</p>

          {/* Emoji picker row */}
          <div className="flex gap-1 flex-wrap mb-grid">
            {QUICK_EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => setNewEmoji(e)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${
                  newEmoji === e
                    ? 'bg-primary/15 ring-2 ring-primary/30 scale-110'
                    : 'hover:bg-muted/50'
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Input + add button */}
          <div className="flex gap-grid items-center">
            <span className="text-lg flex-shrink-0">{newEmoji}</span>
            <input
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomTask()}
              placeholder="e.g. Read for 10 minutes"
              maxLength={50}
              className="flex-1 px-grid-2 py-1.5 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={addCustomTask}
              disabled={!newLabel.trim()}
              className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center transition-all disabled:opacity-30 hover:opacity-90"
              aria-label="Add task"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Completion message */}
      {!editing && completedCount === totalCount && totalCount > 0 && (
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
