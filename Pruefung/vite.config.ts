import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// Dual-Build: VITE_APP_MODE bestimmt Prüfungs- oder Übungsmodus
const appMode = process.env.VITE_APP_MODE || 'pruefung'
const istLernen = appMode === 'lernen'

// Base-Path: Standard = Production, überschreibbar via VITE_BASE_PATH
const defaultBasePath = istLernen ? '/GYM-WR-DUY/Lernplattform/' : '/GYM-WR-DUY/Pruefung/'
const basePath = process.env.VITE_BASE_PATH || defaultBasePath
// RegExp für navigateFallbackAllowlist aus basePath ableiten
const basePathEscaped = basePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// PWA-Manifest je nach Modus
const pwaManifest = istLernen
  ? {
      name: 'Übungstool — Gymnasium Hofwil',
      short_name: 'Übungstool',
      description: 'Digitales Übungstool zum Lernen und Üben',
      theme_color: '#171717',
      background_color: '#fafafa',
    }
  : {
      name: 'Prüfungstool — Gymnasium Hofwil',
      short_name: 'Prüfungstool',
      description: 'Digitales Prüfungstool',
      theme_color: '#1e40af',
      background_color: '#f8fafc',
    }

export default defineConfig({
  base: basePath,
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
    __LERNEN_BACKEND_URL__: JSON.stringify(process.env.VITE_LERNPLATTFORM_APPS_SCRIPT_URL || ''),
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../packages/shared/src')
    },
    dedupe: ['react', 'react-dom']
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        ...pwaManifest,
        display: 'standalone',
        scope: basePath,
        start_url: basePath,
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
        navigateFallbackAllowlist: [new RegExp(`^${basePathEscaped}(\\/|$)`)],
        // Statische Dateien NICHT durch SPA-Fallback ersetzen
        navigateFallbackDenylist: [/\.pdf$/i, /\.png$/i, /\.jpg$/i, /\.jpeg$/i, /\.gif$/i, /\.svg$/i, /\.mp3$/i, /\.mp4$/i, /\.webm$/i, /\/materialien\//],
        ...(istLernen ? {
          // Übungstool: Bilder für Pool-Fragen cachen
          runtimeCaching: [{
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/i,
            handler: 'CacheFirst',
            options: { cacheName: 'images', expiration: { maxEntries: 500, maxAgeSeconds: 30 * 24 * 60 * 60 } }
          }]
        } : {}),
      },
    }),
  ],
})
