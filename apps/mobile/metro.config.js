const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Monorepo support
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 2. Block Android/iOS native build output from project root
const escapedRoot = projectRoot.replace(/\\/g, '/').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
config.resolver.blockList = [
  new RegExp(`${escapedRoot}/android/.*`),
  new RegExp(`${escapedRoot}/ios/.*`),
];

// 3. Asset extensions
config.resolver.assetExts.push('lottie');

module.exports = config;
