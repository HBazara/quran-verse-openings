// The language screen. It opens every time the site opens, before the mushaf. Each choice is
// written in its own language ("English", "العربية"), and the one used last is highlighted and
// focused, so one tap or Enter continues. The rest of the page is inert while it is open.

const screen = document.getElementById('language-screen');
const behind = () => [...document.body.children].filter((el) => el !== screen);

export const languageScreenOpen = () => !screen.hidden;

export function askLanguage(highlight) {
  const buttons = [...screen.querySelectorAll('button[data-lang]')];
  for (const b of buttons) b.classList.toggle('last', b.dataset.lang === highlight);
  screen.hidden = false;
  for (const el of behind()) el.inert = true;
  buttons.find((b) => b.dataset.lang === highlight)?.focus();
  return new Promise((resolve) => {
    screen.addEventListener('click', function pick(e) {
      const b = e.target.closest('button[data-lang]');
      if (!b) return;
      screen.removeEventListener('click', pick);
      screen.hidden = true;
      for (const el of behind()) el.inert = false;
      resolve(b.dataset.lang);
    });
  });
}
