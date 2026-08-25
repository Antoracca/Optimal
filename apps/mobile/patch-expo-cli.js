const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath, callback);
      } else {
        callback(fullPath);
      }
    } catch (e) {}
  }
}

const rootNodeModules = path.join(__dirname, '../../node_modules');
console.log('Searching for getNativeModuleVersions.js in', rootNodeModules);

walkDir(rootNodeModules, (filePath) => {
  if (filePath.endsWith('getNativeModuleVersions.js')) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('fromBundledNativeModuleList(data);') && !content.includes('// PATCHED FOR NODE 24')) {
        content = content.replace(
          'async function getNativeModuleVersionsAsync(sdkVersion) {',
          `// PATCHED FOR NODE 24
async function getNativeModuleVersionsAsync(sdkVersion) {
    try {
        const bundled = require('expo/bundledNativeModules.json');
        if (bundled) return bundled;
    } catch (e) {}`
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Successfully patched:', filePath);
      }
    } catch (e) {
      console.error('Error patching:', filePath, e.message);
    }
  }
});
