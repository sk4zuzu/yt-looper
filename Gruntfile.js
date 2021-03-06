module.exports = function(grunt) {
  var nightwatch = require('nightwatch');
  nightwatch.initGrunt(grunt);


  grunt.initConfig({
    connect: {
      server: {
        options: {
          hostname: 'yt.127.0.0.1.xip.io',
          port: 28080,
          base: '.'
        },
      },
    },
    nightwatch: {
      options: {
        cwd: './test/'
      },
      'default': {},
      'firefox': {
        argv: {
          env: 'firefox',
        },
      },
      'chrome': {
        argv: {
          env: 'chrome',
        },
      },
      'phantomjs': {
        argv: {
          env: 'phantomjs',
        },
      },
      'all': {
        argv: {
          env: 'firefox,chrome,phantomjs',
        },
      }
    },
    qunit: {
      files: ['test/headless/index.html'],
      options: {
        timeout: 30000,
      }
    },
    purifycss: {
      options: {},
      target: {
        src: ['*.html', 'yt-looper*.js'],
        css: ['*.css'],
        dest: 'pure_style.css'
      },
    },
    jshint: {
      all: ['*.js', 'test/**/*.js'],
      options: {
        'jquery': true,
        'quotmark': 'single',
        'white': true,
        'indent': 2,
        'latedef': true,
        'unused': true,
        '-W014': true, // ignore [W014] Bad line breaking
        '-W097': true, // global strict
        'predef':[
          'jQuery',
          'window',
          'console',
          'document',
          '$LAB',
          '$',
          '_',
          ],
      },
    },
    env: {
      options: {
        concat: {
          PATH: {
            'value': 'node_modules/.bin',
            'delimiter': ':'
          },
        },
      },
      test: {
        options: {
          concat: {
            PATH: {
              'value': '../node_modules/.bin',
              'delimiter': ':'
            },
          },
        },
      },
    },
  });

  grunt.registerTask('selenium', 'Download Selenium Standalone Server', function() {
    var done = this.async();
    var selenium = require('selenium-standalone');

    selenium.install({
      version: '2.47.1',
      baseURL: 'http://selenium-release.storage.googleapis.com',
      drivers: {
        chrome: {
          version: '2.18',
          arch: process.arch,
          baseURL: 'http://chromedriver.storage.googleapis.com'
        }
      },

      logger: function(message) {
        grunt.verbose.writeln(message);
      },

      progressCb: function(total, progress, chunk) { /*jshint ignore:line*/
        grunt.log.write('\rDownloading Selenium.. '+Math.round(progress/total*100)+'%');
      }

    }, done);

  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-purifycss');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', 'test');
  grunt.registerTask('common',  ['env', 'jshint', 'qunit', 'env:test', 'connect', 'selenium']);

  grunt.registerTask('test',    ['common', 'nightwatch:phantomjs']);
  grunt.registerTask('firefox', ['common', 'nightwatch:firefox']);
  grunt.registerTask('chrome',  ['common', 'nightwatch:chrome']);


  grunt.registerTask('httpd', 'connect:server:keepalive');


};
// vim:ts=2:sw=2:et:
