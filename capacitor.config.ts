import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a6184d409ec745c2b1c596e88853348a',
  appName: 'Breeze',
  webDir: 'dist',
  server: {
    // For development: point to the Lovable preview for hot-reload
    // Comment this out before building for production
    // url: 'https://a6184d40-9ec7-45c2-b1c5-96e88853348a.lovableproject.com?forceHideBadge=true',
    // cleartext: true,
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'Breeze',
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    LocalNotifications: {
      // ic_notification is a white-on-transparent vector drawable in res/drawable/.
      // Do NOT use ic_launcher here — it is a full-color mipmap icon and Android 5+
      // will render it as a grey square (or drop the notification entirely on strict OEMs).
      smallIcon: 'ic_notification',
      iconColor: '#6dba8a',
      sound: 'default',
    },
  },
};

export default config;
