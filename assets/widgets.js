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
function taxBasics(root){
  root.innerHTML=intro('세금 용어 6개만 먼저 구분합니다','같은 “절세”라도 혜택이 생기는 단계가 다릅니다.')+
  '<div class="concept-grid">'+[
    ['세액공제','계산된 세금에서 직접 차감','연금계좌'],
    ['소득공제','세율 적용 전 과세표준을 감소','다른 공제제도'],
    ['비과세','정해진 범위의 소득에 세금 없음','ISA'],
    ['분리과세','다른 종합소득과 별도로 계산','ISA 초과분'],
    ['과세이연','세금 납부시점을 뒤로 미룸','연금계좌'],
    ['손익통산','인정되는 이익과 손실을 합산','ISA']
  ].map(x=>'<section><small>'+x[2]+'</small><b>'+x[0]+'</b><p>'+x[1]+'</p></section>').join('')+'</div>'+
  '<div class="tax-pipe"><span>연간소득</span><i>→</i><span>소득공제</span><i>→</i><span>과세표준</span><i>→</i><span>산출세액</span><i>→</i><strong>연금계좌 세액공제</strong><i>→</i><span>결정세액</span></div>';
}
function isaBridge(root){
  root.innerHTML=intro('ISA 만기자금을 연금으로 옮기면?','만기일로부터 60일 이내 전환 · 추가 공제대상 한도는 전환액의 10%, 최대 300만원')+
  '<div class="bridge-flow"><span>ISA 투자</span><i>→</i><span>3년+ 유지</span><i>→</i><strong>만기</strong><i>→</i><span>필요자금 사용</span><b>또는</b><span>연금계좌 이전</span></div>'+
  '<div class="inputs">'+input('transfer','ISA 연금전환액 (만원)',3000,0,100000)+
  '<label>공제율 체감 예시<select name="bridgeRate"><option value="0.165">16.5%</option><option value="0.132">13.2%</option></select></label></div>'+
  '<div class="result-grid" data-bridge role="status"></div><p class="caption">세액공제를 흡수할 결정세액이 충분하다는 교육용 계산입니다.</p>';
  bind(root,()=>{const t=num(root,'transfer'),r=num(root,'bridgeRate'),base=Math.min(300,t*.1);root.querySelector('[data-bridge]').innerHTML=card('추가 공제대상 한도',money(base))+card('계산상 세금감소',money(base*r),'지방소득세 효과 포함 체감률 예시')+card('전환기한','만기 후 60일 이내');});
}
function accountPriority(root){
  const info={
    '노후준비':['비상금 → 연금저축 → IRP → ISA','노후까지 유지할 수 있는 돈에 세액공제와 과세이연을 집중합니다.'],
    '3~5년 목돈':['비상금 → ISA·안전자산 → 연금저축 소액','주택·차량처럼 사용시점이 가까운 돈은 유동성을 먼저 확보합니다.'],
    '연말정산':['결정세액 확인 → 연금저축 600 → IRP 포함 900','공제율보다 실제 공제를 흡수할 세금이 있는지를 먼저 봅니다.'],
    '사회초년생':['비상금 → ISA + 연금저축 분할','IRP의 강한 잠금효과는 현금흐름이 안정된 뒤 검토합니다.'],
    'ETF 운용':['연금저축 + ISA 중심 → IRP는 규제 반영','운용자유도와 IRP 위험자산 70% 제한을 함께 봅니다.'],
    '중도사용 가능성':['일반 유동계좌·ISA 우선','연금에는 정말 노후까지 안 써도 되는 금액만 넣습니다.']
  };
  tabs(root,'상황에 따라 우선순위가 달라집니다','한 가지 정답 순서는 없습니다.',info);
}
function earlyWithdrawal(root){
  root.innerHTML=intro('35세에 넣고 40세에 전액 인출한다면?','세액공제만 보고 가까운 목적자금을 연금에 넣었을 때의 교육용 단순 시나리오')+
  '<div class="split-scenario"><section class="bad"><small>연금저축</small><b>공제효과 396만원</b><p>600만원 × 5년, 13.2% 체감 가정</p><strong>연금외수령 세금 577.5만원</strong><p>3,500만원 × 16.5% 단순가정</p></section><section class="good"><small>ISA 비교</small><b>가입 때 세액공제 없음</b><p>같은 3,000만원이 3,500만원이 됐다고 단순화</p><strong>일반형 세금 29.7만원</strong><p>(500-200) × 9.9%</p></section></div>'+
  '<div class="decision-line"><span>결론</span><b>세율보다 먼저 돈의 사용시점과 유동성을 맞춘다.</b></div>';
}
function pensionWithdrawal(root){
  root.innerHTML=intro('연금은 받을 때도 설계합니다','개인연금과 퇴직금 재원의 세금 구조는 서로 다릅니다.')+
  '<div class="rate-ladder"><div><small>개인연금</small><b>70세 미만</b><strong>5%</strong></div><div><small>개인연금</small><b>70~79세</b><strong>4%</strong></div><div><small>개인연금</small><b>80세 이상</b><strong>3%</strong></div></div>'+
  '<div class="rate-ladder pension-years"><div><small>퇴직금 연금수령</small><b>1~10년</b><strong>70%</strong></div><div><small>퇴직금 연금수령</small><b>11~20년</b><strong>60%</strong></div><div><small>퇴직금 연금수령</small><b>20년 초과</b><strong>50%</strong></div></div>'+
  '<p class="caption">위 %는 개인연금은 소득세 원천징수율, 퇴직금은 일시금 기준 퇴직소득세 대비 적용 수준입니다. 지방소득세·다른 연금소득·수령한도는 별도 확인합니다.</p>';
}
function accountQuiz(root){
  const qs=[
    ['연금저축에 돈만 넣으면 알아서 투자된다.','입금과 투자는 별개입니다. 연금저축펀드라면 ETF·펀드 등을 직접 선택하거나 자동매수 기능을 설정해야 실제 투자가 시작됩니다.','연금저축은 ‘계좌’라는 그릇이지 자동투자 상품 자체가 아니기 때문입니다.'],
    ['IRP와 연금저축은 사실상 같은 계좌다.','둘 다 세법상 연금계좌지만 IRP는 퇴직금 수령 기능, 법정 중도인출 제한, 위험자산 70% 한도 등 제약이 더 큽니다.','IRP는 노후자금 보호와 퇴직급여 관리 기능까지 함께 맡기 때문입니다.'],
    ['ISA도 납입액에 대해 연말정산 세액공제를 받는다.','현행 ISA는 납입액 세액공제 계좌가 아닙니다. 손익통산, 비과세, 초과분 저율 분리과세가 핵심입니다.','연금계좌와 ISA는 세제혜택이 발생하는 ‘단계’가 다릅니다.'],
    ['연금저축에 넣으면 55세 전에는 절대 돈을 꺼낼 수 없다.','연금저축은 중도인출이 가능하지만 세액공제 받은 원금과 운용수익에는 연금외수령 과세가 발생할 수 있습니다.','인출 가능 여부와 세금상 유리한 인출은 다른 문제입니다.'],
    ['55세가 되면 연금저축·IRP를 무조건 전액 인출해야 한다.','55세는 연금개시가 가능한 나이일 뿐입니다. 연금수령한도와 수령기간을 설계해 나눠 받을 수 있습니다.','연금계좌는 ‘받는 방식’에 따라 세금이 달라집니다.'],
    ['연금저축 세액공제 한도 600만원이면 세금 600만원을 돌려받는다.','600만원은 세액공제 ‘대상 납입액’ 한도입니다. 여기에 소득세 공제율 12% 또는 15%를 적용합니다.','세액공제 대상 금액과 실제 세금 감소액을 구분해야 합니다.'],
    ['IRP에서는 주식형 ETF를 100% 담을 수 있다.','일반적으로 위험자산은 전체 적립금의 70%까지입니다. 적격 TDF 등 일부 예외 운용방법은 70% 한도에서 제외될 수 있습니다.','퇴직연금은 노후자산 보호를 위해 위험자산 한도를 둡니다.'],
    ['ISA에서 VOO·QQQ를 직접 매수할 수 있다.','해외 거래소 상장 주식·ETF 직접매수는 불가합니다. 대신 국내 상장 S&P500·나스닥100 추종 ETF를 활용할 수 있습니다.','ISA 투자대상은 법률상 국내 금융상품 범위로 제한됩니다.'],
    ['ISA에서 손실이 나도 세금 혜택을 무조건 받는다.','줄일 과세소득이 없다면 비과세·저율과세 혜택의 체감도 없습니다.','절세는 발생한 과세대상 소득이 있을 때 의미가 있습니다.'],
    ['ISA는 3년 동안 한 푼도 뺄 수 없다.','납입원금 범위에서 중도인출이 가능합니다.','‘3년 의무가입기간’과 ‘중도인출 가능 여부’는 별개의 개념입니다.'],
    ['ISA에서 돈을 빼면 그 금액만큼 납입한도가 다시 생긴다.','중도인출 금액만큼 납입한도는 복원되지 않습니다.','인출은 과거 납입실적을 지우지 않습니다.'],
    ['연금저축·IRP는 세액공제 한도까지만 돈을 넣을 수 있다.','일반 개인 납입한도는 연금계좌 합계 연 1,800만원이고, 세액공제 대상은 별도의 600/900만원 구조입니다.','납입한도와 세액공제한도는 서로 다른 제도입니다.'],
    ['세액공제를 안 받은 연금저축 원금도 중도인출하면 무조건 16.5% 세금이다.','세액공제를 받지 않았음이 확인된 과세제외 원금은 인출순서상 먼저 빠져나가며 과세제외될 수 있습니다.','국세청은 연금계좌 재원을 과세제외금액 → 이연퇴직소득 → 과세금액 순으로 구분합니다.'],
    ['부부라면 한 사람에게 연금계좌 납입을 몰아주는 것이 항상 유리하다.','각자의 공제율, 결정세액, 기존 공제, 현금흐름을 따로 계산해야 합니다.','연금계좌 세액공제는 부부 합산이 아니라 개인별 과세입니다.'],
    ['연금계좌는 세금이 전혀 없는 계좌다.','핵심은 면세가 아니라 과세이연입니다. 세액공제 받은 원금과 운용수익은 연금수령 시 과세됩니다.','‘언제 내느냐’가 바뀌고, 조건을 지키면 세율도 낮아질 수 있습니다.'],
    ['ISA 3년이 지나면 무조건 계좌를 닫아야 한다.','3년은 세제특례를 위한 핵심 최소 계약기간입니다. 실제 만기·연장·해지·재가입은 금융회사 계약과 자금계획을 함께 봅니다.','계약기간과 자금사용 계획이 다를 수 있기 때문입니다.']
  ];
  root.innerHTML=intro('원본 O/X 16문항','각 문항을 “실제 구조”와 “왜 그런가” 두 단계로 확인합니다.')+
    qs.map(q=>'<div class="quiz"><button type="button" aria-expanded="false"><span>X</span><b>'+q[0]+'</b></button><div class="quiz-detail" hidden><p><strong>✅ 실제</strong> '+q[1]+'</p><p><strong>💡 왜 그런가</strong> '+q[2]+'</p></div></div>').join('');
  root.querySelectorAll('.quiz button').forEach(b=>b.onclick=()=>{const d=b.nextElementSibling,open=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!open));d.hidden=open;});
}

