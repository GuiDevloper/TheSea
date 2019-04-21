var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var header = require('gulp-header');

/* Variaveis */
// Origem do Sass
var sassFile = 'src/sea.scss';

gulp.task('sass', function() {
  return gulp.src(sassFile)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('sea.css'))
    .pipe(autoprefixer({
      browsers: ['> 0.2%', 'last 10 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', function () {
  return gulp.src('src/sea.js')
    .pipe(uglify())
    .pipe(header(`
      import {
        getByClass,
        getByTag,
        setStyle,
        getLength,
        Ajax
      } from 'https://cdn.jsdelivr.net/npm/minimalista@1.0.0/index.min.js';

      `)
    )
    .pipe(gulp.dest('dist'))
});

gulp.task('build', gulp.series('sass', 'minify'));

// Vigia Global
gulp.task('watch', function() {
  gulp.watch(sassFile, 'sass');
});
