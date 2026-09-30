const {test}=require('node:test');
const assert=require('node:assert/strict');
let m; try {m=require('../assets/math.js');} catch {m={};}
test('월말 적립 원금과 0% 결과를 중복 없이 계산',()=>{assert.equal(typeof m.project,'function');assert.equal(m.project(6000,150,10,0).value,24000);assert.equal(m.project(6000,150,10,0).principal,24000);});
test('연 유효수익률 100%의 1년 목돈은 정확히 2배',()=>{assert.equal(typeof m.project,'function');assert.ok(Math.abs(m.project(100,0,1,100).value-200)<1e-8);});
test('월말 납입은 마지막 납입에 이자를 붙이지 않음',()=>{assert.equal(typeof m.project,'function');assert.ok(Math.abs(m.project(0,100,1/12,12).value-100)<1e-8);});
test('음수 수익률과 물가를 반영',()=>{assert.equal(typeof m.project,'function');assert.ok(Math.abs(m.project(100,0,1,-50,0).value-50)<1e-8);assert.ok(Math.abs(m.project(100,0,1,10,10).real-100)<1e-8);});
test('유효하지 않은 기간과 원금은 거부',()=>{assert.equal(typeof m.project,'function');assert.throws(()=>m.project(-1,10,2,5),RangeError);assert.throws(()=>m.project(100,10,1,-100),RangeError);});
test('40% 하락은 회복에 66.67%가 필요',()=>{assert.equal(typeof m.recovery,'function');assert.ok(Math.abs(m.recovery(40)-66.6666666667)<1e-7);});
test('80:20 배분에서 주식 -40%와 안정자산 -10%를 모두 반영',()=>{assert.equal(typeof m.stress,'function');assert.ok(Math.abs(m.stress(6000,80,-40,-10)-3960)<1e-8);});
test('ISA 비과세는 순이익에 한 번 적용, 손실에는 0',()=>{assert.equal(typeof m.isaTax,'function');assert.equal(m.isaTax(500,200),29.7);assert.equal(m.isaTax(-100,200),0);assert.equal(m.isaTax(500,400),9.9);});
test('연금저축 600·합계 900 한도와 소득별 공제',()=>{assert.equal(typeof m.pensionCredit,'function');assert.equal(m.pensionCredit(700,300,5500),148.5);assert.equal(m.pensionCredit(600,300,5501),118.8);assert.equal(m.pensionCredit(600,0,5500),99);});
test('IRP 주식 상승 후 계좌 전체 70%를 넘지 않는 추가매수금 계산',()=>{assert.equal(typeof m.irpPurchase,'function');const x=m.irpPurchase(77,30,25);assert.ok(Math.abs(x.stock-15.4)<1e-8);assert.ok(Math.abs(x.safe-9.6)<1e-8);assert.ok((77+x.stock)/132<=.7+1e-12);});
test('IRP 초과비중을 신규자금만으로 복원할 수 없으면 위험자산을 추가하지 않음',()=>{assert.equal(typeof m.irpPurchase,'function');assert.equal(m.irpPurchase(100,0,25).stock,0);assert.equal(m.irpPurchase(100,0,25).safe,25);});
