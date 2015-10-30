
/**
 * @id core_object_merge
 * @param {Object} origin
 * @param {Object} cover
 * @return {Object} opts{isDeep:true/false}
 * @example
 * var j1 = {'a':1,'b':2,'c':3};
 * var j2 = {'a':2,'d':4};
 * var mJson = core_object_merge(j1, j2);
 */

// import("core.array.inArray");
// import("core.array.isArray");
// import("core.dom.isNode");
// import("core.object.parseParam");

var core_object_checkCell = function(obj) {
    if(obj === undefined){
        return true;
    }
    if(obj === null){
        return true;
    }
    if(core_array_inArray( (typeof obj), ['number','string','function','boolean'])){
        return true;
    }
    if(core_dom_isNode(obj)){
        return true;
    }
    return false;
};
var core_object_deep = function(ret, key, coverItem) {
    if(core_object_checkCell(coverItem)){
        ret[key] = coverItem;
        return;
    }
    if(core_array_isArray(coverItem)){
        if(!core_array_isArray(ret[key])){
            ret[key] = [];
        }
        for(var i = 0, len = coverItem.length; i < len; i += 1){
            core_object_deep(ret[key], i, coverItem[i]);
        }
        return;
    }
    if(typeof coverItem === 'object'){
        if(core_object_checkCell(ret[key]) || core_array_isArray(ret[key])){
            ret[key] = {};
        }
        for(var k in coverItem){
            core_object_deep(ret[key], k, coverItem[k]);
        }
        return;
    }
};

var core_object_mergeBase = function(origin, cover, isDeep) {
    var ret = {};
    if(isDeep){
        for(var k in origin){
            core_object_deep(ret, k, origin[k]);
        }
        for(var k in cover){
            core_object_deep(ret, k, cover[k]);
        }
    }else{
        for(var k in origin){
            ret[k] = origin[k];
        }
        for(var k in cover){
            ret[k] = cover[k];
        }
    }
    return ret;
};

function core_object_merge(origin, cover, opts) {
    var conf = core_object_parseParam({
        'isDeep' : false
    }, opts);
    
    return core_object_mergeBase(origin, cover, conf.isDeep);
};