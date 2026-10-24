/* ============================================================
   EDIT YOUR CONTENT HERE
   ============================================================ */
const SKILLS = [
  { name: 'Adobe Photoshop',  desc: 'Fresh ideas and concepts',  lv: 8 },
  { name: 'Adobe Illustrator', desc: 'Visual communication',      lv: 7 },
  { name: 'Adobe Premiere Pro', desc: 'Ideas brought to life',    lv: 6 },
  { name: 'UI / UX',          desc: 'Always getting better',     lv: 7 }
];
const PROJECTS = [
  { title: 'Project One',   cat: 'Creative Design',     color: '#f58cb4', img: '' },
  { title: 'Project Two',   cat: 'Visual Identity',     color: '#c8b4f0', img: '' },
  { title: 'Project Three', cat: 'Poster Design',       color: '#7fd8c0', img: '' },
  { title: 'Project Four',  cat: 'Digital Artwork',     color: '#ffd23f', img: '' },
  { title: 'Project Five',  cat: 'Print Design',        color: '#8fb8ff', img: '' },
  { title: 'Project Six',   cat: 'Creative Experiment', color: '#ffb199', img: '' }
  // to use a real image: img: 'images/my-project.png'
];
const HERO_LINES = ['Living my best life.', 'Glam. Bold. Unbothered.', 'Let\'s build something pretty.'];

/* ============================================================ */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- sparkles background ---- */
(function () {
  const box = document.getElementById('sparkles'); if (!box) return;
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    s.style.left = Math.random() * 98 + '%'; s.style.top = Math.random() * 98 + '%';
    s.style.animationDelay = (Math.random() * 2.4) + 's';
    s.style.transform = 'scale(' + (0.5 + Math.random() * 0.5) + ')';
    box.appendChild(s);
  }
})();

/* ---- responsive nav ---- */
(function () {
  const burger = document.getElementById('burger'), links = document.getElementById('links');
  if (!burger) return;
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open'); burger.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });
  // highlight link of the section on screen
  const secs = [...document.querySelectorAll('main section[id]')];
  if (!secs.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.querySelectorAll('a').forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => io.observe(s));
})();

