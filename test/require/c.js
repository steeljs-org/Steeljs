steel.d('c', function(require, exports, module) {
    console.log('c1');
    module.exports = function() {
        console.log('c2');
    };

});