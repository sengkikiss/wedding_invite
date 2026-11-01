const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const dir = path.join(os.tmpdir(), `ch-drawer-test-${Date.now()}`);
const port = 9249;

const proc = spawn(chrome, [
  '--headless=new',
  `--user-data-dir=${dir}`,
  `--remote-debugging-port=${port}`,
  '--disable-gpu',
  '--window-size=480,850',
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

    // Click envelope seal
    await send('Runtime.evaluate', { expression: `document.getElementById('seal')?.click()` });
    await new Promise((r) => setTimeout(r, 8500));

    // Open drawer
    await send('Runtime.evaluate', {
      expression: `document.getElementById('menuBtn').click()`
    });
    await new Promise((r) => setTimeout(r, 600));

    // Get list of drawer links
    const links = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        return Array.from(document.querySelectorAll('.drawer-nav .drawer-link')).map(el => el.innerText.trim());
      })()`
    });
    console.log('Drawer links:', links.result.value);

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/User/.gemini/antigravity/brain/ad7bdb01-401a-44af-aa55-033a09f3a226/drawer-menu-clean.png', Buffer.from(ss.data, 'base64'));
    console.log('Saved drawer-menu-clean.png');

    ws.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    proc.kill();
  }
}

run();

