'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var ghPages = require('gulp-gh-pages');


gulp.task('deploy', function() {
  return gulp.src('./*').pipe(ghPages());
});

gulp.task('watch', function() {
  return gulp.watch([
    './snake.js',
    './index.html'
  ]).on('change', function(file) {
    gulp.src(file.path).pipe(connect.reload());
  });
});

gulp.task('serve', function() {
  connect.server({
    root: ['.'],
    port: 5000,
    livereload: true,
    fallback: 'index.html'
  });
});


gulp.task('default', ['watch', 'serve']);
