(() => {
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const C={bg:'#0b1220',grid:'#1e293b',ink:'#e5e7eb',muted:'#94a3b8',green:'#10b981',red:'#ef4444',blue:'#60a5fa',amber:'#f59e0b',purple:'#a78bfa'};

  function path(vals,x,y){return vals.map((v,i)=>(i?'L':'M')+x(i)+','+y(v)).join(' ')}
  function renderLineChart(el,values,opts={}){
    if(!el)return;
    const W=900,H=350,p={l:42,r:28,t:28,b:38},min=Math.min(...values,...(opts.zone||[]))-3,max=Math.max(...values,...(opts.zone||[]))+3;
    const x=i=>p.l+i*(W-p.l-p.r)/(values.length-1),y=v=>p.t+(max-v)/(max-min)*(H-p.t-p.b);
    let s='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"><rect width="'+W+'" height="'+H+'" fill="'+C.bg+'"/>';
    for(let i=0;i<5;i++){const yy=p.t+i*(H-p.t-p.b)/4;s+='<line x1="'+p.l+'" y1="'+yy+'" x2="'+(W-p.r)+'" y2="'+yy+'" stroke="'+C.grid+'" stroke-dasharray="4 6"/>'}
    if(opts.zone&&opts.zone.length===2){
      const zt=Math.min(y(opts.zone[0]),y(opts.zone[1])),zh=Math.abs(y(opts.zone[0])-y(opts.zone[1]));
      s+='<rect x="'+p.l+'" y="'+zt+'" width="'+(W-p.l-p.r)+'" height="'+zh+'" fill="rgba(96,165,250,.10)" stroke="#3b82f6" stroke-dasharray="7 6"/>';
    }
    s+='<path d="'+path(values,x,y)+'" fill="none" stroke="'+(opts.color||C.ink)+'" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
    values.forEach((v,i)=>s+='<circle cx="'+x(i)+'" cy="'+y(v)+'" r="'+(i===values.length-1?5:2.5)+'" fill="'+(i===values.length-1?(opts.color||C.ink):'#0b1220')+'" stroke="'+(opts.color||C.ink)+'" stroke-width="2"/>');
    if(opts.cut!=null){
      const cut=x(opts.cut);s+='<rect x="'+cut+'" y="0" width="'+(W-p.r-cut)+'" height="'+H+'" fill="rgba(15,23,42,.94)"/><text x="'+((cut+W-p.r)/2)+'" y="180" text-anchor="middle" fill="#cbd5e1" font-size="28" font-weight="900">?</text>';
    }
    s+='</svg>';el.innerHTML=s;
  }

  const scenarios={
    structure:{
      continuation:{v:[100,106,103,111,107,116,112,121,117,125],zone:[111,114],t:'상승 구조 지속',d:'HH·HL이 이어지고 직전 HL 위에서 다시 고점을 높입니다. 추세전환을 서둘러 가정할 이유가 적은 상태입니다.'},
      shift:{v:[100,106,103,111,107,116,112,115,108,110],zone:[111,114],t:'구조 전환 후보',d:'고점 갱신에 실패한 뒤 주요 HL을 이탈했습니다. 한 번의 이탈보다 이후 낮은 고점(LH)이 형성되는지 확인합니다.'},
      range:{v:[104,112,106,113,105,111,106,112,107,111],zone:[105,112],t:'횡보 구조',d:'고점과 저점이 한 방향으로 이동하지 않습니다. 추세 추종보다 범위 상단·하단의 반응을 우선 봅니다.'}
    },
    breakout:{
      strong:{v:[98,100,101,103,102,104,105,106,108,114,118,120],zone:[106,109],t:'돌파 + 유지',d:'저항구간을 넘어선 뒤 종가가 위에서 유지되고 후속 가격도 구간 위에 남습니다. 거래량 증가가 동반되면 확인 근거가 더해집니다.'},
      fake:{v:[98,100,102,103,105,107,110,115,108,105,103,102],zone:[106,109],t:'가짜 돌파',d:'구간을 강하게 넘었지만 빠르게 다시 안으로 복귀했습니다. “한 번 넘었다”보다 유지 여부가 중요합니다.'},
      late:{v:[98,100,102,105,108,113,118,124,130,136,139,141],zone:[106,109],t:'늦은 추격',d:'돌파 자체는 성공했지만 이미 구간과 멀리 벌어진 시점입니다. 좋은 차트와 좋은 진입가격은 같은 말이 아닙니다.'}
    },
    pullback:{
      healthy:{v:[100,104,108,112,116,114,112,111,113,116,120,124],zone:[110,113],t:'얕은 눌림 + 구조 유지',d:'상승 구조 안에서 이전 돌파구간 근처까지 조정한 뒤 저점을 지키고 반등합니다. 분할진입 후보가 될 수 있는 전형적 상황입니다.'},
      deep:{v:[100,104,108,112,116,113,109,105,103,106,110,113],zone:[110,113],t:'깊은 되돌림',d:'조정 폭이 커지고 이전 구조를 일부 훼손했습니다. 단순히 싸졌다는 이유보다 구조 복구를 확인할 필요가 있습니다.'},
      fail:{v:[100,104,108,112,116,113,110,106,101,98,96,94],zone:[110,113],t:'눌림 실패',d:'지지후보 구간을 이탈하고 저점을 계속 낮춥니다. 눌림목이라는 가설이 무효화된 사례입니다.'}
    },
    failure:{
      bulltrap:{v:[100,103,106,109,112,116,119,111,107,104,102],zone:[110,113],t:'Bull Trap · 상방 실패',d:'저항을 넘은 매수세가 유지되지 못하고 빠르게 구간 아래로 복귀합니다. 돌파 매수의 무효화 기준이 왜 필요한지 보여줍니다.'},
      beartrap:{v:[112,109,106,103,100,96,93,101,105,108,111],zone:[98,101],t:'Bear Trap · 하방 실패',d:'지지 이탈처럼 보였지만 빠르게 구간 위로 복귀합니다. 이탈 자체만 보고 추격매도하면 역방향 위험이 큽니다.'},
      retest:{v:[100,103,106,109,113,117,114,111,113,116,120],zone:[110,113],t:'재테스트 성공',d:'돌파 후 되돌림에서 이전 저항구간이 지지처럼 작동합니다. 역할전환을 확인하는 대표 흐름입니다.'}
    }
  };

  function initScenario(type){
    const canvas=$('#scenarioCanvas'); if(!canvas||!scenarios[type])return;
    const title=$('#scenarioTitle'),text=$('#scenarioText');
    function draw(k){const c=scenarios[type][k];renderLineChart(canvas,c.v,{zone:c.zone});title.textContent=c.t;text.textContent=c.d}
    $$('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{$$('[data-scenario]').forEach(x=>x.classList.remove('active'));b.classList.add('active');draw(b.dataset.scenario)}));
    const first=$('[data-scenario].active')||$('[data-scenario]'); if(first)draw(first.dataset.scenario);
  }

  function initIndicator(){
    const el=$('#indicatorScene'); if(!el)return;
    const sets={
      trend:{price:[100,102,104,106,105,108,110,112,114,116,115,118],rsi:[52,57,61,66,60,68,71,73,76,78,70,75],macd:[-.2,.1,.3,.5,.4,.7,.9,1.1,1.3,1.5,1.1,1.4],t:'추세장에서 보조지표는 확인 도구',d:'가격 구조가 먼저이고 RSI/MACD는 모멘텀 확인에 보조적으로 사용합니다.'},
      divergence:{price:[100,104,102,108,105,112,108,115,111,118,114,120],rsi:[54,66,57,71,60,73,62,72,60,69,58,66],macd:[0,.4,.2,.7,.3,.9,.4,.8,.3,.6,.2,.4],t:'가격 고점은 상승, 모멘텀은 둔화',d:'다이버전스는 경고이지 즉시 반전 신호가 아닙니다. 구조 이탈과 가격 확인이 뒤따라야 의미가 커집니다.'}
    };
    function draw(k){
      const c=sets[k],W=900,H=390,p={l:40,r:26},x=i=>p.l+i*(W-p.l-p.r)/(c.price.length-1);
      const yP=v=>28+(122-v)/(122-96)*190,yR=v=>248+(80-v)/30*90,yM=v=>345-v*32;
      let s='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"><rect width="'+W+'" height="'+H+'" fill="'+C.bg+'"/>';
      s+='<line x1="40" y1="236" x2="874" y2="236" stroke="#334155"/><line x1="40" y1="300" x2="874" y2="300" stroke="#334155" stroke-dasharray="5 5"/>';
      s+='<path d="'+path(c.price,x,yP)+'" fill="none" stroke="'+C.ink+'" stroke-width="4"/>';
      s+='<path d="'+path(c.rsi,x,yR)+'" fill="none" stroke="'+C.purple+'" stroke-width="3"/>';
      s+='<path d="'+path(c.macd,x,yM)+'" fill="none" stroke="'+C.blue+'" stroke-width="3"/>';
      s+='<text x="45" y="18" fill="'+C.muted+'" font-size="11">PRICE</text><text x="45" y="258" fill="'+C.purple+'" font-size="11">RSI</text><text x="45" y="360" fill="'+C.blue+'" font-size="11">MACD</text></svg>';
      el.innerHTML=s;$('#indicatorTitle').textContent=c.t;$('#indicatorText').textContent=c.d;
    }
    $$('[data-indicator]').forEach(b=>b.addEventListener('click',()=>{$$('[data-indicator]').forEach(x=>x.classList.remove('active'));b.classList.add('active');draw(b.dataset.indicator)}));draw('trend');
  }

  function initVolumeGrade(){
    const el=$('#volumeGrade');if(!el)return;
    const rows=[
      ['돌파 + 거래량 2.1배 + 종가 유지','강한 확인','good'],
      ['돌파 + 거래량 0.7배','확인 약함','mid'],
      ['지지 이탈 + 거래량 2.5배','이탈 확인 강도 증가','bad'],
      ['조정 + 거래량 감소','매도압력 둔화 가능','mid']
    ];
    el.innerHTML=rows.map(r=>'<div class="evidence-cell '+r[2]+'"><b>'+r[0]+'</b><span class="micro">'+r[1]+'</span></div>').join('');
  }

  function n(id){return Number($(id)?.value||0)}
  function money(v){return Number.isFinite(v)?Math.round(v).toLocaleString('ko-KR'):'-'}
  function initAtr(){
    const btn=$('#atrCalc');if(!btn)return;
    const calc=()=>{const e=n('#atrEntry'),a=n('#atrValue'),m=n('#atrMult'),stop=e-a*m;$('#atrStop').textContent=stop.toFixed(2);$('#atrRisk').textContent=(a*m).toFixed(2);$('#atrPct').textContent=e?((a*m)/e*100).toFixed(2)+'%':'-'};
    btn.addEventListener('click',calc);calc();
  }
  function initRR(){
    const btn=$('#rrCalc');if(!btn)return;
    const calc=()=>{const e=n('#rrEntry'),s=n('#rrStop'),t=n('#rrTarget'),risk=Math.abs(e-s),reward=Math.abs(t-e),rr=risk?reward/risk:0;$('#rrRisk').textContent=risk.toFixed(2);$('#rrReward').textContent=reward.toFixed(2);$('#rrRatio').textContent='1 : '+rr.toFixed(2);const rp=risk+reward?risk/(risk+reward)*100:50;$('#rrRiskBar').style.width=rp+'%';$('#rrRewardBar').style.width=(100-rp)+'%'};
    btn.addEventListener('click',calc);calc();
  }
  function initPosition(){
    const btn=$('#posCalc');if(!btn)return;
    const calc=()=>{const account=n('#posAccount'),pct=n('#posRiskPct'),entry=n('#posEntry'),stop=n('#posStop'),budget=account*pct/100,unit=Math.abs(entry-stop),qty=unit?Math.floor(budget/unit):0;$('#posBudget').textContent=money(budget);$('#posUnitRisk').textContent=unit.toFixed(2);$('#posQty').textContent=money(qty);$('#posExposure').textContent=money(qty*entry)};
    btn.addEventListener('click',calc);calc();
  }
  function initScaling(){
    const amount=$('#scaleAmount');if(!amount)return;
    const render=()=>{const total=n('#scaleAmount');$('#scale1').textContent=money(total*.4);$('#scale2').textContent=money(total*.3);$('#scale3').textContent=money(total*.3)};
    amount.addEventListener('input',render);render();
  }

  function spark(el,vals,color){
    if(!el)return;const W=280,H=170,p=18,min=Math.min(...vals)-2,max=Math.max(...vals)+2,x=i=>p+i*(W-p*2)/(vals.length-1),y=v=>p+(max-v)/(max-min)*(H-p*2);
    el.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"><rect width="'+W+'" height="'+H+'" fill="'+C.bg+'"/><path d="'+path(vals,x,y)+'" fill="none" stroke="'+color+'" stroke-width="4" stroke-linecap="round"/></svg>';
  }
  function initMTF(){
    spark($('#tfWeekly'),[90,94,92,98,101,105,103,109,112,116,114,120],C.green);
    spark($('#tfDaily'),[111,116,119,117,114,112,110,111,113,115,114,116],C.blue);
    spark($('#tfHourly'),[116,114,112,110,109,111,113,112,114,116,117,118],C.amber);
  }
  function initReview(){
    const out=$('#reviewScore');if(!out)return;
    const boxes=$$('.review-check');
    const calc=()=>{const score=boxes.filter(b=>b.checked).length;out.textContent=score+'/'+boxes.length;$('#reviewLabel').textContent=score>=6?'과정 준수 우수':score>=4?'일부 개선 필요':'규칙보다 결과에 끌렸을 가능성'};
    boxes.forEach(b=>b.addEventListener('change',calc));calc();
  }

  const type=document.body.dataset.scenarioType;if(type)initScenario(type);
  initIndicator();initVolumeGrade();initAtr();initRR();initPosition();initScaling();initMTF();initReview();

  $$('.option').forEach(btn=>btn.addEventListener('click',()=>{
    const q=btn.closest('.quiz'),ok=btn.dataset.correct==='true';q.querySelectorAll('.option').forEach(x=>{x.disabled=true;if(x.dataset.correct==='true')x.classList.add('correct')});if(!ok)btn.classList.add('wrongpick');const fb=q.querySelector('.quiz-feedback');fb.classList.add('show');fb.textContent=(ok?'정답. ':'다시 볼 포인트: ')+q.dataset.feedback;
  }));
  window.addEventListener('scroll',()=>{const d=document.documentElement,b=$('#progressBar');if(b)b.style.width=(d.scrollTop/Math.max(1,d.scrollHeight-d.clientHeight)*100)+'%'});
})();