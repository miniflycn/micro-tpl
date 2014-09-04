var gulp = require('gulp')
  , jscs = require('gulp-jscs');

gulp.task('default', function () {
  return gulp.src('index.js')
    .pipe(jscs());
});