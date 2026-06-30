import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
    minify: 'esbuild',
    sourcemap: false,
    target: 'esnext',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'chakra-vendor': ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
          'framer-motion': ['framer-motion'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'intl-vendor': ['react-intl'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
  },
  esbuild: {
    pure: ['console.log'],
    legalComments: 'none',
  },
});
