// All wedding details live here.
export const wedding = {
  groom: { km: { full: 'វឿន វ៉ាន់ដា', short: 'វ៉ាន់ដា' }, en: { full: 'Vorun Vanda', short: 'Vanda' } },
  bride: { km: { full: 'ឌីណា ស្រីនាថ', short: 'ស្រីនាថ' }, en: { full: 'Dyna Sreyneath', short: 'Sreyneath' } },
  parents: {
    groom: { father: { km: 'យឹម ប៊ុនថាត', en: 'Yoem Buntha' }, mother: { km: 'ស៊ូ សាវី', en: 'So Savy' } },
    bride: { father: { km: 'ឆន ឌីណា', en: 'Chhorn Dyna' }, mother: { km: 'ផន សុផុន', en: 'Phon Sophun' } },
  },
  date: { iso: '2026-12-16T16:00:00+07:00', y: 2026, m: 12, d: 16, weekdayIdx: 3 /* Wed */ },
  lunar: { km: 'ត្រូវនឹងថ្ងៃ ៧ កើត ខែមិគសិរ ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០', en: '7th waxing day, month of Migasir · Year of the Horse · B.E. 2570' },
  timeText: { km: 'វេលាម៉ោង ៤:០០ ល្ងាច', en: '4:00 pm' },
  venue: {
    km: { name: 'គេហដ្ឋានខាងស្រី', address: 'ភូមិចង្រុះ ឃុំរំចេក ស្រុកព្រះស្តេច ខេត្តព្រៃវែង' },
    en: { name: "The Bride's Residence", address: 'Chongros Village, Romchek Commune, Prasdech District, Prey Veng Province' },
  },
  // Google Maps Location: Default placeholder. You can replace the embedUrl & mapsUrl anytime!
  map: {
    embedUrl: 'https://maps.google.com/maps?q=11.2333,105.3667&t=&z=14&ie=UTF8&iwloc=&output=embed',
    mapsUrl: 'https://maps.google.com/?q=11.2333,105.3667',
    coords: '11.2333° N, 105.3667° E'
  },
  // Wedding Gift & KHQR settings (Universal KHQR: KHR & USD)
  gift: {
    accountName: 'SREYNEAT DYNA',
    qrImage: '/img/qr-khqr.webp',
    qrDownload: '/img/qr-khqr.png',
    bankType: 'KHQR (Bakong / គ្រប់ធនាគារទាំងអស់)',
    currencies: 'KHR & USD',
    bgImage: '05-corridor',
    khr: {
      accountName: 'SREYNEAT DYNA',
      qrImage: '/img/qr-khqr.webp',
    },
    usd: {
      accountName: 'SREYNEAT DYNA',
      qrImage: '/img/qr-khqr.webp',
    },
  },
  music: '/audio/wedding-song.mp3',
  photos: { envelopeBg: '01-angkor-blue', cover: '06-walk-wide', coverWide: '05-corridor' },
  programme: [
    { time: { km: '០៧:០០ ព្រឹក', en: '07:00 AM' }, title: { km: 'ពិធីហែជំនូន & ពិសាអាហារពេលព្រឹក', en: 'Groom Procession & Morning Banquet' } },
    { time: { km: '០៩:០០ ព្រឹក', en: '09:00 AM' }, title: { km: 'ពិធីកាត់សក់បង្កក់សិរី', en: 'Hair Cutting Ceremony' } },
    { time: { km: '១១:០០ ព្រឹក', en: '11:00 AM' }, title: { km: 'ពិធីសែនផ្ទឹម & ចងដៃសំពះព្រះពរ', en: 'Knot Tying Ceremony & Blessings' } },
    { time: { km: '០៤:០០ ល្ងាច', en: '04:00 PM' }, title: { km: 'ពិធីទទួលភ្ញៀវពិសាភោជនាហារ', en: 'Evening Wedding Reception' } },
  ],
};
