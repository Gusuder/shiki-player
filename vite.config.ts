import { defineConfig } from 'vite';
import { crx, defineManifest } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'Shiki Player TS',
  version: '1.0.0',
  description: 'Video player integration for Shikimori',
  permissions: [],
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
});