function taxCompoundCompare(root){
  const rows=[
    {y:10,defer:1967,annual:1778,isa:1891,pension:1914},
    {y:20,defer:3870,annual:3160,isa:3605,pension:3712},
    {y:30,defer:7612,annual:5618,isa:6977,pension:7249}
  ];
  root.innerHTML=intro('과세이연의 힘','원금 1,000만원 · 연 7% · 원본 index.html의 10/20/30년 교육용 단순모형')+
    '<div class="tax-compare-grid">'+rows.map(r=>'<section><small>'+r.y+'년</small><div>'+bar('과세이연',money(r.defer),r.defer/80) + bar('매년 15.4%',money(r.annual),r.annual/80,'red') + bar('ISA 일반형',money(r.isa),r.isa/80) + bar('연금 5.5%',money(r.pension),r.pension/80)+'</div></section>').join('')+'</div>'+
    '<p class="caption">ISA·연금 수치는 원본의 단순 세후 가정이며 실제 상품별 과세와 수익률을 보장하지 않습니다.</p>';
}
function policyDashboard(root){
  root.innerHTML=intro('공부의 마지막은 한 장의 운영규칙입니다','아래는 교육용 기준안입니다. 실제 부부 숫자로 바꾸기 전까지는 실행 권고가 아닙니다.')+
  '<div class="policy-grid"><div><small>장기 투자금</small><b>6,000만원</b></div><div><small>목표 비중</small><b>주식 80 : 안정 20</b></div><div><small>월 적립</small><b>150만원</b></div><div><small>점검</small><b>반기 · ±5%p</b></div></div>'+
  '<div class="rule-grid"><section><small>BUY</small><b>정한 날짜에 산다</b><p>시장 하락만으로 일정을 바꾸지 않습니다.</p></section><section><small>SELL</small><b>가격만으로 팔지 않는다</b><p>목적·상품구조·생계조건이 바뀌면 재검토합니다.</p></section><section><small>REBALANCE</small><b>전체 계좌를 합산한다</b><p>새 납입으로 먼저 부족 자산을 채웁니다.</p></section></div>'+
  '<div class="inputs">'+input('stockValue','현재 주식 평가액 (만원)',5280,0,1000000)+input('safeValue','현재 안정자산 평가액 (만원)',720,0,1000000)+'</div><div class="info-box" role="status" data-rebalance></div>';
  bind(root,()=>{const s=num(root,'stockValue'),a=num(root,'safeValue'),total=s+a,ratio=total?s/total*100:0,shift=s-total*.8;root.querySelector('[data-rebalance]').textContent=total===0?'평가액이 0원입니다.':('현재 주식 '+ratio.toFixed(1)+'% · 목표와 '+(ratio-80).toFixed(1)+'%p 차이. '+(Math.abs(ratio-80)>=5?'조정 검토 대상입니다.':'교육용 기준 범위 안입니다.')+' 80:20을 맞추려면 주식 '+(shift>=0?'감축 ':'증액 ')+money(Math.abs(shift))+' 수준입니다. 실제로는 새 납입을 먼저 활용합니다.');});
}
function isa(root){root.innerHTML=intro('ISA 과세대상 순이익 정산','세법상 손익통산을 마친 과세대상 순이익이라는 단순 가정입니다.')+'<div class="inputs">'+input('profit','과세대상 순이익 (만원)',500,-10000,1000000)+'<label>가입유형<select name="allowance"><option value="200">일반형 · 200만원</option><option value="400">서민·농어민형 · 400만원</option></select></label></div><div data-output role="status"></div>';bind(root,()=>{const p=num(root,'profit'),a=num(root,'allowance'),tax=m.isaTax(p,a);root.querySelector('[data-output]').innerHTML='<div class="result-grid">'+card('비과세 적용',money(Math.min(a,Math.max(p,0))))+card('과세할 순이익',money(Math.max(0,p-a)))+card('계산상 세금',tax.toLocaleString('ko-KR')+'만원','지방소득세 포함 9.9%')+'</div>';});}
function pension(root){
  root.innerHTML=intro('인터랙티브 계산기 · 연금계좌 세액공제','원본 index.html의 계산항목을 그대로 반영합니다.')+
  '<div class="inputs">'+
  input('pension','연금저축 납입액 (만원)',600,0,1800)+
  input('irp','IRP 개인납입액 (만원)',300,0,1800)+
  '<label>공제율 구간<select name="pensionRate"><option value="0.165">총급여 5,500만원 이하 등 · 체감 16.5%</option><option value="0.132">그 초과 · 체감 13.2%</option></select></label>'+
  input('taxLeft','공제 전 남은 세액 (만원)',200,0,1000000)+
  '</div><div data-output role="status"></div>'+
  '<p class="caption">실제 연말정산은 다른 세액공제, 원천징수액, 지방소득세 정산에 따라 달라집니다. 법률상 소득세 공제율은 15% 또는 12%입니다.</p>';
  bind(root,()=>{
    const p=num(root,'pension'),i=num(root,'irp'),rate=num(root,'pensionRate'),taxLeft=num(root,'taxLeft');
    if(p+i>1800){root.querySelector('[data-output]').innerHTML='<p class="widget-error">기본 연간 개인 납입한도 1,800만원을 초과했습니다.</p>';return;}
    const base=Math.min(900,Math.min(p,600)+i),gross=base*rate,usable=Math.min(gross,taxLeft);
    root.querySelector('[data-output]').innerHTML='<div class="result-grid">'+
      card('공제 대상 납입금',money(base))+
      card('계산상 공제효과',money(gross),'공제율 '+(rate*100).toFixed(1)+'% 체감 예시')+
      card('남은 세액 반영 후',money(usable),'공제 전 남은 세액 범위 안')+
    '</div>';
  });
}
function irp(root){root.innerHTML=intro('IRP 위험자산 한도를 실제 잔액으로 확인','1인 계좌의 단순 교육용 모형입니다.')+'<div class="inputs">'+input('irpStock','현재 위험자산 (만원)',77,0,1000000)+input('irpSafe','현재 적격 안정자산 (만원)',30,0,1000000)+input('irpMonthly','이번 추가 납입 (만원)',25,0,1000)+'</div><div class="result-grid" role="status" data-allowance></div>';bind(root,()=>{const s=num(root,'irpStock'),a=num(root,'irpSafe'),cash=num(root,'irpMonthly'),v=m.irpPurchase(s,a,cash);root.querySelector('[data-allowance]').innerHTML=card('위험자산 추가매수',v.stock.toFixed(1)+'만원')+card('적격 안정자산',v.safe.toFixed(1)+'만원')+card('추가 후 위험비중',((s+a+cash)?(s+v.stock)/(s+a+cash)*100:0).toFixed(1)+'%');});}
function taxLocation(root){root.innerHTML=intro('같은 미국 주식 노출, 다른 투자 경로','상장 장소·계좌·상품구조가 과세를 바꿉니다.')+'<div class="route-grid"><div class="route-card"><small>경로 A</small><strong>일반계좌 → 미국 상장 ETF</strong><p>해외주식 과세체계와 배당 과세를 확인합니다.</p></div><div class="route-card"><small>경로 B</small><strong>ISA → 국내 상장 해외지수 ETF</strong><p>ISA의 계좌 과세체계와 상품구조를 함께 봅니다.</p></div></div>';}
function filter(root){root.innerHTML=intro('새 주제를 30초 안에 분류','투자결정·세금·비용·위험·계좌 선택을 바꾸지 않는다면 뒤로 미룹니다.')+'<div class="rule-grid"><section><b>결정에 영향?</b><p>자산배분·계좌·상품을 바꾸나?</p></section><section><b>비용·위험 감소?</b><p>세금이나 손실구조가 달라지나?</p></section><section><b>지금 필요한가?</b><p>곧 실행할 거래가 있나?</p></section></div>';}
function buckets(root){moneyStory(root);}
function drawdown(root){riskLab(root);}
function allocation(root){allocationLab(root);}
function etf(root){etfAnatomy(root);}
function accounts(root){accountMap(root);}
function policy(root){policyDashboard(root);}
const renderers={roadmap,'money-story':moneyStory,'horizon-timeline':horizonTimeline,compound,'risk-lab':riskLab,'allocation-lab':allocationLab,'etf-anatomy':etfAnatomy,'account-map':accountMap,'account-quiz':accountQuiz,'tax-basics':taxBasics,'isa-bridge':isaBridge,'account-priority':accountPriority,'early-withdrawal':earlyWithdrawal,'pension-withdrawal':pensionWithdrawal,'tax-compound-compare':taxCompoundCompare,'policy-dashboard':policyDashboard,buckets,drawdown,allocation,etf,accounts,isa,pension,irp,'tax-location':taxLocation,policy,filter};
return {hydrate(article){article.querySelectorAll('[data-widget]').forEach(root=>{const render=renderers[root.dataset.widget];if(render)render(root);});}};
})();
