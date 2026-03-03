/**
 * App.js — Anjali Vishwakarma Portfolio v2.0
 * All features: loader, dark mode, typing, terminal, tilt, flip cards,
 * metrics ticker, filters, parallax, drag scroll, back-to-top, canvas
 */

/* ============================================================
   BOOT
   ============================================================ */
(function() {
  // PAGE LOADER
  const loader = document.getElementById('page-loader');
  const fill   = loader && loader.querySelector('.loader-fill');
  let prog = 0;
  const interval = setInterval(() => {
    prog = Math.min(prog + Math.random() * 18, 92);
    if (fill) fill.style.width = prog + '%';
  }, 80);

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(() => {
    document.body.classList.add('js-ready');
    clearInterval(interval);
    if (fill) fill.style.width = '100%';
    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
      // Kick off hero entrance after loader hides
      setTimeout(() => {
        document.querySelectorAll('#hero .reveal-up').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 130);
        });
        initMetricsTicker();
        initTyping();
        initTerminal();
      }, 200);
    }, 600);

    initAll();
  });
})();

function initAll() {
  initScrollProgress();
  initNavbar();
  initScrollReveal();
  initSkillTagStagger();
  initParallax();
  initProjectDrag();
  initSmoothScroll();
  initButtonArrows();
  initCursorTrail();
  initMarquee();
  initCGPACountUp();
  initStatCountUp();
  initDarkMode();
  initSkillFilter();
  initTiltCard();
  initBackToTop();
  initHeroCanvas();
}

/* ============================================================
   1. SCROLL PROGRESS
   ============================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const d = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (d > 0 ? (window.scrollY / d) * 100 : 0) + '%';
  }, { passive: true });
}

/* ============================================================
   2. NAVBAR
   ============================================================ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const check = () => nav.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', check, { passive: true });
  check();
}

/* ============================================================
   3. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll(':not(#hero) .reveal-up');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ============================================================
   4. SKILL TAG STAGGER
   ============================================================ */
function initSkillTagStagger() {
  const groups = document.querySelectorAll('.skill-group');
  if (!groups.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-tag').forEach((tag, i) => {
          tag.style.cssText = `opacity:0;transform:translateY(10px);transition:opacity 0.35s ease ${i*0.055}s,transform 0.35s ease ${i*0.055}s`;
          setTimeout(() => { tag.style.opacity='1'; tag.style.transform='translateY(0)'; }, 60);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  groups.forEach(g => obs.observe(g));
}

/* ============================================================
   5. PARALLAX
   ============================================================ */
function initParallax() {
  const shapes = document.querySelectorAll('.bg-shape');
  const ghost  = document.querySelector('.hero-ghost-text');
  if (!shapes.length) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      shapes.forEach((s, i) => { s.style.transform = `translateY(${sy*(i+1)*0.07*(i%2===0?1:-1)}px)`; });
      if (ghost) ghost.style.transform = `translateY(calc(-50% + ${sy*0.1}px))`;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

/* ============================================================
   6. PROJECT DRAG SCROLL
   ============================================================ */
function initProjectDrag() {
  const track = document.getElementById('projectsTrack');
  if (!track) return;
  let isDown=false, startX, scrollLeft;
  track.addEventListener('mousedown', e => { isDown=true; track.classList.add('dragging'); startX=e.pageX-track.offsetLeft; scrollLeft=track.scrollLeft; });
  ['mouseleave','mouseup'].forEach(ev => track.addEventListener(ev, () => { isDown=false; track.classList.remove('dragging'); }));
  track.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); track.scrollLeft=scrollLeft-(e.pageX-track.offsetLeft-startX)*1.5; });
}

/* ============================================================
   7. SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return; e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   8. BUTTON ARROWS
   ============================================================ */
function initButtonArrows() {
  document.querySelectorAll('.btn-pill').forEach(btn => {
    const arrow = btn.querySelector('.btn-arrow');
    if (!arrow) return;
    btn.addEventListener('mouseenter', () => arrow.style.transform='rotate(45deg) scale(1.15)');
    btn.addEventListener('mouseleave', () => arrow.style.transform='');
  });
}


