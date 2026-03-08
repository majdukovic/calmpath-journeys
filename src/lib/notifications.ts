/**
 * Browser Notification system for daily calm reminders.
 * Uses the Notification API + interval-based scheduler.
 * Works when the app tab is open or backgrounded.
 */

import { getData, isTodayDailyCalmDone } from '@/lib/storage';

let schedulerInterval: ReturnType<typeof setInterval> | null = null;
let lastNotifiedDate: string | null = null;

/** Check if browser supports notifications */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/** Get current permission status */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/** Request notification permission — returns true if granted */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/** Show a notification */
function showNotification(title: string, body: string) {
  if (Notification.permission !== 'granted') return;

  const notification = new Notification(title, {
    body,
    icon: '/app-icon.png',
    badge: '/app-icon.png',
    tag: 'daily-calm-reminder', // prevents duplicates
    silent: false,
  });

  notification.onclick = () => {
    window.focus();
    window.location.hash = '';
    window.location.pathname = '/daily-calm';
    notification.close();
  };
}

/** Gentle reminder messages — rotated for variety */
const reminderMessages = [
  { title: '🌿 Your Daily Calm', body: 'Just 3 minutes for yourself. You deserve it.' },
  { title: '🦊 Breeze is waiting', body: 'Ready for a calm moment? Your garden misses you.' },
  { title: '🫁 Time to breathe', body: 'A few deep breaths can change your whole day.' },
  { title: '🌱 Grow your calm', body: 'One session, one seed. Let\'s plant it together.' },
  { title: '✨ A moment of peace', body: 'Step away from the noise — just for 3 minutes.' },
];

function getRandomMessage() {
  return reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
}

/** Check if it's time to send a reminder */
function checkAndNotify() {
  const data = getData();
  const { reminderEnabled, reminderTime } = data.settings;

  if (!reminderEnabled) return;
  if (Notification.permission !== 'granted') return;

  // Already did today's calm? Don't nag.
  if (isTodayDailyCalmDone()) return;

  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Already notified today
  if (lastNotifiedDate === today) return;

  // Check if current time matches reminder time (within 1-minute window)
  const [targetH, targetM] = reminderTime.split(':').map(Number);
  const currentH = now.getHours();
  const currentM = now.getMinutes();

  if (currentH === targetH && currentM === targetM) {
    const msg = getRandomMessage();
    showNotification(msg.title, msg.body);
    lastNotifiedDate = today;
  }
}

/** Start the notification scheduler — checks every 30s */
export function startNotificationScheduler() {
  if (schedulerInterval) return; // already running

  // Check immediately
  checkAndNotify();

  // Then every 30 seconds
  schedulerInterval = setInterval(checkAndNotify, 30_000);
}

/** Stop the scheduler */
export function stopNotificationScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}

/** Initialize — call on app startup */
export function initNotifications() {
  const data = getData();
  if (data.settings.reminderEnabled && Notification.permission === 'granted') {
    startNotificationScheduler();
  }
}
