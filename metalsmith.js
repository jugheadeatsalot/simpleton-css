const Metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const permalinks = require('metalsmith-permalinks');
const encode = require('metalsmith-encode-html');
const ignore = require('metalsmith-ignore');
const watch = require('metalsmith-watch');
const beautify = require('metalsmith-beautify');
const assets = require('metalsmith-static');

const {dirs, sassVars, files} = require('./meta');

const isProduction = process.env.NODE_ENV === 'production';

const metalsmith = Metalsmith(__dirname)
    .metadata({
        version: new Date().getTime(),
        title: 'Simpleton CSS',
        description: 'Just a simple CSS starter.',
        isProduction: isProduction,
        sassVars,
    })
    .clean(true)
    .source(dirs.metalsmithSrc)
    .destination(isProduction ? dirs.docs : dirs.docsDev)
    .use(inPlace({
        suppressNoFilesError: true,
    }))
    .use(layouts({
        directory: dirs.metalsmithLayouts,
        suppressNoFilesError: true,
    }))
    .use(markdown())
    .use(permalinks({
        relative: false,
    }))
    .use(encode())
    .use(beautify({
        'indent_size': 4,
        'indent_char': ' ',
        'indent_with_tabs': false,
        'eol': '\n',
        'end_with_newline': true,
        'preserve_newlines': false,
        js: false,
        css: false,
    }))
    .use(assets({
        src: dirs.dist,
        dest: 'assets', // Must be relative to source directory
    }));

if(!isProduction) {
    metalsmith.use(watch({
        paths: {
            '${source}/**/*': true,
            [files.timestamp]: '**/*',
            [`${dirs.metalsmithLayouts}/**/*`]: '**/*',
        },
        livereload: true,
    }));
}

metalsmith.build(err => {
    if(err) console.error(err);
});
