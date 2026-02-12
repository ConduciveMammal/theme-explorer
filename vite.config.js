import fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import baseManifest from './src/manifest.json';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  const manifest = {
    ...baseManifest,
    name: isDevelopment
      ? packageJson.name_development
      : packageJson.name_formatted,
    description: packageJson.description,
    version: packageJson.version,
  };

  if (isDevelopment) {
    manifest.content_security_policy = {
      extension_pages:
        "script-src 'self'; object-src 'self'; connect-src 'self' https://admin.shopify.com https://*.myshopify.com http://localhost:5173 ws://localhost:5173 http://127.0.0.1:5173 ws://127.0.0.1:5173;",
    };
  }

  return {
    plugins: [react(), crx({ manifest })],
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      cors: true,
      hmr: {
        host: 'localhost',
        clientPort: 5173,
        port: 5173,
        protocol: 'ws',
      },
    },
    build: {
      outDir: 'build-vite',
      sourcemap: isDevelopment,
      // Keep previously emitted hashed assets in watch mode so open popup
      // pages do not break with ERR_FILE_NOT_FOUND between rebuilds.
      emptyOutDir: !isDevelopment,
    },
  };
});
