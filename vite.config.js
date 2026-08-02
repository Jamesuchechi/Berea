import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png', 'berea_logo.png'],
      // Inject modern mobile meta tags (replaces deprecated apple-mobile-web-app-capable)
      injectManifest: false,
      devOptions: {
        enabled: false  // Disable SW in dev to avoid MIME type noise
      },
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
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
