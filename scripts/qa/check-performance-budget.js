const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..', '..');
const buildDir = path.join(rootDir, 'build-vite');
const viteManifestPath = path.join(buildDir, '.vite', 'manifest.json');
const extensionManifestPath = path.join(buildDir, 'manifest.json');
const budgetPath = path.join(rootDir, 'config', 'performance-budget.json');
const KB_DIVISOR = 1024;
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';

function formatBytes(bytes) {
  return `${(bytes / KB_DIVISOR).toFixed(2)} KB`;
}

function supportsColor() {
  return Boolean(process.stdout && process.stdout.isTTY && process.env.TERM !== 'dumb');
}

function colour(text, colourCode) {
  if (!supportsColor()) {
    return text;
  }

  return `${colourCode}${text}${RESET}`;
}

function emphasise(text) {
  if (!supportsColor()) {
    return text;
  }

  return `${BOLD}${text}${RESET}`;
}

function dim(text) {
  if (!supportsColor()) {
    return text;
  }

  return `${DIM}${text}${RESET}`;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureFile(filePath, message) {
  if (!fs.existsSync(filePath)) {
    throw new Error(message);
  }
}

function getFileSize(relativePath) {
  const filePath = path.join(buildDir, relativePath);
  ensureFile(filePath, `Missing emitted file: ${relativePath}`);
  return fs.statSync(filePath).size;
}

function collectEntryAndImports(viteManifest, entryKey, visited = new Set()) {
  if (!entryKey || visited.has(entryKey)) {
    return visited;
  }

  const entry = viteManifest[entryKey];
  if (!entry) {
    return visited;
  }

  visited.add(entryKey);

  (entry.imports || []).forEach((importKey) => {
    collectEntryAndImports(viteManifest, importKey, visited);
  });

  return visited;
}

function getEntryBundleSize(viteManifest, entryKey) {
  const entries = Array.from(collectEntryAndImports(viteManifest, entryKey));
  return entries.reduce((total, key) => {
    const file = viteManifest[key] && viteManifest[key].file;
    if (!file) {
      return total;
    }

    return total + getFileSize(file);
  }, 0);
}

function metric(name, value, budgets) {
  const metricBudget = budgets[name];
  if (!metricBudget) {
    throw new Error(`Missing budget for metric: ${name}`);
  }

  return {
    name,
    value,
    budget: metricBudget.budget,
    baseline: metricBudget.baseline,
    ok: value <= metricBudget.budget,
  };
}

function getPopupMetrics(viteManifest) {
  const popupKey = 'src/pages/Popup/index.html';
  const popupEntry = viteManifest[popupKey];
  if (!popupEntry || !popupEntry.file) {
    throw new Error('Popup entry was not found in .vite manifest');
  }

  const popupJsBytes = getEntryBundleSize(viteManifest, popupKey);

  const popupCssBytes = (popupEntry.css || []).reduce((total, cssFile) => {
    return total + getFileSize(cssFile);
  }, 0);

  const popupAssetBytes = (popupEntry.assets || []).reduce((total, assetFile) => {
    return total + getFileSize(assetFile);
  }, 0);

  return {
    popupJsBytes,
    popupCssBytes,
    popupAssetBytes,
    popupFootprintBytes: popupJsBytes + popupCssBytes + popupAssetBytes,
  };
}

function getScriptMetrics(viteManifest, extensionManifest) {
  const contentKey = 'src/pages/Content/index.js';
  const backgroundKey = 'src/pages/Background/index.js';
  const injectPath = 'src/pages/Inject/index.js';

  const contentScriptBytes = getEntryBundleSize(viteManifest, contentKey);
  const backgroundScriptBytes = getEntryBundleSize(viteManifest, backgroundKey);
  const injectScriptBytes = getFileSize(injectPath);

  if (!extensionManifest?.content_scripts?.[0]?.js?.[0]) {
    throw new Error('No emitted content script path found in extension manifest');
  }

  return {
    contentScriptBytes,
    injectScriptBytes,
    backgroundScriptBytes,
  };
}

function printReport(results) {
  const heading = emphasise(colour('Performance Budget Report', CYAN));
  const divider = dim('-'.repeat(105));
  console.log(`\n${heading}`);
  console.log(divider);
  console.log(
    `${dim('STATUS'.padEnd(8, ' '))}${dim('METRIC'.padEnd(24, ' '))}${dim(
      'CURRENT'.padStart(13, ' ')
    )}${dim('BASELINE'.padStart(13, ' '))}${dim('BUDGET'.padStart(13, ' '))}${dim(
      'DELTA'.padStart(13, ' ')
    )}`
  );
  console.log(divider);

  results.forEach((result) => {
    const status = result.ok
      ? colour('PASS', GREEN)
      : colour('FAIL', RED);
    const delta = result.value - result.baseline;
    const deltaLabel = `${delta >= 0 ? '+' : ''}${formatBytes(delta)}`;
    const deltaColour = delta > 0 ? YELLOW : GREEN;
    const line = [
      status.padEnd(8, ' '),
      result.name.padEnd(24, ' '),
      `${formatBytes(result.value).padStart(13, ' ')}`,
      `${formatBytes(result.baseline).padStart(13, ' ')}`,
      `${formatBytes(result.budget).padStart(13, ' ')}`,
      `${colour(deltaLabel.padStart(13, ' '), deltaColour)}`,
    ].join('  ');
    console.log(line);
  });
  console.log(divider);
}

function run() {
  try {
    ensureFile(
      viteManifestPath,
      'No build manifest found at build-vite/.vite/manifest.json. Run `npm run build:prod` first.'
    );
    ensureFile(
      extensionManifestPath,
      'No extension manifest found at build-vite/manifest.json. Run `npm run build:prod` first.'
    );
    ensureFile(
      budgetPath,
      'No performance budget config found at config/performance-budget.json.'
    );

    const budgets = readJson(budgetPath);
    const viteManifest = readJson(viteManifestPath);
    const extensionManifest = readJson(extensionManifestPath);

    const popupMetrics = getPopupMetrics(viteManifest);
    const scriptMetrics = getScriptMetrics(viteManifest, extensionManifest);

    const results = [
      metric('popupJsBytes', popupMetrics.popupJsBytes, budgets),
      metric('popupCssBytes', popupMetrics.popupCssBytes, budgets),
      metric('popupAssetBytes', popupMetrics.popupAssetBytes, budgets),
      metric('popupFootprintBytes', popupMetrics.popupFootprintBytes, budgets),
      metric('contentScriptBytes', scriptMetrics.contentScriptBytes, budgets),
      metric('injectScriptBytes', scriptMetrics.injectScriptBytes, budgets),
      metric('backgroundScriptBytes', scriptMetrics.backgroundScriptBytes, budgets),
    ];

    printReport(results);

    const failed = results.filter((result) => !result.ok);
    if (failed.length > 0) {
      process.exitCode = 1;
      console.error(
        `\n${colour('Performance budget check failed', RED)} for ${failed.length} metric(s).`
      );
      return;
    }

    console.log(`\n${colour('Performance budget check passed.', GREEN)}`);
  } catch (error) {
    process.exitCode = 1;
    console.error(`\n${colour('Performance budget check failed:', RED)} ${error.message}`);
  }
}

run();
