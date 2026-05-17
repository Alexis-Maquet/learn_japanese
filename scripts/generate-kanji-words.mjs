#!/usr/bin/env node
// Usage: node scripts/generate-kanji-words.mjs [path/to/jmdict-eng.json]
// If no path is given, downloads the latest jmdict-simplified release from GitHub.

import https from 'node:https';
import fs from 'node:fs';
import { open } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createInflateRaw } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';
import os from 'node:os';

const OUTPUT = 'public/kanji_words.json';
const MAX_PER_KANJI = 3;
const KANJI_RE = /[一-鿿㐀-䶿豈-﫿]/;

// ── ZIP extractor (pure Node.js, no external deps) ────────────────────────────

async function extractZip(zipPath, destDir) {
  const fh = await open(zipPath, 'r');
  const { size } = await fh.stat();

  // Search for EOCD signature from end of file (handles optional ZIP comment)
  const searchLen = Math.min(65558, size);
  const tail = Buffer.alloc(searchLen);
  await fh.read(tail, 0, searchLen, size - searchLen);

  let eocdIdx = -1;
  for (let i = tail.length - 22; i >= 0; i--) {
    if (tail[i] === 0x50 && tail[i + 1] === 0x4b && tail[i + 2] === 0x05 && tail[i + 3] === 0x06) {
      eocdIdx = i;
      break;
    }
  }
  if (eocdIdx < 0) throw new Error('EOCD not found — not a valid ZIP file');

  const eocd = tail.slice(eocdIdx, eocdIdx + 22);
  const numEntries = eocd.readUInt16LE(10);
  const cdOffset = eocd.readUInt32LE(16);

  const extracted = [];
  let pos = cdOffset;

  for (let i = 0; i < numEntries; i++) {
    const cdHdr = Buffer.alloc(46);
    await fh.read(cdHdr, 0, 46, pos);

    const method = cdHdr.readUInt16LE(10);
    const compressedSize = cdHdr.readUInt32LE(20);
    const fnLen = cdHdr.readUInt16LE(28);
    const extraLen = cdHdr.readUInt16LE(30);
    const commentLen = cdHdr.readUInt16LE(32);
    const lhOffset = cdHdr.readUInt32LE(42);

    const fnBuf = Buffer.alloc(fnLen);
    await fh.read(fnBuf, 0, fnLen, pos + 46);
    const filename = fnBuf.toString('utf8');

    pos += 46 + fnLen + extraLen + commentLen;

    if (filename.endsWith('/') || compressedSize === 0) continue;

    // Read local file header to get actual data offset
    const lh = Buffer.alloc(30);
    await fh.read(lh, 0, 30, lhOffset);
    const lhFnLen = lh.readUInt16LE(26);
    const lhExtraLen = lh.readUInt16LE(28);
    const dataOffset = lhOffset + 30 + lhFnLen + lhExtraLen;

    const outPath = path.join(destDir, path.basename(filename));
    const src = createReadStream(zipPath, { start: dataOffset, end: dataOffset + compressedSize - 1 });
    const dst = createWriteStream(outPath);

    if (method === 0) {
      await pipeline(src, dst);
    } else if (method === 8) {
      await pipeline(src, createInflateRaw(), dst);
    } else {
      throw new Error(`Unsupported ZIP compression method: ${method}`);
    }
    extracted.push(outPath);
  }

  await fh.close();
  return extracted;
}

// ── HTTP helpers ───────────────────────────────────────────────────────────────

