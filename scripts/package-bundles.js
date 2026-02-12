#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const buildDir = path.join(repoRoot, 'build-vite');
const bundledDir = path.join(repoRoot, 'Bundled');
const packageJsonPath = path.join(repoRoot, 'package.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;
const targetArg = (process.argv[2] || 'both').toLowerCase();

if (!version) {
  console.error('No version found in package.json.');
  process.exit(1);
}

function run(command, args, options = {}) {
  execFileSync(command, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    ...options,
  });
}

function zipBuild(outputName) {
  if (!fs.existsSync(buildDir)) {
    console.error('build-vite directory was not found.');
    process.exit(1);
  }

  if (!fs.existsSync(bundledDir)) {
    fs.mkdirSync(bundledDir, { recursive: true });
  }

  const outputPath = path.join(bundledDir, outputName);
  if (fs.existsSync(outputPath)) {
    fs.rmSync(outputPath);
  }

  execFileSync('zip', ['-r', outputPath, '.'], {
    cwd: buildDir,
    stdio: 'inherit',
  });
}

try {
  if (targetArg === 'chrome' || targetArg === 'both') {
    run('npm', ['run', 'build:prod']);
    const chromeZip = `theme-explorer-${version}.chrome.bundled.zip`;
    zipBuild(chromeZip);
    console.log(`Created ${chromeZip}`);
  }

  if (targetArg === 'firefox' || targetArg === 'both') {
    run('npm', ['run', 'build:firefox']);
    const firefoxZip = `theme-explorer-${version}.firefox.bundled.zip`;
    zipBuild(firefoxZip);
    console.log(`Created ${firefoxZip}`);
  }

  if (!['chrome', 'firefox', 'both'].includes(targetArg)) {
    console.error(
      "Unknown target. Use 'chrome', 'firefox', or omit it to build both."
    );
    process.exit(1);
  }
} catch (error) {
  console.error('Failed to build and package browser bundles.');
  process.exit(error.status || 1);
}
