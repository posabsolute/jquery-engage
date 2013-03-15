module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'js/jquery.engage.js',
                'js/contents/*.js'
            ]
        },
        concat : {
            options: {
              separator: ''
            },
            dist: {
              src: ['js/jquery.engage.js', 'js/contents/*.js'],
              dest: 'js/dist/jquery.engage.full.js'
            }
        },
        uglify: {
            target: {
              files: {
                'js/dist/jquery.engage.min.js': ['js/jquery.engage.js', 'js/contents/*.js']
            }
        }
  }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', [
        'jshint',
        'concat',
        'uglify'
    ]);

    grunt.registerTask('default', ['build']);

};