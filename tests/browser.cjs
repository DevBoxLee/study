// Observable UI behavior, exercised in Chromium by GitHub Actions.
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
(async()=>{
fs.mkdirSync(path.join(root,'.preview'),{recursive:true});
const mount=path.join(root,'.preview','study');
if(!fs.existsSync(mount))fs.symlinkSync(path.join(root,'dist'),mount,'dir');
fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
const server=spawn('python',['-m','http.server','8765','--bind','127.0.0.1','--directory',path.join(root,'.preview')],{stdio:'ignore'});
let browser;
try{
let ready=false;for(let i=0;i<60;i++){try{const r=await fetch('http://127.0.0.1:8765/study/');if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
assert.ok(ready,'preview server starts');
browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base='http://127.0.0.1:8765/study/';
const route=async id=>{await page.goto(base+'#'+id);await page.waitForFunction(id=>document.querySelector('#lesson-title').textContent===JSON.parse(document.querySelector('#lesson-data').textContent).find(x=>x.id===id).title,id);};
await route('00-principles');await page.screenshot({path:path.join(root,'artifacts/desktop.png')});
await page.locator('#tree a[href="#02-horizon"]').click();await page.waitForFunction(()=>document.title.startsWith('02.'));assert.match(await page.locator('[data-results]').textContent(),/7.68억원/);
await page.locator('[name=rate]').fill('0');assert.match(await page.locator('[data-results]').textContent(),/4.20억원/);
await page.locator('#complete').check();await page.reload();await page.waitForFunction(()=>document.title.startsWith('02.'));assert.equal(await page.locator('#complete').isChecked(),true);
await page.locator('#search').fill('손익통산');assert.ok(await page.locator('#tree a').count()>0);await page.locator('#search').fill('없는금융주제123');assert.equal(await page.locator('#tree a').count(),0);await page.locator('#search').fill('');
const ids=await page.evaluate(()=>JSON.parse(document.querySelector('#lesson-data').textContent).map(x=>x.id));
for(const id of ids){await route(id);assert.equal(await page.locator('#article h2').count(),10);assert.ok((await page.locator('#article').textContent()).length>400);assert.equal(await page.locator('[data-widget]:empty').count(),0);}
await route('06-isa');assert.match(await page.locator('[data-output]').textContent(),/29.7만원/);await page.locator('[name=allowance]').selectOption('400');assert.match(await page.locator('[data-output]').textContent(),/9.9만원/);
await route('07-policy');assert.match(await page.locator('[data-rebalance]').textContent(),/88.0%/);await page.locator('.action-button').click();await page.waitForFunction(()=>document.querySelector('[data-step="2"]').classList.contains('active'));
await page.screenshot({path:path.join(root,'artifacts/policy.png'),fullPage:true});
await page.setViewportSize({width:375,height:850});await route('00-principles');await page.locator('#menu').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'true');await page.locator('#tree a[href="#03-risk"]').click();await page.waitForFunction(()=>document.title.startsWith('03.'));assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'false');await page.screenshot({path:path.join(root,'artifacts/mobile.png')});
for(const id of ids){await route(id);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'mobile overflow '+id);}
await route('01-money');await page.locator('[name=emergency]').fill('9000');assert.match(await page.locator('[data-output]').textContent(),/초과/);
await route('02-horizon');await page.locator('[name=rate]').fill('-10');assert.match(await page.locator('[data-results]').textContent(),/오늘의 구매력/);
await page.emulateMedia({media:'print'});await page.screenshot({path:path.join(root,'artifacts/print.png'),fullPage:true});
const blocked=await browser.newContext();await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})});const bp=await blocked.newPage();bp.on('pageerror',e=>errors.push(e.message));await bp.goto(base);await bp.waitForSelector('#lesson-title');assert.match(await bp.locator('#lesson-title').textContent(),/투자원칙/);await blocked.close();
assert.deepEqual(errors,[]);console.log('PASS: 13 pages, calculators, search, progress, storage fallback, mobile menu, /study/ prefix, print, no mobile overflow/runtime errors');
}finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
