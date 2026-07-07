import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const mammothVendorPatterns = [
  /\/node_modules\/@xmldom\//,
  /\/node_modules\/bluebird\//,
  /\/node_modules\/jszip\//,
  /\/node_modules\/lop\//,
  /\/node_modules\/underscore\//,
  /\/node_modules\/xmlbuilder\//,
  /\/node_modules\/base64-js\//,
  /\/node_modules\/dingbat-to-unicode\//,
  /\/node_modules\/path-is-absolute\//,
  /\/node_modules\/mammoth\/node_modules\/argparse\//,
]

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/')

          if (
            normalizedId.includes('/node_modules/react-router-dom/') ||
            normalizedId.includes('/node_modules/react-router/')
          ) {
            return 'router'
          }

          if (
            normalizedId.includes('/node_modules/react/') ||
            normalizedId.includes('/node_modules/react-dom/')
          ) {
            return 'react-vendor'
          }

          if (mammothVendorPatterns.some((pattern) => pattern.test(normalizedId))) {
            return 'mammoth-vendor'
          }

          if (normalizedId.includes('/node_modules/mammoth/')) {
            return 'mammoth'
          }
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
  },
})
