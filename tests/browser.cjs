const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
(async()=>{
 fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
 const server=spawn('python',['-m','http.server','8765','--bind','127.0.0.1','--directory',path.join(root,'dist')],{stdio:'ignore'});
 let browser;
 try{
   let ready=false;
   for(let i=0;i<60;i++){try{const r=await fetch('http://127.0.0.1:8765/');if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
   assert.ok(ready);
   browser=await chromium.launch({headless:true,args:['--no-sandbox']});
   const page=await browser.newPage({viewport:{width:1440,height:1000}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8765/');
   assert.equal(await page.locator('main section').count(),19);
   assert.equal(await page.locator('a.tree-link.sub').count(),19);
   assert.equal(await page.locator('#mistakes .quiz').count(),16);
   assert.equal(await page.locator('#faq details').count(),33);
   assert.equal(await page.locator('text=00. 우리집 투자원칙').count(),0);
   await page.waitForFunction(()=>document.querySelector('#calcResult')?.textContent?.length>0);
   assert.match(await page.locator('#calcResult').textContent(),/148\.5|118\.8/);
   assert.ok(await page.locator('#deferChart').locator('*').count()>0);
   assert.match(await page.locator('#compound').textContent(),/1,891만원/);
   assert.match(await page.locator('#withdraw').textContent(),/1,650만원/);
   assert.match(await page.locator('#withdraw').textContent(),/550만원/);
   await page.screenshot({path:path.join(root,'artifacts/tax-guide-desktop.png'),fullPage:true});
   await page.setViewportSize({width:375,height:850});
   await page.goto('http://127.0.0.1:8765/#overview');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:path.join(root,'artifacts/tax-guide-mobile.png'),fullPage:true});
   assert.deepEqual(errors,[]);
   console.log('PASS: canonical 19-section guide, desktop/mobile, calculator, quiz and FAQ');
 } finally { if(browser) await browser.close(); server.kill(); }
})().catch(e=>{console.error(e);process.exitCode=1});
