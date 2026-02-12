const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..', '..');
const buildDir = path.join(rootDir, 'build-vite');
const buildManifestPath = path.join(buildDir, 'manifest.json');
const packageJsonPath = path.join(rootDir, 'package.json');

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`✓ ${message}`);
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(buildDir, relativePath));
}

function parseJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assertManifestPathExists(label, relativePath) {
  if (!relativePath) {
    fail(`${label} is missing from manifest`);
    return;
  }

  if (!fileExists(relativePath)) {
    fail(`${label} file was not emitted: ${relativePath}`);
    return;
  }

  pass(`${label} exists: ${relativePath}`);
}

function run() {
  if (!fs.existsSync(buildManifestPath)) {
    fail(
      'No build manifest found at build-vite/manifest.json. Run `npm run build:prod` first.'
    );
    return;
  }

  const buildManifest = parseJson(buildManifestPath);
  const packageJson = parseJson(packageJsonPath);

  if (buildManifest.version !== packageJson.version) {
    fail(
      `Build version mismatch. Expected ${packageJson.version}, found ${buildManifest.version}.`
    );
  } else {
    pass(`Manifest version matches package.json (${packageJson.version})`);
  }

  assertManifestPathExists(
    'Popup entry',
    buildManifest.action && buildManifest.action.default_popup
  );

  const backgroundServiceWorkerPath =
    buildManifest.background && buildManifest.background.service_worker;
  const backgroundScriptPath =
    buildManifest.background &&
    buildManifest.background.scripts &&
    buildManifest.background.scripts[0];

  if (backgroundServiceWorkerPath) {
    assertManifestPathExists('Background service worker', backgroundServiceWorkerPath);
  } else if (backgroundScriptPath) {
    assertManifestPathExists('Background script', backgroundScriptPath);
  } else {
    fail('Background entry is missing from manifest');
  }

  const contentScriptPath =
    buildManifest.content_scripts &&
    buildManifest.content_scripts[0] &&
    buildManifest.content_scripts[0].js &&
    buildManifest.content_scripts[0].js[0];

  assertManifestPathExists('Content script bundle', contentScriptPath);

  const webAccessibleResourcePath =
    buildManifest.web_accessible_resources &&
    buildManifest.web_accessible_resources[0] &&
    buildManifest.web_accessible_resources[0].resources &&
    buildManifest.web_accessible_resources[0].resources[0];

  assertManifestPathExists(
    'Inject script web-accessible resource',
    webAccessibleResourcePath
  );

  const hostPermissions = buildManifest.host_permissions || [];
  const expectedPermissions = [
    'https://admin.shopify.com/*',
    'https://*.myshopify.com/*',
  ];

  expectedPermissions.forEach((permission) => {
    if (!hostPermissions.includes(permission)) {
      fail(`Missing host permission: ${permission}`);
      return;
    }

    pass(`Host permission present: ${permission}`);
  });

  if (process.exitCode) {
    console.error(
      '\nBuild verification failed. Fix the issues above before releasing.'
    );
    return;
  }

  console.log('\nBuild verification passed. Ready for manual smoke checks.');
}

run();
