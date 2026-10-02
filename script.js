// ===== Mobile nav =====
const burger = document.querySelector('.burger');
const links = document.querySelector('.links');
if (burger && links) {
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
}

// ===== Scroll progress =====
const bar = document.createElement('div');
bar.className = 'progress';
document.body.appendChild(bar);
addEventListener('scroll', () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + '%';
}, { passive: true });

// ===== Reveal on scroll =====
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ===== Count-up numbers =====
const counters = document.querySelectorAll('[data-count]');
const co = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, suffix = el.dataset.suffix || '';
    let n = 0;
    const step = () => {
      n += Math.max(1, Math.ceil(end / 24));
      if (n >= end) { el.textContent = end + suffix; return; }
      el.textContent = n + suffix;
      requestAnimationFrame(step);
    };
    step();
    co.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach((c) => co.observe(c));

// ===== Rotating role line =====
const roleEl = document.querySelector('[data-roles]');
if (roleEl) {
  const roles = roleEl.dataset.roles.split('|');
  let i = 0;
  setInterval(() => {
    roleEl.classList.add('out');
    setTimeout(() => {
      i = (i + 1) % roles.length;
      roleEl.textContent = roles[i];
      roleEl.classList.remove('out');
    }, 450);
  }, 2600);
}

// ===== Card glow follows cursor =====
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', e.clientX - r.left + 'px');
    card.style.setProperty('--my', e.clientY - r.top + 'px');
  });
});

// ===== Button ripple =====
document.querySelectorAll('.btn').forEach((b) => {
  b.addEventListener('click', (e) => {
    const r = b.getBoundingClientRect();
    const s = Math.max(r.width, r.height);
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    b.appendChild(span);
    setTimeout(() => span.remove(), 650);
  });
});

// ===== Project cards: click to expand =====
document.querySelectorAll('.proj').forEach((p) => {
  const toggle = () => {
    const open = p.classList.toggle('open');
    p.setAttribute('aria-expanded', open);
  };
  p.addEventListener('click', (e) => { if (e.target.closest('a')) return; toggle(); });
  p.addEventListener('keydown', (e) => { if (e.target.closest('a')) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
});

// ===== Project filters =====
const chips = document.querySelectorAll('.chip[data-filter]');
const cards = document.querySelectorAll('[data-cat]');
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('on'));
    chip.classList.add('on');
    const f = chip.dataset.filter;
    cards.forEach((card) => {
      const show = f === 'all' || card.dataset.cat.split(' ').includes(f);
      card.classList.toggle('hide', !show);
      if (show) { card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop'); }
    });
  });
});

// ===== Skills: tabs + click a skill =====
const tabs = document.querySelectorAll('.tab[data-panel]');
const panels = document.querySelectorAll('.panel');
tabs.forEach((t) => {
  t.addEventListener('click', () => {
    tabs.forEach((x) => x.classList.remove('on'));
    panels.forEach((p) => p.classList.remove('on'));
    t.classList.add('on');
    document.getElementById(t.dataset.panel).classList.add('on');
    resetUsed();
  });
});
const used = document.getElementById('used');
const defaultUsed = used ? used.innerHTML : '';
function resetUsed() {
  if (!used) return;
  document.querySelectorAll('.skill.on').forEach((s) => s.classList.remove('on'));
  used.innerHTML = defaultUsed;
}
document.querySelectorAll('.skill').forEach((s) => {
  s.addEventListener('click', () => {
    const was = s.classList.contains('on');
    document.querySelectorAll('.skill.on').forEach((x) => x.classList.remove('on'));
    if (was) { resetUsed(); return; }
    s.classList.add('on', 'bounce');
    setTimeout(() => s.classList.remove('bounce'), 450);
    used.innerHTML = '<b>' + s.textContent + '</b> — ' + (s.dataset.used || 'Listed in my resume.');
  });
});

