/* ============================================================
   AVATAR: pixel sprite drawing + the builder UI (avatar.html)
   The sprite lives on a 24 x 32 grid; every "pixel" is a rect.
   ============================================================ */
const AVATAR_KEY = 'pixelAvatar';

const OPT = {
  skin:        ['#f6d3b3', '#e7b28c', '#c68a5e', '#8d5a3b', '#5a3825'],
  hairStyle:   ['long', 'bob', 'buns', 'short'],
  hairColor:   ['#1b1b2f', '#4a2c1a', '#c9812b', '#f5d36b', '#f58cb4', '#7fd8c0', '#9b7bf0'],
  outfitStyle: ['jacket', 'tee', 'dress'],
  outfitColor: ['#d9b8f5', '#f58cb4', '#7fd8c0', '#ffd23f', '#8fb8ff', '#ffffff'],
  glasses:     ['none', '#e66bd6', '#2b2a5e', '#7fd8c0', '#ffd23f'],
  accessory:   ['none', 'bow', 'cat ears', 'crown'],
  pet:         ['none', 'skull', 'cat'],
  bg:          ['none', 'sky', 'sunset', 'mint', 'night'],
  mood:        ['HAPPY', 'CHILL', 'SASSY', 'SLEEPY']
};
const BG = {
  sky:    ['#bfe9ff', '#f9d7f0'],
  sunset: ['#ffd1a8', '#f58cb4'],
  mint:   ['#d5f5ea', '#7fd8c0'],
  night:  ['#4a3f8f', '#2b2a5e']
};
const DEFAULT_AVATAR = {
  name: 'PLAYER ONE', tagline: 'Glam. Bold. Unbothered.',
  skin: '#8d5a3b', hairStyle: 'long', hairColor: '#1b1b2f',
  outfitStyle: 'jacket', outfitColor: '#d9b8f5', glasses: '#e66bd6',
  accessory: 'none', pet: 'skull', bg: 'none', mood: 'HAPPY'
};

function loadAvatar() {
  try { return Object.assign({}, DEFAULT_AVATAR, JSON.parse(localStorage.getItem(AVATAR_KEY)) || {}); }
  catch (e) { return Object.assign({}, DEFAULT_AVATAR); }
}
function saveAvatar(cfg) { try { localStorage.setItem(AVATAR_KEY, JSON.stringify(cfg)); } catch (e) {} }

/* shade a hex colour: amt -1..1 */
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = c => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(f).map(v => v.toString(16).padStart(2, '0')).join('');
}

function drawAvatar(canvas, cfg, scale = 10, withBg = false) {
  const W = 24, H = 32, S = scale, NAVY = '#2b2a5e';
  canvas.width = W * S; canvas.height = H * S;
  const c = canvas.getContext('2d');
  c.imageSmoothingEnabled = false;
  const R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x * S, y * S, w * S, h * S); };

  if (withBg) {
    const b = BG[cfg.bg];
    R(0, 0, W, H, b ? b[0] : '#fffdf2');
    if (b) R(0, 22, W, 10, b[1]);
  }
  const skin = cfg.skin, hair = cfg.hairColor, out = cfg.outfitColor;
  const pants = shade(out, .35), skinDark = shade(skin, -.2);

  R(6, 30, 12, 1, 'rgba(43,42,94,.18)');                       // ground shadow

  if (cfg.accessory === 'cat ears') {                           // ears sit behind hair
    R(7, 1, 2, 3, hair); R(15, 1, 2, 3, hair); R(8, 2, 1, 1, '#f58cb4'); R(15, 2, 1, 1, '#f58cb4');
  }
  // back hair
  if (cfg.hairStyle === 'long') R(7, 4, 10, 9, hair);
  if (cfg.hairStyle === 'bob')  R(6, 4, 12, 9, hair);
  if (cfg.hairStyle === 'buns') { R(5, 1, 3, 3, hair); R(16, 1, 3, 3, hair); }

  // legs + shoes
  if (cfg.outfitStyle === 'dress') { R(8, 23, 3, 5, skin); R(13, 23, 3, 5, skin); }
  else { R(7, 21, 4, 7, pants); R(13, 21, 4, 7, pants); }
  R(7, 28, 4, 2, NAVY); R(13, 28, 4, 2, NAVY);

  // body
  if (cfg.outfitStyle === 'jacket') {
    R(6, 13, 12, 8, out); R(10, 13, 4, 8, '#ffffff');
    R(4, 13, 2, 7, out); R(18, 13, 2, 7, out);
    R(6, 13, 1, 8, shade(out, -.15)); R(17, 13, 1, 8, shade(out, -.15));
    R(4, 20, 2, 1, skin); R(18, 20, 2, 1, skin);
  } else if (cfg.outfitStyle === 'tee') {
    R(6, 13, 12, 8, out); R(4, 13, 2, 2, out); R(18, 13, 2, 2, out);
    R(4, 15, 2, 5, skin); R(18, 15, 2, 5, skin);
  } else {
    R(6, 13, 12, 6, out); R(5, 19, 14, 4, out); R(5, 22, 14, 1, shade(out, -.15));
    R(4, 13, 2, 2, out); R(18, 13, 2, 2, out); R(4, 15, 2, 5, skin); R(18, 15, 2, 5, skin);
  }
  R(11, 12, 2, 1, skinDark);                                    // neck

  // head
  R(8, 4, 8, 8, skin);
  // face
  R(10, 8, 1, 2, NAVY); R(13, 8, 1, 2, NAVY);
  R(9, 10, 1, 1, '#f58cb4'); R(14, 10, 1, 1, '#f58cb4');
  R(11, 10, 2, 1, shade('#e8579a', -.1));
  // front hair
  R(7, 3, 10, 3, hair);
  if (cfg.hairStyle === 'short') { R(7, 3, 1, 5, hair); R(16, 3, 1, 5, hair); }
  else { R(7, 3, 2, 7, hair); R(15, 3, 2, 7, hair); }
  if (cfg.hairStyle === 'long') { R(6, 12, 2, 10, hair); R(16, 12, 2, 10, hair); }

  // glasses
  if (cfg.glasses !== 'none') {
    c.globalAlpha = .8;
    R(8, 7, 3, 3, cfg.glasses); R(13, 7, 3, 3, cfg.glasses); R(11, 7, 2, 1, cfg.glasses);
    c.globalAlpha = 1;
    R(8, 7, 3, 1, shade(cfg.glasses, .5)); R(13, 7, 3, 1, shade(cfg.glasses, .5));
  }
  // earring
  R(16, 10, 1, 2, '#ffffff'); R(16, 11, 1, 1, NAVY);

  // accessories
  if (cfg.accessory === 'bow')   { R(13, 1, 4, 3, '#f58cb4'); R(14, 2, 2, 1, '#c23a7a'); }
  if (cfg.accessory === 'crown') { R(8, 1, 8, 2, '#ffd23f'); R(8, 0, 1, 1, '#ffd23f'); R(11, 0, 2, 1, '#ffd23f'); R(15, 0, 1, 1, '#ffd23f'); }

  // pet
  if (cfg.pet === 'skull') {
    R(18, 25, 5, 4, '#ffffff'); R(19, 29, 3, 1, '#ffffff'); R(19, 26, 1, 2, NAVY); R(21, 26, 1, 2, NAVY);
    R(20, 24, 1, 1, '#f58cb4');
  } else if (cfg.pet === 'cat') {
    R(18, 26, 5, 4, '#ffffff'); R(18, 25, 1, 1, '#ffffff'); R(22, 25, 1, 1, '#ffffff');
    R(19, 27, 1, 1, NAVY); R(21, 27, 1, 1, NAVY); R(20, 28, 1, 1, '#f58cb4');
  }
}

