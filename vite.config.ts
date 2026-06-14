import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/IAM/', // 👈 Tells Vite to look inside your repository folder for assets
});