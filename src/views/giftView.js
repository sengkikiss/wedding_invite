import { wedding as W } from '../data/wedding.js';
import { dict } from '../i18n.js';

const B = import.meta.env ? (import.meta.env.BASE_URL || '/') : '/';

export function renderGiftView(container, { lang }) {
  const t = () => dict[lang];

  const giftData = W.gift || {
    accountName: 'SREYNEAT DYNA',
    qrImage: `${B}img/qr-khqr.webp`,
    qrDownload: `${B}img/qr-khqr.png`,
    bankType: 'KHQR (Bakong / គ្រប់ធនាគារទាំងអស់)',
    currencies: 'KHR & USD',
  };

  container.innerHTML = `
    <section class="page-section section-gift" id="giftSection">
      <!-- Full-bleed background image & cinematic dark scrim -->
      <div class="gift-bg-layer" style="background-image:url(${B}img/05-corridor-1280.webp)"></div>
      <div class="gift-scrim-layer"></div>

      <div class="section-divider">
        <img class="divider-svg" src="${B}elements/divider.svg" alt="" />
      </div>

      <div class="view-header">
        <img class="view-crest" src="${B}elements/crest.svg" alt="" />
        <h2 class="view-title foil shimmer" data-k="gift_title">${t().gift_title}</h2>
        <p class="view-subtitle" data-k="gift_subtitle">${t().gift_subtitle}</p>
      </div>

      <!-- Main Luxury Wedding Gift Card with couple photo background -->
      <div class="gift-main-card">
        <div class="gift-card-bg-photo" style="background-image:url(${B}img/05-corridor-1280.webp)"></div>
        <div class="gift-card-scrim"></div>

        <div class="gift-card-inner-grid">
          
          <!-- Column 1: KHQR Card Frame -->
          <div class="gift-qr-col">
            <div class="gift-qr-frame">
              <img
                id="giftQrImg"
                src="${giftData.qrImage}"
                alt="KHQR SREYNEAT DYNA"
                loading="lazy"
              />
            </div>
            <div class="gift-khqr-pill">
              <span class="khqr-dot"></span>
              <span>${t().gift_khqr_badge}</span>
            </div>
          </div>

          <!-- Column 2: Details & Actions -->
          <div class="gift-info-col">
            <div class="gift-blessing-ornament">
              <svg viewBox="0 0 120 20" class="ornament-svg" aria-hidden="true">
                <path d="M0 10 Q30 0 60 10 T120 10" fill="none" stroke="url(#gf)" stroke-width="1.3"/>
                <circle cx="60" cy="10" r="3.2" fill="url(#gf)"/>
              </svg>
            </div>

            <p class="gift-prompt-text">${t().gift_scan_hint}</p>

            <!-- Account Name Card -->
            <div class="gift-account-badge">
              <div class="gab-label">${t().gift_account_name_label}</div>
              <div class="gab-name foil shimmer" id="giftAccountName">${giftData.accountName}</div>
              <div class="gab-currency-support">
                <span class="currency-tag">KHR</span>
                <span class="currency-tag">USD</span>
                <span class="currency-text">${t().gift_accept_currencies}</span>
              </div>
            </div>

            <p class="gift-support-banks">
              ${lang === 'km' 
                ? 'គាំទ្រការស្កេនពីគ្រប់កម្មវិធីធនាគារក្នុងប្រទេសកម្ពុជា (ABA, Canadia, ACLEDA, Wing, Bakong...)'
                : 'Compatible with all Bakong-supported banking apps in Cambodia'
              }
            </p>

            <!-- Action Buttons: Download QR & Copy Name -->
            <div class="gift-btn-row">
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

  // Action Handlers
  const downloadBtn = container.querySelector('#downloadQrBtn');
  const copyBtn = container.querySelector('#copyAccBtn');
  const toast = container.querySelector('#giftToast');

  // Download KHQR file
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = giftData.qrDownload || `${B}img/qr-khqr.png`;
      link.download = `KHQR-${giftData.accountName.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Copy Account Name
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(giftData.accountName).then(() => {
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