function httpsGetJson(url) {
  return new Promise((resolve, reject) => {
    function req(u) {
      https.get(u, { headers: { 'User-Agent': 'generate-kanji-words' } }, (res) => {
        if ([301, 302, 307, 308].includes(res.statusCode)) { req(res.headers.location); return; }
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode} — ${u}`)); return; }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
        res.on('error', reject);
      }).on('error', reject);
    }
    req(url);
  });
}

function downloadToFile(url, dest) {
  return new Promise((resolve, reject) => {
    function req(u) {
      https.get(u, { headers: { 'User-Agent': 'generate-kanji-words' } }, (res) => {
        if ([301, 302, 307, 308].includes(res.statusCode)) { req(res.headers.location); return; }
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
        const out = createWriteStream(dest);
        const total = parseInt(res.headers['content-length'] ?? '0', 10);
        let downloaded = 0;
        res.on('data', (chunk) => {
          downloaded += chunk.length;
          if (total > 0) process.stdout.write(`\r  ${Math.round(downloaded / total * 100)}%`);
        });
        res.pipe(out);
        out.on('finish', () => { out.close(); process.stdout.write('\n'); resolve(); });
        out.on('error', reject);
      }).on('error', reject);
    }
    req(url);
  });
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function getJmdictPath() {
  const arg = process.argv[2];
  if (arg) {
    if (!fs.existsSync(arg)) throw new Error(`Fichier introuvable : ${arg}`);
    return { filePath: arg, cleanup: false };
  }

  console.log('Récupération de la dernière version jmdict-simplified depuis GitHub…');
  const release = await httpsGetJson('https://api.github.com/repos/scriptin/jmdict-simplified/releases/latest');
  const asset = release.assets.find((a) => a.name.startsWith('jmdict-eng') && a.name.endsWith('.json.zip'));
  if (!asset) throw new Error('Asset jmdict-eng JSON zip introuvable');

  const sizeMB = Math.round(asset.size / 1024 / 1024);
  console.log(`Téléchargement de ${asset.name} (${sizeMB} MB)…`);

  const tmpDir = os.tmpdir();
  const zipPath = path.join(tmpDir, asset.name);

  await downloadToFile(asset.browser_download_url, zipPath);

  console.log('Extraction…');
  const extracted = await extractZip(zipPath, tmpDir);
  fs.unlinkSync(zipPath);

  const jsonPath = extracted.find((f) => f.endsWith('.json'));
  if (!jsonPath) throw new Error('Aucun fichier .json trouvé dans le ZIP');

  return { filePath: jsonPath, cleanup: true };
}

function hasKanji(str) { return KANJI_RE.test(str); }
function extractKanjiChars(str) {
  return [...new Set([...str].filter((c) => KANJI_RE.test(c)))];
}

async function main() {
  const { filePath, cleanup } = await getJmdictPath();

  console.log(`Lecture de ${path.basename(filePath)}…`);
  const jmdict = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (cleanup) { try { fs.unlinkSync(filePath); } catch {} }

  const total = jmdict.words?.length ?? 0;
  console.log(`Traitement de ${total} entrées…`);

  const candidateMap = new Map();

  for (const entry of jmdict.words ?? []) {
    if (!entry.kanji?.length) continue;

    const kanjiForm = entry.kanji.find((k) => k.common) ?? entry.kanji[0];
    const word = kanjiForm.text;
    if (!hasKanji(word)) continue;

    const kanaForm =
      entry.kana.find((k) => k.common && (k.appliesToKanji.includes('*') || k.appliesToKanji.includes(word))) ??
      entry.kana.find((k) => k.appliesToKanji.includes('*') || k.appliesToKanji.includes(word)) ??
      entry.kana[0];
    if (!kanaForm) continue;

    const gloss = entry.sense?.[0]?.gloss?.find((g) => g.lang === 'eng');
    if (!gloss) continue;

    const candidate = { w: word, r: kanaForm.text, m: gloss.text, common: !!kanjiForm.common, len: word.length };

    for (const char of extractKanjiChars(word)) {
      if (!candidateMap.has(char)) candidateMap.set(char, []);
      candidateMap.get(char).push(candidate);
    }
  }

  const output = {};
  for (const [char, words] of candidateMap) {
    output[char] = words
      .sort((a, b) => (a.common === b.common ? a.len - b.len : a.common ? -1 : 1))
      .slice(0, MAX_PER_KANJI)
      .map(({ w, r, m }) => ({ w, r, m }));
  }

  console.log(`Écriture de ${OUTPUT}…`);
  fs.writeFileSync(OUTPUT, JSON.stringify(output));

  const sizeKB = Math.round(fs.statSync(OUTPUT).size / 1024);
  console.log(`Terminé ! ${Object.keys(output).length} kanjis couverts, ${sizeKB} KB`);
}

main().catch((err) => {
  console.error('Erreur :', err.message);
  process.exit(1);
});
