
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nesberry.moneypree',
  appName: 'MoneyPree',
  webDir: 'out',
  server: {
    url: process.env.CAPACITOR_SERVER_URL,
    cleartext: true,
  }
};

export default config;
