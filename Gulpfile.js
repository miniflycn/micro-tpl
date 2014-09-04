var gulp = require('gulp')
  , jscs = require('gulp-jscs');

gulp.task('default', function () {
  return gulp.src(['index.js', './lib/**/*.js'])
    .pipe(jscs());
});