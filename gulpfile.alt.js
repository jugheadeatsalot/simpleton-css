const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const files = {
    scssPath: 'simpleton/scss/**/*.scss',
    jsPath: 'simpleton/js/**/*.js',
};

const sassOpts = {
    errLogToConsole: true,
    outputStyle: 'expanded',
};

function scssTask() {
    return gulp
        .src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass(sassOpts).on('error', sass.logError)) // compile SCSS to CSS
        .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(gulp.dest('dist/css')); // put final CSS in dist folder
}

function jsTask() {
    return gulp
        .src([files.jsPath])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
}

function watchTask() {
    gulp.watch([files.scssPath, files.jsPath], gulp.parallel(scssTask, jsTask));
}

exports.default = gulp.series(gulp.parallel(scssTask, jsTask), watchTask);