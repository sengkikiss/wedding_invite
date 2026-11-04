import '@fontsource/moul/400.css';
import '@fontsource/moulpali/400.css';
import '@fontsource/kantumruy-pro/400.css';
import '@fontsource/kantumruy-pro/600.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/pinyon-script/400.css';
import './style.css';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import { wedding as W } from './data/wedding.js';
import { gallery } from './data/gallery.js';
import { dict, num } from './i18n.js';
import { getCurrentGuestName } from './data/guestStore.js';
import {
  initAudio,
  playAudio,
  toggleAudio,
  onAudioStateChange,
} from './audioPlayer.js';
import { renderCountdownView } from './views/countdownView.js';
import { renderBookView } from './views/bookView.js';
import { renderGiftView } from './views/giftView.js';
import { renderLocationView } from './views/locationView.js';

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin, CustomEase);
const B = import.meta.env ? (import.meta.env.BASE_URL || '/') : '/';
const el = (id) => document.getElementById(id);
const photo = (id) => {
  const g = gallery.find((p) => p.id === id);
  return `${B}img/${id}-${Math.max(...g.sizes)}.webp`;
};

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 2 || reduce;
if (weak) document.documentElement.classList.add('lite');
const coarse = matchMedia('(pointer: coarse)').matches;

let lang = 'km';
const t = () => dict[lang];

/* ---------- name logo ---------- */
const logoHTML = (cls = '') => `
<div class="logo ${cls}">
  <img class="lg-crest" src="${B}elements/crest.svg" alt="" />
  <div class="lg-box">
    <span class="lg-g foil shimmer" data-name="groom"></span>
    <svg class="lg-flo" viewBox="0 0 100 46" aria-hidden="true"><path d="M5 23 C16 23 24 19 34 22 S44 27 50 23 S62 19 70 22 S86 27 95 23"/></svg>
    <svg class="lg-heart" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21C-4 9 3-2 12 5c9-7 16 4 0 16z" fill="url(#gf)"/></svg>
    <img class="lg-bf" src="${B}elements/butterfly.svg" alt="" />
    <span class="lg-b foil shimmer" data-name="bride"></span>
  </div>
</div>`;

const reveal = (target, vars = {}) => gsap.fromTo(target,
  { clipPath: 'inset(-40% 110% -40% -10%)' },
  { clipPath: 'inset(-40% -10% -40% -10%)', duration: 1.1, ease: 'power3.inOut', onComplete: () => gsap.set(target, { clearProps: 'clipPath' }), ...vars });

function animateLogo(root, delay = 0) {
  if (!root) return gsap.timeline();
  const tl = gsap.timeline({ delay });
  const g = root.querySelector('.lg-g'), b = root.querySelector('.lg-b');
  if (g && b) {
    tl.add(reveal(g), 0).add(reveal(b), 0.35);
  }
  const crest = root.querySelector('.lg-crest');
  if (crest) {
    tl.fromTo(crest, { autoAlpha: 0, y: 8, scale: 0.85 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: 'power2.out' }, 0);
  }
  const flo = root.querySelector('.lg-flo path');
  if (flo) {
    tl.fromTo(flo, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 1.3, ease: 'power2.inOut' }, 0.5);
  }
  const heart = root.querySelector('.lg-heart');
  if (heart) {
    tl.fromTo(heart, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.7, ease: 'back.out(3)' }, 1.5);
  }
  const bf = root.querySelector('.lg-bf');
  if (bf) {
    tl.fromTo(bf, { x: 70, y: -36, rotate: 25, autoAlpha: 0 }, { x: 0, y: 0, rotate: 0, autoAlpha: 1, duration: 1.4, ease: 'power3.out' }, 1.3);
  }
  return tl;
}

/* ---------- scalloped flap geometry ---------- */
function scallops(n = 8) {
  const Wd = 1000, H = 408, tip = [500, 392];
  const pts = [];
  const edge = (A, Bp, nrm) => {
    const dx = Bp[0] - A[0], dy = Bp[1] - A[1], len = Math.hypot(dx, dy), seg = len / n, r = seg * 0.5 * 0.55;
    const ux = nrm[0] / Math.hypot(...nrm), uy = nrm[1] / Math.hypot(...nrm);
    for (let i = 0; i < n; i++) for (let s = 0; s < 10; s++) {
      const u = s / 10, k = (i + u) / n, bump = Math.sin(Math.PI * u) * r;
      pts.push([Math.min(Wd, Math.max(0, A[0] + dx * k + ux * bump)), Math.min(H, A[1] + dy * k + uy * bump)]);
    }
  };
  edge([0, 0], tip, [-408, 500]); edge(tip, [Wd, 0], [408, 500]);
  pts.push([Wd, 0]);
  const poly = 'polygon(' + pts.map(([x, y]) => `${(x / 10).toFixed(2)}% ${((y / H) * 100).toFixed(2)}%`).join(',') + ')';
  const d = 'M0 0 ' + pts.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return { poly, d };
}
const FLAP = scallops();

