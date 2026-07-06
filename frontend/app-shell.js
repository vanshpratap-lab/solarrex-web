/* ============================================================
   APP-SHELL.JS — Native App Shell for ≤1024px screens
   Tab bar, bottom sheets, snap-scroll, FAB, gestures.
   Desktop (≥1025px) is completely unaffected.
   ============================================================ */

const APP = (() => {
  'use strict';

  function smoothScrollTo(targetY, duration = 700) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    if (Math.abs(diff) < 2) { window.scrollTo(0, targetY); return; }
    const start = performance.now();
    function cubicBezier(t) {
      const p1x = 0.25, p1y = 0.46, p2x = 0.45, p2y = 0.94;
      const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
      const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
      let s = t;
      for (let i = 0; i < 8; i++) { const x = ((ax * s + bx) * s + cx) * s; const dx = (3 * ax * s + 2 * bx) * s + cx; if (Math.abs(dx) < 1e-6) break; s -= (x - t) / dx; }
      return ((ay * s + by) * s + cy) * s;
    }
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      window.scrollTo(0, startY + diff * cubicBezier(t));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const isMobile = () => window.innerWidth <= 1024;
  let currentTab = 'home';
  let sheet = null;

  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  // ── Helper: undo script.js lockBodyScroll ──────────────
  const unlockBody = () => {
    const b = document.body;
    const topVal = parseInt(b.style.top) || 0;
    const scrollPos = Math.abs(topVal);
    b.style.position = '';
    b.style.top = '';
    b.style.width = '';
    b.style.overflow = '';
    b.classList.remove('modal-open');
    if (scrollPos > 0) {
      const se = document.scrollingElement || document.documentElement;
      const prev = se.style.scrollBehavior;
      se.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollPos);
      requestAnimationFrame(() => { se.style.scrollBehavior = prev; });
    }
  };

  /* ── Bottom Sheet ──────────────────────────────────── */
  class BottomSheet {
    constructor() {
      this.overlay = null;
      this.sheet = null;
      this.body = null;
      this.titleEl = null;
      this._build();
    }

    _build() {
      if ($('.app-sheet-overlay')) return;
      this.overlay = document.createElement('div');
      this.overlay.className = 'app-sheet-overlay';
      this.overlay.addEventListener('click', () => this.close());

      this.sheet = document.createElement('div');
      this.sheet.className = 'app-sheet';
      this.sheet.innerHTML = `
        <div class="app-sheet-handle"></div>
        <div class="app-sheet-header">
          <h3 class="app-sheet-title"></h3>
          <button class="app-sheet-close" aria-label="Close"><i class='bx bx-x'></i></button>
        </div>
        <div class="app-sheet-body"></div>
      `;
      this.body = this.sheet.querySelector('.app-sheet-body');
      this.titleEl = this.sheet.querySelector('.app-sheet-title');
      this.closeBtn = this.sheet.querySelector('.app-sheet-close');
      this.closeBtn.addEventListener('click', () => this.close());

      // drag to dismiss
      let startY = 0, dragging = false;
      const handle = this.sheet.querySelector('.app-sheet-handle');
      handle.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY; dragging = true;
      }, { passive: true });
      handle.addEventListener('touchmove', (e) => {
        if (!dragging) return;
        const dy = e.touches[0].clientY - startY;
        if (dy > 0) this.sheet.style.transform = `translateY(${dy}px)`;
      }, { passive: true });
      handle.addEventListener('touchend', () => {
        dragging = false;
        const tr = this.sheet.style.transform;
        if (tr) {
          const dy = parseInt(tr.match(/\d+/)?.[0] || '0');
          if (dy > 80) this.close();
          else this.sheet.style.transform = '';
        }
      }, { passive: true });

      document.body.appendChild(this.overlay);
      document.body.appendChild(this.sheet);
    }

    open(title, html) {
      this.titleEl.textContent = title;
      this.body.innerHTML = html;
      // Lock body scroll — no position:fixed trick (causes scroll jump)
      const w = window.innerWidth;
      document.documentElement.style.overflow = 'hidden';
      const sbW = w - document.documentElement.clientWidth;
      if (sbW > 0) document.body.style.paddingRight = sbW + 'px';
      requestAnimationFrame(() => {
        this.overlay.classList.add('open');
        this.sheet.classList.add('open');
      });
      try { navigator.vibrate?.(10); } catch {}
      setTimeout(() => this._initSliders(), 100);
    }

    close() {
      this.overlay.classList.remove('open');
      this.sheet.classList.remove('open');
      this.sheet.style.transform = '';
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
      this.body.innerHTML = '';
      this.titleEl.textContent = '';
    }

    _initSliders() {
      this.body.querySelectorAll('input[type="range"]').forEach(s => {
        const update = () => {
          const v = s.value, mn = parseFloat(s.min) || 0, mx = parseFloat(s.max) || 100;
          const pct = ((v - mn) / (mx - mn)) * 100;
          s.style.background = `linear-gradient(to right, #91b34b ${pct}%, #e8e8ed ${pct}%)`;
          // Update sibling label spans
          const label = s.closest('.calc-input-group, .roi-input-group')?.querySelector('span');
          if (label) {
            const txt = label.textContent;
            const match = txt.match(/^(.+?):?\s*([\d,]+.*)$/);
            if (match) label.textContent = match[1] + ': ' + (s.id.includes('roi') ? '₹' : '') + v + (s.id.includes('roi-tariff') ? '/unit' : (s.id.includes('kw') ? ' kW' : ''));
          }
          // Update subsidy/roi calc results
          if (s.id === 'subsidy-kw-slider') this._updateSubsidy(v);
          else if (s.id === 'roi-bill-input' || s.id === 'roi-tariff-input') this._updateROI();
        };
        s.addEventListener('input', update);
        s.addEventListener('touchmove', update);
        update();
      });
    }

    _updateSubsidy(kw) {
      const costPerKw = 85000;
      const cost = kw * costPerKw;
      const subsidy = kw <= 3 ? kw * 18000 : kw <= 10 ? 78000 : 78000;
      const net = cost - subsidy;
      const fmt = (n) => '₹' + n.toLocaleString('en-IN');
      const el = (id) => this.body.querySelector('#' + id);
      const c = el('calc-cost'); if (c) c.textContent = fmt(cost);
      const s = el('calc-subsidy'); if (s) s.textContent = fmt(subsidy);
      const n = el('calc-net'); if (n) n.textContent = fmt(net);
    }

    _updateROI() {
      const bill = parseFloat(this.body.querySelector('#roi-bill-input')?.value || 5000);
      const tariff = parseFloat(this.body.querySelector('#roi-tariff-input')?.value || 8);
      const monthlyUnits = bill / tariff;
      const systemKw = Math.round(monthlyUnits / 125);
      const annualSave = bill * 12;
      const payback = systemKw * 85000 / annualSave;
      const lifetime = annualSave * 25;
      const trees = Math.round(annualSave / 625);
      const co2 = (annualSave / 10000).toFixed(1);
      const km = Math.round(annualSave / 4);
      const fmt = (n) => '₹' + n.toLocaleString('en-IN');
      const el = (id) => this.body.querySelector('#' + id);
      const sz = el('roi-size'); if (sz) sz.textContent = systemKw + ' kW';
      const pb = el('roi-payback'); if (pb) pb.textContent = payback.toFixed(1) + ' Years';
      const an = el('roi-annual'); if (an) an.textContent = fmt(annualSave);
      const lt = el('roi-lifetime'); if (lt) lt.textContent = fmt(lifetime);
      const tr = el('env-trees'); if (tr) tr.textContent = trees + ' Trees';
      const co = el('env-co2'); if (co) co.textContent = co2 + ' Tons';
      const mk = el('env-miles'); if (mk) mk.textContent = km.toLocaleString('en-IN') + ' km';
    }
  }

  /* ── Build Tab Bar ─────────────────────────────────── */
  function buildTabBar() {
    if ($('.app-tab-bar')) return;
    const tabs = [
      { id: 'home', icon: 'bxs-home', label: 'Home' },
      { id: 'solutions', icon: 'bxs-sun', label: 'Solutions' },
      { id: 'calculator', icon: 'bxs-calculator', label: 'Calc' },
      { id: 'contact', icon: 'bxs-phone', label: 'Contact' },
      { id: 'more', icon: 'bxs-grid-alt', label: 'More' },
    ];
    const bar = document.createElement('div');
    bar.className = 'app-tab-bar';
    tabs.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'app-tab' + (t.id === 'home' ? ' active' : '');
      btn.dataset.tab = t.id;
      btn.innerHTML = `<i class='bx ${t.icon}'></i><span>${t.label}</span>`;
      btn.addEventListener('click', () => switchTab(t.id));
      bar.appendChild(btn);
    });
    document.body.appendChild(bar);
  }

  function switchTab(tabId) {
    if (tabId === currentTab && tabId !== 'home') return;
    currentTab = tabId;
    $$('.app-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));

    if (tabId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const map = {
        solutions: 'section-3',
        calculator: 'section-pricing',
        contact: 'section-6',
        more: 'section-4',
      };
      const id = map[tabId];
      const el = id ? (document.getElementById(id) || document.querySelector(`.${id}`)) : null;
      if (el) {
        const h = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--app-header-h')) || 48;
        const top = el.getBoundingClientRect().top + window.scrollY - h - 8;
        smoothScrollTo(top);
      }
    }

    const titles = {
      home: '<span class="logo-solar">SOLAR</span><span class="logo-rex">REX</span>',
      solutions: 'Solutions',
      calculator: 'Calculator',
      contact: 'Contact',
      more: 'More',
    };
    const h = $('.app-header-title');
    if (h) h.innerHTML = titles[tabId] || '<span class="logo-solar">SOLAR</span><span class="logo-rex">REX</span>';

    try { navigator.vibrate?.(5); } catch {}
    if (sheet) sheet.close();
  }

  /* ── Build Header ──────────────────────────────────── */
  function buildHeader() {
    if ($('.app-header')) return;
    const h = document.createElement('header');
    h.className = 'app-header';
    const isSols = location.pathname.includes('solutions');
    h.innerHTML = `
      <div class="app-header-title"><span class="logo-solar">SOLAR</span><span class="logo-rex">REX</span></div>
      ${isSols ? '<div class="app-header-actions"><button class="app-header-btn" id="app-header-back"><i class=\'bx bx-arrow-back\'></i></button></div>' : ''}`;
    document.body.prepend(h);
    if (isSols) {
      const backBtn = h.querySelector('#app-header-back');
      if (backBtn) {
        backBtn.addEventListener('click', (e) => {
          e.preventDefault();
          backBtn.classList.add('animating');
          setTimeout(() => { window.location.href = '/'; }, 450);
        });
      }
    }
  }

  /* ── Build FAB ─────────────────────────────────────── */
  function buildFAB() {
    if ($('.app-fab')) return;
    const f = document.createElement('button');
    f.className = 'app-fab';
    f.setAttribute('aria-label', 'Contact Us');
    f.innerHTML = `<i class='bx bx-conversation'></i>`;
    f.addEventListener('click', () => {
      const el = document.getElementById('section-6');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 48;
        smoothScrollTo(top);
        switchTab('contact');
      }
      try { navigator.vibrate?.(10); } catch {}
    });
    document.body.appendChild(f);
  }

  /* ── Tap Ripple ────────────────────────────────────── */
  function initRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button, a, .app-tab, .type-btn, .nav-item');
      if (!btn || !isMobile()) return;
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--rx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      btn.style.setProperty('--ry', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      btn.classList.add('app-ripple');
      setTimeout(() => btn.classList.remove('app-ripple'), 300);
    });
  }

  /* ── Pull-to-Refresh ───────────────────────────────── */
  function initPtr() {
    let startY = 0, pulling = false, spinner = null;
    document.addEventListener('touchstart', (e) => {
      if (window.scrollY > 10 || !isMobile()) return;
      startY = e.touches[0].clientY; pulling = true;
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (!pulling || window.scrollY > 10) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 60 && !spinner) {
        spinner = document.createElement('div');
        spinner.className = 'app-ptr-spinner';
        spinner.style.display = 'block';
        document.body.appendChild(spinner);
      }
    }, { passive: true });
    document.addEventListener('touchend', () => {
      if (spinner) {
        setTimeout(() => { spinner?.remove(); spinner = null; window.location.reload(); }, 400);
      }
      pulling = false;
    }, { passive: true });
  }

  /* ── Swipe between tabs ────────────────────────────── */
  function initSwipe() {
    let startX = 0, swiping = false;
    const tabs = ['home', 'solutions', 'calculator', 'contact', 'more'];
    document.addEventListener('touchstart', (e) => {
      if (!isMobile()) return;
      startX = e.touches[0].clientX; swiping = true;
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
      if (!swiping || !isMobile()) return;
      swiping = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) < 50) return;
      const idx = tabs.indexOf(currentTab);
      if (diff > 0 && idx < tabs.length - 1) switchTab(tabs[idx + 1]);
      else if (diff < 0 && idx > 0) switchTab(tabs[idx - 1]);
    }, { passive: true });
  }

  /* ── Active section detection ──────────────────────── */
  let observer = null;
  function initSectionTracking() {
    const sections = $$('.hero, .solutions, .section-cards, .section-operations, .section-case-studies, .section-pricing, .section-contact, .section-faq');
    if (!sections.length) return;
    const tabMap = {
      hero: 'home', solutions: 'solutions', 'section-pricing': 'calculator',
      'section-contact': 'contact', 'section-operations': 'more',
      'section-cards': 'solutions', 'section-case-studies': 'solutions', 'section-faq': 'more',
    };
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let tab = 'home';
          for (const c of entry.target.classList) {
            if (tabMap[c]) { tab = tabMap[c]; break; }
          }
          if (tab !== currentTab) {
            currentTab = tab;
            $$('.app-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
            const titles = {
              home: '<span class="logo-solar">SOLAR</span><span class="logo-rex">REX</span>',
              solutions: 'Solutions', calculator: 'Calculator',
              contact: 'Contact', more: 'More',
            };
            const h = $('.app-header-title');
            if (h) h.innerHTML = titles[tab] || '<span class="logo-solar">SOLAR</span><span class="logo-rex">REX</span>';
          }
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(s => observer.observe(s));
  }

  /* ── Sheet Triggers (all devices) ──────────────────── */
  function initSheetTriggers() {
    $$('.info-hub-trigger').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = el.dataset.hubTab || 'tech';
        const hub = document.getElementById('info-hub-body');
        if (hub) {
          const sec = hub.querySelector(`#hub-section-${tab}`);
          if (sec) {
            const clone = sec.cloneNode(true);
            sheet.open('Solar Info Hub', clone.innerHTML);
          }
        }
        // Undo script.js lockBodyScroll (uses position:fixed which jumps)
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
      });
    });

    $$('.quick-modal-overlay .close-red, .quick-modal-overlay .modal-close-main, .terminal-action-btn').forEach(el => {
      el.addEventListener('click', () => unlockBody());
    });
  }

  /* ── Init (mobile-only — sheet, header, tabs, fab) ──── */
  function init() {
    if (!isMobile()) return;
    buildHeader();
    buildTabBar();
    buildFAB();
    initRipple();
    initPtr();
    initSwipe();
    initSectionTracking();
    sheet = new BottomSheet();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSheetTriggers);
    else initSheetTriggers();
  }

  function destroyMobileUI() {
    $$('.app-header, .app-tab-bar, .app-fab').forEach(e => e.remove());
    if (observer) { observer.disconnect(); observer = null; }
    if (sheet) { sheet.close(); sheet.overlay?.remove(); sheet.sheet?.remove(); sheet = null; }
    const nb = document.querySelector('.navbar');
    if (nb) nb.style.display = '';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Resize listener
  let pw = window.innerWidth;
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    if ((pw <= 1024 && w > 1024) || (pw > 1024 && w <= 1024)) {
      pw = w;
      if (w <= 1024) init();
      else destroyMobileUI();
    }
    pw = w;
  });

  return { switchTab };
})();
