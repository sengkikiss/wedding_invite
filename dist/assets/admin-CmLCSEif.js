import{a as e,c as t,d as n,f as r,i,l as a,n as o,p as s,r as c,s as l,t as u,u as d}from"./guestStore-VcCD_dTp.js";var f=`km`,p=()=>r[f],m=`guests`,h=``,g=`all`,_=`all`,v=document.getElementById(`adminApp`);function y(){let e=t(),n=d(),r=e.filter(e=>e.status===`going`),i=e.filter(e=>e.status===`maybe`),a=e.filter(e=>e.status===`cant`);e.filter(e=>!e.status||e.status===`pending`);let o=r.reduce((e,t)=>e+(t.count||1),0);v.innerHTML=`
    <div class="admin-wrapper">
      <!-- Top Navigation & Language Switch -->
      <div class="admin-top-nav">
        <a href="./" class="admin-back-btn">
          ${p().admin_nav_back}
        </a>
        <button class="admin-lang-btn" id="adminLangBtn">
          ${p().lang}
        </button>
      </div>

      <!-- Header -->
      <header class="admin-header">
        <img class="admin-crest" src="./elements/crest.svg" alt="" />
        <h1 class="admin-title foil shimmer">${p().admin_heading}</h1>
        <p class="admin-subtitle">${p().admin_subtitle}</p>
      </header>

      <!-- KPI Statistics Grid -->
      <div class="admin-stats-bar">
        <div class="stat-box highlight">
          <div class="stat-num">${s(e.length,f)}</div>
          <div class="stat-lbl">${p().total_guests}</div>
        </div>
        <div class="stat-box">
          <div class="stat-num text-gold">${s(r.length,f)} <small style="font-size:13px;opacity:0.8">(${s(o,f)})</small></div>
          <div class="stat-lbl">${p().status_going.split(` `)[0]}</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">${s(i.length,f)}</div>
          <div class="stat-lbl">${p().status_maybe.split(` `)[0]}</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">${s(a.length,f)}</div>
          <div class="stat-lbl">${p().status_cant.split(` `)[0]}</div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="admin-tabs">
        <button class="admin-tab ${m===`guests`?`active`:``}" data-tab="guests">
          ${p().tab_guests} (${s(e.length,f)})
        </button>
        <button class="admin-tab ${m===`wishes`?`active`:``}" data-tab="wishes">
          ${p().tab_wishes} (${s(n.length,f)})
        </button>
      </div>

      ${m===`guests`?b(e):x(n)}

      <!-- Global Toast -->
      <div class="toast-popup" id="adminToast" hidden>
        <span class="toast-text">${p().copied_toast}</span>
      </div>
    </div>
  `,w()}function b(e){let t=e.filter(e=>{let t=e.name.toLowerCase().includes(h.toLowerCase()),n=g===`all`||e.group===g,r=_===`all`||(e.status||`pending`)===_;return t&&n&&r});return`
    <!-- Add New Guest Card -->
    <div class="admin-card">
      <div class="admin-card-header">
        <h2 class="admin-card-title">${p().add_guest_btn}</h2>
      </div>
      <form id="addGuestForm" class="add-guest-grid">
        <input
          type="text"
          class="admin-input"
          id="newGuestName"
          placeholder="${p().guest_name_label}"
          required
        />
        <select class="admin-select" id="newGuestGroup">
          <option value="friend">${p().guest_group_friend}</option>
          <option value="family">${p().guest_group_family}</option>
          <option value="colleague">${p().guest_group_colleague}</option>
          <option value="vip">${p().guest_group_vip}</option>
        </select>
        <select class="admin-select" id="newGuestStatus">
          <option value="pending">${p().status_pending}</option>
          <option value="going">${p().status_going}</option>
          <option value="maybe">${p().status_maybe}</option>
          <option value="cant">${p().status_cant}</option>
        </select>
        <button type="submit" class="admin-primary-btn">
          ${p().save_btn}
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
          placeholder="${p().search_guest_ph}"
          value="${h}"
        />
      </div>

      <div class="admin-filter-group">
        <select class="admin-select" id="groupFilterSelect" style="width:auto">
          <option value="all" ${g===`all`?`selected`:``}>${p().filter_all} (${p().guest_group_label})</option>
          <option value="vip" ${g===`vip`?`selected`:``}>${p().guest_group_vip}</option>
          <option value="family" ${g===`family`?`selected`:``}>${p().guest_group_family}</option>
          <option value="friend" ${g===`friend`?`selected`:``}>${p().guest_group_friend}</option>
          <option value="colleague" ${g===`colleague`?`selected`:``}>${p().guest_group_colleague}</option>
        </select>

        <select class="admin-select" id="statusFilterSelect" style="width:auto">
          <option value="all" ${_===`all`?`selected`:``}>${p().filter_all} (${f===`km`?`ស្ថានភាព`:`Status`})</option>
          <option value="going" ${_===`going`?`selected`:``}>${p().status_going.split(` `)[0]}</option>
          <option value="maybe" ${_===`maybe`?`selected`:``}>${p().status_maybe.split(` `)[0]}</option>
          <option value="cant" ${_===`cant`?`selected`:``}>${p().status_cant.split(` `)[0]}</option>
          <option value="pending" ${_===`pending`?`selected`:``}>${p().status_pending.split(` `)[0]}</option>
        </select>

        <button type="button" class="admin-tool-btn" id="copyAllLinksBtn">
          ${p().copy_all_links}
        </button>

        <button type="button" class="admin-tool-btn" id="exportCsvBtn">
          ${p().export_csv}
        </button>
      </div>
    </div>

    <!-- Guest Cards List -->
    <div class="guest-list">
      ${t.length===0?`
        <div style="text-align:center;padding:36px;color:#a89679;background:rgba(20,10,5,0.4);border-radius:12px">
          ${f===`km`?`មិនមានឈ្មោះភ្ញៀវត្រូវគ្នានឹងការស្វែងរកទេ`:`No guests found matching your criteria.`}
        </div>
      `:t.map(e=>{let t=l(e.name),n=a(e.name,f);return`
          <div class="guest-card" data-id="${e.id}">
            <div class="gc-top">
              <div class="gc-meta-left">
                <span class="gc-title-name">${e.name}</span>
                <span class="gc-tag ${e.group}">${S(e.group)}</span>
                ${e.status===`going`&&e.count?`<span class="gc-tag">${s(e.count,f)} ${f===`km`?`នាក់`:`ppl`}</span>`:``}
              </div>

              <div class="gc-meta-right">
                <select class="status-select" data-guest-status-id="${e.id}">
                  <option value="pending" ${e.status===`pending`||!e.status?`selected`:``}>${p().status_pending.split(` `)[0]}</option>
                  <option value="going" ${e.status===`going`?`selected`:``}>${p().status_going.split(` `)[0]}</option>
                  <option value="maybe" ${e.status===`maybe`?`selected`:``}>${p().status_maybe.split(` `)[0]}</option>
                  <option value="cant" ${e.status===`cant`?`selected`:``}>${p().status_cant.split(` `)[0]}</option>
                </select>
              </div>
            </div>

            <div class="gc-link-box">
              <input type="text" class="gc-link-text" readonly value="${decodeURIComponent(t)}" />
            </div>

            <div class="gc-btn-group">
              <button class="gc-action-btn" data-copy-url="${t}">
                ${p().copy_link}
              </button>
              <a href="${n}" target="_blank" rel="noopener" class="gc-action-btn tg">
                ${p().share_telegram}
              </a>
              <a href="${t}" target="_blank" rel="noopener" class="gc-action-btn">
                ${p().preview_guest}
              </a>
              <button class="gc-action-btn del" data-del-guest-id="${e.id}">
                ${p().delete_guest}
              </button>
            </div>
          </div>
        `}).join(``)}
    </div>
  `}function x(e){return`
    <!-- Add New Wish / Note Card -->
    <div class="admin-card">
      <div class="admin-card-header">
        <h2 class="admin-card-title">${f===`km`?`+ កត់ត្រាពាក្យជូនពរ / សារថ្មី`:`+ Record New Wish / Note`}</h2>
      </div>
      <form id="adminAddWishForm" style="display:flex;flex-direction:column;gap:10px">
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px">
          <input
            type="text"
            class="admin-input"
            id="newWishName"
            placeholder="${p().guest_name_label}"
            required
          />
          <select class="admin-select" id="newWishStatus">
            <option value="going">${p().status_going}</option>
            <option value="maybe">${p().status_maybe}</option>
            <option value="cant">${p().status_cant}</option>
          </select>
          <input
            type="number"
            class="admin-input"
            id="newWishCount"
            value="2"
            min="1"
            max="10"
            placeholder="${p().rsvp_count}"
          />
        </div>
        <textarea
          class="admin-input"
          id="newWishMessage"
          rows="2"
          placeholder="${p().rsvp_wish_ph}"
          required
        ></textarea>
        <button type="submit" class="admin-primary-btn" style="align-self:flex-start">
          ${p().save_btn}
        </button>
      </form>
    </div>

    <div class="wishes-manage-list">
      ${e.length===0?`
        <div style="text-align:center;padding:40px;color:#a89679;background:rgba(20,10,5,0.4);border-radius:12px">
          ${f===`km`?`មិនទាន់មានពាក្យជូនពរនៅឡើយទេ`:`No wishes received yet.`}
        </div>
      `:e.map(e=>`
        <div class="wm-card" data-wish-id="${e.id}">
          <div class="wm-header">
            <span class="wm-author">${e.name}</span>
            <span class="gc-tag ${e.status||`going`}">
              ${e.status===`going`?p().status_going.split(` `)[0]:p().status_maybe.split(` `)[0]}
              ${e.count?` (${s(e.count,f)} ${f===`km`?`នាក់`:`ppl`})`:``}
            </span>
          </div>
          <p class="wm-message">“${e.message}”</p>
          <div class="wm-footer">
            <span>${e.time||(f===`km`?`ទើបតែផ្ញើ`:`Just now`)}</span>
            <button class="gc-action-btn del" data-del-wish-id="${e.id}">
              ${p().delete_wish}
            </button>
          </div>
        </div>
      `).join(``)}
    </div>
  `}function S(e){return e===`vip`?p().guest_group_vip:e===`family`?p().guest_group_family:e===`colleague`?p().guest_group_colleague:p().guest_group_friend}function C(e){let t=document.getElementById(`adminToast`);t&&(e&&(t.querySelector(`.toast-text`).textContent=e),t.hidden=!1,t.classList.add(`show`),setTimeout(()=>{t.classList.remove(`show`),setTimeout(()=>{t.hidden=!0},300)},2400))}function w(){document.getElementById(`adminLangBtn`)?.addEventListener(`click`,()=>{f=f===`km`?`en`:`km`,y()}),document.querySelectorAll(`.admin-tab`).forEach(e=>{e.addEventListener(`click`,()=>{m=e.dataset.tab,y()})});let r=document.getElementById(`addGuestForm`);r&&r.addEventListener(`submit`,e=>{e.preventDefault();let t=document.getElementById(`newGuestName`).value,r=document.getElementById(`newGuestGroup`).value,i=document.getElementById(`newGuestStatus`).value;if(t&&t.trim()){let e=u(t,r);i&&i!==`pending`&&n(e.id,i),C(f===`km`?`បានបន្ថែម ${t} ជោគជ័យ!`:`Added ${t} successfully!`),y()}});let a=document.getElementById(`adminAddWishForm`);a&&a.addEventListener(`submit`,e=>{e.preventDefault();let t=document.getElementById(`newWishName`).value,n=document.getElementById(`newWishStatus`).value,r=document.getElementById(`newWishCount`).value,i=document.getElementById(`newWishMessage`).value;t&&i&&(o(t,n,r,i),C(f===`km`?`បានកត់ត្រាពាក្យជូនពរ!`:`Wish recorded!`),y())});let s=document.getElementById(`guestSearchInput`);s&&s.addEventListener(`input`,e=>{h=e.target.value,y();let t=document.getElementById(`guestSearchInput`);t&&(t.focus(),t.setSelectionRange(h.length,h.length))}),document.getElementById(`groupFilterSelect`)?.addEventListener(`change`,e=>{g=e.target.value,y()}),document.getElementById(`statusFilterSelect`)?.addEventListener(`change`,e=>{_=e.target.value,y()}),document.getElementById(`copyAllLinksBtn`)?.addEventListener(`click`,()=>{let e=t().map(e=>`${e.name}: ${l(e.name)}`).join(`
`);navigator.clipboard.writeText(e).then(()=>{C(p().all_links_copied)}).catch(()=>{C(p().all_links_copied)})}),document.getElementById(`exportCsvBtn`)?.addEventListener(`click`,()=>{e(),C(f===`km`?`បានទាញយក File CSV!`:`CSV exported successfully!`)}),v.addEventListener(`click`,e=>{let t=e.target.closest(`[data-copy-url]`);if(t){let e=t.dataset.copyUrl;navigator.clipboard.writeText(e).then(()=>{C(p().copied_toast)}).catch(()=>{C(p().copied_toast)});return}let n=e.target.closest(`[data-del-guest-id]`);if(n){let e=n.dataset.delGuestId;confirm(p().delete_confirm)&&(c(e),y());return}let r=e.target.closest(`[data-del-wish-id]`);if(r){let e=r.dataset.delWishId;confirm(p().delete_confirm)&&(i(e),y())}}),v.addEventListener(`change`,e=>{let t=e.target.closest(`[data-guest-status-id]`);if(t){let e=t.dataset.guestStatusId,r=t.value;n(e,r),C(f===`km`?`បានកែប្រែស្ថានភាពជោគជ័យ!`:`Status updated!`),y()}})}y();