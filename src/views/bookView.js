import { gsap } from 'gsap';
import { wedding as W } from '../data/wedding.js';
import { gallery } from '../data/gallery.js';
import { dict, num } from '../i18n.js';

const B = import.meta.env ? (import.meta.env.BASE_URL || '/') : '/';
const photoUrl = (id) => {
  const g = gallery.find((p) => p.id === id);
  if (!g) return '';
  return `${B}img/${id}-${Math.max(...g.sizes)}.webp`;
};

// Photo Spreads configuration (10 photos total across 5 spreads)
const SPREADS = [
  // Spread 0: Front Cover
  null,
  // Spread 1: Photos 1 & 2
  {
    left: { id: '01-angkor-blue', num: 1, captionKm: 'ប្រាសាទអង្គរវត្ត', captionEn: 'Angkor Wat Blessing' },
    right: { id: '02-doorway-gold', num: 2, captionKm: 'សិរីសួស្តី', captionEn: 'Sacred Blessing' },
  },
  // Spread 2: Photos 3 & 4
  {
    left: { id: '03-walk-umbrella', num: 3, captionKm: 'ស្នេហ៍ស្មោះ', captionEn: 'Royal Pathway' },
    right: { id: '04-steps-gold', num: 4, captionKm: 'អនុស្សាវរីយ៍', captionEn: 'Temple Steps' },
  },
  // Spread 3: Photos 5 & 6
  {
    left: { id: '05-corridor', num: 5, captionKm: 'ក្តីស្រលាញ់', captionEn: 'Eternal Love' },
    right: { id: '06-walk-wide', num: 6, captionKm: 'សុភមង្គល', captionEn: 'Golden Memories' },
  },
  // Spread 4: Photos 7 & 8
  {
    left: { id: '07-angkor-garland', num: 7, captionKm: 'កម្រងផ្កាសិរី', captionEn: 'Sacred Garland' },
    right: { id: '08-road-gold', num: 8, captionKm: 'ដំណើរជីវិត', captionEn: 'Journey Together' },
  },
  // Spread 5: Photos 9 & 10
  {
    left: { id: '09-palms-standing', num: 9, captionKm: 'ម្លប់ស្នេហ៍', captionEn: 'Sweet Whispers' },
    right: { id: '10-walk-smile', num: 10, captionKm: 'ស្នាមញញឹម', captionEn: 'Joyful Steps' },
  },
  // Spread 6: Back Cover
  null,
];

