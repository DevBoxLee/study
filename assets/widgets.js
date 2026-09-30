'use strict';
window.FinanceWidgets=(function(){
const m=window.FinanceMath;
const money=x=>new Intl.NumberFormat('ko-KR',{maximumFractionDigits:0}).format(x)+'만원';
const large=x=>x>=10000?(x/10000).toFixed(2)+'억원':money(x);
const num=(root,name)=>Number(root.querySelector('[name="'+name+'"]').value);
const input=(name,label,value,min,max,step=1)=>'<label>'+label+'<input type="number" name="'+name+'" value="'+value+'" min="'+min+'" max="'+max+'" step="'+step+'" required></label>';
const range=(name,label,value,min,max,suffix)=>'<label><span class="range-row">'+label+'<strong data-for="'+name+'">'+value+suffix+'</strong></span><input type="range" name="'+name+'" value="'+value+'" min="'+min+'" max="'+max+'" data-suffix="'+suffix+'"></label>';
const card=(label,value,extra='',type='')=>'<div class="result-card '+type+'"><small>'+label+'</small><strong>'+value+'</strong>'+(extra?'<em>'+extra+'</em>':'')+'</div>';
const intro=(title,caption)=>'<div class="widget-head"><h3>'+title+'</h3><p>'+caption+'</p></div>';
const bar=(label,value,percent,type='')=>'<div><div class="bar-label"><span>'+label+'</span><strong>'+value+'</strong></div><div class="mini-bar '+type+'"><span style="width:'+Math.max(0,Math.min(100,percent))+'%"></span></div></div>';

function bind(root,update){
  const run=()=>{
    root.querySelectorAll('input[type=range]').forEach(x=>{const out=root.querySelector('[data-for="'+x.name+'"]');if(out)out.textContent=x.value+x.dataset.suffix;});
    let error=root.querySelector('.widget-error');if(!error){error=document.createElement('p');error.className='widget-error';error.setAttribute('role','status');root.append(error);}
    const valid=Array.from(root.querySelectorAll('input,select')).every(x=>x.checkValidity());error.textContent=valid?'':'입력 범위를 확인하세요.';if(!valid)return;
    try{update();error.textContent='';}catch{error.textContent='입력 범위를 확인하세요.';}
  };
  root.addEventListener('input',run);root.addEventListener('change',run);run();
}
function tabs(root,title,caption,info){
  root.innerHTML=intro(title,caption)+'<div class="tab-row">'+Object.keys(info).map((x,i)=>'<button type="button" aria-pressed="'+(i===0)+'" data-choice="'+x+'">'+x+'</button>').join('')+'</div><div class="info-box" role="status"></div>';
  const select=key=>{root.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.choice===key)));root.querySelector('.info-box').innerHTML='<h4>'+info[key][0]+'</h4><p>'+info[key][1]+'</p>';};
  root.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>select(b.dataset.choice));select(Object.keys(info)[0]);
}
function roadmap(root){
  root.innerHTML=intro('일곱 번의 질문만 해결합니다','공부 범위를 늘리기보다 투자 결정에 필요한 순서를 따라갑니다.')+
  '<div class="route-grid">'+[
    ['01','얼마를 투자할 수 있나?','1억원에서 장기 투자금 찾기','01-money'],
    ['02','언제 쓸 돈인가?','시간을 붙여 투자기간 정하기','02-horizon'],
    ['03','얼마까지 흔들릴 수 있나?','손실률을 원화로 체감하기','03-risk'],
    ['04','성장과 안정을 어떻게 나눌까?','100:0·80:20·60:40 실험','04-allocation'],
    ['05','ETF 안에는 무엇이 있나?','티커가 아니라 기초자산 읽기','05-etf'],
    ['06','어느 계좌에 담을까?','세금과 유동성을 함께 비교','06-accounts'],
    ['07','어떻게 계속 지킬까?','매수·매도·리밸런싱 규칙','07-policy']
  ].map((x,i)=>'<a class="route-card '+(i===6?'wide':'')+'" href="#'+x[3]+'"><small>'+x[0]+'</small><strong>'+x[1]+'</strong><p>'+x[2]+'</p></a>').join('')+'</div>';
}
function moneyStory(root){
  root.innerHTML=intro('1억원을 전부 투자하면 어떤 일이 생길까?','시장 하락과 예정 지출이 동시에 생기는 상황부터 봅니다.')+
  '<div class="scenario-grid"><section class="scenario bad"><small>CASE A · 전액 투자</small><strong>1억원 → 7,000만원</strong><p>주식형 자산 -30% 뒤 2,500만원이 필요하면 하락장에서 매도해야 합니다.</p><div class="scenario-end">지출 후 투자계좌 <b>4,500만원</b></div></section><section class="scenario good"><small>CASE B · 먼저 분리</small><strong>6,000만원 → 4,200만원</strong><p>목적자금 2,500만원을 따로 두었기 때문에 주식은 팔지 않습니다.</p><div class="scenario-end">장기 투자계획 <b>유지</b></div></section></div>'+
  '<div class="decision-line"><span>핵심</span><b>수익률보다 먼저 “하락장에서 팔지 않아도 되는 돈”을 찾는다.</b></div>'+
  '<div class="inputs">'+input('total','금융자산 (만원)',10000,0,1000000)+input('emergency','비상금 (만원)',1500,0,1000000)+input('purpose','5년 내 목적자금 (만원)',2500,0,1000000)+'</div><div data-output role="status"></div>';
  bind(root,()=>{const t=num(root,'total'),e=num(root,'emergency'),p=num(root,'purpose'),long=t-e-p;if(long<0){root.querySelector('[data-output]').innerHTML='<div class="info-box warn"><strong>장기 투자금이 0보다 작습니다.</strong><p>투자보다 먼저 생활·목적자금을 다시 맞춰야 합니다.</p></div>';return;}root.querySelector('[data-output]').innerHTML='<div class="seg-bar"><span style="width:'+(t?e/t*100:0)+'%">비상금</span><span style="width:'+(t?p/t*100:0)+'%">목적</span><span style="width:'+(t?long/t*100:0)+'%">장기</span></div><div class="result-grid">'+card('비상금',money(e))+card('목적자금',money(p))+card('장기 투자 가능',money(long),'이 금액이 다음 장으로 넘어갑니다.')+'</div>';});
}
function horizonTimeline(root){
  root.innerHTML=intro('같은 돈이라도 사용 날짜가 다르면 역할이 달라집니다','기간은 수익률 예측보다 먼저 정하는 조건입니다.')+
  '<div class="timeline"><div><b>지금~2년</b><strong>비상·생활</strong><span>즉시 접근</span></div><div><b>3~5년</b><strong>목적자금</strong><span>회복 기다릴 시간이 짧음</span></div><div><b>10년+</b><strong>장기 투자</strong><span>성장자산 검토</span></div><div><b>20~30년</b><strong>은퇴·장기목표</strong><span>복리와 변동성 모두 중요</span></div></div>'+
  '<div class="compare-question"><div><small>3년 뒤 쓸 6,000만원</small><b>큰 하락 뒤 회복을 기다릴 수 있나?</b></div><span>VS</span><div><small>30년 뒤 쓸 6,000만원</small><b>현금만 보유하면 구매력은?</b></div></div>';
}
function compound(root){
  root.innerHTML=intro('시간이 결과를 얼마나 바꾸는지 계산해 보세요','월말 납입 · 연 유효수익률 · 세금·비용 제외 · 분배금 재투자 가정')+'<div class="inputs">'+input('initial','처음 투자할 돈 (만원)',6000,0,1000000)+input('monthly','매월 추가할 돈 (만원)',150,0,10000)+range('years','투자기간',20,1,40,'년')+input('rate','연 수익률 가정 (%)',5,-30,20,.5)+input('inflation','연 물가상승률 가정 (%)',2,0,10,.5)+'</div><div class="result-grid" role="status" data-results></div><div data-chart></div><div class="legend"><span>계산상 미래가치</span><span class="blue">누적 납입원금</span></div><p class="caption">고정 수익률 계산 경로일 뿐 실제 시장 전망이 아닙니다. 실질금액은 물가를 반영한 오늘의 구매력입니다.</p>';
  bind(root,()=>{const a=num(root,'initial'),b=num(root,'monthly'),y=num(root,'years'),r=num(root,'rate'),inf=num(root,'inflation'),v=m.project(a,b,y,r,inf);root.querySelector('[data-results]').innerHTML=card('누적 납입원금',large(v.principal))+card('계산상 미래가치',large(v.value),'수익 부분 '+large(v.value-v.principal))+card('오늘의 구매력',large(v.real),'물가 연 '+inf+'% 가정');
  const points=[];let max=0;for(let t=0;t<=y;t++){const z=m.project(a,b,t,r);points.push([t,z.value,z.principal]);max=Math.max(max,z.value,z.principal);}max=Math.max(1,max)*1.12;const px=t=>50+t/y*520,py=v=>230-v/max*195;const path=k=>points.map((p,i)=>(i?'L':'M')+px(p[0]).toFixed(1)+','+py(p[k]).toFixed(1)).join(' ');let grid='';for(let i=0;i<4;i++){const val=max*i/3;grid+='<line class="axis" x1="50" y1="'+py(val)+'" x2="580" y2="'+py(val)+'"/><text x="2" y="'+(py(val)+4)+'">'+(val/10000).toFixed(1)+'억</text>';}root.querySelector('[data-chart]').innerHTML='<svg class="chart" role="img" aria-label="'+y+'년 뒤 납입원금 '+large(v.principal)+', 미래가치 '+large(v.value)+'" viewBox="0 0 600 270">'+grid+'<path class="principal" d="'+path(2)+'"/><path class="series" d="'+path(1)+'"/><text x="50" y="257">지금</text><text x="290" y="257">'+Math.round(y/2)+'년</text><text x="550" y="257">'+y+'년</text></svg>';});
}
function riskLab(root){
  root.innerHTML=intro('퍼센트를 원화 손실로 바꿔 보세요','6,000만원 장기자금의 한 번의 하락을 체험합니다.')+'<div class="shock-number"><small>장기 투자금</small><b>6,000만원</b><span>→</span><strong data-balance>3,600만원</strong></div><div class="inputs one">'+range('drop','시장 하락률',40,0,80,'%')+'</div><div data-output role="status"></div>';
  bind(root,()=>{const d=num(root,'drop'),left=6000*(1-d/100);root.querySelector('[data-balance]').textContent=money(left);root.querySelector('[data-output]').innerHTML='<div class="result-grid">'+card('평가손실',money(6000-left),'아직 매도하지 않은 손실','negative')+card('남은 금액',money(left))+card('원금 회복 필요','+'+m.recovery(d).toFixed(1)+'%')+'</div><div class="decision-line"><span>질문</span><b>'+money(6000-left)+'이 줄어든 화면에서도 계획을 유지할 수 있는가?</b></div>';});
}
function allocationLab(root){
  root.innerHTML=intro('비중 하나가 손실 경험을 어떻게 바꾸는지 비교합니다','기본 충격: 주식 -40%, 안정자산 0%. 아래에서 가정을 바꿀 수 있습니다.')+
  '<div class="allocation-cases"><div><small>100 : 0</small><strong>3,600만원</strong><span>주식 100%</span></div><div class="focus"><small>80 : 20</small><strong>4,080만원</strong><span>교육용 기준안</span></div><div><small>60 : 40</small><strong>4,560만원</strong><span>변동 완화</span></div></div>'+
  '<div class="inputs">'+range('stocks','주식 비중',80,0,100,'%')+range('drop','주식 하락률',40,0,70,'%')+input('safe','안정자산 수익률 (%)',0,-30,10,1)+'</div><div data-output role="status"></div>';
  bind(root,()=>{const s=num(root,'stocks'),d=num(root,'drop'),sr=num(root,'safe'),v=m.stress(6000,s,-d,sr);root.querySelector('[data-output]').innerHTML='<div class="seg-bar"><span style="background:var(--blue);width:'+s+'%">주식 '+s+'%</span><span style="background:var(--slate);width:'+(100-s)+'%">안정 '+(100-s)+'%</span></div><div class="result-grid">'+card('주식 금액',money(6000*s/100))+card('충격 후 전체',money(v))+card('전체 수익률',((v/6000-1)*100).toFixed(1)+'%','','negative')+'</div>';});
}
function etfAnatomy(root){
  root.innerHTML=intro('티커를 외우기 전에 ETF를 해부합니다','ETF 이름 → 지수 → 기초자산 → 비중 → 비용·환율 순서로 읽습니다.')+
  '<div class="anatomy"><div><small>ETF</small><b>VOO</b></div><span>→</span><div><small>추종지수</small><b>S&P 500</b></div><span>→</span><div><small>기초자산</small><b>미국 대형주</b></div><span>→</span><div><small>역할</small><b>주식 성장축</b></div></div>'+
  '<div class="decision-line"><span>원칙</span><b>“무슨 ETF?”보다 “무엇에 얼마나 노출되는가?”를 먼저 묻는다.</b></div>';
  const info={VOO:['S&P 500 미국 대형주','넓은 미국 대형주 노출. 미국 한 국가와 주식시장 위험은 그대로 존재합니다.'],QQQM:['Nasdaq-100 비금융 대형기업','VOO와 다른 자산군이 아니라 주식 안에서 성장·기술주 집중도를 높이는 선택입니다.'],SGOV:['0~3개월 미국 국채','달러 단기국채 노출. 주식과 역할은 다르지만 원화 생활자금처럼 환율위험이 없는 자산은 아닙니다.']};
  const holder=document.createElement('div');root.append(holder);tabs(holder,'VOO · QQQM · SGOV 비교','이름 대신 기초자산과 역할을 비교합니다.',info);
}
function accountMap(root){
  root.innerHTML=intro('계좌는 상품이 아니라 “세금과 인출 규칙을 가진 그릇”입니다','먼저 돈을 언제 쓸지 정하고, 그 다음 계좌를 고릅니다.')+
  '<div class="account-cards"><div class="account pension"><small>연금저축</small><b>노후자금</b><p>세액공제 + 과세이연<br>투자 자유도 상대적으로 높음</p></div><div class="account irp"><small>IRP</small><b>노후 + 퇴직금</b><p>추가 공제공간<br>중도인출·위험자산 제약</p></div><div class="account isa"><small>ISA</small><b>중장기 자금</b><p>손익통산 + 비과세<br>연금보다 유동성 높음</p></div></div>'+
  '<div class="tax-flow"><div><small>① 넣을 때</small><b>공제?</b></div><span>→</span><div><small>② 굴릴 때</small><b>과세?</b></div><span>→</span><div><small>③ 꺼낼 때</small><b>세율·제약?</b></div></div>'+
  '<div class="decision-line"><span>핵심</span><b>계좌 이름보다 “넣을 때 · 굴릴 때 · 꺼낼 때”를 비교한다.</b></div>';
}
function accountQuiz(root){
  const qs=[
    ['ISA도 납입액 세액공제를 받는다.','X','현행 ISA의 핵심은 납입공제가 아니라 손익통산·비과세·초과분 저율과세입니다.'],
    ['연금저축에 600만원 넣으면 600만원을 돌려받는다.','X','600만원은 세액공제 대상 납입액 한도입니다. 실제 세금 감소액은 공제율과 결정세액에 따라 달라집니다.'],
    ['IRP에서는 주식형 위험자산을 일반적으로 100% 담을 수 있다.','X','일반적으로 위험자산 한도가 적용됩니다. 적격 TDF 등 예외는 따로 확인합니다.'],
    ['ISA에서 VOO를 직접 살 수 있다.','X','해외 거래소 상장 ETF 직접매수는 불가하고 국내 상장 해외지수 ETF 등을 활용합니다.']
  ];
  root.innerHTML=intro('자주 틀리는 문장만 빠르게 확인','버튼을 눌러 이유를 확인합니다.')+qs.map((q,i)=>'<div class="quiz"><button type="button" aria-expanded="false"><span>'+q[1]+'</span><b>'+q[0]+'</b></button><p hidden>'+q[2]+'</p></div>').join('');
  root.querySelectorAll('.quiz button').forEach(b=>b.onclick=()=>{const p=b.nextElementSibling,open=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!open));p.hidden=open;});
}
function policyDashboard(root){
  root.innerHTML=intro('공부의 마지막은 한 장의 운영규칙입니다','아래는 교육용 기준안입니다. 실제 부부 숫자로 바꾸기 전까지는 실행 권고가 아닙니다.')+
  '<div class="policy-grid"><div><small>장기 투자금</small><b>6,000만원</b></div><div><small>목표 비중</small><b>주식 80 : 안정 20</b></div><div><small>월 적립</small><b>150만원</b></div><div><small>점검</small><b>반기 · ±5%p</b></div></div>'+
  '<div class="rule-grid"><section><small>BUY</small><b>정한 날짜에 산다</b><p>시장 하락만으로 일정을 바꾸지 않습니다.</p></section><section><small>SELL</small><b>가격만으로 팔지 않는다</b><p>목적·상품구조·생계조건이 바뀌면 재검토합니다.</p></section><section><small>REBALANCE</small><b>전체 계좌를 합산한다</b><p>새 납입으로 먼저 부족 자산을 채웁니다.</p></section></div>'+
  '<div class="inputs">'+input('stockValue','현재 주식 평가액 (만원)',5280,0,1000000)+input('safeValue','현재 안정자산 평가액 (만원)',720,0,1000000)+'</div><div class="info-box" role="status" data-rebalance></div>';
  bind(root,()=>{const s=num(root,'stockValue'),a=num(root,'safeValue'),total=s+a,ratio=total?s/total*100:0,shift=s-total*.8;root.querySelector('[data-rebalance]').textContent=total===0?'평가액이 0원입니다.':('현재 주식 '+ratio.toFixed(1)+'% · 목표와 '+(ratio-80).toFixed(1)+'%p 차이. '+(Math.abs(ratio-80)>=5?'조정 검토 대상입니다.':'교육용 기준 범위 안입니다.')+' 80:20을 맞추려면 주식 '+(shift>=0?'감축 ':'증액 ')+money(Math.abs(shift))+' 수준입니다. 실제로는 새 납입을 먼저 활용합니다.');});
}
function isa(root){root.innerHTML=intro('ISA 과세대상 순이익 정산','세법상 손익통산을 마친 과세대상 순이익이라는 단순 가정입니다.')+'<div class="inputs">'+input('profit','과세대상 순이익 (만원)',500,-10000,1000000)+'<label>가입유형<select name="allowance"><option value="200">일반형 · 200만원</option><option value="400">서민·농어민형 · 400만원</option></select></label></div><div data-output role="status"></div>';bind(root,()=>{const p=num(root,'profit'),a=num(root,'allowance'),tax=m.isaTax(p,a);root.querySelector('[data-output]').innerHTML='<div class="result-grid">'+card('비과세 적용',money(Math.min(a,Math.max(p,0))))+card('과세할 순이익',money(Math.max(0,p-a)))+card('계산상 세금',tax.toLocaleString('ko-KR')+'만원','지방소득세 포함 9.9%')+'</div>';});}
function pension(root){root.innerHTML=intro('연금계좌 공제 대상과 혜택','근로소득만 있는 1인 사례 · 납부할 세금이 충분하다는 가정')+'<div class="inputs">'+input('salary','본인 총급여 (만원)',5000,0,1000000)+input('pension','연금저축 연 납입 (만원)',600,0,1800)+input('irp','IRP 등 개인 추가납입 (만원)',300,0,1800)+'</div><div data-output role="status"></div>';bind(root,()=>{const s=num(root,'salary'),p=num(root,'pension'),i=num(root,'irp');if(p+i>1800){root.querySelector('[data-output]').innerHTML='<p class="widget-error">기본 연간 개인 납입한도 1,800만원을 초과했습니다.</p>';return;}const base=Math.min(900,Math.min(p,600)+i);root.querySelector('[data-output]').innerHTML='<div class="result-grid">'+card('공제 대상 납입금',money(base))+card('공제율',s<=5500?'16.5%':'13.2%','지방소득세 포함')+card('계산상 최대 혜택',m.pensionCredit(p,i,s).toLocaleString('ko-KR')+'만원')+'</div>';});}
function irp(root){root.innerHTML=intro('IRP 위험자산 한도를 실제 잔액으로 확인','1인 계좌의 단순 교육용 모형입니다.')+'<div class="inputs">'+input('irpStock','현재 위험자산 (만원)',77,0,1000000)+input('irpSafe','현재 적격 안정자산 (만원)',30,0,1000000)+input('irpMonthly','이번 추가 납입 (만원)',25,0,1000)+'</div><div class="result-grid" role="status" data-allowance></div>';bind(root,()=>{const s=num(root,'irpStock'),a=num(root,'irpSafe'),cash=num(root,'irpMonthly'),v=m.irpPurchase(s,a,cash);root.querySelector('[data-allowance]').innerHTML=card('위험자산 추가매수',v.stock.toFixed(1)+'만원')+card('적격 안정자산',v.safe.toFixed(1)+'만원')+card('추가 후 위험비중',((s+a+cash)?(s+v.stock)/(s+a+cash)*100:0).toFixed(1)+'%');});}
function taxLocation(root){root.innerHTML=intro('같은 미국 주식 노출, 다른 투자 경로','상장 장소·계좌·상품구조가 과세를 바꿉니다.')+'<div class="route-grid"><div class="route-card"><small>경로 A</small><strong>일반계좌 → 미국 상장 ETF</strong><p>해외주식 과세체계와 배당 과세를 확인합니다.</p></div><div class="route-card"><small>경로 B</small><strong>ISA → 국내 상장 해외지수 ETF</strong><p>ISA의 계좌 과세체계와 상품구조를 함께 봅니다.</p></div></div>';}
function filter(root){root.innerHTML=intro('새 주제를 30초 안에 분류','투자결정·세금·비용·위험·계좌 선택을 바꾸지 않는다면 뒤로 미룹니다.')+'<div class="rule-grid"><section><b>결정에 영향?</b><p>자산배분·계좌·상품을 바꾸나?</p></section><section><b>비용·위험 감소?</b><p>세금이나 손실구조가 달라지나?</p></section><section><b>지금 필요한가?</b><p>곧 실행할 거래가 있나?</p></section></div>';}
function buckets(root){moneyStory(root);}
function drawdown(root){riskLab(root);}
function allocation(root){allocationLab(root);}
function etf(root){etfAnatomy(root);}
function accounts(root){accountMap(root);}
function policy(root){policyDashboard(root);}
const renderers={roadmap,'money-story':moneyStory,'horizon-timeline':horizonTimeline,compound,'risk-lab':riskLab,'allocation-lab':allocationLab,'etf-anatomy':etfAnatomy,'account-map':accountMap,'account-quiz':accountQuiz,'policy-dashboard':policyDashboard,buckets,drawdown,allocation,etf,accounts,isa,pension,irp,'tax-location':taxLocation,policy,filter};
return {hydrate(article){article.querySelectorAll('[data-widget]').forEach(root=>{const render=renderers[root.dataset.widget];if(render)render(root);});}};
})();
