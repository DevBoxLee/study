(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const presets = {
    bullish:{o:100,h:116,l:96,c:112,title:'매수세가 종가를 위로 끌어올린 날',desc:'종가가 시가보다 높습니다. 다만 이 캔들 하나만으로 다음 상승을 확정할 수는 없습니다.'},
    bearish:{o:112,h:116,l:96,c:100,title:'매도세가 종가를 아래로 끌어내린 날',desc:'종가가 시가보다 낮습니다. 위치와 거래량을 함께 봐야 의미가 커집니다.'},
    upper:{o:101,h:120,l:98,c:104,title:'위에서 강한 매도 압력을 받은 흔적',desc:'장중 높은 가격까지 갔지만 상당 부분 밀렸습니다. 저항 부근인지 확인합니다.'},
    lower:{o:108,h:112,l:88,c:107,title:'아래에서 매수세가 되받아 올린 흔적',desc:'장중 크게 밀렸지만 종가는 회복했습니다. 지지구간·거래량과 함께 봅니다.'},
    doji:{o:104,h:114,l:95,c:104.4,title:'매수·매도 우위가 뚜렷하지 않은 날',desc:'시가와 종가가 비슷합니다. 도지 자체보다 어디에서 나왔는지가 중요합니다.'}
  };

  const svg = $('#candleSvg');
  function drawCandle(p) {
    if (!svg) return;
    const top=42,bottom=350,min=p.l-5,max=p.h+5,cx=208,bw=96;
    const y=(v)=>top+(max-v)/(max-min)*(bottom-top);
    const up=p.c>=p.o, color=up?'#059669':'#dc2626';
    const bodyTop=Math.min(y(p.o),y(p.c)), bodyH=Math.max(5,Math.abs(y(p.o)-y(p.c)));
    svg.innerHTML =
      '<defs><filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#0f172a" flood-opacity=".16"/></filter></defs>'+
      '<line x1="'+cx+'" y1="'+y(p.h)+'" x2="'+cx+'" y2="'+y(p.l)+'" stroke="'+color+'" stroke-width="5" stroke-linecap="round"/>'+
      '<rect x="'+(cx-bw/2)+'" y="'+bodyTop+'" width="'+bw+'" height="'+bodyH+'" rx="8" fill="'+color+'" filter="url(#shadow)"/>'+
      '<line x1="70" y1="'+y(p.h)+'" x2="350" y2="'+y(p.h)+'" stroke="#cbd5e1" stroke-dasharray="5 6"/>'+
      '<line x1="70" y1="'+y(p.l)+'" x2="350" y2="'+y(p.l)+'" stroke="#cbd5e1" stroke-dasharray="5 6"/>'+
      '<text x="72" y="'+(y(p.h)-8)+'" fill="#64748b" font-size="12" font-weight="700">HIGH '+p.h+'</text>'+
      '<text x="72" y="'+(y(p.l)+20)+'" fill="#64748b" font-size="12" font-weight="700">LOW '+p.l+'</text>'+
      '<text x="326" y="'+(y(p.o)+4)+'" fill="#0f172a" font-size="12" font-weight="800">시가 '+p.o+'</text>'+
      '<text x="326" y="'+(y(p.c)+4)+'" fill="#0f172a" font-size="12" font-weight="800">종가 '+p.c+'</text>'+
      '<line x1="'+(cx+bw/2+8)+'" y1="'+y(p.o)+'" x2="318" y2="'+y(p.o)+'" stroke="#94a3b8"/>'+
      '<line x1="'+(cx+bw/2+8)+'" y1="'+y(p.c)+'" x2="318" y2="'+y(p.c)+'" stroke="#94a3b8"/>'+
      '<text x="'+cx+'" y="24" text-anchor="middle" fill="'+color+'" font-size="13" font-weight="900">'+(up?'양봉 · 종가 > 시가':'음봉 · 종가 < 시가')+'</text>';
    $('#openVal').textContent=p.o; $('#highVal').textContent=p.h; $('#lowVal').textContent=p.l; $('#closeVal').textContent=p.c;
    $('#meaningTitle').textContent=p.title; $('#meaningText').textContent=p.desc;
    $('#bodyMeaning').textContent=up?'몸통은 시가보다 종가가 위에서 끝난 범위를 보여줍니다.':'몸통은 시가보다 종가가 아래에서 끝난 범위를 보여줍니다.';
  }

  $$('.preset').forEach((btn)=>{
    btn.addEventListener('click',()=>{
      $$('.preset').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      drawCandle(presets[btn.dataset.preset]);
    });
  });
  drawCandle(presets.bullish);

  const data=[
    ['2026-08-03',100,104,98,102],['2026-08-04',102,106,101,105],['2026-08-05',105,107,102,103],['2026-08-06',103,108,102,107],
    ['2026-08-07',107,110,105,109],['2026-08-10',109,112,107,108],['2026-08-11',108,111,105,106],['2026-08-12',106,108,102,103],
    ['2026-08-13',103,105,99,101],['2026-08-14',101,104,98,103],['2026-08-17',103,106,101,105],['2026-08-18',105,109,104,108],
    ['2026-08-19',108,112,107,111],['2026-08-20',111,114,109,113],['2026-08-21',113,116,111,112],['2026-08-24',112,114,108,109],
    ['2026-08-25',109,110,104,106],['2026-08-26',106,109,103,108],['2026-08-27',108,115,107,114],['2026-08-28',114,119,113,118]
  ].map(x=>({time:x[0],open:x[1],high:x[2],low:x[3],close:x[4]}));
  const vols=[32,38,30,44,51,36,35,47,58,49,42,46,52,56,41,44,55,50,82,96];
  const volume=vols.map((v,i)=>({time:data[i].time,value:v,color:data[i].close>=data[i].open?'rgba(5,150,105,.48)':'rgba(220,38,38,.45)'}));
  const chartEl=$('#marketChart');
  let chart=null;

  function fallback(){
    if(!chartEl || chartEl.children.length) return;
    const W=900,H=390,p={l:20,r:55,t:22,b:55},min=Math.min(...data.map(x=>x.low))-2,max=Math.max(...data.map(x=>x.high))+2;
    const iw=W-p.l-p.r, ih=H-p.t-p.b-70;
    const x=(i)=>p.l+20+i*(iw-40)/(data.length-1), y=(v)=>p.t+(max-v)/(max-min)*ih;
    let s='<svg class="chart-fallback" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none"><rect width="'+W+'" height="'+H+'" fill="#0b1220"/>';
    for(let i=0;i<5;i++){const yy=p.t+ih*i/4;s+='<line x1="'+p.l+'" y1="'+yy+'" x2="'+(W-p.r)+'" y2="'+yy+'" stroke="#172033"/><text x="'+(W-8)+'" y="'+(yy+4)+'" fill="#64748b" font-size="11" text-anchor="end">'+(max-(max-min)*i/4).toFixed(0)+'</text>';}
    data.forEach((d,i)=>{
      const xx=x(i),up=d.close>=d.open,c=up?'#10b981':'#ef4444',yt=y(d.high),yb=y(d.low),yo=y(d.open),yc=y(d.close),bt=Math.min(yo,yc),bh=Math.max(2,Math.abs(yo-yc));
      s+='<line x1="'+xx+'" y1="'+yt+'" x2="'+xx+'" y2="'+yb+'" stroke="'+c+'" stroke-width="2"/><rect x="'+(xx-7)+'" y="'+bt+'" width="14" height="'+bh+'" fill="'+c+'" rx="2"/>';
      const vh=vols[i]/100*55;s+='<rect x="'+(xx-7)+'" y="'+(H-25-vh)+'" width="14" height="'+vh+'" fill="'+(up?'#065f46':'#7f1d1d')+'" opacity=".8"/>';
    });
    s+='<text x="'+(p.l+20)+'" y="'+(H-10)+'" fill="#64748b" font-size="11">교육용 예시 데이터 · 외부 라이브러리 연결 실패 시 SVG 대체 렌더링</text></svg>';
    chartEl.innerHTML=s;
  }

  function initLwc(){
    if(!chartEl || !window.LightweightCharts || chart) return !!chart;
    try{
      chart=LightweightCharts.createChart(chartEl,{width:chartEl.clientWidth,height:390,layout:{background:{type:'solid',color:'#0b1220'},textColor:'#94a3b8'},grid:{vertLines:{color:'#172033'},horzLines:{color:'#172033'}},rightPriceScale:{borderColor:'#334155'},timeScale:{borderColor:'#334155',timeVisible:false}});
      let cs,vs;
      if(chart.addSeries && LightweightCharts.CandlestickSeries){
        cs=chart.addSeries(LightweightCharts.CandlestickSeries,{upColor:'#10b981',downColor:'#ef4444',borderVisible:false,wickUpColor:'#10b981',wickDownColor:'#ef4444'});
        vs=chart.addSeries(LightweightCharts.HistogramSeries,{priceFormat:{type:'volume'},priceScaleId:'vol',lastValueVisible:false,priceLineVisible:false});
      }else{
        cs=chart.addCandlestickSeries({upColor:'#10b981',downColor:'#ef4444',borderVisible:false,wickUpColor:'#10b981',wickDownColor:'#ef4444'});
        vs=chart.addHistogramSeries({priceFormat:{type:'volume'},priceScaleId:'vol',lastValueVisible:false,priceLineVisible:false});
      }
      cs.setData(data); vs.setData(volume);
      chart.priceScale('vol').applyOptions({scaleMargins:{top:.78,bottom:0}});
      chart.timeScale().fitContent();
      new ResizeObserver(()=>chart.applyOptions({width:chartEl.clientWidth,height:chartEl.clientHeight||390})).observe(chartEl);
      return true;
    }catch(e){ chart=null; return false; }
  }

  window.initLearningChart=()=>{ if(!initLwc()) fallback(); };
  if(window.LightweightCharts) window.initLearningChart();
  else setTimeout(()=>{ if(!chartEl?.children.length) fallback(); },1800);

  $$('.chart-btn').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.chart-btn').forEach(x=>x.classList.remove('active')); btn.classList.add('active');
    if(!chart) return;
    if(btn.dataset.action==='reset') chart.timeScale().fitContent();
    if(btn.dataset.action==='focus') chart.timeScale().setVisibleLogicalRange({from:12,to:21});
  }));

  $$('.option').forEach(btn=>btn.addEventListener('click',()=>{
    const quiz=btn.closest('.quiz'), correct=btn.dataset.correct==='true';
    quiz.querySelectorAll('.option').forEach(x=>{x.disabled=true;if(x.dataset.correct==='true')x.classList.add('correct');});
    if(!correct) btn.classList.add('wrongpick');
    const fb=quiz.querySelector('.quiz-feedback'); fb.classList.add('show'); fb.textContent=(correct?'정답. ':'다시 볼 포인트: ')+quiz.dataset.feedback;
  }));

  window.addEventListener('scroll',()=>{
    const d=document.documentElement,p=d.scrollTop/Math.max(1,d.scrollHeight-d.clientHeight)*100,bar=$('#progressBar');
    if(bar) bar.style.width=p+'%';
  });
})();