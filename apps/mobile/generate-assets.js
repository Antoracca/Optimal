/**
 * Script de création des assets PNG valides pour l'application Optimal
 * Génère : icon.png (1024x1024), splash.png (1284x2778), adaptive-icon.png (1024x1024), favicon.png (64x64)
 * 
 * Utilise uniquement le module natif 'canvas' si disponible, sinon crée des PNG minimaux valides via Buffer
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');

// ─── Créer un PNG minimal valide en pur Node.js (sans dépendance externe) ─────
// Format PNG: signature + IHDR + IDAT + IEND
function createPng(width, height, r, g, b) {
  const zlib = require('zlib');

  // Signature PNG
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // IDAT chunk: raw pixel rows (filter byte 0 + RGB per pixel)
  const rowSize = 1 + width * 3;
  const rawPixels = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    rawPixels[rowStart] = 0; // filter type: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowStart + 1 + x * 3;
      rawPixels[pixelOffset] = r;
      rawPixels[pixelOffset + 1] = g;
      rawPixels[pixelOffset + 2] = b;
    }
  }
  const compressed = zlib.deflateSync(rawPixels);
  const idat = makeChunk('IDAT', compressed);

  // IEND chunk
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = crc32(crcData);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32 pour PNG
function crc32(buf) {
  const table = makeCrcTable();
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF);
}

let _crcTable = null;
function makeCrcTable() {
  if (_crcTable) return _crcTable;
  _crcTable = new Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    _crcTable[n] = c;
  }
  return _crcTable;
}

// ─── Génération des assets ─────────────────────────────────────────────────────
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// icon.png – 1024×1024 – Fond noir Optimal
const icon = createPng(1024, 1024, 0, 0, 0);
fs.writeFileSync(path.join(ASSETS_DIR, 'icon.png'), icon);
console.log('✅ icon.png créé (1024×1024, fond noir Optimal)');

// adaptive-icon.png – 1024×1024 – Fond jaune Optimal #FFE500
const adaptiveIcon = createPng(1024, 1024, 255, 229, 0);
fs.writeFileSync(path.join(ASSETS_DIR, 'adaptive-icon.png'), adaptiveIcon);
console.log('✅ adaptive-icon.png créé (1024×1024, fond jaune #FFE500)');

// splash.png – 1284×2778 – Fond blanc pur (splash screen portrait)
const splash = createPng(1284, 2778, 255, 255, 255);
fs.writeFileSync(path.join(ASSETS_DIR, 'splash.png'), splash);
console.log('✅ splash.png créé (1284×2778, fond blanc)');

// favicon.png – 64×64 – Fond noir Optimal
const favicon = createPng(64, 64, 0, 0, 0);
fs.writeFileSync(path.join(ASSETS_DIR, 'favicon.png'), favicon);
console.log('✅ favicon.png créé (64×64, fond noir)');

console.log('\n🎉 Tous les assets PNG valides ont été générés dans ./assets/');
console.log('   Tailles :', fs.readdirSync(ASSETS_DIR).map(f => {
  const stat = fs.statSync(path.join(ASSETS_DIR, f));
  return `${f}: ${(stat.size / 1024).toFixed(1)} KB`;
}).join(', '));
