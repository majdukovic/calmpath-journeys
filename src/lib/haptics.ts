// Haptic feedback utilities
// Uses navigator.vibrate for web and can be extended with Capacitor Haptics

import { getData } from './storage';

function isEnabled(): boolean {
  return getData().settings.hapticsEnabled && 'vibrate' in navigator;
}

/** Soft tap — task completion, button press */
export function hapticTap() {
  if (isEnabled()) navigator.vibrate(10);
}

/** Medium pulse — breathing phase change */
export function hapticPulse() {
  if (isEnabled()) navigator.vibrate(25);
}

/** Gentle pattern — milestone celebration */
export function hapticCelebration() {
  if (isEnabled()) navigator.vibrate([15, 50, 15, 50, 30]);
}

/** Breathing rhythm — inhale start */
export function hapticInhale() {
  if (isEnabled()) navigator.vibrate([20, 40, 15]);
}

/** Breathing rhythm — exhale start */
export function hapticExhale() {
  if (isEnabled()) navigator.vibrate(15);
}
