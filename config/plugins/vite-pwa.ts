import { VitePWA } from 'vite-plugin-pwa'

// https://github.com/antfu/vite-plugin-pwa
export function vitePWA() {
  return VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg'],
    workbox: {
      maximumFileSizeToCacheInBytes: 1024 * 1024 * 50,
    },
    manifest: {
      name: 'vitesse plain pro',
      short_name: 'vitesse plain pro',
      theme_color: '#ffffff',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
  })
}
