var fs = require( 'fs' );
var path = require( 'path' );
var combine = require( './lib/combine' );
var uglifyJs = require( './lib/uglify' );

var buildPath = require( './lib/buildPath' )( process.argv[ 1 ] );
var combinedPath = path.join( buildPath, '../dist/' );

if ( !path.existsSync( combinedPath ) ) {
	fs.mkdirSync( combinedPath );
}

var code, filePath;
var filePathArr = [ 'steel'];//'small',  'big', 'history', 'small_Config', 

for ( var i = 0, len = filePathArr.length; i < len; ++i ) {
	filePath = filePathArr[ i ];
	code = combine( path.join( buildPath, '../src/' + filePath + '.js' ) );
	//写合并后的文件
	fs.writeFileSync( path.join( combinedPath, './' + filePath + '.js' ), code );
//	fs.writeFileSync( path.join( combinedPath, './' + filePath + '_oneline.js' ), uglifyJs( code, false, false ) );
	//写压缩后的文件
//	fs.writeFileSync( path.join( combinedPath, './' + filePath + '_mini_beautify.js' ), uglifyJs( code, true, true ) );
	fs.writeFileSync( path.join( combinedPath, './' + filePath + '_mini.js' ), uglifyJs( code, false, true ) );
	console.log( filePath, 'done!' );
}

