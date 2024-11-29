import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',  // Carpeta de salida para los archivos construidos
    assetsDir: 'assets',  // Directorio donde se colocarán los archivos estáticos como CSS y JS
  },
  plugins: [
    react(),
    electron({
      main: {
        // Entrada para el proceso principal de Electron
        entry: 'electron/main.ts',
      },
      preload: {
        // Entrada para el proceso de precarga
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      renderer: process.env.NODE_ENV === 'test'
        ? undefined
        : {},
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Ajusta el puerto según tu configuración
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
