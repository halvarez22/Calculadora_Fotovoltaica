import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acceso externo (0.0.0.0)
    allowedHosts: true, // permite cualquier host (incluye *.ngrok-free.app)
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
});
