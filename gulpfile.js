const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');

function buildCSS() {
  return src('./src/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer())
    .pipe(dest('./dist/css'))
}

function watchSCSS(){
  watch(['./src/scss/**/*.scss'], buildCSS)
}

exports.default = series(buildCSS, watchSCSS);