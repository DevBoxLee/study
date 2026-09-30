const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
(async()=>{
fs.mkdirSync(path.join(root,'.preview'),{recursive:true});
const mount=path.join(root,'.preview','study');
if(!fs.existsSync(mount))fs.symlinkSync(path.join(root,'dist'),mount,'dir');
fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
const server=spawn('python',['-m','http.server','8765','--bind','127.0.0.1','--directory',path.join(root,'.preview')],{stdio:'ignore'});
let browser;
try{
 let ready=false;
 for(let i=0;i<60;i++){try{const r=await fetch('http://127.0.0.1:8765/study/');if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
 assert.ok(ready,'preview server starts');
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:8765/study/';
 const route=async id=>{await page.goto(base+'#'+id);await page.waitForFunction(id=>document.querySelector('#lesson-title').textContent===JSON.parse(document.querySelector('#lesson-data').textContent).find(x=>x.id===id).title,id);};

 await route('01-money');assert.equal(await page.locator('.scenario').count(),2);assert.match(await page.locator('[data-output]').textContent(),/6,000만원/);await page.screenshot({path:path.join(root,'artifacts/desktop.png'),fullPage:true});
 await route('02-horizon');assert.match(await page.locator('[data-results]').textContent(),/7.68억원/);await page.locator('[name=rate]').fill('0');assert.match(await page.locator('[data-results]').textContent(),/4.20억원/);
 await route('03-risk');assert.match(await page.locator('[data-output]').textContent(),/2,400만원/);
 await route('04-allocation');assert.match(await page.locator('[data-output]').textContent(),/4,080만원/);
 await route('05-etf');assert.equal(await page.locator('.anatomy').count(),1);
 await route('06-accounts');assert.equal(await page.locator('.account').count(),3);assert.equal(await page.locator('.quiz').count(),4);
 await route('06-irp');assert.match(await page.locator('[data-allowance]').textContent(),/15.4만원/);
 await route('06-isa');assert.match(await page.locator('[data-output]').textContent(),/29.7만원/);await page.locator('[name=allowance]').selectOption('400');assert.match(await page.locator('[data-output]').textContent(),/9.9만원/);
 await route('07-policy');assert.match(await page.locator('[data-rebalance]').textContent(),/88.0%/);await page.screenshot({path:path.join(root,'artifacts/policy.png'),fullPage:true});
 await page.locator('#complete').check();await page.reload();await page.waitForFunction(()=>document.title.startsWith('07.'));assert.equal(await page.locator('#complete').isChecked(),true);
 await page.locator('#search').fill('손익통산');assert.ok(await page.locator('#tree a').count()>0);await page.locator('#search').fill('없는금융주제123');assert.equal(await page.locator('#tree a').count(),0);await page.locator('#search').fill('');
 const ids=await page.evaluate(()=>JSON.parse(document.querySelector('#lesson-data').textContent).map(x=>x.id));
 for(const id of ids){await route(id);assert.ok((await page.locator('#article').textContent()).length>180);assert.equal(await page.locator('[data-widget]:empty').count(),0);}
 await page.setViewportSize({width:375,height:850});await route('01-money');await page.locator('#menu').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'true');await page.screenshot({path:path.join(root,'artifacts/mobile.png'),fullPage:true});
 for(const id of ids){await route(id);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'mobile overflow '+id);}
 assert.deepEqual(errors,[]);console.log('PASS: v2 variable learning experiences, calculators, search, mobile, no runtime errors');
}finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
