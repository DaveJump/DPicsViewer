var gulp = require('gulp');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');

gulp.task('dist',function(){
  var jsMin = gulp.src('src/scripts/DPicsViewer.js');
  var cssMin = gulp.src('src/styles/DPicsViewer.css');

  jsMin.pipe(uglify()).pipe(gulp.dest('dist'));
  cssMin.pipe(csso()).pipe(gulp.dest('dist'));

  return [jsMin,cssMin];
});

gulp.task('build',function(){
  var jsFilter = filter('**/*.js',{restore: true});
  var cssFilter = filter('**/*.css',{restore: true});
  var revFilter = filter(['**/*','!**/index.html'],{restore: true});

  return gulp.src('src/index.html')
    .pipe(useref())
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(csso())
    .pipe(cssFilter.restore)
    .pipe(revFilter)
    .pipe(rev())
    .pipe(revFilter.restore)
    .pipe(revReplace())
    .pipe(gulp.dest('demo'));
});

gulp.task('default',['build','dist']);
