import { defineConfig } from 'vite';
// @ts-ignore
import { crx, defineManifest } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'Shiki Player TS',
  version: '2.0.0',
  description: 'Video player integration for Shikimori',
  permissions: ['storage'], // Важно для сохранения настроек
  action: {
    default_popup: 'src/popup/popup.html',
    // Если у вас нет иконки, можно пока закомментировать default_icon или использовать заглушку
    // default_icon: 'public/icon.png'
  },
  host_permissions: [
    '*://*.shiki.one/*',
    '*://*.shikimori.one/*',
    '*://*.shikimori.me/*'
  ],
  content_scripts: [
    {
      matches: [
        '*://shikimori.one/animes/*',
        '*://shikimori.me/animes/*',
        '*://shiki.one/animes/*'
      ],
      js: ['src/content.ts'],
      run_at: 'document_end'
    }
  ]
});

export default defineConfig({
  plugins: [crx({ manifest })],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173
    }
  },
});