/* ---------- DOM Structure (Single Scrollable Page) ---------- */
const cornerImg = `<img src="${B}elements/corner.svg" alt="" />`;
el('app').innerHTML = `
<div id="envScreen">
  <div class="env-bg" style="background-image:url(${photo(W.photos.envelopeBg)})"></div>
  <header class="env-title"><div class="km"><span class="foil shimmer" data-k="title"></span></div><div class="en">The Wedding Invitation</div></header>
  <div class="env-wrap"><div class="env-tilt" id="tilt"><div class="env-float" id="float">
    <div class="env" id="env">
      <div class="env-ground"></div>
      <div class="env-back"></div>
      <div class="env-card" id="card">
        <span class="c-corner tl">${cornerImg}</span><span class="c-corner tr">${cornerImg}</span><span class="c-corner bl">${cornerImg}</span><span class="c-corner br">${cornerImg}</span>
        <div class="c-title"><span class="foil" data-k="title"></span></div>
        <div style="width:62%">${logoHTML()}</div>
        <div class="c-en">The Wedding Invitation</div>
      </div>
      <div class="env-pocket"><div class="pk l"><i></i></div><div class="pk r"><i></i></div><div class="pk b"><i></i></div></div>
      <div class="env-flapshadow" id="flapShadow" style="clip-path:${FLAP.poly}"></div>
      <div class="env-flap" id="flap">
        <div class="face front" style="clip-path:${FLAP.poly}">
          <svg class="scl" viewBox="0 0 1000 408" preserveAspectRatio="none"><path d="${FLAP.d}" transform="translate(500 0) scale(.9) translate(-500 0)" fill="none" stroke="url(#gf)" stroke-width="3" vector-effect="non-scaling-stroke" opacity=".95"/></svg>
          <div class="flap-logo" id="flapLogo">${logoHTML()}</div>
        </div>
        <div class="face back" style="clip-path:${FLAP.poly}"></div>
      </div>
      <button class="seal" id="seal" aria-label="Open invitation"><img src="${B}elements/wax-seal.svg" alt="" /></button>
    </div>
  </div></div></div>
  <p class="tap" id="tap" data-k="tap"></p>
  <div id="dark" style="position:absolute;inset:0;background:#120a06;opacity:0;pointer-events:none;z-index:9"></div>
</div>

<div class="topbar" id="topbar">
  <div class="tb-logo-wrap" id="tbHomeBtn" role="button" tabindex="0">
    ${logoHTML('mini')}
  </div>
  <div class="tb-btns">
    <button class="pill" id="musicBtn" aria-label="Music">
      ♪ <span class="music-wave"><span></span><span></span><span></span></span>
    </button>
    <button class="pill" id="menuBtn" aria-label="Menu">☰</button>
    <button class="pill" id="langBtn"></button>
  </div>
</div>

<!-- Nav Drawer -->
<div class="nav-drawer" id="navDrawer" aria-hidden="true">
  <div class="drawer-backdrop" id="drawerBackdrop"></div>
  <div class="drawer-content">
    <div class="drawer-header">
      ${logoHTML('mini')}
      <button class="drawer-close" id="drawerClose" aria-label="Close">✕</button>
    </div>
    <nav class="drawer-nav">
      <button class="drawer-link active" data-scroll="cover"><span data-k="menu_home"></span></button>
      <button class="drawer-link" data-scroll="countdownSection"><span data-k="menu_countdown"></span></button>
      <button class="drawer-link" data-scroll="bookSection"><span data-k="menu_book"></span></button>
      <button class="drawer-link" data-scroll="giftSection"><span data-k="menu_gift"></span></button>
      <button class="drawer-link" data-scroll="locationSection"><span data-k="menu_location"></span></button>
    </nav>
    <div class="drawer-footer">
      <div class="df-audio-toggle" id="dfAudioToggle">
        <span class="df-note">♪</span>
        <span id="dfAudioLabel">Ed Sheeran - Perfect (Wedding Instrumental)</span>
      </div>
    </div>
  </div>
</div>

<main id="mainContainer">
  <!-- SECTION 1: COVER -->
  <section class="cover" id="cover">
    <div class="cover-bg" id="coverBg"><picture><source media="(min-aspect-ratio: 1/1)" srcset="${photo(W.photos.coverWide)}" /><img src="${photo(W.photos.cover)}" alt="" /></picture></div>
    <div class="corner tl"><div>${cornerImg}</div></div><div class="corner tr"><div>${cornerImg}</div></div>
    <div class="corner bl"><div>${cornerImg}</div></div><div class="corner br"><div>${cornerImg}</div></div>
    
    <div class="cv-top">
      <img class="cv-crest" id="cvCrest" src="${B}elements/crest.svg" alt="" />
      <h1 class="cv-title" id="cvTitle"><span class="foil shimmer" data-k="title"></span></h1>
      <div class="cv-logo" id="cvLogo">${logoHTML()}</div>
    </div>

    <div class="cv-bottom">
      <div class="cv-en" id="cvEn"></div>
      
      <!-- Guest Invitation Banner -->
      <div class="cv-guest-card" id="cvGuestCard">
        <div class="cv-guest-lbl" data-k="invite"></div>
        <div class="cv-guest-name foil shimmer" id="cvGuestName"></div>
      </div>

      <div class="cv-date" id="cvDate"></div>
      <p class="cv-lunar" id="cvLunar"></p>
      <p class="cv-venue" id="cvVenue"></p>

      <!-- 4 Jump Cards: Countdown, Photo Book, Gift QR, Location -->
      <div class="cv-cards" id="cvCards">
        <button class="cv-card" data-target="countdownSection">
          <div class="cv-card-inner">
            <div class="cv-card-text">
              <strong class="foil" data-k="card_countdown"></strong>
              <span data-k="card_countdown_desc"></span>
            </div>
            <div class="cv-card-arrow">›</div>
          </div>
        </button>

        <button class="cv-card" data-target="bookSection">
          <div class="cv-card-inner">
            <div class="cv-card-text">
              <strong class="foil" data-k="card_book"></strong>
              <span data-k="card_book_desc"></span>
            </div>
            <div class="cv-card-arrow">›</div>
          </div>
        </button>

        <button class="cv-card" data-target="giftSection">
          <div class="cv-card-inner">
            <div class="cv-card-text">
              <strong class="foil" data-k="card_gift"></strong>
              <span data-k="card_gift_desc"></span>
            </div>
            <div class="cv-card-arrow">›</div>
          </div>
        </button>

        <button class="cv-card" data-target="locationSection">
          <div class="cv-card-inner">
            <div class="cv-card-text">
              <strong class="foil" data-k="card_location"></strong>
              <span data-k="card_location_desc"></span>
            </div>
            <div class="cv-card-arrow">›</div>
          </div>
        </button>
      </div>

      <div class="cv-scroll" id="cvScroll"><span data-k="scroll"></span><i></i></div>
    </div>
  </section>

  <!-- SECTION 2: INVITATION HONOUR & COUNTDOWN -->
  <div id="countdownContainer"></div>

  <!-- SECTION 3: MEMORY BOOK -->
  <div id="bookContainer"></div>

  <!-- SECTION 4: WEDDING GIFT (KHQR) -->
  <div id="giftContainer"></div>

  <!-- SECTION 5: LOCATION & GOOGLE MAPS -->
  <div id="locationContainer"></div>
</main>

<footer class="credit">Design inspired by Someth Phay · <a href="https://somethphay.me" target="_blank" rel="noopener">somethphay.me</a></footer>
`;

