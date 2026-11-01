# Khmer wedding e-invitation (Vanda & Sreyneath)

    npm install
    npm run photos     # rebuilds WebP sizes from photos-src/ (strips EXIF/GPS) and src/data/gallery.js
    npm run dev        # local preview
    SITE_URL=https://your-site.vercel.app npm run build   # sets absolute og:image URL

Edit details in `src/data/wedding.js` and text in `src/i18n.js`.
Set `map: { lat, lng }` and `music: '/audio/song.mp3'` there when you have them.
Deploy: push to a private GitHub repo, then import it in Vercel (framework: Vite, output: dist).
