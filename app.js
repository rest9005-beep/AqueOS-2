'use strict';

/* ════════════════════════════════════════════
   SYSTEM STATE
════════════════════════════════════════════ */
const SYS = {
  user: 'user',
  hostname: 'aquaos',
  disk: { total: 51200, used: 14380 }, // MB
  wallpaper: 'gradient-default',
  accent: '#4d9ef5',
  theme: 'dark',
  downloads: [],
  downloads_size: 0,
};

/* ════════════════════════════════════════════
   VIRTUAL FILESYSTEM
════════════════════════════════════════════ */
const FS = {
  '/': { type:'dir', children:['home','usr','etc','var','tmp','dev'] },
  '/home': { type:'dir', children:['user'] },
  '/home/user': { type:'dir', children:['Рабочий стол','Документы','Загрузки','Картинки','Музыка','Видео','Проекты','.bashrc','.profile'] },
  '/home/user/Рабочий стол': { type:'dir', children:['notes.txt','report.pdf','todo.md'] },
  '/home/user/Документы': { type:'dir', children:['resume.pdf','report.docx','presentation.pptx','data.csv','archive.zip'] },
  '/home/user/Загрузки': { type:'dir', children:[] },
  '/home/user/Картинки': { type:'dir', children:['photo_vacation.jpg','screenshot_2024.png','wallpaper.jpg','logo.svg'] },
  '/home/user/Музыка': { type:'dir', children:['favorite.mp3','playlist.m3u'] },
  '/home/user/Видео': { type:'dir', children:['tutorial.mp4','clip.avi'] },
  '/home/user/Проекты': { type:'dir', children:['aquaos','webdev','python-scripts'] },
  '/home/user/Проекты/aquaos': { type:'dir', children:['main.html','style.css','app.js','README.md'] },
  '/home/user/Проекты/webdev': { type:'dir', children:['index.html','package.json'] },
  '/home/user/Проекты/python-scripts': { type:'dir', children:['parser.py','utils.py','requirements.txt'] },
  '/home/user/.bashrc': { type:'file', size:256, content:'# AquaOS bash config\nexport PS1="\\[\\033[32m\\]\\u\\[\\033[0m\\]@\\[\\033[34m\\]\\h\\[\\033[0m\\]:\\[\\033[35m\\]\\w\\[\\033[0m\\]$ "\nexport PATH="$HOME/.local/bin:$PATH"\nalias ll="ls -la"\nalias ..="cd .."' },
  '/home/user/.profile': { type:'file', size:128, content:'# Profile\n[ -f ~/.bashrc ] && . ~/.bashrc' },
  '/usr': { type:'dir', children:['bin','lib','local','share'] },
  '/usr/bin': { type:'dir', children:['ls','cat','grep','find','echo','bash','python3','node'] },
  '/etc': { type:'dir', children:['hosts','passwd','fstab','hostname','os-release'] },
  '/etc/hosts': { type:'file', size:64, content:'127.0.0.1 localhost\n127.0.1.1 aquaos\n::1       localhost ip6-localhost' },
  '/etc/hostname': { type:'file', size:8, content:'aquaos' },
  '/etc/os-release': { type:'file', size:180, content:'NAME="AquaOS"\nVERSION="2.0.0 LTS"\nID=aquaos\nPRETTY_NAME="AquaOS 2.0.0 LTS (Tideline)"\nHOME_URL="https://aquaos.dev"' },
  '/var': { type:'dir', children:['log','tmp','cache'] },
  '/tmp': { type:'dir', children:[] },
  '/dev': { type:'dir', children:['sda','sda1','sda2','null','random'] },
};

/* File icons by extension */
function getFileIcon(name, isDir=false) {
  if (isDir) return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`;
  const ext = name.split('.').pop().toLowerCase();
  const icons = {
    txt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    md: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    pdf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M9 13h6M9 17h3"/></svg>`,
    jpg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    png: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    mp3: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    mp4: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
    zip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>`,
    py: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    js: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    css: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  };
  return icons[ext] || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
}

function getFileColor(name, isDir=false) {
  if (isDir) return '#e8a020';
  const ext = name.split('.').pop().toLowerCase();
  const colors = {
    txt:'#8fa8c4', md:'#8fa8c4', pdf:'#f04f5a', jpg:'#27c47a', png:'#27c47a', svg:'#27c47a',
    mp3:'#a07ef0', mp4:'#a07ef0', zip:'#e8a020', py:'#4d9ef5', js:'#f0d020', html:'#f07040',
    css:'#4d9ef5', json:'#f0d020', csv:'#27c47a', docx:'#4d9ef5', pptx:'#f07040',
  };
  return colors[ext] || '#546a82';
}

function formatSize(bytes) {
  if (!bytes) return '--';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/1024/1024).toFixed(1) + ' MB';
}

/* ════════════════════════════════════════════
   CLOCK
════════════════════════════════════════════ */
const DAYS = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
const MONTHS = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
function updateClock() {
  const now = new Date();
  const pad = n => String(n).padStart(2,'0');
  document.getElementById('tb-time').textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  document.getElementById('tb-date').textContent = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
}
setInterval(updateClock, 1000); updateClock();

/* ════════════════════════════════════════════
   STARS
════════════════════════════════════════════ */
(function(){
  const c = document.getElementById('stars'), ctx = c.getContext('2d');
  let stars = [];
  const resize = () => { c.width = innerWidth; c.height = innerHeight; init(); };
  const init = () => { stars = Array.from({length:180}, () => ({
    x: Math.random()*c.width, y: Math.random()*c.height,
    r: Math.random()*1.1+.1, o: Math.random(), s: Math.random()*.4+.1, d: Math.random()>.5?1:-1
  })); };
  const draw = () => {
    ctx.clearRect(0,0,c.width,c.height);
    stars.forEach(s => {
      s.o += s.s*.004*s.d; if(s.o>1||s.o<0) s.d*=-1;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(180,210,255,${s.o})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  resize(); draw(); addEventListener('resize', resize);
})();

/* ════════════════════════════════════════════
   WALLPAPERS
════════════════════════════════════════════ */
const WALLPAPERS = {
  'gradient-default': { bg: 'radial-gradient(ellipse at 20% 60%,#0a1f35 0%,transparent 55%),radial-gradient(ellipse at 80% 20%,#0a0818 0%,transparent 50%),linear-gradient(135deg,#01060c 0%,#070c12 60%,#010408 100%)', img: null, label: 'AquaOS Default' },
  'ocean': { bg: 'linear-gradient(180deg,#001a3a 0%,#003366 50%,#004d80 100%)', img: null, label: 'Ocean Deep' },
  'forest': { bg: 'linear-gradient(180deg,#001a00 0%,#003300 50%,#0a4000 100%)', img: null, label: 'Deep Forest' },
  'sunset': { bg: 'linear-gradient(180deg,#1a0510 0%,#4a1020 40%,#8a2030 70%,#c46020 100%)', img: null, label: 'Sunset Glow' },
  'aurora': { bg: 'linear-gradient(180deg,#010c0a 0%,#032a20 30%,#054a38 60%,#073a50 100%)', img: null, label: 'Aurora Night' },
  'nebula': { bg: 'radial-gradient(circle at 30% 30%,#1a0a3a 0%,#0a0520 50%,#000010 100%)', img: null, label: 'Nebula Space' },
};

function applyWallpaper(key, customUrl=null) {
  SYS.wallpaper = key;
  const wp = WALLPAPERS[key];
  const wallEl = document.getElementById('wallpaper');
  const imgEl = document.getElementById('wallpaper-img');
  if (customUrl) {
    imgEl.style.backgroundImage = `url('${customUrl}')`;
    imgEl.style.opacity = 1;
    wallEl.style.background = '#000';
  } else {
    imgEl.style.opacity = 0;
    wallEl.style.background = wp ? wp.bg : WALLPAPERS['gradient-default'].bg;
  }
}

/* ════════════════════════════════════════════
   WINDOW MANAGER
════════════════════════════════════════════ */
let zTop = 100;
const wins = {};

function createWin(id, title, iconSvg, w, h, x, y, bodyHtml) {
  if (wins[id]) {
    focusWin(id);
    const el = document.getElementById('w-'+id);
    if (el && el.classList.contains('minimized')) el.classList.remove('minimized');
    return;
  }
  const el = document.createElement('div');
  el.className = 'win'; el.id = 'w-'+id;
  el.style.cssText = `width:${w}px;height:${h}px;left:${x}px;top:${y}px;z-index:${++zTop}`;
  el.innerHTML = `
    <div class="win-tb" id="wtb-${id}">
      <button class="wb wb-c" onclick="closeWin('${id}')"></button>
      <button class="wb wb-m" onclick="minWin('${id}')"></button>
      <button class="wb wb-z" onclick="maxWin('${id}')"></button>
      <span class="win-title">${iconSvg}${title}</span>
    </div>
    <div class="win-body" id="wb-${id}">${bodyHtml}</div>
    <div class="rh" id="rh-${id}"></div>
  `;
  document.getElementById('desktop-area').appendChild(el);
  wins[id] = { el, maximized:false, prevRect:null };
  makeDraggable(el, id); makeResizable(el, id);
  el.addEventListener('mousedown', () => focusWin(id));
  focusWin(id);
  el.animate([{opacity:0,transform:'scale(.9) translateY(10px)'},{opacity:1,transform:'scale(1) translateY(0)'}],{duration:200,easing:'cubic-bezier(.34,1.56,.64,1)',fill:'forwards'});
  updateDockDots();
}

function focusWin(id) {
  document.querySelectorAll('.win').forEach(w => w.classList.remove('focused'));
  const el = document.getElementById('w-'+id);
  if (el) { el.style.zIndex = ++zTop; el.classList.add('focused'); }
}

function closeWin(id) {
  const el = document.getElementById('w-'+id);
  if (!el) return;
  el.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.88)'}],{duration:160,fill:'forwards'})
    .onfinish = () => { el.remove(); delete wins[id]; updateDockDots(); };
}

function minWin(id) {
  const el = document.getElementById('w-'+id);
  if (el) el.classList.toggle('minimized');
  updateDockDots();
}

function maxWin(id) {
  const w = wins[id]; if (!w) return;
  const el = w.el, da = document.getElementById('desktop-area');
  if (w.maximized) {
    el.style.cssText = w.prevRect + `;z-index:${el.style.zIndex}`;
    w.maximized = false;
  } else {
    w.prevRect = `width:${el.offsetWidth}px;height:${el.offsetHeight}px;left:${el.offsetLeft}px;top:${el.offsetTop}px`;
    el.style.cssText = `width:${da.offsetWidth}px;height:${da.offsetHeight}px;left:0;top:0;z-index:${el.style.zIndex}`;
    w.maximized = true;
  }
}

function makeDraggable(el, id) {
  const tb = document.getElementById('wtb-'+id);
  let dx, dy, drag = false;
  tb.addEventListener('mousedown', e => {
    if (e.target.classList.contains('wb')) return;
    if (wins[id] && wins[id].maximized) return;
    drag = true; dx = e.clientX - el.offsetLeft; dy = e.clientY - el.offsetTop;
    focusWin(id);
  });
  document.addEventListener('mousemove', e => {
    if (!drag) return;
    const da = document.getElementById('desktop-area');
    let nx = e.clientX-dx, ny = e.clientY-dy;
    nx = Math.max(-el.offsetWidth+80, Math.min(da.offsetWidth-80, nx));
    ny = Math.max(0, Math.min(da.offsetHeight-36, ny));
    el.style.left = nx+'px'; el.style.top = ny+'px';
  });
  document.addEventListener('mouseup', () => drag = false);
}

function makeResizable(el, id) {
  const rh = document.getElementById('rh-'+id);
  let resizing = false, sx, sy, sw, sh;
  rh.addEventListener('mousedown', e => {
    resizing = true; sx = e.clientX; sy = e.clientY; sw = el.offsetWidth; sh = el.offsetHeight;
    e.stopPropagation();
  });
  document.addEventListener('mousemove', e => {
    if (!resizing) return;
    el.style.width = Math.max(320, sw+e.clientX-sx)+'px';
    el.style.height = Math.max(240, sh+e.clientY-sy)+'px';
  });
  document.addEventListener('mouseup', () => resizing = false);
}

function updateDockDots() {
  document.querySelectorAll('.d-item').forEach(item => {
    const app = item.dataset.app;
    const win = document.getElementById('w-'+app);
    item.classList.toggle('active', !!(win && !win.classList.contains('minimized')));
  });
}

const rand = (min,max) => min + Math.random()*(max-min);

/* ════════════════════════════════════════════
   DESKTOP ICONS
════════════════════════════════════════════ */
const DESKTOP_APPS = [
  { id:'browser', label:'Браузер', color:'linear-gradient(135deg,#1a4a9e,#0d3580)',
    svg:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>` },
  { id:'files', label:'Файлы', color:'linear-gradient(135deg,#1a6b3a,#0e4a28)',
    svg:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>` },
  { id:'terminal', label:'Терминал', color:'linear-gradient(135deg,#1a1a2e,#12122a)',
    svg:`<svg viewBox="0 0 24 24" fill="none" stroke="#27c47a" stroke-width="1.8"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>` },
  { id:'calc', label:'Калькулятор', color:'linear-gradient(135deg,#6a1a8a,#4a0e6e)',
    svg:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="16" cy="10" r="1"/><circle cx="8" cy="14" r="1"/><circle cx="12" cy="14" r="1"/><circle cx="16" cy="14" r="1"/><line x1="8" y1="18" x2="12" y2="18"/><circle cx="16" cy="18" r="1"/></svg>` },
  { id:'editor', label:'Редактор', color:'linear-gradient(135deg,#8a6a1a,#6e4a0e)',
    svg:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>` },
  { id:'settings', label:'Настройки', color:'linear-gradient(135deg,#3a3a3a,#1a1a1a)',
    svg:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>` },
  { id:'clock', label:'Часы', color:'linear-gradient(135deg,#1a4a6a,#0e2f4a)',
    svg:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
  { id:'about', label:'О системе', color:'linear-gradient(135deg,#4d9ef5,#1a6fd4)',
    svg:`<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` },
];

function buildDesktopIcons() {
  const da = document.getElementById('desktop-area');
  DESKTOP_APPS.forEach((app, i) => {
    const el = document.createElement('div');
    el.className = 'di'; el.dataset.app = app.id;
    el.style.cssText = `top:${16 + i*82}px;left:14px`;
    el.innerHTML = `<div class="di-icon" style="background:${app.color}">${app.svg}</div><div class="di-label">${app.label}</div>`;
    el.addEventListener('dblclick', () => openApp(app.id));
    da.appendChild(el);
  });
}

/* ════════════════════════════════════════════
   APP: BROWSER
════════════════════════════════════════════ */
let brHistory = [], brIdx = -1;

function openApp_browser(x,y) {
  const svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`;
  const html = `
    <div class="br-toolbar">
      <button class="br-nav" id="br-back" onclick="brNav(-1)" disabled title="Назад">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button class="br-nav" id="br-fwd" onclick="brNav(1)" disabled title="Вперёд">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <button class="br-nav" id="br-reload" onclick="brReload()" title="Обновить">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
      </button>
      <button class="br-nav" onclick="brHome()" title="Домой">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </button>
      <input type="text" class="br-url" id="br-url" value="aquaos://newtab" placeholder="Введите URL или поисковый запрос...">
      <button class="br-nav" onclick="brGo()" title="Перейти" style="color:var(--grn)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <button class="br-nav" onclick="brDownloadPage()" title="Скачать страницу">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      </button>
      <button class="br-nav" onclick="brExternal()" title="Открыть в новой вкладке">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </button>
    </div>
    <div class="br-loading"><div class="br-loading-bar" id="br-prog" style="width:0%"></div></div>
    <div class="br-frame" id="br-frame">${brNewTabHTML()}</div>
    <div id="br-dlbar" style="display:none" class="br-dl-bar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/></svg>
      <span id="br-dl-text">Загрузка завершена</span>
    </div>
  `;
  createWin('browser','AquaBrowser',svg,1000,660,x,y,html);
  const urlEl = document.getElementById('br-url');
  if (urlEl) urlEl.addEventListener('keydown', e => { if(e.key==='Enter') brGo(); });
}

function brNewTabHTML() {
  return `<div class="br-newtab">
    <div style="text-align:center">
      <div style="font-size:11px;color:var(--t4);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">AquaBrowser</div>
      <h2 style="font-size:24px;font-weight:300;color:var(--t1);letter-spacing:-1px">Что хотите найти?</h2>
    </div>
    <div class="br-search-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input id="br-search-inp" placeholder="Поиск в интернете...">
    </div>
    <div class="br-bookmarks">
      ${[['Google','#4d9ef5','https://www.google.com',`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`],
         ['GitHub','#8fa8c4','https://github.com',`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`],
         ['YouTube','#f04f5a','https://www.youtube.com',`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>`],
         ['Wikipedia','#8fa8c4','https://www.wikipedia.org',`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`],
         ['Discord','#a07ef0','https://discord.com',`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>`],
         ['ChatGPT','#27c47a','https://chat.openai.com',`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`]
        ].map(([name,color,url,svg]) => `
        <div class="br-bm" onclick="brLoad('${url}',true)">
          <div style="color:${color};width:28px;height:28px">${svg}</div>
          <span>${name}</span>
        </div>`).join('')}
    </div>
  </div>`;
}

function brGo() {
  let url = (document.getElementById('br-url')||{}).value||'';
  url = url.trim();
  if (!url || url === 'aquaos://newtab') { brHome(); return; }
  if (!url.startsWith('http') && !url.includes('.')) {
    url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
  } else if (!url.startsWith('http')) {
    url = 'https://' + url;
  }
  brLoad(url, true);
}

function brLoad(url, addHistory=true) {
  const frame = document.getElementById('br-frame');
  const urlEl = document.getElementById('br-url');
  const prog = document.getElementById('br-prog');
  if (!frame) return;
  if (urlEl) urlEl.value = url;
  if (addHistory) { brHistory = brHistory.slice(0, brIdx+1); brHistory.push(url); brIdx = brHistory.length-1; }
  const backBtn = document.getElementById('br-back'); const fwdBtn = document.getElementById('br-fwd');
  if (backBtn) backBtn.disabled = brIdx <= 0;
  if (fwdBtn) fwdBtn.disabled = brIdx >= brHistory.length-1;

  if (prog) { prog.style.width='0%'; setTimeout(()=>prog.style.width='40%',50); setTimeout(()=>prog.style.width='80%',400); setTimeout(()=>prog.style.width='100%',800); setTimeout(()=>prog.style.width='0%',1100); }

  // Direct file download detection
  const dlExts = ['.pdf','.zip','.mp3','.mp4','.avi','.tar.gz','.deb','.exe','.apk','.dmg','.iso','.pkg','.docx','.xlsx','.pptx','.csv'];
  const isDirectFile = dlExts.some(ext => url.toLowerCase().includes(ext));
  if (isDirectFile) { brDirectDownload(url); return; }

  frame.innerHTML = `
    <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:var(--bg)">
      <div style="width:36px;height:36px;border:3px solid var(--b2);border-top-color:var(--acc);border-radius:50%;animation:spin .7s linear infinite"></div>
      <div style="font-size:13px;color:var(--t3)">Загрузка ${url.replace('https://','').split('/')[0]}...</div>
    </div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
  `;

  setTimeout(() => {
    const fr = document.getElementById('br-frame'); if (!fr) return;
    const iframe = document.createElement('iframe');
    iframe.src = ("/api/proxy?url=" + encodeURIComponent(url));
    iframe.style.cssText = 'width:100%;height:100%;border:none';
    iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation');
    iframe.addEventListener('error', () => showBrOverlay(url));
    fr.innerHTML = '';
    fr.appendChild(iframe);
    iframe.addEventListener('load', () => {
      try {
        const blocked = iframe.contentDocument === null;
        if (blocked) showBrOverlay(url);
      } catch(e) { /* cross-origin is fine, means loaded */ }
    });
    showNotif('Браузер', url.replace('https://','').replace('http://','').split('/')[0], `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`);
  }, 500);
}

function showBrOverlay(url) {
  const fr = document.getElementById('br-frame');
  if (!fr) return;
  const host = url.replace(/https?:\/\//,'').split('/')[0];
  // Create overlay on top of iframe
  const ov = document.createElement('div');
  ov.className = 'br-overlay';
  ov.innerHTML = `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
    <h3>${host}</h3>
    <p>Сайт блокирует встроенный просмотр.<br>Откройте в новой вкладке браузера.</p>
    <div class="br-overlay-btns">
      <button class="m-btn primary" onclick="window.open('${url}','_blank');document.querySelector('.br-overlay')&&document.querySelector('.br-overlay').remove()">Открыть в браузере</button>
      <button class="m-btn secondary" onclick="this.closest('.br-overlay').remove()">Закрыть</button>
    </div>
  `;
  fr.style.position = 'relative';
  fr.appendChild(ov);
}

function brDirectDownload(url) {
  const name = url.split('/').pop() || 'download';
  const a = document.createElement('a'); a.href = url; a.download = name; a.target='_blank';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  const bar = document.getElementById('br-dlbar'); const txt = document.getElementById('br-dl-text');
  if (bar && txt) { bar.style.display='flex'; txt.textContent=`Скачивание: ${name}`; setTimeout(()=>{bar.style.display='none'},4000); }
  addToDownloads(name, url);
  showNotif('Загрузка', name, `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--grn)" stroke-width="2"><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`);
}

function brDownloadPage() {
  const url = (document.getElementById('br-url')||{}).value||'';
  if (!url || url === 'aquaos://newtab') { showNotif('Браузер','Нечего скачивать','⚠️'); return; }
  window.open(url, '_blank');
  showNotif('Загрузка', 'Страница открыта для сохранения', `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--grn)" stroke-width="2"><polyline points="7 10 12 15 17 10"/></svg>`);
}

function brExternal() {
  const url = (document.getElementById('br-url')||{}).value||'';
  if (url && url !== 'aquaos://newtab') window.open(url,'_blank');
}

function brHome() {
  const fr = document.getElementById('br-frame'); if(fr) fr.innerHTML = brNewTabHTML();
  const urlEl = document.getElementById('br-url'); if(urlEl) urlEl.value = 'aquaos://newtab';
  const si = document.getElementById('br-search-inp');
  if(si) si.addEventListener('keydown', e => { if(e.key==='Enter') { brLoad('https://www.google.com/search?q='+encodeURIComponent(si.value),true); } });
}

function brReload() {
  const fr = document.getElementById('br-frame');
  if (!fr) return;
  const iframe = fr.querySelector('iframe');
  if (iframe) { const s = iframe.src; iframe.src='about:blank'; setTimeout(()=>iframe.src=s,100); }
}

function brNav(dir) {
  brIdx += dir; if(brIdx<0) brIdx=0; if(brIdx>=brHistory.length) brIdx=brHistory.length-1;
  brLoad(brHistory[brIdx], false);
}

function addToDownloads(name, url) {
  SYS.downloads.push({name,url,time:new Date().toLocaleTimeString('ru-RU')});
  SYS.disk.used += Math.floor(Math.random()*50+10);
  if (!FS['/home/user/Загрузки']) FS['/home/user/Загрузки'] = {type:'dir',children:[]};
  if (!FS['/home/user/Загрузки'].children.includes(name)) FS['/home/user/Загрузки'].children.push(name);
}

/* ════════════════════════════════════════════
   APP: FILE MANAGER
════════════════════════════════════════════ */
let fmCwd = '/home/user';
let fmView = 'grid';

function openApp_files(x,y) {
  const svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`;
  const html = `
    <div class="app-toolbar">
      <button class="tb-btn" onclick="fmUp()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        Назад
      </button>
      <button class="tb-btn" onclick="fmRefresh()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
      </button>
      <input class="tb-input" id="fm-path-input" value="${fmCwd}" style="flex:1;font-size:12px" onkeydown="if(event.key==='Enter')fmNavigate(this.value)">
      <button class="tb-btn" onclick="fmToggleView()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
      </button>
      <button class="tb-btn" onclick="fmNewFolder()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
        Папка
      </button>
    </div>
    <div class="fm-layout">
      <div class="fm-sidebar" id="fm-sidebar">${buildFmSidebar()}</div>
      <div style="flex:1;display:flex;flex-direction:column;overflow:hidden">
        <div class="fm-content" id="fm-content">${buildFmContent()}</div>
        <div class="fm-status">
          <span id="fm-status-text">${getFmStatusText()}</span>
          <div style="margin-left:auto;display:flex;align-items:center;gap:8px">
            <span style="color:var(--t4)">Диск:</span>
            <div class="disk-bar"><div class="disk-fill" style="width:${Math.round(SYS.disk.used/SYS.disk.total*100)}%"></div></div>
            <span style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--t3)">${(SYS.disk.used/1024).toFixed(1)}/${(SYS.disk.total/1024).toFixed(1)} GB</span>
          </div>
        </div>
      </div>
    </div>
  `;
  createWin('files','Файловый менеджер',svg,860,560,x,y,html);
}

function buildFmSidebar() {
  const items = [
    { label:'Главная', path:'/home/user', svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`, group:'Места' },
    { label:'Рабочий стол', path:'/home/user/Рабочий стол', svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`, group:'Места' },
    { label:'Документы', path:'/home/user/Документы', svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`, group:'Места' },
    { label:'Загрузки', path:'/home/user/Загрузки', svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/></svg>`, group:'Места' },
    { label:'Картинки', path:'/home/user/Картинки', svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`, group:'Места' },
    { label:'Музыка', path:'/home/user/Музыка', svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`, group:'Места' },
    { label:'Видео', path:'/home/user/Видео', svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`, group:'Места' },
    { label:'Проекты', path:'/home/user/Проекты', svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`, group:'Места' },
    { label:'Корень /', path:'/', svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`, group:'Система' },
    { label:'/etc', path:'/etc', svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`, group:'Система' },
    { label:'sda1 (OS)', path:'/', svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`, group:'Устройства' },
  ];
  let html = ''; let lastGroup = '';
  items.forEach(item => {
    if (item.group !== lastGroup) { html += `<div class="fm-si-group">${item.group}</div>`; lastGroup = item.group; }
    const isActive = fmCwd === item.path;
    html += `<div class="fm-si ${isActive?'active':''}" onclick="fmNavigate('${item.path}',this)">${item.svg}${item.label}</div>`;
  });
  return html;
}

