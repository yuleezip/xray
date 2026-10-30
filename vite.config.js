import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Actions sets this automatically for repository Pages.
const base = process.env.GITHUB_PAGES_BASE || '/xray/';

export default defineConfig({
  base,
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['icon.svg'],
    manifest: {
      name: 'XRAY Camera — Skeleton FX',
      short_name: 'XRAY Camera',
      description: 'Simulated X-ray skeleton camera effect',
      start_url: base,
      scope: base,
      display: 'standalone',
      background_color: '#050d16',
      theme_color: '#050d16',
      icons: [{ src: `${base}icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' }]
    },
    workbox: { navigateFallback: `${base}index.html`, globPatterns: ['**/*.{js,css,html,svg,png}'] }
  })]
});
