// ═══════════════ CUSTOM CURSOR ═══════════════
// Dot snaps to the cursor. Ring lags with a lerp.
// Ring scales up on links, buttons, and role="button".
// Disabled on touch devices and under 1024px.

(() => {
  const canRun =
    matchMedia('(hover: hover) and (pointer: fine)').matches &&
    innerWidth > 1024;
  if (!canRun) return;

  // Find the cursor elements. If missing, create and append them.
  let dot = document.getElementById('cursorDot');
  let ring = document.getElementById('cursorRing');

  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'cursorDot';
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
  }
  if (!ring) {
    ring = document.createElement('div');
    ring.id = 'cursorRing';
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);
  }

  let mx = innerWidth / 2;
  let my = innerHeight / 2;
  let rx = mx;
  let ry = my;
  let scale = 1;
  let targetScale = 1;
  let hovering = false;

  addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  const HOVER_SELECTOR = 'a, button, [role="button"], .choice, .door, .case, .chip, .progress-chip, .btn';

  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    if (t && t.closest && t.closest(HOVER_SELECTOR)) {
      hovering = true;
      targetScale = 1.15;
      ring.classList.add('is-hover');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const t = e.target;
    if (t && t.closest && t.closest(HOVER_SELECTOR)) {
      hovering = false;
      targetScale = 1;
      ring.classList.remove('is-hover', 'is-cta');
    }
  }, { passive: true });

  let lastX = mx;
  let lastY = my;

  function tick() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    scale += (targetScale - scale) * 0.22;

    const vx = mx - lastX;
    const vy = my - lastY;
    lastX = mx;
    lastY = my;

    dot.style.transform =
      'translate3d(' + (mx - 3) + 'px, ' + (my - 3) + 'px, 0)';

    if (hovering) {
      ring.style.transform =
        'translate3d(' + (rx - 13) + 'px, ' + (ry - 13) + 'px, 0) scale(' + scale + ')';
    } else {
      const speed = Math.min(Math.hypot(vx, vy), 30);
      const stretch = 1 + speed / 320;
      const squash = 1 - speed / 640;
      const angle = Math.atan2(vy, vx) * 180 / Math.PI;
      ring.style.transform =
        'translate3d(' + (rx - 13) + 'px, ' + (ry - 13) + 'px, 0) rotate(' + angle + 'deg) scale(' +
        (stretch * scale) + ', ' + (squash * scale) + ')';
    }

    requestAnimationFrame(tick);
  }

  tick();

  // Hide the OS cursor. But restore it on Tab (keyboard users need to see focus).
  document.documentElement.style.cursor = 'none';

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.documentElement.style.cursor = '';
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    }
  });

  document.addEventListener('mousemove', () => {
    if (document.documentElement.style.cursor === '') {
      document.documentElement.style.cursor = 'none';
      dot.style.opacity = '';
      ring.style.opacity = '';
    }
  });
})();
