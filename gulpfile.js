const gulp = require('gulp');
const sass = require('gulp-sass');
const filter = require('gulp-filter');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const paths = {
    js: ['simpleton/js/**/*.js'],
    jsOut: 'dist/js',
    scss: ['simpleton/scss/**/*.scss'],
    scssOut: 'dist/css',
};

const sassOpts = {
    errLogToConsole: true,
    outputStyle: 'expanded',
};

gulp.task('sass', () => {
    return gulp
        .src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOpts).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.scssOut))
        .pipe(filter('**/*.css'))
        .pipe(postcss([cssnano()]))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.scssOut));
});

gulp.task('js', () => {
    return gulp
        .src(paths.js)
        .pipe(concat('simpleton.js'))
        .pipe(gulp.dest(paths.jsOut))
        .pipe(filter('**/*.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(gulp.dest(paths.jsOut));
});

gulp.task('watch', () => {
    const msg = path => {
        console.log(`File ${path} was changed. Running tasks...`);
    };

    return gulp.watch([...paths.scss, ...paths.js], gulp.parallel('sass', 'js')).on('change', msg);
});

gulp.task('default', gulp.series(gulp.parallel('sass', 'js'), 'watch'));