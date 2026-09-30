const {test}=require('node:test');const assert=require('node:assert/strict');const c=require('../assets/catalog.js');
test('19개 절세계좌 섹션은 번호순으로 이동한다',()=>{
 const names=['overview','tax','pension','irp','isa','compare','compound','bridge','purpose','priority','couple','portfolio','mistakes','early','withdraw','faq','summary','onepage','sources'];
 const pages=names.map((name,i)=>({id:String(i+1).padStart(2,'0')+'-'+name,parent:''}));
 assert.deepEqual(c.sequence(pages).map(x=>x.id),pages.map(x=>x.id));
});
