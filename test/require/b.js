steel.d('b', ['c'], function(require, exports, module) {    
    var c = require('c');
    console.log('b1');
    module.exports = function() {
        console.log('b2');
        c();
    };
});