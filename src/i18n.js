// Interface strings. All interface text lives in src/i18n/en.json and src/i18n/ar.json (same keys).
// The Quran pages are always Arabic; only the interface changes language.

let strings = {};
let lang = 'en';

export async function loadStrings(code) {
  const res = await fetch(`src/i18n/${code}.json`);
  if (!res.ok) throw new Error(`strings ${code}: HTTP ${res.status}`);
  strings = await res.json();
  lang = code;
  document.documentElement.lang = code;
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
}

export function t(key, vars = {}) {
  const s = strings[key];
  if (s === undefined) return key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

// Numbers in the interface: Arabic-Indic digits in Arabic, Western digits in English.
export function formatNumber(n) {
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
  return new Intl.NumberFormat(locale, { useGrouping: false }).format(n);
}

// Fill every element that names a string key.
export function applyStrings(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-label]').forEach((el) => {
    const label = t(el.dataset.i18nLabel);
    el.setAttribute('aria-label', label);
    if (el.tagName === 'BUTTON') el.title = label;
  });
  document.title = t('app.title');
}
