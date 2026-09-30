const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../src/index.html'),'utf8');
const ids=['overview','tax','pension','irp','isa','compare','compound','bridge','purpose','priority','couple','portfolio','mistakes','early','withdraw','faq','summary','onepage','sources'];
test('좌측 메뉴는 19개 교과서 섹션만 가진다',()=>{
  const links=[...html.matchAll(/<a class="tree-link sub" href="#([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(links,ids);
});
test('빈 과거 카테고리 메뉴를 제거했다',()=>{
  for(const name of ['투자<span class="tree-empty">0','은퇴<span class="tree-empty">0','세금<span class="tree-empty">0','우리집 자산계획<span class="tree-empty">0']) assert.equal(html.includes(name),false);
});