/* ============================================================
   10. CURSOR TRAIL
   ============================================================ */
function initCursorTrail() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const dot = document.createElement('div');
  dot.style.cssText='position:fixed;width:8px;height:8px;background:#ff7a45;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform 0.15s ease,opacity 0.3s ease;opacity:0;';
  document.body.appendChild(dot);
  let mx=0,my=0,px=0,py=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.opacity='0.6'; });
  document.addEventListener('mouseleave', () => dot.style.opacity='0');
  const loop = () => { px+=(mx-px)*0.18; py+=(my-py)*0.18; dot.style.left=px+'px'; dot.style.top=py+'px'; requestAnimationFrame(loop); };
  loop();
  document.querySelectorAll('a,button,.skill-tag,.tech-logo,.edu-card,.stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.style.transform='translate(-50%,-50%) scale(3)'; dot.style.opacity='0.2'; });
    el.addEventListener('mouseleave', () => { dot.style.transform='translate(-50%,-50%) scale(1)'; dot.style.opacity='0.6'; });
  });
}

/* ============================================================
   11. MARQUEE
   ============================================================ */
function initMarquee() {
  const t = document.querySelector('.marquee-track');
  if (!t) return;
  t.addEventListener('mouseenter', () => t.style.animationPlayState='paused');
  t.addEventListener('mouseleave', () => t.style.animationPlayState='running');
}

/* ============================================================
   12. CGPA COUNT-UP
   ============================================================ */
function initCGPACountUp() {
  const nums = document.querySelectorAll('.cgpa-num');
  if (!nums.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target=parseFloat(e.target.textContent); const start=performance.now();
      const run = now => { const p=Math.min((now-start)/1200,1),eased=1-Math.pow(1-p,3),val=(target*eased).toFixed(1); e.target.textContent=val%1===0?Math.round(val):val; if(p<1)requestAnimationFrame(run); };
      requestAnimationFrame(run); obs.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  nums.forEach(n => obs.observe(n));
}

/* ============================================================
   13. STAT COUNT-UP
   ============================================================ */
function initStatCountUp() {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el=e.target, sym=el.querySelector('.stat-symbol'), symText=sym?sym.textContent:'';
      const target=parseInt(el.textContent.replace(symText,'').trim(),10);
      if(isNaN(target)) return;
      const start=performance.now();
      const run = now => { const p=Math.min((now-start)/1000,1),val=Math.round(target*(1-Math.pow(1-p,3))); el.innerHTML=val+(symText?`<span class="stat-symbol">${symText}</span>`:''); if(p<1)requestAnimationFrame(run); };
      requestAnimationFrame(run); obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  nums.forEach(n => obs.observe(n));
}

/* ============================================================
   14. DARK MODE TOGGLE
   ============================================================ */
function initDarkMode() {
  const btn  = document.getElementById('theme-toggle');
  const icon = btn && btn.querySelector('.theme-icon');
  const html = document.documentElement;
  const saved = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', saved);
  if (icon) icon.textContent = saved === 'dark' ? '☀️' : '🌙';
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    if (icon) icon.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

/* ============================================================
   15. SKILL FILTER TABS
   ============================================================ */
function initSkillFilter() {
  const tabs   = document.querySelectorAll('.filter-tab');
  const groups = document.querySelectorAll('.skill-group');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      groups.forEach(g => {
        const cat = g.dataset.category;
        if (filter === 'all' || cat === filter) {
          g.classList.remove('hidden-filter');
        } else {
          g.classList.add('hidden-filter');
        }
      });
    });
  });
}

/* ============================================================
   16. TILT CARD (3D on mouse move)
   ============================================================ */
