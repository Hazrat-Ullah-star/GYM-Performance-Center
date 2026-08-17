import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Gzip + Brotli pre-compression of assets (served by CDN/nginx)
    compression({ algorithm: 'gzip', exclude: [/\.(png|jpe?g|gif|svg|ico|webp)$/] }),
    compression({ algorithm: 'brotliCompress', exclude: [/\.(png|jpe?g|gif|svg|ico|webp)$/] }),
    // Bundle visualizer — only in analyse mode: npm run analyze
    mode === 'analyze' &&
      visualizer({
        open: true,
        filename: 'dist/bundle-report.html',
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },

  build: {
    // Warn when a chunk exceeds 500 KB (before gzip)
    chunkSizeWarningLimit: 500,
    // esbuild minification (default, but explicit for clarity)
    minify: 'esbuild',
    sourcemap: false,

    rollupOptions: {
      output: {
        /**
         * Manual chunk strategy — groups stable vendor libraries into separate
         * named chunks that browsers can cache independently of app code.
         *
         * Chunk plan:
         *   vendor-react   → react, react-dom, react-router-dom  (~130 KB gz)
         *   vendor-motion  → framer-motion                        (~45 KB gz)
         *   vendor-ui      → lucide-react                         (~20 KB gz)
         *   vendor-http    → axios                                (~14 KB gz)
         *   Lazy page chunks created automatically by React.lazy()
         */
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('react/')
            ) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            if (id.includes('axios')) {
              return 'vendor-http';
            }
            // All other node_modules in one "libs" chunk
            return 'vendor-libs';
          }
        },
      },
    },
  },
}))
