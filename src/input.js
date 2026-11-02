// Keyboard and touch. As in an Arabic book, the left arrow turns to the next page and the right
// arrow to the previous one. On a touch screen, a swipe to the right shows the next page (it comes
// in from the left), a swipe to the left the previous one.

// Fields keep their own arrow keys (moving the cursor, choosing an option).
const OWN_ARROWS = 'input, select, textarea, [contenteditable]';
const SWIPE = { minX: 50, maxTime: 800 }; // px and ms; the swipe must also be mostly sideways

// active(): false while something covers the reader (the language screen).
export function setupKeys(turn, active = () => true) {
  document.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || !active()) return;
    if (e.target instanceof Element && e.target.closest(OWN_ARROWS)) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      turn(1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      turn(-1);
    }
  });
}

// canSwipe() is false while the zoomed page can be moved sideways, so moving it is not a page turn.
export function setupSwipe(el, turn, canSwipe) {
  let start = null;
  el.addEventListener('pointerdown', (e) => {
    start =
      e.pointerType !== 'mouse' && e.isPrimary
        ? { x: e.clientX, y: e.clientY, t: e.timeStamp }
        : null;
  });
  el.addEventListener('pointercancel', () => {
    start = null;
  });
  el.addEventListener('pointerup', (e) => {
    if (!start || !e.isPrimary) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const quick = e.timeStamp - start.t <= SWIPE.maxTime;
    start = null;
    if (!quick || Math.abs(dx) < SWIPE.minX || Math.abs(dx) < 2 * Math.abs(dy) || !canSwipe())
      return;
    turn(dx > 0 ? 1 : -1);
  });
}
