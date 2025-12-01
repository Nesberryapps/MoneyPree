import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nesberry.moneypree',
  appName: 'MoneyPree',
  webDir: 'public',
  server: {
    url: 'https://www.moneypree.com',
    cleartext: true
  }
};

export default config;