function buildFmContent() {
  const node = FS[fmCwd]; if (!node) return '<div style="padding:20px;color:var(--t4)">Пустой каталог</div>';
  const children = node.children || [];
  if (children.length === 0) return '<div style="padding:30px;color:var(--t4);text-align:center"><div style="font-size:32px;margin-bottom:8px">📭</div>Пустая папка</div>';

  if (fmView === 'list') {
    return `<div style="padding:8px">
      <div class="fm-list-header"><span>Имя</span><span>Тип</span><span>Размер</span><span>Изменён</span></div>
      ${children.map(name => {
        const childPath = fmCwd+'/'+name;
        const childNode = FS[childPath];
        const isDir = childNode && childNode.type==='dir';
        const ext = isDir ? 'Папка' : (name.includes('.') ? name.split('.').pop().toUpperCase() : 'Файл');
        const color = getFileColor(name, isDir);
        return `<div class="fm-list-row" ondblclick="fmOpen('${name}')">
          <span class="row-name" style="color:${color}">${getFileIcon(name,isDir)}${name}</span>
          <span>${ext}</span>
          <span>${isDir?'—':formatSize((childNode&&childNode.size)||Math.floor(Math.random()*5000+100))}</span>
          <span>${new Date(Date.now()-Math.random()*1e10).toLocaleDateString('ru-RU')}</span>
        </div>`;
      }).join('')}
    </div>`;
  }

  return `<div class="fm-grid">
    ${children.map(name => {
      const childPath = fmCwd+'/'+name;
      const childNode = FS[childPath];
      const isDir = childNode && childNode.type==='dir';
      const color = getFileColor(name, isDir);
      return `<div class="fm-file" ondblclick="fmOpen('${name}')">
        <div class="ff-icon" style="background:${color}20;color:${color}">${getFileIcon(name,isDir)}</div>
        <div class="ff-name">${name}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function getFmStatusText() {
  const node = FS[fmCwd];
  const count = node ? (node.children||[]).length : 0;
  return `${fmCwd} — ${count} объектов`;
}

function fmNavigate(path, el) {
  if (FS[path] && FS[path].type==='dir') {
    fmCwd = path;
    const inp = document.getElementById('fm-path-input'); if(inp) inp.value = path;
    const content = document.getElementById('fm-content'); if(content) content.innerHTML = buildFmContent();
    const status = document.getElementById('fm-status-text'); if(status) status.textContent = getFmStatusText();
    document.querySelectorAll('.fm-si').forEach(i=>i.classList.remove('active'));
    if(el) el.classList.add('active');
  }
}

function fmOpen(name) {
  const path = fmCwd + '/' + name;
  const node = FS[path];
  if (node && node.type==='dir') { fmNavigate(path); return; }
  openFileViewer(name, node);
}

function fmUp() {
  const parts = fmCwd.split('/').filter(Boolean);
  if (parts.length === 0) return;
  parts.pop();
  fmNavigate(parts.length ? '/'+parts.join('/') : '/');
}

function fmRefresh() {
  const content = document.getElementById('fm-content'); if(content) content.innerHTML = buildFmContent();
}

function fmToggleView() {
  fmView = fmView === 'grid' ? 'list' : 'grid';
  fmRefresh();
}

function fmNewFolder() {
  const name = prompt('Имя новой папки:', 'Новая папка');
  if (!name) return;
  const path = fmCwd+'/'+name;
  FS[path] = {type:'dir',children:[]};
  if (!FS[fmCwd].children) FS[fmCwd].children = [];
  FS[fmCwd].children.push(name);
  fmRefresh();
  showNotif('Файлы', `Папка «${name}» создана`, `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--grn)" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`);
}

/* ════════════════════════════════════════════
   APP: FILE VIEWER
════════════════════════════════════════════ */
function openFileViewer(name, node) {
  const ext = name.split('.').pop().toLowerCase();
  const color = getFileColor(name);
  const svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

  let bodyHtml = '';
  const canText = ['txt','md','py','js','html','css','json','csv','sh','conf','cfg','ini','log','xml','yaml','yml','bashrc','profile','hosts','passwd','fstab','hostname','os-release'];
  const canImg = ['jpg','jpeg','png','gif','webp','svg','bmp'];
  const canMedia = ['mp3','mp4','webm','ogg','wav'];

  if (canText.includes(ext) || !name.includes('.')) {
    const content = node ? (node.content || '# Содержимое файла недоступно') : '# Файл не найден';
    bodyHtml = `
      <div class="app-toolbar">
        <button class="tb-btn" onclick="fvDownload('${name}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Скачать
        </button>
        <button class="tb-btn accent" onclick="fvSave('${name}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Сохранить
        </button>
      </div>
      <textarea class="fv-text" id="fv-textarea" style="flex:1;padding:20px;width:100%;resize:none;background:var(--bg);color:var(--t1);border:none;outline:none;font-family:'IBM Plex Mono',monospace;font-size:13px;line-height:1.7">${escHtml(content)}</textarea>
    `;
  } else if (canImg.includes(ext)) {
    bodyHtml = `
      <div class="app-toolbar">
        <button class="tb-btn" onclick="window.open('','_blank').document.write('<img src=\'...\' style=\'max-width:100%\'>')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>Просмотр
        </button>
      </div>
      <div class="fv-body">
        <div class="fv-no-prev">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <div>${name}</div>
          <div style="font-size:12px;color:var(--t4)">Изображение · для просмотра откройте оригинальный файл</div>
        </div>
      </div>
    `;
  } else if (canMedia.includes(ext)) {
    bodyHtml = `
      <div class="fv-body">
        <div class="fv-no-prev">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="width:48px;height:48px;opacity:.3"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
          <div style="font-size:16px;font-weight:500;color:var(--t2)">${name}</div>
          <div style="font-size:12px;color:var(--t4)">Медиафайл — для воспроизведения перетащите в браузер</div>
        </div>
      </div>
    `;
  } else {
    bodyHtml = `
      <div class="fv-body">
        <div class="fv-no-prev">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="width:48px;height:48px;opacity:.3;color:${color}"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <div style="font-size:16px;font-weight:500;color:var(--t2)">${name}</div>
          <div style="font-size:12px;color:var(--t4)">Тип файла: ${ext.toUpperCase()}</div>
          <button class="tb-btn accent" onclick="fvDownload('${name}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 10 12 15 17 10"/></svg> Скачать файл
          </button>
        </div>
      </div>
    `;
  }

  createWin('viewer-'+name, name, svg, 700, 520, rand(100,300), rand(60,150), bodyHtml);
}

function fvDownload(name) {
  const node = FS[fmCwd+'/'+name];
  const content = node ? (node.content || '') : '';
  const blob = new Blob([content], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotif('Загрузка', `${name} сохранён`, `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--grn)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`);
}

function fvSave(name) {
  const ta = document.getElementById('fv-textarea');
  if (!ta) return;
  const path = fmCwd+'/'+name;
  if (!FS[path]) FS[path] = {type:'file'};
  FS[path].content = ta.value;
  showNotif('Редактор', `${name} сохранён`, `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--grn)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`);
}

/* ════════════════════════════════════════════
   APP: TERMINAL
════════════════════════════════════════════ */
let termCwd = '/home/user', termHistory = [], termHistIdx = -1;

function openApp_terminal(x,y) {
  const svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`;
  const html = `
    <div class="term-body" id="term-body">
      <span class="t-success">AquaOS Terminal v2.0 — ядро 6.8.0-aqua</span>
      <span class="t-out" style="color:var(--t4)">Введите <span style="color:var(--acc)">help</span> для списка команд.</span>
      <br>
    </div>
    <div class="term-input-row">
      <span class="t-prompt">${SYS.user}</span><span style="color:var(--t4)">@</span><span class="t-host">${SYS.hostname}</span><span style="color:var(--t4)">:</span><span class="t-dir" id="term-cwd">${termCwd}</span><span style="color:var(--t4)">&nbsp;$&nbsp;</span>
      <input id="term-input" autocomplete="off" spellcheck="false">
    </div>
  `;
  createWin('terminal','Терминал',svg,700,460,x,y,html);
  const inp = document.getElementById('term-input');
  if (inp) { inp.focus(); inp.addEventListener('keydown', termKey); }
}

function termKey(e) {
  const inp = document.getElementById('term-input');
  if (e.key === 'Enter') {
    const cmd = inp.value.trim(); inp.value = '';
    if (cmd) { termHistory.unshift(cmd); termHistIdx = -1; }
    termRun(cmd);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (termHistIdx < termHistory.length-1) { termHistIdx++; inp.value = termHistory[termHistIdx]; }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (termHistIdx > 0) { termHistIdx--; inp.value = termHistory[termHistIdx]; }
    else { termHistIdx = -1; inp.value = ''; }
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const parts = inp.value.split(' '), last = parts[parts.length-1];
    const dir = (FS[termCwd]||{}).children || [];
    const m = dir.find(f => f.startsWith(last));
    if (m) { parts[parts.length-1] = m; inp.value = parts.join(' '); }
  }
}

function termPrint(text, cls='t-out') {
  const body = document.getElementById('term-body'); if (!body) return;
  const line = document.createElement('span');
  line.className = cls; line.textContent = text;
  body.insertBefore(line, body.lastElementChild.previousElementSibling || body.lastElementChild);
  body.insertBefore(document.createElement('br'), body.lastElementChild.previousElementSibling || body.lastElementChild);
  body.scrollTop = body.scrollHeight;
}

function termRun(cmd) {
  const body = document.getElementById('term-body'); if (!body) return;
  const echo = document.createElement('div');
  echo.style.cssText = 'display:flex;gap:0;font-family:"IBM Plex Mono",monospace;font-size:13px;line-height:1.55';
  echo.innerHTML = `<span class="t-prompt">${SYS.user}</span><span style="color:var(--t4)">@</span><span class="t-host">${SYS.hostname}</span><span style="color:var(--t4)">:</span><span class="t-dir">${termCwd}</span><span style="color:var(--t4)">&nbsp;$&nbsp;</span><span style="color:var(--t1)">${escHtml(cmd)}</span>`;
  const last = body.lastElementChild; body.insertBefore(echo, last);
  if (!cmd) { body.scrollTop = body.scrollHeight; return; }

  const args = cmd.trim().split(/\s+/), c = args[0];
  const CMDS = {
    help: () => {
      termPrint('Доступные команды:','t-success');
      ['ls [dir]','cd <dir>','pwd','mkdir <name>','rmdir <name>','touch <file>','cat <file>','echo <text>','clear','date','uname [-a]','whoami','id','uptime','df [-h]','free','ps','kill','history','env','export','alias','neofetch','open <app>','download <url>','exit'].forEach(c=>termPrint('  '+c));
    },
    ls: () => {
      const path = args[1] ? (args[1].startsWith('/')?args[1]:termCwd+'/'+args[1]) : termCwd;
      const node = FS[path];
      if (!node) { termPrint(`ls: ${args[1]}: Нет такого файла`,'t-err'); return; }
      const children = node.children || [];
      if (!children.length) { termPrint('(пусто)'); return; }
      termPrint(children.map(f=>{const cp=path+'/'+f;const n=FS[cp];return(n&&n.type==='dir')?'\x1b[34m'+f+'/':f}).join('  '));
    },
    cd: () => {
      const target = args[1];
      if (!target || target==='~') { termCwd='/home/user'; }
      else if (target==='..') {
        const parts = termCwd.split('/').filter(Boolean); parts.pop();
        termCwd = parts.length ? '/'+parts.join('/') : '/';
      } else if (target==='-') { termCwd='/home/user'; }
      else {
        const np = target.startsWith('/')?target:termCwd+'/'+target;
        if (FS[np] && FS[np].type==='dir') termCwd=np;
        else { termPrint(`cd: ${target}: Нет такого каталога`,'t-err'); return; }
      }
      const el = document.getElementById('term-cwd'); if(el) el.textContent=termCwd;
    },
    pwd: () => termPrint(termCwd),
    mkdir: () => {
      if (!args[1]) { termPrint('mkdir: укажите имя','t-err'); return; }
      const path = termCwd+'/'+args[1];
      if (!FS[termCwd]) { termPrint(`mkdir: ${termCwd}: не каталог`,'t-err'); return; }
      FS[path] = {type:'dir',children:[]};
      if (!FS[termCwd].children) FS[termCwd].children=[];
      FS[termCwd].children.push(args[1]);
      termPrint(`Создан: ${path}`,'t-success');
    },
    rmdir: () => {
      if (!args[1]) { termPrint('rmdir: укажите имя','t-err'); return; }
      const path = termCwd+'/'+args[1];
      if (!FS[path]) { termPrint(`rmdir: ${args[1]}: нет такого каталога`,'t-err'); return; }
      delete FS[path];
      if (FS[termCwd]) FS[termCwd].children = FS[termCwd].children.filter(f=>f!==args[1]);
      termPrint(`Удалён: ${path}`,'t-success');
    },
    touch: () => {
      if (!args[1]) { termPrint('touch: укажите имя файла','t-err'); return; }
      const path = termCwd+'/'+args[1];
      if (!FS[path]) { FS[path]={type:'file',size:0,content:''}; FS[termCwd].children.push(args[1]); }
      termPrint(`${args[1]}: файл создан`,'t-success');
    },
    cat: () => {
      if (!args[1]) { termPrint('cat: укажите файл','t-err'); return; }
      const path = termCwd+'/'+args[1];
      const node = FS[path];
      if (!node || node.type==='dir') { termPrint(`cat: ${args[1]}: нет такого файла`,'t-err'); return; }
      termPrint(node.content || '(пустой файл)');
    },
    echo: () => termPrint(args.slice(1).join(' ').replace(/"/g,'')),
    clear: () => { body.innerHTML=''; termPrint(''); },
    date: () => termPrint(new Date().toLocaleString('ru-RU',{dateStyle:'full',timeStyle:'medium'})),
    uname: () => termPrint(args[1]==='-a'?`Linux ${SYS.hostname} 6.8.0-aqua-generic #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`:'Linux'),
    whoami: () => termPrint(SYS.user),
    id: () => termPrint(`uid=1000(${SYS.user}) gid=1000(${SYS.user}) groups=1000(${SYS.user}),4(adm),24(cdrom),27(sudo)`),
    uptime: () => {
      const up = Math.floor(performance.now()/1000);
      termPrint(` ${new Date().toLocaleTimeString('ru-RU')}  up ${Math.floor(up/3600)}:${String(Math.floor((up%3600)/60)).padStart(2,'0')},  1 user,  load average: 0.10, 0.08, 0.04`);
    },
    df: () => {
      termPrint('Файловая система         1G-блоки  Использ. Доступно Исп% Точка монтирования');
      termPrint(`/dev/sda1               ${SYS.disk.total/1024}        ${(SYS.disk.used/1024).toFixed(0)}     ${((SYS.disk.total-SYS.disk.used)/1024).toFixed(0)}   ${Math.round(SYS.disk.used/SYS.disk.total*100)}%  /`);
      termPrint('tmpfs                   2.0         0.0     2.0    0%  /tmp');
    },
    free: () => {
      termPrint('              total        used        free');
      termPrint('Mem:        8192       3421       4771');
      termPrint('Swap:       2048        128       1920');
    },
    ps: () => {
      termPrint('  PID TTY          TIME CMD');
      termPrint(' 1024 pts/0    00:00:00 bash');
      termPrint(' 1337 pts/0    00:00:00 aquaos-de');
      termPrint(' 2048 pts/0    00:00:00 ps');
    },
    kill: () => termPrint(`kill: процесс ${args[1]||'?'} завершён`,'t-success'),
    history: () => termHistory.slice().reverse().forEach((h,i) => termPrint(`  ${String(i+1).padStart(3)}  ${h}`)),
    env: () => {
      termPrint(`USER=${SYS.user}\nHOME=/home/${SYS.user}\nPATH=/usr/local/bin:/usr/bin:/bin\nSHELL=/bin/aquash\nTERM=aquaterm-256color\nLANG=ru_RU.UTF-8`);
    },
    export: () => termPrint(args.slice(1).join(' '),'t-success'),
    alias: () => termPrint("alias ll='ls -la'\nalias ..='cd ..'"),
    neofetch: () => {
      const color = (s,c) => `<span style="color:${c}">${s}</span>`;
      const lines = [
        `${color('       .:::::::.','#4d9ef5')}   ${color(SYS.user+'@'+SYS.hostname,'#27c47a')}`,
        `${color('     .:::::::::::.','#4d9ef5')}   ${color('─'.repeat(20),'#1a2436')}`,
        `${color('   .:::::::::::::::.','#4d9ef5')}   OS: ${color('AquaOS 2.0 LTS','#dde8f5')}`,
        `${color('  ::::  AQUAOS  ::::','#4d9ef5')}   Ядро: ${color('6.8.0-aqua-generic','#dde8f5')}`,
        `${color('   \'::::::::::::::;','#4d9ef5')}   Shell: ${color('aquash 2.0','#dde8f5')}`,
        `${color('     \':::::::::;','#4d9ef5')}   DE: ${color('AquaDE 3.2','#dde8f5')}`,
        `${color('       \':::::::;','#4d9ef5')}   Память: ${color(`${3421} MB / 8192 MB`,'#dde8f5')}`,
        `${color('         \'::;','#4d9ef5')}   Диск: ${color(`${(SYS.disk.used/1024).toFixed(1)}/${(SYS.disk.total/1024).toFixed(0)} GB`,'#dde8f5')}`,
        '',
      ];
      const body2 = document.getElementById('term-body'); if(!body2)return;
      lines.forEach(l => {
        const el = document.createElement('div');
        el.style.fontFamily = '"IBM Plex Mono",monospace';
        el.innerHTML = l; body2.insertBefore(el, body2.lastElementChild);
      });
      // Color blocks
      const cb = document.createElement('div');
      cb.innerHTML = `<span style="display:inline-block;width:12px;height:12px;border-radius:2px;margin-right:3px;background:${['#f04f5a','#e8a020','#27c47a','#4d9ef5','#a07ef0','#20d4d4','#dde8f5','#546a82'].join('" /><span style="display:inline-block;width:12px;height:12px;border-radius:2px;margin-right:3px;background:')}"/>`;
      body2.insertBefore(cb, body2.lastElementChild);
      body2.scrollTop = body2.scrollHeight;
    },
    open: () => {
      const app = args[1];
      if (app) { openApp(app); termPrint(`Открыто: ${app}`,'t-success'); }
      else termPrint('open: укажите приложение','t-err');
    },
    download: () => {
      const url = args[1];
      if (!url) { termPrint('download: укажите URL','t-err'); return; }
      const a = document.createElement('a'); a.href=url; a.download=url.split('/').pop()||'file'; a.target='_blank';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      termPrint(`Загрузка: ${url}`,'t-success');
      addToDownloads(url.split('/').pop()||'file', url);
    },
    exit: () => closeWin('terminal'),
  };

  if (CMDS[c]) CMDS[c]();
  else termPrint(`${c}: команда не найдена. Введите 'help'`,'t-err');
  body.scrollTop = body.scrollHeight;
}

/* ════════════════════════════════════════════
   APP: CALCULATOR
════════════════════════════════════════════ */
let CS = { val:'0', op:null, prev:null, newNum:true, expr:'' };
let calcHist = [];

function openApp_calc(x,y) {
  const svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/></svg>`;
  const html = `
    <div class="calc-body">
      <div class="calc-history" id="calc-hist"></div>
      <div class="calc-display">
        <div class="calc-expr-line" id="calc-expr"></div>
        <div class="calc-main-val" id="calc-val">0</div>
      </div>
      <div class="calc-grid">
        <button class="calc-btn c-clr" onclick="cFn('AC')">AC</button>
        <button class="calc-btn c-fn" onclick="cFn('+/-')">+/−</button>
        <button class="calc-btn c-fn" onclick="cFn('%')">%</button>
        <button class="calc-btn c-op" onclick="cOp('/')">÷</button>

        <button class="calc-btn c-num" onclick="cNum('7')">7</button>
        <button class="calc-btn c-num" onclick="cNum('8')">8</button>
        <button class="calc-btn c-num" onclick="cNum('9')">9</button>
        <button class="calc-btn c-op" onclick="cOp('*')">×</button>

        <button class="calc-btn c-num" onclick="cNum('4')">4</button>
        <button class="calc-btn c-num" onclick="cNum('5')">5</button>
        <button class="calc-btn c-num" onclick="cNum('6')">6</button>
        <button class="calc-btn c-op" onclick="cOp('-')">−</button>

        <button class="calc-btn c-num" onclick="cNum('1')">1</button>
        <button class="calc-btn c-num" onclick="cNum('2')">2</button>
        <button class="calc-btn c-num" onclick="cNum('3')">3</button>
        <button class="calc-btn c-op" onclick="cOp('+')">+</button>

        <button class="calc-btn c-num span2" onclick="cNum('0')">0</button>
        <button class="calc-btn c-num" onclick="cNum('.')">.</button>
        <button class="calc-btn c-eq" onclick="cEq()">=</button>

        <button class="calc-btn c-fn" onclick="cFn('sqrt')" style="font-size:14px">√x</button>
        <button class="calc-btn c-fn" onclick="cFn('sq')" style="font-size:14px">x²</button>
        <button class="calc-btn c-fn" onclick="cFn('1/x')" style="font-size:14px">1/x</button>
        <button class="calc-btn c-clr" onclick="cFn('DEL')" style="font-size:18px">⌫</button>
      </div>
    </div>
  `;
  createWin('calc','Калькулятор',svg,336,560,x,y,html);
  CS = { val:'0', op:null, prev:null, newNum:true, expr:'' };
}

function cUpd() {
  const v = document.getElementById('calc-val'), ex = document.getElementById('calc-expr');
  if (v) { const n = CS.val; v.textContent = n.length > 14 ? (+n).toExponential(6) : n; }
  if (ex) ex.textContent = CS.expr;
}
function cNum(n) {
  if (CS.newNum) { CS.val = (n==='.') ? '0.' : n; CS.newNum = false; }
  else if (n==='.' && CS.val.includes('.')) return;
  else CS.val = (CS.val==='0' && n!=='.') ? n : CS.val + n;
  cUpd();
}
function cOp(op) {
  if (CS.op && !CS.newNum) cEq();
  CS.prev = parseFloat(CS.val); CS.op = op; CS.newNum = true;
  const sym = {'+':'+','-':'−','*':'×','/':'÷'}[op]||op;
  CS.expr = CS.prev + ' ' + sym; cUpd();
}
function cEq() {
  if (!CS.op || CS.prev===null) return;
  const a=CS.prev, b=parseFloat(CS.val);
  let r;
  switch(CS.op){case'+':r=a+b;break;case'-':r=a-b;break;case'*':r=a*b;break;case'/':r=b===0?'∞':a/b;break;default:r=b;}
  const sym = {'+':'+','-':'−','*':'×','/':'÷'}[CS.op]||CS.op;
  const fullExpr = `${a} ${sym} ${b} =`;
  CS.expr = fullExpr;
  const result = r==='∞'?'∞':String(+parseFloat(r).toFixed(10));
  calcHist.push({expr:fullExpr, res:result});
  const hist = document.getElementById('calc-hist');
  if (hist) {
    const item = document.createElement('div'); item.className='calc-hist-item';
    item.innerHTML=`<span class="ch-expr">${fullExpr}</span><span class="ch-res">${result}</span>`;
    hist.appendChild(item); hist.scrollTop = hist.scrollHeight;
  }
  CS.val = result; CS.op=null; CS.prev=null; CS.newNum=true; cUpd();
}
function cFn(fn) {
  const v = parseFloat(CS.val);
  switch(fn){
    case 'AC': CS={val:'0',op:null,prev:null,newNum:true,expr:''}; break;
    case 'DEL': CS.val=CS.val.length>1?CS.val.slice(0,-1):'0'; break;
    case '+/-': CS.val=String(-v); break;
    case '%': CS.val=String(v/100); break;
    case 'sqrt': CS.val=v<0?'Ошибка':String(+Math.sqrt(v).toFixed(10)); CS.newNum=true; break;
    case 'sq': CS.val=String(v*v); CS.newNum=true; break;
    case '1/x': CS.val=v===0?'Ошибка':String(+( 1/v).toFixed(10)); CS.newNum=true; break;
  }
  cUpd();
}

/* ════════════════════════════════════════════
   APP: EDITOR
════════════════════════════════════════════ */
function openApp_editor(x,y) {
  const svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>`;
  const html = `
    <div class="ed-tabs">
      <div class="ed-tab active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
        новый-файл.txt
      </div>
      <button class="tb-btn" style="margin-left:8px;height:26px;font-size:11px" onclick="edNew()">+</button>
      <button class="tb-btn" style="margin-left:auto;height:26px;font-size:11px" onclick="edSave()">💾 Сохранить</button>
      <button class="tb-btn" style="height:26px;font-size:11px" onclick="edDl()">⬇ Скачать</button>
    </div>
    <textarea class="ed-area" id="ed-area" spellcheck="false" onkeydown="edKey(event)" onclick="edPos()" onkeyup="edPos()"># Добро пожаловать в AquaEdit 2.0

Начните писать здесь...

## Горячие клавиши
Ctrl+S — сохранить
Tab — отступ (2 пробела)
</textarea>
    <div class="ed-statusbar">
      <div class="ed-dot"></div>
      <span id="ed-pos">Стр 1, Кол 1</span>
      <span>|</span>
      <span>UTF-8</span>
      <span>|</span>
      <span>Markdown</span>
      <span style="margin-left:auto">AquaEdit 2.0</span>
    </div>
  `;
  createWin('editor','Текстовый редактор',svg,720,560,x,y,html);
}

function edPos() {
  const a = document.getElementById('ed-area'), p = document.getElementById('ed-pos');
  if (!a||!p) return;
  const t = a.value.substring(0,a.selectionStart).split('\n');
  p.textContent = `Стр ${t.length}, Кол ${t[t.length-1].length+1}`;
}
function edKey(e) {
  if (e.key==='Tab') { e.preventDefault(); const a=document.getElementById('ed-area'); const s=a.selectionStart; a.value=a.value.substring(0,s)+'  '+a.value.substring(a.selectionEnd); a.selectionStart=a.selectionEnd=s+2; }
  if (e.ctrlKey&&e.key==='s') { e.preventDefault(); edSave(); }
}
function edSave() { showNotif('Редактор','Файл сохранён',`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--grn)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`); }
function edNew() { const a=document.getElementById('ed-area'); if(a) a.value=''; }
function edDl() {
  const a = document.getElementById('ed-area'); if(!a) return;
  const blob=new Blob([a.value],{type:'text/plain'});
  const url=URL.createObjectURL(blob); const link=document.createElement('a');
  link.href=url; link.download='document.txt'; link.click(); URL.revokeObjectURL(url);
  showNotif('Загрузка','document.txt скачан',`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--grn)" stroke-width="2"><polyline points="7 10 12 15 17 10"/></svg>`);
}

/* ════════════════════════════════════════════
   APP: SETTINGS
════════════════════════════════════════════ */
function openApp_settings(x,y) {
  const svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2"/></svg>`;
  const html = `
    <div class="set-layout">
      <div class="set-nav">
        ${[
          ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>','Обои и тема','appearance'],
          ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>','Аккаунт','account'],
          ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>','Дисплей','display'],
          ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>','Звук','sound'],
          ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>','Сеть','network'],
          ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>','Безопасность','security'],
          ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>','Диск и квота','disk'],
          ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>','О системе','about'],
        ].map(([icon,label,id]) => `<div class="set-ni" onclick="setTab(this,'${id}')">${icon}${label}</div>`).join('')}
      </div>
      <div class="set-content" id="set-content">${setTabHTML('appearance')}</div>
    </div>
  `;
  createWin('settings','Настройки',svg,780,580,x,y,html);
}

function setTab(el, id) {
  document.querySelectorAll('.set-ni').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
  const c = document.getElementById('set-content'); if(c) c.innerHTML = setTabHTML(id);
}

function setTabHTML(id) {
  if (id==='appearance') return `
    <div class="set-h1">Обои и внешний вид</div>
    <div class="set-card">
      <div style="padding:14px 16px">
        <div style="font-size:13px;color:var(--t2);margin-bottom:10px">Встроенные обои</div>
        <div class="wp-grid">
          ${Object.entries(WALLPAPERS).map(([key,wp]) => `
            <div class="wp-item ${SYS.wallpaper===key?'selected':''}" style="background:${wp.bg}" onclick="applyWallpaper('${key}');document.querySelectorAll('.wp-item').forEach(i=>i.classList.remove('selected'));this.classList.add('selected')">
              <div class="wp-label">${wp.label}</div>
            </div>
          `).join('')}
        </div>
        <div style="font-size:13px;color:var(--t2);margin-top:14px;margin-bottom:8px">Своё изображение (URL)</div>
        <div class="wp-custom">
          <input id="wp-url-inp" placeholder="https://example.com/wallpaper.jpg или путь к файлу">
          <button class="tb-btn accent" onclick="applyCustomWP()">Применить</button>
        </div>
        <div style="font-size:11px;color:var(--t4);margin-top:6px">Совет: используйте прямые ссылки на изображения (.jpg .png .webp)</div>
      </div>
    </div>
    <div class="set-card">
      <div style="padding:14px 16px">
        <div style="font-size:13px;color:var(--t2);margin-bottom:10px">Цвет акцента</div>
        <div class="accent-grid">
          ${['#4d9ef5','#f04f5a','#27c47a','#a07ef0','#e8a020','#20d4d4','#f07040','#d45090'].map(c=>`<div class="accent-dot ${SYS.accent===c?'selected':''}" style="background:${c}" onclick="setAccent('${c}');document.querySelectorAll('.accent-dot').forEach(d=>d.classList.remove('selected'));this.classList.add('selected')"></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="set-card">
      ${setRow('Тёмная тема','toggle','on','Тёмный фон интерфейса')}
      ${setRow('Анимации','toggle','on','Анимации окон и переходов')}
      ${setRow('Прозрачность','toggle','on','Эффект стекла в окнах')}
    </div>
  `;
  if (id==='disk') return `
    <div class="set-h1">Диск и квота</div>
    <div class="set-card">
      <div style="padding:16px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:13px;color:var(--t1)">Использование диска</span>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--acc)">${(SYS.disk.used/1024).toFixed(1)} ГБ из ${(SYS.disk.total/1024).toFixed(0)} ГБ</span>
        </div>
        <div class="dq-bar"><div class="dq-fill" style="width:${Math.round(SYS.disk.used/SYS.disk.total*100)}%"></div></div>
        <div class="dq-info"><span>${Math.round(SYS.disk.used/SYS.disk.total*100)}% занято</span><span>${((SYS.disk.total-SYS.disk.used)/1024).toFixed(1)} ГБ свободно</span></div>
      </div>
    </div>
    <div class="set-card">
      <div style="padding:16px">
        <div style="font-size:13px;color:var(--t2);margin-bottom:12px">Квота пользователя</div>
        ${[{label:'Документы',used:1200,total:5120},{label:'Медиафайлы',used:8400,total:20480},{label:'Загрузки',used:SYS.downloads_size+300,total:10240},{label:'Системное',used:3580,total:15360}].map(q=>`
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
              <span style="color:var(--t2)">${q.label}</span>
              <span style="font-family:'IBM Plex Mono',monospace;color:var(--t3)">${(q.used/1024).toFixed(1)} / ${(q.total/1024).toFixed(0)} ГБ</span>
            </div>
            <div class="dq-bar" style="height:6px"><div class="dq-fill" style="width:${Math.round(q.used/q.total*100)}%;background:${q.used/q.total>.8?'linear-gradient(90deg,var(--org),var(--red))':'linear-gradient(90deg,var(--grn),var(--acc))'}"></div></div>
          </div>
        `).join('')}
        <button class="tb-btn accent" onclick="showNotif('Диск','Очистка кэша: освобождено 1.2 ГБ','💾')" style="margin-top:8px">Очистить кэш</button>
      </div>
    </div>
    <div class="set-card">
      <div style="padding:16px">
        <div style="font-size:13px;color:var(--t2);margin-bottom:8px">Загруженные файлы (${SYS.downloads.length})</div>
        ${SYS.downloads.length===0?'<div style="color:var(--t4);font-size:12px">Нет загруженных файлов</div>':SYS.downloads.map(d=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--b1);font-size:12px"><span style="color:var(--t1)">${d.name}</span><span style="color:var(--t4)">${d.time}</span></div>`).join('')}
      </div>
    </div>
  `;
  if (id==='about') return `
    <div class="set-h1">О системе</div>
    <div class="set-card" style="overflow:hidden">
      <div style="background:linear-gradient(135deg,var(--acc3),var(--bg));padding:24px;display:flex;gap:16px;align-items:center">
        <div style="width:56px;height:56px;border-radius:15px;background:linear-gradient(135deg,var(--acc2),var(--pur));display:flex;align-items:center;justify-content:center">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
        </div>
        <div><div style="font-size:20px;font-weight:700;color:var(--t1)">AquaOS 2.0</div><div style="font-size:12px;color:var(--t3);margin-top:3px">Версия 2.0.0 LTS «Tideline» — Official Build</div></div>
      </div>
      <div style="padding:16px">
        ${[['Ядро','6.8.0-aqua-generic-amd64'],['Среда рабочего стола','AquaDE 3.2.1'],['Менеджер окон','AquaWM 2.0'],['Рендер','HTML5 Canvas / WebGL'],['Разрядность','x86_64 (64-бит)'],['Процессор',navigator.hardwareConcurrency+' ядер'],['Платформа',navigator.platform],['Браузер',navigator.userAgent.split(' ').pop()]].map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--b1);font-size:12px"><span style="color:var(--t4)">${k}</span><span style="color:var(--t1);font-family:'IBM Plex Mono',monospace">${v}</span></div>`).join('')}
      </div>
    </div>
  `;
  const rows = {
    account:[['Имя пользователя','user'],['Email','user@aquaos.dev'],['Тип','Администратор'],['Оболочка','/bin/aquash']],
    display:[['Разрешение',`${screen.width}×${screen.height}`],['Цветов','32-бит'],['Масштаб','100%']],
    sound:[['Устройство вывода','Встроенные динамики'],['Частота','44.1 кГц'],['Codec','AAC / OPUS']],
    network:[['Сеть','AquaNet-5G (192.168.1.x)'],['DNS','8.8.8.8 / 8.8.4.4'],['IP','192.168.1.100']],
    security:[['Брандмауэр','Активен'],['Шифрование','AES-256'],['Автообновление','Включено']],
  };
  const data = rows[id] || rows.account;
  return `
    <div class="set-h1">${{account:'Аккаунт',display:'Дисплей',sound:'Звук',network:'Сеть',security:'Безопасность'}[id]||id}</div>
    <div class="set-card">
      ${data.map(([k,v])=>`<div class="set-row"><div class="set-row-info"><label>${k}</label></div><span style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--acc)">${v}</span></div>`).join('')}
      ${setRow('Тёмный режим','toggle','on','')}
      ${setRow('Уведомления','toggle','on','')}
    </div>
  `;
}

function setRow(label, type, val, desc) {
  if (type==='toggle') return `<div class="set-row"><div class="set-row-info"><label>${label}</label>${desc?`<small>${desc}</small>`:''}</div><div class="toggle ${val==='on'?'on':''}" onclick="this.classList.toggle('on')"></div></div>`;
  return `<div class="set-row"><div class="set-row-info"><label>${label}</label>${desc?`<small>${desc}</small>`:''}</div><span style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--acc)">${val}</span></div>`;
}

