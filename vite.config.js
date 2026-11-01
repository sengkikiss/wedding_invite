import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  plugins: [{
    name: 'site-url',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', (process.env.SITE_URL || 'https://YOUR-DOMAIN.vercel.app').replace(/\/$/, '')),
  }],
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        admin: resolve(process.cwd(), 'admin.html'),
      },
    },
  },
});