/* ---------------- builder UI (only runs on avatar.html) ---------------- */
function initAvatarBuilder() {
  const canvas = document.getElementById('builderCanvas');
  if (!canvas) return;
  let cfg = loadAvatar();
  const controls = document.getElementById('controls');

  const GROUPS = [
    ['Skin tone', 'skin', 'swatch'], ['Hair style', 'hairStyle', 'btn'], ['Hair colour', 'hairColor', 'swatch'],
    ['Outfit', 'outfitStyle', 'btn'], ['Outfit colour', 'outfitColor', 'swatch'], ['Glasses', 'glasses', 'swatch'],
    ['Accessory', 'accessory', 'btn'], ['Pet', 'pet', 'btn'], ['Background', 'bg', 'btn'], ['Mood', 'mood', 'btn']
  ];

  const sync = () => {
    drawAvatar(canvas, cfg, 12, true);
    document.getElementById('pvName').textContent = cfg.name.toUpperCase();
    controls.querySelectorAll('[data-key]').forEach(b =>
      b.setAttribute('aria-pressed', String(cfg[b.dataset.key] === b.dataset.val)));
    saveAvatar(cfg);
  };

  GROUPS.forEach(([label, key, kind]) => {
    const g = document.createElement('div'); g.className = 'group';
    g.innerHTML = `<h3>${label}</h3><div class="opts"></div>`;
    const box = g.querySelector('.opts');
    OPT[key].forEach(val => {
      const b = document.createElement('button');
      b.type = 'button'; b.dataset.key = key; b.dataset.val = val;
      if (kind === 'swatch') {
        b.className = 'swatch' + (val === 'none' ? ' none' : '');
        if (val !== 'none') b.style.background = val;
        b.setAttribute('aria-label', label + ' ' + val);
      } else { b.className = 'opt'; b.textContent = val; }
      b.addEventListener('click', () => { cfg[key] = val; sync(); });
      box.appendChild(b);
    });
    controls.appendChild(g);
  });

  const inName = document.getElementById('inName'), inTag = document.getElementById('inTag');
  inName.value = cfg.name; inTag.value = cfg.tagline;
  inName.addEventListener('input', () => { cfg.name = inName.value || 'PLAYER ONE'; sync(); });
  inTag.addEventListener('input', () => { cfg.tagline = inTag.value; sync(); });

  const pick = a => a[Math.floor(Math.random() * a.length)];
  document.getElementById('btnRandom').onclick = () => {
    Object.keys(OPT).forEach(k => cfg[k] = pick(OPT[k])); sync();
  };
  document.getElementById('btnReset').onclick = () => {
    cfg = Object.assign({}, DEFAULT_AVATAR); inName.value = cfg.name; inTag.value = cfg.tagline; sync();
  };
  document.getElementById('btnDownload').onclick = () => {
    const out = document.createElement('canvas'); drawAvatar(out, cfg, 20, true);
    const a = document.createElement('a'); a.download = 'my-pixel-avatar.png'; a.href = out.toDataURL('image/png'); a.click();
  };
  sync();
}
document.addEventListener('DOMContentLoaded', initAvatarBuilder);
