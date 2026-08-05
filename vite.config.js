import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.jpg', 'berea_logo.jpg'],
      injectManifest: false,
      manifest: {
        name: 'Berea — Christian Study App',
        short_name: 'Berea',
        description: 'Christian study app bringing Deuterocanon, Pseudepigrapha, and early church writings into one clean AI-assisted study experience.',
        theme_color: '#243A2B',
        background_color: '#FBF6EC',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
