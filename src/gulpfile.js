const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

function buildCSS() {
  return src('scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer())
    // .pipe(sourcemaps.write('./maps'))
    .pipe(dest('../dist/css'))
}

function watchSCSS(){
  watch(['scss/**/*.scss'], buildCSS)
}

exports.default = series(buildCSS, watchSCSS);
