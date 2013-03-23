/*global module:false*/

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        pkg: '<json:package.json>',

        // Code Quality

        jshint: {
            all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: false,
                boss: true,
                eqnull: true,
                browser: true,
                expr: true,
                es5:true
            },
            globals: {}
        },

        // Testing

        mochaTest: {
            unit: ['test/**/*.js']
        },
        mochaTestConfig: {
            unit: {
                options: {
                    reporter: 'spec'
                }
            }
        }
    });

    grunt.registerTask('ut', 'mochaTest:unit');
    grunt.registerTask('pre-commit', ['jshint', 'ut']);

};
