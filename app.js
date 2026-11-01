/* Loreweave — vanilla SPA. Champion data/art: Riot Data Dragon (runtime). */
(() => {
'use strict';
const {R, regionOf, REL, EVENTS, TRAILS, RIVALRIES} = window.LW_DATA;
const CDN = 'https://ddragon.leagueoflegends.com/cdn';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const strip = s => String(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const view = $('#view');
const reduceMotion = () => store.settings.reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- icons (original line icons) ---------- */
const I = {
  back:'<path d="M15 5l-7 7 7 7"/>', close:'<path d="M6 6l12 12M18 6L6 18"/>',
  explore:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  champs:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
  atlas:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  codex:'<path d="M5 4h10a4 4 0 014 4v12H9a4 4 0 01-4-4z"/><path d="M9 8h6M9 12h6"/>',
  you:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  chart:'<path d="M5 20V12M10 20V6M15 20v-9M20 20V9"/>', updown:'<path d="M8 9l4-4 4 4M8 15l4 4 4-4"/>',
  ban:'<circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/>', role:'<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/>',
  diff:'<path d="M4 18l5-8 4 5 3-4 4 7z"/>', skins:'<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 8"/>',
  pin:'<path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  species:'<circle cx="12" cy="7" r="3"/><path d="M6 21v-4a6 6 0 0112 0v4"/>', cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  drop:'<path d="M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z"/>', web:'<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="7" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7l8 0M7 8l4 8M17 9l-4 7"/>',
  chev:'<path d="M9 6l6 6-6 6"/>', heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/>',
  bookmark:'<path d="M6 4h12v17l-6-4-6 4z"/>', share:'<path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6"/>', play:'<path d="M8 5l11 7-11 7z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>', book:'<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5"/>',
  next:'<path d="M5 12h14M13 6l6 6-6 6"/>', spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>'
};
const ic = (n, extra = '') => `<svg viewBox="0 0 24 24" fill="${n==='heart'&&extra==='fill'?'currentColor':'none'}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
// Original geometric region marks (not official emblems)
const EMB = {bandle:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',bilgewater:'<path d="M12 4v15M7 9h10M5 14c1 4 4 6 7 6s6-2 7-6"/>',demacia:'<path d="M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z"/><path d="M12 8v8M9 11h6"/>',freljord:'<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/><path d="M10 5l2 2 2-2M10 19l2-2 2 2"/>',ionia:'<path d="M12 3c3 4 3 8 0 18-3-10-3-14 0-18z"/><path d="M5 9c4 1 6 4 7 12M19 9c-4 1-6 4-7 12"/>',ixtal:'<path d="M12 21V9M12 9c0-4 3-6 7-6 0 4-3 6-7 6zM12 13c0-3-2-5-6-5 0 3 2 5 6 5z"/>',noxus:'<path d="M4 20L12 4l8 16"/><path d="M8 14h8"/>',piltover:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',shadowisles:'<path d="M5 20c0-8 3-15 7-15s7 7 7 15"/><path d="M9 12h.01M15 12h.01M9 17c2 1 4 1 6 0"/>',shurima:'<circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3"/>',targon:'<path d="M3 20l9-16 9 16z"/><path d="M12 9l1 2h2l-1.6 1.3.6 2.2-2-1.3-2 1.3.6-2.2L9 11h2z"/>',void:'<path d="M12 4c5 0 8 4 8 8s-3 8-8 8-8-4-8-8"/><path d="M12 8a4 4 0 010 8"/><circle cx="12" cy="12" r="1"/>',zaun:'<path d="M6 3v6a6 6 0 0012 0V3"/><path d="M12 15v6M8 21h8"/><circle cx="12" cy="9" r="1.5"/>',runeterra:'<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16"/>'};
const emb = (k, color) => `<svg class="em" viewBox="0 0 24 24" fill="none" stroke="${color || (R[k]?.color ?? '#A3A3A8')}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${EMB[k] || EMB.runeterra}</svg>`;

/* ---------- storage ---------- */
const LS = 'loreweave:v1';
const store = Object.assign({favorites:[], visited:{}, trail:[], saved:[], wish:[], settings:{reduceMotion:false}, onboarded:false, aura:{}, activeTrail:null, depthMax:0}, JSON.parse(localStorage.getItem(LS) || '{}'));
const save = () => { try { localStorage.setItem(LS, JSON.stringify(store)); } catch (e) { store.aura = {}; } };
const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2400); };

/* ---------- Data Dragon ---------- */
const DD = { v:null, versions:[], champs:{}, list:[], details:{}, full:null, items:null, runes:null };
const jget = async (url) => { const r = await fetch(url); if (!r.ok) throw new Error(r.status + ' ' + url); return r.json(); };
async function boot() {
  try {
    DD.versions = (await jget('https://ddragon.leagueoflegends.com/api/versions.json')).filter(v => /^\d+\.\d+\.\d+$/.test(v));
  } catch (e) {
    DD.versions = JSON.parse(localStorage.getItem('lw:versions') || '[]');
    if (!DD.versions.length) throw e;
  }
  localStorage.setItem('lw:versions', JSON.stringify(DD.versions.slice(0, 30)));
  DD.v = DD.versions[0];
  const data = await jget(`${CDN}/${DD.v}/data/en_US/champion.json`);
  DD.champs = data.data;
  DD.list = Object.values(DD.champs).sort((a, b) => a.name.localeCompare(b.name));
  DD.byName = {}; DD.list.forEach(c => DD.byName[c.name.toLowerCase()] = c.id);
}
const detail = async (id, v = DD.v) => {
  const k = id + '@' + v; if (DD.details[k]) return DD.details[k];
  const d = jget(`${CDN}/${v}/data/en_US/champion/${id}.json`).then(j => fixSkins(j.data[id]));
  DD.details[k] = d; d.catch(() => delete DD.details[k]); return d;
};
const fixSkins = c => { const all = c.skins; c.skins = all.filter(s => s.parentSkin == null).map(s => ({...s, chromaList: all.filter(x => x.parentSkin === s.num).map(x => (x.name.match(/\(([^)]+)\)\s*$/) || [, x.name])[1])})); return c; };
const loadFull = () => DD.full ||= jget(`${CDN}/${DD.v}/data/en_US/championFull.json`).then(j => { Object.values(j.data).forEach(fixSkins); return j.data; });
const loadItems = () => DD.items ||= jget(`${CDN}/${DD.v}/data/en_US/item.json`).then(j => j.data);
const loadRunes = () => DD.runes ||= jget(`${CDN}/${DD.v}/data/en_US/runesReforged.json`);
const splash = (id, n = 0) => `${CDN}/img/champion/splash/${id}_${n}.jpg`;
const loading = (id, n = 0) => `${CDN}/img/champion/loading/${id}_${n}.jpg`;
const square = id => `${CDN}/${DD.v}/img/champion/${id}.png`;
const C = id => DD.champs[id];
const REGION_WORDS = Object.entries(R).map(([k, v]) => [k, v.name.replace(/^The /, '')]);
const regionKey = id => {
  if (regionOf[id]) return regionOf[id];
  const b = C(id)?.blurb || '';
  for (const [k, n] of REGION_WORDS) if (b.includes(n)) return k;
  return 'runeterra';
};
const regionName = k => R[k]?.name || 'Runeterra';
const ROLE = {Marksman:'Bot lane', Support:'Support', Mage:'Mid lane', Assassin:'Mid lane', Fighter:'Top lane', Tank:'Top lane'};

