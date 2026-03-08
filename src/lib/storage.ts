// Breathly localStorage data layer

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
  onboardingCompleted: boolean;
  theme: 'light' | 'dark' | 'system';
  showSOSCard: boolean;
  emergencyContact?: EmergencyContact;
}

export interface AppData {
  gratitudeEntries: GratitudeEntry[];
  moodEntries: MoodEntry[];
  sosSessions: SOSSession[];
  dailyCalmSessions: DailyCalmSession[];
  settings: UserSettings;
  shownPromptIds: { id: number; shownAt: string }[];
}

const STORAGE_KEY = 'calmpath_data';

const defaultSettings: UserSettings = {
  name: '',
  reminderEnabled: false,
  reminderTime: '09:00',
  defaultBreathingPattern: '4-7-8',
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
  const today = new Date().toISOString().split('T')[0];
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
    const dateStr = d.toISOString().split('T')[0];
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
