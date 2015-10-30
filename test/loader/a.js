/*steel.cssLoader('http://img.t.sinajs.cn/t6/style/css/module/base/frame.css?version=641923910ed7ed7f','js_style_css_module_base_frame', function(){
    console.log('css loaded!');
});*/
steel.ajax('/t4/enterprise/data/changeKeyword.html', function(data){
        console.log('ajax complete!');
        console.log(data);
    });
steel.jsLoader('http://weibo.com/jerryniepan/home?wvr=5&lf=reg', function(data){
    console.log('js loaded!');
});