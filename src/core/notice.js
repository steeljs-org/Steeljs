//import ./uniqueID
//import ./array/indexOf

var core_notice_data_SLKey = '_N';
var core_notice_data = steel[ core_notice_data_SLKey ] = steel[ core_notice_data_SLKey ] || {};

/*
 * 对缓存的检索
 * @method core_notice_find
 */
function core_notice_find( type ) {
	return core_notice_data[ type ] || ( core_notice_data[ type ] = [] );
}

/*
 * 添加事件
 * @method core_notice_on
 * @param {string} type
 * @param {Function} fn
 */
function core_notice_on( type, fn ) {
	core_notice_find( type ).unshift( fn );
}

/*
 * 移除事件
 * @method core_notice_off
 * @param {string} type
 * @param {Function} fn
 */
function core_notice_off( type, fn ) {
	var typeArray = core_notice_find( type ),
		index,
		spliceLength = 0;
	if ( fn ) {
		if ( ( index = core_array_indexOf( fn, typeArray ) ) > -1 ) {
			spliceLength = 1;
		}
	} else {
		index = 0;
		spliceLength = typeArray.length;
	}
	spliceLength && typeArray.splice( index, spliceLength );
}

/*
 * 事件触发
 * @method core_notice_trigger
 * @param {string} type
 * @param {Array} args
 */
function core_notice_trigger( type, args ) {
	var typeArray = core_notice_find( type );
	args = [].concat( args || [] );
	for ( var i = typeArray.length - 1; i > -1; i-- ) {
		try {
			typeArray[ i ] && typeArray[ i ].apply( undefined, args );
		} catch ( e ) {
			type != logNotice && core_notice_trigger( logNotice, ['[error][notice][' + type + ']', e] );
		}
	}
}
