import { wedding as W } from '../data/wedding.js';
import { dict } from '../i18n.js';

const B = import.meta.env ? (import.meta.env.BASE_URL || '/') : '/';

export function renderGiftView(container, { lang }) {
  const t = () => dict[lang];

  const giftData = W.gift || {
    khr: {
      bankName: 'ABA Bank',
      accountName: 'KIM GEOK GOEUH',
      accountNumber: '089 688 613',
      qrImage: `${B}img/qr-aba-khr.webp`,
      currency: 'KHR',
      symbol: '៛',
    },
    usd: {
      bankName: 'ABA Bank',
      accountName: 'KIM GEOK GOEUH',
      accountNumber: '013 465 459',
      qrImage: `${B}img/qr-aba-khr.webp`,
      currency: 'USD',
      symbol: '$',
    },
  };

  let activeCur = 'khr';

  container.innerHTML = `
    <section class="page-section section-gift" id="giftSection">
      <div class="section-divider">
        <img class="divider-svg" src="${B}elements/divider.svg" alt="" />
      </div>

      <div class="view-header">
        <img class="view-crest" src="${B}elements/crest.svg" alt="" />
        <h2 class="view-title foil shimmer" data-k="gift_title">${t().gift_title}</h2>
        <p class="view-subtitle" data-k="gift_subtitle">${t().gift_subtitle}</p>
      </div>

      <!-- Main Luxury Wedding Gift Box -->
      <div class="gift-card">
        <!-- Subtle Wedding Couple Background Motif -->
        <div class="gift-card-bg" style="background-image:url(${B}img/08-road-gold-472.webp)"></div>
        <div class="gift-card-overlay"></div>
        <div class="gift-card-emblem">囍</div>

        <div class="gift-content">
          <!-- Currency Tabs -->
          <div class="gift-currency-tabs">
            <button class="gift-tab active" data-currency="khr" id="tabKhr">
              <span class="tab-symbol">៛</span>
              <span class="tab-label">${t().gift_khr_tab}</span>
            </button>
            <button class="gift-tab" data-currency="usd" id="tabUsd">
              <span class="tab-symbol">$</span>
              <span class="tab-label">${t().gift_usd_tab}</span>
            </button>
          </div>

          <!-- QR Presentation Card -->
          <div class="gift-qr-wrapper">
            <div class="gift-qr-card">
              <img
                id="giftQrImg"
                src="${giftData[activeCur].qrImage}"
                alt="ABA KHQR Payment"
                loading="lazy"
              />
            </div>

            <div class="gift-scan-tag">
              <div class="gift-scan-prompt">${t().gift_scan_hint}</div>
              <div class="gift-khqr-badge">
                <svg viewBox="0 0 24 24" class="phone-svg" aria-hidden="true">
                  <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" fill="currentColor"/>
                </svg>
                <span>${t().gift_khqr_badge}</span>
              </div>
            </div>

            <!-- Dynamic Account Details Box -->
            <div class="gift-account-box">
              <div class="gab-bank" id="gabBank">${giftData[activeCur].bankName}</div>
              <div class="gab-num-row">
                <span class="gab-num" id="gabNum">${giftData[activeCur].accountNumber}</span>
                <span class="gab-badge" id="gabSymbol">${giftData[activeCur].currency}</span>
              </div>
              <div class="gab-owner" id="gabOwner">${giftData[activeCur].accountName}</div>
            </div>

            <!-- Action Buttons: Download QR & Copy Account Number -->
            <div class="gift-actions">
              <button class="gift-btn primary-btn" id="downloadQrBtn">
                <svg class="btn-svg" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
                </svg>
                <span>${t().gift_download_btn}</span>
              </button>

              <button class="gift-btn secondary-btn" id="copyAccBtn">
                <svg class="btn-svg" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                </svg>
                <span id="copyAccLabel">${t().gift_copy_acc}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast message for copy -->
      <div class="toast-popup" id="giftToast" hidden>
        <span class="toast-text">${t().gift_copied_toast}</span>
      </div>
    </section>
  `;

  // DOM Elements
  const tabKhr = container.querySelector('#tabKhr');
  const tabUsd = container.querySelector('#tabUsd');
  const giftQrImg = container.querySelector('#giftQrImg');
  const gabBank = container.querySelector('#gabBank');
  const gabNum = container.querySelector('#gabNum');
  const gabSymbol = container.querySelector('#gabSymbol');
  const gabOwner = container.querySelector('#gabOwner');
  const downloadBtn = container.querySelector('#downloadQrBtn');
  const copyBtn = container.querySelector('#copyAccBtn');
  const toast = container.querySelector('#giftToast');

  function updateCurrency(curr) {
    activeCur = curr;
    tabKhr.classList.toggle('active', curr === 'khr');
    tabUsd.classList.toggle('active', curr === 'usd');

    const curData = giftData[curr];
    if (!curData) return;

    if (giftQrImg) giftQrImg.src = curData.qrImage;
    if (gabBank) gabBank.textContent = curData.bankName;
    if (gabNum) gabNum.textContent = curData.accountNumber;
    if (gabSymbol) gabSymbol.textContent = curData.currency;
    if (gabOwner) gabOwner.textContent = curData.accountName;
  }

  tabKhr.addEventListener('click', () => updateCurrency('khr'));
  tabUsd.addEventListener('click', () => updateCurrency('usd'));

  // Download QR file
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = `${B}img/qr-aba-khr.png`;
      link.download = `Wedding-Gift-KHQR-${activeCur.toUpperCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Copy Account Number
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const curData = giftData[activeCur];
      const cleanNum = curData.accountNumber.replace(/\s+/g, '');
      navigator.clipboard.writeText(cleanNum).then(() => {
        if (toast) {
          toast.hidden = false;
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { toast.hidden = true; }, 300);
          }, 2200);
        }
      }).catch(() => {});
    });
  }

  return {
    destroy: () => {},
  };
}

