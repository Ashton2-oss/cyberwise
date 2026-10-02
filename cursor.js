// ═══════════════ CUSTOM CURSOR ═══════════════
// Dot snaps to the cursor. Ring lags with a lerp.
// Ring scales up on links, buttons, and role="button".
// Disabled on touch devices and under 1024px.

(() => {
  const styleId = 'cyberwise-cursor-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .cursor-dot,
      .cursor-ring {
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 10000;
        will-change: transform;
        transition:
          opacity .3s var(--ease),
          border-color .25s var(--ease),
          box-shadow .25s var(--ease);
      }
      .cursor-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--c-accent, #22D3EE);
        box-shadow: 0 0 5px var(--c-accent, #22D3EE), 0 0 10px rgba(34,211,238,.28);
        mix-blend-mode: screen;
      }
      .cursor-ring {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 1.25px solid var(--c-accent, #22D3EE);
        opacity: .45;
        mix-blend-mode: screen;
        box-shadow: 0 0 10px rgba(34,211,238,.2);
      }
      .cursor-ring.is-hover {
        opacity: .85;
        border-color: var(--signal-2, #5EEAD4);
        box-shadow: 0 0 14px var(--signal-glow, rgba(34, 211, 238, .55));
      }
      .cursor-ring.is-cta {
        opacity: 1;
        border-color: var(--signal-2, #5EEAD4);
        box-shadow: 0 0 18px var(--signal-glow, rgba(34, 211, 238, .55));
      }
      [data-theme="light"] .cursor-dot {
        mix-blend-mode: normal;
        background: #0E7490;
        box-shadow: 0 0 0 1.5px rgba(255,255,255,.85), 0 0 6px rgba(14,116,144,.45);
      }
      [data-theme="light"] .cursor-ring {
        mix-blend-mode: normal;
        border-color: #0E7490;
        box-shadow: 0 0 0 1.5px rgba(255,255,255,.55), 0 0 8px rgba(14,116,144,.28);
        opacity: .55;
      }
      [data-theme="light"] .cursor-ring.is-hover {
        opacity: .95;
        border-color: #0891B2;
        box-shadow: 0 0 0 1.5px rgba(255,255,255,.7), 0 0 12px rgba(8,145,178,.5);
      }
      [data-theme="light"] .cursor-ring.is-cta {
        opacity: 1;
        border-color: #0891B2;
        box-shadow: 0 0 0 1.5px rgba(255,255,255,.8), 0 0 16px rgba(8,145,178,.6);
      }
      @media (max-width: 1024px) {
        .cursor-dot,
        .cursor-ring { display: none !important; }
      }
      @media (hover: none) {
        .cursor-dot,
        .cursor-ring { display: none !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        .cursor-ring { transition: none; }
      }
    `;
    document.head.appendChild(style);
  }

  const canRun =
    matchMedia('(hover: hover) and (pointer: fine)').matches &&
    innerWidth > 1024;
  if (!canRun) return;

  let dot = document.getElementById('cursorDot');
  let ring = document.getElementById('cursorRing');
  if (!dot || !ring) {
    dot = document.createElement('div');
    dot.id = 'cursorDot';
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');

    ring = document.createElement('div');
    ring.id = 'cursorRing';
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');

    document.body.appendChild(dot);
    document.body.appendChild(ring);
  }

  let mx = innerWidth / 2;
  let my = innerHeight / 2;
  let rx = mx;
  let ry = my;
  let scale = 1;
  let targetScale = 1;
  let hovering = false;

  addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseover', function (e) {
    const t = e.target;
    if (t && t.closest && t.closest('a, button, [role="button"], .choice, .door, .case')) {
      hovering = true;
      targetScale = 1.15;
    }
  }, { passive: true });

  document.addEventListener('mouseout', function (e) {
    const t = e.target;
    if (t && t.closest && t.closest('a, button, [role="button"], .choice, .door, .case')) {
      hovering = false;
      targetScale = 1;
      ring.classList.remove('is-hover', 'is-cta');
    }
  }, { passive: true });

  let lastX = mx;
  let lastY = my;
  let velocityX = 0;
  let velocityY = 0;

  function tick() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    scale += (targetScale - scale) * 0.22;

    velocityX = mx - lastX;
    velocityY = my - lastY;
    lastX = mx;
    lastY = my;

    dot.style.transform = 'translate3d(' + (mx - 4) + 'px, ' + (my - 4) + 'px, 0)';

    if (hovering) {
      ring.style.transform = 'translate3d(' + (rx - 20) + 'px, ' + (ry - 20) + 'px, 0) scale(' + scale + ')';
    } else {
      const speed = Math.min(Math.hypot(velocityX, velocityY), 30);
      const stretch = 1 + speed / 320;
      const squash = 1 - speed / 640;
      const angle = Math.atan2(velocityY, velocityX) * 180 / Math.PI;
      ring.style.transform = 'translate3d(' + (rx - 20) + 'px, ' + (ry - 20) + 'px, 0) rotate(' + angle + 'deg) scale(' + (stretch * scale) + ', ' + (squash * scale) + ')';
    }

    requestAnimationFrame(tick);
  }

  tick();

  document.documentElement.style.cursor = 'none';

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      document.documentElement.style.cursor = '';
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    }
  });

  document.addEventListener('mousemove', function () {
    if (document.documentElement.style.cursor === '') {
      document.documentElement.style.cursor = 'none';
      dot.style.opacity = '';
      ring.style.opacity = '';
    }
  });
})();
