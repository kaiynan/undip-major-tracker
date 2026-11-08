import { APP_NAME } from './src/config/brand';

/**
 * Konfigurasi Capacitor untuk pembungkusan hybrid mobile (Android & iOS).
 * Jalankan `npx cap sync` dan `npx cap open android` setelah build statis (`next build`).
 */
export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime?: boolean;
  server?: {
    androidScheme?: string;
    cleartext?: boolean;
    url?: string;
  };
  plugins?: Record<string, Record<string, unknown>>;
}

const config: CapacitorConfig = {
  appId: 'id.ac.undip.majormatcher',
  appName: APP_NAME,
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#002060',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#002060',
    },
  },
};

export default config;
