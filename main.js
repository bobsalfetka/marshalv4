/* МАРШАЛ Event Agency — marshal-v4 main.js */

// ── CURSOR ──
const dot = document.querySelector('.cur-dot');
const ring = document.querySelector('.cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
if (dot && ring) {
  const tickCursor = () => {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(tickCursor);
  };
  tickCursor();
  document.querySelectorAll('a, button, .dir-card, .pf-item, .vk-card, .story-card, .blog-card, .faq-q, .calc-opt, .team-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
  document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('btn-hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('btn-hovering'));
  });
}

// ── NAV ──
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── BURGER ──
const burger = document.querySelector('.burger');
const overlay = document.querySelector('.mob-overlay');
if (burger && overlay) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    overlay.classList.toggle('open');
  });
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { burger.classList.remove('open'); overlay.classList.remove('open'); });
  });
}

// ── HERO TITLE REVEAL ──
document.querySelectorAll('.hero-title .line span').forEach((span, i) => {
  setTimeout(() => { span.style.transform = 'translateY(0)'; span.style.transition = 'transform 1s cubic-bezier(0.16,1,0.3,1)'; }, 200 + i * 120);
});

// ── SCROLL REVEAL ──
const ro = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('[data-reveal]').forEach(el => ro.observe(el));

// Process steps
const pro = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.2 });
document.querySelectorAll('.process-step').forEach(el => pro.observe(el));

// ── COUNTERS ──
document.querySelectorAll('[data-count]').forEach(el => {
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    io.disconnect();
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const dur = 2000;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(ease * target) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.5 });
  io.observe(el);
});

// ── MARQUEE ──
const marqueeTrack = document.querySelector('.marquee-inner');
if (marqueeTrack) {
  const clone = marqueeTrack.cloneNode(true);
  marqueeTrack.parentNode.appendChild(clone);
}

// ── STORIES DRAG SCROLL ──
const storiesWrap = document.querySelector('.stories-scroll-wrap');
if (storiesWrap) {
  let isDown = false, startX, scrollL;
  storiesWrap.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - storiesWrap.offsetLeft; scrollL = storiesWrap.scrollLeft; });
  storiesWrap.addEventListener('mouseleave', () => isDown = false);
  storiesWrap.addEventListener('mouseup', () => isDown = false);
  storiesWrap.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - storiesWrap.offsetLeft;
    storiesWrap.scrollLeft = scrollL - (x - startX) * 1.4;
  });
}

// Story card click — open VK in new tab
document.querySelectorAll('.story-card').forEach(card => {
  card.addEventListener('click', () => {
    const url = card.dataset.vkUrl;
    if (url) window.open(url, '_blank');
  });
});

// VK card click
document.querySelectorAll('.vk-card[data-vk-url]').forEach(card => {
  card.addEventListener('click', () => {
    window.open(card.dataset.vkUrl, '_blank');
  });
});

// ── REVIEWS SLIDER ──
const revTrack = document.querySelector('.reviews-track');
const revPrev = document.querySelector('.rev-prev');
const revNext = document.querySelector('.rev-next');
if (revTrack && revPrev && revNext) {
  let revIdx = 0;
  const cards = revTrack.querySelectorAll('.review-card');
  const maxIdx = Math.max(0, cards.length - 2);
  const slide = () => { revTrack.style.transform = `translateX(calc(-${revIdx * 50}% - ${revIdx * 12}px))`; };
  revNext.addEventListener('click', () => { revIdx = Math.min(revIdx + 1, maxIdx); slide(); });
  revPrev.addEventListener('click', () => { revIdx = Math.max(revIdx - 1, 0); slide(); });
}

// ── FAQ ──
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── PORTFOLIO FILTER ──
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    document.querySelectorAll('.pf-item').forEach(item => {
      const show = cat === 'all' || item.dataset.cat === cat;
      item.style.display = show ? '' : 'none';
    });
  });
});

// ── CALCULATOR ──
const calcSteps = document.querySelectorAll('.calc-step');
const calcDots = document.querySelectorAll('.calc-step-dot');
let calcIdx = 0;
const selections = {};

function updateCalc() {
  calcSteps.forEach((s, i) => s.classList.toggle('active', i === calcIdx));
  calcDots.forEach((d, i) => {
    d.classList.toggle('active', i === calcIdx);
    d.classList.toggle('done', i < calcIdx);
  });
  const result = document.querySelector('.calc-result-num');
  if (result) {
    const prices = { corp: 150000, city: 800000, forum: 300000, wedding: 250000, priv: 120000, other: 100000 };
    const sizes = { small: 1, medium: 2.5, large: 6, mass: 15 };
    const type = selections.type || 'corp';
    const size = selections.size || 'medium';
    const base = (prices[type] || 150000) * (sizes[size] || 1);
    result.textContent = 'от ' + Math.round(base / 1000) * 1000 .toLocaleString('ru') + ' ₽';
  }
}

document.querySelectorAll('.calc-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    const group = opt.closest('.calc-step').dataset.group;
    opt.closest('.calc-opts').querySelectorAll('.calc-opt').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    selections[group] = opt.dataset.val;
  });
});

document.querySelectorAll('.calc-next').forEach(btn => {
  btn.addEventListener('click', () => { if (calcIdx < calcSteps.length - 1) { calcIdx++; updateCalc(); } });
});
document.querySelectorAll('.calc-prev').forEach(btn => {
  btn.addEventListener('click', () => { if (calcIdx > 0) { calcIdx--; updateCalc(); } });
});

// ── PARALLAX HERO ──
window.addEventListener('scroll', () => {
  const grid = document.querySelector('.hero-grid-overlay');
  if (grid) grid.style.transform = `translateY(${window.scrollY * 0.3}px)`;
});