/* ---------- seeded demo numbers ---------- */
const hash = s => { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
const rng = seed => { let a = hash(seed); return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const demoStats = (id, patch = DD.v) => { const r = rng(id + patch); return { win: 46.5 + r() * 7.5, pick: 1.5 + r() * 13, ban: 0.4 + r() * (r() > .8 ? 30 : 9), games: Math.round(40000 + r() * 260000), tier: 'SABCD'[Math.floor(r() * 5)] }; };
const short = v => v.split('.').slice(0, 2).join('.');

/* ---------- aura extraction (from official art, in-browser) ---------- */
const lum = ([r, g, b]) => { const f = c => (c /= 255) <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
const rgb2hsl = ([r, g, b]) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; } return [h, s, l]; };
const hsl2rgb = ([h, s, l]) => { const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [f(0), f(8), f(4)].map(x => Math.round(x * 255)); };
const hex = c => '#' + c.map(x => x.toString(16).padStart(2, '0')).join('');
const unhex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const clampAura = c => { let [h, s, l] = rgb2hsl(c); s = Math.max(s, .55); l = Math.max(l, .45); let out = hsl2rgb([h, s, l]); while (contrast(out, [5, 5, 6]) < 4.5 && l < .95) { l += .03; out = hsl2rgb([h, s, l]); } return hex(out); };
function extractAura(id) {
  if (store.aura[id]) return Promise.resolve(store.aura[id]);
  return new Promise(res => {
    const img = new Image(); img.crossOrigin = 'anonymous';
    const fb = () => { const c = R[regionKey(id)]?.color || '#E0458F'; res([clampAura(unhex(c)), '#3FB6E8']); };
    img.onerror = fb;
    img.onload = () => { try {
      const W = 44, H = 80, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const x = cv.getContext('2d', {willReadFrequently:true}); x.drawImage(img, 0, 0, W, H);
      const px = x.getImageData(0, 0, W, H).data, bins = Array.from({length:24}, () => ({w:0, r:0, g:0, b:0}));
      for (let i = 0; i < px.length; i += 4) { const c = [px[i], px[i + 1], px[i + 2]], [h, s, l] = rgb2hsl(c); if (s < .28 || l < .14 || l > .9) continue; const b = bins[Math.floor(h / 15) % 24], w = s * (1 - Math.abs(l - .5)); b.w += w; b.r += c[0] * w; b.g += c[1] * w; b.b += c[2] * w; }
      const ranked = bins.map((b, i) => ({...b, i})).filter(b => b.w > 0).sort((a, b) => b.w - a.w);
      if (!ranked.length) return fb();
      const avg = b => [b.r / b.w, b.g / b.w, b.b / b.w].map(Math.round);
      const p = ranked[0], sec = ranked.find(b => { const d = Math.abs(b.i - p.i) % 24; return Math.min(d, 24 - d) >= 4; }) || ranked[1] || p;
      const aura = [clampAura(avg(p)), clampAura(avg(sec))];
      store.aura[id] = aura; save(); res(aura);
    } catch (e) { fb(); } };
    img.src = loading(id);
  });
}
const setAura = (a) => { document.body.style.setProperty('--a1', a[0]); document.body.style.setProperty('--a2', a[1]); document.body.classList.add('has-aura'); };
const clearAura = () => { document.body.classList.remove('has-aura'); document.body.style.setProperty('--a1', '#E0458F'); document.body.style.setProperty('--a2', '#3FB6E8'); };

/* ---------- graph helpers ---------- */
const relsOf = id => REL.filter(r => (r[0] === id || r[1] === id) && C(r[0]) && C(r[1])).map(r => ({other: r[0] === id ? r[1] : r[0], type: r[2], note: r[3]}));
const champsIn = k => DD.list.filter(c => regionKey(c.id) === k);
const pageKey = () => location.hash.slice(1) || '/';
const isVisited = href => !!store.visited[href.replace(/^#/, '')];
const cchip = id => { const c = C(id); if (!c) return ''; const h = `#/c/${id}`; return `<a class="cchip${isVisited(h) ? '' : ' undisc'}" href="${h}" data-champ="${id}"><img src="${square(id)}" alt="" loading="lazy">${esc(c.name)}</a>`; };

/* ---------- real balance history: diff Data Dragon files patch to patch ---------- */
const STATN = {hp:'Base health',hpperlevel:'Health per level',mp:'Base resource',mpperlevel:'Resource per level',movespeed:'Move speed',armor:'Base armor',armorperlevel:'Armor per level',spellblock:'Base magic resist',spellblockperlevel:'Magic resist per level',attackrange:'Attack range',hpregen:'Health regen',hpregenperlevel:'Health regen per level',mpregen:'Resource regen',mpregenperlevel:'Resource regen per level',attackdamage:'Base attack damage',attackdamageperlevel:'Attack damage per level',attackspeedperlevel:'Attack speed per level',attackspeed:'Base attack speed',crit:'Crit',critperlevel:'Crit per level'};
const KEYS = ['Q','W','E','R'];
const nums = s => String(s || '').split('/').map(Number);
const cmpArr = (a, b) => { const x = nums(a), y = nums(b); const n = Math.min(x.length, y.length); let s = 0; for (let i = 0; i < n; i++) s += Math.sign(x[i] - y[i]); return s; };
function diffChamp(nw, old) {
  const ch = [];
  for (const k in STATN) { const a = old.stats?.[k], b = nw.stats?.[k]; if (a == null || b == null || Math.abs(a - b) < 1e-6) continue; ch.push({kind: b > a ? 'buff' : 'nerf', text: `${STATN[k]} ${+(+a).toFixed(3)} → ${+(+b).toFixed(3)}`}); }
  let textChanges = 0;
  nw.spells.forEach((s, i) => { const o = old.spells[i]; if (!o) return; const key = KEYS[i];
    if (o.name !== s.name) { ch.push({kind:'rework', text:`${key} renamed: ${o.name} → ${s.name}`}); textChanges++; }
    if (o.cooldownBurn !== s.cooldownBurn) { const d = cmpArr(s.cooldownBurn, o.cooldownBurn); ch.push({kind: d < 0 ? 'buff' : d > 0 ? 'nerf' : 'neutral', text:`${key} ${s.name} cooldown ${o.cooldownBurn} → ${s.cooldownBurn}`, key}); }
    if (o.costBurn !== s.costBurn) { const d = cmpArr(s.costBurn, o.costBurn); ch.push({kind: d < 0 ? 'buff' : d > 0 ? 'nerf' : 'neutral', text:`${key} ${s.name} cost ${o.costBurn} → ${s.costBurn}`, key}); }
    if (o.rangeBurn !== s.rangeBurn && !isNaN(nums(s.rangeBurn)[0])) { const d = cmpArr(s.rangeBurn, o.rangeBurn); ch.push({kind: d > 0 ? 'buff' : d < 0 ? 'nerf' : 'neutral', text:`${key} ${s.name} range ${o.rangeBurn} → ${s.rangeBurn}`, key}); }
    if (strip(o.description) !== strip(s.description)) { ch.push({kind:'neutral', text:`${key} ${s.name} description updated`, key}); textChanges++; }
  });
  if (old.passive && nw.passive && strip(old.passive.description) !== strip(nw.passive.description)) { ch.push({kind:'neutral', text:`Passive ${nw.passive.name} description updated`, key:'P'}); textChanges++; }
  if (nw.skins.length > old.skins.length) nw.skins.filter(s => !old.skins.find(o => o.num === s.num)).forEach(s => ch.push({kind:'skin', text:`New skin: ${s.name}`}));
  const b = ch.filter(c => c.kind === 'buff').length, n = ch.filter(c => c.kind === 'nerf').length;
  const type = textChanges >= 3 ? 'rework' : b && !n ? 'buff' : n && !b ? 'nerf' : (b || n || ch.some(c => c.kind === 'neutral')) ? 'neutral' : (ch.length ? 'skin' : 'none');
  return {type, changes: ch, mag: ch.filter(c => c.kind !== 'skin').length};
}
const HIST = {};
async function history(id) {
  if (HIST[id]) return HIST[id];
  const ck = 'lw:hist:' + id + ':' + DD.v; const cached = localStorage.getItem(ck);
  if (cached) return HIST[id] = JSON.parse(cached);
  const vs = DD.versions.slice(0, 25);
  const ds = await Promise.allSettled(vs.map(v => detail(id, v)));
  const out = [];
  for (let i = 0; i < 24; i++) {
    const nw = ds[i].value, old = ds[i + 1].value, p = short(vs[i]);
    if (nw && !old) { out.push({patch:p, v:vs[i], type:'rework', changes:[{kind:'rework', text:'Champion released (first patch in Data Dragon)'}], mag:4}); continue; }
    if (!nw || !old) { out.push({patch:p, v:vs[i], type:'none', changes:[], mag:0}); continue; }
    out.push({patch:p, v:vs[i], ...diffChamp(nw, old)});
  }
  try { localStorage.setItem(ck, JSON.stringify(out)); } catch (e) {}
  return HIST[id] = out;
}

/* ---------- router & trail ---------- */
const routes = [];
const route = (re, fn) => routes.push([re, fn]);
const pageLabel = { };
function trackTrail(path, label, thumb) {
  store.visited[path] = 1;
  const i = store.trail.findIndex(t => t.p === path);
  if (i >= 0) store.trail = store.trail.slice(0, i + 1);
  else store.trail.push({p:path, l:label, t:thumb});
  if (store.trail.length > 40) store.trail = store.trail.slice(-40);
  const d = store.trail.length;
  if (d > store.depthMax) store.depthMax = d;
  if (d === 12 && i < 0) toast(`Depth 12 · From ${store.trail[0].l} to ${label}. Saved to You`), saveTrail(true);
  save(); renderTrail();
}
const ROOTS = ['/', '/champions', '/atlas', '/codex', '/you'];
function renderTrail() {
  const el = $('#trail'), t = store.trail;
  const show = t.length > 1 && !ROOTS.includes(pageKey());
  el.hidden = !show; document.body.classList.toggle('no-trail', !show);
  if (!show) return;
  const items = t.slice(-6);
  el.innerHTML = items.map((n, i) => `${i ? '<span class="tline"></span>' : ''}<a class="tnode${i === items.length - 1 ? ' cur' : ''}" href="#${n.p}">${n.t?.startsWith('#') ? `<i style="background:${n.t}"></i>` : n.t ? `<img src="${n.t}" alt="">` : ''}${esc(n.l)}</a>`).join('') + `<button class="depth" data-act="savetrail" aria-label="Save trail">Depth <b>${t.length}</b> ${ic('bookmark').replace('<svg', '<svg style="width:14px;height:14px;vertical-align:-2px"')}</button>`;
  el.scrollLeft = el.scrollWidth;
}
function saveTrail(silent) {
  const t = store.trail; if (t.length < 2) return toast('Explore a little deeper first');
  if (store.saved.length >= 3 && !silent) return toast('Free plan saves 3 trails · Pro (preview) lifts the limit');
  if (store.saved.length >= 3) store.saved.shift();
  store.saved.push({id:Date.now(), title:`${t[0].l} → ${t[t.length - 1].l}`, stops:t.slice(), date:new Date().toISOString()});
  save(); if (!silent) toast('Trail saved');
}
async function go() {
  const path = pageKey();
  closeSheet(); closeSearch();
  document.querySelectorAll('.minititle,.nextstop,.progress').forEach(e => e.remove());
  setNav(path);
  for (const [re, fn] of routes) {
    const m = path.match(re); if (!m) continue;
    const run = async () => { try { await fn(...m.slice(1).map(decodeURIComponent)); } catch (e) { console.warn(e); view.innerHTML = `<div class="wrap page" style="padding-top:80px"><h1 class="h-sec">Couldn't open this page</h1><p class="sub">Check your connection, Loreweave loads art and data from Riot's CDN.</p><a class="pill sm" href="#/">Back to Explore</a></div>`; } };
    if (document.startViewTransition && !reduceMotion() && go.vt) { go.vt = false; await document.startViewTransition(run).updateCallback; } else await run();
    if (!go.keep) window.scrollTo(0, 0); go.keep = false;
    renderTrail(); renderNextStop(path);
    return;
  }
  location.hash = '#/';
}
const TABS = [['/', 'Explore', 'explore'], ['/champions', 'Champions', 'champs'], ['/atlas', 'Atlas', 'atlas'], ['/codex', 'Codex', 'codex'], ['/you', 'You', 'you']];
function shell() {
  $('#tabs').innerHTML = TABS.map(([p, l, i]) => `<a class="tab" href="#${p}">${ic(i)}<span>${l}</span></a>`).join('');
  $('#rail').innerHTML = `<div class="brand"><img src="icons/icon.svg" alt="">Loreweave</div><button class="pill sm srch" data-act="search">${ic('search')}Search<span class="mono" style="margin-left:auto;font-size:11px">/</span></button>` + TABS.map(([p, l, i]) => `<a href="#${p}">${ic(i)}${l}</a>`).join('') + `<div class="foot">Unofficial fan project. Not endorsed by Riot Games. Art and data © Riot Games via Data Dragon ${DD.v}.</div>`;
}
function setNav(path) {
  const top = '/' + (path.split('/')[1] || '');
  const map = {'/c':'/champions', '/line':'/champions', '/region':'/atlas', '/place':'/atlas', '/event':'/codex', '/web':'/codex', '/read':'/champions', '/trail':'/'};
  const cur = map[top] || top;
  $$('#tabs a, #rail a').forEach(a => a.getAttribute('href') === '#' + cur ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
}
function renderNextStop(path) {
  const at = store.activeTrail; if (!at) return;
  const tr = TRAILS.find(t => t.id === at.id); if (!tr) return;
  const idx = tr.stops.findIndex(s => stopHref(s) === '#' + path);
  if (idx < 0) return;
  at.idx = idx; save();
  const nx = tr.stops[idx + 1];
  const b = document.createElement('a'); b.className = 'pill nextstop solid';
  if (nx) { b.href = stopHref(nx); b.innerHTML = `<span class="mono" style="font-size:12px;opacity:.6">${idx + 1}/${tr.stops.length}</span> Next: ${esc(stopLabel(nx))} ${ic('next')}`; }
  else { b.href = '#/you'; b.innerHTML = `Trail complete ${ic('spark')}`; b.onclick = () => { store.activeTrail = null; saveTrail(true); save(); toast('Trail complete · saved to You'); }; }
  document.body.appendChild(b);
}
const stopHref = s => { const [k, id] = s.split(':'); return k === 'c' ? `#/c/${id}` : k === 'r' ? `#/region/${id}` : `#/event/${id}`; };
const stopLabel = s => { const [k, id] = s.split(':'); return k === 'c' ? (C(id)?.name || id) : k === 'r' ? regionName(id) : (EVENTS.find(e => e.id === id)?.title || id); };

/* ---------- sheets / overlays ---------- */
function sheet(html, onMount) {
  closeSheet();
  const root = $('#sheet-root');
  root.innerHTML = `<div class="scrim" data-act="closesheet"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  onMount && onMount($('.sheet', root));
  const sh = $('.sheet', root); let y0 = null;
  sh.addEventListener('touchstart', e => { if (sh.scrollTop <= 0) y0 = e.touches[0].clientY; }, {passive:true});
  sh.addEventListener('touchmove', e => { if (y0 != null) { const d = e.touches[0].clientY - y0; if (d > 0) sh.style.transform = `translateY(${d}px)`; } }, {passive:true});
  sh.addEventListener('touchend', e => { if (y0 == null) return; const d = e.changedTouches[0].clientY - y0; y0 = null; if (d > 110) closeSheet(); else sh.style.transform = ''; });
}
function closeSheet() { $('#sheet-root').innerHTML = ''; }

/* search */
let searchIdx = null;
async function buildSearch() {
  const list = [];
  DD.list.forEach(c => list.push({g:'Champions', t:c.name, s:c.title, h:`#/c/${c.id}`, img:square(c.id)}));
  Object.entries(R).forEach(([k, r]) => { list.push({g:'Places', t:r.name, s:r.tag, h:`#/region/${k}`, emb:k}); r.landmarks.forEach((l, i) => list.push({g:'Places', t:l, s:r.name, h:`#/place/${k}/${i}`, emb:k})); });
  EVENTS.forEach(e => list.push({g:'Events', t:e.title, s:e.era, h:`#/event/${e.id}`, emb:e.regions[0]}));
  searchIdx = list;
  try { const full = await loadFull();
    Object.values(full).forEach(c => {
      c.skins.forEach(s => s.num && list.push({g:'Skins', t:s.name, s:c.name, h:`#/c/${c.id}?skin=${s.num}`, img:`${CDN}/img/champion/tiles/${c.id}_${s.num}.jpg`}));
      [c.passive, ...c.spells].forEach((s, i) => list.push({g:'Abilities', t:s.name, s:`${c.name} · ${i ? KEYS[i - 1] : 'Passive'}`, h:`#/c/${c.id}?ab=${i}`, img:i ? `${CDN}/${DD.v}/img/spell/${s.image.full}` : `${CDN}/${DD.v}/img/passive/${s.image.full}`}));
    });
  } catch (e) {}
}
function openSearch() {
  if ($('.search-ov')) return;
  const ov = document.createElement('div'); ov.className = 'search-ov'; ov.setAttribute('role', 'dialog');
  ov.innerHTML = `<div style="display:flex;gap:10px;align-items:center"><label class="searchbox" style="flex:1">${ic('search')}<input id="q" placeholder="Champions, skins, places, events, abilities" autocomplete="off" enterkeyhint="search"></label><button class="link" data-act="closesearch">Cancel</button></div><div class="sres" id="sres"></div>`;
  document.body.appendChild(ov);
  const q = $('#q', ov); q.focus();
  if (!searchIdx) buildSearch().then(() => q.dispatchEvent(new Event('input')));
  const recent = store.trail.slice(-6).reverse();
  const draw = () => {
    const v = q.value.trim().toLowerCase(), out = $('#sres', ov);
    if (!v) { out.innerHTML = recent.length ? `<h5>Recent</h5>` + recent.map(r => `<a href="#${r.p}">${r.t && !r.t.startsWith('#') ? `<img src="${r.t}" alt="">` : `<span class="e" style="background:var(--bg2)"></span>`}<div><b>${esc(r.l)}</b></div></a>`).join('') : '<p class="cap" style="margin-top:20px">Try “Zaun”, “Star Guardian”, or “Super Mega”.</p>'; return; }
    const hits = (searchIdx || []).filter(x => x.t.toLowerCase().includes(v) || x.s.toLowerCase().includes(v)).sort((a, b) => (b.t.toLowerCase().startsWith(v)) - (a.t.toLowerCase().startsWith(v)));
    const groups = {}; hits.forEach(h => (groups[h.g] ||= []).length < 6 && groups[h.g].push(h));
    out.innerHTML = Object.keys(groups).length ? ['Champions', 'Places', 'Events', 'Skins', 'Abilities'].filter(g => groups[g]).map(g => `<h5>${g}</h5>` + groups[g].map(h => `<a href="${h.h}">${h.img ? `<img src="${h.img}" alt="" loading="lazy">` : `<span class="e" style="display:grid;place-items:center;background:var(--bg2)">${emb(h.emb)}</span>`}<div><b>${esc(h.t)}</b><div class="cap">${esc(h.s)}</div></div></a>`).join('')).join('') : '<p class="empty">No matches</p>';
  };
  q.addEventListener('input', draw); draw();
}
function closeSearch() { $('.search-ov')?.remove(); }

/* ---------- E1 Explore ---------- */
route(/^\/$/, async () => {
  clearAura(); store.trail = []; save();
  const day = Math.floor(Date.now() / 864e5), tr = TRAILS[day % TRAILS.length];
  const [a, b] = tr.art;
  const conts = [...store.saved].reverse().slice(0, 3);
  view.innerHTML = `<div class="page wrap" style="padding-top:calc(20px + var(--sat))">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <div><div class="eyebrow">${new Date().toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'})}</div><h1 class="h-big" style="margin-top:6px">Explore</h1></div>
      <button class="round" data-act="search" aria-label="Search" style="box-shadow:none">${ic('search')}</button>
    </div>
    <a class="hero-rh card" href="#/trail/${tr.id}" aria-label="Today's rabbit hole: ${esc(tr.title)}">
      <img src="${loading(a)}" alt="Official loading art: ${esc(C(a).name)}"><img src="${loading(b)}" alt="Official loading art: ${esc(C(b).name)}" style="object-position:center 20%">
      <div class="shade"></div>
      <div class="in"><div class="eyebrow" style="color:var(--t2)">Today's rabbit hole · ${tr.stops.length} stops</div><h2>${esc(tr.hook)}</h2><span class="pill solid sm">${ic('play')}Begin</span></div>
    </a>
    ${conts.length ? `<section class="sec"><div class="sec-head"><h2 class="h-sec">Continue your trail</h2><a href="#/you">All</a></div><div class="hscroll">${conts.map(trailCard).join('')}</div></section>` : `<section class="sec"><div class="sec-head"><h2 class="h-sec">Curated trails</h2></div><div class="hscroll">${TRAILS.map(t => trailCard({title:t.title, stops:t.stops.filter(s => s[0] === 'c').map(s => ({t:square(s.slice(2))})), href:`#/trail/${t.id}`, n:t.stops.length})).join('')}</div></section>`}
    <section class="sec"><div class="sec-head"><h2 class="h-sec">Regions</h2><a href="#/atlas">Atlas</a></div>
      <div class="hscroll">${Object.entries(R).map(([k, r]) => `<a class="region-card" href="#/region/${k}">${emb(k)}<div><b>${r.name}</b><div class="cap">${champsIn(k).length} champions</div></div></a>`).join('')}</div></section>
    <section class="sec"><div class="sec-head"><h2 class="h-sec">Rivalries</h2><a href="#/web">Lore Web</a></div>
      <div class="hscroll">${RIVALRIES.filter(([x, y]) => C(x) && C(y)).map(([x, y]) => { const r = REL.find(e => (e[0] === x && e[1] === y) || (e[0] === y && e[1] === x)); return `<a class="card rival" href="#/c/${x}" data-champ="${x}"><img src="${loading(x)}" alt="" loading="lazy" style="object-position:center 18%"><img src="${loading(y)}" alt="" loading="lazy" style="object-position:center 18%"><div class="shade"></div><span class="vs"></span><div class="in"><b style="font:600 17px var(--sans)">${C(x).name} &amp; ${C(y).name}</b><span class="badge ${r[2]}">${r[2] === 'Sibling' ? 'Siblings' : r[2]}</span></div></a>`; }).join('')}</div></section>
    <section class="sec"><div class="sec-head"><div><h2 class="h-sec">New this patch</h2><div class="cap" style="margin-top:4px">Patch ${short(DD.v)} vs ${short(DD.versions[1])} · diffed from Data Dragon</div></div></div><div id="newpatch" class="rows"><div class="skel" style="height:180px;border-radius:12px"></div></div></section>
    ${legalFoot()}
  </div>`;
  newThisPatch();
});
const trailCard = t => `<a class="trailcard" href="${t.href || '#/you'}"><div class="faces">${t.stops.filter(s => s.t && !s.t.startsWith('#')).slice(0, 5).map(s => `<img src="${s.t}" alt="">`).join('')}</div><b style="font:600 17px/22px var(--sans)">${esc(t.title)}</b><div class="cap mono" style="margin-top:6px">Depth ${t.n || t.stops.length}</div></a>`;
async function newThisPatch() {
  const el = $('#newpatch'); if (!el) return;
  try {
    const prev = (await jget(`${CDN}/${DD.versions[1]}/data/en_US/champion.json`)).data;
    const rows = [];
    for (const c of DD.list) {
      const o = prev[c.id];
      if (!o) { rows.push({c, type:'rework', text:'New champion'}); continue; }
      const d = []; let b = 0, n = 0;
      for (const k in STATN) { const x = o.stats[k], y = c.stats[k]; if (x != null && y != null && Math.abs(x - y) > 1e-6) { d.push(`${STATN[k]} ${+x.toFixed(3)} → ${+y.toFixed(3)}`); y > x ? b++ : n++; } }
      if (d.length) rows.push({c, type: b && !n ? 'buff' : n && !b ? 'nerf' : 'neutral', text:d.join(' · ')});
    }
    el.innerHTML = rows.length ? rows.slice(0, 10).map(r => `<a href="#/c/${r.c.id}?tab=history" data-champ="${r.c.id}"><img class="ic" src="${square(r.c.id)}" alt=""><div style="flex:1;min-width:0"><b style="font:600 16px var(--sans)">${r.c.name}</b><div class="cap" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.text)}</div></div>${typeTag(r.type)}</a>`).join('') + `<p class="cap" style="margin-top:10px">Base-stat changes only. Ability number changes appear on each champion's History tab.</p>` : `<p class="cap">No base-stat changes between these patches in Data Dragon. Ability changes appear on each champion's History tab.</p>`;
  } catch (e) { el.innerHTML = '<p class="cap">Patch comparison unavailable offline.</p>'; }
}
const typeTag = t => { const m = {buff:['▲', 'Buff'], nerf:['▼', 'Nerf'], rework:['◆', 'Rework'], neutral:['●', 'Adjust'], skin:['✦', 'Skin']}[t] || ['·', '']; return `<span class="t c-${t === 'skin' ? 'neutral' : t}" style="font:600 11px var(--sans);letter-spacing:.08em;text-transform:uppercase;white-space:nowrap">${m[0]} ${m[1]}</span>`; };
const legalFoot = () => `<p class="legal sec" style="margin-bottom:24px">Loreweave isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>`;

/* ---------- C1 Champion index ---------- */
const idx = {q:'', region:'', role:'', diff:'', rel:'', sort:'name'};
route(/^\/champions$/, async () => {
  clearAura(); store.trail = []; save();
  const roles = ['Assassin', 'Fighter', 'Mage', 'Marksman', 'Support', 'Tank'];
  view.innerHTML = `<div class="page wrap" style="padding-top:calc(20px + var(--sat))">
    <div class="eyebrow">${DD.list.length} champions · patch ${short(DD.v)}</div><h1 class="h-big" style="margin:6px 0 20px">Champions</h1>
    <label class="searchbox">${ic('search')}<input id="cq" placeholder="Search by name or title" value="${esc(idx.q)}" autocomplete="off"></label>
    <div class="chips" style="margin:14px 0 20px">
      <select class="chip" id="f-region" aria-label="Region"><option value="">All regions</option>${Object.entries(R).map(([k, r]) => `<option value="${k}" ${idx.region === k ? 'selected' : ''}>${r.name}</option>`).join('')}<option value="runeterra" ${idx.region === 'runeterra' ? 'selected' : ''}>Runeterra (unaligned)</option></select>
      <select class="chip" id="f-role" aria-label="Class"><option value="">All classes</option>${roles.map(r => `<option ${idx.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select>
      <select class="chip" id="f-diff" aria-label="Difficulty"><option value="">Any difficulty</option><option value="1" ${idx.diff === '1' ? 'selected' : ''}>Easy (1–3)</option><option value="2" ${idx.diff === '2' ? 'selected' : ''}>Medium (4–7)</option><option value="3" ${idx.diff === '3' ? 'selected' : ''}>Hard (8–10)</option></select>
      <select class="chip" id="f-rel" aria-label="Relationship"><option value="">Any ties</option>${['Sibling', 'Rival', 'Ally', 'Mentor', 'Vendetta', 'Love'].map(r => `<option ${idx.rel === r ? 'selected' : ''}>${r}</option>`).join('')}</select>
      <select class="chip" id="f-sort" aria-label="Sort"><option value="name">Sort: Name</option><option value="win" ${idx.sort === 'win' ? 'selected' : ''}>Sort: Win rate (demo)</option><option value="diff" ${idx.sort === 'diff' ? 'selected' : ''}>Sort: Difficulty</option></select>
    </div>
    <div class="grid" id="cgrid"></div>${legalFoot()}</div>`;
  const draw = () => {
    const q = idx.q.toLowerCase();
    let l = DD.list.filter(c => (!q || c.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)) && (!idx.region || regionKey(c.id) === idx.region) && (!idx.role || c.tags.includes(idx.role)) && (!idx.rel || relsOf(c.id).some(r => r.type === idx.rel)) && (!idx.diff || Math.min(3, Math.ceil((c.info.difficulty || 1) / 3.4)) == idx.diff));
    if (idx.sort === 'win') l = l.slice().sort((a, b) => demoStats(b.id).win - demoStats(a.id).win);
    if (idx.sort === 'diff') l = l.slice().sort((a, b) => b.info.difficulty - a.info.difficulty);
    $('#cgrid').innerHTML = l.length ? l.map(c => `<a class="card pcard" href="#/c/${c.id}" data-champ="${c.id}" data-vt><img src="${loading(c.id)}" alt="Official loading art: ${esc(c.name)}" loading="lazy"><div class="shade"></div><span class="em">${emb(regionKey(c.id))}</span><div class="cap-in"><b>${esc(c.name)}</b><span>${esc(c.title)}</span>${idx.sort === 'win' ? `<span class="mono">${demoStats(c.id).win.toFixed(1)}% · demo</span>` : ''}</div></a>`).join('') : '<p class="empty" style="grid-column:1/-1">No champions match those filters.</p>';
  };
  $('#cq').oninput = e => { idx.q = e.target.value; draw(); };
  [['f-region', 'region'], ['f-role', 'role'], ['f-diff', 'diff'], ['f-rel', 'rel'], ['f-sort', 'sort']].forEach(([i, k]) => $('#' + i).onchange = e => { idx[k] = e.target.value; draw(); });
  draw();
});

/* ---------- Champion page ---------- */
const champState = {patch:0, chart:'balance'};
route(/^\/c\/([^?]+)(?:\?(.*))?$/, async (id, qs) => {
  const c = C(id); if (!c) throw new Error('unknown champion');
  const params = new URLSearchParams(qs || '');
  if (champState.id !== id) { champState.id = id; champState.patch = 0; champState.chart = 'balance'; champState.sel = null; }
  const ver = DD.versions[champState.patch];
  trackTrail(`/c/${id}`, c.name, square(id));
  extractAura(id).then(setAura);
  const rk = regionKey(id), reg = R[rk], st = demoStats(id, ver), rels = relsOf(id);
  const role = ROLE[c.tags[0]] || c.tags[0];
  view.innerHTML = `<div class="topbar"><button class="round" data-act="back" aria-label="Back">${ic('back')}</button></div>
  <div class="page">
  <section class="chero" id="hero">
    <div class="glow"></div>
    <div class="art" id="art"><img src="${splash(id)}" alt="Official splash art: ${esc(c.name)}" style="view-transition-name:hero"><img class="g" src="${splash(id)}" alt=""></div>
    <div class="fg wrap">
      <h1 class="cname${c.name.length > 9 ? ' long' : ''}" id="cname">${esc(c.name)}</h1>
      <div class="ctitle">${esc(c.title)}</div>
      <button class="patchsw" data-act="patch">${champState.patch ? 'Patch ' + short(ver) : 'Current patch'} ${ic('updown')}</button>
      <div class="hstats"><div class="hstat"><b>${st.win.toFixed(1)}</b><span>WIN %</span></div><div class="hstat"><b>${st.pick.toFixed(1)}</b><span>PICK %</span></div></div>
      <div class="stack">
        <div class="srow">${ic('ban')}<div><b>${st.ban.toFixed(1)}</b><span>Ban %</span></div></div>
        <div class="srow">${ic('role')}<div><b>${esc(role.split(' ')[0])}</b><span>Role</span></div></div>
        <div class="srow">${ic('diff')}<div><div class="pips">${[1, 2, 3].map(i => `<i class="${i <= Math.ceil((c.info.difficulty || 1) / 3.4) ? 'on' : ''}"></i>`).join('')}</div><span>Difficulty · ${c.info.difficulty}/10</span></div></div>
        <div class="srow">${ic('skins')}<div><b id="skincount">–</b><span>Skins</span></div></div>
      </div>
      <div class="hero-foot"><span class="demo">Win/pick/ban: demo data</span><button class="pill" data-act="timeline">${ic('chart')}Timeline</button></div>
    </div>
  </section>
  <div class="wrap">
    <div class="sec-head" style="margin:8px 0 6px"><div class="seg" role="group" aria-label="Chart"><button aria-pressed="${champState.chart === 'balance'}" data-chart="balance">Balance</button><button aria-pressed="${champState.chart === 'win'}" data-chart="win">Win rate</button></div><span class="cap mono">Last 24 patches</span></div>
    <div id="chart"><div class="skel" style="height:150px;border-radius:12px"></div></div>
    <div id="tipbox"></div>
    <div class="sec" style="margin-top:28px">
      <a class="irow" href="#/region/${rk}"><span class="lead">${emb(rk, 'currentColor')}</span><div><b>${regionName(rk)}</b><span>Region</span></div>${ic('chev').replace('<svg', '<svg class="chev"')}</a>
      <div class="irow"><span class="lead">${ic('species')}</span><div><b>${esc(c.tags.join(' · '))}</b><span>Class</span></div></div>
      <div class="irow"><span class="lead">${ic('role')}</span><div><b>${esc(role)}</b><span>Primary position (by class)</span></div></div>
      <div class="irow"><span class="lead">${ic('drop')}</span><div><b>${esc(c.partype || 'None')}</b><span>Resource</span></div></div>
      ${rels.length ? `<a class="irow" href="#/web/${id}"><span class="lead"><span class="duo">${rels.slice(0, 2).map(r => `<img src="${square(r.other)}" alt="">`).join('')}</span></span><div><b>${rels.slice(0, 2).map(r => esc(C(r.other).name)).join(', ')}</b><span>Relationships</span></div>${ic('chev').replace('<svg', '<svg class="chev"')}</a>` : ''}
    </div>
  </div>
  <nav class="stabs" id="stabs"><b class="st-name">${esc(c.name)}</b><div class="stabs-in" id="stabs-in">${['Overview', 'Lore', 'Kit', 'Skins', 'Web', 'History', 'Stats', 'Builds'].map(t => `<button data-sec="${t.toLowerCase()}">${t}</button>`).join('')}</div></nav>
  <div class="wrap" id="secs"><div class="skel" style="height:400px;border-radius:12px;margin-top:24px"></div></div>
  </div>`;
  const d = await detail(id, ver).catch(() => detail(id));
  if (champState.id !== id) return;
  $('#skincount').textContent = d.skins.length;
  renderSections(c, d, rk, rels, ver);
  drawChart(id);
  if (params.get('tab')) setTimeout(() => scrollToSec(params.get('tab')), 150);
  if (params.get('skin')) { const i = d.skins.findIndex(s => s.num == params.get('skin')); if (i >= 0) skinViewer(d, i); }
  if (params.get('ab')) abilitySheet(d, +params.get('ab'));
});

function renderSections(c, d, rk, rels, ver) {
  const id = c.id, lore = d.lore || c.blurb;
  const sentences = (c.blurb.match(/[^.!?]+[.!?]+/g) || [c.blurb]).slice(0, 2).join(' ');
  const evs = EVENTS.filter(e => e.champs.includes(id) || (e.regions.includes(rk) && e.champs.length));
  const myEvents = evs.filter(e => e.champs.includes(id)), regEvents = evs.filter(e => !e.champs.includes(id)).slice(0, 3);
  const sib = rels.find(r => r.type === 'Sibling' || r.type === 'Family'), riv = rels.find(r => ['Rival', 'Vendetta'].includes(r.type));
  const lines = [...new Set(d.skins.filter(s => s.num).map(s => skinLine(s.name, c.name)).filter(Boolean))];
  const spells = [d.passive, ...d.spells];
  const universe = `https://universe.leagueoflegends.com/en_US/champion/${id.toLowerCase()}/`;
  $('#secs').innerHTML = `
  <section class="sec" id="s-overview"><h2 class="h-sec">In one breath</h2>
    <p style="font:500 20px/30px var(--sans);color:var(--t1);margin:14px 0 6px;text-wrap:pretty">${esc(sentences)}</p><p class="cap">Official blurb · Data Dragon</p>
    <div class="facts" style="margin-top:20px">
      <div><span class="cap">Region</span><b>${regionName(rk)}</b></div><div><span class="cap">Class</span><b>${esc(c.tags.join(', '))}</b></div>
      <div><span class="cap">Known ties</span><b>${rels.length || '—'}</b></div><div><span class="cap">Skins</span><b>${d.skins.length - 1}</b></div>
      <div><span class="cap">Attack · Defense · Magic</span><b class="mono" style="font-size:15px">${c.info.attack} · ${c.info.defense} · ${c.info.magic}</b></div><div><span class="cap">Meta tier</span><b>${demoStats(id).tier} <span class="cap">demo</span></b></div>
    </div>
    <div class="eyebrow" style="margin:24px 0 10px">Start here</div>
    <div class="chips">${sib ? `<a class="chip" href="#/c/${sib.other}">${sib.type === 'Sibling' ? 'Their sibling' : 'Their family'}: ${esc(C(sib.other).name)}</a>` : ''}<a class="chip" href="#/region/${rk}">Their home: ${regionName(rk)}</a>${riv ? `<a class="chip" href="#/c/${riv.other}">Biggest rival: ${esc(C(riv.other).name)}</a>` : ''}<a class="chip" href="#/read/${id}">Read the biography</a></div>
  </section>
  <section class="sec" id="s-lore"><h2 class="h-sec">Lore</h2>
    <div class="panel" style="margin-top:16px"><div class="eyebrow">Biography</div><p style="margin:10px 0 14px;color:var(--t2)">${esc(lore.length > 420 ? lore.slice(0, lore.lastIndexOf(' ', 420)) + '…' : lore)}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="pill sm" href="#/read/${id}">${ic('book')}Reader mode</a><a class="pill sm" href="${universe}" target="_blank" rel="noopener">Read the official biography ↗</a></div>
      <p class="cap" style="margin:12px 0 0">Biography text © Riot Games, served by Data Dragon.</p></div>
    <h3 style="font:600 20px var(--disp);margin:32px 0 6px">Lore Timeline</h3><p class="cap" style="margin:0 0 16px">Curated sample data · approximate eras</p>
    ${myEvents.length + regEvents.length ? `<div class="tl">${[...myEvents, ...regEvents].map(e => `<div class="node"><a class="panel" style="display:block;padding:14px 16px" href="#/event/${e.id}"><span class="era">${e.era}${e.champs.includes(id) ? '' : ' · ' + regionName(e.regions[0])}</span><h4>${esc(e.title)}</h4><p class="cap" style="margin:0 0 8px;color:var(--t2)">${esc(e.summary)}</p></a><div style="margin-top:6px">${e.champs.filter(x => x !== id).slice(0, 4).map(cchip).join('')}</div></div>`).join('')}</div>` : `<p class="sub">No curated events yet. Explore ${regionName(rk)}'s history instead.</p><a class="pill sm" href="#/region/${rk}">Open ${regionName(rk)}</a>`}
    <h3 style="font:600 20px var(--disp);margin:32px 0 12px">Stories</h3>
    <a class="panel" style="display:flex;gap:14px;align-items:center" href="${universe}" target="_blank" rel="noopener"><img src="${loading(id)}" alt="" style="width:56px;height:84px;border-radius:8px;object-fit:cover"><div><b>${esc(c.name)} on the official Universe site</b><div class="cap" style="margin-top:4px">Short stories, comics and color stories open on Riot's own pages.</div></div></a>
    <h3 style="font:600 20px var(--disp);margin:32px 0 12px">Canon notes</h3>
    <div class="two" style="display:grid;gap:10px"><div class="panel"><div class="eyebrow">Game lore</div><p class="cap" style="color:var(--t2);margin:8px 0 0">The biography above is the current game canon.</p></div><div class="panel"><div class="eyebrow">Other media</div><p class="cap" style="color:var(--t2);margin:8px 0 0">${['Jinx', 'Vi', 'Caitlyn', 'Jayce', 'Viktor', 'Ekko', 'Heimerdinger', 'Singed', 'Warwick', 'Mel', 'Ambessa'].includes(id) ? 'The animated series tells its own continuity; some relationships and events differ from game lore.' : 'No major differences tracked yet.'}</p></div></div>
  </section>
  <section class="sec" id="s-kit"><h2 class="h-sec">Kit</h2><p class="cap" style="margin:6px 0 16px">Official ability data · patch ${short(ver)} · tap for details</p>
    ${spells.map((s, i) => `<button class="ab" data-ab="${i}"><img src="${CDN}/${ver}/img/${i ? 'spell' : 'passive'}/${s.image.full}" alt="${esc(s.name)} ability icon"><div style="min-width:0"><div class="key">${i ? KEYS[i - 1] : 'PASSIVE'}</div><h4>${esc(s.name)}</h4><p>${esc(strip(s.description)).slice(0, 220)}${strip(s.description).length > 220 ? '…' : ''}</p>${i ? `<div class="nums"><span>CD ${esc(s.cooldownBurn)}s</span>${s.costBurn && s.costBurn !== '0' ? `<span>Cost ${esc(s.costBurn)}</span>` : ''}${s.rangeBurn && +nums(s.rangeBurn)[0] < 25000 ? `<span>Range ${esc(s.rangeBurn)}</span>` : ''}</div>` : ''}</div></button>`).join('')}
    <h3 style="font:600 20px var(--disp);margin:28px 0 8px">Base stats</h3>
    <table class="st"><thead><tr><th>Stat</th><th>Level 1</th><th>Per level</th><th>Level 18</th></tr></thead><tbody>${[['Health', 'hp', 'hpperlevel'], [d.partype || 'Resource', 'mp', 'mpperlevel'], ['Attack damage', 'attackdamage', 'attackdamageperlevel'], ['Armor', 'armor', 'armorperlevel'], ['Magic resist', 'spellblock', 'spellblockperlevel'], ['Health regen', 'hpregen', 'hpregenperlevel']].map(([n, b, g]) => `<tr><td>${esc(n)}</td><td>${+d.stats[b].toFixed(2)}</td><td>+${+d.stats[g].toFixed(2)}</td><td>${+(d.stats[b] + d.stats[g] * 17).toFixed(1)}</td></tr>`).join('')}<tr><td>Attack speed</td><td>${d.stats.attackspeed}</td><td>+${d.stats.attackspeedperlevel}%</td><td>—</td></tr><tr><td>Move speed</td><td>${d.stats.movespeed}</td><td>—</td><td>—</td></tr><tr><td>Attack range</td><td>${d.stats.attackrange}</td><td>—</td><td>—</td></tr></tbody></table>
  </section>
  <section class="sec" id="s-skins"><div class="sec-head"><h2 class="h-sec">Skins</h2><span class="cap">${d.skins.length} incl. default</span></div>
    <div class="carousel" id="car">${d.skins.map((s, i) => `<button class="card skin" data-skin="${i}" aria-label="View ${esc(s.name === 'default' ? c.name : s.name)}"><img src="${splash(id, s.num)}" alt="Official splash art: ${esc(s.name === 'default' ? c.name : s.name)}" loading="lazy"><div class="shade"></div><div class="cap-in" style="text-align:left"><b style="font:600 20px var(--disp)">${esc(s.name === 'default' ? c.name : s.name)}</b><div class="cap">${s.num ? esc(skinLine(s.name, c.name) || 'Standalone') : 'Original'}${s.chromaList?.length ? ` · ${s.chromaList.length} chromas` : ''}</div></div></button>`).join('')}</div>
    <div class="dots" id="dots">${d.skins.slice(0, 20).map((s, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
    <div class="chips" style="margin-top:20px" id="sfilt"><button class="chip" aria-pressed="true" data-line="">All</button><button class="chip" aria-pressed="false" data-line="__chroma">Has chromas</button><button class="chip" aria-pressed="false" data-line="__wish">Wishlist</button>${lines.map(l => `<button class="chip" aria-pressed="false" data-line="${esc(l)}">${esc(l)}</button>`).join('')}</div>
    <div class="sgrid" id="sgrid"></div>
    ${lines.length ? `<div class="eyebrow" style="margin:24px 0 10px">Same skin line</div><div class="chips">${lines.slice(0, 8).map(l => `<a class="chip" href="#/line/${encodeURIComponent(l)}">${esc(l)} →</a>`).join('')}</div>` : ''}
    <p class="cap" style="margin-top:12px">Owned skins need Riot Sign On (not connected). Wishlist is saved on this device.</p>
  </section>
  <section class="sec" id="s-web"><div class="sec-head"><h2 class="h-sec">Web</h2><a href="#/web/${id}">Full Lore Web</a></div>
    ${rels.length ? `<div class="webwrap" style="aspect-ratio:1/0.8;max-height:460px" id="egoweb"></div><div style="margin-top:8px">${rels.map(r => `<a class="relrow" href="#/c/${r.other}" data-champ="${r.other}"><img src="${square(r.other)}" alt=""><div><b>${esc(C(r.other).name)}</b> <span class="badge ${r.type}">${r.type}</span><p>${esc(r.note)}</p></div></a>`).join('')}</div><p class="cap" style="margin-top:10px">Curated sample data, summarized in original words. Source: official biographies on the Universe site.</p>` : `<p class="sub">No curated relationships yet for ${esc(c.name)}.</p>`}
  </section>
  <section class="sec" id="s-history"><h2 class="h-sec">History</h2><p class="cap" style="margin:6px 0 16px">Real changes found by comparing Data Dragon files across the last 24 patches: base stats, cooldowns, costs, ranges, ability text and new skins. Damage-number changes inside tooltips aren't captured.</p><div id="hist"><div class="skel" style="height:200px;border-radius:12px"></div></div></section>
  <section class="sec" id="s-stats"><div class="sec-head"><h2 class="h-sec">Stats</h2><span class="demo">Demo data</span></div><div id="statsbox"></div></section>
  <section class="sec" id="s-builds"><div class="sec-head"><h2 class="h-sec">Builds</h2><span class="demo">Demo rates</span></div><div id="buildbox"><div class="skel" style="height:160px;border-radius:12px"></div></div></section>
  <section class="sec"><h2 class="h-sec" style="margin-bottom:16px">Keep exploring</h2><div class="three" style="display:grid;gap:12px">${keepExploring(id, rk, rels)}</div></section>
  ${legalFoot()}`;
  // skins
  const sg = $('#sgrid'), drawSkins = (line) => { const wl = store.wish; const list = d.skins.map((s, i) => ({s, i})).filter(({s}) => !line || (line === '__chroma' ? s.chromaList?.length : line === '__wish' ? wl.includes(id + '_' + s.num) : skinLine(s.name, c.name) === line)); sg.innerHTML = list.length ? list.map(({s, i}) => `<div class="card" style="aspect-ratio:1"><button data-skin="${i}" style="display:block;width:100%;height:100%" aria-label="${esc(s.name)}"><img src="${CDN}/img/champion/tiles/${id}_${s.num}.jpg" alt="Official art: ${esc(s.name === 'default' ? c.name : s.name)}" loading="lazy"></button><button class="heart${wl.includes(id + '_' + s.num) ? ' on' : ''}" data-wish="${id}_${s.num}" aria-label="Wishlist">${ic('heart', wl.includes(id + '_' + s.num) ? 'fill' : '')}</button></div>`).join('') : '<p class="cap" style="grid-column:1/-1">Nothing here yet.</p>'; };
  drawSkins(''); $('#sfilt').onclick = e => { const b = e.target.closest('[data-line]'); if (!b) return; $$('#sfilt .chip').forEach(x => x.setAttribute('aria-pressed', x === b)); drawSkins(b.dataset.line); };
  sg.addEventListener('click', e => { const w = e.target.closest('[data-wish]'); if (w) { e.stopPropagation(); const k = w.dataset.wish, i = store.wish.indexOf(k); i >= 0 ? store.wish.splice(i, 1) : store.wish.push(k); save(); toast(i >= 0 ? 'Removed from wishlist' : 'Added to wishlist'); drawSkins($('#sfilt [aria-pressed=true]').dataset.line); } });
  const car = $('#car'); car.addEventListener('scroll', () => { const i = Math.round(car.scrollLeft / car.firstElementChild.offsetWidth); $$('#dots i').forEach((x, j) => x.classList.toggle('on', j === Math.min(i, 19))); }, {passive:true});
  view.querySelectorAll('[data-skin]').forEach(b => b.onclick = () => skinViewer(d, +b.dataset.skin));
  view.querySelectorAll('[data-ab]').forEach(b => b.onclick = () => abilitySheet(d, +b.dataset.ab));
  if (rels.length) egoWeb($('#egoweb'), id, rels);
  history(id).then(h => drawHistory(h, d)).catch(() => $('#hist').innerHTML = '<p class="cap">History unavailable offline.</p>');
  drawStats(id); drawBuilds(c);
  setupChampScroll();
}
const skinLine = (name, champ) => { if (name === 'default') return ''; let l = name.replace(champ, '').replace(/\s+/g, ' ').trim(); if (l === name) l = name.split(' ').slice(0, -1).join(' '); return l.replace(/^(Prestige|Mythic)\s+/, '').trim(); };
function keepExploring(id, rk, rels) {
  const picks = [];
  rels.slice(0, 2).forEach(r => picks.push({h:`#/c/${r.other}`, img:splash(r.other), t:C(r.other).name, s:`${r.type} of ${C(id).name}`}));
  picks.push({h:`#/region/${rk}`, img:splash((champsIn(rk).find(x => x.id !== id) || C(id)).id), t:regionName(rk), s:'Their home region'});
  const same = champsIn(rk).filter(x => x.id !== id && !rels.find(r => r.other === x.id));
  if (same.length) { const s = same[hash(id) % same.length]; picks.push({h:`#/c/${s.id}`, img:splash(s.id), t:s.name, s:`Also from ${regionName(rk)}`}); }
  return picks.slice(0, 3).map(p => `<a class="card" href="${p.h}" style="aspect-ratio:16/9"><img src="${p.img}" alt="" loading="lazy"><div class="shade"></div><div class="cap-in"><b style="font:600 17px var(--sans)">${esc(p.t)}</b><div class="cap">${esc(p.s)}</div></div></a>`).join('');
}

async function drawChart(id) {
  const el = $('#chart'); if (!el) return;
  if (champState.chart === 'win') {
    const vs = DD.versions.slice(0, 24).reverse(), pts = vs.map(v => demoStats(id, v).win), mn = Math.min(...pts) - .5, mx = Math.max(...pts) + .5;
    const W = 600, H = 130, xy = pts.map((p, i) => [i * (W / 23), H - (p - mn) / (mx - mn) * H]);
    el.innerHTML = `<svg viewBox="-6 -6 ${W + 12} ${H + 30}" style="width:100%;height:160px" role="img" aria-label="Win rate by patch, demo data"><path d="M${xy.map(p => p.join(',')).join('L')}" fill="none" stroke="var(--a1)" stroke-width="2.5" stroke-linejoin="round"/>${xy.map((p, i) => i % 4 === 3 || i === 23 ? `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="var(--a1)"/><text x="${p[0]}" y="${H + 22}" text-anchor="middle" style="font:500 11px var(--mono);fill:var(--t3)">${short(vs[i])}</text>` : '').join('')}</svg><div class="legend"><span class="demo">Demo data · requires Riot API key</span></div>`;
    return;
  }
  const h = await history(id).catch(() => null); if (!h || !$('#chart')) return;
  const rows = h.slice().reverse(), mx = Math.max(3, ...rows.map(r => r.mag));
  el.innerHTML = `<div class="chart" role="list" aria-label="Balance changes by patch">${rows.map((r, i) => { const t = r.type; const has = t !== 'none' && t !== 'skin'; return `<button class="bar${champState.sel === r.patch ? ' sel' : ''}" role="listitem" data-patch="${r.patch}" aria-label="Patch ${r.patch}: ${has ? t : 'no gameplay change'}">${has ? `<i class="bg-${t}" style="height:${18 + r.mag / mx * 82}%;animation-delay:${i * 20}ms"></i>` : '<i class="dot"></i>'}<span>${i % 3 === 0 || i === 23 ? r.patch : ''}</span></button>`; }).join('')}</div>
  <div class="legend"><span><i class="bg-buff"></i>▲ Buff</span><span><i class="bg-nerf"></i>▼ Nerf</span><span><i class="bg-rework"></i>◆ Rework</span><span><i class="bg-neutral"></i>● Adjust</span><span>· No change</span></div>`;
  $$('.bar', el).forEach(b => b.onclick = () => { champState.sel = b.dataset.patch; $$('.bar', el).forEach(x => x.classList.toggle('sel', x === b)); const r = h.find(x => x.patch === b.dataset.patch);
    $('#tipbox').innerHTML = `<div class="tip"><div style="display:flex;justify-content:space-between;align-items:center"><b class="mono">Patch ${r.patch}</b>${typeTag(r.type === 'none' ? 'neutral' : r.type)}</div><p style="margin:6px 0 10px;color:var(--t2);font-size:15px">${r.changes.length ? esc(r.changes[0].text) + (r.changes.length > 1 ? ` <span class="cap">+${r.changes.length - 1} more</span>` : '') : 'No changes detected in Data Dragon.'}</p>${r.changes.length ? `<button class="link link-a" data-openpatch="${r.patch}">Open patch →</button>` : ''}</div>`;
    $('[data-openpatch]')?.addEventListener('click', () => openPatch(id, r)); });
}
function openPatch(id, r) {
  const sp = DD.versions.slice(0, 24).map(v => demoStats(id, v).win).slice(0, 6).reverse();
  sheet(`<div class="eyebrow">${esc(C(id).name)}</div><h2 class="h-sec" style="margin:4px 0 6px">Patch ${r.patch}</h2>${typeTag(r.type)}
  <div class="hist" style="margin-top:16px">${r.changes.map(c => `<div style="grid-template-columns:70px 1fr"><span class="t c-${c.kind === 'skin' ? 'neutral' : c.kind}">${typeTag(c.kind)}</span><span>${esc(c.text)}</span></div>`).join('')}</div>
  <div class="eyebrow" style="margin:20px 0 8px">Win rate since (demo)</div>${sparkline(sp)}
  <p class="cap">Changes: diffed from Data Dragon ${r.v} vs the previous patch. Win rates are simulated.</p>`);
}
const sparkline = (pts, w = 300, h = 36) => { const mn = Math.min(...pts), mx = Math.max(...pts) || 1, xy = pts.map((p, i) => `${(i / (pts.length - 1)) * w},${h - 4 - ((p - mn) / ((mx - mn) || 1)) * (h - 8)}`); return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${xy.join(' ')}" fill="none" stroke="var(--a1)" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`; };
function drawHistory(h, d) {
  const el = $('#hist'); if (!el) return;
  const rows = h.filter(r => r.changes.length);
  el.innerHTML = rows.length ? `<div class="hist">${rows.map(r => `<div><span class="p">${r.patch}</span><div>${typeTag(r.type)}<ul style="margin:6px 0 0;padding-left:18px;color:var(--t2);font-size:15px;line-height:22px">${r.changes.map(c => `<li><span class="c-${c.kind === 'skin' ? 'neutral' : c.kind}" aria-hidden="true">${{buff:'▲', nerf:'▼', rework:'◆', neutral:'●', skin:'✦'}[c.kind]}</span> ${esc(c.text)}</li>`).join('')}</ul></div></div>`).join('')}</div>` : '<p class="sub">No changes detected in Data Dragon over the last 24 patches.</p>';
}
function drawStats(id) {
  const tiers = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master+'];
  const r = rng(id + 'stats'), st = demoStats(id);
  const sameRole = DD.list.filter(x => x.id !== id && x.tags[0] === C(id).tags[0]);
  const mus = sameRole.map(x => ({x, w:44 + r() * 12, n:Math.round(800 + r() * 9000)})).sort((a, b) => b.w - a.w);
  const sp = DD.versions.slice(0, 12).reverse().map(v => demoStats(id, v).win);
  $('#statsbox').innerHTML = `<div class="statgrid"><div><span class="cap">Win</span><b>${st.win.toFixed(1)}%</b></div><div><span class="cap">Pick</span><b>${st.pick.toFixed(1)}%</b></div><div><span class="cap">Ban</span><b>${st.ban.toFixed(1)}%</b></div></div>
  <div class="panel" style="margin-top:12px"><div style="display:flex;justify-content:space-between"><span class="cap">Win rate · last 12 patches</span><span class="cap mono">${sp.at(-1).toFixed(1)}%</span></div>${sparkline(sp)}</div>
  <h3 style="font:600 17px var(--sans);margin:24px 0 8px">By rank tier</h3>${tiers.map((t, i) => { const w = st.win - 1.5 + i * .35 + (r() - .5); return `<div class="mrow"><span style="width:84px" class="cap">${t}</span><div class="meter"><i style="width:${(w - 40) / 20 * 100}%"></i></div><span class="mono" style="width:56px;text-align:right;font-size:14px">${w.toFixed(1)}%</span></div>`; }).join('')}
  <div class="two" style="margin-top:24px"><div><h3 style="font:600 17px var(--sans);margin:0 0 8px">Best matchups</h3>${mus.slice(0, 3).map(m => `<a class="mrow" href="#/c/${m.x.id}"><img src="${square(m.x.id)}" alt=""><span style="flex:1">${m.x.name}</span><span class="mono c-buff" style="font-size:14px">${m.w.toFixed(1)}%</span><span class="cap mono">n=${m.n.toLocaleString()}</span></a>`).join('')}</div><div><h3 style="font:600 17px var(--sans);margin:20px 0 8px">Worst matchups</h3>${mus.slice(-3).reverse().map(m => `<a class="mrow" href="#/c/${m.x.id}"><img src="${square(m.x.id)}" alt=""><span style="flex:1">${m.x.name}</span><span class="mono c-nerf" style="font-size:14px">${m.w.toFixed(1)}%</span><span class="cap mono">n=${m.n.toLocaleString()}</span></a>`).join('')}</div></div>
  <p class="cap" style="margin-top:12px">Sample ${st.games.toLocaleString()} games (simulated) · ${new Date().toLocaleDateString()} · minimum 800 games per matchup. Live stats need a Riot API production key, which this build doesn't have.</p>`;
}
async function drawBuilds(c) {
  try {
    const [items, runes] = await Promise.all([loadItems(), loadRunes()]);
    const r = rng(c.id + 'build');
    const want = {Marksman:['Damage', 'CriticalStrike', 'AttackSpeed'], Mage:['SpellDamage', 'Mana', 'AbilityHaste'], Assassin:['Damage', 'ArmorPenetration', 'Lethality'], Fighter:['Damage', 'Health', 'AbilityHaste'], Tank:['Health', 'Armor', 'SpellBlock'], Support:['ManaRegen', 'Health', 'AbilityHaste']}[c.tags[0]] || ['Damage'];
    const pool = Object.entries(items).filter(([k, i]) => i.gold?.purchasable && i.gold.total >= 2500 && i.maps?.['11'] && !i.requiredChampion && !i.into?.length && i.tags?.some(t => want.includes(t)) && !i.requiredAlly);
    const pick = pool.sort(() => r() - .5).slice(0, 6);
    const tree = runes[{Marksman:0, Assassin:1, Mage:2, Fighter:3, Tank:3, Support:4}[c.tags[0]] ?? 0] || runes[0];
    const ks = tree.slots[0].runes.slice().sort(() => r() - .5);
    $('#buildbox').innerHTML = `<div class="eyebrow" style="margin-bottom:10px">Keystone · ${esc(tree.name)}</div>${ks.slice(0, 3).map((k, i) => `<div class="mrow"><img src="${CDN}/img/${k.icon}" alt="" style="border-radius:50%;background:var(--bg2)"><span style="flex:1">${esc(k.name)}</span><span class="mono cap">${(62 - i * 21 + r() * 6).toFixed(0)}% pick</span><span class="mono" style="font-size:14px;width:56px;text-align:right">${(49 + r() * 5).toFixed(1)}%</span></div>`).join('')}
    <div class="eyebrow" style="margin:20px 0 10px">Core items</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">${pick.map(([k, i]) => `<div class="panel" style="padding:12px;text-align:center"><img src="${CDN}/${DD.v}/img/item/${k}.png" alt="" style="width:44px;height:44px;border-radius:8px;margin:0 auto 8px"><div style="font:500 13px/17px var(--sans)">${esc(i.name)}</div><div class="cap mono">${i.gold.total}g</div></div>`).join('')}</div>
    <div class="eyebrow" style="margin:20px 0 10px">Skill order</div>${['Q', 'W', 'E'].sort(() => r() - .5).map((k, i) => `<div class="mrow"><span class="mono" style="width:28px;color:var(--a1)">${k}</span><div class="meter"><i style="width:${90 - i * 28}%"></i></div><span class="cap mono">max ${i + 1}</span></div>`).join('')}
    <p class="cap" style="margin-top:12px">Item, rune and icon names are real (Data Dragon ${short(DD.v)}). Which ones are “most played” and their rates are simulated.</p>`;
  } catch (e) { $('#buildbox').innerHTML = '<p class="cap">Builds unavailable offline.</p>'; }
}
function egoWeb(el, id, rels) {
  const W = 400, H = 320, cx = W / 2, cy = H / 2, R0 = 118;
  const nodes = rels.map((r, i) => { const a = -Math.PI / 2 + i / rels.length * Math.PI * 2; return {...r, x:cx + Math.cos(a) * R0 * 1.25, y:cy + Math.sin(a) * R0}; });
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Relationship web for ${esc(C(id).name)}"><defs><clipPath id="cc"><circle r="1"/></clipPath>${[id, ...rels.map(r => r.other)].map(x => `<pattern id="p-${x}" width="1" height="1" patternContentUnits="objectBoundingBox"><image href="${square(x)}" width="1" height="1"/></pattern>`).join('')}</defs>
  ${nodes.map(n => `<line class="edge" x1="${cx}" y1="${cy}" x2="${n.x}" y2="${n.y}"/><text x="${(cx + n.x) / 2}" y="${(cy + n.y) / 2 - 4}" text-anchor="middle" style="font:600 9px var(--sans);letter-spacing:.08em;fill:var(--t3)">${n.type.toUpperCase()}</text>`).join('')}
  <circle cx="${cx}" cy="${cy}" r="40" fill="url(#p-${id})" stroke="var(--a1)" stroke-width="2.5"/>
  ${nodes.map(n => `<g class="wn" data-o="${n.other}" style="cursor:pointer"><circle cx="${n.x}" cy="${n.y}" r="26" fill="url(#p-${n.other})" stroke="var(--b2)" stroke-width="1.5"/><text x="${n.x}" y="${n.y + 42}" text-anchor="middle">${esc(C(n.other).name)}</text></g>`).join('')}</svg>`;
  $$('.wn', el).forEach(g => g.onclick = () => { const n = nodes.find(x => x.other === g.dataset.o); sheet(`<div style="display:flex;gap:14px;align-items:center"><img src="${square(n.other)}" alt="" style="width:56px;height:56px;border-radius:50%"><div><span class="badge ${n.type}">${n.type}</span><h3 style="font:600 22px var(--disp);margin-top:6px">${esc(C(n.other).name)}</h3></div></div><p class="sub" style="margin:16px 0">${esc(n.note)}</p><a class="pill solid" href="#/c/${n.other}" style="width:100%;justify-content:center">Open page ${ic('next')}</a><p class="cap" style="margin-top:12px">Curated sample data.</p>`); });
}
function skinViewer(d, i) {
  const c = C(d.id); let z = 1;
  const v = document.createElement('div'); v.className = 'viewer'; v.setAttribute('role', 'dialog');
  const draw = () => { const s = d.skins[i], nm = s.name === 'default' ? c.name : s.name, line = skinLine(s.name, c.name);
    v.innerHTML = `<button class="round close" data-x aria-label="Close">${ic('close')}</button><button class="round navb" style="left:12px" data-p aria-label="Previous skin">${ic('back')}</button><button class="round navb" style="right:12px" data-n aria-label="Next skin">${ic('chev')}</button>
    <div class="img"><img src="${splash(d.id, s.num)}" alt="Official splash art: ${esc(nm)}" style="transform:scale(${z})"></div>
    <div class="bar2"><div class="cap mono">${i + 1} / ${d.skins.length}</div><h2 style="font:600 28px var(--disp);margin:4px 0">${esc(nm)}</h2><div class="cap">${s.num ? esc(line || 'Standalone') : 'Original'}${s.chromaList?.length ? ` · ${s.chromaList.length} chromas` : ''}</div>${s.chromaList?.length ? `<div class="chips" style="margin-top:10px">${s.chromaList.map(n => `<span class="chip" style="height:28px;line-height:26px;font-size:12px">${esc(n)}</span>`).join('')}</div>` : ''}<div class="cap" style="margin-top:6px">Release date and artist credit aren't in Data Dragon.</div>
    ${line ? `<a class="pill sm" style="margin-top:12px" href="#/line/${encodeURIComponent(line)}">Others in this line →</a>` : ''}</div>`; };
  draw(); document.body.appendChild(v);
  const close = () => { v.remove(); document.removeEventListener('keydown', key); };
  const key = e => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') { i = (i + 1) % d.skins.length; z = 1; draw(); } if (e.key === 'ArrowLeft') { i = (i - 1 + d.skins.length) % d.skins.length; z = 1; draw(); } };
  document.addEventListener('keydown', key);
  v.addEventListener('click', e => { if (e.target.closest('[data-x]')) close(); else if (e.target.closest('[data-n]')) { i = (i + 1) % d.skins.length; z = 1; draw(); } else if (e.target.closest('[data-p]')) { i = (i - 1 + d.skins.length) % d.skins.length; z = 1; draw(); } else if (e.target.closest('a')) close(); else if (e.target.tagName === 'IMG') { z = z > 1 ? 1 : 2; $('.img img', v).style.transform = `scale(${z})`; } });
  let sx = null, pd = null;
  v.addEventListener('touchstart', e => { if (e.touches.length === 2) pd = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); else sx = e.touches[0].clientX; }, {passive:true});
  v.addEventListener('touchmove', e => { if (e.touches.length === 2 && pd) { const nd = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); z = Math.max(1, Math.min(4, z * nd / pd)); pd = nd; $('.img img', v).style.transform = `scale(${z})`; } }, {passive:true});
  v.addEventListener('touchend', e => { if (sx != null && z === 1) { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) { i = (i + (dx < 0 ? 1 : -1) + d.skins.length) % d.skins.length; draw(); } } sx = null; pd = null; });
}
async function abilitySheet(d, i) {
  const s = i ? d.spells[i - 1] : d.passive, key = i ? KEYS[i - 1] : 'P';
  const k4 = String(d.key).padStart(4, '0');
  const h = await history(d.id).catch(() => []);
  const ch = h.flatMap(r => r.changes.filter(c => c.key === key).map(c => ({...c, p:r.patch})));
  const ranks = i ? Math.max(nums(s.cooldownBurn).length, s.maxrank || 1) : 0;
  sheet(`<div style="display:flex;gap:16px;align-items:center"><img src="${CDN}/${DD.v}/img/${i ? 'spell' : 'passive'}/${s.image.full}" alt="" style="width:72px;height:72px;border-radius:14px"><div><div class="mono" style="color:var(--a1);font-size:12px;letter-spacing:.08em">${i ? key : 'PASSIVE'}</div><h2 style="font:600 26px/30px var(--disp)">${esc(s.name)}</h2></div></div>
  <p class="sub" style="margin:16px 0">${esc(strip(s.description))}</p>
  ${i ? `<table class="st"><thead><tr><th>Rank</th>${Array.from({length:ranks}, (_, r) => `<th>${r + 1}</th>`).join('')}</tr></thead><tbody>${[['Cooldown', s.cooldown], ['Cost', s.cost], ['Range', s.range]].filter(([, a]) => a && a.some(x => x && x < 25000)).map(([n, a]) => `<tr><td>${n}</td>${Array.from({length:ranks}, (_, r) => `<td>${a[r] ?? a.at(-1)}</td>`).join('')}</tr>`).join('')}</tbody></table>` : ''}
  <video src="https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${k4}/ability_${k4}_${i ? key : 'P'}1.webm" controls muted playsinline loop preload="metadata" style="width:100%;border-radius:12px;margin-top:16px;background:var(--bg2)" onerror="this.remove()"></video>
  <div class="eyebrow" style="margin:20px 0 6px">Change history · last 24 patches</div>
  ${ch.length ? `<div class="hist">${ch.map(c => `<div><span class="p">${c.p}</span><span class="c-${c.kind}">${{buff:'▲', nerf:'▼', neutral:'●', rework:'◆'}[c.kind] || ''} <span style="color:var(--t2)">${esc(c.text)}</span></span></div>`).join('')}</div>` : '<p class="cap">No changes detected in Data Dragon.</p>'}`);
  $('.sheet video')?.addEventListener('error', e => e.target.remove());
}
function setupChampScroll() {
  const art = $('#art'), nm = $('#cname'), stabs = $('#stabs');
  const ids = ['overview', 'lore', 'kit', 'skins', 'web', 'history', 'stats', 'builds'];
  stabs.onclick = e => { const b = e.target.closest('[data-sec]'); if (b) scrollToSec(b.dataset.sec); };
  const on = () => {
    const y = scrollY;
    if (art && !reduceMotion() && y < 1000) art.style.transform = `translateY(${y * .4}px)`;
    if (nm) stabs.classList.toggle('named', nm.getBoundingClientRect().bottom < 120);
    let cur = ids[0]; for (const s of ids) { const el = $('#s-' + s); if (el && el.getBoundingClientRect().top < 160) cur = s; }
    $$('#stabs button').forEach(b => { const a = b.dataset.sec === cur; if (a !== b.classList.contains('on')) { b.classList.toggle('on', a); if (a) $('#stabs-in').scrollTo({left:b.offsetLeft - 20, behavior:'smooth'}); } });
  };
  window.onscroll = on; on();
}
function scrollToSec(s) { const el = $('#s-' + s); if (el) window.scrollTo({top:el.getBoundingClientRect().top + scrollY - 110, behavior:reduceMotion() ? 'auto' : 'smooth'}); }

/* ---------- A1 Atlas (original stylized map) ---------- */
const blob = (x, y, r, seed, sx = 1.3) => { const g = rng(seed); const n = 11, pts = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = r * (.72 + g() * .45); pts.push([x + Math.cos(a) * rr * sx, y + Math.sin(a) * rr]); } let d = `M${pts[0]}`; for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; d += ` Q${p} ${m}`; } return d + 'Z'; };
const atlasState = {vb:[0, 0, 1100, 640], layers:{champions:true, landmarks:false, conflicts:true, explored:true}, sel:null};
route(/^\/atlas$/, async () => {
  clearAura(); store.trail = []; save();
  const L = atlasState.layers;
  view.innerHTML = `<div class="page wrap" style="padding-top:calc(20px + var(--sat))"><div class="eyebrow">Original illustrated map · not to scale</div><h1 class="h-big" style="margin:6px 0 16px">Atlas</h1>
  <div class="chips" id="layers" style="margin-bottom:12px">${Object.keys(L).map(k => `<button class="chip" aria-pressed="${L[k]}" data-layer="${k}">${k === 'explored' ? 'Your explored areas' : k[0].toUpperCase() + k.slice(1)}</button>`).join('')}</div>
  <div class="atlas" id="atlas"><svg id="map" viewBox="${atlasState.vb.join(' ')}" role="img" aria-label="Stylized world map with 13 regions"></svg>
  <div class="zoombtns"><button class="round" data-z="0.8" aria-label="Zoom in">${ic('plus')}</button><button class="round" data-z="1.25" aria-label="Zoom out">${ic('minus')}</button></div></div>
  <p class="cap" style="margin-top:10px">Drag to pan, pinch or scroll to zoom, tap a region. Regions fill in as you visit their pages.</p></div>`;
  drawMap();
  $('#layers').onclick = e => { const b = e.target.closest('[data-layer]'); if (!b) return; L[b.dataset.layer] = !L[b.dataset.layer]; b.setAttribute('aria-pressed', L[b.dataset.layer]); drawMap(); };
  const svg = $('#map'), box = $('#atlas');
  const zoom = (f, cx = .5, cy = .5) => { const v = atlasState.vb, nw = Math.max(260, Math.min(1400, v[2] * f)), nh = nw * (v[3] / v[2]); v[0] += (v[2] - nw) * cx; v[1] += (v[3] - nh) * cy; v[2] = nw; v[3] = nh; svg.setAttribute('viewBox', v.join(' ')); };
  $$('[data-z]').forEach(b => b.onclick = () => zoom(+b.dataset.z));
  box.addEventListener('wheel', e => { e.preventDefault(); const r = box.getBoundingClientRect(); zoom(e.deltaY > 0 ? 1.1 : .9, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); }, {passive:false});
  const pts = new Map(); let moved = 0, last = null;
  box.addEventListener('pointerdown', e => { pts.set(e.pointerId, [e.clientX, e.clientY]); moved = 0; });
  box.addEventListener('pointermove', e => { if (!pts.has(e.pointerId)) return; const prev = pts.get(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]);
    const r = box.getBoundingClientRect(), v = atlasState.vb;
    if (pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (last) zoom(last / d); last = d; moved = 99; return; }
    const dx = e.clientX - prev[0], dy = e.clientY - prev[1]; moved += Math.abs(dx) + Math.abs(dy); if (moved < 6) return;
    if (!box.hasPointerCapture(e.pointerId)) box.setPointerCapture(e.pointerId);
    const s = Math.max(v[2] / r.width, v[3] / r.height); v[0] -= dx * s; v[1] -= dy * s; svg.setAttribute('viewBox', v.join(' ')); });
  const up = e => { pts.delete(e.pointerId); if (pts.size < 2) last = null; };
  box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
  box.addEventListener('click', e => { if (moved > 6) return; const g = e.target.closest('.rg'); if (g) regionSheet(g.dataset.r); }, true);
});
function drawMap() {
  const L = atlasState.layers, svg = $('#map'); if (!svg) return;
  const land = [[330, 250, 250, 'valoran', 1.5], [470, 470, 190, 'south', 1.6], [880, 210, 110, 'ionia', 1.1], [880, 490, 60, 'serpent', 1.3], [970, 520, 46, 'isles', 1.2]];
  const conf = [];
  if (L.conflicts) EVENTS.forEach(e => e.regions.length > 1 && conf.push(e.regions));
  REL.forEach(r => { if (['Rival', 'Vendetta'].includes(r[2])) { const a = regionKey(r[0]), b = regionKey(r[1]); if (a !== b && R[a] && R[b]) conf.push([a, b]); } });
  svg.innerHTML = `<defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#ffffff07"/></pattern><radialGradient id="sea" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#0d1118"/><stop offset="1" stop-color="#050506"/></radialGradient></defs>
  <rect x="-1000" y="-1000" width="3200" height="2600" fill="url(#sea)"/><rect x="-1000" y="-1000" width="3200" height="2600" fill="url(#grid)"/>
  ${land.map(([x, y, r, s, sx]) => `<path d="${blob(x, y, r, s, sx)}" fill="#101014" stroke="#24242a" stroke-width="1.2"/>`).join('')}
  ${[...new Set(conf.map(c => c.slice().sort().join('|')))].map(k => { const [a, b] = k.split('|'); const A = R[a], B = R[b]; const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2 - 40; return `<path d="M${A.x},${A.y} Q${mx},${my} ${B.x},${B.y}" fill="none" stroke="#FF5C5C" stroke-opacity=".45" stroke-width="1.4" stroke-dasharray="4 5"/>`; }).join('')}
  ${Object.entries(R).map(([k, r]) => { const vis = Object.keys(store.visited).some(p => p === `/region/${k}` || (p.startsWith('/c/') && regionKey(p.slice(3)) === k)); const fill = L.explored ? (vis ? .34 : .07) : .16; const champs = champsIn(k).slice(0, 5);
    return `<g class="rg${atlasState.sel === k ? ' sel' : ''}" data-r="${k}" tabindex="0" role="button" aria-label="${r.name}"><path d="${blob(r.x, r.y, k === 'bandle' ? 30 : 58, k, 1.25)}" fill="${r.color}" fill-opacity="${fill}" stroke="${r.color}" stroke-opacity=".8" stroke-width="1.2"/>
    ${L.champions ? champs.map((c, i) => { const a = i / champs.length * Math.PI * 2; return `<image href="${square(c.id)}" x="${r.x + Math.cos(a) * 34 - 9}" y="${r.y + 16 + Math.sin(a) * 16 - 9}" width="18" height="18" clip-path="circle(9px)" opacity=".9"/>`; }).join('') : ''}
    <text x="${r.x}" y="${r.y - 4}" text-anchor="middle">${r.name}</text>
    ${L.landmarks ? r.landmarks.map((l, i) => `<text x="${r.x}" y="${r.y + 54 + i * 13}" text-anchor="middle" style="font:500 9px var(--sans);fill:var(--t3)">◆ ${esc(l)}</text>`).join('') : ''}</g>`; }).join('')}`;
}
function regionSheet(k) {
  const r = R[k]; atlasState.sel = k; drawMap();
  const ev = EVENTS.filter(e => e.regions.includes(k));
  sheet(`<div style="display:flex;gap:12px;align-items:center">${emb(k)}<div><h2 class="h-sec">${r.name}</h2><div class="cap">${r.tag}</div></div></div><p class="sub" style="margin:14px 0">${esc(r.summary)}</p>
  <div class="eyebrow" style="margin-bottom:8px">Champions</div><div>${champsIn(k).slice(0, 10).map(c => cchip(c.id)).join('')}</div>
  ${ev.length ? `<div class="eyebrow" style="margin:16px 0 8px">History & conflicts</div>${ev.map(e => `<a class="ev" href="#/event/${e.id}"><span class="mono cap">${e.era}</span><h4>${esc(e.title)}</h4></a>`).join('')}` : ''}
  <a class="pill solid" href="#/region/${k}" style="width:100%;justify-content:center;margin-top:12px">Open ${r.name} ${ic('next')}</a>`);
}

/* ---------- A2 Region / A3 Place ---------- */
route(/^\/region\/(\w+)$/, async (k) => {
  const r = R[k]; if (!r) throw new Error('region');
  trackTrail(`/region/${k}`, r.name, r.color);
  const champs = champsIn(k), col = champs.slice(0, 3);
  setAura([clampAura(unhex(r.color)), '#3FB6E8']);
  const ev = EVENTS.filter(e => e.regions.includes(k));
  const rivals = {}; REL.forEach(x => { if (!['Rival', 'Vendetta'].includes(x[2])) return; const a = regionKey(x[0]), b = regionKey(x[1]); if (a === k && b !== k && R[b]) (rivals[b] ||= []).push(x); if (b === k && a !== k && R[a]) (rivals[a] ||= []).push(x); });
  view.innerHTML = `<div class="topbar"><button class="round" data-act="back" aria-label="Back">${ic('back')}</button></div><div class="page">
  <section style="position:relative;height:min(62svh,520px);display:grid;grid-template-columns:repeat(${col.length},1fr);margin-top:calc(-56px - var(--sat))">${col.map(c => `<img src="${splash(c.id)}" alt="Official splash art: ${esc(c.name)}" style="width:100%;height:100%;object-fit:cover;object-position:60% 25%">`).join('')}<div class="shade" style="background:linear-gradient(180deg,#05050644,#050506 95%)"></div>
  <div class="wrap" style="position:absolute;left:0;right:0;bottom:16px">${emb(k).replace('class="em"', 'style="width:56px;height:56px"')}<h1 class="h-big" style="font-size:48px;line-height:50px;margin-top:10px">${r.name}</h1><div class="ctitle" style="font-size:24px;line-height:30px">${r.tag}</div></div></section>
  <div class="wrap"><p style="font:500 19px/29px var(--sans);margin:20px 0 0">${esc(r.summary)}</p><p class="cap">Original summary · curated</p>
  <section class="sec"><h2 class="h-sec" style="margin-bottom:14px">Key figures</h2><div class="hscroll">${champs.slice(0, 8).map(c => `<a class="card" href="#/c/${c.id}" data-champ="${c.id}" style="width:130px;aspect-ratio:308/560"><img src="${loading(c.id)}" alt="" loading="lazy"><div class="shade"></div><div class="cap-in"><b style="font:600 15px var(--sans)">${esc(c.name)}</b></div></a>`).join('')}</div></section>
  <section class="sec"><h2 class="h-sec" style="margin-bottom:14px">Landmarks</h2><div class="rows">${r.landmarks.map((l, i) => `<a href="#/place/${k}/${i}"><span class="lead" style="color:var(--a1)">${ic('pin').replace('<svg', '<svg style="width:24px"')}</span><div style="flex:1"><b style="font:600 17px var(--sans)">${esc(l)}</b><div class="cap">${r.name}</div></div>${ic('chev').replace('<svg', '<svg style="width:18px;color:var(--t3)"')}</a>`).join('')}</div></section>
  ${ev.length ? `<section class="sec"><h2 class="h-sec">History</h2><p class="cap" style="margin:6px 0 16px">Curated sample data · approximate eras</p><div class="tl">${ev.map(e => `<div class="node"><a class="panel" style="display:block;padding:14px 16px" href="#/event/${e.id}"><span class="era">${e.era}</span><h4>${esc(e.title)}</h4><p class="cap" style="margin:0;color:var(--t2)">${esc(e.summary)}</p></a></div>`).join('')}</div></section>` : ''}
  ${Object.keys(rivals).length ? `<section class="sec"><h2 class="h-sec" style="margin-bottom:14px">Rivalries</h2>${Object.entries(rivals).map(([o, xs]) => `<a class="relrow" href="#/region/${o}"><span style="width:48px;display:grid;place-items:center">${emb(o)}</span><div><b>${R[o].name}</b><p>${xs.map(x => `${C(x[0])?.name} vs ${C(x[1])?.name}`).join(' · ')}</p></div></a>`).join('')}</section>` : ''}
  <section class="sec"><h2 class="h-sec" style="margin-bottom:14px">All champions · ${champs.length}</h2><div class="grid">${champs.map(c => `<a class="card pcard" href="#/c/${c.id}" data-champ="${c.id}" data-vt><img src="${loading(c.id)}" alt="" loading="lazy"><div class="shade"></div><div class="cap-in"><b>${esc(c.name)}</b><span>${esc(c.title)}</span></div></a>`).join('')}</div><p class="cap" style="margin-top:10px">Region membership curated from public faction listings.</p></section>
  ${legalFoot()}</div></div>`;
});
route(/^\/place\/(\w+)\/(\d+)$/, async (k, i) => {
  const r = R[k], l = r?.landmarks[+i]; if (!l) throw new Error('place');
  trackTrail(`/place/${k}/${i}`, l, r.color); setAura([clampAura(unhex(r.color)), '#3FB6E8']);
  const ev = EVENTS.filter(e => e.regions.includes(k));
  view.innerHTML = `<div class="topbar"><button class="round" data-act="back" aria-label="Back">${ic('back')}</button></div><div class="page wrap" style="padding-top:var(--padtop)">
  <div class="eyebrow">Landmark · <a href="#/region/${k}" class="link-a">${r.name}</a></div><h1 class="h-big" style="margin:8px 0 16px">${esc(l)}</h1>
  <p class="sub">A notable place within ${r.name}. ${esc(r.summary)}</p><p class="cap">Curated sample entry</p>
  <section class="sec"><h2 class="h-sec" style="margin-bottom:12px">Linked champions</h2>${champsIn(k).slice(0, 8).map(c => cchip(c.id)).join('')}</section>
  ${ev.length ? `<section class="sec"><h2 class="h-sec" style="margin-bottom:12px">Linked events</h2>${ev.map(e => `<a class="ev" href="#/event/${e.id}"><span class="mono cap">${e.era}</span><h4>${esc(e.title)}</h4><p>${esc(e.summary)}</p></a>`).join('')}</section>` : ''}${legalFoot()}</div>`;
});

/* ---------- X1 Codex / X2 Event ---------- */
route(/^\/codex$/, async () => {
  clearAura(); store.trail = []; save();
  const eras = [...new Set(EVENTS.map(e => e.era))];
  const unlocked = Object.keys(store.visited).length;
  view.innerHTML = `<div class="page wrap" style="padding-top:calc(20px + var(--sat))"><div class="eyebrow">World history · curated sample data</div><h1 class="h-big" style="margin:6px 0 20px">Codex</h1>
  <div class="hscroll" style="gap:20px">${eras.map(er => `<div class="codex-era"><div class="era-h"><b>${er}</b><i></i><span class="cap mono">${EVENTS.filter(e => e.era === er).length}</span></div>${EVENTS.filter(e => e.era === er).map(e => `<a class="ev" href="#/event/${e.id}"><div style="display:flex;gap:6px;margin-bottom:8px">${e.regions.map(r => emb(r).replace('class="em"', 'style="width:18px;height:18px"')).join('')}</div><h4>${esc(e.title)}</h4><p>${esc(e.summary)}</p><div class="duo" style="margin-top:10px">${e.champs.filter(C).slice(0, 5).map(c => `<img src="${square(c)}" alt="">`).join('')}</div></a>`).join('')}</div>`).join('')}</div>
  <section class="sec"><a class="card" href="#/web" style="display:block;padding:24px;background:radial-gradient(circle at 80% 20%,#2a1a33,#0E0E10 60%)"><div class="eyebrow">Explorer</div><h2 class="h-sec" style="margin:6px 0">Lore Web</h2><p class="sub" style="margin:0 0 14px">${REL.length} curated relationships across ${new Set(REL.flatMap(r => [r[0], r[1]])).size} champions. Filter by type or region.</p><span class="pill sm">${ic('web')}Open the web</span></a></section>
  <section class="sec"><div class="sec-head"><h2 class="h-sec">Codex entries</h2><span class="cap mono">${unlocked} unlocked</span></div><p class="sub" style="margin-top:0">Entries unlock automatically as you read pages. Nothing is locked behind payment.</p>
  <div class="chips" style="flex-wrap:wrap">${Object.keys(store.visited).slice(-24).map(p => `<a class="chip" href="#${p}">${esc(labelFor(p))}</a>`).join('') || '<span class="cap">Open any champion to unlock your first entry.</span>'}</div></section>${legalFoot()}</div>`;
});
const labelFor = p => { const [, t, a, b] = p.split('/'); if (t === 'c') return C(a)?.name || a; if (t === 'region') return regionName(a); if (t === 'event') return EVENTS.find(e => e.id === a)?.title || a; if (t === 'place') return R[a]?.landmarks[b] || a; if (t === 'read') return `Story: ${C(a)?.name}`; if (t === 'line') return decodeURIComponent(a) + ' line'; return p; };
route(/^\/event\/(\w+)$/, async (id) => {
  const e = EVENTS.find(x => x.id === id); if (!e) throw new Error('event');
  trackTrail(`/event/${id}`, e.title, R[e.regions[0]]?.color);
  const lead = e.champs.find(C);
  if (lead) extractAura(lead).then(setAura);
  view.innerHTML = `<div class="topbar"><button class="round" data-act="back" aria-label="Back">${ic('back')}</button></div><div class="page">
  <section style="position:relative;height:min(50svh,440px);margin-top:calc(-56px - var(--sat))">${lead ? `<img src="${splash(lead)}" alt="Official splash art: ${esc(C(lead).name)}" style="width:100%;height:100%;object-fit:cover;object-position:60% 25%;filter:saturate(.7)">` : ''}<div class="shade" style="background:linear-gradient(180deg,#05050655,#050506 95%)"></div>
  <div class="wrap" style="position:absolute;left:0;right:0;bottom:16px"><div class="eyebrow" style="color:var(--a1)">${e.era} era</div><h1 class="h-big" style="margin-top:8px;text-wrap:balance">${esc(e.title)}</h1></div></section>
  <div class="wrap"><p style="font:500 19px/29px var(--sans);margin:20px 0 4px">${esc(e.summary)}</p><p class="cap">Curated summary in original words. For canon detail, see Riot's Universe site.</p>
  <div class="two sec" style="display:grid;gap:12px"><div class="panel"><div class="eyebrow">Before</div><p class="sub" style="margin:8px 0 0">${esc(e.before)}</p></div><div class="panel"><div class="eyebrow">After</div><p class="sub" style="margin:8px 0 0">${esc(e.after)}</p></div></div>
  <section class="sec"><h2 class="h-sec" style="margin-bottom:12px">Involved</h2>${e.champs.map(cchip).join('')}</section>
  <section class="sec"><h2 class="h-sec" style="margin-bottom:12px">Where</h2>${e.regions.map(r => `<a class="chip" style="display:inline-flex;align-items:center;gap:8px;margin:0 6px 6px 0" href="#/region/${r}">${emb(r).replace('class="em"', 'style="width:16px;height:16px"')}${regionName(r)}</a>`).join('')}</section>
  <section class="sec"><a class="link" href="https://universe.leagueoflegends.com/en_US/" target="_blank" rel="noopener">Sources: Riot Universe site ↗</a></section>${legalFoot()}</div></div>`;
});

/* ---------- X3 Lore Web ---------- */
const webState = {type:'', region:''};
route(/^\/web(?:\/(\w+))?$/, async (focus) => {
  if (focus && C(focus)) extractAura(focus).then(setAura); else clearAura();
  trackTrail(`/web${focus ? '/' + focus : ''}`, 'Lore Web', null);
  view.innerHTML = `<div class="topbar"><button class="round" data-act="back" aria-label="Back">${ic('back')}</button></div><div class="page wrap" style="padding-top:var(--padtop)">
  <div class="eyebrow">Curated sample data</div><h1 class="h-big" style="margin:6px 0 14px">Lore Web</h1>
  <label class="searchbox" style="margin-bottom:12px">${ic('search')}<input id="wq" placeholder="Center on a champion" list="wl" autocomplete="off"><datalist id="wl">${[...new Set(REL.flatMap(r => [r[0], r[1]]))].filter(C).map(x => `<option value="${esc(C(x).name)}">`).join('')}</datalist></label>
  <div class="chips" style="margin-bottom:12px"><select class="chip" id="wt"><option value="">All ties</option>${['Sibling', 'Family', 'Rival', 'Ally', 'Mentor', 'Vendetta', 'Love'].map(t => `<option ${webState.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select><select class="chip" id="wr"><option value="">All regions</option>${Object.entries(R).map(([k, r]) => `<option value="${k}" ${webState.region === k ? 'selected' : ''}>${r.name}</option>`).join('')}</select></div>
  <div class="webwrap" id="bigweb" style="height:min(70svh,720px)"></div><p class="cap" style="margin-top:10px">Tap a line for the story behind it, tap a face to center it. Drag to pan.</p>${legalFoot()}</div>`;
  const draw = (center) => bigWeb($('#bigweb'), center);
  $('#wt').onchange = e => { webState.type = e.target.value; draw(focus); };
  $('#wr').onchange = e => { webState.region = e.target.value; draw(focus); };
  $('#wq').onchange = e => { const id = DD.byName[e.target.value.toLowerCase()]; if (id) { focus = id; draw(id); } };
  draw(focus);
});
function bigWeb(el, focus) {
  const edges = REL.filter(r => C(r[0]) && C(r[1]) && (!webState.type || r[2] === webState.type) && (!webState.region || regionKey(r[0]) === webState.region || regionKey(r[1]) === webState.region));
  const ids = [...new Set(edges.flatMap(e => [e[0], e[1]]))];
  if (!ids.length) { el.innerHTML = '<p class="empty">No relationships match.</p>'; return; }
  const W = 1000, H = Math.round(1000 * (el.clientHeight / Math.max(1, el.clientWidth))), g = rng('web' + ids.length);
  const N = ids.map(id => ({id, x:W / 2 + (g() - .5) * 600, y:H / 2 + (g() - .5) * H * .6, vx:0, vy:0}));
  const M = Object.fromEntries(N.map(n => [n.id, n]));
  for (let it = 0; it < 320; it++) {
    for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) { const a = N[i], b = N[j]; let dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy + .01, f = 2600 / d2; a.vx += dx * f / Math.sqrt(d2); a.vy += dy * f / Math.sqrt(d2); b.vx -= dx * f / Math.sqrt(d2); b.vy -= dy * f / Math.sqrt(d2); }
    edges.forEach(e => { const a = M[e[0]], b = M[e[1]], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, f = (d - 90) * .02; a.vx += dx / d * f * 3; a.vy += dy / d * f * 3; b.vx -= dx / d * f * 3; b.vy -= dy / d * f * 3; });
    N.forEach(n => { n.vx += (W / 2 - n.x) * .004; n.vy += (H / 2 - n.y) * .004 * (W / H); n.x += n.vx * .5; n.y += n.vy * .5; n.vx *= .6; n.vy *= .6; });
  }
  const xs = N.map(n => n.x), ys = N.map(n => n.y); const pad = 50;
  let vb = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + pad * 2, Math.max(...ys) - Math.min(...ys) + pad * 2];
  if (focus && M[focus]) { const f = M[focus]; vb = [f.x - 260, f.y - 220, 520, 440]; }
  el.innerHTML = `<svg viewBox="${vb.join(' ')}" id="bw" role="img" aria-label="Relationship graph"><defs>${ids.map(x => `<pattern id="q-${x}" width="1" height="1" patternContentUnits="objectBoundingBox"><image href="${square(x)}" width="1" height="1"/></pattern>`).join('')}</defs>
  ${edges.map((e, i) => { const a = M[e[0]], b = M[e[1]]; const col = {Sibling:'#8DC6E8', Family:'#8DC6E8', Rival:'#E9B949', Vendetta:'#FF5C5C', Love:'#E58FB0', Ally:'#3DDC97', Mentor:'#B48CFF'}[e[2]]; return `<line data-e="${i}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${col}" stroke-opacity="${focus && ![e[0], e[1]].includes(focus) ? .15 : .6}" stroke-width="3" style="cursor:pointer"/>`; }).join('')}
  ${N.map(n => `<g data-n="${n.id}" style="cursor:pointer;opacity:${focus && n.id !== focus && !edges.some(e => (e[0] === focus && e[1] === n.id) || (e[1] === focus && e[0] === n.id)) ? .35 : 1}"><circle cx="${n.x}" cy="${n.y}" r="${n.id === focus ? 30 : 24}" fill="url(#q-${n.id})" stroke="${n.id === focus ? 'var(--a1)' : '#2A2A2E'}" stroke-width="2"/><text x="${n.x}" y="${n.y + 40}" text-anchor="middle" style="font-size:14px">${esc(C(n.id).name)}</text></g>`).join('')}</svg>
  <div style="position:absolute;left:12px;bottom:12px;display:flex;flex-wrap:wrap;gap:6px">${['Sibling', 'Rival', 'Ally', 'Mentor', 'Vendetta', 'Love'].map(t => `<span class="badge ${t}">${t}</span>`).join('')}</div>`;
  const svg = $('#bw', el); let drag = null, moved = 0;
  svg.addEventListener('pointerdown', e => { drag = [e.clientX, e.clientY]; moved = 0; });
  svg.addEventListener('pointermove', e => { if (!drag) return; const r = svg.getBoundingClientRect(), s = vb[2] / r.width; const dx = e.clientX - drag[0], dy = e.clientY - drag[1]; moved += Math.abs(dx) + Math.abs(dy); if (moved > 5 && !svg.hasPointerCapture(e.pointerId)) svg.setPointerCapture(e.pointerId); vb[0] -= dx * s; vb[1] -= dy * s; drag = [e.clientX, e.clientY]; svg.setAttribute('viewBox', vb.join(' ')); });
  svg.addEventListener('pointerup', e => { drag = null; if (moved > 5) return; const t = document.elementFromPoint(e.clientX, e.clientY); const n = t?.closest('[data-n]'), ed = t?.closest('[data-e]');
    if (n) { const id = n.dataset.n; const target = M[id], start = vb.slice(), end = [target.x - 260, target.y - 220, 520, 440], t0 = performance.now();
      const step = now => { const k = Math.min(1, (now - t0) / (reduceMotion() ? 1 : 450)), ease = 1 - (1 - k) ** 3; vb = start.map((v, i) => v + (end[i] - v) * ease); svg.setAttribute('viewBox', vb.join(' ')); if (k < 1) requestAnimationFrame(step); else bigWebSheet(id); }; requestAnimationFrame(step); }
    else if (ed) { const x = edges[+ed.dataset.e]; sheet(`<div style="display:flex;align-items:center;gap:10px"><div class="duo"><img src="${square(x[0])}" alt="" style="width:48px;height:48px"><img src="${square(x[1])}" alt="" style="width:48px;height:48px"></div><span class="badge ${x[2]}" style="margin-left:14px">${x[2]}</span></div><h3 style="font:600 22px var(--disp);margin:14px 0 6px">${esc(C(x[0]).name)} &amp; ${esc(C(x[1]).name)}</h3><p class="sub">${esc(x[3])}</p><div style="display:flex;gap:10px"><a class="pill sm" href="#/c/${x[0]}">${esc(C(x[0]).name)}</a><a class="pill sm" href="#/c/${x[1]}">${esc(C(x[1]).name)}</a></div><p class="cap" style="margin-top:12px">Curated sample data.</p>`); } });
}
function bigWebSheet(id) { const rs = relsOf(id); sheet(`<div style="display:flex;gap:14px;align-items:center"><img src="${square(id)}" alt="" style="width:56px;height:56px;border-radius:50%"><div><h3 style="font:600 24px var(--disp)">${esc(C(id).name)}</h3><div class="cap">${esc(C(id).title)}</div></div></div><div style="margin:12px 0">${rs.map(r => `<div class="relrow"><img src="${square(r.other)}" alt="" style="width:36px;height:36px"><div><b>${esc(C(r.other).name)}</b> <span class="badge ${r.type}">${r.type}</span><p>${esc(r.note)}</p></div></div>`).join('')}</div><a class="pill solid" href="#/c/${id}" style="width:100%;justify-content:center">Open page ${ic('next')}</a>`); }

/* ---------- X4 Story reader ---------- */
route(/^\/read\/(\w+)$/, async (id) => {
  const c = C(id); if (!c) throw new Error('champ');
  trackTrail(`/read/${id}`, `${c.name}'s story`, square(id)); extractAura(id).then(setAura);
  const d = await detail(id);
  const names = DD.list.filter(x => x.id !== id && x.name.length > 2).map(x => x.name).sort((a, b) => b.length - a.length);
  const re = new RegExp(`\\b(${names.map(n => n.replace(/[.*+?^${}()|[\]\\']/g, '\\$&')).join('|')})\\b`, 'g');
  const rnames = Object.values(R).map(r => r.name.replace(/^The /, ''));
  const rre = new RegExp(`\\b(${rnames.join('|')})\\b`, 'g');
  const linkify = t => esc(t).replace(re, m => `<a href="#/c/${DD.byName[m.toLowerCase()]}">${m}</a>`).replace(rre, (m, _, off, str) => { const k = Object.keys(R).find(k => R[k].name.replace(/^The /, '') === m); return str.slice(Math.max(0, off - 9), off).includes('href') ? m : `<a href="#/region/${k}">${m}</a>`; });
  const sents = (d.lore || c.blurb).replace(/<br\s*\/?>/g, ' ').match(/[^.!?]+[.!?]+["”’]?\s*|[^.!?]+$/g) || [];
  const paras = sents.reduce((acc, x) => { if (!acc.length || acc.at(-1).length > 380) acc.push(x.trim()); else acc[acc.length - 1] += ' ' + x.trim(); return acc; }, []);
  view.innerHTML = `<div class="topbar"><button class="round" data-act="back" aria-label="Back">${ic('back')}</button></div><div class="progress" id="prog"></div>
  <article class="reader page"><div class="eyebrow">Biography · ${regionName(regionKey(id))}</div><h1 style="font:600 44px/48px var(--disp);margin:10px 0 4px">${esc(c.name)}</h1><div class="ctitle" style="font-size:24px;line-height:30px;margin-bottom:32px">${esc(c.title)}</div>
  <div class="story">${paras.map(p => `<p>${linkify(p)}</p>`).join('')}</div>
  <p class="cap" style="border-top:1px solid var(--b1);padding-top:16px">Text © Riot Games, served by Data Dragon ${DD.v}. Full stories live on <a class="link-a" href="https://universe.leagueoflegends.com/en_US/champion/${id.toLowerCase()}/" target="_blank" rel="noopener">Riot's Universe site ↗</a>.</p>
  <div style="display:flex;gap:10px;margin-top:20px"><a class="pill sm" href="#/c/${id}">Back to ${esc(c.name)}</a></div></article>`;
  document.body.appendChild($('#prog'));
  window.onscroll = () => { const p = $('#prog'); if (p) p.style.width = (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100) + '%'; };
});

/* ---------- Skin line ---------- */
route(/^\/line\/(.+)$/, async (line) => {
  trackTrail(`/line/${encodeURIComponent(line)}`, line, null); clearAura();
  view.innerHTML = `<div class="topbar"><button class="round" data-act="back" aria-label="Back">${ic('back')}</button></div><div class="page wrap" style="padding-top:var(--padtop)"><div class="eyebrow">Skin line</div><h1 class="h-big" style="margin:6px 0 20px">${esc(line)}</h1><div id="lg" class="grid"><div class="skel" style="height:240px;border-radius:12px;grid-column:1/-1"></div></div><p class="cap" style="margin-top:12px">Grouped by skin name from Data Dragon. Community Dragon holds official skin-line metadata; names that don't follow the pattern may be missed.</p>${legalFoot()}</div>`;
  const full = await loadFull();
  const hits = []; Object.values(full).forEach(c => c.skins.forEach(s => { if (s.num && skinLine(s.name, c.name) === line) hits.push({c, s}); }));
  $('#lg').innerHTML = hits.length ? hits.map(({c, s}) => `<a class="card" href="#/c/${c.id}?skin=${s.num}" data-champ="${c.id}" style="aspect-ratio:3/4"><img src="${loading(c.id, s.num)}" alt="Official art: ${esc(s.name)}" loading="lazy"><div class="shade"></div><div class="cap-in"><b style="font:600 15px var(--sans)">${esc(s.name)}</b></div></a>`).join('') : '<p class="empty" style="grid-column:1/-1">No other skins found.</p>';
});

/* ---------- Curated trail start ---------- */
route(/^\/trail\/(\w+)$/, async (id) => {
  const t = TRAILS.find(x => x.id === id); if (!t) throw new Error('trail');
  clearAura(); store.trail = []; save();
  view.innerHTML = `<div class="topbar"><button class="round" data-act="back" aria-label="Back">${ic('back')}</button></div><div class="page wrap" style="padding-top:var(--padtop)"><div class="eyebrow">Curated trail · ${t.stops.length} stops</div><h1 class="h-big" style="margin:6px 0 10px;text-wrap:balance">${esc(t.title)}</h1><p class="sub" style="font-size:19px;line-height:28px">${esc(t.hook)}.</p>
  <div class="tl sec" style="margin-top:28px">${t.stops.map((s, i) => { const [k, x] = s.split(':'); return `<div class="node"><a class="panel" style="display:flex;gap:12px;align-items:center;padding:12px 14px" href="${stopHref(s)}" data-start="${i}">${k === 'c' ? `<img src="${square(x)}" alt="" style="width:40px;height:40px;border-radius:50%">` : `<span style="width:40px;display:grid;place-items:center">${emb(k === 'r' ? x : EVENTS.find(e => e.id === x)?.regions[0])}</span>`}<div><span class="era">Stop ${i + 1}</span><h4 style="margin:2px 0 0">${esc(stopLabel(s))}</h4></div></a></div>`; }).join('')}</div>
  <a class="pill solid" href="${stopHref(t.stops[0])}" data-start="0" style="width:100%;justify-content:center;margin:16px 0 40px">${ic('play')}Begin trail</a></div>`;
  $$('[data-start]').forEach(a => a.addEventListener('click', () => { store.activeTrail = {id, idx:+a.dataset.start}; save(); }));
});

/* ---------- You ---------- */
route(/^\/you$/, async () => {
  clearAura(); store.trail = []; save();
  const explored = Object.keys(R).filter(k => Object.keys(store.visited).some(p => p === `/region/${k}` || (p.startsWith('/c/') && regionKey(p.slice(3)) === k)));
  view.innerHTML = `<div class="page wrap" style="padding-top:calc(20px + var(--sat))"><h1 class="h-big" style="margin:6px 0 20px">You</h1>
  <div class="statgrid"><div><span class="cap">Pages read</span><b>${Object.keys(store.visited).length}</b></div><div><span class="cap">Deepest trail</span><b>${store.depthMax}</b></div><div><span class="cap">Regions</span><b>${explored.length}<span class="cap">/13</span></b></div></div>
  <section class="sec"><div class="sec-head"><h2 class="h-sec">Favorites</h2><button class="link" data-act="onboard">Edit</button></div><div>${store.favorites.map(cchip).join('') || '<span class="cap">Pick favorites to personalize Explore.</span>'}</div></section>
  <section class="sec"><div class="sec-head"><h2 class="h-sec">Saved trails</h2><span class="cap mono">${store.saved.length}/3 free</span></div>${store.saved.length ? `<div class="hscroll">${store.saved.slice().reverse().map(t => trailCard({...t, href:`#${t.stops.at(-1).p}`})).join('')}</div>` : '<p class="sub">Tap “Depth” in the trail ribbon to save the path you took.</p>'}</section>
  <section class="sec"><div class="sec-head"><h2 class="h-sec">Skin wishlist</h2><span class="cap mono">${store.wish.length}</span></div>${store.wish.length ? `<div class="hscroll">${store.wish.map(w => { const [id, n] = w.split('_'); return C(id) ? `<a class="card" href="#/c/${id}?skin=${n}" style="width:120px;aspect-ratio:308/560"><img src="${loading(id, n)}" alt="" loading="lazy"></a>` : ''; }).join('')}</div>` : '<p class="sub">Heart a skin in any champion\'s gallery.</p>'}</section>
  <section class="sec"><div class="pro"><div class="eyebrow" style="color:#E58FB0">Loreweave Pro · preview</div><h2 class="h-sec" style="margin:8px 0">Go deeper</h2><ul class="sub" style="padding-left:18px;margin:0 0 16px;line-height:28px"><li>Offline mode with the full graph and art cache</li><li>Unlimited saved trails</li><li>Stats history by patch and rank</li><li>Widgets and alternate app icons</li></ul><button class="pill solid sm" data-act="pro">$3.99/mo or $29.99/yr</button><p class="cap" style="margin:12px 0 0">Placeholder only. No purchases are possible in this build. All lore stays free.</p></div></section>
  <section class="sec"><h2 class="h-sec" style="margin-bottom:8px">Settings</h2>
    <div class="irow"><div style="flex:1"><b style="font-size:17px">Reduce motion</b><span>Swap travel animations for crossfades</span></div><button class="toggle" role="switch" aria-checked="${store.settings.reduceMotion}" data-act="rm" aria-label="Reduce motion"></button></div>
    <div class="irow"><div style="flex:1"><b style="font-size:17px">Riot account</b><span>Optional Riot Sign On for owned skins. Not available in this build.</span></div><span class="cap">Off</span></div>
    <div class="irow"><div style="flex:1"><b style="font-size:17px">Install on your phone</b><span>Safari: Share → Add to Home Screen. Chrome: menu → Install app.</span></div></div>
    <div class="irow"><div style="flex:1"><b style="font-size:17px">Reset progress</b><span>Clears trails, favorites and wishlist on this device</span></div><button class="pill sm" data-act="reset">Reset</button></div></section>
  <section class="sec" id="about"><h2 class="h-sec" style="margin-bottom:12px">About & data</h2>
    <div class="panel"><p class="sub" style="margin:0 0 12px">Loreweave is an unofficial MOBA lore companion and fan project. Champion names, titles, art, abilities, base stats, skins, items, runes and biographies load live from Riot's Data Dragon CDN (version ${DD.v}) and are cached on your device.</p>
    <ul class="sub" style="padding-left:18px;margin:0;font-size:15px;line-height:24px"><li><b style="color:var(--t1)">Real:</b> champions, art, abilities, base stats, skins, item and rune names, biographies, patch-to-patch stat/cooldown/cost changes.</li><li><b style="color:var(--t1)">Curated sample data:</b> region membership, relationships, world events and trails, written in original words.</li><li><b style="color:var(--t1)">Simulated demo data:</b> win, pick and ban rates, matchups, build popularity and tiers. Live stats need a Riot API production key.</li></ul></div>
    <p class="legal" style="margin-top:20px;font-size:13px;line-height:20px;color:var(--t2)">Loreweave isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p></section><div style="height:24px"></div></div>`;
});

/* ---------- Flow A onboarding ---------- */
function onboard() {
  const pick = new Set(store.favorites), pop = ['Jinx', 'Vi', 'Yasuo', 'Ahri', 'Lux', 'Garen', 'Darius', 'Thresh', 'Ekko', 'Viego', 'Kaisa', 'Caitlyn', 'Yone', 'Akali', 'Zed', 'Ashe', 'Sett', 'Viktor'].filter(C);
  const o = document.createElement('div'); o.className = 'onb';
  o.innerHTML = `<div class="bgart" style="background-image:url(${splash('Jinx')})"></div><div style="display:flex;align-items:center;gap:12px;margin-top:12px"><img src="icons/icon.svg" alt="" style="width:44px;height:44px;border-radius:12px"><b style="font:600 24px var(--disp)">Loreweave</b></div>
  <h1 style="font:600 40px/44px var(--disp);margin:44vh 0 8px;max-width:520px">Explore the world, one door at a time.</h1><p class="sub" style="margin:0 0 24px">Pick up to three favorite champions to start your first trail.</p>
  <label class="searchbox" style="margin-bottom:14px">${ic('search')}<input id="oq" placeholder="Search champions" autocomplete="off"></label><div class="grid" id="og"></div>
  <div class="cta"><button class="pill solid" id="ogo">Start exploring</button><button class="link" id="oskip" style="display:block;margin:10px auto 0">Skip for now</button></div>`;
  document.body.appendChild(o);
  const draw = () => { const q = $('#oq', o).value.toLowerCase(); const l = q ? DD.list.filter(c => c.name.toLowerCase().includes(q)).map(c => c.id) : [...new Set([...pick, ...pop])]; $('#og', o).innerHTML = l.slice(0, 18).map(id => `<button class="ob" aria-pressed="${pick.has(id)}" data-id="${id}"><img src="${loading(id)}" alt="" loading="lazy"><span>${esc(C(id).name)}</span></button>`).join(''); $('#ogo', o).textContent = pick.size ? `Start with ${C([...pick][0]).name}` : 'Start exploring'; };
  $('#oq', o).oninput = draw; draw();
  $('#og', o).onclick = e => { const b = e.target.closest('.ob'); if (!b) return; const id = b.dataset.id; if (pick.has(id)) pick.delete(id); else { if (pick.size >= 3) return toast('Up to three favorites'); pick.add(id); } draw(); };
  const done = (startId) => { store.favorites = [...pick]; store.onboarded = true; save(); o.remove(); if (startId) { location.hash = `#/c/${startId}`; setTimeout(() => toast('Your trail starts here · tap the ribbon to rewind'), 900); } };
  $('#ogo', o).onclick = () => done([...pick][0]);
  $('#oskip', o).onclick = () => done();
}

/* ---------- global interactions ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (a) {
    const act = a.dataset.act;
    if (act === 'back') { if (store.trail.length > 1) location.hash = '#' + store.trail[store.trail.length - 2].p; else location.hash = '#/'; }
    if (act === 'search') openSearch();
    if (act === 'closesearch') closeSearch();
    if (act === 'closesheet') closeSheet();
    if (act === 'savetrail') saveTrail();
    if (act === 'timeline') { scrollToSec('history'); }
    if (act === 'pro') toast('Pro is a preview placeholder · no purchases in this build');
    if (act === 'onboard') onboard();
    if (act === 'rm') { store.settings.reduceMotion = !store.settings.reduceMotion; save(); a.setAttribute('aria-checked', store.settings.reduceMotion); }
    if (act === 'reset') { if (confirm('Reset all Loreweave progress on this device?')) { localStorage.removeItem(LS); location.hash = '#/'; location.reload(); } }
    if (act === 'patch') patchSheet();
    return;
  }
  const ch = e.target.closest('[data-chart]');
  if (ch) { champState.chart = ch.dataset.chart; $$('[data-chart]').forEach(b => b.setAttribute('aria-pressed', b === ch)); $('#tipbox').innerHTML = ''; drawChart(champState.id); return; }
  if (longPressed) { e.preventDefault(); e.stopPropagation(); longPressed = false; return; }
  const vt = e.target.closest('[data-vt]');
  if (vt) { $$('[data-vt] img').forEach(i => i.style.viewTransitionName = ''); const img = $('img', vt); if (img) img.style.viewTransitionName = 'hero'; go.vt = true; }
  const link = e.target.closest('a[href^="#"]');
  if (link && link.closest('.sheet,.search-ov')) { closeSheet(); closeSearch(); }
}, true);
function patchSheet() {
  const vs = DD.versions.slice(0, 24);
  sheet(`<h2 class="h-sec" style="margin-bottom:6px">View as of patch</h2><p class="cap" style="margin:0 0 8px">Abilities and base stats load from that patch's Data Dragon files. Rates stay demo data.</p>${vs.map((v, i) => `<button class="list-btn${i === champState.patch ? ' on' : ''}" data-pv="${i}"><span>${i ? 'Patch ' + short(v) : 'Current patch · ' + short(v)}</span><span class="mono cap">${v}</span></button>`).join('')}`, el => el.onclick = e => { const b = e.target.closest('[data-pv]'); if (!b) return; champState.patch = +b.dataset.pv; closeSheet(); go.keep = true; go(); });
}
// long-press preview on any champion link
let lpT = null, longPressed = false;
document.addEventListener('pointerdown', e => {
  const el = e.target.closest('[data-champ]'); if (!el || e.button > 0) return;
  const x = e.clientX, y = e.clientY;
  lpT = setTimeout(async () => {
    longPressed = true; const id = el.dataset.champ, c = C(id); if (!c) return;
    navigator.vibrate?.(8);
    const m = document.createElement('div'); m.className = 'mini';
    m.innerHTML = `<img src="${splash(id)}" alt=""><div><b>${esc(c.name)}</b><div class="cap">${esc(c.title)}</div><ul><li>${regionName(regionKey(id))}</li><li>${esc(c.tags.join(' · '))}</li><li>${relsOf(id).length} known ties · difficulty ${c.info.difficulty}/10</li></ul></div>`;
    m.style.left = Math.min(innerWidth - 250, Math.max(10, x - 120)) + 'px'; m.style.top = Math.max(10, Math.min(innerHeight - 260, y - 240)) + 'px';
    document.body.appendChild(m);
    const kill = () => { m.remove(); document.removeEventListener('pointerup', kill); document.removeEventListener('pointercancel', kill); setTimeout(() => longPressed = false, 50); };
    document.addEventListener('pointerup', kill); document.addEventListener('pointercancel', kill);
  }, 480);
});
['pointerup', 'pointercancel', 'pointermove'].forEach(t => document.addEventListener(t, e => { if (t === 'pointermove' && Math.abs(e.movementX) + Math.abs(e.movementY) < 3) return; clearTimeout(lpT); }, {passive:true}));
document.addEventListener('contextmenu', e => { if (e.target.closest('[data-champ]')) e.preventDefault(); });
// pull down for search
let pull = null;
addEventListener('touchstart', e => { pull = scrollY <= 0 && !e.target.closest('.atlas,.webwrap,.sheet,.viewer,.carousel,.onb') ? e.touches[0].clientY : null; }, {passive:true});
addEventListener('touchend', e => { if (pull != null && e.changedTouches[0].clientY - pull > 120 && scrollY <= 0) openSearch(); pull = null; }, {passive:true});
addEventListener('keydown', e => { if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); } if (e.key === 'Escape') { closeSheet(); closeSearch(); } });

/* ---------- init ---------- */
window.addEventListener('hashchange', () => { window.onscroll = null; go(); });
(async () => {
  view.innerHTML = `<div style="height:100vh;display:grid;place-items:center"><div style="text-align:center"><img src="icons/icon.svg" alt="" style="width:72px;height:72px;border-radius:18px;margin:0 auto 16px"><div class="cap">Loading the world…</div></div></div>`;
  try { await boot(); } catch (e) { view.innerHTML = `<div class="wrap" style="padding-top:30vh;text-align:center"><h1 class="h-sec">Can't reach the data CDN</h1><p class="sub">Loreweave loads champion data from Riot's Data Dragon. Check your connection and retry.</p><button class="pill" onclick="location.reload()">Retry</button></div>`; return; }
  shell(); go();
  if (!store.onboarded) onboard();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
})();
