const fs = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const filter = require('gulp-filter');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const prettify = require('postcss-prettify');
const calc = require('postcss-calc');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const stripIndent = require('strip-indent');
const sassdoc = require('sassdoc');
const pluralize = require('pluralize');
const chalk = require('chalk');
const {spawn} = require('child_process');

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

const scssOpts = {
    errLogToConsole: true,
    outputStyle: 'expanded',
};

const postcssPlugins = [
    postcssPresetEnv(),
    calc(),
    prettify(),
];

const postcssErrorLogger = (error) => {
    console.error(chalk.red('POSTCSS ERROR -------'));
    console.error('Name: ', error.name);
    console.error('Message: ', error.message);
    console.error(chalk.red('---------------------'));
};

gulp.task('scss', async() => {
    await gulp
        .src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass(scssOpts).on('error', sass.logError))
        .pipe(postcss(postcssPlugins))
        .on('error', postcssErrorLogger)
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.scssOut))
        .pipe(filter('**/simpleton!(*.min).css'))
        .pipe(postcss([cssnano()]))
        .pipe(rename({suffix: '.min'}))
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
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.jsOut));
});

gulp.task('devscss', async() => {
    await gulp
        .src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass(scssOpts).on('error', sass.logError))
        .pipe(postcss(postcssPlugins))
        .on('error', postcssErrorLogger)
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.docsscssOut))
        .pipe(filter('**/simpleton!(*.min).css'))
        .pipe(postcss([cssnano()]))
        .pipe(rename({suffix: '.min'}))
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
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.docsjsOut));
});

gulp.task('docsscss', async() => {
    await gulp
        .src(paths.docsscss)
        .pipe(sourcemaps.init())
        .pipe(sass(scssOpts).on('error', sass.logError))
        .pipe(postcss(postcssPlugins))
        .on('error', postcssErrorLogger)
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(paths.docsscssOut))
        .pipe(filter('**/docs!(*.min).css'))
        .pipe(postcss([cssnano()]))
        .pipe(rename({suffix: '.min'}))
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
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.docsjsOut));
});

const processSassdocData = sassdocData => {
    const output = {};

    sassdocData.forEach(doc => {
        // Normalize indents and remove first leading line break
        if(typeof doc.context.code === 'string') {
            doc.context.code = stripIndent(doc.context.code.replace(/^\n/, ''));
        }

        // Normalize indents and remove first leading line break
        if(Array.isArray(doc.usedBy)) {
            doc.usedBy.forEach(user => {
                user.context.code = stripIndent(user.context.code.replace(/^\n/, ''));
            });
        }

        // Remove leading line break and wrap backticked strings in `<code>`
        if(typeof doc.description === 'string') {
            doc.description = doc.description
                .replace(/^\n/, '')
                .replace(/`(.*?)`/g, '<code>$1</code>');
        }

        // Remove duplicate requires
        if(Array.isArray(doc.require)) {
            doc.require = doc.require.filter((require, index, self) => {
                return index === self.findIndex((r) => (
                    r.type === require.type && r.name === require.name
                ));
            });
        }

        const type = pluralize(doc.context.type);

        // Create array if it doesn't exist
        if(!Array.isArray(output[type])) output[type] = [];

        // Push doc to output
        output[type].push(doc);
    });

    try {
        // Sort stuff by name
        // for(const key in output) {
        //     if(output.hasOwnProperty(key)) {
        //         output[key].sort((a, b) => (a.context.name > b.context.name) ? 1 : -1);
        //     }
        // }

        // And finally, write the json file
        fs.writeFileSync(files.sassdocjson, JSON.stringify(output, null, 2));

        console.log(chalk.green(`${files.sassdocjson} generated!!!`));
    } catch(err) {
        console.error(chalk.red(err));
    }
};

gulp.task('sassdoc', () => {
    return gulp
        .src(paths.scss)
        .pipe(sassdoc.parse())
        .on('data', processSassdocData);
});

gulp.task('devmetal', async() => {
    await spawn('node', ['metalsmith.js'], {stdio: 'inherit'});
});

gulp.task('devserve', async() => {
    await spawn('node', ['server.js'], {stdio: 'inherit'});
});

gulp.task('timestamp', async() => {
    await fs.writeFile(
        files.timestamp,
        new Date().getTime(),
        err => {
            if(err) console.error(chalk.red(err));
        },
    );
});

const doWatch = (glob, task) => {
    gulp.watch(glob, gulp.series(task, 'timestamp')).on('change', (filePath) => {
        console.log(`File ${filePath} changed. Working...`);
    });
};

gulp.task('watch', () => {
    doWatch(paths.scss, 'devscss');
    doWatch(paths.js, 'devjs');
    doWatch(paths.docsscss, 'docsscss');
    doWatch(paths.docsjs, 'docsjs');
});

gulp.task('default',
    gulp.series(
        'sassdoc',
        gulp.parallel('devscss', 'devjs', 'docsscss', 'docsjs'),
        'devmetal',
        'devserve',
        'watch',
    ),
);

gulp.task('build',
    gulp.series(
        'sassdoc',
        gulp.parallel('docsscss', 'docsjs'),
        gulp.parallel('scss', 'js'),
    ),
);
