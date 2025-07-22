import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  base: '/',
  publicDir: 'public',
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
      },
      // This ensures the _redirects file is copied to the dist folder
      outDir: 'dist',
      assetsDir: 'assets',
    },
    define: {
      'process.env': process.env,
      __APP_ENV__: env.APP_ENV,
    },
  }
})