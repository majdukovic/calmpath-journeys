// Breathly Growth Garden & Mascot system
// Inspired by Finch (nurture-based) and Rootd (journey metaphor)
// No streaks, no guilt — only positive growth visualization

import { getData } from './storage';

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
  weeklyCount: number;
  daysSinceLastActivity: number;
}

export function getGardenStats(): GardenStats {
  const data = getData();
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Weekly count
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day === 0 ? 7 : day) - 1));
  monday.setHours(0, 0, 0, 0);
  const mondayStr = monday.toISOString().split('T')[0];
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

  return {
    totalSessions: data.dailyCalmSessions.length,
    totalJournals: data.gratitudeEntries.length,
    totalSOS: data.sosSessions.length,
    totalMoodLogs: data.moodEntries.length,
    weeklyCount,
    daysSinceLastActivity: daysSince,
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

// Contextual encouragement from Breeze — warm, never guilt-inducing
export function getMascotMessage(stats: GardenStats, name?: string): string {
  const greeting = name ? `${name}, ` : '';

  if (stats.totalSessions === 0) {
    return `Hi ${greeting}I'm Breeze! 🦊 Let's grow a garden together — one breath at a time.`;
  }

  if (stats.daysSinceLastActivity >= 7) {
    return `${greeting}I've been napping here in the garden 😊 No rush — I'm always here when you're ready.`;
  }

  if (stats.daysSinceLastActivity >= 3) {
    return `${greeting}your garden is still blooming! Come sit with me whenever you'd like.`;
  }

  if (stats.weeklyCount >= 5) {
    return `Wow ${greeting}5 sessions this week! 🌟 Your garden is absolutely thriving!`;
  }

  if (stats.weeklyCount >= 3) {
    return `${greeting}you're building something beautiful. I can see your garden growing! 🌿`;
  }

  // Milestone messages
  const nextEl = getNextElement(stats);
  if (nextEl) {
    return `${greeting}keep going — something new is about to bloom in your garden! 🌱`;
  }

  return `${greeting}your garden is a testament to your care. I'm so proud of you! 💚`;
}
