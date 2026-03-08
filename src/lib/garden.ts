// Breathly Growth Garden & Mascot system
// Inspired by Finch (nurture-based) and Rootd (journey metaphor)
// No streaks, no guilt — only positive growth visualization

import { getData, toLocalDateStr } from './storage';

export type MascotMood = 'wave' | 'happy' | 'proud' | 'sleepy';

export interface GardenElement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requirement: string;
  check: (stats: GardenStats) => boolean;
}

export interface GardenStats {
  totalSessions: number;
  totalJournals: number;
  totalSOS: number;
  totalMoodLogs: number;
  totalSelfCareToday: number;
  totalSelfCareAllTime: number;
  weeklyCount: number;
  daysSinceLastActivity: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export function getGardenStats(): GardenStats {
  const data = getData();
  const now = new Date();
  const today = toLocalDateStr(now);
  const hour = now.getHours();

  // Weekly count
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day === 0 ? 7 : day) - 1));
  monday.setHours(0, 0, 0, 0);
  const mondayStr = toLocalDateStr(monday);
  const weeklyCount = data.dailyCalmSessions.filter(s => s.date >= mondayStr).length;

  // Days since last activity
  const allDates = [
    ...data.dailyCalmSessions.map(s => s.date),
    ...data.gratitudeEntries.map(e => e.date),
    ...data.moodEntries.map(e => e.date.split('T')[0]),
    ...data.sosSessions.map(s => s.date.split('T')[0]),
  ];
  const lastDate = allDates.sort().reverse()[0] || today;
  const daysSince = Math.floor((now.getTime() - new Date(lastDate).getTime()) / 86400000);

  // Self-care tasks
  const selfCareTasks = data.selfCareTasks || [];
  const totalSelfCareToday = selfCareTasks.filter(t => t.date === today).length;
  const totalSelfCareAllTime = selfCareTasks.length;

  // Time of day
  let timeOfDay: GardenStats['timeOfDay'] = 'morning';
  if (hour >= 17) timeOfDay = 'evening';
  else if (hour >= 21 || hour < 5) timeOfDay = 'night';
  else if (hour >= 12) timeOfDay = 'afternoon';

  return {
    totalSessions: data.dailyCalmSessions.length,
    totalJournals: data.gratitudeEntries.length,
    totalSOS: data.sosSessions.length,
    totalMoodLogs: data.moodEntries.length,
    totalSelfCareToday,
    totalSelfCareAllTime,
    weeklyCount,
    daysSinceLastActivity: daysSince,
    timeOfDay,
  };
}

// Garden elements unlock as users engage — purely additive, never lost
export const gardenElements: GardenElement[] = [
  {
    id: 'sprout',
    name: 'First Sprout',
    emoji: '🌱',
    description: 'Your garden has begun',
    requirement: 'Complete your first session',
    check: (s) => s.totalSessions >= 1,
  },
  {
    id: 'daisy',
    name: 'Daisy',
    emoji: '🌼',
    description: 'A daisy bloomed from your breathing',
    requirement: '3 breathing sessions',
    check: (s) => s.totalSessions >= 3,
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    emoji: '🦋',
    description: 'A butterfly was drawn to your gratitude',
    requirement: '5 journal entries',
    check: (s) => s.totalJournals >= 5,
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    emoji: '🌻',
    description: 'Your self-care grew a sunflower',
    requirement: '10 self-care tasks completed',
    check: (s) => s.totalSelfCareAllTime >= 10,
  },
  {
    id: 'tulip',
    name: 'Tulip',
    emoji: '🌷',
    description: 'Your consistency brought tulips',
    requirement: '7 sessions total',
    check: (s) => s.totalSessions >= 7,
  },
  {
    id: 'bird',
    name: 'Songbird',
    emoji: '🐦',
    description: 'A songbird visits your garden',
    requirement: '10 mood check-ins',
    check: (s) => s.totalMoodLogs >= 10,
  },
  {
    id: 'tree',
    name: 'Oak Tree',
    emoji: '🌳',
    description: 'A mighty oak grows in your garden',
    requirement: '15 sessions total',
    check: (s) => s.totalSessions >= 15,
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    emoji: '🌈',
    description: 'A rainbow arches over your garden',
    requirement: '20 journal entries',
    check: (s) => s.totalJournals >= 20,
  },
  {
    id: 'fireflies',
    name: 'Fireflies',
    emoji: '✨',
    description: 'Fireflies dance in your garden at night',
    requirement: '50 self-care tasks completed',
    check: (s) => s.totalSelfCareAllTime >= 50,
  },
  {
    id: 'pond',
    name: 'Calm Pond',
    emoji: '🪷',
    description: 'A peaceful pond with lotus flowers',
    requirement: '30 sessions total',
    check: (s) => s.totalSessions >= 30,
  },
];

