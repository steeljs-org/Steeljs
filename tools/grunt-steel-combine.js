/**
 * 合并js
*/
var path = require('path');
var combine = require('./lib/combine');

module.exports = function(grunt) {
    grunt.registerMultiTask('steel-combine', 'combine your js files', function() {
        this.files.forEach(function(file) {
            grunt.file.mkdir(file.dest);
            file.src.map(function(filePath) {
                var src = path.join(file.cwd, filePath);
                var result = combine(src, file.cwd);
                return grunt.file.write(file.dest + filePath, result);
            });
        });
    });
};