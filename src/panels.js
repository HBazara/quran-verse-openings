// The Go to and Settings panels: each opens from its header button, one at a time. Escape or a
// click outside closes the open panel; Escape also puts focus back on the button that opened it.

export function setupPanels(pairs) {
  let open = null;

  function close(returnFocus = false) {
    if (!open) return;
    open.panel.hidden = true;
    open.button.setAttribute('aria-expanded', 'false');
    if (returnFocus) open.button.focus();
    open = null;
  }

  function show(pair) {
    close();
    pair.panel.hidden = false;
    pair.button.setAttribute('aria-expanded', 'true');
    open = pair;
    pair.panel.querySelector('input, select, button')?.focus();
  }

  for (const pair of pairs) {
    pair.button.addEventListener('click', () => (open === pair ? close() : show(pair)));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      close(true);
    }
  });
  document.addEventListener('pointerdown', (e) => {
    if (open && !open.panel.contains(e.target) && !open.button.contains(e.target)) close();
  });
  return { close };
}
