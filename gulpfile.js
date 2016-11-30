var gulp = require("gulp");
var babel = require("gulp-babel");
var watch = require('gulp-watch');

/*gulp.task("watch", ["default"], function() {
  
});*/

gulp.task("default", function () {
  return gulp.src("src/app.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});
