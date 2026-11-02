#!/usr/bin/env node
// Gather the files the site needs into one folder for GitHub Pages: index.html, the app manifest and
// service worker, src/, the fonts and icons, and data/quran.json. docs/, scripts/ and the source
// files in data/sources/ are not published. The service worker gets two version stamps: a hash of
// the app files (so each deploy refreshes the saved app) and a hash of the page fonts' checksums
// (so the saved page fonts are kept until the fonts change).
//
// Usage: node scripts/build-site.mjs [folder]   (default: _site, inside the project)
// The folder is replaced, but only if it is missing or was made by this script (marker file).

import { createHash } from 'node:crypto';
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { ROOT } from './lib/sources.mjs';

const MARKER = '.built-by-build-site';
const FILES = [
  'index.html',
  'manifest.webmanifest',
  'sw.js',
  'src',
  'assets/fonts',
  'assets/icons',
  'data/quran.json',
];
const out = resolve(ROOT, process.argv[2] || '_site');
const fail = (msg) => {
  console.error(`build-site: ${msg}`);
  process.exit(1);
};

const inside = relative(ROOT, out);
if (!inside || inside.startsWith('..') || isAbsolute(inside))
  fail(`build into a folder inside the project, not ${out}`);
if (existsSync(out)) {
  if (!existsSync(join(out, MARKER)) && readdirSync(out).length)
    fail(`${inside} exists and was not made by this script; remove it or pick another folder`);
  rmSync(out, { recursive: true, force: true });
}
for (const rel of FILES) {
  const from = join(ROOT, rel);
  if (!existsSync(from)) fail(`${rel} is missing`);
  cpSync(from, join(out, rel), { recursive: true });
}
// Version stamps for the service worker.
const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)],
  );
const app = createHash('sha256');
for (const f of files(out).sort()) {
  const rel = relative(out, f).split(sep).join('/');
  if (rel.startsWith('assets/fonts/qcf2/') || rel === 'sw.js') continue;
  app.update(rel).update(readFileSync(f));
}
app.update(readFileSync(join(out, 'sw.js')));
const fonts = createHash('sha256').update(readFileSync(join(ROOT, 'data/sources/qcf2.sha256')));
const sw = readFileSync(join(out, 'sw.js'), 'utf8');
const stamped = sw
  .replace("const VERSION = 'dev';", `const VERSION = '${app.digest('hex').slice(0, 12)}';`)
  .replace(
    "const FONTS_VERSION = 'dev';",
    `const FONTS_VERSION = '${fonts.digest('hex').slice(0, 12)}';`,
  );
if (stamped === sw || stamped.includes("'dev'")) fail('sw.js: the version words were not found');
writeFileSync(join(out, 'sw.js'), stamped);
writeFileSync(join(out, '.nojekyll'), ''); // serve the files as they are
writeFileSync(join(out, MARKER), '');

const count = (dir) =>
  readdirSync(dir, { withFileTypes: true }).reduce(
    (n, e) => n + (e.isDirectory() ? count(join(dir, e.name)) : 1),
    0,
  );
console.log(`build-site: ${count(out)} files in ${inside} (${FILES.join(', ')})`);
