#!/usr/bin/env node
// Generates public/icons/icon-192.png and icon-512.png without external deps.
// Visual: crimson circle on dark background (hinomaru-inspired).
import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function makePNG(size, pixelFn) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB

  const stride = 1 + size * 3;
  const raw = Buffer.alloc(size * stride);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [r, g, b] = pixelFn(x, y, size);
      const i = y * stride + 1 + x * 3;
      raw[i] = r; raw[i + 1] = g; raw[i + 2] = b;
    }
  }

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function pixel(x, y, size) {
  const cx = size / 2, cy = size / 2;
  const d = Math.hypot(x - cx, y - cy);
  const radius = size * 0.35;
  // Sub-pixel anti-aliasing at the circle edge
  const t = Math.max(0, Math.min(1, radius - d + 0.5));
  const bg = [13, 17, 23];
  const fg = [220, 20, 60];
  return bg.map((v, i) => Math.round(v * (1 - t) + fg[i] * t));
}

mkdirSync('public/icons', { recursive: true });
for (const size of [192, 512]) {
  const buf = makePNG(size, pixel);
  writeFileSync(`public/icons/icon-${size}.png`, buf);
  console.log(`✓ public/icons/icon-${size}.png  (${(buf.length / 1024).toFixed(1)} KB)`);
}
