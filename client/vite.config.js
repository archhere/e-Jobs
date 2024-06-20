import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
   fastRefresh: false // Add this line
  })],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js"
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components/'),
      // …
    },
  },
  server: {
    fs: {
      cachedChecks: false
    }
  }
})
