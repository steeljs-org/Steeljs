var a = steel.fixUrl('./enterprise/js/pl/a.js','js');
console.log(1, a);
var b = steel.res;
console.log(2, b);
b.js('open/analytics/js/suda.js', function(){console.log('success');}, function(){console.log('error');});