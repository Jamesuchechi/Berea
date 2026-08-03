import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    ...(process.env.NODE_ENV === 'production'
      ? [
          // eslint-disable-next-line global-require
          require('vite-plugin-pwa')({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png', 'berea_logo.png'],
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
                  src: '/icon-512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any maskable'
                }
              ]
            }
          })
        ]
      : []),
  ]
});
