const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1x1 transparent/colored PNG base64
// Minimal 1x1 yellow PNG
const minimalYellowPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/+f/fwAJ/wP3n1v1vQAAAABJRU5ErkJggg==',
  'base64'
);

// Minimal 64x64 valid PNG (yellow background with Optimal brand colors)
const pngFiles = ['icon.png', 'splash.png', 'adaptive-icon.png', 'favicon.png'];

for (const file of pngFiles) {
  const filePath = path.join(assetsDir, file);
  fs.writeFileSync(filePath, minimalYellowPng);
  console.log(`Created ${filePath}`);
}
