const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const http=require('node:http');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
function probe(url){
 return new Promise(resolve=>{
   let settled=false;
   const finish=(ok)=>{if(settled)return;settled=true;resolve(ok);};
   const req=http.get(url,res=>{res.resume();res.on('end',()=>finish((res.statusCode||0)>=200&&(res.statusCode||0)<500));});
   req.setTimeout(500,()=>{req.destroy();finish(false);});
   req.on('error',()=>finish(false));
 });
}
const root=path.resolve(__dirname,'..');
(async()=>{
 fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
 const server=spawn('python',['-m','http.server','8765','--bind','127.0.0.1','--directory',path.join(root,'dist')],{stdio:'ignore'});
 let browser;
 try{
   let ready=false;
   for(let i=0;i<60;i++){if(await probe('http://127.0.0.1:8765/')){ready=true;break;}await new Promise(r=>setTimeout(r,100));}
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

   await page.setViewportSize({width:1440,height:1000});
   await page.goto('http://127.0.0.1:8765/chart/');
   assert.match(await page.locator('h1').textContent(),/차트를 외우지 말고/);
   assert.ok(await page.locator('a[href="beginner/candlestick.html"]').count()>0);

   await page.goto('http://127.0.0.1:8765/chart/beginner/candlestick.html');
   await page.waitForFunction(()=>document.querySelector('#candleSvg')?.children.length>0);
   await page.waitForFunction(()=>document.querySelector('#marketChart')?.children.length>0,{timeout:7000});
   assert.equal(await page.locator('.preset').count(),5);
   await page.locator('[data-preset="lower"]').click();
   assert.match(await page.locator('#meaningTitle').textContent(),/아래/);
   await page.locator('.quiz .option[data-correct="true"]').first().click();
   assert.ok(await page.locator('.quiz-feedback.show').first().isVisible());
   await page.screenshot({path:path.join(root,'artifacts/chart-candlestick-desktop.png'),fullPage:true});

   await page.setViewportSize({width:375,height:850});
   await page.goto('http://127.0.0.1:8765/chart/beginner/candlestick.html');
   await page.waitForFunction(()=>document.querySelector('#candleSvg')?.children.length>0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:path.join(root,'artifacts/chart-candlestick-mobile.png'),fullPage:true});

   await page.setViewportSize({width:1440,height:1000});
   await page.goto('http://127.0.0.1:8765/chart/beginner/volume.html');
   await page.waitForFunction(()=>document.querySelector('#volumeScene')?.children.length>0);
   await page.locator('[data-volume="selloff"]').click();
   assert.match(await page.locator('#volumeTitle').textContent(),/하락/);
   await page.locator('.quiz .option[data-correct="true"]').first().click();
   assert.ok(await page.locator('.quiz-feedback.show').first().isVisible());
   await page.screenshot({path:path.join(root,'artifacts/chart-volume-desktop.png'),fullPage:true});

   await page.goto('http://127.0.0.1:8765/chart/beginner/trend-structure.html');
   await page.waitForFunction(()=>document.querySelector('#trendScene')?.children.length>0);
   await page.locator('[data-trend="down"]').click();
   assert.match(await page.locator('#trendTitle').textContent(),/하락 추세/);
   await page.screenshot({path:path.join(root,'artifacts/chart-trend-desktop.png'),fullPage:true});

   await page.goto('http://127.0.0.1:8765/chart/beginner/support-resistance.html');
   await page.waitForFunction(()=>document.querySelector('#srScene')?.children.length>0);
   await page.locator('[data-sr="flip"]').click();
   assert.match(await page.locator('#srTitle').textContent(),/역할 전환/);
   await page.screenshot({path:path.join(root,'artifacts/chart-support-desktop.png'),fullPage:true});

   await page.setViewportSize({width:375,height:850});
   for(const p of ['volume.html','trend-structure.html','support-resistance.html']){
     await page.goto('http://127.0.0.1:8765/chart/beginner/'+p);
     const ov=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,scrollWidth:document.documentElement.scrollWidth,innerWidth,wide:[...document.querySelectorAll('*')].filter(el=>el.getBoundingClientRect().right>innerWidth+1).slice(0,5).map(el=>({tag:el.tagName,cls:el.className,right:Math.round(el.getBoundingClientRect().right)}))}));
     assert.equal(ov.overflow,false,p+' mobile overflow '+JSON.stringify(ov));
   }
   await page.screenshot({path:path.join(root,'artifacts/chart-support-mobile.png'),fullPage:true});

   await page.setViewportSize({width:1440,height:1000});
   await page.goto('http://127.0.0.1:8765/chart/beginner/moving-average.html');
   await page.waitForFunction(()=>document.querySelector('#maScene')?.children.length>0);
   await page.locator('[data-ma="chop"]').click();
   assert.match(await page.locator('#maTitle').textContent(),/횡보장/);
   await page.locator('.quiz .option[data-correct="true"]').first().click();
   assert.ok(await page.locator('.quiz-feedback.show').first().isVisible());
   await page.screenshot({path:path.join(root,'artifacts/chart-ma-desktop.png'),fullPage:true});

   await page.goto('http://127.0.0.1:8765/chart/beginner/beginner-practice.html');
   await page.waitForFunction(()=>document.querySelector('#labChart')?.children.length>0);
   assert.equal(await page.locator('#decisionActions .decision-btn').count(),4);
   await page.locator('#decisionActions .decision-btn').nth(1).click();
   assert.ok(await page.locator('#labFeedback.show').isVisible());
   assert.ok(await page.locator('#futureBtn.show').isVisible());
   await page.locator('#futureBtn').click();
   assert.ok(await page.locator('#futureText').isVisible());
   await page.locator('[data-lab="falsebreak"]').click();
   assert.match(await page.locator('#labName').textContent(),/가짜 돌파/);
   await page.screenshot({path:path.join(root,'artifacts/chart-beginner-practice-desktop.png'),fullPage:true});

   await page.setViewportSize({width:375,height:850});
   for(const p of ['moving-average.html','beginner-practice.html']){
     await page.goto('http://127.0.0.1:8765/chart/beginner/'+p);
     const ov=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,scrollWidth:document.documentElement.scrollWidth,innerWidth,wide:[...document.querySelectorAll('*')].filter(el=>el.getBoundingClientRect().right>innerWidth+1).slice(0,5).map(el=>({tag:el.tagName,cls:el.className,right:Math.round(el.getBoundingClientRect().right)}))}));
     assert.equal(ov.overflow,false,p+' mobile overflow '+JSON.stringify(ov));
   }
   await page.screenshot({path:path.join(root,'artifacts/chart-beginner-practice-mobile.png'),fullPage:true});

   await page.setViewportSize({width:1440,height:1000});
   await page.goto('http://127.0.0.1:8765/chart/');
   assert.ok(await page.locator('a[href="intermediate/market-structure.html"]').count()>0);
   assert.ok(await page.locator('a[href="advanced/multi-timeframe.html"]').count()>0);

   await page.goto('http://127.0.0.1:8765/chart/intermediate/market-structure.html');
   await page.waitForFunction(()=>document.querySelector('#scenarioCanvas')?.children.length>0);
   await page.locator('[data-scenario="shift"]').click();
   assert.match(await page.locator('#scenarioTitle').textContent(),/전환 후보/);

   await page.goto('http://127.0.0.1:8765/chart/intermediate/patterns-indicators.html');
   await page.waitForFunction(()=>document.querySelector('#indicatorScene')?.children.length>0);
   await page.locator('[data-indicator="divergence"]').click();
   assert.match(await page.locator('#indicatorTitle').textContent(),/모멘텀/);

   await page.goto('http://127.0.0.1:8765/chart/intermediate/scaling-exits.html');
   await page.locator('#scaleAmount').fill('20000000');
   assert.match(await page.locator('#scale1').textContent(),/8,000,000/);
   await page.screenshot({path:path.join(root,'artifacts/chart-intermediate-desktop.png'),fullPage:true});

   await page.goto('http://127.0.0.1:8765/chart/advanced/multi-timeframe.html');
   await page.waitForFunction(()=>document.querySelector('#tfWeekly')?.children.length>0);
   assert.ok(await page.locator('#tfDaily svg').count()>0);

   await page.goto('http://127.0.0.1:8765/chart/advanced/failed-signals.html');
   await page.waitForFunction(()=>document.querySelector('#scenarioCanvas')?.children.length>0);
   await page.locator('[data-scenario="beartrap"]').click();
   assert.match(await page.locator('#scenarioTitle').textContent(),/Bear Trap/);

   await page.goto('http://127.0.0.1:8765/chart/advanced/volatility-atr.html');
   assert.match(await page.locator('#atrStop').textContent(),/94\.00/);
   assert.match(await page.locator('#atrPct').textContent(),/6\.00%/);

   await page.goto('http://127.0.0.1:8765/chart/advanced/risk-reward-stop.html');
   assert.match(await page.locator('#rrRatio').textContent(),/1 : 3\.00/);

   await page.goto('http://127.0.0.1:8765/chart/advanced/position-sizing.html');
   assert.match(await page.locator('#posBudget').textContent(),/100,000/);
   assert.match(await page.locator('#posQty').textContent(),/20,000/);

   await page.goto('http://127.0.0.1:8765/chart/advanced/swing-review.html');
   assert.equal(await page.locator('.review-check').count(),7);
   await page.locator('.review-check').first().check();
   assert.match(await page.locator('#reviewScore').textContent(),/1\/7/);
   await page.screenshot({path:path.join(root,'artifacts/chart-advanced-review-desktop.png'),fullPage:true});

   await page.setViewportSize({width:375,height:850});
   const levelPages=[
     'intermediate/market-structure.html','intermediate/breakout.html','intermediate/pullback.html','intermediate/volume-confirmation.html','intermediate/patterns-indicators.html','intermediate/scaling-exits.html',
     'advanced/multi-timeframe.html','advanced/failed-signals.html','advanced/volatility-atr.html','advanced/risk-reward-stop.html','advanced/position-sizing.html','advanced/swing-review.html'
   ];
   for(const p of levelPages){
     await page.goto('http://127.0.0.1:8765/chart/'+p);
     const ov=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,scrollWidth:document.documentElement.scrollWidth,innerWidth}));
     assert.equal(ov.overflow,false,p+' mobile overflow '+JSON.stringify(ov));
   }
   await page.screenshot({path:path.join(root,'artifacts/chart-advanced-mobile.png'),fullPage:true});

   assert.deepEqual(errors,[]);
   console.log('PASS: finance guide + complete beginner/intermediate/advanced chart curriculum, desktop/mobile');
 } finally { if(browser) await browser.close(); server.kill(); }
})().catch(e=>{console.error(e);process.exitCode=1});
