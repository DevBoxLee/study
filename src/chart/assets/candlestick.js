(() => {
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const presets={
    bullish:{o:100,h:116,l:96,c:112,title:'매수세가 종가를 끌어올린 날',desc:'종가가 시가보다 높습니다. 다만 이 캔들 하나만으로 다을 상승을 확정할 수는 없습니다.'},
    bearish:{o:112,h:116,l:96,c:100,title:'매도세가 종가를 눌러 내린 날',desc:'종가가 시가보다 낮습니다. 위치와 거래량을 함께 봐야 의미가 커집니다.'},
    upper:{o:101,h:120,l:98,c:104,title:'위에서 강한 매도 압력을 받은 흔적',desc:'장중 높은 가격까지 갔지만 상당 부분 밀렸습니다. 저항 부근에서 나오면 더 의미가 커질 수 있습니다.'},
    lower:{o:108,h:112,l:88,c:107,title:'아래에서 매수세가 강하게 받아낸 흔적',desc:'장중 크게 밀렸지만 종가를 되돌렸습니다. 지지 부근·거래량 증가와 함께 보면 해석력이 높아집니다.'},
    doji:{o:104,h:114,l:95,c:104.4,title:'매수»매도 우위가 뚜렷하지 않은 날',desc:'시가와 종가가 비슷합니다. 도지 자체보다 어디에서 나타났는지가 더 중요합니다.'}
  };
  const stage=$('#candleSvg');
  function drawCandle(p){
    if(!stage) return;
    const W=420,H=390,top=42,bottom=350,min=p.l-5,max=p.h+5,y=v=>top+(max-v)/(max-min)*(bottom-top);
    const up=p.c>=p.o,color=up?'#059669':'#dc2626',bodyTop=Math.min(y(p.o),y(p.c)),bodyH=Math.max(5,Math.abs(y(p.o)-y(p.c))),cx=208,bw=96;
    const labels=[['고가',p.h,y(p.h)],['저가',p.l,y(p.l)],['시가',p.o,y(p.o)],['종가',p.c,y(p.c)]];
    stage.innerHTML=`
      <defs><filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#0f172a" flood-opacity=".16"/></filter></defs>
      <line x1="${cx}" y1="${y(p.h)}" x2="${cx}" y2="${y(p.l)}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
      <rect x="${cx-bw/2}" y="${bodyTop}" width="${bw}" height="${bodyH}" rx="8" fill="${color}" filter="url(#shadow)"/>
      <line x1="70" y1="${y(p.h)}" x2="350" y2="${y(p.h)}" stroke="#cbd5e1" stroke-dasharray="5 6"/>
      <line x1="70" y1="${y(p.l)}" x2="350" y2="${y(p.l)}" stroke="#cbd5e1" stroke-dasharray="5 6"/>
      <text x="72" y="${y(p.h)-8}" fill="#64748b" font-size="12" font-weight="700">HIGH ${p.h}</text>
      <text x="72" y="${y(p.l)+20}" fill="#64748b" font-size="12" font-weight="700">LOW ${p.l}</text>
      <g fill="#0f172a" font-size="12" font-weight="800">
        <text x="326" y="${y(p.o)+4}">시가 ${p.o}</text><text x="326" y="${y(p.c)+4}">종가 ${p.c}</text>
      </g>
      <line x1="${cx+bw/2+8}" y1="${y(p.o)}" x2="318" y2="${y(p.o)}" stroke="#94a3b8"/>
      <line x1="${cx+bw/2+8}" y1="${y(p.c)}" x2="318" y2="${y(p.c)}" stroke="#94a3b8"/>
      <text x="${cx}" y="24" text-anchor="middle" fill="${color}" font-size="13" font-weight="900">${up?'양봉 · 종가 > 시가':'음봉 · 종가 < 시가'}</text>`;
    $('#openVal').textContent=p.o;$('#highVal').textContent=p.h;$('#lowVal').textContent=p.l;$('#closeVal').textContent=p.c;
    $('#meaningTitle').textContent=p.title;$('#meaningText').textContent=p.desc;
    $('#bodyMeaning').textContent=up?'몸통은 시가보다 종가가 위에서 끝난 범위를 보여줍니다.':'몸통은 시가보다 종가가 아래에서 끝난 범위를 보여줍니다.';
  }
  $$('.preset').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.preset').forEach(x=>x.classList.remove('active'));btn.classList.add('active');drawCandle(presets[btn.dataset.preset]);
  }));
  drawCandle(presets.bullish);

  const data=[
    {time:'2026-08-03',open:100,high:104,low:98,close:102},{time:'2026-08-04',open:102,high:106,low:101,close:105},
    {time:'2026-08-05',open:105,high:107,low:102,close:103},{time:'2026-08-06',open:103,high:108,low:102,close:107},
    {time:'2026-08-07',open:107,high:110,low:105,close:109},{time:'2026-08-10',open:109,high:112,low:107,close:108},
    {time:'2026-08-11',open:108,high:111,low:105,close:106},{time:'2026-08-12',open:106,high:108,low:102,close:103},
    {time:'2026-08-13',open:103,high:105,low:99,close:101},{time:'2026-08-14',open:101,high:104,low:98,close:103},
    {time:'2026-08-17',open:103,high:106,low:101,close:105},{time:'2026-08-18',open:105,high:109,low:104,close:108},
    {time:'2026-08-19',open:108,high:112,low:107,close:111},{time:'2026-08-20',open:111,high:114,low:109,close:113},
    {time:'2026-08-21',open:113,high:116,low:111,close:112},{time:'2026-08-24',open:112,high:114,low:108,close:109},
    {time:'2026-08-25',open:109,high:110,low:104,close:106},{time:'2026-08-26',open:106,high:109,low:103,close:108},
    {time:'2026-08-27',open:108,high:115,low:107,close:114},{time:'2026-08-28',open:114,high:119,low:113,close:118}
  ];
  const volume=[32,38,30,44,51,36,35,47,58,49,42,46,52,56,41,44,55,50,82,96].map((v,i)=>({time:data[i].time,value:v,color:data[i].close>=data[i].open?'rgba(5,150,105,.48)':'rgba(220,38,38,.45)'}));
  const chartEl=$('#marketChart');
  let chart, candleSeries, volSeries;
  function initLwc(){
    if(!chartEl || !window.LightweightCharts) return false;
    try{
      chart=LightweightCharts.createChart(chartEl,{width:chartEl.clientWidth,height:390,layout:{background:{type:'solid',color:'#0b1220'},textColor:'#94a3b8'},grid:{vertLines:{color:'#172033'},horzLines:{color:'#172033'}},rightPriceScale:{borderColor:'#334155'},timeScale:{borderColor:'#334155',timeVisible:false},crosshair:{mode:0}});
      if(chart.addSeries && LightweightCharts.CandlestickSeries){
        candleSeries=chart.addSeries(LightweightCharts.CandlestickSeries,{upColor:'#10b981',downColor:'#ef4444',borderVisible:false,wickUpColor:'#10b981',wickDownColor:'#ef4444'});
        volSeries=chart.addSeries(LightweightCharts.HistogramSeries,{priceFormat:{type:'volume'},priceScaleId:'vol',lastValueVisible:false,priceLineVisible:false});
      } else {
        candleSeries=chart.addCandlestickSeries({upColor:'#10b981',downColor:'#ef4444',borderVisible:false,wickUpColor:'#10b981',wickDownColor:'#ef4444'});
        volSeries=chart.addHistogramSeries({priceFormat:{type:'volume'},priceScaleId:'vol',lastValueVisible:false,priceLineVisible:false});
      }
      candleSeries.setData(data);volSeries.setData(volume);chart.priceScale('vol').applyOptions({scaleMargins:{top:.78,bottom:0}});chart.timeScale().fitContent();
      new ResizeObserver(()=>chart.applyOptions({width:chartEl.clientWidth,height:chartEl.clientHeight||390})).observe(chartEl);
      return true;
    }catch(e){return false;}
  }
  function fallback(){
    if(!chartEl) return;
    const W=900,H=390,p={l:20,r:55,t:22,b:55},min=Math.min(...data.map(x=>x.low))-2,max=Math.max(...data.map(x=>x.high))+2,iw=W-p.l-p.r,ih=H-p.t-p.b-70;
    const x=i=>p.l+20+i*(iw-40)/(data.length-1), y=v=>p.t+(max-v)/(max-min)*ih;
    let s=`<svg class="chart-fallback" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><rect width="${W}" height="${H}" fill="#0b1220"/>`;
    for(let i=0;i<5;i++){const yy=p.t+ih*i/4;s+=`<line x1="${p.l}" y1="${yy}" x2="${W-p.r}" y2="${yy}" stroke="#172033"/><text x="${W-8}" y="${yy+4}" fill="#64748b" font-size="11" text-anchor="end">${(max-(max-min)*i/4).toFixed(0)}</text>`}
    data.forEach((d,i)=>{const xx=x(i),up=d.close>=d.open,c=up?'#10b981':'#ef4444',yt=y(d.high),yb=y(d.low),yo=y(d.open),yc=y(d.close),top=Math.min(yo,yc),h=Math.max(2,Math.abs(yo-yc));s+=`<line x1="${xx}" y1="${yt}" x2="${xx}" y2="${yb}" stroke="${c}" stroke-width="2"/><rect x="${xx-7}" y="${top}" width="14" height="${h}" fill="${c}" rx="2"/>`;const vh=volume[i].value/100*55;s+=`<rect x="${xx-7}" y="${H-25-vh}" width="14" height="${vh}" fill="${up?'#065f46':'#7f1d1d'}" opacity=".8"/>`});
    s+=`<text x="${p.l+20}" y="${H-10}" fill="#64748b" font-size="11">교육용 예시 데이�, ÷ 외부 렌을 로드하는 구조 - 외부 레룬 서버 연결 실패 시 SVG 눀체 력더릁</text></svg>`;chartEl.innerHTML=s;
  }
  window.initLearningChart=()=>{if(!initLwc()) fallback();};
  if(window.LightweightCharts) window.initLearningChart(); else setTimeout(()=>{if(!chartEl?.children.length) fallback();},1800);

  $$('.chart-btn').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.chart-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
    if(btn.dataset.action==='reset' && chart) chart.timeScale().fitContent();
    if(btn.dataset.action==='focus' && chart) chart.timeScale().setVisibleLogicalRange({from:12,to:21});
  }));

  $$('.option').forEach(btn=>btn.addEventListener('click',()=>{
    const quiz=btn.closest('.quiz'),correct=btn.dataset.correct==='true';
    quiz.querySelectorAll('.option').forEach(x=>{x.disabled=true;if(x.dataset.correct==='true')x.classList.add('correct')});
    if(!correct)btn.classList.add('wrongpick');const fb=quiz.querySelector('.quiz-feedback');fb.classList.add('show');fb.innerHTML=(correct?'정시. ':'다시 볼 포인트: ')+quiz.dataset.feedback;
  }));
  window.addEventListener('scroll',()=>{const d=document.documentElement,p=d.scrollTop/Math.max(1,d.scrollHeight-d.clientHeight)*100;const bar=$('#progressBar');if(bar)bar.style.width=p+'%'});
})();
