/**
 * 公共对象方法定义文件
 */
//import require/global
//import core/uniqueKey
//import router/router

//control容器
var render_base_controlCache = {};
//controllerNs容器
var render_base_controllerNs = {};
//资源容器
var render_base_resContainer = {};
//渲染相关通知事件的前缀
var render_base_notice_prefix = '-steel-render-';


//sessionStorage级别 是否使用state缓存模块的数据内容
var render_base_dataCache_usable = false;

//场景相关配置
//场景最大个数
var render_base_stage_maxLength = 10;
//是否启用场景管理
var render_base_stage_usable = false;
//内存级：是否在浏览器中内存缓存启用了场景的页面内容，缓存后页面将由开发者主动刷新
var render_base_stageCache_usable = false;
//是否支持场景切换
var render_base_stageChange_usable = false;
//场景默认显示内容
var render_base_stageDefaultHTML = '';
////
//是否添加模块父样式
var render_base_useCssPrefix_usable = false;
//是否启用进度条
var render_base_loadingBar_usable = false;

//boxid生成器 当参数为true时要求：1.必须唯一 2.同一页面同一模块的id必须是固定的
function render_base_idMaker(supId) {
    return core_uniqueKey();
}