function initTiltCard() {
  const card = document.getElementById('tiltCard');
  if (!card || window.matchMedia('(pointer:coarse)').matches) return;
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `rotateY(${x*16}deg) rotateX(${-y*16}deg) scale(1.04)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = 'rotateY(0) rotateX(0) scale(1)'; });
}

/* ============================================================
   17. BACK TO TOP with progress ring
   ============================================================ */
function initBackToTop() {
  const btn  = document.getElementById('back-to-top');
  const ring = document.getElementById('bttRingFill');
  if (!btn) return;
  const CIRCUMFERENCE = 2 * Math.PI * 15.9;
  if (ring) { ring.style.strokeDasharray = CIRCUMFERENCE; ring.style.strokeDashoffset = CIRCUMFERENCE; }

  window.addEventListener('scroll', () => {
    const d = document.documentElement.scrollHeight - window.innerHeight;
    const pct = d > 0 ? window.scrollY / d : 0;
    btn.classList.toggle('visible', window.scrollY > 400);
    if (ring) ring.style.strokeDashoffset = CIRCUMFERENCE * (1 - pct);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   18. HERO CANVAS (animated network/nodes)
   ============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createNodes(n) {
    nodes = [];
    for (let i = 0; i < n; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2.5 + 1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nodeColor = isDark ? 'rgba(240,237,232,0.5)' : 'rgba(28,28,28,0.35)';
    const lineColor = isDark ? 'rgba(240,237,232,' : 'rgba(28,28,28,';

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = lineColor + (1 - dist/120) * 0.12 + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createNodes(55); });
  resize();
  createNodes(55);
  draw();
}

/* ============================================================
   19. TYPING EFFECT
   ============================================================ */
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const lines = [
    'Cloud Engineer · AWS & Azure',
    'DevOps Specialist · IaC Expert',
    'Kubernetes · Terraform · Docker',
    'Building infrastructure at scale.',
  ];
  let lineIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = lines[lineIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) { deleting = true; setTimeout(tick, 2200); return; }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; lineIdx = (lineIdx + 1) % lines.length; }
    }
    setTimeout(tick, deleting ? 40 : 72);
  }
  tick();
}

/* ============================================================
   20. TERMINAL ANIMATION
   ============================================================ */
function initTerminal() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const lines = [
    { type: 'cmd',    text: '$ whoami' },
    { type: 'output', text: '→ <span class="t-val">Anjali Vishwakarma</span>' },
    { type: 'cmd',    text: '$ cat role.txt' },
    { type: 'output', text: '→ <span class="t-val">Cloud Engineer · DevOps Specialist</span>' },
    { type: 'cmd',    text: '$ cat stack.txt' },
    { type: 'output', text: '→ <span class="t-val">AWS · Azure · K8s · Terraform · Docker</span>' },
    { type: 'cmd',    text: '$ cat certs.txt' },
    { type: 'output', text: '→ <span class="t-val">AWS Solutions Architect · Cloud Practitioner · Oracle Architect</span>' },
    { type: 'cmd',    text: '$ echo $STATUS' },
    { type: 'output', text: '→ <span style="color:#22c55e;font-weight:600">AVAILABLE FOR HIRE ✓</span>' },
  ];

  let i = 0;
  function addLine() {
    if (i >= lines.length) {
      const cursor = document.createElement('span');
      cursor.className = 't-cursor-term';
      body.appendChild(cursor);
      return;
    }
    const span = document.createElement('span');
    span.className = 't-line ' + (lines[i].type === 'cmd' ? 't-cmd' : 't-output');
    span.innerHTML = lines[i].text;
    body.appendChild(span);
    body.scrollTop = body.scrollHeight;
    i++;
    setTimeout(addLine, lines[i-1].type === 'cmd' ? 380 : 180);
  }

  // Start when terminal scrolls into view
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { addLine(); obs.disconnect(); }
  }, { threshold: 0.4 });
  obs.observe(body);
}

/* ============================================================
   21. METRICS TICKER COUNT-UP (hero, fires after loader)
   ============================================================ */
function initMetricsTicker() {
  document.querySelectorAll('.metric-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const start = performance.now();
    const run = now => {
      const p = Math.min((now - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  });
}