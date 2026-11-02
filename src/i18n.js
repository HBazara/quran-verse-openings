// Interface strings. All interface text lives in src/i18n/en.json and src/i18n/ar.json (same keys).
// The Quran pages are always Arabic; only the interface changes language. Both files are loaded at
// the start, so the language can change at any time without reloading.

export const LANGUAGES = ['en', 'ar'];
const strings = {};
let lang = 'en';

export async function loadAllStrings() {
  await Promise.all(
    LANGUAGES.map(async (code) => {
      const res = await fetch(`src/i18n/${code}.json`);
      if (!res.ok) throw new Error(`strings ${code}: HTTP ${res.status}`);
      strings[code] = await res.json();
    }),
  );
}

// The whole interface follows the language: Arabic turns the layout right to left.
export function setLanguage(code) {
  lang = code;
  document.documentElement.lang = code;
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
}

export const language = () => lang;

export function tIn(code, key, vars = {}) {
  const s = strings[code]?.[key];
  if (s === undefined) return key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export const t = (key, vars) => tIn(lang, key, vars);

// Numbers in the interface: Arabic-Indic digits in Arabic, Western digits in English.
const locale = () => (lang === 'ar' ? 'ar-EG' : 'en-US');
export function formatNumber(n) {
  return new Intl.NumberFormat(locale(), { useGrouping: false }).format(n);
}

// Percentages (zoom): "125%" in English, "١٢٥٪" in Arabic.
export function formatPercent(fraction) {
  return new Intl.NumberFormat(locale(), { style: 'percent', maximumFractionDigits: 0 }).format(
    fraction,
  );
}

// Typed numbers: Arabic-Indic (U+0660 to U+0669) and Eastern Arabic-Indic (U+06F0 to U+06F9)
// digits become 0 to 9. Built from code points so no tool can change the characters.
const cp = (c) => String.fromCodePoint(c);
const ARABIC_DIGIT = new RegExp(`[${cp(0x660)}-${cp(0x669)}${cp(0x6f0)}-${cp(0x6f9)}]`, 'gu');
export function toWesternDigits(text) {
  return text.replace(ARABIC_DIGIT, (d) => String(d.codePointAt(0) & 0xf));
}

// Fill every element that names a string key. data-i18n and data-i18n-label follow the interface
// language; data-i18n-en and data-i18n-ar always use that one language (the language screen).
export function applyStrings(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-label]').forEach((el) => {
    const label = t(el.dataset.i18nLabel);
    el.setAttribute('aria-label', label);
    if (el.tagName === 'BUTTON') el.title = label;
  });
  for (const code of LANGUAGES) {
    root.querySelectorAll(`[data-i18n-${code}]`).forEach((el) => {
      el.textContent = tIn(code, el.getAttribute(`data-i18n-${code}`));
    });
  }
  document.title = t('app.title');
}
