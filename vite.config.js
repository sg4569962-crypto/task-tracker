import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/task-tracker/',
  plugins: [react()],
  test: { environment: 'node' },
});