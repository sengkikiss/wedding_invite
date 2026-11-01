import './style.css';
import './admin.css';
import { dict, num } from './i18n.js';
import {
  getGuests,
  addGuest,
  deleteGuest,
  updateGuestStatus,
  getWishes,
  addWish,
  deleteWish,
  getGuestInviteUrl,
  getTelegramShareUrl,
  exportGuestsCSV,
} from './data/guestStore.js';

let lang = 'km';
const t = () => dict[lang];

let currentTab = 'guests'; // 'guests' | 'wishes'
let searchQuery = '';
let filterGroup = 'all';
let filterStatus = 'all';

const app = document.getElementById('adminApp');

function render() {
  const guests = getGuests();
  const wishes = getWishes();

  const goingGuests = guests.filter((g) => g.status === 'going');
  const maybeGuests = guests.filter((g) => g.status === 'maybe');
  const cantGuests = guests.filter((g) => g.status === 'cant');
  const pendingGuests = guests.filter((g) => !g.status || g.status === 'pending');

  const totalAttendeesCount = goingGuests.reduce((acc, g) => acc + (g.count || 1), 0);

  app.innerHTML = `
    <div class="admin-wrapper">
      <!-- Top Navigation & Language Switch -->
      <div class="admin-top-nav">
        <a href="./" class="admin-back-btn">
          ${t().admin_nav_back}
        </a>
        <button class="admin-lang-btn" id="adminLangBtn">
          ${t().lang}
        </button>
      </div>

      <!-- Header -->
      <header class="admin-header">
        <img class="admin-crest" src="./elements/crest.svg" alt="" />
        <h1 class="admin-title foil shimmer">${t().admin_heading}</h1>
        <p class="admin-subtitle">${t().admin_subtitle}</p>
      </header>

      <!-- KPI Statistics Grid -->
      <div class="admin-stats-bar">
        <div class="stat-box highlight">
          <div class="stat-num">${num(guests.length, lang)}</div>
          <div class="stat-lbl">${t().total_guests}</div>
        </div>
        <div class="stat-box">
          <div class="stat-num text-gold">${num(goingGuests.length, lang)} <small style="font-size:13px;opacity:0.8">(${num(totalAttendeesCount, lang)})</small></div>
          <div class="stat-lbl">${t().status_going.split(' ')[0]}</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">${num(maybeGuests.length, lang)}</div>
          <div class="stat-lbl">${t().status_maybe.split(' ')[0]}</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">${num(cantGuests.length, lang)}</div>
          <div class="stat-lbl">${t().status_cant.split(' ')[0]}</div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="admin-tabs">
        <button class="admin-tab ${currentTab === 'guests' ? 'active' : ''}" data-tab="guests">
          ${t().tab_guests} (${num(guests.length, lang)})
        </button>
        <button class="admin-tab ${currentTab === 'wishes' ? 'active' : ''}" data-tab="wishes">
          ${t().tab_wishes} (${num(wishes.length, lang)})
        </button>
      </div>

      ${currentTab === 'guests' ? renderGuestsTab(guests) : renderWishesTab(wishes)}

      <!-- Global Toast -->
      <div class="toast-popup" id="adminToast" hidden>
        <span class="toast-text">${t().copied_toast}</span>
      </div>
    </div>
  `;

  bindEvents();
}

