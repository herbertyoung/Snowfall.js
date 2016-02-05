module.exports = function(grunt){
  grunt.initConfig({
    uglify: {
      dist: {
        src: 'src/snowfall.js',
        dest: 'js/snowfall.min.js'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.registerTask('default', ['uglify']);
}