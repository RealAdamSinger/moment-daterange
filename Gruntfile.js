module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-es6-transpiler');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-umd');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    es6transpiler: {
      options: {
        environments: ['node', 'browser'],
        globals: {
          'moment': true
        }
      },
      dist: {
        files: {
          'dist/moment-daterange.js': 'lib/moment-daterange.js'
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    replace: {
      example: {
        src: ['dist/moment-daterange.js'],
        dest: 'dist/moment-daterange.js',
        replacements: [{
          from: 'var moment = require(\'moment\');',
          to: ''
        },
        {
          from: 'module.exports = DateRange;',
          to: ''
        }]
      }
    },

    uglify: {
      'moment-daterange': {
        files: {
          'dist/moment-daterange.min.js': ['dist/moment-daterange.js']
        }
      }
    },

    umd: {
      all: {
        src: 'dist/moment-daterange.js',
        dest: 'dist/moment-daterange.js',
        globalAlias: 'DateRange',
        objectToExport: 'DateRange',
        deps: {
          default: ['moment']
        }
      }
    }
  });

  grunt.registerTask('default', ['es6transpiler', 'replace', 'umd', 'uglify', 'mochaTest']);
};
