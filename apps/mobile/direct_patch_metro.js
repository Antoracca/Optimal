const fs = require('fs');
const path = require('path');

// 1. Patch DependencyGraph files
const files = [
  'c:/Users/HP/optimal/node_modules/.pnpm/metro@0.84.5/node_modules/metro/src/node-haste/DependencyGraph.js',
  'c:/Users/HP/optimal/node_modules/.pnpm/@expo+metro@54.2.0/node_modules/metro/src/node-haste/DependencyGraph.js',
  'c:/Users/HP/optimal/node_modules/.pnpm/@expo+metro@56.0.2/node_modules/metro/src/node-haste/DependencyGraph.js'
];

const safeGetOrCreateMap = `function getOrCreateMap(map, field) {
  if (!map || typeof map.get !== 'function') return new Map();
  let subMap = map.get(field);
  if (!subMap) {
    subMap = new Map();
    if (typeof map.set === 'function') {
      map.set(field, subMap);
    }
  }
  return subMap;
}`;

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    const origRegex = /function getOrCreateMap\(map, field\) \{[\s\S]*?return subMap;\s*\}/;
    if (origRegex.test(content)) {
      content = content.replace(origRegex, safeGetOrCreateMap);
    }

    if (content.includes('const mapByResolverOptions = this._resolutionCache;')) {
      content = content.replace(
        'const mapByResolverOptions = this._resolutionCache;',
        'const mapByResolverOptions = this._resolutionCache ?? (this._resolutionCache = new Map());'
      );
    }

    if (content.includes('this._config = config;') && !content.includes('this._resolutionCache = new Map();\n    this._config = config;')) {
      content = content.replace(
        'this._config = config;',
        'this._config = config;\n    this._resolutionCache = new Map();'
      );
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('PATCHED SUCCESSFULLY:', file);
  }
}

// 2. Patch binary-file-store for EMFILE resiliency on Windows
const rootNodeModules = path.join(__dirname, '../../node_modules');
function walkAndPatch(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!e.name.startsWith('.') || e.name === '.pnpm') {
        walkAndPatch(full);
      }
    } else if (e.name === 'binary-file-store.js') {
      let code = fs.readFileSync(full, 'utf8');
      if (code.includes("if (err.code === 'ENOENT')")) {
        code = code.replace(
          "if (err.code === 'ENOENT')",
          "if (err.code === 'ENOENT' || err.code === 'EMFILE' || err.code === 'EBUSY')"
        );
        fs.writeFileSync(full, code, 'utf8');
        console.log('PATCHED EMFILE in:', full);
      }
    }
  }
}

walkAndPatch(rootNodeModules);
