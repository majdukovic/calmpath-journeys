// Breathly localStorage data layer

/** Returns YYYY-MM-DD in user's local timezone (never UTC) */
export function toLocalDateStr(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export interface GratitudeEntry {
  id: string;
  date: string;
  prompt: string;
  answer: string;
  category: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5
  moodLabel: string;
  note?: string;
  source: 'daily_calm' | 'sos';
}

export interface SOSSession {
  id: string;
  date: string;
  pattern: string;
  cyclesCompleted: number;
  groundingCompleted: boolean;
  moodAfter?: number;
}

export interface DailyCalmSession {
  id: string;
  date: string;
  breathingCompleted: boolean;
  gratitudeEntry?: string;
  moodEntry?: number;
}

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface UserSettings {
  name: string;
  reminderEnabled: boolean;
  reminderTime: string;
  defaultBreathingPattern: string;
  hapticsEnabled: boolean;
  audioEnabled: boolean;
  voiceGuideEnabled: boolean;
  onboardingCompleted: boolean;
  theme: 'light' | 'dark' | 'system';
  showSOSCard: boolean;
  emergencyContact?: EmergencyContact;
}

export interface CustomSelfCareTask {
  id: string;
  emoji: string;
  label: string;
}

export interface FreewriteEntry {
  id: string;
  date: string;
  text: string;
  createdAt: string;
}

export interface AppData {
  gratitudeEntries: GratitudeEntry[];
  moodEntries: MoodEntry[];
  sosSessions: SOSSession[];
  dailyCalmSessions: DailyCalmSession[];
  selfCareTasks: { date: string; taskId: string }[];
  customSelfCareTasks: CustomSelfCareTask[];
  freewriteEntries: FreewriteEntry[];
  settings: UserSettings;
  shownPromptIds: { id: number; shownAt: string }[];
  lastOpenedDate?: string;
}

const STORAGE_KEY = 'calmpath_data';

const defaultSettings: UserSettings = {
  name: '',
  reminderEnabled: false,
  reminderTime: '09:00',
  defaultBreathingPattern: '4-7-8',
  voiceGuideEnabled: true,
  hapticsEnabled: true,
  audioEnabled: true,
  onboardingCompleted: false,
  theme: 'light',
  showSOSCard: true,
};

const defaultData: AppData = {
  gratitudeEntries: [],
  moodEntries: [],
  sosSessions: [],
  dailyCalmSessions: [],
  selfCareTasks: [],
  customSelfCareTasks: [],
  settings: defaultSettings,
  shownPromptIds: [],
};

export function getData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultData };
    const parsed = JSON.parse(raw);
    return { ...defaultData, ...parsed, settings: { ...defaultSettings, ...parsed.settings } };
  } catch {
    return { ...defaultData };
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateSettings(partial: Partial<UserSettings>): void {
  const data = getData();
  data.settings = { ...data.settings, ...partial };
  saveData(data);
}

export function addGratitudeEntry(entry: Omit<GratitudeEntry, 'id'>): void {
  const data = getData();
  data.gratitudeEntries.unshift({ ...entry, id: crypto.randomUUID() });
  saveData(data);
}

export function addMoodEntry(entry: Omit<MoodEntry, 'id'>): void {
  const data = getData();
  data.moodEntries.unshift({ ...entry, id: crypto.randomUUID() });
  saveData(data);
}

export function addSOSSession(session: Omit<SOSSession, 'id'>): void {
  const data = getData();
  data.sosSessions.unshift({ ...session, id: crypto.randomUUID() });
  saveData(data);
}

export function addDailyCalmSession(session: Omit<DailyCalmSession, 'id'>): void {
  const data = getData();
  data.dailyCalmSessions.unshift({ ...session, id: crypto.randomUUID() });
  saveData(data);
}

export function markPromptShown(promptId: number): void {
  const data = getData();
  data.shownPromptIds.push({ id: promptId, shownAt: new Date().toISOString() });
  saveData(data);
}

export function getUnusedPromptId(totalPrompts: number): number {
  const data = getData();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentlyShown = new Set(
    data.shownPromptIds
      .filter(p => new Date(p.shownAt) > thirtyDaysAgo)
      .map(p => p.id)
  );
  const available = Array.from({ length: totalPrompts }, (_, i) => i).filter(i => !recentlyShown.has(i));
  if (available.length === 0) {
    return Math.floor(Math.random() * totalPrompts);
  }
  return available[Math.floor(Math.random() * available.length)];
}

export function isTodayDailyCalmDone(): boolean {
  const data = getData();
  const today = toLocalDateStr();
  return data.dailyCalmSessions.some(s => s.date === today);
}

export function getWeeklyProgress(): boolean[] {
  const data = getData();
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day === 0 ? 7 : day) - 1));
  monday.setHours(0, 0, 0, 0);

  const result: boolean[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = toLocalDateStr(d);
    result.push(data.dailyCalmSessions.some(s => s.date === dateStr));
  }
  return result;
}

