var jsp = require('./uglify-js').parser;
var pro = require('./uglify-js').uglify;

module.exports = function( code, beautify, mangle ) {
    var ast;
    try {
        ast = jsp.parse( code );
    } catch ( exp ) {
        throw exp.message;
    }
	if (mangle) {
		ast = pro.ast_mangle( ast );
		ast = pro.ast_squeeze(ast,{
			make_seqs   : false,
			dead_code   : true,
			keep_comps  : true,
			no_warnings : false
		});
	}
    if ( beautify ) {
        return pro.gen_code( ast, {
            'beautify': true
        } );
    } else {
        return pro.gen_code( ast );
    }
}

