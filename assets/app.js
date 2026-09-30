'use strict';
(function(){
const lessons=JSON.parse(document.getElementById('lesson-data').textContent);
const byId=new Map(lessons.map(x=>[x.id,x]));
const essentials=lessons.filter(x=>x.classification==='필수');
const $=id=>document.getElementById(id);
let current,completed={};
try{
  const raw=localStorage.getItem('finance-study-v2')||localStorage.getItem('finance-study-v1')||'{}';
  const state=JSON.parse(raw);
  if(state&&typeof state==='object'&&!Array.isArray(state))completed=state;
}catch{}
function closeMenu(){ $('sidebar').classList.remove('open');$('scrim').hidden=true;$('menu').setAttribute('aria-expanded','false');document.body.classList.remove('menu-open'); }
function navLink(x,child=false){
  const a=document.createElement('a');a.href='#'+x.id;
  a.className='nav-link'+(child?' child':'')+(current&&current.id===x.id?' active':'');
  a.setAttribute('aria-current',current&&current.id===x.id?'page':'false');
  const text=document.createElement('span');text.textContent=x.title;a.append(text);
  if(completed[x.id]){const check=document.createElement('span');check.className='done';check.textContent='✓';check.setAttribute('aria-label','학습 완료');a.append(check);}
  return a;
}
function nav(){
  const query=$('search').value.trim().toLocaleLowerCase('ko');
  const tree=$('tree');tree.replaceChildren();
  if(query){
    const hits=lessons.filter(x=>(x.title+' '+x.summary+' '+x.search).toLocaleLowerCase('ko').includes(query));
    $('search-status').textContent=hits.length?hits.length+'개 페이지에서 찾았어요':'검색 결과가 없습니다.';
    hits.forEach(x=>tree.append(navLink(x)));
  }else{
    $('search-status').textContent='';
    let phase;
    for(const x of lessons.filter(x=>!x.parent)){
      if(x.phase!==phase){
        const d=document.createElement('div');d.className='phase-label';
        d.textContent=x.phase==='투자설계'?'01 · 투자설계':x.phase==='투자수단'?'02 · 투자수단':x.phase==='실행'?'03 · 실행':x.phase==='보관'?'필요할 때':'START';
        tree.append(d);phase=x.phase;
      }
      tree.append(navLink(x));
      lessons.filter(c=>c.parent===x.id).forEach(c=>tree.append(navLink(c,true)));
    }
  }
  const done=essentials.filter(x=>completed[x.id]).length;
  $('progress-text').textContent=done+' / '+essentials.length;$('progress').max=essentials.length;$('progress').value=done;
}
function questions(x){
  const box=$('question-box'),target=$('lesson-questions');
  target.replaceChildren();
  const list=(x.questions||'').split('|').map(v=>v.trim()).filter(Boolean);
  box.hidden=!list.length;
  list.forEach((q,i)=>{const span=document.createElement('span');span.textContent=(i+1)+'. '+q;target.append(span);});
}
function route(){
  let id=location.hash.slice(1).split('/')[0];try{id=decodeURIComponent(id);}catch{}
  const x=byId.get(id)||lessons[0];current=x;
  document.body.dataset.experience=x.experience||'guide';
  $('breadcrumb').textContent='우리집 금융공부 / '+x.phase;
  $('read-time').textContent=(x.minutes||8)+'분';
  $('lesson-tag').textContent=x.classification+' · '+x.phase.toUpperCase();
  $('lesson-title').textContent=x.title;$('lesson-summary').textContent=x.summary;
  $('experience-label').textContent='학습 방식 · '+(x.experience||'guide');
  $('updated').textContent='확인 '+x.updated.replaceAll('-','.');
  questions(x);document.title=x.title+' | 우리집 금융공부';$('article').innerHTML=x.body;
  $('toc').replaceChildren();
  $('article').querySelectorAll('h2').forEach(h=>{
    const a=document.createElement('a');a.href='#'+x.id+'/'+h.id;a.textContent=h.textContent;
    a.onclick=e=>{e.preventDefault();history.replaceState(null,'',a.href);h.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
    $('toc').append(a);
  });
  window.FinanceWidgets.hydrate($('article'));
  $('complete').checked=!!completed[x.id];$('download').href='notes/'+x.id+'.md';
  const sequence=window.FinanceCatalog.sequence(lessons),i=sequence.indexOf(x);
  for(const [which,item,label] of [['prev',sequence[i-1],'이전'],['next',sequence[i+1],'다음']]){
    const a=$(which);a.replaceChildren();
    if(item){a.hidden=false;a.href='#'+item.id;const s=document.createElement('small');s.textContent=label;a.append(s,document.createTextNode((which==='prev'?'← ':'')+item.title+(which==='next'?' →':'')));}
    else{a.hidden=true;a.removeAttribute('href');}
  }
  nav();closeMenu();
  const anchor=location.hash.split('/')[1];
  if(anchor){const el=$('article').querySelector('[id="'+anchor.replace(/[^a-z0-9-]/g,'')+'"]');if(el)el.scrollIntoView();}
  else window.scrollTo({top:0,behavior:'instant'});
}
function updateReadingProgress(){
  const h=document.documentElement,den=h.scrollHeight-h.clientHeight;
  $('reading-progress').style.width=(den>0?Math.min(100,h.scrollTop/den*100):0)+'%';
}
document.querySelector('.skip').onclick=e=>{e.preventDefault();$('main').focus();$('main').scrollIntoView();};
$('complete').onchange=()=>{completed[current.id]=$('complete').checked;try{localStorage.setItem('finance-study-v2',JSON.stringify(completed));}catch{}nav();};
$('search').oninput=nav;$('print').onclick=()=>window.print();
$('menu').onclick=()=>{const open=!$('sidebar').classList.contains('open');$('sidebar').classList.toggle('open',open);$('scrim').hidden=!open;$('menu').setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);if(open)$('search').focus();};
$('scrim').onclick=closeMenu;
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();$('menu').focus();}if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();if(innerWidth<=900&&!$('sidebar').classList.contains('open'))$('menu').click();$('search').focus();}});
window.addEventListener('scroll',updateReadingProgress,{passive:true});
window.addEventListener('hashchange',route);route();updateReadingProgress();
})();
