module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: 'src/main.js',
        dest: 'build/main.js'
      }
    },
    sass: {
      dist: {
        options: {
          sourcemap: 'none',
          style: 'compressed'
        },
        files: {
          'build/main.css': 'src/main.sass'
        }
      }
    },
    comboall: {
      main: {
        files: [
          {'build/main.html': ['src/main.html']}
        ]
      }
    },
    clean: {
      contents: ['build/*', '!build/main.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-combo-html-css-js');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('default', ['uglify', 'sass', 'comboall', 'clean']);

};