function renderGuestsTab(guests) {
  let filtered = guests.filter((g) => {
    const matchName = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGroup = filterGroup === 'all' || g.group === filterGroup;
    const matchStatus = filterStatus === 'all' || (g.status || 'pending') === filterStatus;
    return matchName && matchGroup && matchStatus;
  });

  return `
    <!-- Add New Guest Card -->
    <div class="admin-card">
      <div class="admin-card-header">
        <h2 class="admin-card-title">${t().add_guest_btn}</h2>
      </div>
      <form id="addGuestForm" class="add-guest-grid">
        <input
          type="text"
          class="admin-input"
          id="newGuestName"
          placeholder="${t().guest_name_label}"
          required
        />
        <select class="admin-select" id="newGuestGroup">
          <option value="friend">${t().guest_group_friend}</option>
          <option value="family">${t().guest_group_family}</option>
          <option value="colleague">${t().guest_group_colleague}</option>
          <option value="vip">${t().guest_group_vip}</option>
        </select>
        <select class="admin-select" id="newGuestStatus">
          <option value="pending">${t().status_pending}</option>
          <option value="going">${t().status_going}</option>
          <option value="maybe">${t().status_maybe}</option>
          <option value="cant">${t().status_cant}</option>
        </select>
        <button type="submit" class="admin-primary-btn">
          ${t().save_btn}
        </button>
      </form>
    </div>

    <!-- Toolbar: Search, Filters & Export -->
    <div class="admin-toolbar">
      <div class="admin-search-box">
        <input
          type="text"
          class="admin-input"
          id="guestSearchInput"
          placeholder="${t().search_guest_ph}"
          value="${searchQuery}"
        />
      </div>

      <div class="admin-filter-group">
        <select class="admin-select" id="groupFilterSelect" style="width:auto">
          <option value="all" ${filterGroup === 'all' ? 'selected' : ''}>${t().filter_all} (${t().guest_group_label})</option>
          <option value="vip" ${filterGroup === 'vip' ? 'selected' : ''}>${t().guest_group_vip}</option>
          <option value="family" ${filterGroup === 'family' ? 'selected' : ''}>${t().guest_group_family}</option>
          <option value="friend" ${filterGroup === 'friend' ? 'selected' : ''}>${t().guest_group_friend}</option>
          <option value="colleague" ${filterGroup === 'colleague' ? 'selected' : ''}>${t().guest_group_colleague}</option>
        </select>

        <select class="admin-select" id="statusFilterSelect" style="width:auto">
          <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>${t().filter_all} (${lang === 'km' ? 'ស្ថានភាព' : 'Status'})</option>
          <option value="going" ${filterStatus === 'going' ? 'selected' : ''}>${t().status_going.split(' ')[0]}</option>
          <option value="maybe" ${filterStatus === 'maybe' ? 'selected' : ''}>${t().status_maybe.split(' ')[0]}</option>
          <option value="cant" ${filterStatus === 'cant' ? 'selected' : ''}>${t().status_cant.split(' ')[0]}</option>
          <option value="pending" ${filterStatus === 'pending' ? 'selected' : ''}>${t().status_pending.split(' ')[0]}</option>
        </select>

        <button type="button" class="admin-tool-btn" id="copyAllLinksBtn">
          ${t().copy_all_links}
        </button>

        <button type="button" class="admin-tool-btn" id="exportCsvBtn">
          ${t().export_csv}
        </button>
      </div>
    </div>

    <!-- Guest Cards List -->
    <div class="guest-list">
      ${filtered.length === 0 ? `
        <div style="text-align:center;padding:36px;color:#a89679;background:rgba(20,10,5,0.4);border-radius:12px">
          ${lang === 'km' ? 'មិនមានឈ្មោះភ្ញៀវត្រូវគ្នានឹងការស្វែងរកទេ' : 'No guests found matching your criteria.'}
        </div>
      ` : filtered.map((g) => {
        const inviteUrl = getGuestInviteUrl(g.name);
        const tgUrl = getTelegramShareUrl(g.name, lang);
        return `
          <div class="guest-card" data-id="${g.id}">
            <div class="gc-top">
              <div class="gc-meta-left">
                <span class="gc-title-name">${g.name}</span>
                <span class="gc-tag ${g.group}">${getGroupLabel(g.group)}</span>
                ${g.status === 'going' && g.count ? `<span class="gc-tag">${num(g.count, lang)} ${lang === 'km' ? 'នាក់' : 'ppl'}</span>` : ''}
              </div>

              <div class="gc-meta-right">
                <select class="status-select" data-guest-status-id="${g.id}">
                  <option value="pending" ${g.status === 'pending' || !g.status ? 'selected' : ''}>${t().status_pending.split(' ')[0]}</option>
                  <option value="going" ${g.status === 'going' ? 'selected' : ''}>${t().status_going.split(' ')[0]}</option>
                  <option value="maybe" ${g.status === 'maybe' ? 'selected' : ''}>${t().status_maybe.split(' ')[0]}</option>
                  <option value="cant" ${g.status === 'cant' ? 'selected' : ''}>${t().status_cant.split(' ')[0]}</option>
                </select>
              </div>
            </div>

            <div class="gc-link-box">
              <input type="text" class="gc-link-text" readonly value="${decodeURIComponent(inviteUrl)}" />
            </div>

            <div class="gc-btn-group">
              <button class="gc-action-btn" data-copy-url="${inviteUrl}">
                ${t().copy_link}
              </button>
              <a href="${tgUrl}" target="_blank" rel="noopener" class="gc-action-btn tg">
                ${t().share_telegram}
              </a>
              <a href="${inviteUrl}" target="_blank" rel="noopener" class="gc-action-btn">
                ${t().preview_guest}
              </a>
              <button class="gc-action-btn del" data-del-guest-id="${g.id}">
                ${t().delete_guest}
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderWishesTab(wishes) {
  return `
    <!-- Add New Wish / Note Card -->
    <div class="admin-card">
      <div class="admin-card-header">
        <h2 class="admin-card-title">${lang === 'km' ? '+ កត់ត្រាពាក្យជូនពរ / សារថ្មី' : '+ Record New Wish / Note'}</h2>
      </div>
      <form id="adminAddWishForm" style="display:flex;flex-direction:column;gap:10px">
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px">
          <input
            type="text"
            class="admin-input"
            id="newWishName"
            placeholder="${t().guest_name_label}"
            required
          />
          <select class="admin-select" id="newWishStatus">
            <option value="going">${t().status_going}</option>
            <option value="maybe">${t().status_maybe}</option>
            <option value="cant">${t().status_cant}</option>
          </select>
          <input
            type="number"
            class="admin-input"
            id="newWishCount"
            value="2"
            min="1"
            max="10"
            placeholder="${t().rsvp_count}"
          />
        </div>
        <textarea
          class="admin-input"
          id="newWishMessage"
          rows="2"
          placeholder="${t().rsvp_wish_ph}"
          required
        ></textarea>
        <button type="submit" class="admin-primary-btn" style="align-self:flex-start">
          ${t().save_btn}
        </button>
      </form>
    </div>

    <div class="wishes-manage-list">
      ${wishes.length === 0 ? `
        <div style="text-align:center;padding:40px;color:#a89679;background:rgba(20,10,5,0.4);border-radius:12px">
          ${lang === 'km' ? 'មិនទាន់មានពាក្យជូនពរនៅឡើយទេ' : 'No wishes received yet.'}
        </div>
      ` : wishes.map((w) => `
        <div class="wm-card" data-wish-id="${w.id}">
          <div class="wm-header">
            <span class="wm-author">${w.name}</span>
            <span class="gc-tag ${w.status || 'going'}">
              ${w.status === 'going' ? t().status_going.split(' ')[0] : t().status_maybe.split(' ')[0]}
              ${w.count ? ` (${num(w.count, lang)} ${lang === 'km' ? 'នាក់' : 'ppl'})` : ''}
            </span>
          </div>
          <p class="wm-message">“${w.message}”</p>
          <div class="wm-footer">
            <span>${w.time || (lang === 'km' ? 'ទើបតែផ្ញើ' : 'Just now')}</span>
            <button class="gc-action-btn del" data-del-wish-id="${w.id}">
              ${t().delete_wish}
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function getGroupLabel(group) {
  if (group === 'vip') return t().guest_group_vip;
  if (group === 'family') return t().guest_group_family;
  if (group === 'colleague') return t().guest_group_colleague;
  return t().guest_group_friend;
}

function showToast(message) {
  const toast = document.getElementById('adminToast');
  if (toast) {
    if (message) toast.querySelector('.toast-text').textContent = message;
    toast.hidden = false;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.hidden = true; }, 300);
    }, 2400);
  }
}

