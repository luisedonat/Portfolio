/* ═══════════════════════════════════════════════════════════════
   main.js — Portfolio interactions & pixel art
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────────
   1. NAVIGATION — scroll state + active link + mobile menu
───────────────────────────────────────────────────────────────── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  // Scroll state
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link highlight
  function highlightActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ─────────────────────────────────────────────────────────────────
   2. SCROLL REVEAL — IntersectionObserver for .reveal elements
───────────────────────────────────────────────────────────────── */
(function initReveal() {
  // Mark things to reveal
  const targets = [
    '.about-text',
    '.about-visual',
    '.project-card',
    '.skill-category',
    '.timeline-item',
    '.cv-extra-card',
    '.contact-info',
    '.contact-form',
    '.section-title',
    '.section-label',
    '.section-desc',
  ];
  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger children within same parent
      if (i > 0 && i <= 4) el.classList.add(`reveal-delay-${i}`);
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────────────────────────────
   3. HERO PIXEL CANVAS — animated floating pixels
───────────────────────────────────────────────────────────────── */
(function initHeroCanvas() {
  const canvas = document.getElementById('pixelCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLOURS = ['#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#f5f0e8'];
  const PIXEL_SIZE = 8;
  const particles = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class PixelParticle {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x    = Math.random() * canvas.width;
      this.y    = init ? Math.random() * canvas.height : canvas.height + PIXEL_SIZE;
      this.size = PIXEL_SIZE * (1 + Math.floor(Math.random() * 3));
      this.vx   = (Math.random() - .5) * .4;
      this.vy   = -(Math.random() * .5 + .2);
      this.alpha = Math.random() * .5 + .2;
      this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -this.size) this.reset();
    }

    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.colour;
      ctx.fillRect(
        Math.round(this.x / PIXEL_SIZE) * PIXEL_SIZE,
        Math.round(this.y / PIXEL_SIZE) * PIXEL_SIZE,
        this.size, this.size
      );
    }
  }

  function initParticles() {
    particles.length = 0;
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) particles.push(new PixelParticle());
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  resize();
  initParticles();
  loop();
})();


/* ─────────────────────────────────────────────────────────────────
   4. PIXEL FACE — draw 16×16 pixel avatar in the hero
───────────────────────────────────────────────────────────────── */
(function drawPixelFace() {
  const wrap = document.getElementById('pixelFace');
  if (!wrap) return;

  // 16×16 grid, 0=transparent, colour keys
  const P = '#264653'; // dark (outline / hair)
  const S = '#f5f0e8'; // skin
  const H = '#e9c46a'; // hair highlight
  const T = '#2a9d8f'; // shirt / teal
  const C = '#f4a261'; // accent
  const _ = null;

  /* eslint-disable no-multi-spaces */
  const grid = [
    [_,_,_,_,_,P,P,P,P,P,P,_,_,_,_,_],
    [_,_,_,P,P,H,H,H,H,H,H,P,P,_,_,_],
    [_,_,P,H,H,H,P,H,H,P,H,H,H,P,_,_],
    [_,P,H,H,H,H,H,H,H,H,H,H,H,H,P,_],
    [_,P,S,S,S,S,S,S,S,S,S,S,S,S,P,_],
    [P,S,S,P,S,S,S,S,S,S,S,S,P,S,S,P],
    [P,S,S,P,S,S,S,S,S,S,S,S,P,S,S,P],
    [P,S,S,S,S,C,S,S,S,S,C,S,S,S,S,P],
    [P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,P],
    [P,S,S,S,P,P,P,S,S,P,P,P,S,S,S,P],
    [_,P,S,S,S,S,S,S,S,S,S,S,S,S,P,_],
    [_,_,P,P,S,S,S,S,S,S,S,S,P,P,_,_],
    [_,_,_,P,T,T,T,T,T,T,T,T,P,_,_,_],
    [_,_,P,T,T,T,T,T,T,T,T,T,T,P,_,_],
    [_,P,T,T,T,T,T,T,T,T,T,T,T,T,P,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
  /* eslint-enable no-multi-spaces */

  const SIZE = 200;
  const CELL = SIZE / 16;

  const canvas = document.createElement('canvas');
  canvas.width  = SIZE;
  canvas.height = SIZE;
  canvas.style.imageRendering = 'pixelated';
  canvas.style.width  = SIZE + 'px';
  canvas.style.height = SIZE + 'px';
  wrap.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  grid.forEach((row, r) => {
    row.forEach((col, c) => {
      if (!col) return;
      ctx.fillStyle = col;
      ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
    });
  });
})();


/* ─────────────────────────────────────────────────────────────────
   5. PIXEL AVATAR — card avatar in About section
───────────────────────────────────────────────────────────────── */
(function drawPixelAvatar() {
  const wrap = document.getElementById('pixelAvatar');
  if (!wrap) return;

  const P = '#264653';
  const S = '#f5c9a0'; // skin tone
  const H = '#e9c46a'; // hair
  const T = '#2a9d8f';
  const _ = null;

  const grid = [
    [_,_,P,P,P,P,P,P,_,_],
    [_,P,H,H,H,H,H,H,P,_],
    [P,H,H,S,S,S,S,H,H,P],
    [P,H,S,P,S,S,P,S,H,P],
    [P,S,S,S,S,S,S,S,S,P],
    [P,S,S,S,P,P,S,S,S,P],
    [_,P,S,S,S,S,S,S,P,_],
    [_,_,P,T,T,T,T,P,_,_],
    [_,P,T,T,T,T,T,T,P,_],
    [_,_,_,_,_,_,_,_,_,_],
  ];

  const SIZE = 90;
  const CELL = SIZE / 10;

  const canvas = document.createElement('canvas');
  canvas.width  = SIZE;
  canvas.height = SIZE;
  canvas.style.imageRendering = 'pixelated';
  canvas.style.borderRadius = '10px';
  canvas.style.display = 'block';
  canvas.style.margin = '0 auto';
  wrap.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#e9c46a22';
  ctx.fillRect(0, 0, SIZE, SIZE);

  grid.forEach((row, r) => {
    row.forEach((col, c) => {
      if (!col) return;
      ctx.fillStyle = col;
      ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
    });
  });
})();


/* ─────────────────────────────────────────────────────────────────
   6. PROJECT FILTER
───────────────────────────────────────────────────────────────── */
(function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cats = card.dataset.category || '';
        const show = filter === 'all' || cats.includes(filter);
        card.classList.toggle('hidden', !show);
        // Re-trigger reveal animation for visible cards
        if (show) {
          card.classList.remove('visible');
          requestAnimationFrame(() => card.classList.add('visible'));
        }
      });
    });
  });
})();


