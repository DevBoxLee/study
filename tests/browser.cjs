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
  let ready=false;for(let i=0;i<60;i++){try{const r=await fetch('http://127.0.0.1:8765/study/');if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
  assert.ok(ready);
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:8765/study/';
  const route=async id=>{await page.goto(base+'#'+id);await page.waitForFunction(id=>document.querySelector('#lesson-title').textContent===JSON.parse(document.querySelector('#lesson-data').textContent).find(x=>x.id===id).title,id);};

  await route('01-overview');assert.equal(await page.locator('.account').count(),3);assert.match(await page.locator('#article').textContent(),/왜 정부는 연금저축과 IRP에 혜택을 줄까/);
  await page.screenshot({path:path.join(root,'artifacts/desktop.png'),fullPage:true});

  await route('02-tax');assert.equal(await page.locator('.concept-grid section').count(),6);assert.match(await page.locator('#article').textContent(),/소득공제 100만원/);
  await page.locator('[name=taxLeft]').fill('20');assert.match(await page.locator('[data-output]').textContent(),/20만원/);

  await route('03-pension');assert.match(await page.locator('#article').textContent(),/11년차 이후/);
  await route('04-irp');assert.match(await page.locator('#article').textContent(),/삼성증권/);assert.match(await page.locator('[data-allowance]').textContent(),/15.4만원/);
  await route('05-isa');assert.match(await page.locator('#article').textContent(),/138.6만원/);assert.match(await page.locator('[data-output]').textContent(),/29.7만원/);
  await route('06-compare');assert.match(await page.locator('#article').textContent(),/적합한 자금/);
  await route('07-compound');assert.equal(await page.locator('.tax-compare-grid section').count(),3);assert.match(await page.locator('#article').textContent(),/7,249만원/);
  await route('08-bridge');assert.match(await page.locator('[data-bridge]').textContent(),/300만원/);assert.match(await page.locator('#article').textContent(),/5,000만원/);
  await route('09-purpose');assert.match(await page.locator('#article').textContent(),/55세 전에 사용할 가능성이 있는가/);
  await route('10-priority');assert.match(await page.locator('#article').textContent(),/300/);
  await route('11-couple');assert.match(await page.locator('#article').textContent(),/118.8만원/);
  await route('12-portfolio');assert.match(await page.locator('#article').textContent(),/적격 TDF/);
  await route('13-mistakes');assert.equal(await page.locator('.quiz').count(),16);await page.locator('.quiz button').first().click();assert.match(await page.locator('.quiz-detail').first().textContent(),/왜 그런가/);
  await route('14-early');assert.match(await page.locator('#article').textContent(),/577.5만원/);
  await route('15-withdraw');assert.match(await page.locator('#article').textContent(),/1,650만원/);assert.match(await page.locator('#article').textContent(),/550만원/);
  await route('16-faq');assert.match(await page.locator('#article').textContent(),/33\. 세 계좌를 모두 만들어야 하는가/);
  await route('17-summary');assert.match(await page.locator('#article').textContent(),/투자기간은 몇 년인가/);
  await route('18-onepage');assert.match(await page.locator('#article').textContent(),/계좌를 먼저 고르지 말고/);
  await route('19-sources');assert.match(await page.locator('#article').textContent(),/S15/);assert.match(await page.locator('#article').textContent(),/정부안/);

  const ids=await page.evaluate(()=>JSON.parse(document.querySelector('#lesson-data').textContent).map(x=>x.id));
  assert.equal(ids.length,19);assert.deepEqual(ids[0],'01-overview');assert.deepEqual(ids[18],'19-sources');
  for(const old of ['00-principles','01-money','02-horizon','03-risk','04-allocation','05-etf','07-policy','99-later'])assert.equal(ids.includes(old),false);
  await page.locator('#search').fill('과세이연');assert.ok(await page.locator('#tree a').count()>0);await page.locator('#search').fill('');

  await page.setViewportSize({width:375,height:850});await route('01-overview');await page.locator('#menu').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'true');
  await page.screenshot({path:path.join(root,'artifacts/mobile.png'),fullPage:true});
  for(const id of ids){await route(id);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'mobile overflow '+id);}
  assert.deepEqual(errors,[]);
  console.log('PASS: exact 19-section tax-account textbook, interactions, search, mobile, no old curriculum');
 }finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
