import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/GYM-WR-DUY/Pruefung/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Prüfungsplattform WR — Gymnasium Hofwil',
        short_name: 'Prüfung WR',
        description: 'Digitale Prüfungsplattform für Wirtschaft & Recht',
        theme_color: '#1e40af',
        background_color: '#f8fafc',
        display: 'standalone',
        scope: '/GYM-WR-DUY/Pruefung/',
        start_url: '/GYM-WR-DUY/Pruefung/',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
        navigateFallbackAllowlist: [/^\/GYM-WR-DUY\/Pruefung(\/|$)/],
      },
    }),
  ],
})
