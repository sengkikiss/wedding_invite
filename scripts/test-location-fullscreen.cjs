const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const dir = path.join(os.tmpdir(), `ch-loc-test-${Date.now()}`);
const port = 9245;

const proc = spawn(chrome, [
  '--headless=new',
  `--user-data-dir=${dir}`,
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--window-size=1440,900',
  'http://localhost:4173/'
]);

async function run() {
  try {
    await new Promise((r) => setTimeout(r, 1500));
    const res = await fetch(`http://127.0.0.1:${port}/json`);
    const targets = await res.json();
    const pageTarget = targets.find((t) => t.type === 'page');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve) => (ws.onopen = resolve));

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');

    // Click envelope seal immediately
    await send('Runtime.evaluate', { expression: `document.getElementById('seal')?.click()` });
    await new Promise((r) => setTimeout(r, 8500));

    // Scroll to locationSection
    await send('Runtime.evaluate', {
      expression: `document.getElementById('locationSection').scrollIntoView({ behavior: 'instant', block: 'center' })`
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Verify button texts
    const buttonInfo = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('#locationSection .loc-btn'));
        return btns.map(b => ({
          text: b.innerText.trim(),
          class: b.className,
          bg: window.getComputedStyle(b).background,
          color: window.getComputedStyle(b).color,
          width: b.offsetWidth,
          height: b.offsetHeight,
          visible: b.offsetWidth > 0 && b.offsetHeight > 0
        }));
      })()`
    });
    console.log('Button Info:', JSON.stringify(buttonInfo.result.value, null, 2));

    // Take Desktop Screenshot
    const ssDesktop = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/User/.gemini/antigravity/brain/ad7bdb01-401a-44af-aa55-033a09f3a226/location-desktop-fullscreen.png', Buffer.from(ssDesktop.data, 'base64'));
    console.log('Saved location-desktop-fullscreen.png');

    // Scroll to bookSection and capture
    await send('Runtime.evaluate', {
      expression: `document.getElementById('bookSection').scrollIntoView({ behavior: 'instant', block: 'center' })`
    });
    await new Promise((r) => setTimeout(r, 1000));
    const ssBook = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/User/.gemini/antigravity/brain/ad7bdb01-401a-44af-aa55-033a09f3a226/book-desktop-fullscreen.png', Buffer.from(ssBook.data, 'base64'));
    console.log('Saved book-desktop-fullscreen.png');

    // Switch to Mobile Viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 412,
      height: 915,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', {
      expression: `document.getElementById('locationSection').scrollIntoView({ behavior: 'instant', block: 'center' })`
    });
    await new Promise((r) => setTimeout(r, 800));
    const ssMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/User/.gemini/antigravity/brain/ad7bdb01-401a-44af-aa55-033a09f3a226/location-mobile-fullscreen.png', Buffer.from(ssMobile.data, 'base64'));
    console.log('Saved location-mobile-fullscreen.png');

    ws.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    proc.kill();
  }
}

run();

