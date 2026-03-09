/**
 * Cross-platform notification system for daily calm reminders.
 * - Web: Uses browser Notification API + interval scheduler
 * - Native (Capacitor): Uses @capacitor/local-notifications for scheduled alarms
 */

import { getData, isTodayDailyCalmDone, toLocalDateStr } from '@/lib/storage';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const REMINDER_NOTIFICATION_ID = 42;
const TEST_NOTIFICATION_ID = 43;

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

const NOTIFICATION_OPTIONS = {
  // Android: white-on-transparent drawable (res/drawable/ic_notification.xml).
  // Do NOT use ic_launcher — it's a full-color mipmap; Android 5+ renders it
  // as a grey square and strict OEMs silently drop the notification.
  smallIcon: 'ic_notification',
  iconColor: '#6dba8a',
  // iOS: the plugin only sets content.sound when this property is present.
  // Omitting it leaves content.sound = nil → completely silent notification.
  // Passing 'default' makes iOS fall back to the system alert sound when no
  // bundle audio file named 'default' is found (documented Apple fallback).
  sound: 'default',
  actionTypeId: '',
  extra: { route: '/daily-calm' },
} as const;

async function scheduleNativeReminder() {
  const data = getData();
  const { reminderTime } = data.settings;
  const [h, m] = reminderTime.split(':').map(Number);

  // Cancel any existing reminder first
  await cancelNativeReminder();

  const msg = getRandomMessage();

  // Throws on failure — callers should catch and surface the error.
  await LocalNotifications.schedule({
    notifications: [
      {
        id: REMINDER_NOTIFICATION_ID,
        title: msg.title,
        body: msg.body,
        schedule: {
          on: { hour: h, minute: m },
          every: 'day',
          // allowWhileIdle fires the alarm even during Android doze mode.
          // Requires SCHEDULE_EXACT_ALARM permission (declared in AndroidManifest.xml).
          // On Android 13+ the user must also enable it under
          // Settings › Apps › Special app access › Alarms & reminders.
          allowWhileIdle: true,
        },
        ...NOTIFICATION_OPTIONS,
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
  const today = toLocalDateStr(now);
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

// ─── Debug / diagnostics ───

export interface NotificationDebugInfo {
  permissionStatus: string;
  exactAlarmStatus: string;
  pendingCount: number;
  pendingIds: number[];
}

/**
 * Returns debug info about the current notification state.
 * Used by the Settings debug panel to surface problems.
 */
export async function getNotificationDebugInfo(): Promise<NotificationDebugInfo> {
  if (!isNative()) {
    return {
      permissionStatus: 'Notification' in window ? Notification.permission : 'unsupported',
      exactAlarmStatus: 'n/a (web)',
      pendingCount: 0,
      pendingIds: [],
    };
  }

  const [perm, pending, exact] = await Promise.all([
    LocalNotifications.checkPermissions().catch(() => ({ display: 'error' })),
    LocalNotifications.getPending().catch(() => ({ notifications: [] })),
    LocalNotifications.checkExactNotificationSetting().catch(() => ({ exact: 'unsupported' as const })),
  ]);

  const ids = pending.notifications.map((n) => Number(n.id));

  return {
    permissionStatus: perm.display,
    exactAlarmStatus: (exact as { exact: string }).exact,
    pendingCount: pending.notifications.length,
    pendingIds: ids,
  };
}

/**
 * Fire a test notification in 5 seconds.
 * Useful to verify the full notification pipeline without waiting for the
 * scheduled daily alarm time.
 */
export async function scheduleTestNotification(): Promise<void> {
  if (!isNative()) {
    // Web fallback: fire immediately
    showWebNotification('🧪 Test notification', 'Notifications are working!');
    return;
  }

  // Cancel any previous test notification first
  try {
    await LocalNotifications.cancel({ notifications: [{ id: TEST_NOTIFICATION_ID }] });
  } catch { /* ignore */ }

  const fireAt = new Date(Date.now() + 5_000);

  await LocalNotifications.schedule({
    notifications: [
      {
        id: TEST_NOTIFICATION_ID,
        title: '🧪 Test notification',
        body: 'It works! Your daily reminders will show up like this.',
        schedule: {
          at: fireAt,
          allowWhileIdle: true,
        },
        ...NOTIFICATION_OPTIONS,
      },
    ],
  });
}

/**
 * Opens the Android "Alarms & reminders" special-access settings screen so
 * the user can grant SCHEDULE_EXACT_ALARM on Android 13+.
 * No-op on iOS or web.
 */
export async function openExactAlarmSettings(): Promise<void> {
  if (!isNative()) return;
  try {
    await LocalNotifications.changeExactNotificationSetting();
  } catch {
    // Older Android versions don't have this setting — ignore
  }
}
