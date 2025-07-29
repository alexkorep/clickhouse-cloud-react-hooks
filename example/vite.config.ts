import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point to the source code of the parent package for live reload
      'clickhouse-cloud-react-hooks': resolve(__dirname, '../src/main.ts'),
    },
  },
  // Ensure Vite watches the parent src directory for changes
  server: {
    watch: {
      // Watch the parent src directory
      ignored: ['!**/node_modules/**', '!**/../src/**'],
    },
  },
  // Include the parent src in the dependency optimization
  optimizeDeps: {
    exclude: ['clickhouse-cloud-react-hooks'],
  },
})
