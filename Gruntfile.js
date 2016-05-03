/**
 * webapp grunt tools
 */

module.exports = function(grunt) {
	grunt.initConfig({
		'steel-combine': {
			'js': {
				'cwd': 'src/',
				'src': ['steel.js', 'steel-react.js','steel-react-lite.js'],
				'dest': 'dist/'
			}
		},
		uglify: {
			'js': {
				files: [{
					expand: true,
					'cwd': 'dist/',
					'src': ['**/*.js'],
					'dest': 'build/'
				}]
			}
		},
		copy: {
			toSteelHelloWorld: {
				expand: true,
				cwd: 'dist/',
				src: ['steel.js'],
				dest: '../SteelHelloWorld/src/js/lib/'
			}
		},
		watch: {
			options: {
				debounceDelay: 111 //
			},
			'default': {
				files: ['src/**/*.*'],
				tasks: ['default']
			}
		}
	});

	//自定义grunt task
	grunt.loadTasks('./tools');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['steel-combine','uglify']);
};
