/**
 * 异步调用方法 
 */
function core_asyncCall(fn, args) {
    setTimeout(function() {
        fn.apply(undefined, args);
    });
}
