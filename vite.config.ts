import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/IAM/', 
  build: {
    outDir: 'dist',
  },
  // 👈 Tells the builder to ignore your backend migration folder completely
  watch: {
    exclude: ['supabase/**']
  }
});