function applyCustomWP() {
  const inp = document.getElementById('wp-url-inp'); if(!inp) return;
  const url = inp.value.trim(); if(!url) return;
  applyWallpaper('custom', url);
  document.querySelectorAll('.wp-item').forEach(i=>i.classList.remove('selected'));
  showNotif('Обои', 'Обои применены', `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--grn)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`);
}

function openWallpaperPicker() {
  openApp('settings');
  setTimeout(()=>{
    const el = document.querySelector('.set-ni');
    if(el) { setTab(el,'appearance'); el.classList.add('active'); }
  },300);
}

function setAccent(color) {
  SYS.accent = color;
  document.documentElement.style.setProperty('--acc', color);
  showNotif('Внешний вид','Цвет акцента обновлён',`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`);
}

/* ════════════════════════════════════════════
   APP: CLOCK
════════════════════════════════════════════ */
function openApp_clock(x,y) {
  const svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  const html = `
    <div class="clock-body">
      <div class="clock-svg-wrap">
        <svg id="clock-svg" width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="96" fill="var(--s2)" stroke="var(--b2)" stroke-width="2"/>
          <circle cx="100" cy="100" r="88" fill="none" stroke="var(--b1)" stroke-width="1"/>
          ${[...Array(60)].map((_,i)=>{
            const angle = i*6*Math.PI/180;
            const isMajor = i%5===0;
            const r1=isMajor?72:76, r2=82;
            return `<line x1="${100+r1*Math.sin(angle)}" y1="${100-r1*Math.cos(angle)}" x2="${100+r2*Math.sin(angle)}" y2="${100-r2*Math.cos(angle)}" stroke="${isMajor?'var(--t2)':'var(--b2)'}" stroke-width="${isMajor?2:1}" stroke-linecap="round"/>`;
          }).join('')}
          ${[...Array(12)].map((_,i)=>{
            const a=(i+1)*30*Math.PI/180, r=62;
            return `<text x="${100+r*Math.sin(a)}" y="${100-r*Math.cos(a)+4}" text-anchor="middle" fill="var(--t3)" font-size="11" font-family="IBM Plex Mono,monospace" font-weight="500">${i+1}</text>`;
          }).join('')}
          <line id="ch-h" x1="100" y1="100" x2="100" y2="60" stroke="var(--t1)" stroke-width="4" stroke-linecap="round"/>
          <line id="ch-m" x1="100" y1="100" x2="100" y2="44" stroke="var(--acc)" stroke-width="3" stroke-linecap="round"/>
          <line id="ch-s" x1="100" y1="108" x2="100" y2="38" stroke="var(--red)" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="100" cy="100" r="5" fill="var(--acc)"/>
          <circle cx="100" cy="100" r="2" fill="var(--t1)"/>
        </svg>
      </div>
      <div class="clock-digital" id="clock-dig">00:00:00</div>
      <div class="clock-date-str" id="clock-dstr"></div>
      <div class="clock-zones">
        ${[['Москва',3],['Лондон',0],['Нью-Йорк',-5],['Токио',9]].map(([c,o])=>`<div class="cz-item"><div class="cz-name">${c}</div><div class="cz-time" id="cz-${c.replace(/\s/,'')}">--:--</div></div>`).join('')}
      </div>
    </div>
  `;
  createWin('clock','Часы',svg,340,480,x,y,html);
  tickClock();
}

