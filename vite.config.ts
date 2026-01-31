import { defineConfig } from 'vite';
// @ts-ignore
import { crx, defineManifest } from '@crxjs/vite-plugin';

// Описываем манифест прямо здесь — так мы получаем типизацию!
const manifest = defineManifest({
  manifest_version: 3,
  name: 'Shiki Player TS',
  version: '2.0.0',
  description: 'Video player integration for Shikimori (Built with Vite)',
  permissions: [], // Позже добавим 'storage' для настроек
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
      js: ['src/content.ts'], // Vite сам найдет этот файл
      run_at: 'document_end'
    }
  ]
});
// ...
export default defineConfig({
  plugins: [crx({ manifest })],
});
