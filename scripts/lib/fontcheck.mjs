// Reads which characters a font can draw (its cmap table), from a TTF or a WOFF2 file, with no
// libraries. Used by validate to prove that every glyph code the site uses exists in its font, so
// nothing is drawn as an empty box.

import { readFileSync } from 'node:fs';
import { brotliDecompressSync } from 'node:zlib';

// WOFF2 table tags by index 0 to 62 (WOFF2 specification, "Known Table Tags").
const KNOWN = [
  ...['cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf'],
  ...['loca', 'prep', 'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT'],
  ...['VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC', 'JSTF', 'MATH', 'CBDT'],
  ...['CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar'],
  ...['fdsc', 'feat', 'fmtx', 'fvar', 'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd'],
  ...['prop', 'trak', 'Zapf', 'Silf', 'Glat', 'Gloc', 'Feat', 'Sill'],
];

function base128(buf, pos) {
  let value = 0;
  for (let i = 0; i < 5; i++) {
    const b = buf[pos.at++];
    value = value * 128 + (b & 0x7f);
    if (!(b & 0x80)) return value;
  }
  throw new Error('bad UIntBase128');
}

// Returns the bytes of one table.
function tableFromWoff2(buf, want) {
  const numTables = buf.readUInt16BE(12);
  const compressed = buf.readUInt32BE(20);
  const pos = { at: 48 };
  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const flags = buf[pos.at++];
    const tag =
      (flags & 0x3f) === 0x3f ? buf.toString('latin1', pos.at, (pos.at += 4)) : KNOWN[flags & 0x3f];
    const origLength = base128(buf, pos);
    const version = flags >> 6;
    const glyfOrLoca = tag === 'glyf' || tag === 'loca';
    const transformed = glyfOrLoca ? version !== 3 : version !== 0;
    const length = transformed ? base128(buf, pos) : origLength;
    tables.push({ tag, length });
  }
  if (buf.toString('latin1', 4, 8) === 'ttcf') throw new Error('font collections are not read');
  const data = brotliDecompressSync(buf.subarray(pos.at, pos.at + compressed));
  let offset = 0;
  for (const t of tables) {
    if (t.tag === want) return data.subarray(offset, offset + t.length);
    offset += t.length;
  }
  return null;
}

function tableFromSfnt(buf, want) {
  const numTables = buf.readUInt16BE(4);
  for (let i = 0; i < numTables; i++) {
    const rec = 12 + 16 * i;
    if (buf.toString('latin1', rec, rec + 4) === want) {
      const offset = buf.readUInt32BE(rec + 8);
      return buf.subarray(offset, offset + buf.readUInt32BE(rec + 12));
    }
  }
  return null;
}

// The set of code points the font maps to a real glyph (cmap formats 4 and 12, Unicode subtables).
export function readCmap(path) {
  const buf = readFileSync(path);
  const cmap =
    buf.toString('latin1', 0, 4) === 'wOF2'
      ? tableFromWoff2(buf, 'cmap')
      : tableFromSfnt(buf, 'cmap');
  if (!cmap) throw new Error(`${path}: no cmap table`);
  const codes = new Set();
  // Use the one subtable a browser would use, in this order of preference (as fontTools does).
  const PREFER = ['3,10', '0,6', '0,4', '3,1', '0,3', '0,2', '0,1', '0,0'];
  const n = cmap.readUInt16BE(2);
  const found = new Map();
  for (let i = 0; i < n; i++) {
    const key = `${cmap.readUInt16BE(4 + 8 * i)},${cmap.readUInt16BE(6 + 8 * i)}`;
    if (PREFER.includes(key) && !found.has(key)) found.set(key, cmap.readUInt32BE(8 + 8 * i));
  }
  const best = PREFER.find((key) => found.has(key));
  for (const offset of best ? [found.get(best)] : []) {
    const sub = cmap.subarray(offset);
    const format = sub.readUInt16BE(0);
    if (format === 4) {
      const segs = sub.readUInt16BE(6) / 2;
      const ends = 14;
      const starts = ends + 2 * segs + 2;
      const deltas = starts + 2 * segs;
      const ranges = deltas + 2 * segs;
      for (let s = 0; s < segs; s++) {
        const end = sub.readUInt16BE(ends + 2 * s);
        const start = sub.readUInt16BE(starts + 2 * s);
        const delta = sub.readUInt16BE(deltas + 2 * s);
        const range = sub.readUInt16BE(ranges + 2 * s);
        for (let c = start; c <= end && c !== 0xffff; c++) {
          let glyph;
          if (range === 0) glyph = (c + delta) & 0xffff;
          else {
            glyph = sub.readUInt16BE(ranges + 2 * s + range + 2 * (c - start));
            if (glyph) glyph = (glyph + delta) & 0xffff;
          }
          if (glyph) codes.add(c);
        }
      }
    } else if (format === 12) {
      const groups = sub.readUInt32BE(12);
      for (let g = 0; g < groups; g++) {
        const at = 16 + 12 * g;
        const start = sub.readUInt32BE(at);
        const end = sub.readUInt32BE(at + 4);
        const first = sub.readUInt32BE(at + 8);
        for (let c = start; c <= end; c++) if (first + (c - start)) codes.add(c);
      }
    }
  }
  return codes;
}
