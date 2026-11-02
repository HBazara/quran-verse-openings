// Offline use: registers the service worker (sw.js) and runs the "Offline use" section of the
// Settings panel: how many pages are saved, and a button that saves all 604 page fonts (about
// 95 MB). Without service workers (or on plain http), the section is hidden and the reader works
// online as before.

import { formatNumber, t } from './i18n.js';

const $ = (id) => document.getElementById(id);
const TOTAL = 604;
const AT_ONCE = 4; // downloads in parallel

export function setupOffline() {
  const section = $('offline');
  const status = $('offline-status');
  const button = $('offline-download');
  const supported = 'serviceWorker' in navigator && 'caches' in window && window.isSecureContext;
  if (!supported) {
    section.hidden = true;
    return { refresh() {}, fillTexts() {} };
  }
  navigator.serviceWorker.register('sw.js').catch(() => {
    section.hidden = true;
  });
  let busy = false;
  let lastKey = 'offline.count';
  let lastVars = {};

  // vars hold plain numbers; they are written in the interface's digits each time
  const say = (key, vars = {}) => {
    lastKey = key;
    lastVars = vars;
    const shown = Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, formatNumber(v)]));
    status.textContent = t(key, shown);
  };

  async function saved() {
    const name = (await caches.keys()).find((k) => k.startsWith('qvo-pages-'));
    if (!name) return 0;
    const requests = await (await caches.open(name)).keys();
    return requests.filter((r) => /\/p\d+\.woff2$/.test(r.url)).length;
  }

  async function refresh() {
    if (busy) return;
    const n = await saved();
    say(n >= TOTAL ? 'offline.done' : 'offline.count', { n, total: TOTAL });
  }

  // The worker saves each page font as it passes through, so the page only has to ask for them.
  async function downloadAll() {
    busy = true;
    button.disabled = true;
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise((ok) =>
        navigator.serviceWorker.addEventListener('controllerchange', ok, { once: true }),
      );
    let done = 0;
    let failed = 0;
    const pages = Array.from({ length: TOTAL }, (_, i) => i + 1);
    const work = async () => {
      for (let p = pages.shift(); p; p = pages.shift()) {
        try {
          const res = await fetch(`assets/fonts/qcf2/p${p}.woff2`);
          if (!res.ok) failed++;
          await res.arrayBuffer();
        } catch {
          failed++;
        }
        done++;
        if (done % 8 === 0 || done === TOTAL) say('offline.progress', { n: done, total: TOTAL });
      }
    };
    await Promise.all(Array.from({ length: AT_ONCE }, work));
    busy = false;
    button.disabled = false;
    if (failed) say('offline.failed');
    else await refresh();
  }

  button.addEventListener('click', () => {
    if (!busy) downloadAll();
  });

  return {
    refresh,
    // after a language change
    fillTexts: () => say(lastKey, lastVars),
  };
}
