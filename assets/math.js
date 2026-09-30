(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FinanceMath=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function project(initial,monthly,years,annual,inflation=0){
 const values=[initial,monthly,years,annual,inflation];
 if(!values.every(Number.isFinite)||initial<0||monthly<0||years<0||years>60||annual<=-100||inflation<=-100)throw new RangeError('계산 입력 범위를 확인하세요.');
 const n=Math.round(years*12),r=Math.expm1(Math.log1p(annual/100)/12);
 const growth=Math.pow(1+r,n);
 const value=initial*growth+monthly*(r===0?n:Math.expm1(n*Math.log1p(r))/r);
 return {value,principal:initial+monthly*n,real:value/Math.pow(1+inflation/100,n/12)};
}
function recovery(drop){if(!Number.isFinite(drop)||drop<0||drop>=100)throw new RangeError('하락률');return drop/(100-drop)*100;}
function stress(initial,stocks,stockReturn,safeReturn){return initial*(stocks/100*(1+stockReturn/100)+(1-stocks/100)*(1+safeReturn/100));}
function isaTax(profit,allowance){return Math.round(Math.max(0,profit-allowance)*.099*100)/100;}
function pensionCredit(pension,irp,salary){const base=Math.min(900,Math.min(600,Math.max(0,pension))+Math.max(0,irp));return Math.round(base*(salary<=5500?.165:.132)*100)/100;}
return {project,recovery,stress,isaTax,pensionCredit};
});
