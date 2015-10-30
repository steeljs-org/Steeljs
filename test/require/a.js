

steel.d('bddd/sfs', ['c'], function(require, exports, module) {    
    var c = require('c');
    console.log('b1');
    module.exports = function() {
        console.log('b2');
        c();
    };

});

steel.d('a', ['bddd/sfs', 'b'], function(require, exports, module) {
    console.log('a');
    var b = require('bddd/sfs');
    var c = require('c');
    b();
});