// Settings and the last page, saved in the browser. Every read and write is wrapped in try/catch:
// a private window, blocked storage or a full quota must never stop the reader, it just forgets.

const PREFIX = 'qvo.';

export function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage is not available: the reader works the same, without memory.
  }
}