/* ---------- Mount All Sections in Continuous Scroll ---------- */
let countdownInstance = null;
let bookInstance = null;
let giftInstance = null;
let locationInstance = null;

function mountAllSections() {
  if (countdownInstance?.destroy) countdownInstance.destroy();
  if (bookInstance?.destroy) bookInstance.destroy();
  if (giftInstance?.destroy) giftInstance.destroy();
  if (locationInstance?.destroy) locationInstance.destroy();

  const countdownContainer = el('countdownContainer');
  const bookContainer = el('bookContainer');
  const giftContainer = el('giftContainer');
  const locationContainer = el('locationContainer');

  if (countdownContainer) countdownInstance = renderCountdownView(countdownContainer, { lang });
  if (bookContainer) bookInstance = renderBookView(bookContainer, { lang });
  if (giftContainer) giftInstance = renderGiftView(giftContainer, { lang });
  if (locationContainer) locationInstance = renderLocationView(locationContainer, { lang });
}
mountAllSections();

/* ---------- language / text ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-k]').forEach((n) => {
    n.textContent = t()[n.dataset.k] || '';
  });
  document.querySelectorAll('[data-name]').forEach((n) => {
    n.textContent = W[n.dataset.name][lang].short;
    n.closest('.logo').classList.toggle('en', lang === 'en');
  });
  el('langBtn').textContent = t().lang;
  el('cvEn').innerHTML = `<span>${W.groom.en.full}</span> <span>&amp; ${W.bride.en.full}</span>`;

  // Invited guest name
  const guestName = getCurrentGuestName();
  el('cvGuestName').textContent = guestName;

  const d = W.date;
  const cells = [
    [t().day, t().weekdays[d.weekdayIdx]],
    [t().date, num(d.d, lang)],
    [t().month, t().months[d.m]],
    [t().year, num(d.y, lang)],
  ];
  el('cvDate').innerHTML = cells.map(([l, v]) => `<div><small>${l}</small><b>${v}</b></div>`).join('');
  el('cvLunar').textContent = W.lunar[lang];
  const v = W.venue[lang];
  el('cvVenue').innerHTML = `${W.timeText[lang]} · ${v.name}<em>${v.address}</em>`;

  // Re-render sub-sections for language update
  mountAllSections();
}
applyLang();

const st = document.createElement('style');
st.textContent = `.logo.en .lg-g,.logo.en .lg-b{font-family:var(--en-script);font-size:15cqw;line-height:1.5}`;
document.head.appendChild(st);

/* ---------- envelope: idle motion, tilt ---------- */
const tilt = el('tilt'), floatEl = el('float');
let idle = gsap.to(floatEl, { y: -7, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.8, ease: 'power3.out' });
const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.8, ease: 'power3.out' });
const onMove = (e) => { rx(-(e.clientY / innerHeight - 0.5) * 9); ry((e.clientX / innerWidth - 0.5) * 12); };
const onTilt = (e) => { if (e.gamma == null) return; ry(Math.max(-12, Math.min(12, e.gamma / 3))); rx(Math.max(-9, Math.min(9, -(e.beta - 50) / 5))); };
if (!reduce) { addEventListener('pointermove', onMove); addEventListener('deviceorientation', onTilt); }
animateLogo(el('flapLogo'), 0.4);
animateLogo(el('card'), 0.6);
document.body.classList.add('locked');