/* ─────────────────────────────────────────────────────────────────
   7. SKILL BAR ANIMATION — triggered by IntersectionObserver
───────────────────────────────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = e.target.dataset.w || 0;
        e.target.style.width = target + '%';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ─────────────────────────────────────────────────────────────────
   8. COUNTER ANIMATION — about section stats
───────────────────────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1200;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ─────────────────────────────────────────────────────────────────
   9. CONTACT FORM — validation + fake submit
───────────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  if (!form) return;

  const success = document.getElementById('formSuccess');
  const fields  = {
    name:    { el: document.getElementById('name'),    err: document.getElementById('nameError') },
    email:   { el: document.getElementById('email'),   err: document.getElementById('emailError') },
    message: { el: document.getElementById('message'), err: document.getElementById('messageError') },
  };

  function validate() {
    let valid = true;

    // Name
    if (!fields.name.el.value.trim()) {
      fields.name.err.textContent  = 'Please enter your name.';
      fields.name.el.classList.add('error');
      valid = false;
    } else {
      fields.name.err.textContent  = '';
      fields.name.el.classList.remove('error');
    }

    // Email
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(fields.email.el.value.trim())) {
      fields.email.err.textContent  = 'Please enter a valid email address.';
      fields.email.el.classList.add('error');
      valid = false;
    } else {
      fields.email.err.textContent  = '';
      fields.email.el.classList.remove('error');
    }

    // Message
    if (fields.message.el.value.trim().length < 10) {
      fields.message.err.textContent  = 'Message must be at least 10 characters.';
      fields.message.el.classList.add('error');
      valid = false;
    } else {
      fields.message.err.textContent  = '';
      fields.message.el.classList.remove('error');
    }

    return valid;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message ▶';
      btn.disabled = false;
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 5000);
    }, 1200);
  });
})();


/* ─────────────────────────────────────────────────────────────────
   10. PIXEL ILLUSTRATIONS — draw colourful pixel grids in project cards
───────────────────────────────────────────────────────────────── */
(function drawPixelIllustrations() {
  const COLOURS = ['#264653','#2a9d8f','#e9c46a','#f4a261','#e76f51','#f5f0e8'];

  // Each illustration is a unique pixel pattern
  const patterns = [
    // pi-1: screen / interface icon
    [
      [0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,0],
      [0,1,2,2,2,2,1,0],
      [0,1,2,3,3,2,1,0],
      [0,1,2,3,3,2,1,0],
      [0,1,2,2,2,2,1,0],
      [0,0,1,0,0,1,0,0],
      [0,1,1,1,1,1,1,0],
    ],
    // pi-2: hand / tangible
    [
      [0,0,1,0,1,0,1,0],
      [0,0,1,0,1,0,1,0],
      [0,0,1,1,1,1,1,0],
      [0,2,1,3,3,3,1,0],
      [0,2,3,3,3,3,3,0],
      [0,0,3,3,4,3,0,0],
      [0,0,0,3,3,3,0,0],
      [0,0,0,0,3,0,0,0],
    ],
    // pi-3: brain / mind
    [
      [0,0,1,1,1,1,0,0],
      [0,1,2,2,2,2,1,0],
      [1,2,3,2,2,3,2,1],
      [1,2,2,2,2,2,2,1],
      [0,1,2,4,4,2,1,0],
      [0,0,1,2,2,1,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    // pi-4: mic / voice
    [
      [0,0,1,1,1,1,0,0],
      [0,1,2,2,2,2,1,0],
      [0,1,2,2,2,2,1,0],
      [0,1,2,2,2,2,1,0],
      [1,1,2,2,2,2,1,1],
      [0,0,0,1,1,0,0,0],
      [0,0,0,1,1,0,0,0],
      [0,0,1,1,1,1,0,0],
    ],
    // pi-5: cursor / interaction
    [
      [1,0,0,0,0,0,0,0],
      [1,1,0,0,0,0,0,0],
      [1,2,1,0,0,0,0,0],
      [1,2,2,1,0,0,0,0],
      [1,2,2,2,1,0,0,0],
      [1,2,2,1,3,1,0,0],
      [1,1,1,0,1,4,1,0],
      [0,0,0,0,0,1,0,0],
    ],
    // pi-6: magnifier / research
    [
      [0,0,1,1,1,1,0,0],
      [0,1,2,2,2,2,1,0],
      [1,2,3,2,2,2,2,1],
      [1,2,2,2,2,2,2,1],
      [1,2,2,2,2,2,2,1],
      [0,1,2,2,2,2,1,0],
      [0,0,1,1,1,1,0,1],
      [0,0,0,0,0,0,1,0],
    ],
  ];

  const palettes = [
    ['#264653','#2a9d8f','#e9c46a','#f4a261','#e76f51'],
    ['#e76f51','#f4a261','#e9c46a','#2a9d8f','#264653'],
    ['#e9c46a','#f4a261','#2a9d8f','#264653','#e76f51'],
    ['#2a9d8f','#264653','#e9c46a','#e76f51','#f4a261'],
    ['#f4a261','#e76f51','#264653','#2a9d8f','#e9c46a'],
    ['#264653','#2a9d8f','#f4a261','#e9c46a','#e76f51'],
  ];

  document.querySelectorAll('.pixel-illustration').forEach((div, idx) => {
    const pattern = patterns[idx % patterns.length];
    const pal     = palettes[idx % palettes.length];

    const canvas  = document.createElement('canvas');
    const ROWS = pattern.length;
    const COLS = pattern[0].length;
    const SCALE = 20;

    canvas.width  = COLS * SCALE;
    canvas.height = ROWS * SCALE;
    canvas.style.imageRendering = 'pixelated';
    canvas.style.width  = '100%';
    canvas.style.height = '100%';
    canvas.style.objectFit = 'cover';

    const ctx = canvas.getContext('2d');

    // Background gradient fill (CSS handles this, canvas is overlay)
    pattern.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val === 0) return;
        ctx.fillStyle = pal[val - 1] || pal[0];
        ctx.fillRect(c * SCALE, r * SCALE, SCALE, SCALE);
      });
    });

    div.innerHTML = '';
    div.appendChild(canvas);
  });
})();


/* ─────────────────────────────────────────────────────────────────
   12. VIDEO LIGHTBOX
───────────────────────────────────────────────────────────────── */
(function initVideoLightbox() {
  const lightbox  = document.getElementById('videoLightbox');
  const video     = document.getElementById('lightboxVideo');
  const source    = document.getElementById('lightboxSource');
  const backdrop  = lightbox.querySelector('.video-lightbox-backdrop');
  const closeBtn  = lightbox.querySelector('.video-lightbox-close');

  function openLightbox(src) {
    source.src = src;
    video.load();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    video.play();
  }

  function closeLightbox() {
    video.pause();
    video.currentTime = 0;
    source.src = '';
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.video-lightbox-trigger').forEach(btn => {
    btn.addEventListener('click', () => openLightbox(btn.dataset.video));
  });

  backdrop.addEventListener('click', closeLightbox);
  closeBtn.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
})();
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
