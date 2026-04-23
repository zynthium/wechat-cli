#!/usr/bin/env node

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PLATFORM_PACKAGES = {
  'darwin-arm64': '@canghe_ai/wechat-cli-darwin-arm64',
  'darwin-x64':   '@canghe_ai/wechat-cli-darwin-x64',
  'linux-x64':    '@canghe_ai/wechat-cli-linux-x64',
  'linux-arm64':  '@canghe_ai/wechat-cli-linux-arm64',
  'win32-x64':    '@canghe_ai/wechat-cli-win32-x64',
};

const platformKey = `${process.platform}-${process.arch}`;
const ext = process.platform === 'win32' ? '.exe' : '';

function getBinaryPath() {
  if (process.env.WECHAT_CLI_BINARY) {
    return process.env.WECHAT_CLI_BINARY;
  }

  const pkg = PLATFORM_PACKAGES[platformKey];
  if (!pkg) {
    console.error(`wechat-cli: unsupported platform ${platformKey}`);
    process.exit(1);
  }

  const paths = [
    path.join('/Users/joeslee/Projects/GitHub/wechat-cli/npm/platforms', platformKey, 'bin', `wechat-cli${ext}`),
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) {
      console.error(`Using binary: ${p}`);
      return p;
    }
  }

  console.error(`wechat-cli: binary not found for ${platformKey}`);
  console.error('Try: npm install --force @canghe/wechat-cli');
  process.exit(1);
}

try {
  execFileSync(getBinaryPath(), process.argv.slice(2), {
    stdio: 'inherit',
    env: { ...process.env },
  });
} catch (e) {
  if (e && e.status != null) process.exit(e.status);
  throw e;
}