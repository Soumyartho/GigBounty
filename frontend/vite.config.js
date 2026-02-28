import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill Node.js globals for blockchain libraries (algosdk, @perawallet/connect)
    // These libraries reference `global` and `process` at import time which don't exist in browsers
    global: 'globalThis',
    'process.env': {},
  },
})