export function renderBookView(container, { lang }) {
  const t = () => dict[lang];

  let currentSpread = 0;
  const maxSpreads = 6;
  let isAnimating = false;

  container.innerHTML = `
    <div class="page-section section-book" id="bookSection">
      <div class="section-divider">
        <img class="divider-svg" src="${B}elements/divider.svg" alt="" />
      </div>

      <div class="view-header">
        <h2 class="view-title foil shimmer" data-k="book_title">${t().book_title}</h2>
        <p class="view-subtitle" data-k="book_subtitle">${t().book_subtitle}</p>
      </div>

      <div class="album-viewport" id="albumViewport">
        <div class="album-stage closed-front" id="albumStage">
          
          <!-- Base Open Spread (Left & Right Pages) -->
          <div class="album-spread" id="albumSpread">
            <!-- Left Page -->
            <div class="album-page page-left" id="albumPageLeft" data-action="prev">
              <div class="page-inner">
                <div class="page-matting">
                  <div class="photo-frame" id="frameLeft" data-zoom="">
                    <img id="imgLeft" src="${photoUrl('01-angkor-blue')}" alt="Wedding Photo" loading="lazy" />
                    <div class="zoom-pill">${t().zoom_label}</div>
                  </div>
                  <div class="page-meta">
                    <span class="page-caption" id="captionLeft">ប្រាសាទអង្គរវត្ត</span>
                    <span class="page-num" id="numLeft">${num(1, lang)}</span>
                  </div>
                </div>
                <div class="gutter-shadow left"></div>
              </div>
            </div>

            <!-- Central Spine Crease -->
            <div class="album-spine"></div>

            <!-- Right Page -->
            <div class="album-page page-right" id="albumPageRight" data-action="next">
              <div class="page-inner">
                <div class="page-matting">
                  <div class="photo-frame" id="frameRight" data-zoom="">
                    <img id="imgRight" src="${photoUrl('02-doorway-gold')}" alt="Wedding Photo" loading="lazy" />
                    <div class="zoom-pill">${t().zoom_label}</div>
                  </div>
                  <div class="page-meta">
                    <span class="page-caption" id="captionRight">សិរីសួស្តី</span>
                    <span class="page-num" id="numRight">${num(2, lang)}</span>
                  </div>
                </div>
                <div class="gutter-shadow right"></div>
              </div>
            </div>
          </div>

          <!-- 3D Turning Page Leaf (For flips between open spreads) -->
          <div class="album-leaf" id="albumLeaf" style="display:none">
            <div class="leaf-face leaf-front">
              <div class="page-matting">
                <div class="photo-frame">
                  <img id="leafImgFront" src="" alt="" />
                </div>
                <div class="page-meta">
                  <span class="page-caption" id="leafCaptionFront"></span>
                  <span class="page-num" id="leafNumFront"></span>
                </div>
              </div>
              <div class="leaf-overlay" id="leafOverlayFront"></div>
            </div>

            <div class="leaf-face leaf-back">
              <div class="page-matting">
                <div class="photo-frame">
                  <img id="leafImgBack" src="" alt="" />
                </div>
                <div class="page-meta">
                  <span class="page-caption" id="leafCaptionBack"></span>
                  <span class="page-num" id="leafNumBack"></span>
                </div>
              </div>
              <div class="leaf-overlay" id="leafOverlayBack"></div>
            </div>
          </div>

          <!-- 3D Front Hardcover (Swings open 0deg -> -180deg) -->
          <div class="album-cover-3d" id="albumCover3d">
            <!-- Outside of Cover (Leather & Gold Foil) -->
            <div class="cover-side cover-outside" id="coverOutside">
              <div class="cover-emboss-border"></div>
              <div class="cover-content">
                <img class="cover-crest" src="${B}elements/crest.svg" alt="" />
                <h3 class="cover-title foil shimmer">${t().album_cover_title}</h3>
                <div class="cover-couple">${W.groom[lang].short} &amp; ${W.bride[lang].short}</div>
                <div class="cover-ornament">
                  <svg viewBox="0 0 100 20" class="ornament-svg">
                    <path d="M0 10 Q25 0 50 10 T100 10" fill="none" stroke="url(#gf)" stroke-width="1.2"/>
                    <circle cx="50" cy="10" r="3" fill="url(#gf)"/>
                  </svg>
                </div>
                <div class="cover-tap-prompt">
                  <span>${lang === 'km' ? 'ប៉ះដើម្បីបើកទំព័រ' : 'Tap to open album'}</span>
                </div>
              </div>
              <div class="cover-shade-overlay" id="coverShade"></div>
            </div>

            <!-- Inside of Cover (Integrated Page 1 in 3D) -->
            <div class="cover-side cover-inside" id="coverInside">
              <div class="page-inner">
                <div class="page-matting">
                  <div class="photo-frame" id="coverFrameLeft" data-zoom="${photoUrl('01-angkor-blue')}">
                    <img id="coverImgLeft" src="${photoUrl('01-angkor-blue')}" alt="Wedding Photo" loading="lazy" />
                    <div class="zoom-pill">${t().zoom_label}</div>
                  </div>
                  <div class="page-meta">
                    <span class="page-caption" id="coverCaptionLeft">ប្រាសាទអង្គរវត្ត</span>
                    <span class="page-num" id="coverNumLeft">${num(1, lang)}</span>
                  </div>
                </div>
                <div class="gutter-shadow left"></div>
              </div>
            </div>
          </div>

          <!-- 3D Back Hardcover -->
          <div class="album-back-cover-3d" id="albumBackCover3d" style="display:none">
            <div class="cover-side cover-outside">
              <div class="cover-emboss-border"></div>
              <div class="cover-content">
                <img class="cover-crest" src="${B}elements/crest.svg" alt="" />
                <h3 class="cover-title foil">${t().album_end_title}</h3>
                <p class="cover-end-msg">${t().album_end_sub}</p>
                <div class="cover-couple" style="margin-top:14px">${W.groom[lang].short} &amp; ${W.bride[lang].short}</div>
                <div class="cover-tap-prompt" style="margin-top:16px">
                  <span>${lang === 'km' ? 'ប៉ះដើម្បីបើកមើលឡើងវិញ' : 'Tap to reopen'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Book Controls -->
      <div class="book-controls">
        <button class="book-btn prev" id="bookPrevBtn">${t().prev}</button>
        <div class="book-counter" id="bookCounter">
          <span id="bookCurrentPage">${num(0, lang)}</span> / <span>${num(maxSpreads, lang)}</span>
        </div>
        <button class="book-btn next" id="bookNextBtn">${t().next_page}</button>
      </div>

      <!-- Lightbox modal for photo zoom -->
      <div class="lightbox" id="bookLightbox" hidden>
        <button class="lb-close" id="lbClose" aria-label="Close">✕</button>
        <img class="lb-img" id="lbImg" src="" alt="Zoomed view" />
      </div>
    </div>
  `;

  // Elements
  const stage = container.querySelector('#albumStage');
  const albumSpread = container.querySelector('#albumSpread');
  const cover3d = container.querySelector('#albumCover3d');
  const coverShade = container.querySelector('#coverShade');
  const leaf = container.querySelector('#albumLeaf');
  const leafOverlayFront = container.querySelector('#leafOverlayFront');
  const leafOverlayBack = container.querySelector('#leafOverlayBack');
  const backCover3d = container.querySelector('#albumBackCover3d');

  const imgLeft = container.querySelector('#imgLeft');
  const captionLeft = container.querySelector('#captionLeft');
  const numLeft = container.querySelector('#numLeft');
  const frameLeft = container.querySelector('#frameLeft');

  const coverImgLeft = container.querySelector('#coverImgLeft');
  const coverCaptionLeft = container.querySelector('#coverCaptionLeft');
  const coverNumLeft = container.querySelector('#coverNumLeft');
  const coverFrameLeft = container.querySelector('#coverFrameLeft');

  const imgRight = container.querySelector('#imgRight');
  const captionRight = container.querySelector('#captionRight');
  const numRight = container.querySelector('#numRight');
  const frameRight = container.querySelector('#frameRight');

  const leafImgFront = container.querySelector('#leafImgFront');
  const leafCaptionFront = container.querySelector('#leafCaptionFront');
  const leafNumFront = container.querySelector('#leafNumFront');

  const leafImgBack = container.querySelector('#leafImgBack');
  const leafCaptionBack = container.querySelector('#leafCaptionBack');
  const leafNumBack = container.querySelector('#leafNumBack');

  const prevBtn = container.querySelector('#bookPrevBtn');
  const nextBtn = container.querySelector('#bookNextBtn');
  const counterSpan = container.querySelector('#bookCurrentPage');

  const lightbox = container.querySelector('#bookLightbox');
  const lbImg = container.querySelector('#lbImg');
  const lbClose = container.querySelector('#lbClose');

  function getCaption(item) {
    if (!item) return '';
    return lang === 'km' ? item.captionKm : item.captionEn;
  }

  function setBaseSpread(spreadIdx) {
    const data = SPREADS[spreadIdx];
    if (!data) return;

    imgLeft.src = photoUrl(data.left.id);
    captionLeft.textContent = getCaption(data.left);
    numLeft.textContent = num(data.left.num, lang);
    frameLeft.dataset.zoom = photoUrl(data.left.id);

    imgRight.src = photoUrl(data.right.id);
    captionRight.textContent = getCaption(data.right);
    numRight.textContent = num(data.right.num, lang);
    frameRight.dataset.zoom = photoUrl(data.right.id);

    // Also sync the coverInsidePage with Spread 1's left page
    if (spreadIdx === 1) {
      coverImgLeft.src = photoUrl(data.left.id);
      coverCaptionLeft.textContent = getCaption(data.left);
      coverNumLeft.textContent = num(data.left.num, lang);
      coverFrameLeft.dataset.zoom = photoUrl(data.left.id);
    }
  }

  function updateControls() {
    counterSpan.textContent = num(currentSpread, lang);
    prevBtn.disabled = currentSpread === 0;
    nextBtn.disabled = currentSpread === maxSpreads;
  }

  // Initial setup: Closed Cover (Spread 0)
  setBaseSpread(1);
  updateControls();
  gsap.set(stage, { x: '-25%' });
  gsap.set(cover3d, { rotationY: 0, transformPerspective: 2000 });
  gsap.set(leaf, { rotationY: 0, transformPerspective: 2000 });

  function goToSpread(target) {
    if (isAnimating || target === currentSpread) return;
    if (target < 0 || target > maxSpreads) return;

    isAnimating = true;

    // SCENARIO 1: Opening Front Cover (0 -> 1)
    if (currentSpread === 0 && target === 1) {
      setBaseSpread(1);
      cover3d.style.zIndex = '25';
      cover3d.style.display = 'block';
      albumSpread.style.display = 'flex';
      albumSpread.style.clipPath = 'inset(0 0 0 50%)';

      const tl = gsap.timeline({
        onComplete: () => {
          stage.classList.remove('closed-front');
          albumSpread.style.clipPath = 'none';
          cover3d.style.zIndex = '1';
          currentSpread = 1;
          isAnimating = false;
          updateControls();
        },
      });

      tl.to(stage, {
        x: '0%',
        duration: 1.15,
        ease: 'power2.inOut',
      }, 0)
      .to(cover3d, {
        rotationY: -180,
        duration: 1.15,
        ease: 'power2.inOut',
      }, 0)
      .fromTo(coverShade, { opacity: 0 }, { opacity: 0.55, duration: 0.55, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0);

      return;
    }

    // SCENARIO 2: Closing Front Cover (1 -> 0)
    if (currentSpread === 1 && target === 0) {
      cover3d.style.zIndex = '25';
      cover3d.style.display = 'block';
      stage.classList.add('closed-front');
      albumSpread.style.display = 'flex';
      albumSpread.style.clipPath = 'inset(0 0 0 50%)';

      const tl = gsap.timeline({
        onComplete: () => {
          cover3d.style.zIndex = '10';
          albumSpread.style.display = 'none';
          albumSpread.style.clipPath = 'none';
          currentSpread = 0;
          isAnimating = false;
          updateControls();
        },
      });

      tl.to(stage, {
        x: '-25%',
        duration: 1.1,
        ease: 'power2.inOut',
      }, 0)
      .to(cover3d, {
        rotationY: 0,
        duration: 1.1,
        ease: 'power2.inOut',
      }, 0)
      .fromTo(coverShade, { opacity: 0.45 }, { opacity: 0, duration: 0.55, ease: 'power1.out' }, 0.5);

      return;
    }

    // SCENARIO 3: Turning NEXT between open spreads (1..5)
    if (target > currentSpread && target <= 5) {
      cover3d.style.zIndex = '1';
      const curData = SPREADS[currentSpread];
      const targetData = SPREADS[target];

      // Setup leaf
      leafImgFront.src = photoUrl(curData.right.id);
      leafCaptionFront.textContent = getCaption(curData.right);
      leafNumFront.textContent = num(curData.right.num, lang);

      leafImgBack.src = photoUrl(targetData.left.id);
      leafCaptionBack.textContent = getCaption(targetData.left);
      leafNumBack.textContent = num(targetData.left.num, lang);

      // Immediately prepare target right page on base spread
      imgRight.src = photoUrl(targetData.right.id);
      captionRight.textContent = getCaption(targetData.right);
      numRight.textContent = num(targetData.right.num, lang);
      frameRight.dataset.zoom = photoUrl(targetData.right.id);

      leaf.style.display = 'block';
      leaf.style.zIndex = '15';
      gsap.set(leaf, { rotationY: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          // Finalize base spread
          setBaseSpread(target);
          leaf.style.display = 'none';
          currentSpread = target;
          isAnimating = false;
          updateControls();
        },
      });

      tl.to(leaf, {
        rotationY: -180,
        duration: 0.9,
        ease: 'power2.inOut',
      }, 0)
      .fromTo(leafOverlayFront, { opacity: 0 }, { opacity: 0.5, duration: 0.45, ease: 'power1.in' }, 0)
      .fromTo(leafOverlayBack, { opacity: 0.5 }, { opacity: 0, duration: 0.45, ease: 'power1.out' }, 0.45);

      return;
    }

    // SCENARIO 4: Turning PREV between open spreads (5..1)
    if (target < currentSpread && currentSpread <= 5 && target >= 1) {
      cover3d.style.zIndex = '1';
      const curData = SPREADS[currentSpread];
      const targetData = SPREADS[target];

      // Setup leaf on the left
      leafImgBack.src = photoUrl(curData.left.id);
      leafCaptionBack.textContent = getCaption(curData.left);
      leafNumBack.textContent = num(curData.left.num, lang);

      leafImgFront.src = photoUrl(targetData.right.id);
      leafCaptionFront.textContent = getCaption(targetData.right);
      leafNumFront.textContent = num(targetData.right.num, lang);

      // Immediately prepare target left page on base spread
      imgLeft.src = photoUrl(targetData.left.id);
      captionLeft.textContent = getCaption(targetData.left);
      numLeft.textContent = num(targetData.left.num, lang);
      frameLeft.dataset.zoom = photoUrl(targetData.left.id);

      leaf.style.display = 'block';
      leaf.style.zIndex = '15';
      gsap.set(leaf, { rotationY: -180 });

      const tl = gsap.timeline({
        onComplete: () => {
          // Finalize base spread
          setBaseSpread(target);
          leaf.style.display = 'none';
          currentSpread = target;
          isAnimating = false;
          updateControls();
        },
      });

      tl.to(leaf, {
        rotationY: 0,
        duration: 0.9,
        ease: 'power2.inOut',
      }, 0)
      .fromTo(leafOverlayBack, { opacity: 0 }, { opacity: 0.5, duration: 0.45, ease: 'power1.in' }, 0)
      .fromTo(leafOverlayFront, { opacity: 0.5 }, { opacity: 0, duration: 0.45, ease: 'power1.out' }, 0.45);

      return;
    }

    // SCENARIO 5: Closing to Back Cover (5 -> 6)
    if (currentSpread === 5 && target === 6) {
      backCover3d.style.display = 'block';
      backCover3d.style.zIndex = '25';
      stage.classList.add('closed-back');
      albumSpread.style.display = 'none';
      cover3d.style.display = 'none';

      const tl = gsap.timeline({
        onComplete: () => {
          currentSpread = 6;
          isAnimating = false;
          updateControls();
        },
      });

      tl.to(stage, {
        x: '-25%',
        duration: 1.0,
        ease: 'power2.inOut',
      }, 0)
      .fromTo(backCover3d, 
        { rotationY: 90, opacity: 0 },
        {
          rotationY: 0,
          opacity: 1,
          duration: 1.0,
          ease: 'power2.inOut',
        },
        0
      );
      return;
    }

    // SCENARIO 6: Reopening from Back Cover (6 -> 5)
    if (currentSpread === 6 && target === 5) {
      stage.classList.remove('closed-back');
      albumSpread.style.display = 'flex';
      cover3d.style.display = 'block';
      cover3d.style.zIndex = '1';
      setBaseSpread(5);

      const tl = gsap.timeline({
        onComplete: () => {
          backCover3d.style.display = 'none';
          currentSpread = 5;
          isAnimating = false;
          updateControls();
        },
      });

      tl.to(stage, {
        x: '0%',
        duration: 0.95,
        ease: 'power2.inOut',
      }, 0)
      .to(backCover3d, {
        rotationY: 90,
        opacity: 0,
        duration: 0.95,
        ease: 'power2.inOut',
      }, 0);
      return;
    }

    // Direct jump fallback
    setBaseSpread(target);
    currentSpread = target;
    isAnimating = false;
    updateControls();
  }

  // Click & Interaction Bindings
  prevBtn.addEventListener('click', () => goToSpread(currentSpread - 1));
  nextBtn.addEventListener('click', () => goToSpread(currentSpread + 1));

  // Cover Click to Open
  cover3d.addEventListener('click', (e) => {
    if (e.target.closest('[data-zoom]')) return;
    if (currentSpread === 0) goToSpread(1);
    else if (currentSpread === 1) goToSpread(0);
  });

  // Back Cover Click to Reopen
  backCover3d.addEventListener('click', () => {
    if (currentSpread === maxSpreads) goToSpread(maxSpreads - 1);
  });

  // Page clicks (left = prev, right = next)
  container.querySelector('#albumPageLeft').addEventListener('click', (e) => {
    if (e.target.closest('[data-zoom]')) return;
    goToSpread(currentSpread - 1);
  });

  container.querySelector('#albumPageRight').addEventListener('click', (e) => {
    if (e.target.closest('[data-zoom]')) return;
    goToSpread(currentSpread + 1);
  });

  // Lightbox Zoom Handler
  container.addEventListener('click', (e) => {
    const zoomEl = e.target.closest('[data-zoom]');
    if (zoomEl) {
      const url = zoomEl.dataset.zoom;
      if (url) {
        lbImg.src = url;
        lightbox.hidden = false;
      }
    }
  });

  lbClose.addEventListener('click', () => { lightbox.hidden = true; });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.hidden = true;
  });

  // Touch Swipe for Mobile
  let touchStartX = 0;
  let touchStartY = 0;
  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) goToSpread(currentSpread + 1);
      else goToSpread(currentSpread - 1);
    }
  }, { passive: true });

  return {
    destroy: () => {},
  };
}
