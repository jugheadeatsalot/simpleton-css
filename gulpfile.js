var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var filter = require('gulp-filter');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');

var scssIn = ['src/**/*.scss'];
var cssOut = 'dist/css';

var sassOpts = {
    errLogToConsole: true,
    outputStyle: 'expanded'
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
    var msg = function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    };

    gulp.watch([scssIn], ['sass']).on('change', msg);
});

gulp.task('default', ['sass', 'watch']);