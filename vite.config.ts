import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/learn_japanese/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Bundle JS/CSS/HTML/fonts/images; serve large JSON from network with cache-first fallback
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          // Google Fonts stylesheet
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          // Google Fonts files
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          // Kanji DB (~98MB) — cache after first load, valid 30 days
          {
            urlPattern: /\/kanjiapi_full\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'kanji-db',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // Word examples
          {
            urlPattern: /\/kanji_words\.json$/,
            handler: 'CacheFirst',
            options: { cacheName: 'kanji-words' },
          },
          // Stroke order SVGs
          {
            urlPattern: /\/svg\/.+\.svg$/,
            handler: 'CacheFirst',
            options: { cacheName: 'stroke-order-svgs' },
          },
        ],
      },
      manifest: {
        name: 'Learn Japanese — Kanji',
        short_name: 'Kanji',
        description: 'Apprenez les kanjis japonais par niveau JLPT',
        lang: 'fr',
        theme_color: '#0d1117',
        background_color: '#0d1117',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/learn_japanese/',
        scope: '/learn_japanese/',
        icons: [
          { src: '/learn_japanese/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/learn_japanese/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
