const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const filter = require('gulp-filter');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');

const scssIn = ['src/**/*.scss'];
const cssOut = 'dist/css';

const sassOpts = {
    errLogToConsole: true,
    outputStyle: 'expanded',
};

gulp.task('sass', function() {
    gulp
        .src(scssIn)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOpts).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(cssOut))
        .pipe(filter('**/*.css'))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(cssOut));
});

gulp.task('watch', function() {
    const msg = function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    };

    gulp.watch([scssIn], ['sass']).on('change', msg);
});

gulp.task('default', ['sass', 'watch']);