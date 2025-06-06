"use strict";

var _require = require('gulp'),
    src = _require.src,
    dest = _require.dest,
    series = _require.series,
    parallel = _require.parallel,
    watch = _require.watch;

var sass = require('gulp-sass')(require('sass'));

var pug = require('gulp-pug');

var svgSprite = require('gulp-svg-sprite');

var concat = require('gulp-concat');

var path = require('path'); // Пути


var paths = {
  pug: {
    src: 'app/pug/**/*.pug',
    dest: 'build'
  },
  styles: {
    src: 'app/scss/**/*.scss',
    dest: 'build/css'
  },
  svg: {
    src: 'app/icons/*.svg',
    dest: 'build/img'
  }
}; // Компиляция Pug

function compilePug() {
  return src(paths.pug.src).pipe(pug({
    pretty: true
  })).pipe(dest(paths.pug.dest));
} // Компиляция SASS


function compileSass() {
  return src(paths.styles.src).pipe(sass().on('error', sass.logError)).pipe(dest(paths.styles.dest));
} // SVG спрайт


function svgSprites() {
  return src(paths.svg.src).pipe(svgSprite({
    mode: {
      symbol: {
        sprite: "../sprite.svg"
      }
    }
  })).pipe(dest(paths.svg.dest));
}

function fonts() {
  return src('app/fonts/**/*.{woff,woff2,ttf}').pipe(dest('build/fonts'));
} // Объединение CSS (например, если хочешь собрать все стили в один файл)


function concatCss() {
  return src(['node_modules/bootstrap/dist/css/bootstrap.min.css', 'build/css/*.css']).pipe(concat('bundle.css')).pipe(dest('build/css'));
} // Слежение за файлами


function watcher() {
  watch(paths.pug.src, compilePug);
  watch(paths.styles.src, compileSass);
  watch(paths.svg.src, svgSprites);
}

exports["default"] = series(parallel(compilePug, compileSass, svgSprites, fonts), concatCss, watcher);