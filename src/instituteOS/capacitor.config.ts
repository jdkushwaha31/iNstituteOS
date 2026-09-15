import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.instituteos.app',
  appName: 'InstituteOS',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
