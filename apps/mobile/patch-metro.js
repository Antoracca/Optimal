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
console.log('Searching for DependencyGraph.js in', rootNodeModules);

walkDir(rootNodeModules, (filePath) => {
  if (filePath.endsWith('DependencyGraph.js')) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // 1. Patch fileSystem.exists
      if (content.includes('return this._fileSystem.exists(filePath);')) {
        content = content.replace(
          'return this._fileSystem.exists(filePath);',
          'return (this._fileSystem && typeof this._fileSystem.exists === "function") ? this._fileSystem.exists(filePath) : _fs.default.existsSync(filePath);'
        );
        modified = true;
      }

      // 2. Patch getOrCreateMap null safety
      const origGetOrCreateMap = /function getOrCreateMap\(map, field\) \{[\s\S]*?return subMap;\s*\}/;
      const safeGetOrCreateMap = `function getOrCreateMap(map, field) {
  if (!map || typeof map.get !== "function") return new Map();
  let subMap = map.get(field);
  if (!subMap) {
    subMap = new Map();
    if (typeof map.set === "function") {
      map.set(field, subMap);
    }
  }
  return subMap;
}`;

      if (origGetOrCreateMap.test(content)) {
        content = content.replace(origGetOrCreateMap, safeGetOrCreateMap);
        modified = true;
      }

      // 3. Patch _resolutionCache fallback in resolveDependency
      if (content.includes('const mapByResolverOptions = this._resolutionCache;')) {
        content = content.replace(
          'const mapByResolverOptions = this._resolutionCache;',
          'const mapByResolverOptions = this._resolutionCache ?? (this._resolutionCache = new Map());'
        );
        modified = true;
      }

      // 4. Ensure constructor initializes _resolutionCache
      if (content.includes('this._config = config;') && !content.includes('this._resolutionCache = new Map();\n    this._config = config;')) {
        content = content.replace(
          'this._config = config;',
          'this._config = config;\n    this._resolutionCache = new Map();'
        );
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Successfully patched Metro DependencyGraph:', filePath);
      }
    } catch (e) {
      console.error('Error patching:', filePath, e.message);
    }
  }
});
