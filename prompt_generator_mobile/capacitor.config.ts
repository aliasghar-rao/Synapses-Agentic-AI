import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.promptforge.app',
  appName: 'PromptForge',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    }
  }
};

export default config;
