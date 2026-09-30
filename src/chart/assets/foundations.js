(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const palette = {green:'#059669', red:'#dc2626', blue:'#2563eb', amber:'#d97706', ink:'#0f172a', muted:'#64748b', grid:'#dbe4ee'};

  const volumePresets = {
    breakout:{
      prices:[100,101,101.5,102,102.5,103,103.2,104,106,110,114],
      vols:[24,22,26,25,28,30,27,32,58,92,105],
      title:'가격 돌파 + 거래량 확대',
      desc:'가격이 기존 범위를 벗어날 때 거래량까지 커졌습니다. 참여가 늘어난 흔적으로 볼 수 있지만, 돌파 유지 여부를 다음 캔들에서 확인합니다.',
      tag:'확인 강도 ↑'
    },
    weakrise:{
      prices:[100,101.2,102.4,103.8,105,106.3,107.1,108,109,110,111],
      vols:[68,62,59,54,50,47,42,39,35,32,30],
      title:'가격 상승 + 거래량 감소',
      desc:'가격은 오르지만 참여는 줄고 있습니다. 즉시 하락 신호는 아니며, 추세 후반인지 단순한 거래 감소인지 맥락을 더 봅니다.',
      tag:'추가 확인'
    },
    selloff:{
      prices:[114,113,112,111,109,108,105,101,97,94,92],
      vols:[30,31,29,35,38,42,55,78,112,121,98],
      title:'가격 하락 + 거래량 급증',
      desc:'하락 구간에서 거래가 크게 늘었습니다. 공포성 매도나 강한 이탈 가능성을 생각할 수 있지만, 지지구간과 다음 반응을 함께 확인합니다.',
      tag:'매도 참여 ↑'
    },
    drypullback:{
      prices:[112,111.4,111,110.7,110.1,109.8,109.5,109.2,109.6,110.2,111],
      vols:[60,48,41,34,29,25,22,20,24,30,36],
      title:'완만한 조정 + 거래량 감소',
      desc:'가격이 쉬어가는데 거래량도 줄었습니다. 상승 추세 안의 건강한 눌림일 수 있지만, 이전 저점 훼손 여부를 같이 봅니다.',
      tag:'매도 압력 약화 가능'
    }
  };

  function drawVolume(key){
    const cfg=volumePresets[key], el=$('#volumeScene');
    if(!cfg || !el) return;
    const W=900,H=360,p={l:45,r:25,t:24,b:38}, priceTop=28, priceH=205, volBase=322, volH=72;
    const min=Math.min(...cfg.prices)-2,max=Math.max(...cfg.prices)+2;
    const x=i=>p.l+i*(W-p.l-p.r)/(cfg.prices.length-1), y=v=>priceTop+(max-v)/(max-min)*priceH;
    const vmax=Math.max(...cfg.vols);
    let svg='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-label="가격과 거래량 교육용 그래프"><rect width="'+W+'" height="'+H+'" rx="16" fill="#f8fafc"/>';
    for(let i=0;i<4;i++){const yy=priceTop+i*priceH/3;svg+='<line x1="'+p.l+'" y1="'+yy+'" x2="'+(W-p.r)+'" y2="'+yy+'" stroke="'+palette.grid+'" stroke-dasharray="4 6"/>';}
    cfg.vols.forEach((v,i)=>{
      const bh=v/vmax*volH, rising=i===0 || cfg.prices[i]>=cfg.prices[i-1], color=rising?'#86efac':'#fca5a5';
      svg+='<rect x="'+(x(i)-14)+'" y="'+(volBase-bh)+'" width="28" height="'+bh+'" rx="4" fill="'+color+'"/>';
    });
    const path=cfg.prices.map((v,i)=>(i?'L':'M')+x(i)+','+y(v)).join(' ');
    svg+='<path d="'+path+'" fill="none" stroke="'+palette.blue+'" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
    cfg.prices.forEach((v,i)=>svg+='<circle cx="'+x(i)+'" cy="'+y(v)+'" r="'+(i===cfg.prices.length-1?6:3.4)+'" fill="'+(i===cfg.prices.length-1?palette.blue:'#fff')+'" stroke="'+palette.blue+'" stroke-width="2"/>');
    svg+='<text x="'+p.l+'" y="18" font-size="12" font-weight="800" fill="'+palette.muted+'">PRICE</text><text x="'+p.l+'" y="'+(volBase+24)+'" font-size="12" font-weight="800" fill="'+palette.muted+'">VOLUME</text></svg>';
    el.innerHTML=svg;
    $('#volumeTitle').textContent=cfg.title; $('#volumeText').textContent=cfg.desc; $('#volumeTag').textContent=cfg.tag;
  }

  const trendPresets = {
    up:{
      pts:[100,106,103,111,107,116,112,121],
      labels:['L1','H1','HL','HH','HL','HH','HL','HH'],
      title:'상승 추세: 고점과 저점이 함께 높아진다',
      desc:'HH(Higher High)와 HL(Higher Low)이 반복됩니다. 단순히 가격이 올랐다는 것보다 구조가 위로 이동하고 있다는 점이 핵심입니다.'
    },
    down:{
      pts:[121,115,118,110,114,105,109,100],
      labels:['H1','L1','LH','LL','LH','LL','LH','LL'],
      title:'하락 추세: 고점과 저점이 함께 낮아진다',
      desc:'LH(Lower High)와 LL(Lower Low)이 반복됩니다. 반등이 나오더라도 이전 고점을 넘지 못하면 하락 구조가 유지될 수 있습니다.'
    },
    range:{
      pts:[105,115,107,114,106,116,108,114],
      labels:['L','H','L','H','L','H','L','H'],
      title:'횡보: 고점·저점이 뚜렷하게 이동하지 않는다',
      desc:'비슷한 상단과 하단 사이를 반복합니다. 가운데보다 범위의 경계에서 반응을 읽는 것이 더 유용합니다.'
    }
  };

  function drawTrend(key){
    const cfg=trendPresets[key], el=$('#trendScene');
    if(!cfg || !el) return;
    const W=900,H=350,p={l:50,r:35,t:30,b:42}, min=Math.min(...cfg.pts)-5,max=Math.max(...cfg.pts)+5;
    const x=i=>p.l+i*(W-p.l-p.r)/(cfg.pts.length-1), y=v=>p.t+(max-v)/(max-min)*(H-p.t-p.b);
    let svg='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-label="고점과 저점 구조 교육용 그래프"><rect width="'+W+'" height="'+H+'" rx="16" fill="#f8fafc"/>';
    for(let i=0;i<5;i++){const yy=p.t+i*(H-p.t-p.b)/4;svg+='<line x1="'+p.l+'" y1="'+yy+'" x2="'+(W-p.r)+'" y2="'+yy+'" stroke="'+palette.grid+'" stroke-dasharray="4 6"/>';}
    svg+='<path d="'+cfg.pts.map((v,i)=>(i?'L':'M')+x(i)+','+y(v)).join(' ')+'" fill="none" stroke="'+palette.ink+'" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
    cfg.pts.forEach((v,i)=>{
      const high=cfg.labels[i].includes('H'), c=high?palette.blue:palette.amber;
      svg+='<circle cx="'+x(i)+'" cy="'+y(v)+'" r="7" fill="#fff" stroke="'+c+'" stroke-width="4"/>';
      svg+='<text x="'+x(i)+'" y="'+(y(v)+(high?-15:25))+'" text-anchor="middle" font-size="13" font-weight="900" fill="'+c+'">'+cfg.labels[i]+'</text>';
    });
    svg+='</svg>';
    el.innerHTML=svg;
    $('#trendTitle').textContent=cfg.title; $('#trendText').textContent=cfg.desc;
  }

  const srPresets = {
    support:{
      pts:[118,113,108,104,101,105,110,106,102,107,113,117],
      zone:[99,103],
      title:'지지구간: 가격이 내려와 반복적으로 반응한 영역',
      desc:'정확한 한 줄보다 여러 번 반응한 가격대의 범위로 보는 편이 실전적입니다. 지지구간도 깨질 수 있으므로 매수 보장선은 아닙니다.'
    },
    resistance:{
      pts:[92,97,102,107,112,108,103,110,114,109,104,101],
      zone:[112,116],
      title:'저항구간: 가격이 올라가 반복적으로 밀린 영역',
      desc:'상단 영역에서 매도 압력이 반복된 흔적입니다. 거래량을 동반해 상단을 넘어서는지, 다시 범위 안으로 들어오는지 확인합니다.'
    },
    flip:{
      pts:[96,100,104,108,112,115,119,116,113,115,120,124],
      zone:[111,114],
      title:'역할 전환: 돌파한 저항이 이후 지지 후보가 될 수 있다',
      desc:'기존 저항을 넘은 뒤 되돌림에서 같은 영역 위에서 반응하는 예시입니다. 항상 성립하는 규칙이 아니라 확인해야 할 구조입니다.'
    },
    falsebreak:{
      pts:[96,101,106,111,115,119,121,113,108,104,101,99],
      zone:[112,116],
      title:'가짜 돌파: 잠깐 넘었다가 빠르게 구간 안으로 복귀',
      desc:'선 하나를 넘었다는 사실만으로 돌파를 확정하면 위험합니다. 종가 유지, 거래량, 이후 재테스트를 함께 봅니다.'
    }
  };

  function drawSR(key){
    const cfg=srPresets[key], el=$('#srScene');
    if(!cfg || !el) return;
    const W=900,H=350,p={l:50,r:35,t:30,b:42}, min=Math.min(...cfg.pts,...cfg.zone)-5,max=Math.max(...cfg.pts,...cfg.zone)+5;
    const x=i=>p.l+i*(W-p.l-p.r)/(cfg.pts.length-1), y=v=>p.t+(max-v)/(max-min)*(H-p.t-p.b);
    const zTop=Math.min(y(cfg.zone[0]),y(cfg.zone[1])), zH=Math.abs(y(cfg.zone[0])-y(cfg.zone[1]));
    let svg='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-label="지지와 저항 구간 교육용 그래프"><rect width="'+W+'" height="'+H+'" rx="16" fill="#f8fafc"/>';
    svg+='<rect x="'+p.l+'" y="'+zTop+'" width="'+(W-p.l-p.r)+'" height="'+zH+'" fill="rgba(37,99,235,.12)" stroke="#60a5fa" stroke-width="2" stroke-dasharray="8 6"/>';
    svg+='<text x="'+(p.l+10)+'" y="'+(zTop-8)+'" font-size="12" font-weight="900" fill="'+palette.blue+'">ZONE '+cfg.zone[0]+'~'+cfg.zone[1]+'</text>';
    svg+='<path d="'+cfg.pts.map((v,i)=>(i?'L':'M')+x(i)+','+y(v)).join(' ')+'" fill="none" stroke="'+palette.ink+'" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>';
    cfg.pts.forEach((v,i)=>svg+='<circle cx="'+x(i)+'" cy="'+y(v)+'" r="3.5" fill="#fff" stroke="'+palette.ink+'" stroke-width="2"/>');
    svg+='</svg>';
    el.innerHTML=svg;
    $('#srTitle').textContent=cfg.title; $('#srText').textContent=cfg.desc;
  }

  function bindScenario(selector, datasetKey, draw){
    $$(selector).forEach(btn=>btn.addEventListener('click',()=>{
      $$(selector).forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      draw(btn.dataset[datasetKey]);
    }));
  }

  bindScenario('[data-volume]','volume',drawVolume);
  bindScenario('[data-trend]','trend',drawTrend);
  bindScenario('[data-sr]','sr',drawSR);
  if($('#volumeScene')) drawVolume('breakout');
  if($('#trendScene')) drawTrend('up');
  if($('#srScene')) drawSR('support');

  $$('.option').forEach(btn=>btn.addEventListener('click',()=>{
    const quiz=btn.closest('.quiz'), correct=btn.dataset.correct==='true';
    quiz.querySelectorAll('.option').forEach(x=>{x.disabled=true;if(x.dataset.correct==='true')x.classList.add('correct');});
    if(!correct) btn.classList.add('wrongpick');
    const fb=quiz.querySelector('.quiz-feedback');
    fb.classList.add('show');
    fb.textContent=(correct?'정답. ':'다시 볼 포인트: ')+quiz.dataset.feedback;
  }));

  window.addEventListener('scroll',()=>{
    const d=document.documentElement,p=d.scrollTop/Math.max(1,d.scrollHeight-d.clientHeight)*100,bar=$('#progressBar');
    if(bar) bar.style.width=p+'%';
  });
})();