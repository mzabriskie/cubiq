/*global module:false*/
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({
		jshint: {
			all: ['Gruntfile.js', 'src/cubiq.js']
		},
		qunit: {
			all: ['test/qunit.html']
		},
        uglify: {
            main: {
                files: {
                    'dist/cubiq.min.js': ['src/cubiq.js']
                }
            }
        },
        copy: {
            main: {
                files: [
                    {src: 'src/cubiq.js', dest: 'dist/', expand: true, flatten: true}
                ]
            }
        }
	});

	grunt.registerTask('test', ['jshint', 'qunit']);
	grunt.registerTask('default', ['test', 'publish']);
    grunt.registerTask('publish', ['uglify', 'copy']);
};
