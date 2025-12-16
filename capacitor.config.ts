import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nesberry.moneypree',
  appName: 'MoneyPree',
  webDir: 'out',
  server: {
    // This should be commented out or removed for production builds
    // that are bundled with the app. It's only for live reload.
    // url: 'https://www.moneypree.com',
    cleartext: true,
    allowNavigation: [
      'moneypree.com',
      'www.moneypree.com',
      '*.moneypree.com',
      '*.firebaseapp.com'
    ]
  }
};

export default config;
