import sys, asyncio
from playwright.sync_api import sync_playwright
SIZES=[(320,568),(390,844),(740,360),(1280,800)]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args=['--no-sandbox'])
    for (w,h) in SIZES:
        ctx=b.new_context(viewport={'width':w,'height':h},device_scale_factor=2 if w<500 else 1,has_touch=w<800,is_mobile=w<800)
        pg=ctx.new_page(); errs=[]
        pg.on('console',lambda m: errs.append(m.text) if m.type in('error','warning') else None)
        pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.goto('http://127.0.0.1:4173/'); pg.wait_for_timeout(2600)
        pg.screenshot(path=f'shots/env-{w}x{h}.png')
        pg.evaluate("document.getElementById('seal').click()")
        for i,tm in enumerate([700,1300,1000,900,800,700,700]):   # frames across the ~5.5s opening
            pg.wait_for_timeout(tm); pg.screenshot(path=f'shots/open-{w}x{h}-{i}.png')
        pg.wait_for_timeout(5200)
        pg.screenshot(path=f'shots/cover-{w}x{h}.png')
        m=pg.evaluate("""()=>({sw:document.documentElement.scrollWidth,cw:innerWidth,ch:innerHeight,coverH:document.getElementById('cover')?.getBoundingClientRect().height,
          wide:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>innerWidth+1 && getComputedStyle(e).position!=='fixed' && !e.closest('.cover-bg')&&!e.closest('#envScreen')}).map(e=>e.className||e.tagName).slice(0,5)})""")
        print(w,h,m,'errors:',errs[:5])
        ctx.close()
    b.close()
