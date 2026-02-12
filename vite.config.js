import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import baseManifest from './src/manifest.json';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  const targetBrowser = process.env.TARGET_BROWSER || 'chrome';

  const manifest = {
    ...baseManifest,
    name: isDevelopment
      ? packageJson.name_development
      : packageJson.name_formatted,
    description: packageJson.description,
    version: packageJson.version,
  };

  if (targetBrowser === 'firefox') {
    manifest.background = {
      scripts: ['src/pages/Background/index.js'],
    };
  }

  if (isDevelopment) {
    manifest.content_security_policy = {
      extension_pages:
        "script-src 'self'; object-src 'self'; connect-src 'self' https://admin.shopify.com https://*.myshopify.com http://localhost:5173 ws://localhost:5173 http://127.0.0.1:5173 ws://127.0.0.1:5173;",
    };
  }

  const firefoxManifestCompatibilityPlugin = {
    name: 'firefox-manifest-compatibility',
    closeBundle() {
      if (targetBrowser !== 'firefox') {
        return;
      }

      const manifestPath = path.resolve('build-vite/manifest.json');
      if (!fs.existsSync(manifestPath)) {
        return;
      }

      const buildManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const resources = buildManifest.web_accessible_resources || [];

      buildManifest.web_accessible_resources = resources.map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return entry;
        }

        const { use_dynamic_url, ...rest } = entry;
        return rest;
      });

      fs.writeFileSync(manifestPath, JSON.stringify(buildManifest, null, 2));
    },
  };

  return {
    plugins: [react(), crx({ manifest }), firefoxManifestCompatibilityPlugin],
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
