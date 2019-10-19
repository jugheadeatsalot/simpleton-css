const fs = require('fs');
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
const stripIndent = require('strip-indent');
const sassdoc = require('sassdoc');

const {dirs, files} = require('./meta');

const paths = {
    js: [`${dirs.simpletonJs}/**/*.js`],
    jsOut: `${dirs.dist}/js`,
    scss: [`${dirs.simpletonScss}/**/*.scss`],
    scssOut: `${dirs.dist}/css`,
    docsjs: [`${dirs.docsJs}/**/*.js`],
    docsjsOut: [`${dirs.docsAssets}/js`],
    docsscss: [`${dirs.docsScss}/**/*.scss`],
    docsscssOut: [`${dirs.docsAssets}/css`],
};

const sassOpts = {
    errLogToConsole: true,
    outputStyle: 'expanded',
};

gulp.task('sass', async() => {
    await gulp
        .src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOpts).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.scssOut))
        .pipe(filter('**/simpleton!(*.min).css'))
        .pipe(postcss([cssnano()]))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.scssOut));
});

gulp.task('js', async() => {
    await gulp
        .src(paths.js)
        .pipe(concat('simpleton.js'))
        .pipe(gulp.dest(paths.jsOut))
        .pipe(filter('**/simpleton!(*.min).js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(gulp.dest(paths.jsOut));
});

gulp.task('devsass', async() => {
    await gulp
        .src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOpts).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.docsscssOut))
        .pipe(filter('**/simpleton!(*.min).css'))
        .pipe(postcss([cssnano()]))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.docsscssOut));
});

gulp.task('devjs', async() => {
    await gulp
        .src(paths.js)
        .pipe(concat('simpleton.js'))
        .pipe(gulp.dest(paths.docsjsOut))
        .pipe(filter('**/simpleton!(*.min).js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(gulp.dest(paths.docsjsOut));
});

gulp.task('docssass', async() => {
    await gulp
        .src(paths.docsscss)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOpts).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.docsscssOut))
        .pipe(filter('**/docs!(*.min).css'))
        .pipe(postcss([cssnano()]))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.docsscssOut));
});

gulp.task('docsjs', async() => {
    await gulp
        .src(paths.docsjs)
        .pipe(concat('docs.js'))
        .pipe(gulp.dest(paths.docsjsOut))
        .pipe(filter('**/docs!(*.min).js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(gulp.dest(paths.docsjsOut));
});

gulp.task('sassdoc', function() {
    return gulp
        .src(paths.scss)
        .pipe(sassdoc.parse())
        .on('data', async(data) => {
            data.forEach(val => {
                if(typeof val.context.code === 'string') {
                    val.context.code = stripIndent(val.context.code.replace(/^\n/, ''));
                }
            });

            data.sort((a, b) => {
                let aGrp = a.group[0].toUpperCase();
                let bGrp = b.group[0].toUpperCase();
                let aTyp = a.context.type.toUpperCase();
                let bTyp = b.context.type.toUpperCase();
                let aNme = a.context.name.toUpperCase();
                let bNme = b.context.name.toUpperCase();

                if(aGrp > bGrp) return 1;
                if(aGrp < bGrp) return -1;

                if(aTyp > bTyp) return 1;
                if(aTyp < bTyp) return -1;

                if(aNme > bNme) return 1;
                if(aNme < bNme) return -1;
            });

            await fs.writeFile(
                files.sassdocjson,
                JSON.stringify(data, null, 2),
                err => {
                    if(err) console.log(err);
                },
            );
        });
});

gulp.task('timestamp', async() => {
    await fs.writeFile(
        files.timestamp,
        new Date().getTime(),
        err => {
            if(err) console.log(err);
        },
    );
});

function doWatch(glob, task) {
    const msg = (filePath) => {
        console.log(`File ${filePath} changed. Working...`);
    };

    gulp.watch(glob, gulp.series(task, 'timestamp')).on('change', msg);
}

gulp.task('watch', () => {
    doWatch(paths.scss, 'devsass');
    doWatch(paths.js, 'devjs');
    doWatch(paths.docsscss, 'docssass');
    doWatch(paths.docsjs, 'docsjs');
});

gulp.task('default',
    gulp.series(
        'sassdoc',
        gulp.parallel('devsass', 'devjs', 'docssass', 'docsjs'),
        'timestamp',
        'watch',
    ),
);

gulp.task('build',
    gulp.series(
        'sassdoc',
        gulp.parallel('devsass', 'devjs', 'docssass', 'docsjs'),
        gulp.parallel('sass', 'js'),
    ),
);