function tickClock() {
  if (!document.getElementById('w-clock')) return;
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  const hDeg = (h%12)*30 + m*.5, mDeg = m*6 + s*.1, sDeg = s*6;
  const rot = (id, deg, ox, oy, lx, ly) => {
    const el = document.getElementById(id); if (!el) return;
    const r = deg * Math.PI/180;
    const cos=Math.cos(r), sin=Math.sin(r);
    const x1=100+(ox-100)*cos-(oy-100)*sin, y1=100+(ox-100)*sin+(oy-100)*cos;
    const x2=100+(lx-100)*cos-(ly-100)*sin, y2=100+(lx-100)*sin+(ly-100)*cos;
    el.setAttribute('x1',x1.toFixed(2)); el.setAttribute('y1',y1.toFixed(2));
    el.setAttribute('x2',x2.toFixed(2)); el.setAttribute('y2',y2.toFixed(2));
  };
  rot('ch-h',hDeg,100,100,100,60); rot('ch-m',mDeg,100,100,100,44); rot('ch-s',sDeg,100,108,100,38);
  const pad = n => String(n).padStart(2,'0');
  const dig = document.getElementById('clock-dig'); if(dig) dig.textContent=`${pad(h)}:${pad(m)}:${pad(s)}`;
  const ds = document.getElementById('clock-dstr'); if(ds) ds.textContent=now.toLocaleDateString('ru-RU',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  [[' Москва',3],[' Лондон',0],['Нью-Йорк',-5],[' Токио',9]].forEach(([c,o]) => {
    const local = new Date(now.getTime() + (o*3600 + now.getTimezoneOffset()*60)*1000);
    const el = document.getElementById('cz-'+c.trim().replace(/\s/,'')); if(el) el.textContent=`${pad(local.getHours())}:${pad(local.getMinutes())}`;
  });
  requestAnimationFrame(tickClock);
}

/* ════════════════════════════════════════════
   APP: ABOUT
════════════════════════════════════════════ */
function openApp_about(x,y) {
  openApp_settings(x,y);
  setTimeout(()=>{
    const items = document.querySelectorAll('.set-ni');
    const last = items[items.length-1];
    if(last) setTab(last,'about');
  },100);
}

/* ════════════════════════════════════════════
   ROUTER
════════════════════════════════════════════ */
function openApp(app) {
  const x = rand(120,250), y = rand(40,100);
  const map = { browser:openApp_browser, files:openApp_files, terminal:openApp_terminal,
    calc:openApp_calc, editor:openApp_editor, settings:openApp_settings,
    clock:openApp_clock, about:openApp_about };
  if (map[app]) map[app](x,y);
}

/* ════════════════════════════════════════════
   NOTIFICATIONS
════════════════════════════════════════════ */
function showNotif(title, body, iconSvg='') {
  const area = document.getElementById('notif-area');
  const el = document.createElement('div'); el.className='notif';
  el.innerHTML=`<div class="notif-head">${iconSvg}${title}</div><div class="notif-body">${body}</div>`;
  area.appendChild(el);
  el.addEventListener('click',()=>el.remove());
  setTimeout(()=>{ el.style.transition='opacity .3s,transform .3s'; el.style.opacity='0'; el.style.transform='translateX(20px)'; setTimeout(()=>el.remove(),300); },4000);
}

/* ════════════════════════════════════════════
   CONTEXT MENU
════════════════════════════════════════════ */
document.getElementById('desktop-area').addEventListener('contextmenu', e => {
  e.preventDefault();
  const menu=document.getElementById('ctx');
  menu.style.display='block';
  menu.style.left=Math.min(e.clientX,innerWidth-210)+'px';
  menu.style.top=Math.min(e.clientY,innerHeight-220)+'px';
});
document.addEventListener('click', () => { document.getElementById('ctx').style.display='none'; });

/* ════════════════════════════════════════════
   UTILS
════════════════════════════════════════════ */
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ════════════════════════════════════════════
   INIT
════════════════════════════════════════════ */
buildDesktopIcons();
applyWallpaper('gradient-default');

// Dock & desktop icon listeners
document.querySelectorAll('.d-item').forEach(item => {
  item.addEventListener('click', () => openApp(item.dataset.app));
});

// Startup notifications
setTimeout(()=>showNotif('AquaOS 2.0','Добро пожаловать!',`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`),600);
setTimeout(()=>showNotif('Система','Все службы запущены · Диск: '+(SYS.disk.used/1024).toFixed(1)+' ГБ',`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--grn)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`),2000);

/* ===== AquaOS Proxy Patch (serverless) =====
   Notes:
   - Loads web pages through /api/proxy to bypass iframe embedding blocks.
   - Some sites (banks, Google, etc.) may still break due to advanced protections.
*/
(function(){
  const DEFAULT_HOME = "https://duckduckgo.com/";
  const makeProxyUrl = (u) => "/api/proxy?url=" + encodeURIComponent(u);

  // Try to find the main browser iframe by common ids/classes
  function findBrowserFrame(){
    return document.querySelector('iframe#aqua-browser, iframe#browser, iframe.browser, iframe[data-app="browser"], iframe');
  }

  // Expose helpers
  window.AquaProxy = { makeProxyUrl, DEFAULT_HOME };

  // Patch common open functions if present
  const candidates = ["openUrl","navigate","goTo","loadUrl","browserNavigate"];
  for(const name of candidates){
    const fn = window[name];
    if(typeof fn === "function"){
      window[name] = function(url, ...rest){
        try{
          if(url && /^https?:\/\//i.test(url)){
            return fn.call(this, makeProxyUrl(url), ...rest);
          }
        }catch(e){}
        return fn.call(this, url, ...rest);
      };
    }
  }

  // If no heuristic replacement happened, patch iframe on submit events by intercepting form submits
  document.addEventListener("submit", (e)=>{
    const form = e.target;
    if(!(form instanceof HTMLFormElement)) return;
    const input = form.querySelector('input[type="url"], input[name="url"], input[name="q"], input');
    if(!input) return;
    const val = (input.value || "").trim();
    if(/^https?:\/\//i.test(val)){
      const frame = findBrowserFrame();
      if(frame){
        e.preventDefault();
        frame.src = makeProxyUrl(val);
      }
    }
  }, true);

  // Set homepage if something tries to use Google as default
  window.addEventListener("DOMContentLoaded", ()=>{
    const frame = findBrowserFrame();
    if(frame && (!frame.src || /google\.com/i.test(frame.src))){
      frame.src = makeProxyUrl(DEFAULT_HOME);
    }
  });
})();
