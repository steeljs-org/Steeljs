var STK = function() {
    var that = {};
    var errorList = [];
    that.inc = function(ns, undepended) {
        return true;
    };
    that.register = function(ns, maker) {
        var NSList = ns.split(".");
        var step = that;
        var k = null;
        while (k = NSList.shift()) {
            if (NSList.length) {
                if (step[k] === undefined) {
                    step[k] = {};
                }
                step = step[k];
            } else {
                if (step[k] === undefined) {
                    try {
                        step[k] = maker(that);
                    } catch (exp) {
                        errorList.push(exp);
                    }
                }
            }
        }
    };
    that.regShort = function(sname, sfun) {
        if (that[sname] !== undefined) {
            throw "[" + sname + "] : short : has been register";
        }
        that[sname] = sfun;
    };
    that.IE = /msie/i.test(navigator.userAgent);
    that.E = function(id) {
        if (typeof id === "string") {
            return document.getElementById(id);
        } else {
            return id;
        }
    };
    that.C = function(tagName) {
        var dom;
        tagName = tagName.toUpperCase();
        if (tagName == "TEXT") {
            dom = document.createTextNode("");
        } else if (tagName == "BUFFER") {
            dom = document.createDocumentFragment();
        } else {
            dom = document.createElement(tagName);
        }
        return dom;
    };
    that.log = function(str) {
        errorList.push("[" + (new Date).getTime() % 1e5 + "]: " + str);
    };
    that.getErrorLogInformationList = function(n) {
        return errorList.splice(0, n || errorList.length);
    };
    return that;
}();

$Import = STK.inc;

