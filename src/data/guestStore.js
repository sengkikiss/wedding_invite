const STORAGE_GUESTS_KEY = 'khmer_wedding_guests_v1';
const STORAGE_WISHES_KEY = 'khmer_wedding_wishes_v1';

const DEFAULT_GUESTS = [
  { id: 'g-1', name: 'លោក សុខ', group: 'vip', status: 'going', count: 2, createdAt: Date.now() - 86400000 * 2 },
  { id: 'g-2', name: 'អ្នកស្រី ចិន្តា', group: 'family', status: 'going', count: 2, createdAt: Date.now() - 86400000 * 3 },
  { id: 'g-3', name: 'លោក វិចិត្រ និង ភរិយា', group: 'colleague', status: 'going', count: 2, createdAt: Date.now() - 86400000 * 1 },
  { id: 'g-4', name: 'កញ្ញា មុនីនាថ', group: 'friend', status: 'maybe', count: 1, createdAt: Date.now() - 86400000 * 4 },
  { id: 'g-5', name: 'លោក ពៅ និង គ្រួសារ', group: 'family', status: 'going', count: 4, createdAt: Date.now() - 86400000 * 5 },
  { id: 'g-6', name: 'ប្អូនប្រុស តារា', group: 'friend', status: 'going', count: 1, createdAt: Date.now() - 86400000 * 2 },
];

const DEFAULT_WISHES = [
  {
    id: 'w-1',
    name: 'លោក សុខ',
    status: 'going',
    count: 2,
    message: 'សូមជូនពរប្អូនទាំងពីរ ស្រឡាញ់គ្នារហូតដល់ចាស់កោងខ្នង មានសុភមង្គល និងជោគជ័យគ្រប់ភារកិច្ច!',
    time: '១ ម៉ោងមុន',
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'w-2',
    name: 'អ្នកស្រី ចិន្តា',
    status: 'going',
    count: 2,
    message: 'រីករាយថ្ងៃមង្គលការក្មួយទាំងពីរ! ជូនពរទទួលបានទ្រព្យសម្បត្តិហូរហៀរ និងកូនចៅពេញផ្ទះ!',
    time: '៣ ម៉ោងមុន',
    timestamp: Date.now() - 10800000,
  },
  {
    id: 'w-3',
    name: 'លោក វិចិត្រ និង ភរិយា',
    status: 'going',
    count: 2,
    message: 'Congratulations Vanda & Sreyneath! Best wishes on this wonderful journey together!',
    time: '១ ថ្ងៃមុន',
    timestamp: Date.now() - 86400000,
  },
];

export function getGuests() {
  try {
    const raw = localStorage.getItem(STORAGE_GUESTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_GUESTS_KEY, JSON.stringify(DEFAULT_GUESTS));
      return [...DEFAULT_GUESTS];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [...DEFAULT_GUESTS];
  }
}

export function saveGuests(guests) {
  try {
    localStorage.setItem(STORAGE_GUESTS_KEY, JSON.stringify(guests));
  } catch (e) {
    console.error('Error saving guests', e);
  }
}

export function addGuest(name, group = 'friend') {
  const guests = getGuests();
  const newGuest = {
    id: 'g-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    name: name.trim(),
    group,
    status: 'pending',
    count: 1,
    createdAt: Date.now(),
  };
  guests.unshift(newGuest);
  saveGuests(guests);
  return newGuest;
}

export function deleteGuest(id) {
  const guests = getGuests().filter((g) => g.id !== id);
  saveGuests(guests);
  return guests;
}

export function getWishes() {
  try {
    const raw = localStorage.getItem(STORAGE_WISHES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_WISHES_KEY, JSON.stringify(DEFAULT_WISHES));
      return [...DEFAULT_WISHES];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [...DEFAULT_WISHES];
  }
}

export function saveWishes(wishes) {
  try {
    localStorage.setItem(STORAGE_WISHES_KEY, JSON.stringify(wishes));
  } catch (e) {
    console.error('Error saving wishes', e);
  }
}

export function addWish(name, status = 'going', count = 1, message = '') {
  const wishes = getWishes();
  const newWish = {
    id: 'w-' + Date.now(),
    name: name.trim() || 'ភ្ញៀវកិត្តិយស',
    status,
    count: parseInt(count, 10) || 1,
    message: message.trim(),
    time: 'ទើបតែផ្ញើ',
    timestamp: Date.now(),
  };
  wishes.unshift(newWish);
  saveWishes(wishes);

  // Update corresponding guest RSVP if name matches
  const guests = getGuests();
  const match = guests.find((g) => g.name.toLowerCase() === name.trim().toLowerCase());
  if (match) {
    match.status = status;
    match.count = parseInt(count, 10) || 1;
    saveGuests(guests);
  }

  return newWish;
}

export function updateGuestStatus(id, status) {
  const guests = getGuests();
  const g = guests.find((item) => item.id === id);
  if (g) {
    g.status = status;
    saveGuests(guests);
  }
  return guests;
}

export function deleteWish(id) {
  const wishes = getWishes().filter((w) => w.id !== id);
  saveWishes(wishes);
  return wishes;
}

export function getCurrentGuestName() {
  if (typeof window === 'undefined') return 'លោក សុខ';
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to') || params.get('guest');
  if (to && to.trim()) {
    return decodeURIComponent(to.trim());
  }
  return 'លោក សុខ';
}

export function getGuestInviteUrl(guestName) {
  if (typeof window === 'undefined') return `/?to=${encodeURIComponent(guestName)}`;
  let pathname = window.location.pathname.replace(/\/admin(\.html)?$/i, '/');
  if (!pathname.endsWith('/')) {
    const lastSlash = pathname.lastIndexOf('/');
    if (lastSlash >= 0) pathname = pathname.substring(0, lastSlash + 1);
  }
  return `${window.location.origin}${pathname}?to=${encodeURIComponent(guestName)}`;
}

export function getTelegramShareUrl(guestName, lang = 'km') {
  const link = getGuestInviteUrl(guestName);
  const text = lang === 'km'
    ? `សូមគោរពអញ្ជើញ ${guestName} ចូលរួមពិធីអាពាហ៍ពិពាហ៍ វ៉ាន់ដា & ស្រីនាថ ខាងមុខនេះ៖`
    : `Cordially invite ${guestName} to the wedding ceremony of Vanda & Sreyneath:`;
  return `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
}

export function exportGuestsCSV() {
  const guests = getGuests();
  const header = ['ID', 'Name', 'Group', 'Status', 'Count', 'Invitation URL'];
  const rows = guests.map((g) => [
    g.id,
    `"${g.name.replace(/"/g, '""')}"`,
    g.group,
    g.status,
    g.count || 1,
    `"${getGuestInviteUrl(g.name)}"`,
  ]);
  const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wedding-guests-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

