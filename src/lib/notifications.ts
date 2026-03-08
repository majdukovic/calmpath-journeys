/**
 * Cross-platform notification system for daily calm reminders.
 * - Web: Uses browser Notification API + interval scheduler
 * - Native (Capacitor): Uses @capacitor/local-notifications for scheduled alarms
 */

import { getData, isTodayDailyCalmDone, toLocalDateStr } from '@/lib/storage';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const REMINDER_NOTIFICATION_ID = 42;

let schedulerInterval: ReturnType<typeof setInterval> | null = null;
let lastNotifiedDate: string | null = null;

/** Gentle reminder messages — rotated for variety */
const reminderMessages = [
  { title: '🌿 Your Daily Calm', body: 'Just 3 minutes for yourself. You deserve it.' },
  { title: '🦊 Breeze is waiting', body: 'Ready for a calm moment? Your garden misses you.' },
  { title: '🫁 Time to breathe', body: 'A few deep breaths can change your whole day.' },
  { title: '🌱 Grow your calm', body: "One session, one seed. Let's plant it together." },
  { title: '✨ A moment of peace', body: 'Step away from the noise — just for 3 minutes.' },
];

function getRandomMessage() {
  return reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
}

// ─── Platform detection ───

function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

// ─── Permission ───

export function isNotificationSupported(): boolean {
  if (isNative()) return true;
  return 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  // On native, we check async — this sync helper is used for UI hints only
  if (isNative()) return 'default'; // caller should use requestNotificationPermission for truth
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (isNative()) {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

// ─── Native scheduling ───

async function scheduleNativeReminder() {
  const data = getData();
  const { reminderTime } = data.settings;
  const [h, m] = reminderTime.split(':').map(Number);

  // Cancel any existing reminder first
  await cancelNativeReminder();

  const msg = getRandomMessage();

  await LocalNotifications.schedule({
    notifications: [
      {
        id: REMINDER_NOTIFICATION_ID,
        title: msg.title,
        body: msg.body,
        schedule: {
          on: { hour: h, minute: m },
          every: 'day',
          allowWhileIdle: true,
        },
        smallIcon: 'ic_launcher',
        iconColor: '#8fbc8f',
        actionTypeId: '',
        extra: { route: '/daily-calm' },
      },
    ],
  });
}

async function cancelNativeReminder() {
  try {
    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_NOTIFICATION_ID }] });
  } catch {
    // Ignore if nothing to cancel
  }
}

// ─── Web scheduler ───

function showWebNotification(title: string, body: string) {
  if (Notification.permission !== 'granted') return;
  const notification = new Notification(title, {
    body,
    icon: '/app-icon.png',
    badge: '/app-icon.png',
    tag: 'daily-calm-reminder',
    silent: false,
  });
  notification.onclick = () => {
    window.focus();
    window.location.pathname = '/daily-calm';
    notification.close();
  };
}

function checkAndNotify() {
  const data = getData();
  const { reminderEnabled, reminderTime } = data.settings;
  if (!reminderEnabled) return;
  if (Notification.permission !== 'granted') return;
  if (isTodayDailyCalmDone()) return;

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  if (lastNotifiedDate === today) return;

  const [targetH, targetM] = reminderTime.split(':').map(Number);
  if (now.getHours() === targetH && now.getMinutes() === targetM) {
    const msg = getRandomMessage();
    showWebNotification(msg.title, msg.body);
    lastNotifiedDate = today;
  }
}

// ─── Public API ───

export async function startNotificationScheduler() {
  if (isNative()) {
    await scheduleNativeReminder();
    return;
  }
  // Web fallback
  if (schedulerInterval) return;
  checkAndNotify();
  schedulerInterval = setInterval(checkAndNotify, 30_000);
}

export async function stopNotificationScheduler() {
  if (isNative()) {
    await cancelNativeReminder();
    return;
  }
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}

/** Re-schedule after time change */
export async function rescheduleNotification() {
  if (isNative()) {
    await scheduleNativeReminder();
  }
  // Web scheduler auto-reads from settings on each tick, no reschedule needed
}

/** Initialize — call on app startup */
export async function initNotifications() {
  const data = getData();
  if (!data.settings.reminderEnabled) return;

  if (isNative()) {
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display === 'granted') {
      await scheduleNativeReminder();
    }
    // Listen for notification taps to navigate
    LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
      const route = action.notification.extra?.route;
      if (route) {
        window.location.pathname = route;
      }
    });
  } else {
    if ('Notification' in window && Notification.permission === 'granted') {
      startNotificationScheduler();
    }
  }
}
