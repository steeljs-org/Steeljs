var fs = require( 'fs' );

function listIt( inStr, minLength, minNum ) {
  minNum = minNum || 1;
  var map = {}, list = [];
  inStr.replace(new RegExp( '\\b(\\w{' + minLength + ',})\\b', 'g' ), function(_, key) {
    if ( !map[ key ] ) {
      map[ key ] = true;
      var length = inStr.split(new RegExp( '\\b' + key + '\\b' )).length - 1;
      if ( length >= minNum ) {
        ( list[ length ] || ( list[ length ] = {} ) )[ key ] = true;
      }
    }
  });
  for ( var i = list.length; --i; ) {
    if ( list[ i ] ) {
      for ( var key in list[ i ] ) {
        console.log( key, i );
      }
    }
  }
}
module.exports = function() {
	code = combine( '../../weibo/FM_' + fileName + '.js' );
	listIt
}