export function getWeeklyCount(): number {
  return getWeeklyProgress().filter(Boolean).length;
}

export function exportDataAsCSV(): string {
  const data = getData();
  let csv = 'Type,Date,Details\n';
  data.gratitudeEntries.forEach(e => {
    csv += `Gratitude,"${e.date}","${e.prompt}: ${e.answer.replace(/"/g, '""')}"\n`;
  });
  data.moodEntries.forEach(e => {
    csv += `Mood,"${e.date}","${e.moodLabel}${e.note ? ': ' + e.note.replace(/"/g, '""') : ''}"\n`;
  });
  return csv;
}

export function deleteAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Get total unique days where user completed at least one Daily Calm */
export function getTotalCalmDays(): number {
  const data = getData();
  const uniqueDates = new Set(data.dailyCalmSessions.map(s => s.date));
  return uniqueDates.size;
}

/** Get days since the app was last opened (for return-welcome) */
export function getDaysSinceLastOpen(): number {
  const data = getData();
  if (!data.lastOpenedDate) return 0;
  const last = new Date(data.lastOpenedDate);
  const now = new Date();
  return Math.floor((now.getTime() - last.getTime()) / 86400000);
}

/** Update the last opened date to today */
export function markAppOpened(): void {
  const data = getData();
  data.lastOpenedDate = toLocalDateStr();
  saveData(data);
}

/** Milestone definitions — cumulative, never lost */
export interface CalmMilestone {
  days: number;
  emoji: string;
  label: string;
}

export const calmMilestones: CalmMilestone[] = [
  { days: 1, emoji: '🌱', label: 'First day of calm!' },
  { days: 3, emoji: '🌿', label: '3 days of showing up' },
  { days: 7, emoji: '🌸', label: 'A whole week of calm' },
  { days: 14, emoji: '🦋', label: '14 days — beautiful progress' },
  { days: 30, emoji: '🌳', label: '30 days of growth!' },
  { days: 50, emoji: '⭐', label: '50 days — you\'re shining' },
  { days: 100, emoji: '🌈', label: '100 days of calm!' },
  { days: 200, emoji: '💎', label: '200 days — truly remarkable' },
  { days: 365, emoji: '👑', label: 'A full year of calm!' },
];

/** Check if today's session just unlocked a new milestone */
export function getNewlyUnlockedMilestone(): CalmMilestone | null {
  const totalDays = getTotalCalmDays();
  // Find the highest milestone that matches exactly
  return calmMilestones.find(m => m.days === totalDays) || null;
}

/** Get the next milestone the user is working toward */
export function getNextMilestone(): { milestone: CalmMilestone; current: number } | null {
  const totalDays = getTotalCalmDays();
  const next = calmMilestones.find(m => m.days > totalDays);
  if (!next) return null;
  return { milestone: next, current: totalDays };
}