/* ---------- Audio controller ---------- */
initAudio();
const musicBtn = el('musicBtn');
function updateMusicUI(playing) {
  musicBtn.classList.toggle('music-playing', playing);
  musicBtn.style.opacity = playing ? '1' : '0.65';
  const label = el('dfAudioLabel');
  if (label) {
    label.textContent = playing
      ? (lang === 'km' ? 'កំពុងចាក់តន្ត្រីមង្គលការ ♪' : 'Playing Wedding Song ♪')
      : (lang === 'km' ? 'ផ្អាកតន្ត្រី (ចុចដើម្បីចាក់)' : 'Music Paused (Tap to play)');
  }
}
onAudioStateChange(updateMusicUI);
musicBtn.addEventListener('click', () => toggleAudio());
const dfAudioToggle = el('dfAudioToggle');
if (dfAudioToggle) {
  dfAudioToggle.addEventListener('click', () => toggleAudio());
}

/* ---------- opening sequence ---------- */
let opened = false;
function openEnvelope() {
  if (opened) return;
  opened = true;
  playAudio();
  removeEventListener('pointermove', onMove);
  removeEventListener('deviceorientation', onTilt);
  idle.kill();
  gsap.to([tilt, floatEl], { rotationX: 0, rotationY: 0, y: 0, duration: 0.5, ease: 'power2.out' });
  gsap.to(el('tap'), { autoAlpha: 0, duration: 0.4 });

  const seal = el('seal'), flap = el('flap'), card = el('card'), shadow = el('flapShadow');
  const env = el('env'), eh = env.offsetHeight;
  const parts = ['.env-ground', '.env-back', '.env-pocket', '#flapShadow', '#flap', '#seal'].map((s) => env.querySelector(s));
  const finish = () => {
    el('envScreen').remove();
    document.body.classList.remove('locked');
    scrollTo(0, 0);
    startCover();
  };
  if (reduce) {
    gsap.to(el('dark'), { opacity: 1, duration: 0.4, onComplete: finish });
    return;
  }

  gsap.set(flap, { transformPerspective: 1000 });
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onComplete: finish });
  tl.to(seal, { scale: 0.9, '--sh': '1px', duration: 0.5 })
    .to(seal, { y: -14, scale: 1.14, rotation: -6, '--sh': '18px', duration: 0.7 })
    .to(seal, { x: () => innerWidth * 0.6, y: () => -innerHeight * 0.4, rotation: 40, autoAlpha: 0, duration: 0.8, ease: 'power2.in' })
    .to(shadow, { autoAlpha: 0, duration: 0.7 }, 1.9)
    .to(flap, { rotationX: -180, duration: 1.5 }, 1.7)
    .set(flap, { zIndex: 0 }, 2.45)
    .to(card, { y: -eh * 0.82, rotation: -3, duration: 1.2, ease: 'power1.inOut' }, 3.2)
    .to(parts, { y: eh * 0.1, duration: 1.2, ease: 'power1.inOut' }, 3.2)
    .to(parts, { y: () => innerHeight * 0.95, duration: 0.55, ease: 'power2.in' }, 4.4)
    .to(card, {
      y: () => `+=${innerHeight / 2 - (card.getBoundingClientRect().top + card.getBoundingClientRect().height / 2)}`,
      rotation: 0, scale: () => Math.min(innerWidth * 0.9, 620) / card.offsetWidth, duration: 0.7, ease: 'power3.inOut',
    }, 4.45)
    .to(el('dark'), { opacity: 1, duration: 0.55, ease: 'power1.in' }, 4.95);
}
el('seal').addEventListener('click', openEnvelope);
el('env').addEventListener('click', openEnvelope);