function bindEvents() {
  // Language Switch
  document.getElementById('adminLangBtn')?.addEventListener('click', () => {
    lang = lang === 'km' ? 'en' : 'km';
    render();
  });

  // Tab Switching
  document.querySelectorAll('.admin-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      currentTab = tab.dataset.tab;
      render();
    });
  });

  // Add Guest Form
  const addForm = document.getElementById('addGuestForm');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('newGuestName').value;
      const group = document.getElementById('newGuestGroup').value;
      const status = document.getElementById('newGuestStatus').value;
      if (name && name.trim()) {
        const guest = addGuest(name, group);
        if (status && status !== 'pending') {
          updateGuestStatus(guest.id, status);
        }
        showToast(lang === 'km' ? `បានបន្ថែម ${name} ជោគជ័យ!` : `Added ${name} successfully!`);
        render();
      }
    });
  }

  // Add Wish Form (Admin)
  const addWishForm = document.getElementById('adminAddWishForm');
  if (addWishForm) {
    addWishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('newWishName').value;
      const status = document.getElementById('newWishStatus').value;
      const count = document.getElementById('newWishCount').value;
      const message = document.getElementById('newWishMessage').value;
      if (name && message) {
        addWish(name, status, count, message);
        showToast(lang === 'km' ? 'បានកត់ត្រាពាក្យជូនពរ!' : 'Wish recorded!');
        render();
      }
    });
  }

  // Search input
  const searchInput = document.getElementById('guestSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
      // Refocus search input after re-render
      const newInput = document.getElementById('guestSearchInput');
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(searchQuery.length, searchQuery.length);
      }
    });
  }

  // Filter Group
  document.getElementById('groupFilterSelect')?.addEventListener('change', (e) => {
    filterGroup = e.target.value;
    render();
  });

  // Filter Status
  document.getElementById('statusFilterSelect')?.addEventListener('change', (e) => {
    filterStatus = e.target.value;
    render();
  });

  // Copy All Links
  document.getElementById('copyAllLinksBtn')?.addEventListener('click', () => {
    const guests = getGuests();
    const allLinks = guests.map((g) => `${g.name}: ${getGuestInviteUrl(g.name)}`).join('\n');
    navigator.clipboard.writeText(allLinks).then(() => {
      showToast(t().all_links_copied);
    }).catch(() => {
      showToast(t().all_links_copied);
    });
  });

  // Export CSV
  document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
    exportGuestsCSV();
    showToast(lang === 'km' ? 'បានទាញយក File CSV!' : 'CSV exported successfully!');
  });

  // Event Delegation for Guest Cards & Wishes
  app.addEventListener('click', (e) => {
    // Copy URL
    const copyBtn = e.target.closest('[data-copy-url]');
    if (copyBtn) {
      const url = copyBtn.dataset.copyUrl;
      navigator.clipboard.writeText(url).then(() => {
        showToast(t().copied_toast);
      }).catch(() => {
        showToast(t().copied_toast);
      });
      return;
    }

    // Delete Guest
    const delGuestBtn = e.target.closest('[data-del-guest-id]');
    if (delGuestBtn) {
      const id = delGuestBtn.dataset.delGuestId;
      if (confirm(t().delete_confirm)) {
        deleteGuest(id);
        render();
      }
      return;
    }

    // Delete Wish
    const delWishBtn = e.target.closest('[data-del-wish-id]');
    if (delWishBtn) {
      const id = delWishBtn.dataset.delWishId;
      if (confirm(t().delete_confirm)) {
        deleteWish(id);
        render();
      }
      return;
    }
  });

  // Inline Status Change dropdown
  app.addEventListener('change', (e) => {
    const select = e.target.closest('[data-guest-status-id]');
    if (select) {
      const id = select.dataset.guestStatusId;
      const newStatus = select.value;
      updateGuestStatus(id, newStatus);
      showToast(lang === 'km' ? 'បានកែប្រែស្ថានភាពជោគជ័យ!' : 'Status updated!');
      render();
    }
  });
}

// Initial render
render();
