// Service worker: lets the reader work offline (installable app).
// - The app itself (pages, code, strings, data, the banner and Bismillah fonts) is saved when the
//   worker installs, about 5 MB.
// - Each page's font is saved the first time the page is shown; "Download all pages" in Settings
//   saves all 604 (about 95 MB). Page fonts stay saved across new versions of the site.
// - App files come from the network whenever it is there, so every deploy is live at once; the
//   saved copy is used only when offline.
// scripts/build-site.mjs replaces the two version words below with hashes of the files.

const VERSION = 'dev';
const FONTS_VERSION = 'dev';
const SHELL_CACHE = `qvo-shell-${VERSION}`;
const PAGES_CACHE = `qvo-pages-${FONTS_VERSION}`;
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'src/app.js',
  'src/controls.js',
  'src/fonts.js',
  'src/i18n.js',
  'src/input.js',
  'src/language.js',
  'src/offline.js',
  'src/panels.js',
  'src/peek.js',
  'src/places.js',
  'src/print.js',
  'src/progress.js',
  'src/render.js',
  'src/search.js',
  'src/storage.js',
  'src/styles.css',
  'src/test-mode.js',
  'src/i18n/en.json',
  'src/i18n/ar.json',
  'data/quran.json',
  'assets/fonts/surah-header/QCF_SurahHeader_COLOR-Regular.woff2',
  'assets/fonts/bismillah/QCF2BSML.ttf',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
];
const PAGE_FONT = /\/assets\/fonts\/qcf2\/p\d+\.woff2$/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

// Old versions of the app are removed; the saved page fonts are kept unless the fonts changed.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('qvo-') && k !== SHELL_CACHE && k !== PAGES_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(PAGE_FONT.test(url.pathname) ? savedFirst(request) : networkFirst(request));
});

// Page fonts never change within a version: the saved copy first, else the network (and save it).
async function savedFirst(request) {
  const cache = await caches.open(PAGES_CACHE);
  const saved = await cache.match(request);
  if (saved) return saved;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

// Everything else: the network first (and keep a copy), the saved copy when offline.
async function networkFirst(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const saved = await cache.match(request, { ignoreSearch: true });
    if (saved) return saved;
    if (request.mode === 'navigate') {
      const page = await cache.match('index.html');
      if (page) return page;
    }
    throw error;
  }
}
