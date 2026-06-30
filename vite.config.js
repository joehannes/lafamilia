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
    minify: false, // Disable minification to reduce memory usage during build
    sourcemap: false, // Disable sourcemaps for production to reduce build size
    rollupOptions: {
      output: {
        manualChunks: {
          'chakra-vendor': ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
          'framer-motion': ['framer-motion'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
  },
  esbuild: {
    pure: ['console.log'],
  },
});