export function getUnlockedElements(stats: GardenStats): GardenElement[] {
  return gardenElements.filter(el => el.check(stats));
}

export function getNextElement(stats: GardenStats): GardenElement | null {
  return gardenElements.find(el => !el.check(stats)) || null;
}

// Mascot mood based on user activity
export function getMascotMood(stats: GardenStats): MascotMood {
  if (stats.totalSessions === 0) return 'wave'; // New user
  if (stats.daysSinceLastActivity >= 3) return 'sleepy'; // Been away
  if (stats.weeklyCount >= 5) return 'proud'; // Great week
  return 'happy'; // Active user
}

// Rich, varied contextual messages from Breeze — warm, never guilt-inducing
// Messages vary by time of day, activity level, and milestones
export function getMascotMessage(stats: GardenStats, name?: string): string {
  const greeting = name ? `${name}, ` : '';
  const { timeOfDay } = stats;

  // Brand new user
  if (stats.totalSessions === 0) {
    const intros = [
      `Hi ${greeting}I'm Breeze! 🦊 Let's grow a garden together — one breath at a time.`,
      `Hey ${greeting}I'm Breeze! 🦊 I'll be right here whenever you need a moment of calm.`,
      `Welcome ${greeting}I'm Breeze, your calm companion! 🦊 Ready when you are.`,
    ];
    return intros[Math.floor(Date.now() / 86400000) % intros.length];
  }

  // Been away a long time
  if (stats.daysSinceLastActivity >= 7) {
    const awayMessages = [
      `${greeting}I've been napping here in the garden 😊 No rush — I'm always here when you're ready.`,
      `${greeting}I missed you! Your garden kept growing while you were away 🌱`,
      `${greeting}welcome back! I saved you a cozy spot in the garden 🦊`,
    ];
    return awayMessages[Math.floor(Date.now() / 86400000) % awayMessages.length];
  }

  // Been away a few days
  if (stats.daysSinceLastActivity >= 3) {
    return `${greeting}your garden is still blooming! Come sit with me whenever you'd like 🌿`;
  }

  // Great week
  if (stats.weeklyCount >= 5) {
    const proudMessages = [
      `Wow ${greeting}5 sessions this week! 🌟 Your garden is absolutely thriving!`,
      `${greeting}you've been incredible this week! Look at how your garden has grown 💚`,
      `${greeting}I'm so proud of you! Your dedication is making the garden beautiful 🌸`,
    ];
    return proudMessages[Math.floor(Date.now() / 3600000) % proudMessages.length];
  }

  // Completed self-care tasks today
  if (stats.totalSelfCareToday >= 3) {
    return `${greeting}look at you taking care of yourself today! That makes me happy 🦊💛`;
  }

  // Time-of-day messages for active users
  if (timeOfDay === 'morning') {
    const morningMessages = [
      `Good morning ${greeting}🌅 A new day, a fresh start. How are you feeling?`,
      `${greeting}the morning sun is warming the garden 🌞 Ready for a gentle start?`,
      `Rise and shine ${greeting}☀️ Your garden woke up early just for you!`,
    ];
    return morningMessages[Math.floor(Date.now() / 86400000) % morningMessages.length];
  }

  if (timeOfDay === 'evening') {
    const eveningMessages = [
      `${greeting}the garden is settling in for the evening 🌙 Time to wind down?`,
      `${greeting}you did great today. Take a breath and let the day go 🌅`,
      `${greeting}evening time — the garden glows softly. You've earned some rest 🦊`,
    ];
    return eveningMessages[Math.floor(Date.now() / 86400000) % eveningMessages.length];
  }

  if (timeOfDay === 'night') {
    const nightMessages = [
      `${greeting}the garden is peaceful at night 🌙 Can't sleep? I'm here.`,
      `${greeting}the stars are out. Let's breathe together under them ✨`,
      `${greeting}it's quiet here. A good time for a gentle breath 🦊`,
    ];
    return nightMessages[Math.floor(Date.now() / 86400000) % nightMessages.length];
  }

  // Active user, afternoon, varied messages
  if (stats.weeklyCount >= 3) {
    return `${greeting}you're building something beautiful. I can see your garden growing! 🌿`;
  }

  // Milestone proximity
  const nextEl = getNextElement(stats);
  if (nextEl) {
    const proximityMessages = [
      `${greeting}keep going — something new is about to bloom in your garden! 🌱`,
      `${greeting}I can feel the garden humming. A new bloom is close! 🌼`,
      `${greeting}the soil is warm today. Perfect for growing 🦊`,
    ];
    return proximityMessages[Math.floor(Date.now() / 86400000) % proximityMessages.length];
  }

  return `${greeting}your garden is a testament to your care. I'm so proud of you! 💚`;
}
