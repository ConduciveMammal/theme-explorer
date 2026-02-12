const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const os = require('node:os');
const { execFile } = require('node:child_process');

const rootDir = path.resolve(__dirname, '..', '..');
const buildDir = path.join(rootDir, 'build-vite');
const budgetPath = path.join(rootDir, 'config', 'performance-budget.json');
const popupEntryPath = path.join(buildDir, 'src', 'pages', 'Popup', 'index.html');
const METRIC_ATTRIBUTE = 'data-theme-explorer-popup-first-render-ms';
const TABLE_WIDTH = 89;
const STATUS_WIDTH = 8;
const METRIC_WIDTH = 24;
const VALUE_WIDTH = 13;

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';

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

function ensureFile(filePath, message) {
  if (!fs.existsSync(filePath)) {
    throw new Error(message);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function resolveChromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean);

  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function startStaticServer(root) {
  const server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
    const safePath = path
      .normalize(requestPath)
      .replace(/^(\.\.[/\\])+/, '')
      .replace(/^[/\\]+/, '');
    const filePath = path.join(root, safePath || 'index.html');

    if (!filePath.startsWith(root)) {
      response.statusCode = 403;
      response.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        response.statusCode = 404;
        response.end('Not found');
        return;
      }

      if (filePath.endsWith('.html')) response.setHeader('Content-Type', 'text/html');
      if (filePath.endsWith('.js')) response.setHeader('Content-Type', 'application/javascript');
      if (filePath.endsWith('.css')) response.setHeader('Content-Type', 'text/css');
      if (filePath.endsWith('.svg')) response.setHeader('Content-Type', 'image/svg+xml');
      if (filePath.endsWith('.woff2')) response.setHeader('Content-Type', 'font/woff2');
      response.end(data);
    });
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, port: address.port });
    });
  });
}

function execFileAsync(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    execFile(command, args, options, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`${error.message}\n${stderr || ''}`.trim()));
        return;
      }

      resolve({ stdout, stderr });
    });
  });
}

function extractMetricValue(domText) {
  const regex = new RegExp(`${METRIC_ATTRIBUTE}="(\\d+)"`);
  const match = domText.match(regex);
  return match ? Number(match[1]) : null;
}

async function run() {
  const heading = emphasise(colour('Popup Render Budget Check', CYAN));
  console.log(`\n${heading}`);
  console.log(dim('-'.repeat(TABLE_WIDTH)));

  ensureFile(
    popupEntryPath,
    'Popup build output not found. Run `npm run build:prod` first.'
  );
  ensureFile(
    budgetPath,
    'No performance budget config found at config/performance-budget.json.'
  );

  const budgetConfig = readJson(budgetPath);
  const popupBudgetMetric = budgetConfig.popupFirstRenderMs;
  if (!popupBudgetMetric) {
    throw new Error('Missing popupFirstRenderMs metric in performance budget config.');
  }

  const chromePath = resolveChromePath();
  if (!chromePath) {
    throw new Error(
      'Google Chrome was not found. Set CHROME_PATH to a Chrome executable to run popup render checks.'
    );
  }

  const { server, port } = await startStaticServer(buildDir);
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-explorer-chrome-'));
  const popupUrl = `http://127.0.0.1:${port}/src/pages/Popup/index.html`;

  try {
    console.log(dim('Launching headless Chrome to sample popup render time...'));

    const chromeArgs = [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--allow-file-access-from-files',
      `--user-data-dir=${userDataDir}`,
      '--virtual-time-budget=6000',
      '--dump-dom',
      popupUrl,
    ];

    const { stdout } = await execFileAsync(chromePath, chromeArgs, {
      timeout: 20000,
      maxBuffer: 1024 * 1024 * 5,
    });
    console.log(dim('Headless Chrome completed. Parsing render metric...'));

    const measuredMs = extractMetricValue(stdout);
    if (measuredMs == null) {
      throw new Error(
        `Could not find ${METRIC_ATTRIBUTE} in popup DOM output.`
      );
    }

    const budgetMs = popupBudgetMetric.budget;
    const baselineMs = popupBudgetMetric.baseline;
    const deltaMs = measuredMs - baselineMs;
    const statusText = measuredMs <= budgetMs ? 'PASS' : 'FAIL';
    const status = colour(statusText.padEnd(8, ' '), measuredMs <= budgetMs ? GREEN : RED);
    const deltaLabel = `${deltaMs >= 0 ? '+' : ''}${deltaMs}ms`;
    const deltaColour = deltaMs > 0 ? YELLOW : GREEN;

    console.log(
      [
        dim('STATUS'.padEnd(STATUS_WIDTH, ' ')),
        dim('METRIC'.padEnd(METRIC_WIDTH, ' ')),
        dim('CURRENT'.padStart(VALUE_WIDTH, ' ')),
        dim('BASELINE'.padStart(VALUE_WIDTH, ' ')),
        dim('BUDGET'.padStart(VALUE_WIDTH, ' ')),
        dim('DELTA'.padStart(VALUE_WIDTH, ' ')),
      ].join('  ')
    );
    console.log(dim('-'.repeat(TABLE_WIDTH)));
    console.log(
      [
        status.padEnd(STATUS_WIDTH, ' '),
        'popupFirstRenderMs'.padEnd(METRIC_WIDTH, ' '),
        `${measuredMs}ms`.padStart(VALUE_WIDTH, ' '),
        `${baselineMs}ms`.padStart(VALUE_WIDTH, ' '),
        `${budgetMs}ms`.padStart(VALUE_WIDTH, ' '),
        colour(deltaLabel.padStart(VALUE_WIDTH, ' '), deltaColour),
      ].join('  ')
    );
    console.log(dim('-'.repeat(TABLE_WIDTH)));

    if (measuredMs > budgetMs) {
      process.exitCode = 1;
      console.error(
        `\n${colour(
          'Popup render budget check failed.',
          RED
        )} Measured ${measuredMs}ms exceeds budget ${budgetMs}ms.`
      );
      return;
    }

    console.log(`\n${colour('Popup render budget check passed.', GREEN)}`);
  } finally {
    server.close();
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
}

run().catch((error) => {
  process.exitCode = 1;
  const message = error.message.includes('timed out')
    ? `${error.message}\n${dim(
        'Tip: set CHROME_PATH to a local Chrome binary or rerun if Chrome was starting for the first time.'
      )}`
    : error.message;
  console.error(`\n${colour('Popup render budget check failed:', RED)} ${message}`);
});
