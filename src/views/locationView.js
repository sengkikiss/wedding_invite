import { wedding as W } from '../data/wedding.js';
import { dict } from '../i18n.js';

const B = import.meta.env ? (import.meta.env.BASE_URL || '/') : '/';

export function renderLocationView(container, { lang }) {
  const t = () => dict[lang];
  const v = W.venue[lang];
  const mapData = W.map || {
    embedUrl: 'https://maps.google.com/maps?q=11.2333,105.3667&t=&z=14&ie=UTF8&iwloc=&output=embed',
    mapsUrl: 'https://maps.google.com/?q=11.2333,105.3667',
    coords: '11.2333° N, 105.3667° E'
  };

  container.innerHTML = `
    <div class="page-section section-location" id="locationSection">
      <div class="section-divider">
        <img class="divider-svg" src="${B}elements/divider.svg" alt="" />
      </div>

      <div class="view-header">
        <img class="view-crest" src="${B}elements/crest.svg" alt="" />
        <h2 class="view-title foil shimmer" data-k="loc_title">${t().loc_title}</h2>
        <p class="view-subtitle" data-k="loc_subtitle">${t().loc_subtitle}</p>
      </div>

      <!-- Venue Details Card -->
      <div class="loc-card">
        <div class="loc-badge">${v.name}</div>
        <p class="loc-address">${v.address}</p>
        <div class="loc-time-tag">
          ${W.timeText[lang]} · ថ្ងៃទី ${W.date.d} ខែ ${W.date.m} ឆ្នាំ ${W.date.y}
        </div>

        ${mapData.isPlaceholder ? `
        <div class="loc-helper-note">
          ${t().map_default_note}
        </div>
        ` : ''}

        <!-- Google Map Embed Container -->
        <div class="map-embed-wrapper">
          <iframe
            class="google-map-iframe"
            title="Wedding Venue Google Map"
            src="${mapData.embedUrl}"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <!-- Action Buttons -->
        <div class="loc-actions">
          <a
            href="${mapData.mapsUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="loc-btn primary-btn"
          >
            ${t().open_maps}
          </a>
          <button class="loc-btn secondary-btn" id="copyAddressBtn">
            ${t().copy_address}
          </button>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${mapData.lat || 11.1957424},${mapData.lng || 105.3655148}"
            target="_blank"
            rel="noopener noreferrer"
            class="loc-btn outline-btn"
          >
            ${t().get_directions}
          </a>
        </div>
      </div>

      <div class="toast-popup" id="locToast" hidden>
        <span class="toast-text">${t().address_copied_toast}</span>
      </div>
    </div>
  `;

  const copyBtn = container.querySelector('#copyAddressBtn');
  const toast = container.querySelector('#locToast');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const fullText = `${v.name} - ${v.address}`;
      navigator.clipboard.writeText(fullText).then(() => {
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
