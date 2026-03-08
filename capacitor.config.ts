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
      smallIcon: 'ic_launcher',
      iconColor: '#6dba8a',
      sound: 'default',
    },
  },
};

export default config;