/* ---- render skills + projects ---- */
(function () {
  const sg = document.getElementById('skillGrid');
  if (sg) sg.innerHTML = SKILLS.map((s, i) => `
    <article class="skill px reveal">
      <h3>0${i + 1} / ${s.name}</h3><p>${s.desc}</p>
      <div class="xp" data-lv="${s.lv}">${'<i></i>'.repeat(10)}</div>
      <span class="lv">LV.${s.lv}</span>
    </article>`).join('');
  const wg = document.getElementById('workGrid');
  if (wg) wg.innerHTML = PROJECTS.map((p, i) => `
    <article class="card reveal" tabindex="0">
      ${p.img ? `<img class="thumb" src="${p.img}" alt="${p.title}">`
              : `<div class="thumb ph" style="background-color:${p.color}">#${i + 1}</div>`}
      <div class="info"><h3>${p.title}</h3><span>${p.cat}</span></div>
    </article>`).join('');
})();

/* ---- scroll reveal + glitch + XP bars filling ---- */
(function () {
  const els = document.querySelectorAll('.reveal');
  const show = el => {
    el.classList.add('in');
    el.querySelectorAll('.xp').forEach(x => {
      const lv = +x.dataset.lv;
      [...x.children].forEach((b, i) => setTimeout(() => b.classList.toggle('on', i < lv), reduce ? 0 : i * 70));
    });
  };
  if (!('IntersectionObserver' in window)) return els.forEach(show);
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
  }), { threshold: .2 });
  els.forEach(e => io.observe(e));
})();

/* ---- hero: avatar, skyline, clock, typing ---- */
(function () {
  const av = document.getElementById('heroAvatar'); if (!av) return;
  const cfg = loadAvatar();
  drawAvatar(av, cfg, 10, false);
  document.getElementById('moodText').textContent = cfg.mood;

  // pastel skyline
  const sk = document.getElementById('skyline'), c = sk.getContext('2d');
  let x = 0, seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const cols = ['#e3d4fb', '#cfeee6', '#f9d0e1'];
  while (x < 160) {
    const w = 8 + Math.floor(rnd() * 12), h = 14 + Math.floor(rnd() * 34);
    c.fillStyle = cols[Math.floor(rnd() * 3)]; c.fillRect(x, 60 - h, w, h);
    c.fillStyle = '#fff'; for (let yy = 60 - h + 4; yy < 56; yy += 6) c.fillRect(x + 2, yy, 2, 2);
    x += w + 1;
  }

  // live date + clock (dd/mm/yy, 12h)
  const date = document.getElementById('date'), clock = document.getElementById('clock');
  const tick = () => {
    const d = new Date(), p = n => String(n).padStart(2, '0'), h = d.getHours() % 12 || 12;
    date.textContent = `${p(d.getDate())}/${p(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)}`;
    clock.textContent = `${p(h)}:${p(d.getMinutes())} ${d.getHours() < 12 ? 'AM' : 'PM'}`;
  };
  tick(); setInterval(tick, 20000);

  // typing dialogue box
  const out = document.getElementById('typed');
  const lines = [cfg.tagline, ...HERO_LINES];
  if (reduce) { out.textContent = lines[0]; return; }
  let li = 0, ci = 0;
  (function type() {
    const line = lines[li];
    out.textContent = line.slice(0, ++ci);
    if (ci < line.length) return setTimeout(type, 55);
    setTimeout(() => { li = (li + 1) % lines.length; ci = 0; type(); }, 2200);
  })();
})();

/* ---- pixel cat paw cursor ---- */
(function () {
  if (!matchMedia('(pointer: fine)').matches) return;       // touch devices keep their normal behaviour
  const MAP = [
    '...WWW.WWW...', '..WWWWWWWWW..', '..WPPWWWPPW..', 'WWWPPWWWPPWWW', 'WPPWWWWWWWPPW',
    'WPPWWPPPWWPPW', 'WWWWPPPPPWWWW', 'WWWWPPPPPWWWW', 'WWWWWPPPWWWWW', '.WWWWWWWWWWW.',
    '.WWWWWWWWWWW.', '..WWWWWWWWW..', '..WWWWWWWWW..'
  ];
  const w = MAP[0].length, h = MAP.length;
  const g = MAP.map(r => r.split(''));
  const at = (x, y) => (g[y] && g[y][x]) || '.';
  const col = { W: '#ffffff', P: '#f7a1c0', O: '#6b6b7a' };
  let rects = '';
  for (let y = -1; y <= h; y++) for (let x = -1; x <= w; x++) {
    let k = at(x, y);
    if (k === '.') k = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => at(x + dx, y + dy) !== '.') ? 'O' : '.';
    if (k !== '.') rects += `<rect x="${x + 1}" y="${y + 1}" width="1" height="1" fill="${col[k]}"/>`;
  }
  const paw = document.createElement('div'); paw.className = 'paw hide';
  paw.innerHTML = `<svg viewBox="0 0 ${w + 2} ${h + 2}" shape-rendering="crispEdges">${rects}</svg>`;
  document.body.appendChild(paw);
  document.body.classList.add('has-paw');

  addEventListener('mousemove', e => {
    paw.classList.remove('hide');
    paw.style.transform = `translate3d(${e.clientX - 12}px,${e.clientY - 4}px,0)`;
  });
  document.addEventListener('mouseleave', () => paw.classList.add('hide'));
  addEventListener('mousedown', () => paw.classList.add('down'));
  addEventListener('mouseup', () => paw.classList.remove('down'));
  document.addEventListener('mouseover', e =>
    paw.classList.toggle('hot', !!e.target.closest('a,button,input,.card,[tabindex]')));
})();
