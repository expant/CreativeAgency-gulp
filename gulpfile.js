const { src, dest, series, watch } = require('gulp');

const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const fonter = require('gulp-fonter');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync').create();

function html() {
    return src('src/html/**.html')
        .pipe(fileinclude({
            prefix: '@@'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('dist'));
}

function scss() {
    return src('src/scss/**/*.scss')
        .pipe(sass())    //.on('error', sass.logError)
        .pipe(autoprefixer({
            cascade: false
        }))
        //.pipe(csso())
        .pipe(concat('main.css'))
        .pipe(dest('dist'));
}

function font() {
   return src('src/assets/fonts/**.ttf')
    .pipe(fonter({
        //subset: [66, 67, 68, 69, 70, 71],
        formats: ['woff', 'ttf']
    }))
    .pipe(dest('dist/assets/fonts'))    
}

function img() {
    return src('src/assets/imgs/**')
        .pipe(imagemin())
        .pipe(dest('dist/assets/imgs'));
}

function svg() {
    return src('src/assets/icons/**')
        .pipe(imagemin())
        .pipe(dest('dist/assets/icons'));
}

function clear() {
    return del('dist');
}

function serve() {
    sync.init({
      server: './dist'  
    });

    watch('src/html/**.html', series(html))
        .on('change', sync.reload);

    watch('src/scss/**.scss', series(scss))
        .on('change', sync.reload);
}

exports.clear = clear;
exports.build = series(clear, scss, html, img, svg);
exports.serve = series(
    clear, 
    html, 
    scss, 
    font, 
    img, 
    svg, 
    serve
);