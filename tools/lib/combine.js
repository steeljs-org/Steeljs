var fs = require('fs');
var path = require('path');

function _import( jsPath, basePath, importMap, notimportMap, parentFile ) {
	if ( importMap[ jsPath ] ) {
		return '';
	}
	
	importMap[ jsPath ] = true;
	
	if ( !fs.existsSync( jsPath ) ) {
		throw new Error([jsPath, ' is not exist', parentFile ? 'in ' + parentFile : '', '!'].join(' '));
	}
	
	var jsStr = fs.readFileSync( jsPath, 'utf-8' );
	
	jsStr = jsStr.replace( /^(?:^|[^\/])\/\/notimport (.*)/g, function( _, importName ) {
		notimportMap[ realImportPath(importName) ] = true;
		return '';
	} );
	
	return jsStr.replace( /(?:^|[^\/])\/\/import (.*)/g, function( _, importName ) {
		var _jsPath = realImportPath(importName);
		console.log(importName, _jsPath);
		if ( notimportMap[ _jsPath ] ) {
			return '';
		} else {
			return _import( _jsPath, basePath, importMap, notimportMap, jsPath );
		}
	} ).replace(/(\n[\r \t]*)+(\n\r?)/g, '\n');
	
	function realImportPath(importName) {
		if (/^\./.test(importName)) {
			return path.join( path.dirname(jsPath), importName + '.js' );
		} else {
			return path.join( basePath, importName + '.js' );
		}
	}
}

module.exports = function(jsPath, basePath) {
	return _import ( jsPath, basePath, {}, {} );
};
