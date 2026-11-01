import { dict, num } from '../i18n.js';
import {
  getWishes,
  addWish,
  getCurrentGuestName,
} from '../data/guestStore.js';

const B = import.meta.env ? (import.meta.env.BASE_URL || '/') : '/';

export function renderGuestsView(container, { lang }) {
  const t = () => dict[lang];
  let currentGuest = getCurrentGuestName();

  function render() {
    const wishes = getWishes();

    container.innerHTML = `
      <div class="page-section section-guests" id="guestsSection">
        <div class="section-divider">
          <img class="divider-svg" src="${B}elements/divider.svg" alt="" />
        </div>

        <div class="view-header">
          <h2 class="view-title foil shimmer" data-k="guest_title">${t().guest_title}</h2>
          <p class="view-subtitle" data-k="guest_subtitle">${t().guest_subtitle}</p>
        </div>

        <!-- Personalized Greeting Card -->
        <div class="guest-welcome-card">
          <div class="gw-badge">${t().invite}</div>
          <div class="gw-name foil">${currentGuest}</div>
          <p class="gw-text">
            ${lang === 'km'
              ? 'វត្តមានដ៏ឧត្តុង្គឧត្តមរបស់លោកអ្នក គឺជាកិត្តិយសដ៏ធំធេងសម្រាប់គ្រួសារយើងខ្ញុំទាំងពីរ!'
              : 'Your honorable presence is the greatest joy and honor for our wedding!'}
          </p>
        </div>

        <!-- RSVP & Blessing Form -->
        <div class="rsvp-card">
          <h3 class="rsvp-title">${t().rsvp_title}</h3>
          
          <form class="rsvp-form" id="rsvpForm">
            <div class="form-group">
              <label class="form-label">${t().rsvp_name}</label>
              <input type="text" class="form-input" id="rsvpNameInput" value="${currentGuest}" required />
            </div>

            <div class="form-group">
              <label class="form-label">${t().rsvp_status}</label>
              <div class="status-options">
                <label class="status-chip active">
                  <input type="radio" name="rsvpStatus" value="going" checked />
                  <span class="chip-dot going"></span>
                  <span>${t().status_going}</span>
                </label>
                <label class="status-chip">
                  <input type="radio" name="rsvpStatus" value="maybe" />
                  <span class="chip-dot maybe"></span>
                  <span>${t().status_maybe}</span>
                </label>
                <label class="status-chip">
                  <input type="radio" name="rsvpStatus" value="cant" />
                  <span class="chip-dot cant"></span>
                  <span>${t().status_cant}</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">${t().rsvp_count}</label>
              <select class="form-input" id="rsvpCountInput">
                <option value="1">1 ${lang === 'km' ? 'នាក់' : 'person'}</option>
                <option value="2" selected>2 ${lang === 'km' ? 'នាក់' : 'people'}</option>
                <option value="3">3 ${lang === 'km' ? 'នាក់' : 'people'}</option>
                <option value="4">4 ${lang === 'km' ? 'នាក់' : 'people'}</option>
                <option value="5">5+ ${lang === 'km' ? 'នាក់' : 'people'}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">${t().rsvp_wish}</label>
              <textarea class="form-input form-textarea" id="rsvpWishInput" rows="3" placeholder="${t().rsvp_wish_ph}" required></textarea>
            </div>

            <button type="submit" class="submit-btn foil shimmer">
              ${t().rsvp_submit}
            </button>
          </form>

          <div class="rsvp-alert" id="rsvpAlert" hidden>
            ${t().rsvp_success}
          </div>
        </div>

        <!-- Wishes Wall -->
        <div class="wishes-section">
          <h3 class="section-title">${t().wishes_wall} (${num(wishes.length, lang)})</h3>
          <div class="wishes-list" id="wishesList">
            ${wishes.map((w) => `
              <div class="wish-item">
                <div class="wish-top">
                  <b class="wish-author">${w.name}</b>
                  <span class="wish-status ${w.status}">
                    <span class="status-dot ${w.status}"></span>
                    ${w.status === 'going' ? t().status_going.split(' ')[0] : t().status_maybe.split(' ')[0]}
                  </span>
                </div>
                <p class="wish-body">“${w.message}”</p>
                <div class="wish-time">${w.time || (lang === 'km' ? 'ទើបតែផ្ញើ' : 'Just now')}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="toast-popup" id="copyToast" hidden>
          <span class="toast-text">${t().rsvp_success}</span>
        </div>
      </div>
    `;

    bindEvents();
  }

  function showToast(msg) {
    const toast = container.querySelector('#copyToast');
    if (toast) {
      if (msg) toast.querySelector('.toast-text').textContent = msg;
      toast.hidden = false;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast.hidden = true; }, 300);
      }, 2500);
    }
  }

  function bindEvents() {
    const rsvpForm = container.querySelector('#rsvpForm');
    if (rsvpForm) {
      const chips = rsvpForm.querySelectorAll('.status-chip');
      chips.forEach((c) => {
        c.addEventListener('click', () => {
          chips.forEach((x) => x.classList.remove('active'));
          c.classList.add('active');
        });
      });

      rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = container.querySelector('#rsvpNameInput').value;
        const status = rsvpForm.querySelector('input[name="rsvpStatus"]:checked').value;
        const count = container.querySelector('#rsvpCountInput').value;
        const wish = container.querySelector('#rsvpWishInput').value;

        addWish(name, status, count, wish);
        showToast(t().rsvp_success);
        setTimeout(() => {
          render();
        }, 600);
      });
    }
  }

  render();

  return {
    destroy: () => {},
  };
}
