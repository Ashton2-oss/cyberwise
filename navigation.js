(() => {
  // ─── Nav config ──────────────────────────────
  const canonicalLinks = [
    { href: 'landing.html', label: 'Home' },
    { href: 'guide.html',   label: 'Learn' },
    { href: 'screen6.html', label: 'Practise' },
    { href: 'hub.html',     label: 'Hub' },
    { href: 'recovery.html', label: 'Recover' }
  ];

  // Sub-pages that should highlight a parent nav item
  const parentMap = {
    'landing.html':     'landing.html',
    'index.html':       'landing.html',
    'guide.html':       'guide.html',
    'screen6.html':     'screen6.html',
    'hub.html':         'hub.html',
    'dashboard.html':   'hub.html',
    'daily.html':       'hub.html',
    'data_breach.html': 'hub.html',
    'social_safety.html':'hub.html',
    'word-hunt.html':   'hub.html',
    'recovery.html':    'recovery.html',
    'recover.html':     'recovery.html'
  };

  // ─── Inject CSS ──────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .topbar .nav a.active,
    .topbar .nav a[aria-current="page"] {
      color: var(--ink);
      background: var(--lavender-soft, rgba(139,92,246,.1));
      font-weight: 600;
    }
    .topbar .menu-toggle {
      display: none;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      padding: 0;
      border: 1px solid var(--border, rgba(20,20,43,.12));
      border-radius: 10px;
      background: var(--surface, #fff);
      color: var(--ink, #1A1A2E);
      font: inherit;
      font-size: 1.15rem;
      line-height: 1;
      cursor: pointer;
      transition: all .2s ease;
    }
    .topbar .menu-toggle:hover {
      border-color: var(--border-strong, rgba(20,20,43,.2));
      transform: translateY(-1px);
    }
    .topbar .menu-toggle:focus-visible,
    .topbar .nav a:focus-visible {
      outline: 3px solid var(--lavender-2, #8B5CF6);
      outline-offset: 3px;
    }
    @media (max-width: 820px) {
      .topbar { padding: 10px 14px !important; }
      .topbar .menu-toggle { display: inline-flex; }
      .topbar .actions { display: flex; align-items: center; gap: 8px; }
      .topbar nav.nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 60;
        display: none !important;
        flex-direction: column;
        gap: 4px;
        width: 100%;
        max-height: min(70vh, 28rem);
        overflow-y: auto;
        padding: 12px 14px max(12px, env(safe-area-inset-bottom));
        background: var(--bg, #F5F4FB);
        border-bottom: 1px solid var(--border, rgba(20,20,43,.12));
        box-shadow: 0 12px 24px rgba(20,20,43,.12);
      }
      .topbar.nav-open nav.nav { display: flex !important; }
      .topbar nav.nav a {
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 14px;
        font-size: .92rem;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .topbar .menu-toggle { transition: none; }
    }
  `;
  document.head.appendChild(style);

  // ─── Build nav ──────────────────────────────
  const topbar = document.querySelector('.topbar');
  const nav = topbar && topbar.querySelector('nav.nav');
  if (!topbar || !nav) return;

  nav.replaceChildren();
  canonicalLinks.forEach(({ href, label }) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    nav.appendChild(link);
  });
  nav.setAttribute('aria-label', 'Main navigation');
  nav.id = nav.id || 'primary-navigation';

  // ─── Highlight current page ─────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'landing.html';
  const highlight = parentMap[currentPage] || currentPage;
  nav.querySelectorAll('a').forEach(link => {
    if (link.getAttribute('href') === highlight) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ─── Ensure actions container exists ────────
  let actions = topbar.querySelector('.actions');
  if (!actions) {
    actions = document.createElement('div');
    actions.className = 'actions';
    topbar.appendChild(actions);
  }

  // ─── Ensure toggle button exists ────────────
  let toggle = topbar.querySelector('#menuToggle, .menu-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.type = 'button';
    toggle.textContent = '\u2630';
    actions.insertBefore(toggle, actions.firstChild);
  }

  toggle.type = 'button';
  toggle.classList.add('menu-toggle');
  toggle.setAttribute('aria-controls', nav.id);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation menu');

  function closeMenu(returnFocus) {
    topbar.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const isOpen = topbar.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu(false);
  });

  document.addEventListener('click', event => {
    if (!topbar.contains(event.target)) closeMenu(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && topbar.classList.contains('nav-open')) closeMenu(true);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenu(false);
  });
})();
