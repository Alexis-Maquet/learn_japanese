import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../src');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  );
}

const files = walk(srcDir).filter((f) => /\.(tsx?|js)$/.test(f));
let changed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  const fileDir = path.dirname(file);

  content = content.replace(/from '(\.[^']+)'/g, (match, rel) => {
    if (!rel.startsWith('.')) return match;
    const abs = path.resolve(fileDir, rel).replace(/\\/g, '/');
    const srcNorm = srcDir.replace(/\\/g, '/');
    if (!abs.startsWith(srcNorm)) return match;
    const alias = '@/' + abs.slice(srcNorm.length + 1);
    return `from '${alias}'`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
    console.log('Updated:', path.relative(srcDir, file).replace(/\\/g, '/'));
  }
}
console.log(`Done — ${changed} files updated.`);