/* ---------- cover intro ---------- */
function startCover() {
  const tb = el('topbar');
  tb.classList.add('on');
  if (!reduce && !coarse && innerWidth > 900) {
    const lenis = new Lenis({ lerp: 0.09 });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  if (reduce) { gsap.set('.cover *', { clearProps: 'all' }); return; }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('#cover', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: 'none' })
    .fromTo('#coverBg img', { scale: 1.2 }, { scale: 1.1, duration: 2.6, ease: 'power2.out' }, 0)
    .fromTo('.cover .corner > div', { autoAlpha: 0, scale: 0.8, transformOrigin: '0 0' }, { autoAlpha: 1, scale: 1, duration: 1.4, stagger: 0.12 }, 0.3)
    .fromTo('#cvCrest', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.5)
    .add(reveal('#cvTitle .foil'), 0.7);
  tl.add(animateLogo(el('cvLogo')), 1.1);
  tl.fromTo('#cvEn', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 1 }, 2.2)
    .fromTo('#cvGuestCard', { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 0.9 }, 2.4)
    .fromTo('#cvDate > div', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, 2.7)
    .fromTo(['#cvLunar', '#cvVenue'], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.15 }, 3.1)
    .fromTo('#cvCards .cv-card', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15 }, 3.4)
    .fromTo('#cvScroll', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 3.9)
    .fromTo(tb, { y: -16 }, { y: 0, duration: 0.8 }, 1.2);
}

/* ---------- Smooth Scrolling Handlers ---------- */
function scrollToSection(targetId) {
  closeDrawer();
  if (targetId === 'cover') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (targetId === 'admin') {
    window.location.href = './admin.html';
    return;
  }
  const targetEl = document.getElementById(targetId);
  if (targetEl) {
    targetEl.scrollIntoView({ behavior: 'smooth' });
  }
}

// 3 Cards Smooth-Scroll Handlers on Cover
el('cvCards').addEventListener('click', (e) => {
  const card = e.target.closest('[data-target]');
  if (card) {
    scrollToSection(card.dataset.target);
  }
});

// Top bar home logo button -> scroll to top
el('tbHomeBtn').addEventListener('click', () => scrollToSection('cover'));

/* ---------- Drawer Menu Handlers ---------- */
const navDrawer = el('navDrawer');
const menuBtn = el('menuBtn');
const drawerClose = el('drawerClose');
const drawerBackdrop = el('drawerBackdrop');

function openDrawer() {
  navDrawer.classList.add('open');
  navDrawer.setAttribute('aria-hidden', 'false');
}

function closeDrawer() {
  navDrawer.classList.remove('open');
  navDrawer.setAttribute('aria-hidden', 'true');
}

menuBtn.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
drawerBackdrop.addEventListener('click', closeDrawer);

// Drawer links smooth scroll
document.querySelectorAll('.drawer-link').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.scroll;
    scrollToSection(target);
  });
});

/* ---------- Event Listeners ---------- */
addEventListener('scroll', () => {
  el('topbar').classList.toggle('scrolled', scrollY > 24);
}, { passive: true });

el('langBtn').addEventListener('click', () => {
  lang = lang === 'km' ? 'en' : 'km';
  applyLang();
});
