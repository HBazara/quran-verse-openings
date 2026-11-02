#!/usr/bin/env node
// Gather the files the site needs into one folder for GitHub Pages: index.html, src/, the fonts and
// data/quran.json. docs/, scripts/ and the source files in data/sources/ are not published.
//
// Usage: node scripts/build-site.mjs [folder]   (default: _site, inside the project)
// The folder is replaced, but only if it is missing or was made by this script (marker file).

import { cpSync, existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { ROOT } from './lib/sources.mjs';

const MARKER = '.built-by-build-site';
const FILES = ['index.html', 'src', 'assets/fonts', 'data/quran.json'];
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
writeFileSync(join(out, '.nojekyll'), ''); // serve the files as they are
writeFileSync(join(out, MARKER), '');

const count = (dir) =>
  readdirSync(dir, { withFileTypes: true }).reduce(
    (n, e) => n + (e.isDirectory() ? count(join(dir, e.name)) : 1),
    0,
  );
console.log(`build-site: ${count(out)} files in ${inside} (${FILES.join(', ')})`);
