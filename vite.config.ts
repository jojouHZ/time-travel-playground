import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin([
      'VITE_APP_DB_NAME',
      'VITE_APP_DB_VERSION',
      'VITE_APP_STORE_NAME',
    ]),
  ],
});