// ===== Experience: click a role to open a pop-up =====
const roles = document.querySelectorAll('.role');
if (roles.length) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = '<div class="sheet" role="dialog" aria-modal="true"><button class="x" type="button" aria-label="Close">&times;</button><div class="body"></div></div>';
  document.body.appendChild(modal);
  const body = modal.querySelector('.body');
  const close = () => { modal.classList.remove('show'); document.body.classList.remove('noscroll'); };
  const open = (role) => {
    const c = role.cloneNode(true);
    c.className = 'role-pop';
    c.removeAttribute('role'); c.removeAttribute('tabindex');
    c.querySelectorAll('.intro,.toggle').forEach((n) => n.remove());
    c.querySelectorAll('.reveal').forEach((n) => n.classList.remove('reveal'));
    const when = c.querySelector('.when'), main = c.querySelector('.when + div');
    body.innerHTML = '';
    if (when) body.appendChild(when);
    if (main) while (main.firstChild) body.appendChild(main.firstChild);
    modal.classList.remove('show'); void modal.offsetWidth;
    modal.classList.add('show'); document.body.classList.add('noscroll');
    modal.querySelector('.x').focus();
  };
  roles.forEach((r) => {
    r.addEventListener('click', () => open(r));
    r.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(r); } });
  });
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.x')) close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// ===== Copy email =====
const toast = document.createElement('div');
toast.className = 'toast';
document.body.appendChild(toast);
document.querySelectorAll('[data-copy]').forEach((el) => {
  el.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(el.dataset.copy); toast.textContent = 'Copied to clipboard'; }
    catch (e) { toast.textContent = el.dataset.copy; }
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  });
});

// ===== Smooth page transitions =====
document.querySelectorAll('a[href^="/"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (e.metaKey || e.ctrlKey || a.target === '_blank' || href.includes('#')) return;
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(() => { location.href = href; }, 220);
  });
});
addEventListener('pageshow', () => document.body.classList.remove('leaving'));

// ===== Photo shape: click to switch rounded square <-> circle =====
const frame = document.querySelector('.frame');
if (frame) {
  frame.addEventListener('click', () => {
    const round = frame.classList.toggle('round');
    frame.setAttribute('aria-pressed', round);
  });
}

// ===== Tap feedback for touch screens (no hover on phones) =====
document.querySelectorAll('.card, .chip, .tab, .skill, .cert').forEach((el) => {
  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', e.clientX - r.left + 'px');
    el.style.setProperty('--my', e.clientY - r.top + 'px');
    el.classList.add('tap');
    setTimeout(() => el.classList.remove('tap'), 550);
  }, { passive: true });
});

// ===== Languages + contact icons: click animation =====
document.querySelectorAll('.langs .tag').forEach((t) => {
  t.addEventListener('click', () => {
    const was = t.classList.contains('on');
    document.querySelectorAll('.langs .tag.on').forEach((x) => x.classList.remove('on'));
    if (!was) { t.classList.add('on', 'bounce'); setTimeout(() => t.classList.remove('bounce'), 450); }
  });
});
document.querySelectorAll('.contact .row').forEach((r) => {
  r.addEventListener('click', () => { r.classList.remove('pop'); void r.offsetWidth; r.classList.add('pop'); });
});

// ===== Certificates: open full-size in a lightbox =====
const certBtns = document.querySelectorAll('.cert');
if (certBtns.length) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<button class="x" type="button" aria-label="Close">&times;</button><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(lb);
  const limg = lb.querySelector('img'), cap = lb.querySelector('figcaption');
  const closeLb = () => { lb.classList.remove('show'); document.body.classList.remove('noscroll'); };
  certBtns.forEach((b) => b.addEventListener('click', () => {
    limg.src = b.dataset.cert; limg.alt = b.dataset.title; cap.textContent = b.dataset.title;
    lb.classList.add('show'); document.body.classList.add('noscroll');
  }));
  lb.addEventListener('click', (e) => { if (e.target !== limg) closeLb(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
}
