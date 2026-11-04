import { wedding as W } from '../data/wedding.js';
import { dict, num } from '../i18n.js';

const B = import.meta.env ? (import.meta.env.BASE_URL || '/') : '/';

export function renderCountdownView(container, { lang }) {
  const t = () => dict[lang];

  container.innerHTML = `
    <section class="page-section section-countdown" id="countdownSection">
      <div class="section-divider">
        <img class="divider-svg" src="${B}elements/divider.svg" alt="" />
      </div>

      <div class="view-header">
        <img class="view-crest" src="${B}elements/crest.svg" alt="" />
        <h2 class="view-title foil shimmer" data-k="countdown_title">${t().countdown_title}</h2>
      </div>

      <div class="countdown-card">
        <!-- Top Golden Filigree Ornament -->
        <div class="cd-flo-wrap">
          <svg viewBox="0 0 160 24" class="cd-flo-svg" aria-hidden="true">
            <path d="M10 12 Q45 2 80 12 T150 12" fill="none" stroke="url(#gf)" stroke-width="1.4"/>
            <path d="M25 12 Q52 6 80 12 T135 12" fill="none" stroke="url(#gf)" stroke-width="1" opacity="0.6"/>
            <circle cx="80" cy="12" r="3.2" fill="url(#gf)"/>
          </svg>
        </div>

        <!-- Honour Speech Text -->
        <p class="cd-speech">
          ${lang === 'km' 
            ? `ឯកឧត្តម លោកឧកញ៉ា លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា<br>
               អញ្ជើញចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធពរជ័យសិរីសួស្តី ជ័យមង្គល ក្នុងពិធីអាពាហ៍ពិពាហ៍ របស់យើងខ្ញុំទាំងពីរ។`
            : `Excellencies, Neak Oknha, Lok Chumteav, Ladies and Gentlemen,<br>
               We would be deeply honored by your esteemed presence as our guests of honor to bestow your sacred blessings upon our wedding celebration.`
          }
        </p>

        <!-- Ornate Cartouche: "យើងខ្ញុំកំពុងរង់ចាំថ្ងៃពិសេស" -->
        <div class="cd-cartouche-wrap">
          <div class="cd-cartouche">
            <svg class="cartouche-corner tl" viewBox="0 0 20 20"><path d="M18 2 H6 A4 4 0 0 0 2 6 V18" fill="none" stroke="url(#gf)" stroke-width="1.2"/></svg>
            <svg class="cartouche-corner tr" viewBox="0 0 20 20"><path d="M2 2 H14 A4 4 0 0 1 18 6 V18" fill="none" stroke="url(#gf)" stroke-width="1.2"/></svg>
            <span class="foil shimmer cd-cartouche-text">${t().countdown_cartouche}</span>
            <svg class="cartouche-corner bl" viewBox="0 0 20 20"><path d="M18 18 H6 A4 4 0 0 1 2 14 V2" fill="none" stroke="url(#gf)" stroke-width="1.2"/></svg>
            <svg class="cartouche-corner br" viewBox="0 0 20 20"><path d="M2 18 H14 A4 4 0 0 0 18 14 V2" fill="none" stroke="url(#gf)" stroke-width="1.2"/></svg>
          </div>
        </div>

        <!-- 4-Block Live Countdown Timer -->
        <div class="cd-timer-grid">
          <div class="cd-box">
            <div class="cd-num" id="cdDays">--</div>
            <div class="cd-lbl">${t().countdown_days}</div>
          </div>
          <div class="cd-box">
            <div class="cd-num" id="cdHours">--</div>
            <div class="cd-lbl">${t().countdown_hours}</div>
          </div>
          <div class="cd-box">
            <div class="cd-num" id="cdMins">--</div>
            <div class="cd-lbl">${t().countdown_mins}</div>
          </div>
          <div class="cd-box">
            <div class="cd-num" id="cdSecs">--</div>
            <div class="cd-lbl">${t().countdown_secs}</div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Countdown Logic
  const daysEl = container.querySelector('#cdDays');
  const hoursEl = container.querySelector('#cdHours');
  const minsEl = container.querySelector('#cdMins');
  const secsEl = container.querySelector('#cdSecs');

  const weddingTarget = new Date(W.date.iso).getTime();

  function updateTimer() {
    const now = Date.now();
    const diff = weddingTarget - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    if (daysEl) daysEl.textContent = pad(d);
    if (hoursEl) hoursEl.textContent = pad(h);
    if (minsEl) minsEl.textContent = pad(m);
    if (secsEl) secsEl.textContent = pad(s);
  }

  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);

  return {
    destroy: () => clearInterval(timerInterval),
  };
}
