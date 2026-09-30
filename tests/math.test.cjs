const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../src/index.html'),'utf8');
test('원본 숫자 예제와 계산 요소를 보존',()=>{
  for(const s of ['49.5만원','118.8만원','138.6만원','1,891만원','7,249만원','396만원','577.5만원','1,650만원','총 550만원']) assert.ok(html.includes(s),s);
});
test('인터랙티브 계산기와 과세이연 그래프를 보존',()=>{
  for(const id of ['ps','irpIn','rate','taxLeft','calcResult','deferChart']) assert.ok(html.includes('id="'+id+'"'),id);
});
