(() => {
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const C={ink:'#e5e7eb',muted:'#94a3b8',grid:'#1e293b',green:'#10b981',red:'#ef4444',blue:'#60a5fa',amber:'#f59e0b',purple:'#a78bfa'};

  function sma(values,n){
    return values.map((_,i)=>{
      if(i<n-1) return null;
      let sum=0; for(let j=i-n+1;j<=i;j++) sum+=values[j];
      return sum/n;
    });
  }
  function linePath(values,x,y){
    let started=false,d='';
    values.forEach((v,i)=>{
      if(v==null) return;
      d+=(started?'L':'M')+x(i)+','+y(v)+' '; started=true;
    });
    return d.trim();
  }

  const maPresets={
    trend:{
      prices:[96,97,99,98,101,103,102,105,107,108,107,110,112,113,115,114,116,118,117,120,122,121,124,126,125,128,130,129,132,134,133,136],
      title:'상승 추세에서 이동평균선도 뒤따라 올라간다',
      desc:'가격이 먼저 움직이고 평균선이 뒤따릅니다. 가격이 평균선 위에 있고 평균선 기울기도 상승하는 상태는 추세 확인에 도움을 줄 수 있습니다.',
      note:'추세 확인'
    },
    pullback:{
      prices:[98,100,102,104,106,108,110,112,114,116,118,120,121,120,118,116,114,113,112,113,115,117,119,121,123,124,126,128,129,131,132,134],
      title:'상승 추세의 조정에서 평균선 부근 반응을 관찰',
      desc:'가격이 평균선 근처로 내려왔다는 이유만으로 매수하지 않습니다. 기존 상승 구조, 지지구간, 거래량 감소와 반등 확인을 함께 봅니다.',
      note:'동적 참고선'
    },
    chop:{
      prices:[104,108,102,107,101,106,103,109,102,108,101,107,103,108,102,106,104,109,103,107,102,108,104,106,103,109,102,107,104,108,103,107],
      title:'횡보장에서는 평균선 교차가 반복될 수 있다',
      desc:'가격이 좁은 범위에서 오가면 단기·장기 평균선이 자주 교차합니다. 골든크로스·데드크로스를 단독 신호로 쓰면 잦은 오판이 생길 수 있습니다.',
      note:'휩쏘 주의'
    }
  };

  function drawMA(key){
    const el=$('#maScene'), cfg=maPresets[key]; if(!el||!cfg) return;
    const W=900,H=370,p={l:45,r:35,t:28,b:42}, vals=cfg.prices,fast=sma(vals,5),slow=sma(vals,20);
    const all=[...vals,...fast.filter(v=>v!=null),...slow.filter(v=>v!=null)],min=Math.min(...all)-3,max=Math.max(...all)+3;
    const x=i=>p.l+i*(W-p.l-p.r)/(vals.length-1), y=v=>p.t+(max-v)/(max-min)*(H-p.t-p.b);
    let s='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-label="이동평균선 교육용 그래프"><rect width="'+W+'" height="'+H+'" rx="16" fill="#0b1220"/>';
    for(let i=0;i<5;i++){const yy=p.t+i*(H-p.t-p.b)/4;s+='<line x1="'+p.l+'" y1="'+yy+'" x2="'+(W-p.r)+'" y2="'+yy+'" stroke="'+C.grid+'" stroke-dasharray="4 6"/>';}
    s+='<path d="'+linePath(vals,x,y)+'" fill="none" stroke="'+C.ink+'" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>';
    s+='<path d="'+linePath(fast,x,y)+'" fill="none" stroke="'+C.blue+'" stroke-width="3" stroke-linecap="round"/>';
    s+='<path d="'+linePath(slow,x,y)+'" fill="none" stroke="'+C.amber+'" stroke-width="3" stroke-linecap="round"/>';
    const li=vals.length-1;
    s+='<circle cx="'+x(li)+'" cy="'+y(vals[li])+'" r="5" fill="#fff" stroke="'+C.ink+'" stroke-width="2"/>';
    s+='<text x="'+p.l+'" y="18" fill="'+C.muted+'" font-size="11" font-weight="800">PRICE + SMA 5 + SMA 20</text></svg>';
    el.innerHTML=s;
    $('#maTitle').textContent=cfg.title; $('#maText').textContent=cfg.desc; $('#maTag').textContent=cfg.note;
    const f=fast[li],sl=slow[li];
    $('#maPrice').textContent=vals[li].toFixed(1); $('#maFast').textContent=f.toFixed(1); $('#maSlow').textContent=sl.toFixed(1);
  }

  const labScenarios={
    pullback:{
      name:'A · 상승추세 눌림',
      closes:[100,102,104,103,106,108,107,110,112,111,114,116,115,117,119,118,116,114,113,112,113,115,116,118,121,123,122,125,127,126,129,131],
      vols:[38,42,45,34,48,52,39,55,61,43,64,70,48,58,66,54,46,40,34,30,33,49,55,61,76,82,58,74,80,62,83,90],
      visible:22,zone:[111,114],
      evidence:['고점·저점이 높아지는 상승 구조','조정 구간에서 거래량이 감소','111~114 지지구간과 SMA20 부근에서 반응'],
      choices:['전액 매수','1차 분할 진입을 검토하고 지지구간 이탈을 무효화 기준으로 둔다','상승 추세이므로 손절 기준 없이 보유','캔들 하나만 보고 매도'],
      correct:1,
      feedback:'조건들이 한 방향으로 모이지만 결과는 확정되지 않습니다. 그래서 전액 진입보다 분할 접근과 무효화 기준을 함께 두는 판단이 더 일관적입니다.',
      future:'이 예시에서는 지지구간을 유지한 뒤 고점을 갱신했습니다. 중요한 것은 결과를 맞힌 것이 아니라 진입 전 무효화 기준을 정의했다는 점입니다.'
    },
    falsebreak:{
      name:'B · 저항 가짜 돌파',
      closes:[101,103,105,104,106,108,107,109,105,104,108,109,107,106,109,110,111,113,115,108,106,104,103,101,99,100,98,97,99,96,95,94],
      vols:[34,38,40,31,36,42,35,44,30,29,43,45,34,32,39,46,57,72,105,118,85,66,54,62,73,51,68,71,48,69,75,79],
      visible:20,zone:[109,112],
      evidence:['109~112 저항구간을 장중 강하게 돌파','돌파일 거래량이 크게 증가','하지만 종가가 다시 저항구간 아래로 복귀'],
      choices:['거래량이 컸으므로 즉시 추격매수','돌파 유지 실패로 보고 재확인 전까지 대기','저항을 한 번 넘었으니 장기 상승 확정','거래량은 무시하고 캔들 색만 본다'],
      correct:1,
      feedback:'거래량 증가는 돌파를 확인하는 요소일 수 있지만, 가격이 구간 위에서 유지되지 못했습니다. “거래량 증가 = 매수”가 아니라 종가 유지와 다음 반응까지 봐야 합니다.',
      future:'이 예시에서는 이후 가격이 범위 아래쪽으로 밀렸습니다. 가짜 돌파를 미리 확정한 것이 아니라, 유지 실패 때문에 추격 진입을 보류한 판단이 핵심입니다.'
    },
    rebound:{
      name:'C · 하락추세 큰 양봉',
      closes:[132,130,128,129,126,124,125,122,120,121,118,116,117,114,112,113,110,108,111,114,112,109,106,104,102,103,101,99,98,96,95,93],
      vols:[43,45,48,35,51,55,39,57,60,42,63,67,46,65,70,49,74,78,96,101,64,58,71,76,82,55,69,77,73,80,86,92],
      visible:20,zone:[115,119],
      evidence:['고점·저점이 낮아지는 하락 구조','큰 양봉이 나왔지만 이전 주요 고점 아래','SMA20 기울기도 아직 하향'],
      choices:['큰 양봉이므로 추세전환 확정','하락 구조가 깨지는지 이전 고점 돌파를 추가 확인','양봉이므로 무조건 분할매수','거래량이 늘었으니 손절 없이 보유'],
      correct:1,
      feedback:'하락 추세 안에서도 강한 반등은 나올 수 있습니다. 캔들 크기보다 구조 변화가 우선이며, 이전 주요 고점 돌파와 저점 상승이 확인돼야 추세전환 근거가 강해집니다.',
      future:'이 예시에서는 반등 후 다시 저점을 낮췄습니다. 큰 양봉 하나보다 LH·LL 구조가 유지되는지를 본 이유를 보여주는 사례입니다.'
    }
  };

  let currentLab='pullback', revealed=false;

  function candleData(closes){
    return closes.map((c,i)=>{
      const o=i?closes[i-1]:c-1, spread=1.4+(i%3)*.55;
      return {o,c,h:Math.max(o,c)+spread,l:Math.min(o,c)-spread*.85};
    });
  }
  function drawLab(key,reveal=false){
    const el=$('#labChart'), cfg=labScenarios[key]; if(!el||!cfg)return;
    currentLab=key; revealed=reveal;
    const candles=candleData(cfg.closes), W=920,H=390,p={l:38,r:34,t:24,b:36}, vis=reveal?cfg.closes.length:cfg.visible;
    const shown=candles.slice(0,vis), vals=shown.flatMap(d=>[d.h,d.l,...cfg.zone]), min=Math.min(...vals)-2,max=Math.max(...vals)+2;
    const priceH=260, volBase=354, volH=58, x=i=>p.l+i*(W-p.l-p.r)/(cfg.closes.length-1), y=v=>p.t+(max-v)/(max-min)*priceH;
    const ma=sma(cfg.closes,20),vmax=Math.max(...cfg.vols.slice(0,vis));
    const zt=Math.min(y(cfg.zone[0]),y(cfg.zone[1])),zh=Math.abs(y(cfg.zone[0])-y(cfg.zone[1]));
    let s='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-label="초급 종합 판단 훈련 차트"><rect width="'+W+'" height="'+H+'" fill="#0b1220"/>';
    for(let i=0;i<5;i++){const yy=p.t+i*priceH/4;s+='<line x1="'+p.l+'" y1="'+yy+'" x2="'+(W-p.r)+'" y2="'+yy+'" stroke="'+C.grid+'" stroke-dasharray="4 6"/>';}
    s+='<rect x="'+p.l+'" y="'+zt+'" width="'+(W-p.l-p.r)+'" height="'+zh+'" fill="rgba(96,165,250,.10)" stroke="#3b82f6" stroke-dasharray="7 6"/>';
    s+='<text x="'+(p.l+8)+'" y="'+Math.max(14,zt-7)+'" fill="#60a5fa" font-size="11" font-weight="800">KEY ZONE '+cfg.zone[0]+'~'+cfg.zone[1]+'</text>';
    const maPath=linePath(ma.slice(0,vis),x,y); if(maPath)s+='<path d="'+maPath+'" fill="none" stroke="'+C.amber+'" stroke-width="2.7"/>';
    shown.forEach((d,i)=>{
      const up=d.c>=d.o,col=up?C.green:C.red,xx=x(i),yo=y(d.o),yc=y(d.c),yt=y(d.h),yb=y(d.l),top=Math.min(yo,yc),bh=Math.max(2.5,Math.abs(yo-yc));
      s+='<line x1="'+xx+'" y1="'+yt+'" x2="'+xx+'" y2="'+yb+'" stroke="'+col+'" stroke-width="2"/><rect x="'+(xx-7)+'" y="'+top+'" width="14" height="'+bh+'" rx="2" fill="'+col+'"/>';
      const vh=cfg.vols[i]/vmax*volH;s+='<rect x="'+(xx-7)+'" y="'+(volBase-vh)+'" width="14" height="'+vh+'" fill="'+col+'" opacity=".48"/>';
    });
    if(!reveal){
      const cut=x(cfg.visible-.35), w=W-p.r-cut;
      s+='<rect x="'+cut+'" y="0" width="'+w+'" height="'+H+'" fill="rgba(15,23,42,.96)"/><line x1="'+cut+'" y1="0" x2="'+cut+'" y2="'+H+'" stroke="#475569" stroke-dasharray="7 6"/><text x="'+(cut+w/2)+'" y="174" text-anchor="middle" fill="#cbd5e1" font-size="30" font-weight="900">?</text><text x="'+(cut+w/2)+'" y="200" text-anchor="middle" fill="#64748b" font-size="12">미래 구간</text>';
    }else{
      const cut=x(cfg.visible-.35);
      s+='<rect x="'+cut+'" y="0" width="'+(W-p.r-cut)+'" height="'+H+'" fill="rgba(167,139,250,.045)"/><text x="'+(cut+10)+'" y="18" fill="#a78bfa" font-size="11" font-weight="800">REVEALED FUTURE</text>';
    }
    s+='<text x="'+p.l+'" y="'+(H-8)+'" fill="'+C.muted+'" font-size="11">교육용 합성 데이터 · 캔들 + 거래량 + SMA20 + 주요구간</text></svg>';
    el.innerHTML=s;
    $('#labName').textContent=cfg.name;
    $('#evidenceList').innerHTML=cfg.evidence.map((e,i)=>'<div class="evidence-item"><span class="n">'+(i+1)+'</span><span>'+e+'</span></div>').join('');
    const actions=$('#decisionActions');
    actions.innerHTML=cfg.choices.map((ch,i)=>'<button class="decision-btn" data-choice="'+i+'">'+(i+1)+'. '+ch+'</button>').join('');
    $('#labFeedback').classList.remove('show'); $('#labFeedback').textContent='';
    $('#futureBtn').classList.remove('show'); $('#futureBtn').textContent='미래 구간 보기 →';
    $('#futureText').style.display='none'; $('#futureText').textContent='';
    actions.querySelectorAll('.decision-btn').forEach(btn=>btn.addEventListener('click',()=>answerLab(btn)));
  }
  function answerLab(btn){
    const cfg=labScenarios[currentLab],idx=Number(btn.dataset.choice),actions=$('#decisionActions');
    actions.querySelectorAll('.decision-btn').forEach(x=>{x.disabled=true;if(Number(x.dataset.choice)===cfg.correct)x.classList.add('correct');});
    if(idx!==cfg.correct)btn.classList.add('wrongpick');
    const fb=$('#labFeedback');fb.classList.add('show');fb.textContent=(idx===cfg.correct?'판단 좋음. ':'다시 볼 포인트: ')+cfg.feedback;
    $('#futureBtn').classList.add('show');
  }

  bind('[data-ma]','ma',drawMA);
  bind('[data-lab]','lab',(key)=>{
    $$('.lab-tab').forEach(x=>x.classList.toggle('active',x.dataset.lab===key));
    drawLab(key,false);
  });

  function bind(selector,key,fn){
    $$(selector).forEach(btn=>btn.addEventListener('click',()=>{
      $$(selector).forEach(x=>x.classList.remove('active'));btn.classList.add('active');fn(btn.dataset[key]);
    }));
  }

  const future=$('#futureBtn');
  if(future)future.addEventListener('click',()=>{
    drawLab(currentLab,true);
    const cfg=labScenarios[currentLab],t=$('#futureText');t.style.display='block';t.textContent=cfg.future;
    future.classList.remove('show');
  });

  if($('#maScene'))drawMA('trend');
  if($('#labChart'))drawLab('pullback',false);

  $$('.option').forEach(btn=>btn.addEventListener('click',()=>{
    const quiz=btn.closest('.quiz'),correct=btn.dataset.correct==='true';
    quiz.querySelectorAll('.option').forEach(x=>{x.disabled=true;if(x.dataset.correct==='true')x.classList.add('correct');});
    if(!correct)btn.classList.add('wrongpick');
    const fb=quiz.querySelector('.quiz-feedback');fb.classList.add('show');fb.textContent=(correct?'정답. ':'다시 볼 포인트: ')+quiz.dataset.feedback;
  }));

  window.addEventListener('scroll',()=>{
    const d=document.documentElement,p=d.scrollTop/Math.max(1,d.scrollHeight-d.clientHeight)*100,bar=$('#progressBar');
    if(bar)bar.style.width=p+'%';
  });
})();