STK.register("core.io.getXHR", function($) {
    return function() {
        var _XHR = false;
        try {
            _XHR = new XMLHttpRequest;
        } catch (try_MS) {
            try {
                _XHR = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (other_MS) {
                try {
                    _XHR = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (failed) {
                    _XHR = false;
                }
            }
        }
        return _XHR;
    };
});;


STK.register("core.obj.parseParam", function($) {
    return function(oSource, oParams, isown) {
        var key, obj = {};
        oParams = oParams || {};
        for (key in oSource) {
            obj[key] = oSource[key];
            if (oParams[key] != null) {
                if (isown) {
                    if (oSource.hasOwnProperty[key]) {
                        obj[key] = oParams[key];
                    }
                } else {
                    obj[key] = oParams[key];
                }
            }
        }
        return obj;
    };
});;




STK.register("core.str.parseURL", function($) {
    return function(url) {
        var parse_url = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        var names = [ "url", "scheme", "slash", "host", "port", "path", "query", "hash" ];
        var results = parse_url.exec(url);
        console.log('stk result: ' + results);
        var that = {};
        for (var i = 0, len = names.length; i < len; i += 1) {
            that[names[i]] = results[i] || "";
        }
        return that;
    };
});;


STK.register("core.arr.isArray", function($) {
    return function(o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    };
});;


STK.register("core.str.trim", function($) {
    return function(str) {
        if (typeof str !== "string") {
            throw "trim need a string as parameter";
        }
        var len = str.length;
        var s = 0;
        var reg = /(\u3000|\s|\t|\u00A0)/;
        while (s < len) {
            if (!reg.test(str.charAt(s))) {
                break;
            }
            s += 1;
        }
        while (len > s) {
            if (!reg.test(str.charAt(len - 1))) {
                break;
            }
            len -= 1;
        }
        return str.slice(s, len);
    };
});;


STK.register("core.json.queryToJson", function($) {
    return function(QS, isDecode) {
        var _Qlist = $.core.str.trim(QS).split("&");
        var _json = {};
        var _fData = function(data) {
            if (isDecode) {
                return decodeURIComponent(data);
            } else {
                return data;
            }
        };
        for (var i = 0, len = _Qlist.length; i < len; i++) {
            if (_Qlist[i]) {
                var _hsh = _Qlist[i].split("=");
                var _key = _hsh[0];
                var _value = _hsh[1];
                if (_hsh.length < 2) {
                    _value = _key;
                    _key = "$nullName";
                }
                if (!_json[_key]) {
                    _json[_key] = _fData(_value);
                } else {
                    if ($.core.arr.isArray(_json[_key]) != true) {
                        _json[_key] = [ _json[_key] ];
                    }
                    _json[_key].push(_fData(_value));
                }
            }
        }
        return _json;
    };
});;




STK.register("core.json.jsonToQuery", function($) {
    var _fdata = function(data, isEncode) {
        data = data == null ? "" : data;
        data = $.core.str.trim(data.toString());
        if (isEncode) {
            return encodeURIComponent(data);
        } else {
            return data;
        }
    };
    return function(JSON, isEncode) {
        var _Qstring = [];
        if (typeof JSON == "object") {
            for (var k in JSON) {
                if (k === "$nullName") {
                    _Qstring = _Qstring.concat(JSON[k]);
                    continue;
                }
                if (JSON[k] instanceof Array) {
                    for (var i = 0, len = JSON[k].length; i < len; i++) {
                        _Qstring.push(k + "=" + _fdata(JSON[k][i], isEncode));
                    }
                } else {
                    if (typeof JSON[k] != "function") {
                        _Qstring.push(k + "=" + _fdata(JSON[k], isEncode));
                    }
                }
            }
        }
        if (_Qstring.length) {
            return _Qstring.join("&");
        } else {
            return "";
        }
    };
});;


STK.register("core.util.URL", function($) {
    return function(sURL, args) {
        var opts = $.core.obj.parseParam({
            isEncodeQuery: false,
            isEncodeHash: false
        }, args || {});
        var that = {};
        var url_json = $.core.str.parseURL(sURL);
        var query_json = $.core.json.queryToJson(url_json.query);
        var hash_json = $.core.json.queryToJson(url_json.hash);
        that.setParam = function(sKey, sValue) {
            query_json[sKey] = sValue;
            return this;
        };
        that.getParam = function(sKey) {
            return query_json[sKey];
        };
        that.setParams = function(oJson) {
            for (var key in oJson) {
                that.setParam(key, oJson[key]);
            }
            return this;
        };
        that.setHash = function(sKey, sValue) {
            hash_json[sKey] = sValue;
            return this;
        };
        that.getHash = function(sKey) {
            return hash_json[sKey];
        };
        that.valueOf = that.toString = function() {
            var url = [];
            var query = $.core.json.jsonToQuery(query_json, opts.isEncodeQuery);
            var hash = $.core.json.jsonToQuery(hash_json, opts.isEncodeQuery);
            if (url_json.scheme != "") {
                url.push(url_json.scheme + ":");
                url.push(url_json.slash);
            }
            if (url_json.host != "") {
                url.push(url_json.host);
                if (url_json.port != "") {
                    url.push(":");
                    url.push(url_json.port);
                }
            }
            url.push("/");
            url.push(url_json.path);
            if (query != "") {
                url.push("?" + query);
            }
            if (hash != "") {
                url.push("#" + hash);
            }
            return url.join("");
        };
        return that;
    };
});;




STK.register("core.func.empty", function() {
    return function() {};
});;


STK.register("core.io.ajax", function($) {
    return function(oOpts) {
        var opts = $.core.obj.parseParam({
            url: "",
            charset: "UTF-8",
            timeout: 30 * 1e3,
            args: {},
            onComplete: null,
            onTimeout: $.core.func.empty,
            uniqueID: null,
            onFail: $.core.func.empty,
            method: "get",
            asynchronous: true,
            header: {},
            isEncode: false,
            responseType: "json"
        }, oOpts);
        if (opts.url == "") {
            throw "ajax need url in parameters object";
        }
        var tm;
        var trans = $.core.io.getXHR();
        var cback = function() {
            if (trans.readyState == 4) {
                clearTimeout(tm);
                var data = "";
                if (opts["responseType"] === "xml") {
                    data = trans.responseXML;
                } else if (opts["responseType"] === "text") {
                    data = trans.responseText;
                } else {
                    try {
                        if (trans.responseText && typeof trans.responseText === "string") {
                            data = eval("(" + trans.responseText + ")");
                        } else {
                            data = {};
                        }
                    } catch (exp) {
                        data = opts["url"] + "return error : data error";
                    }
                }
                if (trans.status == 200) {
                    if (opts["onComplete"] != null) {
                        opts["onComplete"](data);
                    }
                } else if (trans.status == 0) {} else {
                    if (opts["onFail"] != null) {
                        opts["onFail"](data, trans);
                    }
                }
            } else {
                if (opts["onTraning"] != null) {
                    opts["onTraning"](trans);
                }
            }
        };
        trans.onreadystatechange = cback;
        if (!opts["header"]["Content-Type"]) {
            opts["header"]["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if (!opts["header"]["X-Requested-With"]) {
            opts["header"]["X-Requested-With"] = "XMLHttpRequest";
        }
        if (opts["method"].toLocaleLowerCase() == "get") {
            var url = $.core.util.URL(opts["url"], {
                isEncodeQuery: opts["isEncode"]
            });
            url.setParams(opts["args"]);
            url.setParam("__rnd", (new Date).valueOf());
            trans.open(opts["method"], url, opts["asynchronous"]);
            try {
                for (var k in opts["header"]) {
                    trans.setRequestHeader(k, opts["header"][k]);
                }
            } catch (exp) {}
            trans.send("");
        } else {
            trans.open(opts["method"], opts["url"], opts["asynchronous"]);
            try {
                for (var k in opts["header"]) {
                    trans.setRequestHeader(k, opts["header"][k]);
                }
            } catch (exp) {}
            trans.send($.core.json.jsonToQuery(opts["args"], opts["isEncode"]));
        }
        if (opts["timeout"]) {
            tm = setTimeout(function() {
                try {
                    trans.abort();
                } catch (exp) {}
                opts["onTimeout"]({}, trans);
                opts["onFail"](data, trans);
            }, opts["timeout"]);
        }
        return trans;
    };
});