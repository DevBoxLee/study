(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FinanceCatalog=api;})(globalThis,function(){
function sequence(lessons){const out=[];function visit(parent){for(const lesson of lessons.filter(x=>(x.parent||'')===parent)){out.push(lesson);visit(lesson.id);}}visit('');return out;}
return {sequence};
});
