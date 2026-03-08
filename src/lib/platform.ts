import { Capacitor } from '@capacitor/core';

/** True when running inside a native Capacitor shell (iOS/Android) */
export const isNativeApp = Capacitor.isNativePlatform();

/** True when running in a regular web browser */
export const isWebBrowser = !isNativeApp;
