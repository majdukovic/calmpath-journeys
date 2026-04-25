// Guided meditation data & types
//
// To add a new meditation:
// 1. Add an entry to guidedMeditations[] below
// 2. Drop MP3 files into public/audio/meditations/{id}-luna.mp3 and {id}-river.mp3
// 3. That's it — the browse page picks it up automatically

export type VoiceId = 'luna' | 'river';
export type Intention = 'calm' | 'energize' | 'focus' | 'release' | 'sleep' | 'self-love';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type AmbientSound = 'forest' | 'ocean' | 'rain' | 'night' | 'wind';

/** Category determines section grouping in browse view */
export type MeditationCategory = 'morning' | 'relaxation' | 'sleep' | 'focus' | 'self-care';

export const categoryMeta: Record<MeditationCategory, { label: string; emoji: string; order: number }> = {
  morning:    { label: 'Morning',      emoji: '🌅', order: 0 },
  focus:      { label: 'Focus',        emoji: '⚡', order: 1 },
  relaxation: { label: 'Relaxation',   emoji: '🌊', order: 2 },
  'self-care':{ label: 'Self-Care',    emoji: '💜', order: 3 },
  sleep:      { label: 'Sleep',        emoji: '🌙', order: 4 },
};

export interface VoiceProfile {
  id: VoiceId;
  name: string;
  label: string;
  description: string;
}

export const voiceProfiles: VoiceProfile[] = [
  { id: 'luna',  name: 'Luna',  label: 'Calm Female', description: 'Warm, gentle, nurturing' },
  { id: 'river', name: 'River', label: 'Calm Male',   description: 'Deep, grounded, reassuring' },
];

export interface GuidedMeditation {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  /** Approximate duration in seconds (player reads real duration from audio file) */
  duration: number;
  category: MeditationCategory;
  intentions: Intention[];
  timeOfDay: TimeOfDay[];
  defaultVoice: VoiceId;
  availableVoices: VoiceId[];
  ambientSound: AmbientSound;
  premium: boolean;
}

/** Audio file path for a meditation + voice combo */
export function getAudioPath(meditationId: string, voice: VoiceId): string {
  return `/audio/meditations/${meditationId}-${voice}.mp3`;
}

// ─── Meditation library ──────────────────────────────────────────────

export const guidedMeditations: GuidedMeditation[] = [
  {
    id: 'morning-awakening',
    title: 'Morning Awakening',
    subtitle: 'Start your day with intention',
    description: 'Energizing breathwork, a body awareness scan, and an intention-setting moment to carry through your day.',
    emoji: '🌅',
    duration: 113,
    category: 'morning',
    intentions: ['energize', 'focus'],
    timeOfDay: ['morning'],
    defaultVoice: 'river',
    availableVoices: ['river', 'luna'],
    ambientSound: 'forest',
    premium: true,
  },
  {
    id: 'focus-presence',
    title: 'Focus & Presence',
    subtitle: 'Sharpen your mind',
    description: 'Box breathing with focused attention training. Anchors your awareness to the present moment.',
    emoji: '⚡',
    duration: 130,
    category: 'focus',
    intentions: ['focus', 'energize'],
    timeOfDay: ['morning', 'afternoon'],
    defaultVoice: 'river',
    availableVoices: ['river', 'luna'],
    ambientSound: 'wind',
    premium: true,
  },
  {
    id: 'calm-release',
    title: 'Calm & Release',
    subtitle: 'Let go of what you\'re carrying',
    description: 'Progressive relaxation with 4-7-8 breathing and a letting-go visualization.',
    emoji: '🌊',
    duration: 143,
    category: 'relaxation',
    intentions: ['calm', 'release'],
    timeOfDay: ['afternoon', 'evening'],
    defaultVoice: 'luna',
    availableVoices: ['luna', 'river'],
    ambientSound: 'ocean',
    premium: true,
  },
  {
    id: 'self-compassion',
    title: 'Self-Compassion',
    subtitle: 'A moment of kindness for yourself',
    description: 'Loving-kindness meditation with gentle breathing and self-acceptance phrases.',
    emoji: '💜',
    duration: 111,
    category: 'self-care',
    intentions: ['self-love', 'calm'],
    timeOfDay: ['morning', 'afternoon', 'evening'],
    defaultVoice: 'luna',
    availableVoices: ['luna', 'river'],
    ambientSound: 'rain',
    premium: true,
  },
  {
    id: 'evening-winddown',
    title: 'Evening Wind-Down',
    subtitle: 'Prepare your mind for rest',
    description: 'A full body scan, elongated exhale breathing, and a gratitude moment to ease you into sleep.',
    emoji: '🌙',
    duration: 129,
    category: 'sleep',
    intentions: ['sleep', 'calm', 'release'],
    timeOfDay: ['evening', 'night'],
    defaultVoice: 'luna',
    availableVoices: ['luna', 'river'],
    ambientSound: 'night',
    premium: true,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────

/** Get recommended meditation based on time of day */
export function getRecommendedMeditation(): GuidedMeditation {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10)  return guidedMeditations.find(m => m.id === 'morning-awakening')!;
  if (hour >= 10 && hour < 17) return guidedMeditations.find(m => m.id === 'focus-presence')!;
  if (hour >= 17 && hour < 21) return guidedMeditations.find(m => m.id === 'calm-release')!;
  return guidedMeditations.find(m => m.id === 'evening-winddown')!;
}

/** Filter meditations by intention */
export function filterByIntention(intention: Intention | null): GuidedMeditation[] {
  if (!intention) return guidedMeditations;
  return guidedMeditations.filter(m => m.intentions.includes(intention));
}

/** Group meditations by category, sorted by category order */
export function groupByCategory(meditations: GuidedMeditation[]): { category: MeditationCategory; label: string; emoji: string; items: GuidedMeditation[] }[] {
  const groups = new Map<MeditationCategory, GuidedMeditation[]>();
  for (const m of meditations) {
    const list = groups.get(m.category) || [];
    list.push(m);
    groups.set(m.category, list);
  }
  return Array.from(groups.entries())
    .map(([cat, items]) => ({ category: cat, ...categoryMeta[cat], items }))
    .sort((a, b) => a.order - b.order);
}

/** Format seconds as "2 min" or "2:30" */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s === 0 ? `${m} min` : `${m}:${String(s).padStart(2, '0')}`;
}

/** Format seconds for player as "m:ss" */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
